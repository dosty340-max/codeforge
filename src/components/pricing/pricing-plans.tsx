"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, X } from "lucide-react";
import { plans, YEARLY_DISCOUNT, yearlyPrice } from "@/lib/domain";
import { cn } from "@/lib/utils";

const discountPercent = Math.round(YEARLY_DISCOUNT * 100);
const taglines: Record<string, string> = {
  free: "Try your AI team on real projects",
  pro: "For people who ship all the time",
};
const everyPlan = ["Full agent catalog", "Works with Claude Code, Claude, ChatGPT and Codex", "Live project dashboard", "Safety limits on every project"];
const proOnly = ["Public sharing", "Custom agent configs", "Priority support"];

function money(value: number) {
  return value.toLocaleString("en-US", { minimumFractionDigits: Number.isInteger(value) ? 0 : 2, maximumFractionDigits: 2 });
}

export function PricingPlans() {
  const [yearly, setYearly] = useState(true);

  return (
    <>
      <div className="mt-12 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Choose your plan</h2>
          <p className="mt-1 text-sm text-muted-foreground">You use your own Claude or ChatGPT account. We never charge for AI usage.</p>
        </div>

        <div className="flex items-center gap-3 rounded-full border border-border bg-card px-4 py-2 text-sm">
          <span className={yearly ? "text-muted-foreground" : "font-semibold"}>Monthly</span>
          <button
            type="button"
            role="switch"
            aria-checked={yearly}
            aria-label="Pay yearly"
            onClick={() => setYearly(!yearly)}
            className={cn("relative h-5 w-9 rounded-full transition-colors", yearly ? "bg-lime" : "bg-secondary")}
          >
            <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-background transition-all", yearly ? "left-[18px]" : "left-0.5")} />
          </button>
          <span className={yearly ? "font-semibold" : "text-muted-foreground"}>Yearly</span>
          <span className="font-semibold text-lime">Save {discountPercent}% yearly</span>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {plans.map((plan) => {
          const pro = plan.id === "pro";
          const offer = pro && yearly ? yearlyPrice(plan.price) : null;
          const [whole, cents] = money(offer ? offer.perMonth : plan.price).split(".");

          return (
            <article key={plan.id}>
              <div
                className={cn(
                  "rounded-2xl border p-6 sm:p-7",
                  pro
                    ? "border-lime/60 bg-gradient-to-br from-lime/25 via-lime/10 to-card shadow-[0_0_60px_-15px_rgba(200,255,0,0.45)]"
                    : "border-border bg-card"
                )}
              >
                <div className="flex items-center gap-2">
                  <h3 className="text-3xl font-bold">{plan.name}</h3>
                  {pro && (
                    <span className="rounded-full bg-lime px-2.5 py-1 text-[11px] font-bold text-lime-foreground">Recommended</span>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{taglines[plan.id]}</p>

                <p className="mt-6 flex flex-wrap items-baseline gap-2">
                  <span className="text-5xl font-bold tracking-tight">
                    ${whole}
                    {cents && <span className="text-2xl">.{cents}</span>}
                  </span>
                  <span className="text-sm text-muted-foreground">/month{offer ? ", paid yearly" : ""}</span>
                </p>
                <p className="mt-1 h-5 text-xs text-muted-foreground">{offer && `$${money(offer.perYear)} a year, or $${plan.price} paid monthly`}</p>

                <Link
                  href="/register"
                  className={cn(
                    "mt-5 flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-bold transition-colors",
                    pro ? "bg-foreground text-background hover:bg-foreground/90" : "border border-border hover:border-lime/40"
                  )}
                >
                  {pro ? "Get Pro" : "Start free"}
                  {offer && (
                    <span className="rounded-full bg-lime px-2 py-0.5 text-[11px] font-bold text-lime-foreground">
                      Save ${money(offer.saved)} a year
                    </span>
                  )}
                </Link>
              </div>

              <div className="px-2 pt-6 sm:px-7">
                <ul className="space-y-1.5">
                  {[
                    { value: plan.projectsLimit, label: "active projects" },
                    { value: plan.agentsPerProject, label: "agents per project" },
                    { value: plan.historyDays, label: "days of history" },
                  ].map((limit) => (
                    <li key={limit.label} className="text-sm">
                      <span className={cn("text-lg font-bold", pro && "text-lime")}>{limit.value}</span>{" "}
                      <span className="text-muted-foreground">{limit.label}</span>
                    </li>
                  ))}
                </ul>

                <h4 className="mt-6 border-t border-border pt-5 text-sm text-muted-foreground">What you get</h4>
                <ul className="mt-3 space-y-2.5 text-sm">
                  {everyPlan.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check className={cn("mt-0.5 h-4 w-4 shrink-0", pro && "text-lime")} />
                      {feature}
                    </li>
                  ))}
                  {!pro && (
                    <li className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0" />
                      Community support
                    </li>
                  )}
                  {proOnly.map((feature) => (
                    <li key={feature} className={cn("flex items-start gap-2.5", !pro && "text-muted-foreground")}>
                      {pro ? (
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-lime" />
                      ) : (
                        <X className="mt-0.5 h-4 w-4 shrink-0" aria-label="Not included" />
                      )}
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
