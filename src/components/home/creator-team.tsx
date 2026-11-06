import { Brain, Check } from "lucide-react";
import { Pulse } from "@/components/landing/flow-pulse";
import type { Creator } from "@/lib/creators";

const rowY = (i: number) => 10 + i * 66;
const rowCenter = (i: number) => rowY(i) + 27;
const fromBrain = (i: number) => `M 308 170 C 390 170, 390 ${rowCenter(i)}, 470 ${rowCenter(i)}`;
const toOutput = (i: number) => `M 770 ${rowCenter(i)} C 850 ${rowCenter(i)}, 850 170, 930 170`;
const fromRequest = "M 230 340 L 230 248";

export function CreatorTeam({ creator }: { creator: Creator }) {
  const Output = creator.output.icon;

  return (
    <div className="relative mx-auto mt-6 w-full max-w-5xl px-4 sm:px-6">
      <svg viewBox="0 0 1200 340" role="img" aria-label={`The Brain leads ${creator.team.map((agent) => agent.name).join(", ")} to build ${creator.output.label.toLowerCase()}.`} className="hidden w-full md:block">
        <g fill="none" strokeWidth={1.5}>
          <path d={fromRequest} strokeDasharray="5 6" className="stroke-lime/60" />
          {creator.team.map((agent, i) => (
            <g key={agent.name}>
              <path d={fromBrain(i)} className="stroke-lime/40" />
              <path d={toOutput(i)} className="stroke-lime/25" />
            </g>
          ))}
        </g>

        <Pulse path={fromRequest} />
        {creator.team.map((agent, i) => (
          <g key={agent.name}>
            <Pulse path={fromBrain(i)} begin={i * 0.45} />
            <Pulse path={toOutput(i)} begin={1.6 + i * 0.45} />
          </g>
        ))}

        <circle cx={230} cy={170} r={78} fill="none" strokeWidth={1.5} className="stroke-lime motion-reduce:hidden">
          <animate attributeName="r" values="78;100" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0" dur="2.4s" repeatCount="indefinite" />
        </circle>
        <circle cx={230} cy={170} r={78} strokeWidth={1.5} className="fill-background stroke-lime" />
        <Brain x={194} y={118} width={72} height={72} strokeWidth={1} className="text-lime" />
        <text x={230} y={210} textAnchor="middle" className="fill-foreground text-[17px] font-bold">
          Brain
        </text>

        {creator.team.map((agent, i) => (
          <g key={agent.name}>
            <rect x={470} y={rowY(i)} width={300} height={54} rx={10} className="fill-card stroke-border" />
            <agent.icon x={486} y={rowY(i) + 16} width={22} height={22} className="text-lime" />
            <text x={520} y={rowCenter(i) + 5} className="fill-foreground text-[15px] font-semibold">
              {agent.name}
            </text>
          </g>
        ))}

        <rect x={930} y={100} width={220} height={140} rx={14} className="fill-lime/10 stroke-lime/60" />
        <Output x={1016} y={118} width={48} height={48} strokeWidth={1.25} className="text-lime" />
        <text x={1040} y={194} textAnchor="middle" className="fill-foreground text-[16px] font-bold">
          {creator.output.label}
        </text>
        <Check x={990} y={207} width={16} height={16} className="text-lime" />
        <text x={1012} y={220} className="fill-muted-foreground text-[13px]">
          Verified
        </text>
      </svg>

      <ul className="flex flex-wrap justify-center gap-2 md:hidden">
        <li className="flex items-center gap-1.5 rounded-full bg-lime px-3 py-1.5 text-xs font-semibold text-lime-foreground">
          <Brain className="h-3.5 w-3.5" /> Brain
        </li>
        {creator.team.map((agent) => (
          <li key={agent.name} className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs">
            <agent.icon className="h-3.5 w-3.5 text-lime" /> {agent.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
