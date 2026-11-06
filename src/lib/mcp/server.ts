import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { catalogAgents, divisionIds, getCatalogAgent } from "@/lib/agent-catalog";
import { readAgentInstructions } from "@/lib/agent-instructions";
import { afterFailure, budgetState } from "@/lib/mcp/guardrails";
import { buildPrompt, serverInstructions } from "@/lib/mcp/instructions";
import { projectKinds } from "@/lib/project-kinds";

const projectId = z.string().uuid().describe("Project ID");
const agentName = z.string().min(1).max(100).describe("Display name of the agent making this call");
const memoryCategory = z.enum(["spec", "contracts", "decisions", "tasks"]);

function reply(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

function refuse(message: string) {
  return { content: [{ type: "text" as const, text: message }], isError: true };
}

function must<T>({ data, error }: { data: T; error: { message: string } | null }): T {
  if (error) throw new Error(error.message);
  return data;
}

function required<T>(result: { data: T; error: { message: string } | null }): NonNullable<T> {
  if (result.error) throw new Error(result.error.message);
  if (result.data === null || result.data === undefined) throw new Error("No data returned.");
  return result.data as NonNullable<T>;
}

function agentGroup(role: string, division: string | undefined) {
  if (role === "brain") return "orchestration";
  return division === "testing" ? "testing" : "development";
}

export function createMcpServer(supabase: SupabaseClient, userId: string) {
  const server = new McpServer({ name: "codeforge", version: "1.0.0" }, { instructions: serverInstructions });

  server.registerPrompt(
    "build",
    {
      title: "Build with Codeforge",
      description: "Plan and build a website, app, game, startup or other software, or continue a project by its ID.",
      argsSchema: { request: z.string().describe("What to build, or a project ID to continue") },
    },
    ({ request }) => ({
      messages: [{ role: "user", content: { type: "text", text: buildPrompt(request) } }],
    })
  );

  async function logEvent(project: string, agent: string, type: string, message: string) {
    must(await supabase.from("events").insert({ project_id: project, agent_name: agent, type, message }));
  }

  server.registerTool(
    "list_projects",
    { annotations: { readOnlyHint: true },
      description: "List the user's Codeforge projects with their type, phase and team." },
    async () =>
      reply(
        must(
          await supabase
            .from("projects")
            .select("id, name, description, kind, divisions, phase, phase_progress")
            .order("updated_at", { ascending: false })
        )
      )
  );

  server.registerTool(
    "create_project",
    {
      description: "Create a project on the user's dashboard. Call this first, then split the work with create_task.",
      inputSchema: {
        name: z.string().min(1).max(200),
        description: z.string().max(2000).default(""),
        kind: z.enum(projectKinds.map((kind) => kind.id) as [string, ...string[]]).default("anything"),
        divisions: z
          .array(z.enum(divisionIds as [string, ...string[]]))
          .default([])
          .describe("Agent catalog departments that form the team"),
      },
    },
    async ({ name, description, kind, divisions }) => {
      const project = required(
        await supabase
          .from("projects")
          .insert({ user_id: userId, name, description, kind, divisions })
          .select("id, name, kind, divisions")
          .single()
      );
      must(await supabase.from("budgets").insert({ project_id: project.id }));
      await logEvent(project.id, "Brain", "decision", `Created project: ${name}`);
      return reply(project);
    }
  );

  server.registerTool(
    "create_task",
    {
      description: "Add a task to a project. Only the Brain should create tasks. Leave assigned_to empty for any free agent.",
      inputSchema: {
        project_id: projectId,
        title: z.string().min(1).max(500),
        description: z.string().max(5000).default(""),
        assigned_to: agentName.optional(),
      },
    },
    async ({ project_id, title, description, assigned_to }) => {
      const task = must(
        await supabase
          .from("tasks")
          .insert({ project_id, title, description, assigned_to })
          .select("id, title, assigned_to, status")
          .single()
      );
      await logEvent(project_id, "Brain", "decision", `Planned task: ${title}`);
      return reply(task);
    }
  );

  server.registerTool(
    "get_task",
    {
      description: "Claim the next pending task for an agent. Returns previous errors when the task is being repaired.",
      inputSchema: { project_id: projectId, agent_name: agentName },
    },
    async ({ project_id, agent_name }) => {
      const pending = required(
        await supabase
          .from("tasks")
          .select("id, assigned_to")
          .eq("project_id", project_id)
          .eq("status", "pending")
          .order("created_at")
          .limit(100)
      );
      const next = pending.find((task) => !task.assigned_to || task.assigned_to === agent_name);
      if (!next) return reply({ task: null, message: "No pending task for this agent." });

      const claimed = must(
        await supabase
          .from("tasks")
          .update({ status: "in_progress", assigned_to: agent_name, updated_at: new Date().toISOString() })
          .eq("id", next.id)
          .eq("status", "pending")
          .select("id, title, description, attempts, last_error")
          .maybeSingle()
      );
      if (!claimed) return reply({ task: null, message: "Another agent took this task. Call get_task again." });

      await logEvent(project_id, agent_name, "task_started", `Started: ${claimed.title}`);
      return reply({ task: claimed });
    }
  );

  server.registerTool(
    "submit_result",
    {
      description:
        "Finish a claimed task. Use status done only with evidence such as commands run and their results. Use status failed with the exact error. If the reply says stop, end the work and ask the user.",
      inputSchema: {
        task_id: z.string().uuid(),
        agent_name: agentName,
        status: z.enum(["done", "failed"]),
        result: z.string().min(1).max(50000),
        evidence: z.string().max(10000).optional().describe("Required for done: how the result was verified"),
        error: z.string().max(5000).optional().describe("Required for failed: the exact error"),
      },
    },
    async ({ task_id, agent_name, status, result, evidence, error }) => {
      const task = must(
        await supabase
          .from("tasks")
          .select("id, project_id, title, status, attempts, last_error")
          .eq("id", task_id)
          .maybeSingle()
      );
      if (!task) return refuse("Task not found.");
      if (task.status !== "in_progress") return refuse(`Task is ${task.status}. Claim it with get_task first.`);
      const updated_at = new Date().toISOString();

      if (status === "done") {
        if (!evidence?.trim()) return refuse("A task can only be done with evidence of how it was verified.");
        must(
          await supabase
            .from("tasks")
            .update({ status: "done", result: `${result}\n\nEvidence:\n${evidence}`, updated_at })
            .eq("id", task_id)
        );
        await logEvent(task.project_id, agent_name, "task_completed", `Completed: ${task.title}`);
        return reply({ status: "done", stop: false });
      }

      if (!error?.trim()) return refuse("A failed task needs the exact error.");
      const next = afterFailure({ attempts: task.attempts, lastError: task.last_error }, error);
      must(
        await supabase
          .from("tasks")
          .update({ status: next.status, attempts: next.attempts, last_error: error, result, updated_at })
          .eq("id", task_id)
      );
      await logEvent(task.project_id, agent_name, "error", `${task.title}: ${error}`);
      if (next.stop) await logEvent(task.project_id, agent_name, "ask_user", `${task.title}: ${next.reason}`);
      return reply(next);
    }
  );

  server.registerTool(
    "read_memory",
    {
      annotations: { readOnlyHint: true },
      description: "Read the latest version of shared project memory. Filter by category or key.",
      inputSchema: { project_id: projectId, category: memoryCategory.optional(), key: z.string().max(200).optional() },
    },
    async ({ project_id, category, key }) => {
      let query = supabase
        .from("memory_entries")
        .select("key, category, content, version, created_at")
        .eq("project_id", project_id)
        .order("version", { ascending: false })
        .limit(500);
      if (category) query = query.eq("category", category);
      if (key) query = query.eq("key", key);

      const latest = new Map<string, unknown>();
      for (const entry of required(await query)) {
        const id = `${entry.category}/${entry.key}`;
        if (!latest.has(id)) latest.set(id, entry);
      }
      return reply([...latest.values()]);
    }
  );

  server.registerTool(
    "write_memory",
    {
      description: "Save a new version of a shared memory entry. Only the Brain may change contracts.",
      inputSchema: {
        project_id: projectId,
        key: z.string().min(1).max(200),
        category: memoryCategory,
        content: z.string().min(1),
        agent_name: agentName,
        role: z.string().max(100).describe("Role of the calling agent, brain for the Brain"),
      },
    },
    async ({ project_id, key, category, content, agent_name, role }) => {
      if (category === "contracts" && role !== "brain") return refuse("Only the Brain can change contracts.");

      const previous = must(
        await supabase
          .from("memory_entries")
          .select("version")
          .eq("project_id", project_id)
          .eq("category", category)
          .eq("key", key)
          .order("version", { ascending: false })
          .limit(1)
          .maybeSingle()
      );
      const version = (previous?.version ?? 0) + 1;
      must(await supabase.from("memory_entries").insert({ project_id, key, category, content, version }));
      await logEvent(project_id, agent_name, "memory_write", `Wrote ${category}/${key} v${version}`);
      return reply({ key, category, version });
    }
  );

  server.registerTool(
    "report_status",
    {
      description:
        "Update an agent, usage and project phase on the dashboard. Report used tokens and steps since the last call. If the reply says stop, end the work and ask the user.",
      inputSchema: {
        project_id: projectId,
        agent_name: agentName,
        role: z.string().max(100).describe("brain, or the agent's catalog slug"),
        division: z.string().max(100).optional().describe("Agent catalog department"),
        status: z.enum(["idle", "working", "done", "error", "waiting"]),
        current_task: z.string().max(500).optional(),
        tokens_used: z.number().int().min(0).default(0),
        steps_used: z.number().int().min(0).default(0),
        phase: z.enum(["planning", "development", "testing", "review", "complete"]).optional(),
        phase_progress: z.number().int().min(0).max(100).optional(),
      },
    },
    async ({ project_id, agent_name, role, division, status, current_task, tokens_used, steps_used, phase, phase_progress }) => {
      const agent = must(
        await supabase
          .from("agents")
          .select("tokens_used, steps_used")
          .eq("project_id", project_id)
          .eq("name", agent_name)
          .maybeSingle()
      );
      must(
        await supabase.from("agents").upsert(
          {
            project_id,
            name: agent_name,
            role,
            division,
            group: agentGroup(role, division),
            status,
            model: role === "brain" ? "claude-opus-5-5" : "claude-sonnet-5-5",
            current_task: current_task ?? null,
            tokens_used: (agent?.tokens_used ?? 0) + tokens_used,
            steps_used: (agent?.steps_used ?? 0) + steps_used,
          },
          { onConflict: "project_id,name" }
        )
      );

      must(
        await supabase
          .from("projects")
          .update({
            updated_at: new Date().toISOString(),
            ...(phase && { phase }),
            ...(phase_progress !== undefined && { phase_progress }),
          })
          .eq("id", project_id)
      );

      // ponytail: read-then-write can undercount parallel reports, use a SQL increment if budgets drift
      const budget = required(
        await supabase
          .from("budgets")
          .select("tokens_used, tokens_limit, steps_used, steps_limit, warned_at")
          .eq("project_id", project_id)
          .single()
      );
      const totals = { tokens_used: budget.tokens_used + tokens_used, steps_used: budget.steps_used + steps_used };
      const state = budgetState({
        tokensUsed: totals.tokens_used,
        tokensLimit: budget.tokens_limit,
        stepsUsed: totals.steps_used,
        stepsLimit: budget.steps_limit,
      });
      const warnNow = state.warning && !budget.warned_at;
      must(
        await supabase
          .from("budgets")
          .update({ ...totals, ...(warnNow && { warned_at: new Date().toISOString() }) })
          .eq("project_id", project_id)
      );
      if (warnNow) await logEvent(project_id, "Brain", "budget_warning", `Budget is at ${state.percent}%.`);
      if (state.exceeded) await logEvent(project_id, "Brain", "ask_user", "The project budget is used up.");

      return reply({
        budget_percent: state.percent,
        warning: state.warning,
        stop: state.exceeded,
        ...(state.exceeded && { reason: "The budget is used up. Stop and ask the user." }),
      });
    }
  );

  server.registerTool(
    "get_project",
    {
      annotations: { readOnlyHint: true },
      description: "Get a project's phase, team, tasks and budget. Use it to check real progress or to continue a project.",
      inputSchema: { project_id: projectId },
    },
    async ({ project_id }) => {
      const project = must(
        await supabase
          .from("projects")
          .select(
            "id, name, description, kind, divisions, phase, phase_progress, tasks(id, title, status, assigned_to, attempts, last_error), budget:budgets(tokens_used, tokens_limit, steps_used, steps_limit)"
          )
          .eq("id", project_id)
          .maybeSingle()
      );
      return project ? reply(project) : refuse("Project not found.");
    }
  );

  server.registerTool(
    "list_agents",
    {
      annotations: { readOnlyHint: true },
      description: "Search the specialist catalog. Filter by departments and an optional search word.",
      inputSchema: {
        divisions: z.array(z.enum(divisionIds as [string, ...string[]])).default([]),
        query: z.string().max(100).optional(),
      },
    },
    async ({ divisions, query }) => {
      const word = query?.toLowerCase();
      const matches = catalogAgents.filter(
        (agent) =>
          (divisions.length === 0 || divisions.includes(agent.division)) &&
          (!word || `${agent.name} ${agent.description}`.toLowerCase().includes(word))
      );
      return reply({
        total: matches.length,
        agents: matches.slice(0, 100).map((agent) => ({
          slug: agent.slug,
          name: agent.name,
          division: agent.division,
          description: agent.description.slice(0, 200),
        })),
      });
    }
  );

  server.registerTool(
    "get_agent_instructions",
    {
      annotations: { readOnlyHint: true },
      description: "Get the full role instructions for one specialist from the catalog.",
      inputSchema: { slug: z.string().min(1).max(200) },
    },
    async ({ slug }) => {
      const agent = getCatalogAgent(slug);
      if (!agent) return refuse("No agent with this slug. Use list_agents to find one.");
      return reply({ name: agent.name, division: agent.division, instructions: readAgentInstructions(agent) });
    }
  );

  server.registerTool(
    "ask_user",
    {
      description: "Record a question for the user on the dashboard. Then ask it in the conversation and wait for the answer.",
      inputSchema: { project_id: projectId, agent_name: agentName, question: z.string().min(1).max(5000) },
    },
    async ({ project_id, agent_name, question }) => {
      await logEvent(project_id, agent_name, "ask_user", question);
      return reply({ recorded: true, next: "Ask the user this question in the conversation and wait for the answer." });
    }
  );

  return server;
}
