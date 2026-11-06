# AI Firma

## Příkazy
- `npm run dev` — vývojový server (port 3000)
- `npm run build` — produkční build
- `npm run lint` — ESLint
- `npm test` — testy pojistek MCP serveru

## Struktura
```
src/
  app/                    # Next.js App Router
    (dashboard)/          # Dashboard layout se sidebarem
      dashboard/          # Dashboard stránky
    login/, register/     # Auth stránky
    page.tsx              # Landing page
  components/
    layout/               # Sidebar, Topbar
    dashboard/            # Agent cards, activity log, phase progress
    ui/                   # shadcn/ui komponenty
  lib/
    mock-data.ts          # Všechna ukázková data na jednom místě
    utils.ts              # Utility funkce
docs/                     # Dokumentace projektu
vendor/agency-agents/     # Převzatí agenti (MIT), aktualizace viz docs/AGENCY_AGENTS.md
video/                    # Scény pro After Effects a render do public/video
```

## Pravidla
- Dark theme (Higgsfield styl), accent barva: #c8ff00 (lime)
- Žádné tajné klíče v kódu, jen .env.example
- Mock data v src/lib/mock-data.ts — jediný soubor k nahrazení
- TypeScript strict, Tailwind + shadcn/ui
