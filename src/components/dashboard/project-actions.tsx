"use client";

import { Share2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ProjectActions({ projectId, name, shared }: { projectId: string; name: string; shared: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function run(request: Promise<Response>, failure: string, onDone: () => void) {
    setBusy(true);
    setError("");
    const res = await request;
    setBusy(false);
    if (!res.ok || res.redirected) {
      setError(failure);
      return;
    }
    onDone();
  }

  function share() {
    void run(fetch(`/api/projects/${projectId}/share`, { method: "POST" }), "Could not create a link.", () => router.refresh());
  }

  function remove() {
    if (!window.confirm(`Delete "${name}"? This removes its tasks, memory and activity and cannot be undone.`)) return;
    void run(fetch(`/api/projects/${projectId}`, { method: "DELETE" }), "Could not delete the project.", () => {
      router.push("/home/projects");
      router.refresh();
    });
  }

  return (
    <div className="flex shrink-0 flex-col items-end gap-1">
      <div className="flex gap-2">
        {!shared && (
          <button
            type="button"
            onClick={share}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-lime/30 hover:text-foreground disabled:opacity-50"
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
        )}
        <button
          type="button"
          onClick={remove}
          disabled={busy}
          aria-label="Delete project"
          className="rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      {error && <p role="alert" className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
