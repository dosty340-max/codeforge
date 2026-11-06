"use client";

import Link from "next/link";
import { useState } from "react";
import { LogoFull } from "@/components/logo";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await createClient().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });

    setLoading(false);
    if (error) setError(error.message);
    else setSent(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex">
            <LogoFull className="justify-center" />
          </Link>
          <h1 className="mt-4 text-2xl font-bold">Reset your password</h1>
          <p className="mt-1 text-sm text-muted-foreground">We will email you a link to choose a new one</p>
        </div>

        {sent ? (
          <p role="status" className="rounded-lg bg-lime/10 px-4 py-3 text-center text-sm text-lime">
            If an account exists for {email}, the link is on its way.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>}
            <label className="block text-xs text-muted-foreground">
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-lime"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="block w-full rounded-lg bg-lime px-4 py-2.5 text-sm font-semibold text-lime-foreground transition-colors hover:bg-lime/90 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}

        <p className="text-center text-xs text-muted-foreground">
          <Link href="/login" className="text-lime hover:underline">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
