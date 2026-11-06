import { getProject } from "@/lib/data";
import { AgentCard } from "@/components/dashboard/agent-card";
import { ProjectTeam } from "@/components/agents/project-team";
import { ActivityLog } from "@/components/dashboard/activity-log";
import { AutoRefresh } from "@/components/dashboard/auto-refresh";
import { ProjectTasks } from "@/components/dashboard/project-tasks";
import { PhaseProgress } from "@/components/dashboard/phase-progress";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Share2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  const devAgents = project.agents.filter((a) => a.group === "development");
  const testAgents = project.agents.filter((a) => a.group === "testing");
  const brain = project.agents.find((a) => a.group === "orchestration");

  const budgetPct = Math.round((project.budget.tokensUsed / project.budget.tokensLimit) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/home/projects" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="flex flex-wrap items-center gap-2 text-xl font-bold tracking-tight">
              {project.name}
              {project.kind !== "anything" && (
                <Badge variant="outline" className="border-lime/30 bg-lime/10 text-[10px] capitalize text-lime">
                  {project.kind}
                </Badge>
              )}
            </h1>
            <p className="text-sm text-muted-foreground">{project.description}</p>
          </div>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:border-lime/30 transition-colors">
          <Share2 className="h-4 w-4" />
          Share
        </button>
      </div>

      <PhaseProgress phase={project.phase} progress={project.phaseProgress} />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border bg-card p-4 gap-0">
          <p className="text-xs text-muted-foreground">Token Budget</p>
          <p className="mt-1 text-2xl font-bold">{budgetPct}%</p>
          <div className="mt-2 h-1 rounded-full bg-secondary">
            <div className="h-1 rounded-full bg-lime transition-all" style={{ width: `${Math.min(budgetPct, 100)}%` }} />
          </div>
          <p className="mt-1 text-[10px] text-muted-foreground">
            {(project.budget.tokensUsed / 1000).toFixed(0)}k / {(project.budget.tokensLimit / 1000).toFixed(0)}k
          </p>
        </Card>
        <Card className="border-border bg-card p-4 gap-0">
          <p className="text-xs text-muted-foreground">Steps Used</p>
          <p className="mt-1 text-2xl font-bold">{project.budget.stepsUsed}</p>
          <p className="mt-1 text-[10px] text-muted-foreground">of {project.budget.stepsLimit} limit</p>
        </Card>
        <Card className="border-border bg-card p-4 gap-0">
          <p className="text-xs text-muted-foreground">Active Agents</p>
          <p className="mt-1 text-2xl font-bold">{project.agents.filter((a) => a.status === "working").length}</p>
          <p className="mt-1 text-[10px] text-muted-foreground">of {project.agents.length} total</p>
        </Card>
      </div>

      <AutoRefresh />
      <ProjectTeam team={project.divisions} />
      <ProjectTasks tasks={project.tasks} />

      {brain && (
        <div>
          <h2 className="mb-3 text-sm font-semibold flex items-center gap-2">
            <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-[10px]">
              Orchestrator
            </Badge>
            Brain
          </h2>
          <AgentCard agent={brain} />
        </div>
      )}

      {project.agents.length === 0 && (
        <Card className="border-border bg-card p-8 text-center gap-0">
          <p className="text-sm text-muted-foreground">
            Nobody is working on this project yet.{" "}
            <Link href="/home/connect" className="text-lime hover:underline">Connect Claude</Link>{" "}
            to start building.
          </p>
        </Card>
      )}

      {devAgents.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold">Development Team</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {devAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>
      )}

      {testAgents.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold">Testing Team</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {testAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>
      )}

      <ActivityLog events={project.events} />
    </div>
  );
}
