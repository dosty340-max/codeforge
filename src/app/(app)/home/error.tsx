"use client";

export default function HomeError({ reset }: { reset: () => void }) {
  return (
    <div role="alert" className="mx-auto max-w-md rounded-xl border border-border bg-card p-8 text-center">
      <h1 className="font-semibold">This page could not load</h1>
      <p className="mt-2 text-sm text-muted-foreground">Your data is safe. Please try again.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-5 rounded-lg bg-lime px-4 py-2 text-sm font-semibold text-lime-foreground hover:bg-lime/90"
      >
        Try again
      </button>
    </div>
  );
}
