"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderKanban,
  Plug,
  Settings,
  Share2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoFull } from "@/components/logo";

const nav = [
  { href: "/dashboard", label: "Projects", icon: FolderKanban },
  { href: "/dashboard/connect", label: "Connect Claude", icon: Plug },
  { href: "/dashboard/shared", label: "Shared Results", icon: Share2 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
          <Link href="/">
            <LogoFull />
          </Link>
          <button onClick={onClose} className="lg:hidden text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-lime/10 text-lime"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <div className="rounded-lg bg-sidebar-accent p-3">
            <p className="text-xs font-medium text-lime">Free Plan</p>
            <p className="mt-1 text-xs text-muted-foreground">2 of 2 projects used</p>
            <Link
              href="/dashboard/settings"
              className="mt-2 block rounded-md bg-lime px-3 py-1.5 text-center text-xs font-semibold text-lime-foreground hover:bg-lime/90 transition-colors"
            >
              Upgrade to Pro
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
