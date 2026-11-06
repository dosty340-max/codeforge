import Link from "next/link";
import { CreateNav } from "@/components/layout/create-nav";
import { LogoFull } from "@/components/logo";
import { repositoryUrl } from "@/lib/agent-catalog";

const navLinks = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/agents", label: "Agents" },
  { href: "/#guardrails", label: "Guardrails" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav aria-label="Main" className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 md:grid md:grid-cols-[1fr_auto_1fr]">
        <Link href="/" aria-label="Codeforge AI home">
          <LogoFull />
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center justify-end gap-3 sm:gap-4">
          <Link href="/login" className="hidden whitespace-nowrap text-sm text-muted-foreground transition-colors hover:text-foreground min-[360px]:inline">
            Sign in
          </Link>
          <Link
            href="/register"
            className="whitespace-nowrap rounded-lg bg-lime px-3 py-2 text-sm font-semibold text-lime-foreground transition-colors hover:bg-lime/90 sm:px-4"
          >
            Get started
          </Link>
        </div>
      </nav>
      <div className="border-t border-border">
        <CreateNav signedOut />
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
        <LogoFull className="opacity-60" />
        <p className="text-xs text-muted-foreground">
          Agent catalog based on{" "}
          <a href={repositoryUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
            Agency Agents
          </a>{" "}
          (MIT License). &copy; 2026 Codeforge AI.
        </p>
      </div>
    </footer>
  );
}
