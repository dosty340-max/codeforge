import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { SceneVideo } from "@/components/landing/scene-video";
import { TeamDiagram } from "@/components/landing/team-diagram";
import { agentCount, divisionIcons, divisionIds, divisions } from "@/lib/agent-catalog";

const steps = [
  {
    scene: "plan" as const,
    eyebrow: "01 — Plan",
    title: "One sentence becomes a real plan",
    copy: "Describe your project. The Brain turns it into a spec, contracts and tasks, then assigns each task to the right specialist.",
    points: ["Spec, contracts, decisions and tasks in shared memory", "Every memory entry is versioned", "Only the Brain can change a contract"],
    label: "A typed project request is split by the Brain into four tasks",
  },
  {
    scene: "build" as const,
    eyebrow: "02 — Build",
    title: "A whole team works at once",
    copy: "Specialists build in parallel, each in its own folder. You follow phases, agents, progress and budget live on your dashboard.",
    points: ["A separate folder for every agent", "Live activity log for each project", "Token and step budget per project"],
    label: "Development agents progress in parallel while the project budget grows",
  },
  {
    scene: "verify" as const,
    eyebrow: "03 — Verify",
    title: "Done means it passed, not that an agent said so",
    copy: "A project is only finished when it meets verifiable criteria. Failures go back for repair, and you get results you can share with a public link.",
    points: ["Functional, security and performance testing", "Independent code review", "Up to three repair loops, then it asks you"],
    label: "A checklist of build, lint, tests and review passes one by one",
  },
];

export function Steps() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-20 space-y-24 px-6 py-24">
      <div className="reveal mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">From idea to verified result</h2>
        <p className="mt-4 text-muted-foreground">Three stages, one conversation. Here is what happens after you press enter.</p>
      </div>

      {steps.map((step, i) => (
        <div key={step.scene} className="reveal grid items-center gap-10 lg:grid-cols-2">
          <div className={i % 2 === 1 ? "lg:order-2" : undefined}>
            <p className="font-mono text-sm text-lime">{step.eyebrow}</p>
            <h3 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{step.title}</h3>
            <p className="mt-4 leading-relaxed text-muted-foreground">{step.copy}</p>
            <ul className="mt-6 space-y-3">
              {step.points.map((point) => (
                <li key={point} className="flex gap-3 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-lime" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <SceneVideo
            name={step.scene}
            label={step.label}
            className="block aspect-[8/5] w-full rounded-xl border border-border object-cover"
          />
        </div>
      ))}
    </section>
  );
}

export function Team() {
  return (
    <section id="team" className="scroll-mt-20 border-y border-border bg-card/40">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="reveal mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What happens when you press Enter</h2>
          <p className="mt-4 text-muted-foreground">
            One Brain picks from {agentCount} specialists in {divisionIds.length} departments, on your own Claude or
            ChatGPT account. You only talk to the Brain.
          </p>
        </div>

        <div className="reveal mt-12">
          <TeamDiagram />
        </div>

        <ul className="reveal mt-12 flex flex-wrap justify-center gap-2">
          {divisionIds.map((id) => {
            const Icon = divisionIcons[id];
            return (
              <li key={id}>
                <Link
                  href={`/agents?division=${id}`}
                  className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium transition-colors hover:border-lime/30"
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: divisions[id].color }} />
                  {divisions[id].label}
                  <span className="font-mono text-muted-foreground">{divisions[id].count}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="reveal mt-8 text-center">
          <Link
            href="/agents"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-semibold transition-colors hover:border-lime/30"
          >
            Browse all {agentCount} agents <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
