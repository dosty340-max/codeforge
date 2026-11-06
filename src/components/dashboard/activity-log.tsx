import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Play,
  CheckCircle2,
  AlertCircle,
  Brain,
  Database,
  MessageCircleQuestion,
  AlertTriangle,
} from "lucide-react";
import type { ActivityEvent } from "@/lib/domain";
import { cn } from "@/lib/utils";

const typeConfig = {
  task_started: { icon: Play, color: "text-blue-400" },
  task_completed: { icon: CheckCircle2, color: "text-emerald-400" },
  error: { icon: AlertCircle, color: "text-red-400" },
  decision: { icon: Brain, color: "text-purple-400" },
  memory_write: { icon: Database, color: "text-cyan-400" },
  ask_user: { icon: MessageCircleQuestion, color: "text-amber-400" },
  budget_warning: { icon: AlertTriangle, color: "text-orange-400" },
};

// ponytail: uses the server's time zone, format on the client once deployed outside the user's zone
function formatTime(ts: string) {
  return new Date(ts).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ActivityLog({ events }: { events: ActivityEvent[] }) {
  if (events.length === 0) {
    return (
      <Card className="border-border bg-card p-0 gap-0">
        <div className="border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold">Activity Log</h3>
        </div>
        <p className="px-4 py-8 text-center text-xs text-muted-foreground">No activity yet.</p>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card p-0 gap-0">
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold">Activity Log</h3>
      </div>
      <ScrollArea className="h-[400px]">
        <div className="divide-y divide-border">
          {events.map((event) => {
            const cfg = typeConfig[event.type];
            const Icon = cfg.icon;
            return (
              <div key={event.id} className="flex gap-3 px-4 py-3">
                <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", cfg.color)} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-medium">{event.agentName}</span>
                    <span className="text-[10px] text-muted-foreground">{formatTime(event.timestamp)}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{event.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
}
