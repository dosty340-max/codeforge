"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useCurrentUser } from "@/lib/use-session";

const primaryClass =
  "inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-lime px-5 py-3 text-sm font-bold text-lime-foreground transition-colors hover:bg-lime/90 sm:flex-none";
const secondaryClass =
  "inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-xl border border-border bg-background/70 px-5 py-3 text-sm font-bold backdrop-blur transition-colors hover:border-lime/40 sm:flex-none";

export function StartBanner() {
  const { ready, user } = useCurrentUser();

  return (
    <div className={`flex flex-wrap gap-2 transition-opacity ${ready ? "opacity-100" : "invisible opacity-0"}`}>
      {user ? (
        <>
          <Link href="/create" className={primaryClass}>
            Start a project <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/home/projects" className={secondaryClass}>
            Your projects
          </Link>
        </>
      ) : (
        <>
          <Link href="/register" className={primaryClass}>
            Start free <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/login" className={secondaryClass}>
            Log in
          </Link>
        </>
      )}
    </div>
  );
}
