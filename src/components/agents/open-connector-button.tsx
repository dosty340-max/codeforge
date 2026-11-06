"use client";

import { ExternalLink } from "lucide-react";

const CONNECTORS_URL = "https://claude.ai/customize/connectors";

export function OpenConnectorButton({ address }: { address: string }) {
  async function open() {
    // Open first: browsers block pop-ups that start after an awaited call.
    window.open(CONNECTORS_URL, "_blank", "noopener,noreferrer");
    await navigator.clipboard.writeText(address).catch(() => {});
  }

  return (
    <button
      type="button"
      onClick={open}
      className="inline-flex items-center gap-2 rounded-lg bg-lime px-4 py-2 text-sm font-semibold text-lime-foreground transition-colors hover:bg-lime/90"
    >
      Copy address and open Claude <ExternalLink className="h-4 w-4" />
    </button>
  );
}
