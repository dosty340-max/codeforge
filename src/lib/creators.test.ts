import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { creators } from "./creators.ts";

test("every creator's team uses real catalog agents", () => {
  const catalog = JSON.parse(readFileSync("src/data/agent-catalog.json", "utf8"));
  const names = new Set(catalog.agents.map((agent: { name: string }) => agent.name));
  for (const creator of creators) {
    assert.equal(creator.team.length, 5, creator.id);
    for (const agent of creator.team) assert.ok(names.has(agent.name), `${creator.id}: ${agent.name}`);
  }
});
