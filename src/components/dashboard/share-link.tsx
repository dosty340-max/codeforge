"use client";

import { ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CommandBlock } from "@/components/agents/command-block";
import { siteUrl } from "@/lib/site";

export function ShareLink({ projectId, token }: { projectId: string; token: string }) {
  const router = useRouter();
  const [stopping, setStopping] = useState(false);
  const [error, setError] = useState("");
  const path = `/share/${token}`;

  async function stopSharing() {
    setStopping(true);
    setError("");
    const res = await fetch(`/api/projects/${projectId}/share`, { method: "DELETE" });
    if (!res.ok || res.redirected) {
      setError("Could not stop sharing. Please try again.");
      setStopping(false);
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-2">
      <CommandBlock command={`${siteUrl}${path}`} />
      <div className="flex flex-wrap items-center gap-4 text-xs">
        <a href={path} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-lime hover:underline">
          Open <ExternalLink className="h-3 w-3" />
        </a>
        <button
          type="button"
          onClick={stopSharing}
          disabled={stopping}
          className="text-muted-foreground hover:text-foreground disabled:opacity-50"
        >
          {stopping ? "Stopping..." : "Stop sharing"}
        </button>
        {error && <span role="alert" className="text-destructive">{error}</span>}
      </div>
    </div>
  );
}
