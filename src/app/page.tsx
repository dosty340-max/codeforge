import { Suspense } from "react";
import { FeaturedCreators, IdeaGallery, ToolsAndStart } from "@/components/explore/explore-sections";
import { YourProjects } from "@/components/home/your-projects";
import { SiteFooter } from "@/components/landing/site-chrome";
import { Steps, Team } from "@/components/landing/product-sections";
import { BuildOptions, Faq } from "@/components/landing/trust-sections";
import { Navbar } from "@/components/layout/navbar";

export default function ExplorePage() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<div className="h-14 border-b border-border" />}>
        <Navbar />
      </Suspense>
      <main>
        <h1 className="sr-only">AgentWe: describe it, your AI team builds it</h1>
        <div className="mx-auto max-w-[1600px] px-3 py-4 sm:px-4">
          <ToolsAndStart />
          <FeaturedCreators />
          <Suspense>
            <YourProjects />
          </Suspense>
          <IdeaGallery />
        </div>
        <Steps />
        <Team />
        <BuildOptions />
        <Faq />
      </main>
      <SiteFooter />
    </div>
  );
}
