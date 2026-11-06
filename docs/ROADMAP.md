# Roadmap

## Fáze 0 — Dokumentace ✅
- [x] CLAUDE.md
- [x] docs/DECISIONS.md
- [x] docs/ROADMAP.md

## Fáze 1 — UI/UX a rozložení ✅
- [x] Design systém (barvy, typografie, komponenty)
- [x] Hlavní layout (sidebar, topbar, responzivita)
- [x] Stránky s mock daty

## Fáze 2 — Stránky s ukázkovými daty ✅
- [x] Landing page (hero, how it works, pricing)
- [x] Login / Register (UI)
- [x] Dashboard — přehled projektů
- [x] Detail projektu (fáze, agenti, activity log)
- [x] Connect Claude (návod na MCP)
- [x] Shared Results
- [x] Settings (profil, subscription, notifications)

## Fáze 3 — Backend a API ✅
- [x] API routy pro projekty, úkoly, události, paměť
- [x] Validace vstupů (Zod), jednotné chyby
- [x] Helper funkce (ok/err/parseBody/withBody)

## Fáze 4 — Databáze a autentizace ✅
- [x] Napojit stránky v /home na reálná data místo mock-data.ts
- [x] Supabase schéma (projects, agents, tasks, memory_entries, events, budgets)
- [x] Row Level Security (vlastnictví přes projects.user_id)
- [x] Migrace + seed data
- [x] Supabase klient (server + browser)
- [x] Middleware (ochrana /home/*, /api/*)
- [x] Auth callback route
- [x] Login / Register napojeno na Supabase Auth

## Fáze 5 — MCP server
- [x] Nástroje: create_project, get_task, submit_result, read/write_memory, report_status, ask_user (viz docs/MCP.md)
- [x] Navíc create_task a list_projects, bez nich Brain nemůže plánovat
- [x] Pojistky na serveru a logování do events
- [x] Souhlasná stránka a metadata pro OAuth
- [ ] Zapnout OAuth Server v Supabase a ověřit přihlášení z Claude Code

## Fáze 6 — Plugin pro Claude Code
- [ ] Definice mozku a subagentů
- [ ] Pravidla orchestrace

## Katalog agentů (podle docs/AGENCY_AGENTS.md)
- [x] Katalog oddělení a agentů na webu
- [x] Výběr týmů při vytváření projektu, výchozí podle typu
- [x] Úprava databáze: role, oddělení, typ projektu a vybrané týmy
- [x] Zachovat licenci MIT a uvést zdroj
- [ ] Brain rozděluje úkoly specialistům, dashboard ukazuje kontrolu kroků (fáze 5)
- [ ] Instalace vybraných týmů přes plugin (fáze 6)
- [ ] Ověřit instalační příkaz skutečným spuštěním

## Fáze 7 — Paywall
- [ ] Stripe předplatné (Free / Pro)
- [ ] Checkout, webhooky, kontrola plánu

## Před spuštěním
- [ ] Vlastní doména a SMTP (např. Resend) — bez nich Supabase posílá e-maily jen členům týmu, max. 2 za hodinu
- [ ] Vložit `supabase/templates/confirm-signup.html` do Authentication → Emails → Confirm sign up (jde až s vlastním SMTP)
- [ ] Otestovat potvrzení účtu s adresou mimo tým
- [ ] Přepnout Site URL v Supabase na produkční adresu
