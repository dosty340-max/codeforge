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

export const mockAgents: Agent[] = [
  { id: "a1", name: "Brain", role: "brain", group: "orchestration", status: "working", model: "claude-opus-5-5", currentTask: "Coordinating backend API implementation", tokensUsed: 145200, stepsUsed: 23 },
  { id: "a2", name: "UI/UX Agent", role: "ui-ux", group: "development", status: "done", model: "claude-sonnet-5-5", currentTask: null, tokensUsed: 89400, stepsUsed: 18 },
  { id: "a3", name: "Backend Agent", role: "backend", group: "development", status: "working", model: "claude-sonnet-5-5", currentTask: "Building REST API endpoints for products", tokensUsed: 67800, stepsUsed: 12 },
  { id: "a4", name: "Database Agent", role: "database", group: "development", status: "waiting", model: "claude-sonnet-5-5", currentTask: "Waiting for API schema from Backend", tokensUsed: 34500, stepsUsed: 8 },
  { id: "a5", name: "Auth Agent", role: "auth", group: "development", status: "idle", model: "claude-sonnet-5-5", currentTask: null, tokensUsed: 12300, stepsUsed: 4 },
  { id: "a6", name: "Functional Tests", role: "test-func", group: "testing", status: "idle", model: "claude-sonnet-5-5", currentTask: null, tokensUsed: 0, stepsUsed: 0 },
  { id: "a7", name: "Security Tests", role: "test-security", group: "testing", status: "idle", model: "claude-sonnet-5-5", currentTask: null, tokensUsed: 0, stepsUsed: 0 },
  { id: "a8", name: "Perf Tests", role: "test-perf", group: "testing", status: "idle", model: "claude-sonnet-5-5", currentTask: null, tokensUsed: 0, stepsUsed: 0 },
  { id: "a9", name: "Code Review", role: "code-review", group: "testing", status: "idle", model: "claude-sonnet-5-5", currentTask: null, tokensUsed: 0, stepsUsed: 0 },
];

export const mockEvents: ActivityEvent[] = [
  { id: "e1", timestamp: "2026-11-06T10:23:00Z", agentId: "a1", agentName: "Brain", type: "decision", message: "Split project into 4 phases: UI, API, Database, Auth" },
  { id: "e2", timestamp: "2026-11-06T10:24:00Z", agentId: "a1", agentName: "Brain", type: "task_started", message: "Assigned UI/UX design to UI/UX Agent" },
  { id: "e3", timestamp: "2026-11-06T10:45:00Z", agentId: "a2", agentName: "UI/UX Agent", type: "task_completed", message: "Landing page and product listing UI complete" },
  { id: "e4", timestamp: "2026-11-06T10:46:00Z", agentId: "a1", agentName: "Brain", type: "task_started", message: "Assigned API development to Backend Agent" },
  { id: "e5", timestamp: "2026-11-06T10:50:00Z", agentId: "a3", agentName: "Backend Agent", type: "memory_write", message: "Wrote API contract: /api/products, /api/cart, /api/orders" },
  { id: "e6", timestamp: "2026-11-06T11:02:00Z", agentId: "a1", agentName: "Brain", type: "budget_warning", message: "Token usage at 35% of project budget" },
  { id: "e7", timestamp: "2026-11-06T11:15:00Z", agentId: "a3", agentName: "Backend Agent", type: "task_started", message: "Building REST API endpoints for products" },
  { id: "e8", timestamp: "2026-11-06T11:20:00Z", agentId: "a4", agentName: "Database Agent", type: "ask_user", message: "Should I use PostgreSQL or MySQL for the database?" },
];

export const mockProjects: Project[] = [
  {
    id: "p1",
    name: "E-shop for Handmade Jewelry",
    description: "Full e-commerce platform with product catalog, shopping cart, payments, and admin panel",
    phase: "development",
    phaseProgress: 65,
    createdAt: "2026-11-06T10:20:00Z",
    updatedAt: "2026-11-06T11:20:00Z",
    agents: mockAgents,
    events: mockEvents,
    budget: { tokensUsed: 349200, tokensLimit: 1000000, stepsUsed: 65, stepsLimit: 200 },
  },
  {
    id: "p2",
    name: "Portfolio Website",
    description: "Minimal portfolio with project gallery, about page, and contact form",
    phase: "complete",
    phaseProgress: 100,
    createdAt: "2026-11-04T08:00:00Z",
    updatedAt: "2026-11-05T14:30:00Z",
    agents: mockAgents.map((a) => ({ ...a, status: "done" as AgentStatus, currentTask: null })),
    events: [],
    budget: { tokensUsed: 520000, tokensLimit: 1000000, stepsUsed: 142, stepsLimit: 200 },
  },
  {
    id: "p3",
    name: "SaaS Dashboard",
    description: "Analytics dashboard with charts, user management, and billing integration",
    phase: "planning",
    phaseProgress: 15,
    createdAt: "2026-11-06T09:00:00Z",
    updatedAt: "2026-11-06T09:15:00Z",
    agents: mockAgents.map((a) => ({ ...a, status: "idle" as AgentStatus, currentTask: null, tokensUsed: 0, stepsUsed: 0 })),
    events: [],
    budget: { tokensUsed: 12000, tokensLimit: 1000000, stepsUsed: 3, stepsLimit: 200 },
  },
];
