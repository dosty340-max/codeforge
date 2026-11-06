import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { CatalogAgent } from "@/lib/agent-catalog";

export function readAgentInstructions(agent: CatalogAgent) {
  const file = readFileSync(join(process.cwd(), "vendor/agency-agents", agent.path), "utf8");
  return file.replace(/^---[\s\S]*?\n---\r?\n/, "").trim();
}
