import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { MemoryEntry } from "@/lib/data";

export function ProjectMemory({ entries }: { entries: MemoryEntry[] }) {
  if (entries.length === 0) return null;

  return (
    <Card className="gap-0 border-border bg-card p-0">
      <h2 className="border-b border-border px-4 py-3 text-sm font-semibold">Shared memory</h2>
      <div className="divide-y divide-border">
        {entries.map((entry) => (
          <details key={`${entry.category}/${entry.key}`} className="group px-4 py-3">
            <summary className="flex cursor-pointer list-none items-center gap-2 text-sm [&::-webkit-details-marker]:hidden">
              <span className="font-mono text-xs text-lime">{entry.category}</span>
              <span className="min-w-0 flex-1 truncate">{entry.key}</span>
              <span className="font-mono text-xs text-muted-foreground">v{entry.version}</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform group-open:rotate-180" />
            </summary>
            <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap font-mono text-xs leading-relaxed text-muted-foreground">
              {entry.content}
            </pre>
          </details>
        ))}
      </div>
    </Card>
  );
}
