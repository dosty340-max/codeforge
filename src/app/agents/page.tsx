import type { Metadata } from "next";
import { Suspense } from "react";
import { AgentCatalog } from "@/components/agents/agent-catalog";
import { agentCount, divisionIds } from "@/lib/agent-catalog";

export const metadata: Metadata = {
  title: "Agent catalog",
  description: `Browse ${agentCount} specialist AI agents across ${divisionIds.length} departments.`,
};

export default function AgentsCatalogPage() {
  return (
    <div className="space-y-8">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {agentCount} specialists. <span className="text-lime">One team.</span>
        </h1>
        <p className="mt-4 text-muted-foreground">
          Every agent does one job well, from game design to sales. Pick the departments your project needs and the Brain coordinates them.
        </p>
      </header>
      <Suspense>
        <AgentCatalog basePath="/agents" />
      </Suspense>
    </div>
  );
}
