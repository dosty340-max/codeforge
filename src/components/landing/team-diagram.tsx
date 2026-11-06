import { Brain, Check, Database, Send, Users, type LucideIcon } from "lucide-react";
import { Pulse } from "@/components/landing/flow-pulse";
import { agentCount, divisionIcons, divisions, type DivisionId } from "@/lib/agent-catalog";

const shown: DivisionId[] = ["engineering", "design", "game-development", "marketing", "testing"];
const rowY = (i: number) => 50 + i * 76;
const fromBrain = (i: number) => `M 610 265 C 710 265, 730 ${rowY(i) + 31}, 830 ${rowY(i) + 31}`;

const steps: { icon: LucideIcon; title: string; copy: string }[] = [
  { icon: Send, title: "You press Enter in Claude Code", copy: "Your request goes to the Brain, on your own Claude account." },
  { icon: Brain, title: "The Brain plans the work", copy: "It splits your idea into tasks and picks the fewest specialists that cover them. You choose its model." },
  { icon: Users, title: "Specialists build in parallel", copy: "Each works in its own folder on your computer, on the model you choose." },
  { icon: Database, title: "Every step is saved", copy: "Tasks, memory, limits and budget live on the AgentWe server, and your dashboard follows along." },
  { icon: Check, title: "The Brain checks the evidence", copy: "Work counts as done only when its checks really passed." },
];

function Step({ x, y, n, title }: { x: number; y: number; n: number; title: string }) {
  return (
    <g>
      <circle cx={x + 10} cy={y - 5} r={10} className="fill-lime" />
      <text x={x + 10} y={y} textAnchor="middle" className="fill-lime-foreground text-[12px] font-bold">
        {n}
      </text>
      <text x={x + 28} y={y} className="fill-foreground text-[15px] font-semibold">
        {title}
      </text>
    </g>
  );
}

