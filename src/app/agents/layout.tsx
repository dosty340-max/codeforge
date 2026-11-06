import { Suspense } from "react";
import { SiteFooter } from "@/components/landing/site-chrome";
import { Navbar } from "@/components/layout/navbar";

export default function PublicAgentsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<div className="h-14 border-b border-border" />}>
        <Navbar />
      </Suspense>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">{children}</main>
      <SiteFooter />
    </div>
  );
}
