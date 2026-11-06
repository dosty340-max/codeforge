import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<div className="h-14 border-b border-border" />}>
        <Navbar />
      </Suspense>
      <main className="mx-auto max-w-[1600px] px-3 py-3 sm:px-4 sm:py-4">{children}</main>
    </div>
  );
}