function Drawing() {
  const toBrain = "M 290 265 L 410 265";
  const toResult = "M 510 165 L 510 84";
  const toServer = "M 510 365 L 510 470";
  const fromTeam = "M 985 452 C 985 535, 850 535, 690 535";
  const toDashboard = "M 330 535 L 250 535";

  return (
    <svg viewBox="0 0 1160 610" aria-hidden className="hidden w-full md:block">
      <g fill="none" strokeWidth={1.5}>
        <path d={toBrain} className="stroke-lime/50" />
        <path d={toResult} className="stroke-lime/50" />
        {shown.map((id, i) => (
          <path key={id} d={fromBrain(i)} className="stroke-lime/40" />
        ))}
        {[toServer, fromTeam, toDashboard].map((d) => (
          <path key={d} d={d} strokeDasharray="5 6" className="stroke-muted-foreground/50" />
        ))}
      </g>

      <Pulse path={toBrain} />
      <Pulse path={toResult} begin={1.6} />
      <Pulse path={toServer} begin={0.8} />
      <Pulse path={fromTeam} begin={1.2} />
      <Pulse path={toDashboard} begin={2} />
      {shown.map((id, i) => (
        <g key={id}>
          <Pulse path={fromBrain(i)} begin={i * 0.45} />
          <Pulse path={fromBrain(i)} begin={1.6 + i * 0.45} back />
        </g>
      ))}

      <Step x={20} y={160} n={1} title="You press Enter" />
      <rect x={20} y={180} width={270} height={170} rx={12} className="fill-card stroke-border" />
      <circle cx={40} cy={200} r={4} className="fill-muted-foreground/40" />
      <circle cx={54} cy={200} r={4} className="fill-muted-foreground/40" />
      <circle cx={68} cy={200} r={4} className="fill-muted-foreground/40" />
      <text x={275} y={205} textAnchor="end" className="fill-muted-foreground text-[12px]">
        Claude Code
      </text>
      <g className="font-mono text-[14px]">
        <text x={40} y={245} className="fill-lime">
          &gt; /agentwe:build
        </text>
        <text x={40} y={271} className="fill-foreground">
          A booking site for
        </text>
        <text x={40} y={295} className="fill-foreground">
          my barbershop
        </text>
      </g>
      <rect x={160} y={282} width={8} height={16} className="fill-lime">
        <animate attributeName="opacity" values="1;0;1" dur="1.2s" repeatCount="indefinite" />
      </rect>

      <circle cx={510} cy={265} r={100} fill="none" strokeWidth={1.5} className="stroke-lime motion-reduce:hidden">
        <animate attributeName="r" values="100;126" dur="2.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0" dur="2.4s" repeatCount="indefinite" />
      </circle>
      <circle cx={510} cy={265} r={100} strokeWidth={1.5} className="fill-background stroke-lime" />
      <Brain x={460} y={192} width={100} height={100} strokeWidth={1} className="text-lime" />
      <text x={510} y={318} textAnchor="middle" className="fill-foreground text-[18px] font-bold">
        Brain
      </text>
      <text x={510} y={338} textAnchor="middle" className="fill-lime text-[12px]">
        You pick the model
      </text>
      <text x={495} y={400} textAnchor="end" className="fill-muted-foreground text-[13px]">
        Plans, assigns and
      </text>
      <text x={495} y={418} textAnchor="end" className="fill-muted-foreground text-[13px]">
        checks every step
      </text>

      <Step x={830} y={22} n={3} title="Specialists work side by side" />
      {shown.map((id, i) => {
        const Icon = divisionIcons[id];
        return (
          <g key={id}>
            <rect x={830} y={rowY(i)} width={310} height={62} rx={10} className="fill-card stroke-border" />
            <Icon x={846} y={rowY(i) + 20} width={22} height={22} style={{ color: divisions[id].color }} />
            <text x={880} y={rowY(i) + 28} className="fill-foreground text-[14px] font-semibold">
              {divisions[id].label}
            </text>
            <text x={880} y={rowY(i) + 46} className="fill-muted-foreground text-[12px]">
              Own folder, your model
            </text>
          </g>
        );
      })}
      <text x={985} y={438} textAnchor="middle" className="fill-lime text-[13px] font-semibold">
        {agentCount} specialists to choose from
      </text>

      <rect x={400} y={20} width={220} height={64} rx={10} className="fill-lime/10 stroke-lime/60" />
      <Check x={414} y={40} width={24} height={24} className="text-lime" />
      <text x={448} y={48} className="fill-foreground text-[14px] font-semibold">
        Verified result
      </text>
      <text x={448} y={67} className="fill-muted-foreground text-[12px]">
        Done only with evidence
      </text>
      <circle cx={400} cy={20} r={10} className="fill-lime" />
      <text x={400} y={25} textAnchor="middle" className="fill-lime-foreground text-[12px] font-bold">
        5
      </text>

      <rect x={330} y={470} width={360} height={130} rx={12} className="fill-card stroke-border" />
      <Step x={348} y={504} n={4} title="AgentWe saves every step" />
      {["Tasks", "Memory", "Limits", "Budget"].map((label, i) => (
        <g key={label}>
          <rect x={348 + i * 83} y={530} width={75} height={34} rx={8} className="fill-secondary stroke-border" />
          <text x={385.5 + i * 83} y={552} textAnchor="middle" className="fill-foreground text-[12px]">
            {label}
          </text>
        </g>
      ))}

      <rect x={20} y={480} width={230} height={110} rx={12} className="fill-card stroke-border" />
      <text x={38} y={510} className="fill-foreground text-[14px] font-semibold">
        Your dashboard
      </text>
      <text x={38} y={530} className="fill-muted-foreground text-[12px]">
        Live progress
      </text>
      {[150, 96, 124].map((width, i) => (
        <g key={width}>
          <rect x={38} y={544 + i * 11} width={194} height={5} rx={2.5} className="fill-secondary" />
          <rect x={38} y={544 + i * 11} width={width} height={5} rx={2.5} className="fill-lime" />
        </g>
      ))}
    </svg>
  );
}

export function TeamDiagram() {
  return (
    <>
      <Drawing />
      <ol className="space-y-5 md:sr-only">
        {steps.map((step, i) => (
          <li key={step.title} className="flex gap-4">
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border ${
                i === 1 ? "border-lime bg-lime text-lime-foreground" : "border-border bg-card text-lime"
              }`}
            >
              <step.icon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-semibold">{step.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.copy}</p>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
