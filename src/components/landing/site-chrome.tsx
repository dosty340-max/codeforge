import Link from "next/link";
import { LogoFull } from "@/components/logo";
import { repositoryUrl } from "@/lib/agent-catalog";

export function SiteFooter() {
  return (
    <footer className="border-t border-border px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
        <LogoFull className="opacity-60" />
        <nav aria-label="Legal" className="flex gap-4 text-xs text-muted-foreground">
          <Link href="/terms" className="underline hover:text-foreground">Terms</Link>
          <Link href="/privacy" className="underline hover:text-foreground">Privacy</Link>
        </nav>
        <p className="text-xs text-muted-foreground">
          Agent catalog based on{" "}
          <a href={repositoryUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
            Agency Agents
          </a>{" "}
          (MIT License). &copy; 2026 AgentWe.
          <br />
          AgentWe is independent and not affiliated with or endorsed by Anthropic or OpenAI. Claude and ChatGPT are trademarks of their owners.
        </p>
      </div>
    </footer>
  );
}
