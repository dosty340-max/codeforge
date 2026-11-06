import { createClient } from "@supabase/supabase-js";
import { CheckCircle2, Circle, CircleAlert, Loader2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PhaseProgress } from "@/components/dashboard/phase-progress";
import { LogoFull } from "@/components/logo";
import { divisions, isDivisionId } from "@/lib/agent-catalog";
import type { ProjectPhase } from "@/lib/domain";

export const metadata: Metadata = { title: "Shared project", robots: { index: false } };

type SharedProject = {
  name: string;
  description: string;
  kind: string;
  phase: ProjectPhase;
  progress: number;
  divisions: string[];
  tasks: { title: string; status: "pending" | "in_progress" | "done" | "error"; result: string | null }[];
};

const statusIcons = {
  pending: { icon: Circle, label: "Waiting", color: "text-muted-foreground" },
  in_progress: { icon: Loader2, label: "In progress", color: "text-lime" },
  done: { icon: CheckCircle2, label: "Verified", color: "text-emerald-400" },
  error: { icon: CircleAlert, label: "Stopped", color: "text-red-400" },
};

async function getSharedProject(token: string) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token)) return null;

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await supabase.rpc("get_shared_project", { token });
  if (error) throw new Error(error.message);
  return data as SharedProject | null;
}

export default async function SharedProjectPage({ params }: { params: Promise<{ token: string }> }) {
  const project = await getSharedProject((await params).token);
  if (!project) notFound();

  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-3 px-4">
          <Link href="/" aria-label="AgentWe home">
            <LogoFull />
          </Link>
          <Link href="/register" className="whitespace-nowrap text-sm font-semibold text-lime hover:underline">
            Build yours
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-8 px-4 py-10">
        <div>
          {project.kind !== "anything" && <p className="text-sm capitalize text-lime">{project.kind}</p>}
          <h1 className="mt-1 text-3xl font-bold tracking-tight">{project.name}</h1>
          {project.description && <p className="mt-3 leading-relaxed text-muted-foreground">{project.description}</p>}
        </div>

        <PhaseProgress phase={project.phase} progress={project.progress} />

        {project.divisions.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold">Team</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {project.divisions.filter(isDivisionId).map((id) => (
                <li key={id} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                  {divisions[id].label}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <h2 className="text-sm font-semibold">Results</h2>
          {project.tasks.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">No results yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-border rounded-xl border border-border bg-card">
              {project.tasks.map((task, index) => {
                const status = statusIcons[task.status];
                return (
                  <li key={index} className="flex gap-3 p-4">
                    <status.icon className={`mt-0.5 h-4 w-4 shrink-0 ${status.color}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{status.label}</p>
                      {task.status === "done" && task.result && (
                        <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap font-mono text-xs leading-relaxed text-muted-foreground">
                          {task.result}
                        </pre>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
