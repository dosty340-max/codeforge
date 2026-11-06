"use client";

import { useEffect, useRef, useState } from "react";
import { CanvasBoard } from "@/components/live/canvas-board";
import { TeamMap, type MapAgent } from "@/components/live/team-map";
import { getCreator } from "@/lib/creators";
import type { PreviewSection } from "@/lib/preview";
import { createClient } from "@/lib/supabase/client";

const POLL_MS = 2500;
const VISUAL_KINDS = ["website", "app", "game", "startup"];

type AgentRow = { name: string; role: string; status: MapAgent["status"]; current_task: string | null };
type TaskRow = { status: string; assigned_to: string | null };
type SectionRow = {
  section_id: string;
  title: string;
  html: string;
  css: string;
  position: number;
  agent_name: string;
  version: number;
  updated_at: string;
};

function toSection(row: SectionRow): PreviewSection {
  return {
    id: row.section_id,
    title: row.title,
    html: row.html,
    css: row.css,
    position: row.position,
    agent: row.agent_name,
    version: row.version,
    updatedAt: row.updated_at,
  };
}

export function teamFromRows(agents: AgentRow[], tasks: TaskRow[]): MapAgent[] {
  const team = agents
    .filter((agent) => agent.role !== "brain")
    .map((agent): MapAgent => ({ name: agent.name, status: agent.status, task: agent.current_task }));
  const names = new Set(team.map((agent) => agent.name));
  for (const task of tasks) {
    if (!task.assigned_to || names.has(task.assigned_to)) continue;
    names.add(task.assigned_to);
    team.push({ name: task.assigned_to, status: "idle", task: null });
  }
  return team;
}

export function LiveProject({ projectId, name, kind }: { projectId: string; name: string; kind: string }) {
  const [agents, setAgents] = useState<AgentRow[]>([]);
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [sections, setSections] = useState<PreviewSection[]>([]);
  const cache = useRef(new Map<string, PreviewSection>());

  useEffect(() => {
    const supabase = createClient();
    let stopped = false;

    async function refresh() {
      if (document.visibilityState !== "visible") return;

      const { data: project } = await supabase
        .from("projects")
        .select("agents(name, role, status, current_task), tasks(status, assigned_to)")
        .eq("id", projectId)
        .maybeSingle();
      if (stopped || !project) return;
      setAgents(project.agents as AgentRow[]);
      setTasks(project.tasks as TaskRow[]);

      const { data: list, error } = await supabase
        .from("preview_sections")
        .select("section_id, version")
        .eq("project_id", projectId);
      if (stopped || error || !list) return;

      const changed = list
        .filter((row) => cache.current.get(row.section_id)?.version !== row.version)
        .map((row) => row.section_id);
      const removed = [...cache.current.keys()].some((id) => !list.some((row) => row.section_id === id));
      if (!changed.length && !removed) return;

      if (changed.length) {
        const { data: rows } = await supabase
          .from("preview_sections")
          .select("section_id, title, html, css, position, agent_name, version, updated_at")
          .eq("project_id", projectId)
          .in("section_id", changed);
        if (stopped) return;
        for (const row of (rows ?? []) as SectionRow[]) cache.current.set(row.section_id, toSection(row));
      }
      for (const id of cache.current.keys()) {
        if (!list.some((row) => row.section_id === id)) cache.current.delete(id);
      }
      setSections([...cache.current.values()]);
    }

    void refresh();
    const timer = setInterval(refresh, POLL_MS);
    return () => {
      stopped = true;
      clearInterval(timer);
    };
  }, [projectId]);

  const team = teamFromRows(agents, tasks);
  const brain = agents.find((agent) => agent.role === "brain");
  const working = agents
    .filter((agent) => agent.status === "working")
    .map((agent) => ({ name: agent.name, task: agent.current_task }));
  const output = getCreator(kind).output;
  const showCanvas = VISUAL_KINDS.includes(kind) || sections.length > 0;
  const waitingFor = agents.length
    ? "The Brain is planning. The first widgets appear here."
    : "Waiting for your AI tool. Press Enter there to start.";

  return (
    <div className="space-y-4">
      {showCanvas && (
        <CanvasBoard
          name={name}
          sections={sections}
          working={working}
          waitingFor={waitingFor}
          initialDevice={kind === "app" ? "phone" : "desktop"}
        />
      )}
      <TeamMap
        output={output}
        agents={team}
        brainWorking={brain?.status === "working"}
        doneTasks={tasks.filter((task) => task.status === "done").length}
        totalTasks={tasks.length}
      />
    </div>
  );
}
