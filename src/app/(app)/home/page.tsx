import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Bot,
  FolderKanban,
  Plug,
  Share2,
  TrendingUp,
  Zap,
} from "lucide-react";
import { ActivityLog } from "@/components/dashboard/activity-log";
import { AutoRefresh } from "@/components/dashboard/auto-refresh";
import { NewProjectForm } from "@/components/home/new-project-form";
import { SceneVideo } from "@/components/landing/scene-video";
import { getCurrentUser, getProjects, getRecentEvents } from "@/lib/data";

const onboarding = [
  { icon: Zap, title: "Describe a project", copy: "Use the box above to create your first project.", href: "/home#new-project" },
  { icon: Plug, title: "Connect Claude", copy: "Add the Codeforge connector to your Claude account.", href: "/home/connect" },
  { icon: Bot, title: "Follow your team", copy: "Agents and activity appear here as work starts.", href: "/home/agents" },
];

const shortcuts = [
  { icon: FolderKanban, label: "All projects", href: "/home/projects" },
  { icon: Plug, label: "Connect Claude", href: "/home/connect" },
  { icon: Share2, label: "Shared results", href: "/home/shared" },
];

export default async function HomePage() {
  const [user, projects, events] = await Promise.all([
    getCurrentUser(),
    getProjects(),
    getRecentEvents(),
  ]);

  const firstName = user.name.split(/\s+/)[0];
  const activeProjects = projects.filter((p) => p.phase !== "complete").length;
  const activeAgents = projects.flatMap((p) => p.agents).filter((a) => a.status === "working").length;
  const totalTokens = projects.reduce((s, p) => s + p.budget.tokensUsed, 0);
  const completedProjects = projects.length - activeProjects;

  const stats = [
    { label: "Active projects", value: activeProjects, icon: FolderKanban },
    { label: "Agents working", value: activeAgents, icon: Bot, live: activeAgents > 0 },
    { label: "Completed", value: completedProjects, icon: TrendingUp },
    { label: "Tokens used", value: `${(totalTokens / 1000).toFixed(0)}k`, icon: Zap },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <AutoRefresh />
      <section className="relative overflow-hidden rounded-xl border border-border px-6 py-14 text-center sm:py-20">
        <SceneVideo name="network" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--background)_25%,transparent_85%)]" />
        <div className="relative">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {firstName ? `Welcome back, ${firstName}` : "Welcome back"}
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            What should your team build next?
          </p>
          <NewProjectForm />
        </div>
      </section>

      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card p-5 text-center">
            <dt className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <stat.icon className="h-3.5 w-3.5 text-lime" />
              {stat.label}
              {stat.live && <span className="text-[9px] font-bold text-lime">LIVE</span>}
            </dt>
            <dd className="mt-2 text-3xl font-bold tracking-tight">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{projects.length === 0 ? "Get started" : "Recent projects"}</h2>
            {projects.length > 0 && (
              <Link href="/home/projects" className="flex items-center gap-1 text-xs text-lime hover:underline">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>

          {projects.length === 0 ? (
            <ol className="grid gap-3 sm:grid-cols-3">
              {onboarding.map((step, i) => (
                <li key={step.title}>
                  <Link
                    href={step.href}
                    className="block h-full rounded-xl border border-border bg-card p-5 transition-colors hover:border-lime/30"
                  >
                    <span className="flex items-center justify-between">
                      <step.icon className="h-4 w-4 text-lime" />
                      <span className="font-mono text-xs text-muted-foreground">{i + 1}</span>
                    </span>
                    <span className="mt-4 block text-sm font-semibold">{step.title}</span>
                    <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{step.copy}</span>
                  </Link>
                </li>
              ))}
            </ol>
          ) : (
            <div className="space-y-3">
              {projects.slice(0, 5).map((project) => (
                <Link key={project.id} href={`/home/projects/${project.id}`} className="block">
                  <Card className="group gap-0 border-border bg-card p-4 transition-colors hover:border-lime/30">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium transition-colors group-hover:text-lime">{project.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{project.description}</p>
                      </div>
                      <Badge variant="outline" className="shrink-0 border-lime/30 bg-lime/10 text-[10px] text-lime">
                        {project.phase}
                      </Badge>
                    </div>
                    <div className="mt-3 h-1 rounded-full bg-secondary">
                      <div className="h-1 rounded-full bg-lime" style={{ width: `${project.phaseProgress}%` }} />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          <nav aria-label="Shortcuts" className="grid gap-3 sm:grid-cols-3">
            {shortcuts.map((shortcut) => (
              <Link
                key={shortcut.href}
                href={shortcut.href}
                className="flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:border-lime/30 hover:text-foreground"
              >
                <shortcut.icon className="h-3.5 w-3.5" />
                {shortcut.label}
              </Link>
            ))}
          </nav>
        </section>

        <ActivityLog events={events} />
      </div>
    </div>
  );
}
