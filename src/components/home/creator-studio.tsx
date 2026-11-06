"use client";

import { ArrowUpRight, Check, Copy } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { CreatorTeam } from "@/components/home/creator-team";
import {
  DEFAULT_BRAIN,
  DEFAULT_SPECIALISTS,
  knownModel,
  models,
  targetLink,
  targetPrompt,
  type Target,
} from "@/lib/claude-links";
import { getClients } from "@/lib/clients";
import { siteUrl } from "@/lib/site";
import { creatorHref, getCreator, type Creator } from "@/lib/creators";
import { createClient } from "@/lib/supabase/client";
import { useCurrentUser } from "@/lib/use-session";

const FOLDER_KEY = "agentwe-project-folder";
const BRAIN_KEY = "agentwe-brain-model";
const SPECIALISTS_KEY = "agentwe-specialist-model";
const TARGET_KEY = "agentwe-target";
const clients = getClients(`${siteUrl}/mcp`);
const targetNotes: Record<Target, string> = {
  "claude-code": "Your request opens ready to send, press Enter to start.",
  "claude-chrome": "Opens in Claude with your Brain model selected. One model does all the work.",
  chatgpt: "Opens in ChatGPT with your request. Choose the model in ChatGPT.",
  codex: "Paste the command in your terminal. Choose the model with /model in Codex.",
};
const selectClass =
  "rounded-lg border border-border bg-secondary px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-lime";
const storageListeners = new Set<() => void>();

function readStored(key: string) {
  try {
    return window.localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

function saveStored(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Without storage the choice simply is not remembered.
  }
  storageListeners.forEach((listener) => listener());
}

function subscribeToStorage(listener: () => void) {
  storageListeners.add(listener);
  return () => storageListeners.delete(listener);
}

function useStored(key: string) {
  return useSyncExternalStore(subscribeToStorage, () => readStored(key), () => "");
}

function StudioHero({ creator, children }: { creator: Creator; children?: React.ReactNode }) {
  return (
    <section className="relative flex min-h-[calc(100vh-7rem)] flex-col justify-between overflow-hidden rounded-2xl border border-border">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,255,0,0.09),transparent_65%)]" />

      <div className="relative px-6 pt-10 text-center sm:pt-12">
        <h1 className="text-4xl font-black uppercase leading-[1.05] tracking-tight sm:text-6xl">
          {creator.headline[0]}
          <br />
          <span className="text-lime">{creator.headline[1]}</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-foreground/80 sm:text-base">{creator.tagline}</p>
      </div>

      <CreatorTeam creator={creator} />

      {children}
    </section>
  );
}

export function StudioPlaceholder() {
  return <StudioHero creator={getCreator(null)} />;
}

