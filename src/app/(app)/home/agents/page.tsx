import { AgentCard } from "@/components/dashboard/agent-card";
import { AgentCatalog } from "@/components/agents/agent-catalog";
import { getProjects } from "@/lib/data";
import { agentCount } from "@/lib/agent-catalog";

export default async function AgentsPage() {
  const projects = await getProjects();
  const running = projects.flatMap((project) =>
    project.agents.map((agent) => ({ agent, projectName: project.name }))
  );

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      {running.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">On your projects</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {running.map(({ agent, projectName }) => (
              <div key={agent.id}>
                <AgentCard agent={agent} />
                <p className="mt-1 truncate text-[10px] text-muted-foreground">{projectName}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-5">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Agent catalog</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {agentCount} specialists you can bring into your projects
          </p>
        </div>
        <AgentCatalog basePath="/home/agents" />
      </section>
    </div>
  );
}
