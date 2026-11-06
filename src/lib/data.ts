import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ActivityEvent, Agent, Project } from "@/lib/domain";

const POSTGRES_INVALID_UUID = "22P02";

type AgentRow = {
  id: string;
  name: string;
  role: Agent["role"];
  group: Agent["group"];
  status: Agent["status"];
  model: string;
  current_task: string | null;
  tokens_used: number;
  steps_used: number;
};

type EventRow = {
  id: string;
  created_at: string;
  agent_id: string | null;
  agent_name: string | null;
  type: ActivityEvent["type"];
  message: string;
};

type TaskRow = {
  id: string;
  title: string;
  status: ProjectTask["status"];
  assigned_to: string | null;
  attempts: number;
  last_error: string | null;
};

export type ProjectTask = {
  id: string;
  title: string;
  status: "pending" | "in_progress" | "done" | "error";
  assignedTo: string | null;
  attempts: number;
  lastError: string | null;
};

export type MemoryEntry = { key: string; category: string; content: string; version: number };

type ProjectRow = {
  share_token: string | null;
  memory_entries?: MemoryEntry[];
  id: string;
  name: string;
  description: string;
  phase: Project["phase"];
  phase_progress: number;
  created_at: string;
  updated_at: string;
  kind: string;
  divisions: string[];
  agents: AgentRow[];
  events?: EventRow[];
  tasks?: TaskRow[];
  budget: { tokens_used: number; tokens_limit: number; steps_used: number; steps_limit: number } | null;
};

function toEvent(row: EventRow): ActivityEvent {
  return {
    id: row.id,
    timestamp: row.created_at,
    agentId: row.agent_id ?? "",
    agentName: row.agent_name ?? "System",
    type: row.type,
    message: row.message,
  };
}

export type ProjectWithTeam = Project & {
  kind: string;
  divisions: string[];
  tasks: ProjectTask[];
  shareToken: string | null;
  memory: MemoryEntry[];
};

function latestMemory(entries: MemoryEntry[]) {
  const latest = new Map<string, MemoryEntry>();
  for (const entry of entries) {
    const id = `${entry.category}/${entry.key}`;
    const current = latest.get(id);
    if (!current || entry.version > current.version) latest.set(id, entry);
  }
  return [...latest.values()];
}

function toProject(row: ProjectRow): ProjectWithTeam {
  return {
    id: row.id,
    shareToken: row.share_token,
    memory: latestMemory(row.memory_entries ?? []),
    kind: row.kind,
    divisions: row.divisions,
    tasks: (row.tasks ?? []).map((task) => ({
      id: task.id,
      title: task.title,
      status: task.status,
      assignedTo: task.assigned_to,
      attempts: task.attempts,
      lastError: task.last_error,
    })),
    name: row.name,
    description: row.description,
    phase: row.phase,
    phaseProgress: row.phase_progress,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    agents: row.agents.map((a) => ({
      id: a.id,
      name: a.name,
      role: a.role,
      group: a.group,
      status: a.status,
      model: a.model,
      currentTask: a.current_task,
      tokensUsed: a.tokens_used,
      stepsUsed: a.steps_used,
    })),
    events: (row.events ?? []).map(toEvent),
    budget: {
      tokensUsed: row.budget?.tokens_used ?? 0,
      tokensLimit: row.budget?.tokens_limit ?? 1000000,
      stepsUsed: row.budget?.steps_used ?? 0,
      stepsLimit: row.budget?.steps_limit ?? 200,
    },
  };
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return {
    email: user.email ?? "",
    name: (user.user_metadata.full_name as string | undefined) ?? "",
  };
}

export async function getProjects(): Promise<ProjectWithTeam[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*, agents(*), budget:budgets(*)")
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as unknown as ProjectRow[]).map(toProject);
}

export async function getProject(id: string): Promise<ProjectWithTeam | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*, agents(*), events(*), tasks(*), memory_entries(key, category, content, version), budget:budgets(*)")
    .eq("id", id)
    .order("created_at", { referencedTable: "events", ascending: false })
    .order("created_at", { referencedTable: "tasks" })
    .maybeSingle();

  if (error?.code === POSTGRES_INVALID_UUID) return null;
  if (error) throw new Error(error.message);
  return data && toProject(data as unknown as ProjectRow);
}

export async function getLastClaudeConnection(): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("mcp_connections").select("last_seen_at").maybeSingle();
  if (error) throw new Error(error.message);
  return data?.last_seen_at ?? null;
}

export async function getRecentEvents(limit = 20): Promise<ActivityEvent[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data as EventRow[]).map(toEvent);
}
