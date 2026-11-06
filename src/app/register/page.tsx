"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ResendConfirmation } from "@/components/auth/resend-confirmation";
import { LogoFull } from "@/components/logo";
import { safePath } from "@/lib/site";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const router = useRouter();
  const destination = safePath(useSearchParams().get("next"));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(destination)}`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (!data.session) {
      setAwaitingConfirmation(true);
      setLoading(false);
      return;
    }

    router.push(destination);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex">
            <LogoFull className="justify-center" />
          </Link>
          <h1 className="mt-4 text-2xl font-bold">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Start building with AI agents</p>
        </div>

        {awaitingConfirmation ? (
          <div className="space-y-3">
            <p role="status" className="rounded-lg bg-lime/10 px-4 py-3 text-center text-sm text-lime">
              Check {email} and click the link to confirm your account.
            </p>
            <ResendConfirmation email={email} next={destination} />
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>
          )}
          <div>
            <label className="text-xs text-muted-foreground">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-lime"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-lime"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
              required
              minLength={6}
              className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-lime"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="block w-full rounded-lg bg-lime px-4 py-2.5 text-center text-sm font-semibold text-lime-foreground hover:bg-lime/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
        )}

        <p className="text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link href={`/login?next=${encodeURIComponent(destination)}`} className="text-lime hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
