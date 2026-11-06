# Rozhodnutí

## 2026-11-06: Živý canvas projektu
- **Rozhodnutí:** Po odeslání zadání web založí projekt a ukáže živý canvas a mapu týmu na stránce projektu. Agenti posílají widgety přes nástroj `update_preview` do tabulky `preview_sections`
- **Důvod:** Agenti běží v nástroji uživatele, takže web vidí jen to, co mu pošlou. Práce má být vidět průběžně, ne až na konci
- **Dopad:** HTML od agentů běží v iframe bez `allow-same-origin` a s politikou bez síťových požadavků, takže se nedostane k přihlášení ani k API. Stránka se obnovuje každých 2,5 s dotazem na Supabase. Preview ukazuje postup, není důkaz hotové práce

## 2026-11-06: Vlastní vzhled a právní minimum
- **Rozhodnutí:** Explore má vlastní pořadí bloků, MCP vlastní nadpis a pozadí se sítí agentů, ceník vlastní texty a písmo je Manrope. Přidané jsou stránky `/terms` a `/privacy` a v patičce prohlášení o nezávislosti na Anthropicu a OpenAI
- **Důvod:** Snížit riziko sporu o podobnost s jiným webem a splnit informační povinnosti vůči uživatelům v EU
- **Dopad:** Údaje o provozovateli se doplní do `src/lib/legal.ts`. Texty podmínek a zásad jsou návrh a před spuštěním plateb je má zkontrolovat advokát. Ceník nepoužívá škrtnutou cenu

## 2026-11-06: Podpora ChatGPT a Codexu
- **Rozhodnutí:** AgentWe se připojuje ze čtyř nástrojů: Claude Code, Claude in Chrome, ChatGPT a Codex. Stránka MCP má pro každý záložku a návod
- **Důvod:** Uživatel chce být dostupný i pro uživatele ChatGPT. Server je standardní MCP s OAuth, takže stačí stejná adresa
- **Dopad:** Pravidla serveru už nepředpokládají Claude. Výběr modelů funguje jen tam, kde ho umíme předat: v Claude Code a v Claude. Odkaz do ChatGPT přes `?q=` není dokumentovaný a Codex odkaz nemá, proto se u něj kopíruje příkaz. Plugin s paralelními specialisty je zatím jen pro Claude Code

## 2026-11-06: Samostatný ceník a roční sleva 30 %
- **Rozhodnutí:** Ceník je na `/pricing` s přepínačem měsíčně a ročně, Pro stojí 29 USD měsíčně nebo 243,60 USD ročně
- **Důvod:** Uživatel chce přehledný ceník a slevu za roční platbu, která láká
- **Dopad:** Platby zatím nejsou napojené, proto stránka říká, že Pro platby se otevřou brzy. Při napojení Stripe musí sedět stejné ceny. Sleva je stálá za roční platbu, bez falešného odpočtu

## 2026-11-06: Stránka MCP na `/connect`
- **Rozhodnutí:** Veřejná stránka MCP běží na `/connect`, ne na `/mcp`
- **Důvod:** Adresa `/mcp` patří samotnému MCP serveru a její změna by rozbila připojení
- **Dopad:** Stav připojení dál ukazuje `/home/connect`, návod sdílí obě stránky

## 2026-11-06: Nový název AgentWe
- **Rozhodnutí:** Codeforge AI se přejmenovává na AgentWe (vždy s velkým W), logo je limetkový čtverec s tmavým W
- **Důvod:** `codeforge.com` i `codeforge.ai` jsou obsazené a uživatel chce jedinečné jméno, ze kterého je poznat, že jde o agenty
- **Dopad:** Příkazy jsou `/agentwe:build`. Adresa `codeforge-drab-three.vercel.app` a repozitář `dosty340-max/codeforge` zůstávají, dokud je uživatel nezmění. Staré migrace se nepřepisují

## 2026-11-06: Výběr modelů pro Brain a specialisty
- **Rozhodnutí:** Uživatel volí model Brainu a specialistů přímo při zadání projektu, výchozí jsou Opus a Sonnet
- **Důvod:** Volba modelu patří uživateli, ne nám
- **Dopad:** Odkaz do Claude Code neumí nastavit model, proto má každý model Brainu vlastní příkaz (`/agentwe:build-fable` a další). Ten platí jen do konce tahu, takže Brain schvaluje plán ve stejném tahu přes `AskUserQuestion`. Na webu se model předává nedokumentovaným parametrem `model` v adrese claude.ai a všechny role dělá jeden model

## 2026-11-06: Design systém — tmavý styl s limetkou
- **Rozhodnutí:** Dark theme s lime (#c8ff00) akcenty
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
- **Důvod:** Uživatel to chce přidat podle reelu an AgentWe má stavět weby, aplikace, hry i startupy
- **Dopad:** Zadání v `docs/AGENCY_AGENTS.md`, změny databáze a plugin. Licence MIT, Brain zůstává jediný orchestrátor
- **Zdroj agentů:** Kopie konkrétního commitu v `vendor/agency-agents`, aby se text agentů neměnil bez naší kontroly

## 2026-11-06: shadcn/ui v2 (base-ui)
- **Rozhodnutí:** Použití shadcn v2 s base-ui místo radix
- **Důvod:** Aktuální verze shadcn; pozor — žádné `asChild` prop
