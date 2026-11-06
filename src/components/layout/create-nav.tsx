import Link from "next/link";
import { projectKinds } from "@/lib/project-kinds";
import { cn } from "@/lib/utils";

export function CreateNav({ active, signedOut = false }: { active?: string | null; signedOut?: boolean }) {
  return (
    <nav aria-label="Create" className="overflow-x-auto [scrollbar-width:none]">
      <ul className="mx-auto flex h-10 w-max items-center gap-1 px-4">
        {projectKinds.map((kind) => {
          const href = signedOut ? "/register" : kind.id === "anything" ? "/home" : `/home?type=${kind.id}`;
          return (
            <li key={kind.id}>
              <Link
                href={href}
                aria-current={active === kind.id ? "page" : undefined}
                className={cn(
                  "flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  active === kind.id ? "bg-lime text-lime-foreground" : "text-muted-foreground hover:text-lime"
                )}
              >
                <kind.icon className="h-3.5 w-3.5" />
                {kind.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
