import { z } from "zod";
import { divisionIds } from "@/lib/agent-catalog";
import { projectKinds } from "@/lib/project-kinds";

export const createProjectSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).default(""),
  kind: z.enum(projectKinds.map((kind) => kind.id) as [string, ...string[]]).default("anything"),
  divisions: z.array(z.enum(divisionIds as [string, ...string[]])).max(divisionIds.length).default([]),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  phase: z.enum(["planning", "development", "testing", "review", "complete"]).optional(),
  phaseProgress: z.number().min(0).max(100).optional(),
});

export const createTaskSchema = z.object({
  projectId: z.string().uuid(),
  agentId: z.string().optional(),
  title: z.string().min(1).max(500),
  description: z.string().max(5000).default(""),
  status: z.enum(["pending", "in_progress", "done", "error"]).default("pending"),
});

export const updateTaskSchema = z.object({
  status: z.enum(["pending", "in_progress", "done", "error"]).optional(),
  result: z.string().max(50000).optional(),
});

export const createEventSchema = z.object({
  projectId: z.string().uuid(),
  agentId: z.string().optional(),
  agentName: z.string().max(100).optional(),
  type: z.enum(["task_started", "task_completed", "error", "decision", "memory_write", "ask_user", "budget_warning"]),
  message: z.string().min(1).max(5000),
});

export const writeMemorySchema = z.object({
  projectId: z.string().uuid(),
  key: z.string().min(1).max(200),
  category: z.enum(["spec", "contracts", "decisions", "tasks"]),
  content: z.string().min(1),
});

export type CreateProject = z.infer<typeof createProjectSchema>;
export type UpdateProject = z.infer<typeof updateProjectSchema>;
export type CreateTask = z.infer<typeof createTaskSchema>;
export type UpdateTask = z.infer<typeof updateTaskSchema>;
export type CreateEvent = z.infer<typeof createEventSchema>;
export type WriteMemory = z.infer<typeof writeMemorySchema>;
