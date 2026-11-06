import Link from "next/link";
import { ArrowRight, Brain, Check } from "lucide-react";
import { SceneVideo } from "@/components/landing/scene-video";
import { agentCount, divisionIcons, divisionIds, divisions } from "@/lib/agent-catalog";

const steps = [
  {
    scene: "plan" as const,
    eyebrow: "01 — Plan",
    title: "One sentence becomes a real plan",
    copy: "Describe your project to Claude. The Brain turns it into a spec, contracts and tasks, then assigns each task to the right specialist.",
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

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-5xl px-6 pt-20 sm:pt-28 text-center">
        <p className="text-sm font-medium text-lime">Websites. Apps. Games. Startups. Anything you can describe.</p>
        <h1 className="mt-5 text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl">
          Describe it.
          <br />
          <span className="text-lime">Codeforge builds it.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Your AI company, led by Claude. One Brain and {agentCount} specialists plan, build, test
          and deliver whatever you have in mind, while you stay in control from a single conversation.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-lg bg-lime px-6 py-3 text-sm font-semibold text-lime-foreground transition-colors hover:bg-lime/90"
          >
            Start building free <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="#how-it-works"
            className="inline-flex items-center rounded-lg border border-border px-6 py-3 text-sm text-muted-foreground transition-colors hover:border-lime/30 hover:text-foreground"
          >
            See how it works
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-6xl px-6">
        <div className="hero-fade relative overflow-hidden rounded-t-xl border-x border-t border-border">
          <SceneVideo
            name="network"
            label="The Brain sends tasks to eight specialist agents arranged around it"
            className="block aspect-video w-full object-cover"
          />
        </div>
        <p className="-mt-4 text-center text-xs text-muted-foreground">Illustrative product preview</p>
      </div>
    </section>
  );
}

export function RoleMarquee() {
  const names = ["Brain", ...divisionIds.map((id) => divisions[id].label)];
  return (
    <div className="mt-16 overflow-hidden border-y border-border py-4" aria-hidden="true">
      <div className="marquee flex w-max gap-10 font-mono text-sm text-muted-foreground">
        {[...names, ...names, ...names, ...names].map((name, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap">
            {name}
            <span className="h-1 w-1 rounded-full bg-lime" />
          </span>
        ))}
      </div>
    </div>
  );
}

export function Steps() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-28 space-y-24 px-6 py-24">
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
    <section id="team" className="scroll-mt-28 border-y border-border bg-card/40">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="reveal mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">A whole company of specialists</h2>
          <p className="mt-4 text-muted-foreground">
            {agentCount} agents across {divisionIds.length} departments, each doing one job well.
            Pick the teams your project needs. You only talk to the Brain.
          </p>
        </div>

        <div className="reveal mx-auto mt-12 flex max-w-2xl items-center gap-4 rounded-xl border border-lime/30 bg-lime/5 p-5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-lime text-lime-foreground">
            <Brain className="h-6 w-6" />
          </span>
          <div>
            <h3 className="font-semibold">
              Brain <span className="ml-1 font-mono text-xs font-normal text-lime">Opus 5.5</span>
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Splits the work into tasks, hands each to the right specialist and checks every step before work moves on.
            </p>
          </div>
        </div>

        <ul className="reveal mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {divisionIds.map((id) => {
            const Icon = divisionIcons[id];
            return (
              <li key={id}>
                <Link
                  href={`/agents?division=${id}`}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-lime/30"
                >
                  <Icon className="h-5 w-5 shrink-0" style={{ color: divisions[id].color }} />
                  <span className="flex-1 text-sm font-semibold">{divisions[id].label}</span>
                  <span className="font-mono text-xs text-muted-foreground">{divisions[id].count}</span>
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
