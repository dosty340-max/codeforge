import Link from "next/link";
import { CommandBlock } from "@/components/agents/command-block";
import { Card } from "@/components/ui/card";
import { agentCount, repositoryUrl, teamInstallCommand } from "@/lib/agent-catalog";
import { ExternalLink, Plug, Users } from "lucide-react";

const mcpUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/mcp`;

const toolNames = [
  "create_project",
  "create_task",
  "get_task",
  "submit_result",
  "read_memory",
  "write_memory",
  "report_status",
  "ask_user",
  "list_projects",
];

export default function ConnectPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Connect to Claude</h1>
        <p className="text-sm text-muted-foreground">
          Connect Codeforge so Claude can create projects and report progress to your dashboard
        </p>
      </div>

      <Card className="border-border bg-card p-6 gap-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lime/10">
            <Plug className="h-5 w-5 text-lime" />
          </div>
          <div>
            <h2 className="font-semibold">Connect Claude Code</h2>
            <p className="text-xs text-muted-foreground">Two steps</p>
          </div>
        </div>

        <ol className="space-y-6">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lime text-lime-foreground text-xs font-bold">1</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">Add the Codeforge server</p>
              <div className="mt-3">
                <CommandBlock command={`claude mcp add --transport http codeforge ${mcpUrl}`} />
              </div>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lime text-lime-foreground text-xs font-bold">2</span>
            <div>
              <p className="text-sm font-medium">Sign in</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Run <code className="font-mono text-foreground">/mcp</code> in Claude Code, choose codeforge and approve access with your Codeforge account.
              </p>
            </div>
          </li>
        </ol>

        <p className="mt-6 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
          Using Claude on the web or desktop? Add a custom connector with this server address. It needs Codeforge running on a public HTTPS address.
        </p>
      </Card>

      <Card className="border-border bg-card p-6 gap-0">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lime/10">
            <Users className="h-5 w-5 text-lime" />
          </div>
          <div>
            <h2 className="font-semibold">Add specialists to Claude Code</h2>
            <p className="text-xs text-muted-foreground">Choose from {agentCount} agents in the catalog</p>
          </div>
        </div>
        <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
          Each project page has the exact command for its team. To start with a core team, run:
        </p>
        <CommandBlock command={teamInstallCommand(["engineering", "design", "testing"])} />
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
            Agent catalog source <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </Card>

      <Card className="border-border bg-card p-6 gap-0">
        <h2 className="font-semibold text-sm">What Claude can do once connected</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {toolNames.map((tool) => (
            <li key={tool} className="rounded-md bg-background px-2 py-1 font-mono text-[11px] text-muted-foreground">
              {tool}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          All agents run on your own Claude account. Codeforge never sees your Claude credentials and only accepts access you approve.
        </p>
      </Card>
    </div>
  );
}
