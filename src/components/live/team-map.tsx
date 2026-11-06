import { Brain, Check, Circle } from "lucide-react";
import { Pulse } from "@/components/landing/flow-pulse";
import type { Creator } from "@/lib/creators";
import { cn } from "@/lib/utils";

export type MapAgent = { name: string; status: "idle" | "working" | "done" | "error" | "waiting"; task: string | null };

const statusStyles: Record<MapAgent["status"], { label: string; dot: string }> = {
  working: { label: "Working", dot: "fill-lime" },
  done: { label: "Done", dot: "fill-emerald-400" },
  error: { label: "Stopped", dot: "fill-red-400" },
  waiting: { label: "Waiting for you", dot: "fill-amber-400" },
  idle: { label: "Queued", dot: "fill-muted-foreground/50" },
};

const VISIBLE_AGENTS = 8;
const ROW = 66;

export function TeamMap({
  output,
  agents,
  brainWorking,
  doneTasks,
  totalTasks,
}: {
  output: Creator["output"];
  agents: MapAgent[];
  brainWorking: boolean;
  doneTasks: number;
  totalTasks: number;
}) {
  const shown = agents.slice(0, VISIBLE_AGENTS);
  const hidden = agents.length - shown.length;
  const rows = Math.max(shown.length, 1);
  const height = Math.max(240, rows * ROW + 20);
  const center = height / 2;
  const rowY = (i: number) => (height - rows * ROW) / 2 + i * ROW + 6;
  const rowCenter = (i: number) => rowY(i) + 27;
  const fromBrain = (i: number) => `M 208 ${center} C 290 ${center}, 290 ${rowCenter(i)}, 370 ${rowCenter(i)}`;
  const toOutput = (i: number) => `M 770 ${rowCenter(i)} C 850 ${rowCenter(i)}, 850 ${center}, 930 ${center}`;
  const Output = output.icon;

  return (
    <section aria-label="Your team right now" className="rounded-2xl border border-border bg-card p-4 sm:p-6">
      <h2 className="text-sm font-semibold">Your team right now</h2>

      <svg viewBox={`0 0 1160 ${height}`} aria-hidden className="mt-3 hidden w-full md:block">
        <g fill="none" strokeWidth={1.5}>
          {shown.map((agent, i) => (
            <g key={agent.name}>
              <path d={fromBrain(i)} className={agent.status === "working" ? "stroke-lime/70" : "stroke-border"} />
              <path d={toOutput(i)} className={agent.status === "done" ? "stroke-lime/40" : "stroke-border"} />
            </g>
          ))}
        </g>
        {shown.map((agent, i) =>
          agent.status === "working" ? <Pulse key={agent.name} path={fromBrain(i)} begin={i * 0.45} /> : null
        )}
        {shown.map((agent, i) =>
          agent.status === "done" ? <Pulse key={agent.name} path={toOutput(i)} begin={i * 0.45} /> : null
        )}

        {brainWorking && (
          <circle cx={130} cy={center} r={78} fill="none" strokeWidth={1.5} className="stroke-lime motion-reduce:hidden">
            <animate attributeName="r" values="78;100" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0" dur="2.4s" repeatCount="indefinite" />
          </circle>
        )}
        <circle cx={130} cy={center} r={78} strokeWidth={1.5} className="fill-background stroke-lime" />
        <Brain x={94} y={center - 52} width={72} height={72} strokeWidth={1} className="text-lime" />
        <text x={130} y={center + 40} textAnchor="middle" className="fill-foreground text-[17px] font-bold">
          Brain
        </text>

        {agents.length === 0 && (
          <text x={570} y={center + 5} textAnchor="middle" className="fill-muted-foreground text-[15px]">
            The Brain picks specialists when it plans the work
          </text>
        )}

        {shown.map((agent, i) => {
          const style = statusStyles[agent.status];
          return (
            <g key={agent.name}>
              <rect
                x={370}
                y={rowY(i)}
                width={400}
                height={54}
                rx={10}
                className={cn("fill-background", agent.status === "working" ? "stroke-lime/70" : "stroke-border")}
              />
              <Circle x={384} y={rowY(i) + 20} width={14} height={14} strokeWidth={0} className={style.dot} />
              <text x={408} y={rowY(i) + 23} className="fill-foreground text-[14px] font-semibold">
                {agent.name}
              </text>
              <text x={408} y={rowY(i) + 42} className="fill-muted-foreground text-[12px]">
                {(agent.task ?? style.label).slice(0, 52)}
              </text>
            </g>
          );
        })}

        <rect x={930} y={center - 70} width={220} height={140} rx={14} className="fill-lime/10 stroke-lime/60" />
        <Output x={1016} y={center - 52} width={48} height={48} strokeWidth={1.25} className="text-lime" />
        <text x={1040} y={center + 24} textAnchor="middle" className="fill-foreground text-[16px] font-bold">
          {output.label}
        </text>
        <Check x={980} y={center + 37} width={16} height={16} className="text-lime" />
        <text x={1002} y={center + 50} className="fill-muted-foreground text-[13px]">
          {doneTasks} of {totalTasks} tasks verified
        </text>
      </svg>

      <ul className="mt-3 space-y-2 md:hidden">
        <li className="flex items-center gap-2 rounded-lg bg-lime px-3 py-2 text-xs font-semibold text-lime-foreground">
          <Brain className="h-4 w-4" /> Brain
        </li>
        {agents.map((agent) => (
          <li key={agent.name} className="rounded-lg border border-border p-3 text-xs">
            <span className="block font-semibold">{agent.name}</span>
            <span className="block text-muted-foreground">{agent.task ?? statusStyles[agent.status].label}</span>
          </li>
        ))}
        <li className="text-xs text-muted-foreground">
          {output.label}: {doneTasks} of {totalTasks} tasks verified
        </li>
      </ul>

      {hidden > 0 && <p className="mt-2 text-center text-xs text-muted-foreground">and {hidden} more specialists</p>}
    </section>
  );
}
