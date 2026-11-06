"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-lime";
const buttonClass =
  "rounded-lg bg-lime px-4 py-2 text-sm font-semibold text-lime-foreground transition-colors hover:bg-lime/90 disabled:opacity-50";

function useSave() {
  const [state, setState] = useState<{ busy: boolean; message: string; failed: boolean }>({
    busy: false,
    message: "",
    failed: false,
  });

  async function save(fields: { password?: string; data?: { full_name: string } }, success: string) {
    setState({ busy: true, message: "", failed: false });
    const { error } = await createClient().auth.updateUser(fields);
    setState({ busy: false, message: error ? error.message : success, failed: !!error });
    return !error;
  }

  const feedback = state.message && (
    <span role="status" className={`text-xs ${state.failed ? "text-destructive" : "text-lime"}`}>
      {state.message}
    </span>
  );
  return { busy: state.busy, feedback, save };
}

export function ProfileForm({ name, email }: { name: string; email: string }) {
  const router = useRouter();
  const [value, setValue] = useState(name);
  const { busy, feedback, save } = useSave();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (await save({ data: { full_name: value.trim() } }, "Saved.")) router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-xs text-muted-foreground">
        Name
        <input value={value} onChange={(e) => setValue(e.target.value)} required maxLength={100} className={inputClass} />
      </label>
      <div>
        <p className="text-xs text-muted-foreground">Email</p>
        <p className="mt-1 text-sm">{email}</p>
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={busy} className={buttonClass}>
          {busy ? "Saving..." : "Save"}
        </button>
        {feedback}
      </div>
    </form>
  );
}

export function PasswordForm() {
  const [password, setPassword] = useState("");
  const { busy, feedback, save } = useSave();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (await save({ password }, "Password changed.")) setPassword("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-xs text-muted-foreground">
        New password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete="new-password"
          className={inputClass}
        />
      </label>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={busy} className={buttonClass}>
          {busy ? "Changing..." : "Change password"}
        </button>
        {feedback}
      </div>
    </form>
  );
}
