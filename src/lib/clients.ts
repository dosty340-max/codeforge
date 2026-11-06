import { Globe, MessageCircle, SquareTerminal, TerminalSquare, type LucideIcon } from "lucide-react";
import type { Target } from "@/lib/claude-links";

export type GuideStep = { title: string; copy: string; command?: string };

export type Client = {
  id: Target;
  label: string;
  icon: LucideIcon;
  bestFor: string;
  steps: GuideStep[];
  note?: string;
};

const pluginSource = process.env.NEXT_PUBLIC_PLUGIN_SOURCE ?? "owner/repository";

export function getClients(serverAddress: string): Client[] {
  const claudeCommand = `claude plugin install agentwe --marketplace ${pluginSource} && claude mcp login plugin:agentwe:agentwe`;

  return [
    {
      id: "claude-code",
      label: "Claude Code",
      icon: SquareTerminal,
      bestFor: "Best for full builds. Works on your files, runs specialists side by side and runs real tests.",
      steps: [
        { title: "Connect once", copy: "Run this in your terminal. It adds AgentWe and opens your browser, where you approve access.", command: claudeCommand },
        { title: "Start building", copy: "Run this inside Claude Code. The Brain creates the project on your dashboard and asks you to approve its plan.", command: "/agentwe:build A 2D platformer with ten levels" },
        { title: "Follow along", copy: "Watch phases, agents and budget live on your AgentWe dashboard." },
      ],
    },
    {
      id: "claude-chrome",
      label: "Claude in Chrome",
      icon: Globe,
      bestFor: "No terminal. Best for planning and smaller work, with results in the conversation.",
      steps: [
        { title: "Open connectors", copy: "In Claude, go to Customize, then Connectors." },
        { title: "Add the connector", copy: "Choose + Add, then Add custom connector. Name it AgentWe, paste this address and choose Continue.", command: serverAddress },
        { title: "Approve access", copy: "Choose Sign in now, then Add, and approve access on the AgentWe page." },
        { title: "Turn it on in your chat", copy: "In a chat, choose +, then Connectors, and switch on AgentWe. In the Chrome side panel it works in Cowork sessions." },
        { title: "Start building", copy: "Ask Claude to build something.", command: "Use AgentWe to build a booking page for my barbershop." },
      ],
      note: "Claude in Chrome is a paid Claude feature. On a free plan, use the same connector on claude.ai.",
    },
    {
      id: "chatgpt",
      label: "ChatGPT",
      icon: MessageCircle,
      bestFor: "No install. Best for planning and smaller work, with results in the conversation.",
      steps: [
        { title: "Open plugins", copy: "In ChatGPT, go to Plugins." },
        { title: "Add the server", copy: "Select +, then Add custom MCP server. Name it AgentWe and paste this address under Connection.", command: serverAddress },
        { title: "Create the plugin", copy: "Set up authentication, review the warning, choose I understand and want to continue, then Create as a plugin." },
        { title: "Approve access", copy: "Sign in when ChatGPT asks and approve access on the AgentWe page." },
        { title: "Start building", copy: "Mention AgentWe in a new chat.", command: "@AgentWe build a booking page for my barbershop." },
      ],
      note: "Your ChatGPT plan or workspace policy decides whether you can add custom MCP servers.",
    },
    {
      id: "codex",
      label: "Codex",
      icon: TerminalSquare,
      bestFor: "Works on your files and runs real tests from your terminal.",
      steps: [
        { title: "Add the server", copy: "Run this in your terminal.", command: `codex mcp add agentwe --url ${serverAddress}` },
        { title: "Approve access", copy: "This opens your browser, where you approve access on the AgentWe page.", command: "codex mcp login agentwe" },
        { title: "Check the connection", copy: "AgentWe should appear in the list.", command: "codex mcp list" },
        { title: "Start building", copy: "Open Codex in your project folder and ask for what you want. Use /model to choose the model.", command: "Use the agentwe MCP server to build a browser game with ten levels." },
      ],
    },
  ];
}
