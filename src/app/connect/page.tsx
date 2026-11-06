import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Bot, ClipboardList, Database, FolderKanban, KeyRound, Radio, UserCheck, Zap } from "lucide-react";
import { McpClients } from "@/components/connect/mcp-clients";
import { SiteFooter } from "@/components/landing/site-chrome";
import { Navbar } from "@/components/layout/navbar";
import { agentCount } from "@/lib/agent-catalog";

export const metadata: Metadata = {
  title: "MCP",
  description: "Connect Claude Code, Claude in Chrome, ChatGPT or Codex to AgentWe and give it plans, tasks, memory and a team of specialists.",
};

const toolGroups = [
  { icon: FolderKanban, title: "Projects", copy: "Start a project and see where it stands.", tools: ["create_project", "list_projects", "get_project"] },
  { icon: ClipboardList, title: "Tasks", copy: "Split work and hand in results with evidence.", tools: ["create_task", "get_task", "submit_result"] },
  { icon: Database, title: "Shared memory", copy: "Keep the spec and decisions in one versioned place.", tools: ["read_memory", "write_memory"] },
  { icon: Bot, title: "Agents", copy: `Pick from ${agentCount} specialists and load their role.`, tools: ["list_agents", "get_agent_instructions"] },
  { icon: Radio, title: "Live status", copy: "Show agents, budget and a live preview on your dashboard.", tools: ["report_status", "update_preview"] },
  { icon: UserCheck, title: "Ask you", copy: "Stop and ask when a decision is yours.", tools: ["ask_user"] },
];

const trust = [
  { icon: KeyRound, title: "You approve access", copy: "Your AI tool connects only after you sign in and approve it on AgentWe." },
  { icon: Zap, title: "Your own AI account", copy: "All AI work runs on your own plan. AgentWe never sees your Claude or ChatGPT credentials." },
  { icon: Database, title: "Only your projects", copy: "Each connection acts as you, so it can reach your projects and nobody else's." },
];

export default function McpPage() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<div className="h-14 border-b border-border" />}>
        <Navbar />
      </Suspense>

      <main>
        <Suspense fallback={<div className="min-h-[calc(100vh-5rem)] bg-black" />}>
          <McpClients />
        </Suspense>

        <section className="border-t border-border bg-card/40">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">What your AI can do once connected</h2>
            <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {toolGroups.map((group) => (
                <li key={group.title} className="rounded-xl border border-border bg-card p-5">
                  <group.icon className="h-5 w-5 text-lime" />
                  <h3 className="mt-4 font-semibold">{group.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{group.copy}</p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {group.tools.map((tool) => (
                      <li key={tool} className="rounded bg-secondary px-2 py-1 font-mono text-[11px] text-muted-foreground">
                        {tool}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <ul className="grid gap-8 sm:grid-cols-3">
            {trust.map((item) => (
              <li key={item.title}>
                <item.icon className="h-5 w-5 text-lime" />
                <h3 className="mt-3 font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.copy}</p>
              </li>
            ))}
          </ul>
          <Link href="/home/connect" className="mt-10 flex items-center justify-center gap-1 text-sm text-lime hover:underline">
            Check your connection status <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
