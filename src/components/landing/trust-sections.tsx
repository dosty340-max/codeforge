import Link from "next/link";
import { ArrowRight, Check, ChevronDown } from "lucide-react";
import { plans } from "@/lib/mock-data";

const guardrails = [
  { value: "2", title: "negotiation rounds", copy: "Agents get two rounds to agree. After that, the Brain decides." },
  { value: "3", title: "repair loops", copy: "A failing task gets three attempts to fix, not endless retries." },
  { value: "2×", title: "same error stops work", copy: "If the same error appears twice, work stops and you are asked." },
  { value: "80%", title: "budget warning", copy: "Each project has a token and step budget, with a warning at 80%." },
];

const connectSteps = [
  { title: "Create your account", copy: "Sign up and open your Codeforge dashboard." },
  { title: "Pick your team", copy: "Choose a project type and the departments it needs from the agent catalog." },
  { title: "Build with Claude", copy: "Connect your own Claude account, describe your project and follow the progress live." },
];

const faqs = [
  {
    q: "What can I build with Codeforge?",
    a: "Websites, apps, games, startup products and anything else made of software. Describe the idea and the Brain plans the work around it.",
  },
  {
    q: "Where do the specialist agents come from?",
    a: "The catalog is based on Agency Agents, an open-source project under the MIT License. You can read each agent's full instructions before adding it, and install a whole team or a single agent.",
  },
  {
    q: "Do I pay Codeforge for AI usage?",
    a: "No. Agents run on your own Claude account, so we never charge for AI usage. Your Codeforge plan covers projects, agents, history and sharing.",
  },
  {
    q: "Where do I talk to the agents?",
    a: "In Claude. You only speak to the Brain, which coordinates the team. The Codeforge web app is where you manage your account and follow phases, agents and activity.",
  },
  {
    q: "How do I know a project is really finished?",
    a: "A project only counts as done when it meets verifiable criteria. An agent saying it is finished is not enough.",
  },
  {
    q: "Can it get stuck or burn through my budget?",
    a: "Guardrails limit that. Negotiation and repair attempts are capped, the same error twice stops the work, and every project has a budget with a warning at 80%.",
  },
  {
    q: "Which plan should I start with?",
    a: "Start on Free with up to 2 active projects and 5 agents per project. Pro raises that to 20 projects and 15 agents per project, and adds public sharing and custom agent configs.",
  },
];

export function Guardrails() {
  return (
    <section id="guardrails" className="mx-auto max-w-6xl scroll-mt-28 px-6 py-24">
      <div className="reveal mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Powerful, with hard limits</h2>
        <p className="mt-4 text-muted-foreground">
          Autonomous does not mean unsupervised. These rules are built into how every project runs.
        </p>
      </div>
      <dl className="reveal mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {guardrails.map((item) => (
          <div key={item.title} className="bg-background p-6">
            <dd className="text-5xl font-bold tracking-tight text-lime">{item.value}</dd>
            <dt className="mt-4 font-semibold">{item.title}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.copy}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function GetStarted() {
  return (
    <section className="border-y border-border bg-card/40">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="reveal text-center text-3xl font-bold tracking-tight sm:text-4xl">Start in three steps</h2>
        <ol className="reveal mt-12 grid gap-8 sm:grid-cols-3">
          {connectSteps.map((step, i) => (
            <li key={step.title} className="border-t-2 border-lime pt-5">
              <p className="font-mono text-sm text-lime">{i + 1}</p>
              <h3 className="mt-2 font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.copy}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-4xl scroll-mt-28 px-6 py-24">
      <div className="reveal text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Simple pricing</h2>
        <p className="mt-4 text-muted-foreground">You use your own Claude account. We never charge for AI usage.</p>
      </div>
      <div className="reveal mt-12 grid gap-6 sm:grid-cols-2">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-xl border p-6 ${plan.id === "pro" ? "border-lime/40 bg-lime/5" : "border-border bg-card"}`}
          >
            <h3 className="text-xl font-bold">{plan.name}</h3>
            <p className="mt-2">
              <span className="text-4xl font-bold">${plan.price}</span>
              <span className="text-sm text-muted-foreground">/month</span>
            </p>
            <ul className="mt-6 space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 shrink-0 text-lime" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className={`mt-6 block rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors ${
                plan.id === "pro"
                  ? "bg-lime text-lime-foreground hover:bg-lime/90"
                  : "border border-border hover:border-lime/30"
              }`}
            >
              {plan.id === "free" ? "Start free" : "Get Pro"}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-3xl scroll-mt-28 px-6 pb-24">
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

export function FinalCta() {
  return (
    <section className="reveal mx-auto max-w-6xl px-6 pb-24">
      <div className="rounded-xl bg-lime px-6 py-16 text-center text-lime-foreground">
        <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">What should your team build first?</h2>
        <Link
          href="/register"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-lime-foreground px-6 py-3 text-sm font-semibold text-lime transition-opacity hover:opacity-90"
        >
          Create your free account <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
