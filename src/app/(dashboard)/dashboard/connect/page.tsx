import { Card } from "@/components/ui/card";
import { Plug, Copy, ExternalLink } from "lucide-react";

export default function ConnectPage() {
  const mcpConfig = `{
  "mcpServers": {
    "ai-firma": {
      "url": "https://your-domain.com/mcp",
      "transport": "streamable-http"
    }
  }
}`;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Connect to Claude</h1>
        <p className="text-sm text-muted-foreground">
          Add the AI Firma MCP connector to your Claude account to start building projects
        </p>
      </div>

      <Card className="border-border bg-card p-6 gap-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lime/10">
            <Plug className="h-5 w-5 text-lime" />
          </div>
          <div>
            <h2 className="font-semibold">MCP Connector Setup</h2>
            <p className="text-xs text-muted-foreground">3 simple steps</p>
          </div>
        </div>

        <ol className="space-y-6">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lime text-lime-foreground text-xs font-bold">
              1
            </span>
            <div>
              <p className="text-sm font-medium">Open Claude Settings</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Go to Claude &rarr; Settings &rarr; MCP Connectors
              </p>
            </div>
          </li>

          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lime text-lime-foreground text-xs font-bold">
              2
            </span>
            <div>
              <p className="text-sm font-medium">Add the connector</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Click &quot;Add MCP Connector&quot; and paste this configuration:
              </p>
              <div className="mt-3 relative">
                <pre className="rounded-lg bg-background border border-border p-4 text-xs font-mono text-muted-foreground overflow-x-auto">
                  {mcpConfig}
                </pre>
                <button className="absolute top-2 right-2 p-1.5 rounded-md bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors">
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </li>

          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lime text-lime-foreground text-xs font-bold">
              3
            </span>
            <div>
              <p className="text-sm font-medium">Authorize</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Claude will redirect you to sign in with your AI Firma account. Once authorized, you&apos;re ready to go!
              </p>
            </div>
          </li>
        </ol>
      </Card>

      <Card className="border-border bg-card p-6 gap-0">
        <h3 className="font-semibold text-sm">How it works</h3>
        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
          AI Firma works as an MCP server that connects to your Claude account.
          When you describe a project to Claude, the Brain agent (Opus 5.5) breaks it down
          and coordinates sub-agents (Sonnet 5.5) to build it.
          You use your own Claude API — we never touch your tokens.
        </p>
        <a
          href="#"
          className="mt-3 inline-flex items-center gap-1 text-xs text-lime hover:underline"
        >
          Learn more about MCP <ExternalLink className="h-3 w-3" />
        </a>
      </Card>
    </div>
  );
}
