"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Bot,
  CreditCard,
  FolderKanban,
  LogOut,
  Plug,
  Settings,
  Share2,
} from "lucide-react";
import { CreateNav } from "@/components/layout/create-nav";
import { LogoFull } from "@/components/logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCreator } from "@/lib/creators";
import { createClient } from "@/lib/supabase/client";
import { useCurrentUser } from "@/lib/use-session";

const accountLinks = [
  { href: "/home/projects", label: "Projects", icon: FolderKanban },
  { href: "/agents", label: "Agent catalog", icon: Bot },
  { href: "/home/shared", label: "Shared results", icon: Share2 },
  { href: "/home/connect", label: "Your connection", icon: Plug },
  { href: "/pricing", label: "Pricing", icon: CreditCard },
  { href: "/home/settings", label: "Settings", icon: Settings },
];

const navItem: Record<string, string> = { "/": "explore", "/connect": "mcp", "/pricing": "pricing" };

function initialsOf(label: string) {
  return label.split(/\s+/).map((word) => word[0]).join("").slice(0, 2).toUpperCase();
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const type = useSearchParams().get("type");
  const { ready, user } = useCurrentUser();

  async function signOut() {
    await createClient().auth.signOut({ scope: "local" });
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center px-4 lg:flex-nowrap">
        <Link href="/" aria-label="AgentWe home" className="shrink-0 py-3">
          <LogoFull />
        </Link>

        <div className="order-last w-full min-w-0 lg:order-none lg:w-auto lg:flex-1">
          <CreateNav active={navItem[pathname] ?? (pathname === "/create" ? getCreator(type).id : null)} />
        </div>

        <div className="ml-auto flex h-8 shrink-0 items-center gap-2 lg:ml-0">
          {ready && !user && (
            <>
              <Link
                href="/login"
                className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="whitespace-nowrap rounded-lg bg-lime px-3 py-1.5 text-sm font-semibold text-lime-foreground transition-colors hover:bg-lime/90"
              >
                Sign up
              </Link>
            </>
          )}

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger aria-label="Open account menu" className="block rounded-full focus:outline-none focus:ring-2 focus:ring-lime">
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarFallback className="bg-secondary text-[11px]">
                    {initialsOf(user.user_metadata.full_name || user.email || "")}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                {accountLinks.map((link) => (
                  <DropdownMenuItem key={link.href} render={<Link href={link.href} />}>
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
