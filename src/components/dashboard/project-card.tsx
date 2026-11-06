import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import type { Project, ProjectPhase } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const phaseColors: Record<ProjectPhase, string> = {
  planning: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  development: "bg-lime/20 text-lime border-lime/30",
  testing: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  review: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  complete: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

export function ProjectCard({ project }: { project: Project }) {
  const activeAgents = project.agents.filter((a) => a.status === "working").length;

  return (
    <Link href={`/home/projects/${project.id}`}>
      <Card className="group border-border bg-card p-5 transition-colors hover:border-lime/30 gap-0">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-sm group-hover:text-lime transition-colors">{project.name}</h3>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{project.description}</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Badge variant="outline" className={cn("text-[10px]", phaseColors[project.phase])}>
            {project.phase}
          </Badge>
          {activeAgents > 0 && (
            <span className="text-[10px] text-muted-foreground">
              {activeAgents} agent{activeAgents !== 1 && "s"} active
            </span>
          )}
        </div>

        <div className="mt-3">
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
            <span>Progress</span>
            <span>{project.phaseProgress}%</span>
          </div>
          <div className="h-1 rounded-full bg-secondary">
            <div
              className="h-1 rounded-full bg-lime transition-all"
              style={{ width: `${project.phaseProgress}%` }}
            />
          </div>
        </div>

        <div className="mt-3 flex gap-4 text-[10px] text-muted-foreground">
          <span>{(project.budget.tokensUsed / 1000).toFixed(0)}k tokens</span>
          <span>{project.budget.stepsUsed} steps</span>
        </div>
      </Card>
    </Link>
  );
}
