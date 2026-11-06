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
    (app)/home/           # Přihlášená aplikace
    agents/               # Veřejný katalog agentů
    connect/              # Veřejná stránka MCP
    create/               # Creatoři a zadání projektu
    pricing/              # Ceník
    share/[token]/        # Veřejné výsledky projektu
    mcp/                  # MCP server
    page.tsx              # Explore
  components/             # agents, dashboard, explore, home, landing, layout, pricing, settings, ui
  lib/
    data.ts               # Čtení dat ze Supabase pro stránky
    mcp/                  # Nástroje MCP serveru a pojistky
    domain.ts             # Společné typy a plány
plugin/                   # Plugin pro Claude Code (Brain a specialisté)
supabase/migrations/      # Schéma databáze
docs/                     # Dokumentace projektu
vendor/agency-agents/     # Převzatí agenti (MIT), aktualizace viz docs/AGENCY_AGENTS.md
video/                    # Scény pro After Effects a render do public/video
```

## Pravidla
- Dark theme (Higgsfield styl), accent barva: #c8ff00 (lime)
- Žádné tajné klíče v kódu, jen .env.example
- TypeScript strict, Tailwind + shadcn/ui
