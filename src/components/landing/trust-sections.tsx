import { ChevronDown } from "lucide-react";
import { ClaudeComparison } from "@/components/agents/claude-comparison";

const faqs = [
  {
    q: "What can I build with AgentWe?",
    a: "Websites, apps, games, startup products and anything else made of software. Describe the idea and the Brain plans the work around it.",
  },
  {
    q: "Where do the specialist agents come from?",
    a: "The catalog is based on Agency Agents, an open-source project under the MIT License. You can read each agent's full instructions before adding it, and install a whole team or a single agent.",
  },
  {
    q: "Do I pay AgentWe for AI usage?",
    a: "No. Agents run on your own Claude or ChatGPT account, so we never charge for AI usage. Your AgentWe plan covers projects, agents, history and sharing.",
  },
  {
    q: "Which AI tool do I need?",
    a: "Claude Code, Claude in Chrome, ChatGPT or Codex. Claude Code is the best choice for full builds: it works on your files, runs specialists side by side and runs real tests. Codex also works on your files. Claude and ChatGPT in the browser need no install and suit planning and smaller work.",
  },
  {
    q: "Where do I talk to the agents?",
    a: "In your AI tool. You only speak to the Brain, which coordinates the team. The AgentWe web app is where you manage your account and follow phases, agents and activity.",
  },
  {
    q: "How do I know a project is really finished?",
    a: "A project only counts as done when it meets verifiable criteria. An agent saying it is finished is not enough.",
  },
  {
    q: "Can it get stuck or burn through my budget?",
    a: "Safety limits stop that. Repair attempts are capped, the same error twice stops the work, and every project has a budget with a warning at 80%.",
  },
  {
    q: "Which plan should I start with?",
    a: "Start on Free with up to 2 active projects and 5 agents per project. Pro raises that to 20 projects and 15 agents per project, and adds public sharing and custom agent configs.",
  },
];

export function BuildOptions() {
  return (
    <section className="border-y border-border bg-card/40">
      <div className="reveal mx-auto max-w-4xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">Claude Code gets the most out of AgentWe</h2>
        <p className="mx-auto mb-8 mt-4 max-w-xl text-center text-muted-foreground">
          You can also connect Claude in Chrome, ChatGPT or Codex.
        </p>
        <ClaudeComparison />
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-6 pb-24">
      <h2 className="reveal text-center text-3xl font-bold tracking-tight sm:text-4xl">Questions</h2>
      <div className="reveal mt-10 divide-y divide-border border-y border-border">
        {faqs.map((faq) => (
          <details key={faq.q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
              {faq.q}
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
