import { Users } from "lucide-react";
import Link from "next/link";
import { CommandBlock } from "@/components/agents/command-block";
import { Card } from "@/components/ui/card";
import { divisionIcons, divisions, isDivisionId, teamInstallCommand } from "@/lib/agent-catalog";

export function ProjectTeam({ team }: { team: string[] }) {
  const selected = team.filter(isDivisionId);
  const total = selected.reduce((sum, id) => sum + divisions[id].count, 0);

  return (
    <Card className="gap-0 border-border bg-card p-5">
      <h2 className="flex items-center gap-2 text-sm font-semibold">
        <Users className="h-4 w-4 text-lime" />
        Project team
        {total > 0 && <span className="font-normal text-muted-foreground">{total} specialists available</span>}
      </h2>

      {selected.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          No departments selected. The Brain will pick specialists from the{" "}
          <Link href="/home/agents" className="text-lime hover:underline">agent catalog</Link> for this project.
        </p>
      ) : (
        <>
          <ul className="mt-4 flex flex-wrap gap-2">
            {selected.map((id) => {
              const Icon = divisionIcons[id];
              return (
                <li key={id}>
                  <Link
                    href={`/home/agents?division=${id}`}
                    className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs transition-colors hover:border-lime/30"
                  >
                    <Icon className="h-3.5 w-3.5" style={{ color: divisions[id].color }} />
                    {divisions[id].label} {divisions[id].count}
                  </Link>
                </li>
              );
            })}
          </ul>
          <details className="mt-4 text-xs text-muted-foreground">
            <summary className="cursor-pointer">Use these agents without Codeforge</summary>
            <p className="mb-2 mt-2">The plugin loads specialists automatically. To install this team directly in Claude Code, run:</p>
            <CommandBlock command={teamInstallCommand(selected)} />
          </details>
        </>
      )}
    </Card>
  );
}
