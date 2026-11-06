import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteFooter } from "@/components/landing/site-chrome";
import { Navbar } from "@/components/layout/navbar";
import { PricingPlans } from "@/components/pricing/pricing-plans";
import { plans, YEARLY_DISCOUNT, yearlyPrice } from "@/lib/domain";

export const metadata: Metadata = {
  title: "Pricing",
  description: "AgentWe plans, monthly or yearly. You use your own Claude or ChatGPT account and we never charge for AI usage.",
};

const safetyLimits = [
  { value: "80%", title: "Budget warning", copy: "You hear from your team when a project reaches 80% of its budget." },
  { value: "3", title: "Repair attempts", copy: "A failing task gets three tries, then your team asks you." },
  { value: "2×", title: "Same error", copy: "If the same error happens twice, the work stops and you decide." },
  { value: "2", title: "Rounds to agree", copy: "If specialists disagree for two rounds, the Brain decides." },
];

const pro = plans.find((plan) => plan.id === "pro")!;

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<div className="h-14 border-b border-border" />}>
        <Navbar />
      </Suspense>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <section className="relative overflow-hidden rounded-2xl border border-lime/60 bg-black p-6 shadow-[inset_0_-40px_60px_-30px_rgba(200,255,0,0.45)] sm:p-8">
          <h1 className="text-2xl font-black uppercase leading-tight tracking-tight sm:text-4xl">
            <span className="text-lime">Pay yearly, save {Math.round(YEARLY_DISCOUNT * 100)}%</span>
            <br />
            On the Pro plan
          </h1>
          <p className="mt-3 text-sm text-foreground/80">
            Pro costs ${pro.price} a month, or ${yearlyPrice(pro.price).perMonth.toFixed(2)} a month when you pay for a year.
          </p>
        </section>

        <PricingPlans />

        <p className="mt-10 text-center text-xs leading-relaxed text-muted-foreground">
          Prices in US dollars. The final price, including any VAT, appears before you pay. AI usage is separate and runs on your own Claude or ChatGPT plan.
          <br />
          Pro payments open soon. Sign up free now and upgrade when they do.
        </p>

        <section id="guardrails" className="mt-16 scroll-mt-20 border-t border-border pt-12">
          <h2 className="text-center text-2xl font-bold tracking-tight">Every plan keeps your team in check</h2>
          <dl className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {safetyLimits.map((limit) => (
              <div key={limit.title}>
                <dd className="text-3xl font-bold text-lime">{limit.value}</dd>
                <dt className="mt-1 text-sm font-semibold">{limit.title}</dt>
                <dd className="mt-1 text-xs leading-relaxed text-muted-foreground">{limit.copy}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
