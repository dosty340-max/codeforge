import { LogoFull } from "@/components/logo";
import { repositoryUrl } from "@/lib/agent-catalog";

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
          (MIT License). &copy; 2026 AgentWe.
        </p>
      </div>
    </footer>
  );
}
