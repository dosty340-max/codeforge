import { plans } from "@/lib/domain";
import { Check } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Pricing</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You use your own Claude account — we never charge for AI usage
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-xl border p-6 ${
              plan.id === "pro" ? "border-lime/30 bg-lime/5" : "border-border bg-card"
            }`}
          >
            {plan.id === "pro" && (
              <span className="text-[10px] font-semibold text-lime uppercase tracking-wider">Recommended</span>
            )}
            <h3 className="text-xl font-bold mt-1">{plan.name}</h3>
            <p className="mt-2">
              <span className="text-3xl font-bold">${plan.price}</span>
              <span className="text-sm text-muted-foreground">/month</span>
            </p>
            <ul className="mt-6 space-y-2">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-lime" />
                  {f}
                </li>
              ))}
            </ul>
            <p className="mt-6 rounded-lg bg-secondary px-4 py-2.5 text-center text-sm font-semibold text-muted-foreground">
              {plan.id === "free" ? "Current plan" : "Coming soon"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
