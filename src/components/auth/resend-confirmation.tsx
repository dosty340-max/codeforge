"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ResendConfirmation({ email, next }: { email: string; next: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  async function resend() {
    setStatus("sending");
    setError("");

    const { error } = await createClient().auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });

    if (error) {
      setError(error.message);
      setStatus("idle");
      return;
    }

    setStatus("sent");
  }

  return (
    <div className="space-y-2 text-center text-xs">
      {error && <p role="alert" className="text-destructive">{error}</p>}
      {status === "sent" ? (
        <p role="status" className="text-lime">Confirmation email sent to {email}.</p>
      ) : (
        <button
          type="button"
          onClick={resend}
          disabled={status === "sending"}
          className="text-lime hover:underline disabled:opacity-50"
        >
          {status === "sending" ? "Sending..." : "Resend confirmation email"}
        </button>
      )}
    </div>
  );
}
