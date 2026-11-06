import type { Metadata } from "next";
import { Suspense } from "react";
import { CreatorStudio, StudioPlaceholder } from "@/components/home/creator-studio";
import { Navbar } from "@/components/layout/navbar";

export const metadata: Metadata = {
  title: "Create",
  description: "Describe what you want to build and your AI team plans, builds and verifies it.",
};

export default function CreatePage() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<div className="h-14 border-b border-border" />}>
        <Navbar />
      </Suspense>
      <main className="mx-auto max-w-[1600px] px-3 py-3 pb-10 sm:px-4 sm:py-4">
        <Suspense fallback={<StudioPlaceholder />}>
          <CreatorStudio />
        </Suspense>
      </main>
    </div>
  );
}
