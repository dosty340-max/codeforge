export type AgentStatus = "idle" | "working" | "done" | "error" | "waiting";
export type ProjectPhase = "planning" | "development" | "testing" | "review" | "complete";
export type AgentRole = "brain" | "ui-ux" | "backend" | "database" | "auth" | "test-func" | "test-security" | "test-perf" | "code-review";

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  group: "orchestration" | "development" | "testing";
  status: AgentStatus;
  model: string;
  currentTask: string | null;
  tokensUsed: number;
  stepsUsed: number;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  type: "task_started" | "task_completed" | "error" | "decision" | "memory_write" | "ask_user" | "budget_warning";
  message: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  phase: ProjectPhase;
  phaseProgress: number;
  createdAt: string;
  updatedAt: string;
  agents: Agent[];
  events: ActivityEvent[];
  budget: { tokensUsed: number; tokensLimit: number; stepsUsed: number; stepsLimit: number };
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  interval: "month";
  projectsLimit: number;
  agentsPerProject: number;
  historyDays: number;
  features: string[];
}

export const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    interval: "month",
    projectsLimit: 2,
    agentsPerProject: 5,
    historyDays: 7,
    features: ["2 active projects", "5 agents per project", "7-day history", "Community support"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    interval: "month",
    projectsLimit: 20,
    agentsPerProject: 15,
    historyDays: 90,
    features: ["20 active projects", "15 agents per project", "90-day history", "Priority support", "Public sharing", "Custom agent configs"],
  },
];
