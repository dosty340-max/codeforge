"use client";

import { ChevronDown, Sparkles, Users, Zap } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { divisionIcons, divisionIds, divisions, type DivisionId } from "@/lib/agent-catalog";
import { getProjectKind } from "@/lib/project-kinds";
import { cn } from "@/lib/utils";

const MAX_NAME_LENGTH = 60;

export function NewProjectForm() {
  const router = useRouter();
  const kind = getProjectKind(useSearchParams().get("type"));
  const inputRef = useRef<HTMLInputElement>(null);
  const [prompt, setPrompt] = useState("");
  const [customTeams, setCustomTeams] = useState<Record<string, DivisionId[]>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const team = customTeams[kind.id] ?? kind.divisions;
  const specialists = team.reduce((sum, id) => sum + divisions[id].count, 0);

  useEffect(() => {
    if (kind.id !== "anything") inputRef.current?.focus();
  }, [kind.id]);

  function toggleDivision(id: DivisionId) {
    const next = team.includes(id) ? team.filter((d) => d !== id) : [...team, id];
    setCustomTeams((teams) => ({ ...teams, [kind.id]: next }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const description = prompt.trim();
    if (!description) return;

    setError("");
    setLoading(true);

    const name =
      description.length > MAX_NAME_LENGTH ? `${description.slice(0, MAX_NAME_LENGTH)}…` : description;

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, kind: kind.id, divisions: team }),
    });

    // Expired sessions come back as a followed redirect to the login page.
    if (!res.ok || res.redirected) {
      setError("Could not create the project. Please try again.");
      setLoading(false);
      return;
    }

    const project = await res.json();
    router.push(`/home/projects/${project.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-2xl space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Sparkles className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-lime" />
          <input
            ref={inputRef}
            id="new-project"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            maxLength={2000}
            required
            aria-label="Describe your project"
            placeholder={kind.placeholder}
            className="w-full scroll-mt-32 rounded-xl border border-border bg-background/80 py-3 pl-10 pr-4 text-sm backdrop-blur placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-lime"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-lime px-5 py-3 text-sm font-semibold text-lime-foreground transition-colors hover:bg-lime/90 disabled:opacity-50"
        >
          <Zap className="h-4 w-4" />
          {loading ? "Creating..." : "Build"}
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {kind.examples.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => setPrompt(example)}
            className="rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-lime/30 hover:text-foreground"
          >
            {example}
          </button>
        ))}
      </div>

      <details className="group rounded-xl border border-border bg-background/60 text-left backdrop-blur">
        <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-2.5 text-xs [&::-webkit-details-marker]:hidden">
          <Users className="h-3.5 w-3.5 shrink-0 text-lime" />
          <span className="min-w-0 flex-1 truncate">
            {team.length === 0
              ? "Team: the Brain picks the specialists"
              : `Team: ${team.map((id) => divisions[id].label).join(", ")}`}
          </span>
          {specialists > 0 && <span className="shrink-0 text-muted-foreground">{specialists} specialists</span>}
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
        </summary>
        <div className="flex flex-wrap gap-2 border-t border-border p-3">
          {divisionIds.map((id) => {
            const Icon = divisionIcons[id];
            const selected = team.includes(id);
            return (
              <button
                key={id}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleDivision(id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors",
                  selected
                    ? "border-lime bg-lime text-lime-foreground"
                    : "border-border text-muted-foreground hover:border-lime/30 hover:text-foreground"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {divisions[id].label} {divisions[id].count}
              </button>
            );
          })}
        </div>
      </details>

      {error && <p role="alert" className="text-xs text-destructive">{error}</p>}
    </form>
  );
}
