"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { CommandBlock } from "@/components/agents/command-block";
import { AgentNetwork } from "@/components/connect/agent-network";
import type { Target } from "@/lib/claude-links";
import { getClients } from "@/lib/clients";
import { siteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

const serverAddress = `${siteUrl}/mcp`;
const clients = getClients(serverAddress);

export function McpClients() {
  const requested = useSearchParams().get("client");
  const [selected, setSelected] = useState<Target>(clients.find((client) => client.id === requested)?.id ?? "claude-code");
  const client = clients.find((candidate) => candidate.id === selected)!;

  return (
    <>
      <div role="tablist" aria-label="AI tool" className="border-b border-border bg-background">
        <div className="mx-auto flex w-max max-w-full items-center gap-1 overflow-x-auto px-3 [scrollbar-width:none]">
          {clients.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={item.id === selected}
              onClick={() => setSelected(item.id)}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium transition-colors",
                item.id === selected ? "border-lime text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <section className="relative overflow-hidden bg-black">
        <AgentNetwork className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.75),transparent_70%)]" />

        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-5 py-16 text-center sm:py-24">
          <h1 className="text-3xl font-black uppercase leading-[1.15] tracking-tight sm:text-5xl">
            Your AI team,
            <br />
            <span className="text-lime">
              ready in{" "}
              <span className="inline-flex h-[1.1em] w-[1.1em] items-center justify-center rounded-lg bg-foreground align-[-0.15em] text-background">
                <client.icon className="h-[0.75em] w-[0.75em]" />
              </span>{" "}
              {client.label}
            </span>
          </h1>

          <a
            href="#how-to-connect"
            className="mt-8 rounded-xl bg-foreground px-5 py-3 text-sm font-bold text-background transition-colors hover:bg-foreground/90"
          >
            How to connect?
          </a>
          <p className="mt-4 break-all font-mono text-xs text-muted-foreground">{serverAddress}</p>
        </div>
      </section>

      <section id="how-to-connect" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-14 sm:px-6">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">How to connect {client.label}</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-muted-foreground">{client.bestFor}</p>
        <ol className="mt-10 space-y-8">
          {client.steps.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime text-sm font-bold text-lime-foreground">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1 space-y-2">
                <h3 className="font-semibold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.copy}</p>
                {step.command && <CommandBlock command={step.command} />}
              </div>
            </li>
          ))}
        </ol>
        {client.note && <p className="mt-8 rounded-lg bg-secondary px-4 py-3 text-xs leading-relaxed text-muted-foreground">{client.note}</p>}
      </section>
    </>
  );
}
