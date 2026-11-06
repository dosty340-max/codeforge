"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CommandBlock({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
    } catch {
      // The command stays visible, so people can still select it by hand.
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative">
      <pre className="overflow-x-auto rounded-lg border border-border bg-background p-4 pr-12 font-mono text-xs leading-relaxed text-muted-foreground">
        {command}
      </pre>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy command"}
        className="absolute right-2 top-2 rounded-md bg-secondary p-1.5 text-muted-foreground transition-colors hover:text-foreground"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-lime" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}
