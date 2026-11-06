import { AlertCircle, CheckCircle2, Circle, Loader2, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { ProjectTask } from "@/lib/data";
import { MAX_REPAIR_LOOPS } from "@/lib/mcp/guardrails";

const statusView = {
  pending: { icon: Circle, label: "Waiting", color: "text-muted-foreground" },
  in_progress: { icon: Loader2, label: "In progress", color: "text-lime" },
  done: { icon: CheckCircle2, label: "Verified", color: "text-emerald-400" },
  error: { icon: AlertCircle, label: "Needs you", color: "text-red-400" },
};

export function ProjectTasks({ tasks }: { tasks: ProjectTask[] }) {
  if (tasks.length === 0) return null;
  const done = tasks.filter((task) => task.status === "done").length;

  return (
    <Card className="gap-0 border-border bg-card p-0">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold">Steps</h2>
        <span className="font-mono text-xs text-muted-foreground">
          {done} of {tasks.length} verified
        </span>
      </div>
      <ul className="divide-y divide-border">
        {tasks.map((task) => {
          const view = statusView[task.status];
          return (
            <li key={task.id} className="flex gap-3 px-4 py-3">
              <view.icon className={`mt-0.5 h-4 w-4 shrink-0 ${view.color}`} />
              <div className="min-w-0 flex-1">
                <p className="text-sm">{task.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {view.label}
                  {task.assignedTo && ` · ${task.assignedTo}`}
                </p>
                {task.attempts > 0 && task.status !== "done" && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-amber-400">
                    <RotateCcw className="h-3 w-3" />
                    Repair {Math.min(task.attempts, MAX_REPAIR_LOOPS)} of {MAX_REPAIR_LOOPS}: {task.lastError}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
