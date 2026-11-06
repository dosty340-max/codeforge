import { notFound } from "next/navigation";
import { AgentDetail } from "@/components/agents/agent-detail";
import { catalogAgents, getCatalogAgent } from "@/lib/agent-catalog";

export function generateStaticParams() {
  return catalogAgents.map((agent) => ({ slug: agent.slug }));
}

export default async function AppAgentPage({ params }: { params: Promise<{ slug: string }> }) {
  const agent = getCatalogAgent((await params).slug);
  if (!agent) notFound();
  return <AgentDetail agent={agent} basePath="/home/agents" />;
}
