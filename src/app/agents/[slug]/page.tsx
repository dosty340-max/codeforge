import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AgentDetail } from "@/components/agents/agent-detail";
import { catalogAgents, getCatalogAgent } from "@/lib/agent-catalog";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return catalogAgents.map((agent) => ({ slug: agent.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const agent = getCatalogAgent((await params).slug);
  return agent ? { title: agent.name, description: agent.description } : {};
}

export default async function PublicAgentPage({ params }: Props) {
  const agent = getCatalogAgent((await params).slug);
  if (!agent) notFound();
  return <AgentDetail agent={agent} basePath="/agents" />;
}
