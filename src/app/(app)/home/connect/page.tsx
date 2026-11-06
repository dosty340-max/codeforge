import Link from "next/link";
import { CheckCircle2, ExternalLink, Plug } from "lucide-react";
import { ClaudeComparison } from "@/components/agents/claude-comparison";
import { CommandBlock } from "@/components/agents/command-block";
import { OpenConnectorButton } from "@/components/agents/open-connector-button";
import { AutoRefresh } from "@/components/dashboard/auto-refresh";
import { Card } from "@/components/ui/card";
import { agentCount, repositoryUrl } from "@/lib/agent-catalog";
import { getLastClaudeConnection } from "@/lib/data";
import { siteUrl } from "@/lib/site";

const pluginSource = process.env.NEXT_PUBLIC_PLUGIN_SOURCE ?? "owner/repository";
const connectCommand = `claude plugin install codeforge --marketplace ${pluginSource} && claude mcp login plugin:codeforge:codeforge`;
const serverAddress = `${siteUrl}/mcp`;

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
        <h1 className="text-2xl font-bold tracking-tight">Connect to Claude</h1>
        <p className="text-sm text-muted-foreground">Build with your team from Claude and follow the progress here</p>
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
          <p className="text-sm font-semibold">{lastConnection ? "Claude is connected" : "Waiting for Claude…"}</p>
          <p className="text-xs text-muted-foreground">
            {lastConnection
              ? `Last active ${formatLastActive(lastConnection)}`
              : "This updates by itself once Claude uses Codeforge for the first time."}
          </p>
        </div>
      </div>

      <ClaudeComparison />

      <Card className="gap-0 border-lime/40 bg-card p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lime/10">
            <Plug className="h-5 w-5 text-lime" />
          </div>
          <h2 className="font-semibold">Claude Code</h2>
          <span className="rounded-full bg-lime px-2 py-0.5 text-[10px] font-bold text-lime-foreground">Recommended</span>
        </div>

        <ol className="space-y-6">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lime text-xs font-bold text-lime-foreground">1</span>
            <div className="min-w-0 flex-1 space-y-2">
              <p className="text-sm font-medium">Connect once</p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Run this in your terminal. It adds Codeforge and opens your browser, where you approve access.
              </p>
              <CommandBlock command={connectCommand} />
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lime text-xs font-bold text-lime-foreground">2</span>
            <div className="min-w-0 flex-1 space-y-2">
              <p className="text-sm font-medium">Start building</p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Run this inside Claude Code. The Brain creates the project here and asks you to approve its plan.
              </p>
              <CommandBlock command="/codeforge:build A 2D platformer with ten levels" />
            </div>
          </li>
        </ol>
      </Card>

      <Card className="gap-0 border-border bg-card p-6">
        <h2 className="font-semibold">Claude on the web or desktop</h2>
        <p className="mt-1 text-xs text-muted-foreground">No install. Best for planning and smaller work.</p>
        <ol className="mt-4 list-decimal space-y-1 pl-4 text-xs leading-relaxed text-muted-foreground">
          <li>In Claude, choose Add custom connector and paste the Codeforge address.</li>
          <li>Press Connect and approve access on the Codeforge page.</li>
          <li>Start a chat and ask: Use Codeforge to build a booking page for my barbershop.</li>
        </ol>
        <div className="mt-4">
          {siteUrl.startsWith("https://") ? (
            <OpenConnectorButton address={serverAddress} />
          ) : (
            <p className="rounded-lg bg-secondary px-3 py-2 text-xs text-muted-foreground">
              Available once Codeforge runs on a public HTTPS address. Local addresses only work with Claude Code.
            </p>
          )}
        </div>
      </Card>

      <Card className="gap-0 border-border bg-card p-6">
        <h2 className="text-sm font-semibold">How it works</h2>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          The Brain runs on Opus and specialists on Sonnet, on your own Claude account. Specialists load from the catalog of {agentCount} agents when needed, so nothing else needs installing. Codeforge never sees your Claude credentials and only has the access you approve.
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
