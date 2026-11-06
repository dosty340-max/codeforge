import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<div className="h-[89px] border-b border-border" />}>
        <Navbar />
      </Suspense>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
