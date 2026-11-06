import Link from "next/link";
import { Crown } from "lucide-react";
import { creatorHref, creators } from "@/lib/creators";
import { cn } from "@/lib/utils";

const itemClass = "flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors";
const stateClass = (selected: boolean) => (selected ? "text-lime" : "text-muted-foreground hover:text-foreground");

function Divider() {
  return <li aria-hidden className="mx-1.5 h-5 w-px bg-border" />;
}

function Item({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} aria-current={active ? "page" : undefined} className={cn(itemClass, stateClass(active))}>
        {children}
      </Link>
    </li>
  );
}

export function CreateNav({ active }: { active?: string | null }) {
  return (
    <nav aria-label="Main" className="overflow-x-auto [scrollbar-width:none]">
      <ul className="mx-auto flex h-11 w-max items-center gap-0.5 px-3">
        <Item href="/" active={active === "explore"}>Explore</Item>
        <Item href="/connect" active={active === "mcp"}>MCP</Item>
        <Divider />
        {creators.map((creator) => (
          <Item key={creator.id} href={creatorHref(creator)} active={active === creator.id}>
            {creator.label}
          </Item>
        ))}
        <Divider />
        <Item href="/pricing" active={active === "pricing"}>
          <Crown className="h-3.5 w-3.5" />
          Pricing
          <span className="rounded bg-lime px-1.5 py-0.5 text-[10px] font-bold leading-none text-lime-foreground">30% OFF</span>
        </Item>
      </ul>
    </nav>
  );
}
