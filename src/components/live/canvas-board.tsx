"use client";

import { Loader2, Maximize2, Monitor, Plus, Smartphone, Tablet } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { previewDocument, sortSections, type PreviewSection } from "@/lib/preview";
import { cn } from "@/lib/utils";

const devices = {
  desktop: { label: "Desktop", icon: Monitor, width: 1280 },
  tablet: { label: "Tablet", icon: Tablet, width: 820 },
  phone: { label: "Phone", icon: Smartphone, width: 390 },
};
type Device = keyof typeof devices;

const shell = previewDocument();

export type WorkingAgent = { name: string; task: string | null };

export function CanvasBoard({
  name,
  sections,
  working,
  waitingFor,
  initialDevice = "desktop",
}: {
  name: string;
  sections: PreviewSection[];
  working: WorkingAgent[];
  waitingFor: string;
  initialDevice?: Device;
}) {
  const [device, setDevice] = useState<Device>(initialDevice);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [ready, setReady] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const ordered = useMemo(() => sortSections(sections), [sections]);
  const visible = ordered.filter((section) => section.html);
  const feed = useMemo(() => [...visible].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)), [visible]);
  const now = working[0];
  const ghost = now ? `${now.name}${now.task ? `: ${now.task}` : " is working"}` : "";

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    const observer = new ResizeObserver(([entry]) =>
      setSize({ width: entry.contentRect.width, height: entry.contentRect.height })
    );
    observer.observe(board);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.source === frameRef.current?.contentWindow && event.data?.type === "agentwe-ready") setReady(true);
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    if (!ready) return;
    // The frame has an opaque origin, so "*" is the only target that can reach it.
    frameRef.current?.contentWindow?.postMessage({ type: "agentwe-sync", sections: ordered, working: ghost }, "*");
  }, [ready, ordered, ghost]);

  const width = devices[device].width;
  const scale = size.width ? Math.min(1, (size.width - 48) / width) : 1;
  const frameHeight = size.height ? Math.max(320, (size.height - 48) / scale - 36) : 640;

  return (
    <section aria-label="Live preview" className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_300px]">
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-2">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <span className="relative flex h-2.5 w-2.5" aria-hidden>
              {working.length > 0 && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-70" />}
              <span className={cn("relative inline-flex h-2.5 w-2.5 rounded-full", working.length ? "bg-lime" : "bg-muted-foreground/50")} />
            </span>
            {working.length ? "Live" : "Canvas"}
          </p>

          <div role="radiogroup" aria-label="Preview size" className="flex gap-0.5 rounded-lg bg-secondary p-0.5">
            {(Object.keys(devices) as Device[]).map((id) => {
              const Icon = devices[id].icon;
              return (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={device === id}
                  aria-label={devices[id].label}
                  onClick={() => setDevice(id)}
                  className={cn("rounded-md p-1.5 transition-colors", device === id ? "bg-background text-lime" : "text-muted-foreground hover:text-foreground")}
                >
                  <Icon className="h-4 w-4" />
                </button>
              );
            })}
          </div>

          <button
            type="button"
            aria-label="Show preview full screen"
            onClick={() => boardRef.current?.requestFullscreen?.().catch(() => {})}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>

        <div
          ref={boardRef}
          className="relative h-[68vh] min-h-[480px] overflow-hidden bg-background bg-[radial-gradient(rgba(255,255,255,0.09)_1px,transparent_1px)] [background-size:20px_20px]"
        >
          <div
            className="absolute left-1/2 top-6 origin-top overflow-hidden rounded-xl border border-border bg-white shadow-[0_0_80px_-20px_rgba(200,255,0,0.35)] transition-[width] duration-500"
            style={{ width, transform: `translateX(-50%) scale(${scale})` }}
          >
            <div className="flex h-9 items-center gap-1.5 bg-secondary px-3" aria-hidden>
              <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
              <span className="ml-2 truncate rounded bg-background/60 px-3 py-0.5 text-[11px] text-muted-foreground">{name}</span>
            </div>
            <div className="relative" style={{ height: frameHeight }}>
              {/* Only after mount, so the frame's ready message cannot arrive before we listen. */}
              {size.width > 0 && (
                <iframe
                  ref={frameRef}
                  title={`Live preview of ${name}`}
                  sandbox="allow-scripts"
                  srcDoc={shell}
                  className="block h-full w-full border-0 bg-white"
                />
              )}
              {visible.length === 0 && (
                <div className="absolute inset-0 flex flex-col bg-card p-8" aria-live="polite">
                  <div className="h-10 w-2/3 animate-pulse rounded-lg bg-secondary" />
                  <div className="mt-6 grid flex-1 grid-cols-3 gap-4">
                    <div className="col-span-2 animate-pulse rounded-xl bg-secondary" />
                    <div className="animate-pulse rounded-xl bg-secondary [animation-delay:200ms]" />
                    <div className="animate-pulse rounded-xl bg-secondary [animation-delay:400ms]" />
                    <div className="col-span-2 animate-pulse rounded-xl bg-secondary [animation-delay:600ms]" />
                  </div>
                  <p className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 text-center text-sm font-semibold text-foreground">
                    {waitingFor}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <aside aria-label="Build feed" className="rounded-2xl border border-border bg-card p-4 xl:max-h-[calc(68vh+45px)] xl:overflow-y-auto">
        <h2 className="text-sm font-semibold">What your team is doing</h2>
        {working.length === 0 && feed.length === 0 && (
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">Agents and new widgets appear here as they start.</p>
        )}
        <ul className="mt-3 space-y-2.5" aria-live="polite">
          {working.map((agent) => (
            <li key={agent.name} className="flex gap-2 rounded-lg bg-lime/10 p-2.5 text-xs">
              <Loader2 className="mt-0.5 h-3.5 w-3.5 shrink-0 animate-spin text-lime motion-reduce:animate-none" />
              <span className="min-w-0">
                <span className="block font-semibold">{agent.name}</span>
                <span className="block text-muted-foreground">{agent.task ?? "Working"}</span>
              </span>
            </li>
          ))}
          {feed.map((section) => (
            <li key={section.id} className="flex gap-2 p-2.5 text-xs">
              <Plus className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lime" />
              <span className="min-w-0">
                <span className="block font-semibold">
                  {section.title}
                  {section.version > 1 && <span className="ml-1 font-normal text-muted-foreground">v{section.version}</span>}
                </span>
                <span className="block text-muted-foreground">{section.agent}</span>
              </span>
            </li>
          ))}
        </ul>
      </aside>
    </section>
  );
}
