# Rozhodnutí

## 2026-11-06: Design systém — Higgsfield styl
- **Rozhodnutí:** Dark theme s lime (#c8ff00) akcenty, inspirace Higgsfield.ai
- **Důvod:** Uživatel specifikoval tento styl
- **Dopad:** Celá aplikace je dark-only, shadcn/ui přizpůsobené

## 2026-11-06: Název složky — ai-firma
- **Rozhodnutí:** Složka `ai-firma` (lowercase) místo `AIFirma`
- **Důvod:** npm nepodporuje velká písmena v názvu balíčku

## 2026-11-06: Next.js 16 + App Router
- **Rozhodnutí:** Použití Next.js 16 s App Router, Turbopack
- **Důvod:** Nejnovější verze, cacheComponents enabled

## 2026-11-06: Jeden soubor pro mock data
- **Rozhodnutí:** Všechna ukázková data v `src/lib/mock-data.ts`
- **Důvod:** Snazší pozdější nahrazení skutečnými daty z API/DB

## 2026-11-06: Specialisté se načítají za běhu
- **Rozhodnutí:** Plugin má jednoho obecného specialistu, který si roli načte z katalogu přes MCP
- **Důvod:** Uživatel nemusí instalovat stovky agentů a verze instrukcí zůstává pod naší kontrolou
- **Dopad:** Plugin je malý a nástroj `get_agent_instructions` čte jen agenty z katalogu

## 2026-11-06: OAuth přes Supabase OAuth Server
- **Rozhodnutí:** MCP server používá OAuth 2.1 server od Supabase místo vlastní implementace
- **Důvod:** Tokeny jsou běžné uživatelské JWT, takže platí RLS a server nepotřebuje servisní klíč
- **Dopad:** Funkce je v beta verzi a musí se zapnout v dashboardu, viz `docs/MCP.md`

## 2026-11-06: Katalog agentů podle Agency Agents
- **Rozhodnutí:** Pevnou osmičku specialistů nahradí katalog podle `msitarzewski/agency-agents` s výběrem týmů
- **Důvod:** Uživatel to chce přidat podle reelu a Codeforge má stavět weby, aplikace, hry i startupy
- **Dopad:** Zadání v `docs/AGENCY_AGENTS.md`, změny databáze a plugin. Licence MIT, Brain zůstává jediný orchestrátor
- **Zdroj agentů:** Kopie konkrétního commitu v `vendor/agency-agents`, aby se text agentů neměnil bez naší kontroly

## 2026-11-06: shadcn/ui v2 (base-ui)
- **Rozhodnutí:** Použití shadcn v2 s base-ui místo radix
- **Důvod:** Aktuální verze shadcn; pozor — žádné `asChild` prop