function Studio({ creator, initialIdea }: { creator: Creator; initialIdea: string }) {
  const { ready, user } = useCurrentUser();
  const [connected, setConnected] = useState(true);
  const [idea, setIdea] = useState(initialIdea);
  const [choices, setChoices] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const folder = useStored(FOLDER_KEY);
  const brain = knownModel(useStored(BRAIN_KEY), DEFAULT_BRAIN);
  const specialists = knownModel(useStored(SPECIALISTS_KEY), DEFAULT_SPECIALISTS);
  const storedTarget = useStored(TARGET_KEY);
  const client = clients.find((item) => item.id === storedTarget) ?? clients[0];
  const target = client.id;

  const hasIdea = idea.trim().length > 0;

  useEffect(() => {
    if (!user) return;
    createClient()
      .from("mcp_connections")
      .select("last_seen_at")
      .maybeSingle()
      .then(({ data }) => setConnected(!!data));
  }, [user]);

  const signInLink = `/login?next=${encodeURIComponent(creatorHref(creator, idea.trim().slice(0, 1000)))}`;
  const request = {
    noun: creator.noun,
    choices: Object.entries(choices)
      .filter(([, value]) => value)
      .map(([label, value]) => `${label}: ${value}`),
    idea,
    brain,
    specialists,
  };
  const prompt = targetPrompt(target, request, folder);
  const link = targetLink(target, request, folder);

  function chooseIdea(text: string) {
    setIdea(text);
    inputRef.current?.focus();
    inputRef.current?.scrollIntoView({ block: "center" });
  }

  async function copyCommand() {
    try {
      await navigator.clipboard.writeText(prompt);
    } catch {
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function askForIdea(e: React.MouseEvent) {
    if (hasIdea) return;
    e.preventDefault();
    inputRef.current?.focus();
  }

  function open(e: React.MouseEvent) {
    askForIdea(e);
    if (hasIdea && user && target !== "claude-code") void navigator.clipboard.writeText(prompt).catch(() => {});
  }

  return (
    <>
      <StudioHero creator={creator}>
        <div className="relative mx-auto w-full max-w-4xl p-3 sm:p-6">
          <div className="rounded-2xl border border-border bg-background/85 p-3 backdrop-blur-md sm:p-4">
            <textarea
              ref={inputRef}
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              rows={2}
              maxLength={4000}
              aria-label={`Describe your ${creator.noun.toLowerCase()}`}
              placeholder={creator.placeholder}
              className="w-full resize-none bg-transparent px-1 text-base leading-relaxed placeholder:text-muted-foreground/70 focus:outline-none"
            />

            <div className="mt-3 flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {creator.options.map((option) => (
                  <select
                    key={option.label}
                    aria-label={option.label}
                    value={choices[option.label] ?? ""}
                    onChange={(e) => setChoices((current) => ({ ...current, [option.label]: e.target.value }))}
                    className={selectClass}
                  >
                    <option value="">{option.label}: Any</option>
                    {option.values.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                ))}
                {(target === "claude-code" || target === "claude-chrome") && (
                <select
                  aria-label="Brain model"
                  value={brain}
                  onChange={(e) => saveStored(BRAIN_KEY, e.target.value)}
                  className={selectClass}
                >
                  {models.map((model) => (
                    <option key={model.id} value={model.id}>
                      Brain: {model.label}
                    </option>
                  ))}
                </select>
                )}
                {target === "claude-code" && (
                <select
                  aria-label="Specialist model"
                  value={specialists}
                  onChange={(e) => saveStored(SPECIALISTS_KEY, e.target.value)}
                  className={selectClass}
                >
                  {models.map((model) => (
                    <option key={model.id} value={model.id}>
                      Specialists: {model.label}
                    </option>
                  ))}
                </select>
                )}
                {(target === "claude-code" || target === "codex") && (
                <input
                  value={folder}
                  onChange={(e) => saveStored(FOLDER_KEY, e.target.value)}
                  aria-label="Project folder on your computer"
                  placeholder="Folder: /Users/you/my-game"
                  spellCheck={false}
                  className="w-52 rounded-lg border border-border bg-secondary px-2.5 py-1.5 font-mono text-xs placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-lime"
                />
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <div role="radiogroup" aria-label="Where to build" className="flex flex-wrap gap-1 rounded-xl bg-secondary p-1">
                  {clients.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      role="radio"
                      aria-checked={item.id === target}
                      onClick={() => saveStored(TARGET_KEY, item.id)}
                      className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                        item.id === target ? "bg-background text-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <item.icon className="h-3.5 w-3.5" />
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-1 items-center justify-end gap-2 sm:flex-none">
                  {link && (
                    <button
                      type="button"
                      onClick={copyCommand}
                      disabled={!hasIdea}
                      aria-label={copied ? "Copied" : "Copy request"}
                      className="rounded-xl border border-border p-3 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
                    >
                      {copied ? <Check className="h-4 w-4 text-lime" /> : <Copy className="h-4 w-4" />}
                    </button>
                  )}
                  {link || !user ? (
                    <a
                      href={!hasIdea ? "#" : user ? link ?? "#" : signInLink}
                      target={hasIdea && user && target !== "claude-code" ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      onClick={open}
                      className="inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-lime px-5 py-3 text-sm font-bold text-lime-foreground transition-colors hover:bg-lime/90 sm:flex-none"
                    >
                      <client.icon className="h-4 w-4" />
                      {link ? `Open in ${client.label}` : "Copy Codex command"}
                      {target !== "claude-code" && link && <ArrowUpRight className="h-4 w-4" />}
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={hasIdea ? copyCommand : () => inputRef.current?.focus()}
                      className="inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-lime px-5 py-3 text-sm font-bold text-lime-foreground transition-colors hover:bg-lime/90 sm:flex-none"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <client.icon className="h-4 w-4" />}
                      {copied ? "Copied" : "Copy Codex command"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <p className="mt-3 text-center text-xs text-foreground/70">
            {ready && !user ? (
              "Free to try. You will sign in before your team starts."
            ) : (
              <>
                {targetNotes[target]}{" "}
                {!connected && (
                  <Link href={`/connect?client=${target}`} className="text-lime hover:underline">
                    First time? Set up {client.label}
                  </Link>
                )}
              </>
            )}
          </p>
        </div>
      </StudioHero>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Start from an idea</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {creator.ideas.map((text) => (
            <li key={text}>
              <button
                type="button"
                onClick={() => chooseIdea(text)}
                className="h-full w-full rounded-xl border border-border bg-card p-4 text-left text-sm leading-relaxed transition-colors hover:border-lime/40"
              >
                {text}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export function CreatorStudio() {
  const searchParams = useSearchParams();
  const creator = getCreator(searchParams.get("type"));
  return <Studio key={creator.id} creator={creator} initialIdea={searchParams.get("idea") ?? ""} />;
}
