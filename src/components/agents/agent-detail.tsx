import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { CommandBlock } from "@/components/agents/command-block";
import {
  agentInstallCommand,
  agentSourceUrl,
  divisionIcons,
  divisions,
  type CatalogAgent,
} from "@/lib/agent-catalog";

function readInstructions(agent: CatalogAgent) {
  const file = readFileSync(join(process.cwd(), "vendor/agency-agents", agent.path), "utf8");
  return file.replace(/^---[\s\S]*?\n---\r?\n/, "").trim();
}

export function AgentDetail({ agent, basePath }: { agent: CatalogAgent; basePath: string }) {
  const division = divisions[agent.division];
  const Icon = divisionIcons[agent.division];

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <Link
        href={`${basePath}?division=${agent.division}`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {division.label}
      </Link>

      <header>
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Icon className="h-3.5 w-3.5" style={{ color: division.color }} />
          {division.label}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          <span aria-hidden="true">{agent.emoji}</span> {agent.name}
        </h1>
        {agent.vibe && <p className="mt-2 text-lime">{agent.vibe}</p>}
        <p className="mt-4 leading-relaxed text-muted-foreground">{agent.description}</p>
      </header>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold">Add this agent to Claude Code</h2>
        <CommandBlock command={agentInstallCommand(agent)} />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-semibold">Full instructions</h2>
          <a
            href={agentSourceUrl(agent)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-lime hover:underline"
          >
            View source <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <pre className="max-h-[32rem] overflow-auto whitespace-pre-wrap rounded-xl border border-border bg-card p-5 font-mono text-xs leading-relaxed text-muted-foreground">
          {readInstructions(agent)}
        </pre>
      </section>
    </article>
  );
}
