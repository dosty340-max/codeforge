export const models = [
  { id: "opus", label: "Opus 5.5", fullId: "claude-opus-5-5" },
  { id: "fable", label: "Fable 5.1", fullId: "claude-fable-5-1" },
  { id: "sonnet", label: "Sonnet 5.5", fullId: "claude-sonnet-5-5" },
  { id: "haiku", label: "Haiku 5.5", fullId: "claude-haiku-5-5" },
];

export const DEFAULT_BRAIN = "opus";
export const DEFAULT_SPECIALISTS = "sonnet";

export function knownModel(id: string, fallback: string) {
  return models.some((model) => model.id === id) ? id : fallback;
}

type Request = {
  noun: string;
  choices: string[];
  idea: string;
  brain?: string;
  specialists?: string;
  projectId?: string;
};

function describe({ noun, choices, idea, projectId }: Request, extra: string[] = []) {
  const details = [...choices, ...extra];
  const project = projectId ? ` (Project ID: ${projectId})` : "";
  return `${noun}${details.length ? ` (${details.join(", ")})` : ""}: ${idea.trim()}${project}`;
}

export function claudeCodePrompt(request: Request) {
  const brain = knownModel(request.brain ?? "", DEFAULT_BRAIN);
  const specialists = knownModel(request.specialists ?? "", DEFAULT_SPECIALISTS);
  const command = brain === DEFAULT_BRAIN ? "build" : `build-${brain}`;
  const extra = specialists === DEFAULT_SPECIALISTS ? [] : [`Specialist model: ${specialists}`];
  return `/agentwe:${command} ${describe(request, extra)}`;
}

export function claudeWebPrompt(request: Request) {
  return `Use AgentWe to build this. ${describe(request)}`;
}

export function claudeCodeLink(prompt: string, folder = "") {
  const params = new URLSearchParams({ q: prompt });
  if (isAbsolutePath(folder)) params.set("cwd", folder.trim());
  return `claude-cli://open?${params.toString().replace(/\+/g, "%20")}`;
}

export function chatgptPrompt(request: Request) {
  return `@AgentWe build this. ${describe(request)}`;
}

export function chatgptLink(prompt: string) {
  return `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`;
}

export function shellQuote(text: string) {
  return `'${text.replace(/'/g, `'\\''`)}'`;
}

export function codexCommand(request: Request, folder = "") {
  const start = `codex ${shellQuote(`Use the agentwe MCP server to build this, following its rules. ${describe(request)}`)}`;
  return isAbsolutePath(folder) ? `cd ${shellQuote(folder.trim())} && ${start}` : start;
}

export type Target = "claude-code" | "claude-chrome" | "chatgpt" | "codex";

export function targetPrompt(target: Target, request: Request, folder = "") {
  if (target === "claude-code") return claudeCodePrompt(request);
  if (target === "chatgpt") return chatgptPrompt(request);
  if (target === "codex") return codexCommand(request, folder);
  return claudeWebPrompt(request);
}

// Codex has no documented link, so people copy its command instead.
export function targetLink(target: Target, request: Request, folder = "") {
  if (target === "claude-code") return claudeCodeLink(claudeCodePrompt(request), folder);
  if (target === "chatgpt") return chatgptLink(chatgptPrompt(request));
  if (target === "claude-chrome") return claudeWebLink(claudeWebPrompt(request), knownModel(request.brain ?? "", DEFAULT_BRAIN));
  return null;
}

// ponytail: claude.ai's q and model parameters are undocumented, tested by hand on 2026-11-06.
export function claudeWebLink(prompt: string, brain = DEFAULT_BRAIN) {
  const model = models.find((candidate) => candidate.id === brain);
  return `https://claude.ai/new?q=${encodeURIComponent(prompt)}${model ? `&model=${model.fullId}` : ""}`;
}

export function isAbsolutePath(path: string) {
  const value = path.trim();
  return /^(\/|[A-Za-z]:\\)/.test(value) && !value.split(/[/\\]/).includes("..");
}
