import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Copy, Globe } from "lucide-react";

const sharedProjects = [
  {
    id: "p2",
    name: "Portfolio Website",
    sharedAt: "2026-11-05",
    views: 42,
    url: "https://aifirma.app/share/abc123",
  },
];

export default function SharedPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Shared Results</h1>
        <p className="text-sm text-muted-foreground">Public links to your completed projects</p>
      </div>

      {sharedProjects.length === 0 ? (
        <Card className="border-border bg-card p-8 text-center gap-0">
          <Globe className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            No shared projects yet. Complete a project and share it with a public link.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {sharedProjects.map((p) => (
            <Card key={p.id} className="border-border bg-card p-4 gap-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold">{p.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Shared on {p.sharedAt} &middot; {p.views} views
                  </p>
                </div>
                <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">
                  Public
                </Badge>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <code className="flex-1 rounded-md bg-background border border-border px-3 py-1.5 text-xs text-muted-foreground font-mono truncate">
                  {p.url}
                </code>
                <button className="p-1.5 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                  <Copy className="h-3.5 w-3.5" />
                </button>
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
