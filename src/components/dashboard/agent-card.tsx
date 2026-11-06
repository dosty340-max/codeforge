import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Bot, Loader2, CheckCircle2, AlertCircle, Clock, Pause } from "lucide-react";
import type { Agent, AgentStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const statusConfig: Record<AgentStatus, { label: string; color: string; icon: typeof Bot }> = {
  working: { label: "Working", color: "bg-lime/20 text-lime border-lime/30", icon: Loader2 },
  done: { label: "Done", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", icon: CheckCircle2 },
  error: { label: "Error", color: "bg-red-500/20 text-red-400 border-red-500/30", icon: AlertCircle },
  waiting: { label: "Waiting", color: "bg-amber-500/20 text-amber-400 border-amber-500/30", icon: Clock },
  idle: { label: "Idle", color: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30", icon: Pause },
};

export function AgentCard({ agent }: { agent: Agent }) {
  const s = statusConfig[agent.status];
  const Icon = s.icon;

  return (
    <Card className="border-border bg-card p-4 gap-0">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
            <Bot className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">{agent.name}</p>
            <p className="text-xs capitalize text-muted-foreground font-mono">
              {agent.model.replace(/^claude-/, "").replace(/-(\d+)-(\d+)$/, " $1.$2")}
            </p>
          </div>
        </div>
        <Badge variant="outline" className={cn("text-[10px] gap-1", s.color)}>
          <Icon className={cn("h-3 w-3", agent.status === "working" && "animate-spin")} />
          {s.label}
        </Badge>
      </div>
      {agent.currentTask && (
        <p className="mt-3 text-xs text-muted-foreground line-clamp-2">{agent.currentTask}</p>
      )}
      <div className="mt-3 flex gap-4 text-[10px] text-muted-foreground">
        <span>{(agent.tokensUsed / 1000).toFixed(0)}k tokens</span>
        <span>{agent.stepsUsed} steps</span>
      </div>
    </Card>
  );
}
