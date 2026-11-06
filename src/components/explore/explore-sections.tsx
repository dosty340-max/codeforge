import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bot, FolderKanban, Globe, Plug, ShieldCheck, Zap } from "lucide-react";
import { StartBanner } from "@/components/explore/start-banner";
import { SceneVideo } from "@/components/landing/scene-video";
import { agentCount, divisionIds } from "@/lib/agent-catalog";
import { creators, creatorHref } from "@/lib/creators";

const tools = [
  { href: "/agents", icon: Bot, title: "Agent catalog", copy: `${agentCount} specialists in ${divisionIds.length} departments` },
  { href: "/create", icon: Zap, title: "Create anything", copy: "Describe it and your team starts" },
  { href: "/connect", icon: Plug, title: "Connect your AI", copy: "Claude Code, Claude, ChatGPT or Codex" },
  { href: "/home/projects", icon: FolderKanban, title: "Project dashboard", copy: "Steps, agents and budget, live" },
  { href: "/pricing#guardrails", icon: ShieldCheck, title: "Safety limits", copy: "Your team can't overrun your budget" },
  { href: "/home/shared", icon: Globe, title: "Shared results", copy: "Public links to your work" },
];

export function FeaturedCreators() {
  return (
    <section aria-label="Creators" className="mt-8 overflow-hidden motion-reduce:overflow-x-auto">
      <div
        className="marquee flex w-max hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]"
        style={{ animationDuration: "120s" }}
      >
        {[false, true].map((clone) => (
          <ul
            key={String(clone)}
            aria-hidden={clone || undefined}
            className={`flex shrink-0 gap-3 pr-3 sm:gap-4 sm:pr-4 ${clone ? "motion-reduce:hidden" : ""}`}
          >
            {creators.map((creator, index) => (
              <li key={creator.id} className="w-[80vw] sm:w-[44vw] xl:w-[30vw]">
                <Link href={creatorHref(creator)} tabIndex={clone ? -1 : undefined} className="group block">
                  <div className="overflow-hidden rounded-xl border border-border transition-colors group-hover:border-lime/50">
                    <SceneVideo
                      name={`creator-${creator.id}`}
                      label={`${creator.label} preview`}
                      startAt={2 + (index % 4)}
                      className="block aspect-[8/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <h2 className="mt-3 text-sm font-bold uppercase tracking-wide transition-colors group-hover:text-lime">
                    {creator.label}
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{creator.tagline}</p>
                </Link>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}

export function ToolsAndStart() {
  return (
    <section className="grid gap-3 sm:gap-4 lg:grid-cols-2">
      <div className="relative flex min-h-80 flex-col justify-end overflow-hidden rounded-xl border border-border p-5 sm:p-7 lg:order-2">
        <SceneVideo name="ambient" className="absolute inset-0 h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="relative">
          <h2 className="text-3xl font-black uppercase leading-[1.05] tracking-tight sm:text-5xl">
            Start building.
            <br />
            <span className="text-lime">Your team is ready.</span>
          </h2>
          <p className="mb-4 mt-3 max-w-md text-sm text-foreground/80">
            One Brain and {agentCount} specialists plan, build and verify software on your own Claude or ChatGPT account.
          </p>
          <StartBanner />
        </div>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
        {tools.map((tool) => (
          <li key={tool.title}>
            <Link
              href={tool.href}
              className="group flex h-full flex-col rounded-xl border border-border bg-card p-4 transition-colors hover:border-lime/50"
            >
              <tool.icon className="h-5 w-5 text-lime" />
              <span className="mt-6 text-sm font-semibold">{tool.title}</span>
              <span className="mt-1 text-xs leading-relaxed text-muted-foreground">{tool.copy}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function IdeaGallery() {
  return (
    <section className="mt-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold uppercase tracking-tight sm:text-3xl">Start from an idea</h2>
          <p className="mt-1 text-sm text-muted-foreground">Pick a starting point and make it yours.</p>
        </div>
        <Link href="/create" className="hidden items-center gap-1 whitespace-nowrap text-xs text-lime hover:underline sm:flex">
          Write your own <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <ul className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {creators.map((creator) => (
          <li key={creator.id}>
            <Link href={creatorHref(creator, creator.ideas[0])} className="group block">
              <div className="relative aspect-[8/5] overflow-hidden rounded-xl border border-border transition-colors group-hover:border-lime/50">
                <Image
                  src={`/video/creator-${creator.id}.jpg`}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="mt-2 text-[11px] font-bold uppercase tracking-wide text-lime">{creator.noun}</p>
              <p className="mt-0.5 text-sm leading-snug transition-colors group-hover:text-lime">{creator.ideas[0]}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
