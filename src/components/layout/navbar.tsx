"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CreateNav } from "@/components/layout/create-nav";
import { LogoFull } from "@/components/logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  Home,
  FolderKanban,
  Bot,
  Plug,
  Share2,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const tabs = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/home/projects", label: "Projects", icon: FolderKanban },
  { href: "/home/agents", label: "Agents", icon: Bot },
  { href: "/home/connect", label: "Connect", icon: Plug },
  { href: "/home/shared", label: "Results", icon: Share2 },
  { href: "/home/pricing", label: "Pricing", icon: CreditCard },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const activeKind = useSearchParams().get("type");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [initials, setInitials] = useState("");

  useEffect(() => {
    createClient().auth.getSession().then(({ data: { session } }) => {
      const user = session?.user;
      const label: string = user?.user_metadata.full_name || user?.email || "";
      setInitials(label.split(/\s+/).map((word) => word[0]).join("").slice(0, 2).toUpperCase());
    });
  }, []);

  async function signOut() {
    await createClient().auth.signOut({ scope: "local" });
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
    <nav aria-label="Main">
      <div className="mx-auto flex h-12 max-w-7xl items-center gap-6 px-4">
        <Link href="/home">
          <LogoFull />
        </Link>

        {/* Desktop tabs */}
        <div className="hidden md:flex items-center justify-center gap-1 flex-1">
          {tabs.map((tab) => {
            const active = pathname === tab.href || (tab.href !== "/home" && pathname.startsWith(tab.href));
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-lime/10 text-lime"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {tab.label}
                {tab.label === "Agents" && (
                  <span className="rounded bg-lime/20 px-1 py-0.5 text-[9px] font-bold text-lime leading-none">
                    LIVE
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/home/settings"
            className="hidden md:flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <Settings className="h-4 w-4" />
          </Link>
          <Avatar className="h-7 w-7 border border-border">
            <AvatarFallback className="bg-secondary text-[10px]">{initials}</AvatarFallback>
          </Avatar>
          <button
            onClick={signOut}
            className="hidden md:flex items-center gap-1.5 whitespace-nowrap text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-muted-foreground hover:text-foreground"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-2 space-y-1">
          {tabs.map((tab) => {
            const active = pathname === tab.href || (tab.href !== "/home" && pathname.startsWith(tab.href));
            return (
              <Link
                key={tab.href}
                href={tab.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active ? "bg-lime/10 text-lime" : "text-muted-foreground hover:bg-secondary"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </Link>
            );
          })}
          <Link
            href="/home/settings"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          <button
            onClick={signOut}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      )}
    </nav>
    <div className="border-t border-border">
      <CreateNav active={pathname === "/home" ? activeKind : null} />
    </div>
    </header>
  );
}
