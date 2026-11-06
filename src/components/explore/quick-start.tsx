"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function QuickStart() {
  const router = useRouter();
  const [idea, setIdea] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = idea.trim();
    router.push(text ? `/create?idea=${encodeURIComponent(text.slice(0, 1000))}` : "/create");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
      <div className="relative flex-1">
        <Sparkles className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-lime" />
        <input
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          maxLength={1000}
          aria-label="Describe what you want to build"
          placeholder="What should your team build?"
          className="w-full rounded-xl border border-border bg-background/80 py-3 pl-10 pr-3 text-sm backdrop-blur placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-lime"
        />
      </div>
      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-lime px-5 py-3 text-sm font-bold text-lime-foreground transition-colors hover:bg-lime/90"
      >
        Start building <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}
