import Link from "next/link";
import { CheckCircle2, ExternalLink } from "lucide-react";
import { AutoRefresh } from "@/components/dashboard/auto-refresh";
import { Card } from "@/components/ui/card";
import { agentCount, repositoryUrl } from "@/lib/agent-catalog";
import { getLastClaudeConnection } from "@/lib/data";

function formatLastActive(timestamp: string) {
  return new Date(timestamp).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function ConnectPage() {
  const lastConnection = await getLastClaudeConnection();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {!lastConnection && <AutoRefresh seconds={5} />}

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Your connection</h1>
        <p className="text-sm text-muted-foreground">Build with your team from your AI tool and follow the progress here</p>
      </div>

      <div
        role="status"
        className={`flex items-center gap-3 rounded-xl border p-4 ${
          lastConnection ? "border-lime/40 bg-lime/5" : "border-border bg-card"
        }`}
      >
        {lastConnection ? (
          <CheckCircle2 className="h-5 w-5 shrink-0 text-lime" />
        ) : (
          <span className="relative flex h-3 w-3 shrink-0" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-60" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-lime" />
          </span>
        )}
        <div>
          <p className="text-sm font-semibold">{lastConnection ? "Your AI tool is connected" : "Waiting for your AI tool…"}</p>
          <p className="text-xs text-muted-foreground">
            {lastConnection
              ? `Last active ${formatLastActive(lastConnection)}`
              : "This updates by itself once your AI tool uses AgentWe for the first time."}
          </p>
        </div>
      </div>

      <Link
        href="/connect"
        className="flex items-center justify-center gap-2 rounded-xl bg-lime px-4 py-3 text-sm font-bold text-lime-foreground transition-colors hover:bg-lime/90"
      >
        How to connect Claude Code, Claude in Chrome, ChatGPT or Codex
      </Link>

      <Card className="gap-0 border-border bg-card p-6">
        <h2 className="text-sm font-semibold">How it works</h2>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          In Claude Code the Brain runs on Opus and specialists on Sonnet by default, and you can pick other models when you create a project. Everything runs on your own AI account. Specialists load from the catalog of {agentCount} agents when needed, so nothing else needs installing. AgentWe never sees your Claude or ChatGPT credentials and only has the access you approve.
        </p>
        <div className="mt-3 flex flex-wrap gap-4 text-xs">
          <Link href="/home/agents" className="text-lime hover:underline">
            Browse the agent catalog
          </Link>
          <a
            href={repositoryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-lime hover:underline"
          >
            Catalog source <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </Card>
    </div>
  );
}
