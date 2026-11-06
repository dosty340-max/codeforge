import { Suspense } from "react";
import { SiteFooter } from "@/components/landing/site-chrome";
import { Navbar } from "@/components/layout/navbar";
import { legalUpdated, missingDetail, operator } from "@/lib/legal";

export type LegalSection = { title: string; paragraphs: string[] };

export function LegalPage({ title, sections }: { title: string; sections: LegalSection[] }) {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<div className="h-14 border-b border-border" />}>
        <Navbar />
      </Suspense>

      <main className="mx-auto max-w-2xl px-5 py-12">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated {legalUpdated}</p>

        <section className="mt-8 rounded-xl border border-border bg-card p-5 text-sm">
          <h2 className="font-semibold">Who runs AgentWe</h2>
          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-muted-foreground">
            <dt>Operator</dt>
            <dd>{operator.name || missingDetail}</dd>
            <dt>Company ID</dt>
            <dd>{operator.companyId || missingDetail}</dd>
            <dt>Address</dt>
            <dd>{operator.address || missingDetail}</dd>
            <dt>Email</dt>
            <dd>{operator.email || missingDetail}</dd>
          </dl>
        </section>

        {sections.map((section) => (
          <section key={section.title} className="mt-8">
            <h2 className="text-lg font-semibold">{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </main>

      <SiteFooter />
    </div>
  );
}
