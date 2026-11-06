"use client";

import type { OAuthAuthorizationDetails } from "@supabase/supabase-js";
import { ShieldCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { LogoFull } from "@/components/logo";
import { createClient } from "@/lib/supabase/client";

function ConsentForm() {
  const router = useRouter();
  const authorizationId = useSearchParams().get("authorization_id");
  const [details, setDetails] = useState<OAuthAuthorizationDetails | null>(null);
  const [error, setError] = useState(authorizationId ? "" : "This authorization link is not valid.");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authorizationId) return;
    const supabase = createClient();

    async function load(id: string) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        const next = `/oauth/consent?authorization_id=${encodeURIComponent(id)}`;
        router.replace(`/login?next=${encodeURIComponent(next)}`);
        return;
      }

      const { data, error } = await supabase.auth.oauth.getAuthorizationDetails(id);
      if (error || !data) {
        setError(error?.message ?? "This authorization request could not be loaded.");
      } else if ("authorization_id" in data) {
        setDetails(data);
      } else {
        window.location.assign(data.redirect_url);
      }
    }

    void load(authorizationId);
  }, [authorizationId, router]);

  async function decide(approve: boolean) {
    if (!authorizationId) return;
    setSubmitting(true);
    setError("");

    const { oauth } = createClient().auth;
    const { data, error } = approve
      ? await oauth.approveAuthorization(authorizationId)
      : await oauth.denyAuthorization(authorizationId);

    if (error || !data) {
      setError(error?.message ?? "The decision could not be saved. Please try again.");
      setSubmitting(false);
      return;
    }
    window.location.assign(data.redirect_url);
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="flex justify-center">
        <LogoFull />
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-center text-sm text-destructive">
          {error}
        </p>
      )}

      {!details && !error && (
        <div role="status" aria-label="Loading" className="h-64 animate-pulse rounded-xl bg-card" />
      )}

      {details && (
        <div className="rounded-xl border border-border bg-card p-6">
          <ShieldCheck className="h-6 w-6 text-lime" />
          <h1 className="mt-4 text-xl font-bold tracking-tight">Connect {details.client.name}?</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            It will be able to create and update your Codeforge projects, tasks, agents and project memory as{" "}
            <span className="text-foreground">{details.user.email}</span>.
          </p>
          <p className="mt-4 break-all text-xs text-muted-foreground">Returns to: {details.redirect_uri}</p>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              disabled={submitting}
              onClick={() => decide(false)}
              className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm transition-colors hover:border-lime/30 disabled:opacity-50"
            >
              Deny
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={() => decide(true)}
              className="flex-1 rounded-lg bg-lime px-4 py-2.5 text-sm font-semibold text-lime-foreground transition-colors hover:bg-lime/90 disabled:opacity-50"
            >
              Approve
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ConsentPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Suspense>
        <ConsentForm />
      </Suspense>
    </main>
  );
}
