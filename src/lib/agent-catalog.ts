import {
  Box,
  Boxes,
  ClipboardList,
  Code,
  DollarSign,
  FlaskConical,
  Gamepad2,
  GraduationCap,
  LifeBuoy,
  Map,
  Megaphone,
  PenTool,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Target,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import catalog from "@/data/agent-catalog.json";

export type DivisionId = keyof typeof catalog.divisions;

export type CatalogAgent = Omit<(typeof catalog.agents)[number], "division"> & { division: DivisionId };

export const divisions = catalog.divisions;
export const divisionIds = Object.keys(divisions) as DivisionId[];
export const catalogAgents = catalog.agents as CatalogAgent[];
export const agentCount = catalogAgents.length;

export const divisionIcons: Record<DivisionId, LucideIcon> = {
  academic: GraduationCap,
  design: PenTool,
  engineering: Code,
  finance: DollarSign,
  "game-development": Gamepad2,
  gis: Map,
  healthcare: Stethoscope,
  marketing: Megaphone,
  "paid-media": Target,
  product: Box,
  "project-management": ClipboardList,
  research: Search,
  sales: TrendingUp,
  security: ShieldCheck,
  "spatial-computing": Boxes,
  specialized: Sparkles,
  support: LifeBuoy,
  testing: FlaskConical,
};

const REPOSITORY = `https://github.com/${catalog.source}`;

export const repositoryUrl = REPOSITORY;

export function agentSourceUrl(agent: CatalogAgent) {
  return `${REPOSITORY}/blob/${catalog.commit}/${agent.path}`;
}

export function getCatalogAgent(slug: string) {
  return catalogAgents.find((agent) => agent.slug === slug);
}

export function isDivisionId(value: string | null): value is DivisionId {
  return value !== null && value in divisions;
}

function installCommand(selection: string) {
  return [
    `git clone ${REPOSITORY}.git`,
    "cd agency-agents",
    `git checkout ${catalog.commit}`,
    `./scripts/install.sh --tool claude-code --no-interactive ${selection}`,
  ].join(" && ");
}

export function teamInstallCommand(team: readonly string[]) {
  return installCommand(`--division ${team.join(",")}`);
}

export function agentInstallCommand(agent: CatalogAgent) {
  return installCommand(`--agent ${agent.slug}`);
}
