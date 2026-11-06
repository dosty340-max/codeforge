"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ResendConfirmation } from "@/components/auth/resend-confirmation";
import { LogoFull } from "@/components/logo";
import { safePath } from "@/lib/site";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const linkFailed = searchParams.get("error") === "auth";
  const destination = safePath(searchParams.get("next"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(
    linkFailed ? "This link is invalid or has expired. Sign in to request a new one." : ""
  );
  const [unconfirmed, setUnconfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setUnconfirmed(false);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setUnconfirmed(error.code === "email_not_confirmed");
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
          <h1 className="mt-4 text-2xl font-bold">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>
          )}
          {unconfirmed && <ResendConfirmation email={email} />}
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
              className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-lime"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="block w-full rounded-lg bg-lime px-4 py-2.5 text-center text-sm font-semibold text-lime-foreground hover:bg-lime/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          <Link href="/forgot-password" className="text-lime hover:underline">Forgot your password?</Link>
          <br />
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-lime hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
