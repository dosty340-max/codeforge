"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  agentCount,
  catalogAgents,
  divisionIcons,
  divisionIds,
  divisions,
  isDivisionId,
} from "@/lib/agent-catalog";
import { cn } from "@/lib/utils";

export function AgentCatalog({ basePath }: { basePath: string }) {
  const param = useSearchParams().get("division");
  const active = isDivisionId(param) ? param : null;
  const [query, setQuery] = useState("");

  // Match each term from the start of a word, so "unity" does not find "community".
  const terms = query
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((term) => new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i"));
  const matches = (text: string) => terms.every((term) => term.test(text));
  const results = catalogAgents
    .filter(
      (agent) =>
        (!active || agent.division === active) &&
        matches(`${agent.name} ${agent.description} ${agent.vibe}`)
    )
    .sort((a, b) => (terms.length ? Number(matches(b.name)) - Number(matches(a.name)) : 0));

  const chipClass = (selected: boolean) =>
    cn(
      "flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 text-xs transition-colors",
      selected
        ? "border-lime bg-lime text-lime-foreground"
        : "border-border text-muted-foreground hover:border-lime/30 hover:text-foreground"
    );

  return (
    <div className="space-y-5">
      <div className="relative mx-auto max-w-xl">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search agents"
          placeholder="Search by skill, like Unity, sales or security..."
          className="w-full rounded-xl border border-border bg-card py-3 pl-10 pr-4 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-lime"
        />
      </div>

      <nav aria-label="Departments" className="flex flex-wrap justify-center gap-2">
        <Link href={basePath} scroll={false} aria-current={active ? undefined : "page"} className={chipClass(!active)}>
          All {agentCount}
        </Link>
        {divisionIds.map((id) => {
          const Icon = divisionIcons[id];
          return (
            <Link
              key={id}
              href={`${basePath}?division=${id}`}
              scroll={false}
              aria-current={active === id ? "page" : undefined}
              className={chipClass(active === id)}
            >
              <Icon className="h-3.5 w-3.5" />
              {divisions[id].label} {divisions[id].count}
            </Link>
          );
        })}
      </nav>

      <p role="status" className="text-center text-xs text-muted-foreground">
        {results.length} {results.length === 1 ? "agent" : "agents"}
      </p>

      {results.length === 0 ? (
        <p className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          No agents match your search. Try a different skill or department.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((agent) => (
            <li key={agent.slug}>
              <Link
                href={`${basePath}/${agent.slug}`}
                className="flex h-full flex-col rounded-xl border border-border bg-card p-4 transition-colors hover:border-lime/30"
              >
                <span className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: divisions[agent.division].color }} />
                  {divisions[agent.division].label}
                </span>
                <span className="mt-2 text-sm font-semibold">
                  <span aria-hidden="true">{agent.emoji}</span> {agent.name}
                </span>
                <span className="mt-1 line-clamp-3 text-xs leading-relaxed text-muted-foreground">{agent.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
