import { SiteFooter, SiteHeader } from "@/components/landing/site-chrome";
import { Hero, RoleMarquee, Steps, Team } from "@/components/landing/product-sections";
import { Faq, FinalCta, GetStarted, Guardrails, Pricing } from "@/components/landing/trust-sections";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <Hero />
        <RoleMarquee />
        <Steps />
        <Team />
        <Guardrails />
        <GetStarted />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}
