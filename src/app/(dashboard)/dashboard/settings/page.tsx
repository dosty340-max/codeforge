import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { plans } from "@/lib/mock-data";
import { Check, User, CreditCard, Bell } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>

      <Card className="border-border bg-card p-6 gap-0">
        <div className="flex items-center gap-3 mb-4">
          <User className="h-5 w-5 text-muted-foreground" />
          <h2 className="font-semibold">Profile</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground">Name</label>
            <input
              type="text"
              defaultValue="Jakub Dostal"
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-lime"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Email</label>
            <input
              type="email"
              defaultValue="jakub@example.com"
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-lime"
            />
          </div>
          <button className="rounded-lg bg-lime px-4 py-2 text-sm font-semibold text-lime-foreground hover:bg-lime/90 transition-colors">
            Save Changes
          </button>
        </div>
      </Card>

      <Card className="border-border bg-card p-6 gap-0">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="h-5 w-5 text-muted-foreground" />
          <h2 className="font-semibold">Subscription</h2>
          <Badge variant="outline" className="bg-zinc-500/20 text-zinc-400 border-zinc-500/30 text-[10px]">
            Free
          </Badge>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-lg border p-4 ${
                plan.id === "pro"
                  ? "border-lime/30 bg-lime/5"
                  : "border-border"
              }`}
            >
              <h3 className="font-semibold">{plan.name}</h3>
              <p className="mt-1">
                <span className="text-2xl font-bold">${plan.price}</span>
                <span className="text-xs text-muted-foreground">/mo</span>
              </p>
              <ul className="mt-3 space-y-1.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="h-3 w-3 text-lime" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={`mt-4 w-full rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  plan.id === "pro"
                    ? "bg-lime text-lime-foreground hover:bg-lime/90"
                    : "bg-secondary text-muted-foreground cursor-default"
                }`}
              >
                {plan.id === "free" ? "Current Plan" : "Upgrade"}
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="border-border bg-card p-6 gap-0">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <h2 className="font-semibold">Notifications</h2>
        </div>
        <div className="space-y-3">
          {["Project completed", "Agent errors", "Budget warnings"].map((label) => (
            <label key={label} className="flex items-center justify-between">
              <span className="text-sm">{label}</span>
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded accent-lime" />
            </label>
          ))}
        </div>
      </Card>
    </div>
  );
}
