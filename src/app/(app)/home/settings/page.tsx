import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PasswordForm, ProfileForm } from "@/components/settings/account-forms";
import { getCurrentUser } from "@/lib/data";
import { plans } from "@/lib/domain";
import { Check, CreditCard, KeyRound, User } from "lucide-react";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>

      <Card className="gap-0 border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-3">
          <User className="h-5 w-5 text-muted-foreground" />
          <h2 className="font-semibold">Profile</h2>
        </div>
        <ProfileForm name={user.name} email={user.email} />
      </Card>

      <Card className="gap-0 border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-3">
          <KeyRound className="h-5 w-5 text-muted-foreground" />
          <h2 className="font-semibold">Password</h2>
        </div>
        <PasswordForm />
      </Card>

      <Card className="gap-0 border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-3">
          <CreditCard className="h-5 w-5 text-muted-foreground" />
          <h2 className="font-semibold">Subscription</h2>
          <Badge variant="outline" className="border-zinc-500/30 bg-zinc-500/20 text-[10px] text-zinc-400">
            Free
          </Badge>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-lg border p-4 ${plan.id === "pro" ? "border-lime/30 bg-lime/5" : "border-border"}`}
            >
              <h3 className="font-semibold">{plan.name}</h3>
              <p className="mt-1">
                <span className="text-2xl font-bold">${plan.price}</span>
                <span className="text-xs text-muted-foreground">/mo</span>
              </p>
              <ul className="mt-3 space-y-1.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="h-3 w-3 text-lime" />
                    {feature}
                  </li>
                ))}
              </ul>
              <p className="mt-4 rounded-lg bg-secondary px-3 py-2 text-center text-sm font-semibold text-muted-foreground">
                {plan.id === "free" ? "Current plan" : "Coming soon"}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
