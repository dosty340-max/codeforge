import { cn } from "@/lib/utils";
import type { ProjectPhase } from "@/lib/domain";

const phases: { key: ProjectPhase; label: string }[] = [
  { key: "planning", label: "Planning" },
  { key: "development", label: "Development" },
  { key: "testing", label: "Testing" },
  { key: "review", label: "Review" },
  { key: "complete", label: "Complete" },
];

const phaseIndex: Record<ProjectPhase, number> = { planning: 0, development: 1, testing: 2, review: 3, complete: 4 };

export function PhaseProgress({ phase, progress }: { phase: ProjectPhase; progress: number }) {
  const current = phaseIndex[phase];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium">{phases[current].label}</span>
        <span className="text-muted-foreground">{progress}%</span>
      </div>
      <div className="flex gap-1">
        {phases.map((p, i) => (
          <div key={p.key} className="flex-1">
            <div
              className={cn(
                "h-1.5 rounded-full transition-colors",
                i < current
                  ? "bg-lime"
                  : i === current
                    ? "bg-lime/60"
                    : "bg-secondary"
              )}
              style={i === current ? { width: `${progress}%`, minWidth: "10%" } : undefined}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        {phases.map((p, i) => (
          <span
            key={p.key}
            className={cn(
              "text-[10px]",
              i <= current ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {p.label}
          </span>
        ))}
      </div>
    </div>
  );
}
