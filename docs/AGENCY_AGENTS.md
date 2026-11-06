# Katalog agentů podle Agency Agents

Zadání: přenést do Codeforge to, co ukazuje [reel od notvokzzy](https://www.instagram.com/p/DfZNVUDuAod/).
Stav: **katalog je na webu a napojený na projekty i plugin.** Specialisté se načítají za běhu přes MCP, viz `docs/MCP.md`. Ověření na skutečném projektu popisuje `docs/TESTING.md`.

## Co už funguje

- **Veřejný katalog:** `/agents` a `/agents/[slug]` s vyhledáváním, filtrem oddělení a plným textem instrukcí.
- **Katalog v appce:** `/home/agents`, nad ním agenti pracující na projektech uživatele.
- **Výběr týmu:** při vytváření projektu, výchozí oddělení podle typu z navigace Create.
- **Uložení:** typ a oddělení v `projects.kind` a `projects.divisions`, migrace `00003_agent_catalog.sql`.
- **Detail projektu:** vybraný tým, odkazy do katalogu a instalační příkaz pro Claude Code.
- **Stránka Connect:** instalační příkaz pro základní tým.
- **Landing page:** oddělení s počty, odkaz do katalogu, FAQ a uvedení zdroje.

## Jak aktualizovat agenty

Agenti jsou v `vendor/agency-agents` včetně licence. Index pro appku je `src/data/agent-catalog.json`.

1. Stáhni repozitář v konkrétním commitu do dočasné složky.
2. Spusť `node scripts/import-agents.mjs <složka> <commit>`.
3. Projdi změny v `vendor/agency-agents`, jsou to instrukce, které poběží u uživatelů.
4. Zkontroluj, že `install.sh` pořád podporuje použité volby.

Importovaná verze je zapsaná v `src/data/agent-catalog.json` v poli `commit`.

## Co reel ukazuje

Reel má 48 sekund. Popis vychází z obrazu a textu příspěvku, zvuk jsem neslyšel.

| Čas | Scéna | Co je vidět |
|---|---|---|
| 0–7 s | Celá firma | V Claude Code je napsané „řiď moji firmu“. Objeví se počítadlo **280+ AI zaměstnanců**, mřížka karet s roboty a skříňka „Agency“. |
| 8–12 s | Slib | „Jak je všechny dostaneš do počítače“ s ukazatelem průběhu a poznámkou, že příkaz je na konci videa. |
| 13–17 s | Zdroj | Projekt Agency Agents, `msitarzewski/agency-agents`, licence MIT, přes 160 tisíc hvězd. |
| 18–22 s | Agentura v Claude Code | Agenti jsou rozdělení do oddělení. Z nich se vybere specialista na jednu konkrétní práci. |
| 23–27 s | Specialisté | Každý dělá jednu věc: e-maily, hovory, nabídky. Ukazatel „hotovo 2/3“. |
| 28–30 s | Oddělení | Čtyři police: podpora, sociální sítě, designéři, programátoři. |
| 30–35 s | Orchestrátor | Stojí nad týmy, rozdělí práci na úkoly 1–4 a každý předá správnému specialistovi (obchod, kód, design, podpora). |
| 35–37 s | Kontrola | Kroky jedou po pásu a před předáním dál se každý zkontroluje („kroky 0/4“). |
| 38–47 s | Instalace | Příkaz v terminálu nahraje agenty do `~/.claude/agents`, počítadlo dojde na 280. Přepínače vyberou jen některé týmy. |

Text příspěvku dodává: nainstaluješ všechno jedním příkazem, nebo jen potřebné týmy. Zdarma, licence MIT.

## Co jsem ověřil na GitHubu (2026-11-06)

- **Repozitář:** [msitarzewski/agency-agents](https://github.com/msitarzewski/agency-agents), 166 854 hvězd, licence MIT.
- **Rozsah:** 18 oddělení a přibližně 283 souborů `.md`. Skutečný počet agentů je potřeba ověřit při importu, protože ne každý soubor musí být agent.
- **Největší oddělení:** engineering 66, specialized 59, marketing 37, **game-development 21**, gis 13, security 12.
- **Hry:** jsou tam Unity, Unreal, Godot, Roblox a Blender, takže katalog odpovídá záměru stavět nejen weby.
- **Formát agenta:** Markdown s hlavičkou (`name`, `description`, `color`, `emoji`, `vibe`).
- **Katalog oddělení:** `divisions.json` obsahuje název, ikonu Lucide a barvu každého oddělení.
- **Orchestrátor:** `specialized/agents-orchestrator.md`.
- **Instalace pro Claude Code:**

```bash
./scripts/install.sh --tool claude-code --division engineering,security
```

Skript má i režim `--dry-run` a varuje, když vybraných agentů je víc, než daný nástroj načte. Proto je výběr týmů důležitý.

## Co přidáme do Codeforge

1. **Katalog agentů na stránce Agents a na landing page.** Oddělení s ikonou a barvou, vyhledávání a detail agenta. Nahradí současnou pevnou osmičku specialistů.
2. **Výběr týmů při vytváření projektu.** Přepínače oddělení jako na konci reelu. Výchozí výběr podle typu z navigace Create:

| Typ | Výchozí oddělení (návrh) |
|---|---|
| Website | design, engineering, testing |
| App | product, design, engineering, testing |
| Game | game-development, design, testing |
| Startup | product, engineering, marketing, sales |
| Anything | Brain navrhne podle zadání |

3. **Brain jako orchestrátor.** Rozdělí zadání na úkoly a předá je specialistům z vybraných týmů. Dashboard ukazuje kroky a jejich kontrolu („kroky 2/4“).
4. **Kontrola každého kroku.** Krok nejde dál, dokud neprojde. Platí naše pravidla: 2 kola vyjednávání, 3 opravné smyčky, stejná chyba dvakrát znamená zastavit a zeptat se uživatele.
5. **Instalace přes plugin.** Stránka Connect a plugin z fáze 6 dostanou vybrané týmy do Claude Code jedním krokem.

## Co zbývá

- **Skupiny agentů:** `agents.group` zná jen orchestration, development a testing. Dashboard zatím neseskupuje podle oddělení.
- **Volitelný instalační příkaz:** je ověřený jen čtením skriptu `install.sh`, spuštění staženého skriptu bylo v testu zablokované.
- **Limity plánů:** Free má 5 agentů na projekt, ale jedno oddělení jich může mít 66. Fáze 7 musí určit, co přesně se počítá.

## Pravidla převzetí

- **Licence:** MIT dovoluje použití i v placeném produktu. Musíme ale zachovat copyright a text licence a uvést zdroj.
- **Bezpečnost:** agenti jsou cizí instrukce, které poběží v Claude Code uživatele s přístupem k jeho souborům. Stahujeme jen konkrétní commit a před každou aktualizací kontrolujeme změny.
- **Agent `agents-orchestrator`:** neinstalujeme vedle Brainu, aby neexistovali dva řídicí agenti. Použijeme ho jen jako inspiraci.
- **Vzhled reelu:** nepřebíráme animovanou postavu ani grafiku autora. Stránky zůstávají v našem designu.

## Otevřené otázky

1. Omezit plán Free výběrem oddělení? Dnešní limit je 5 agentů na projekt, Pro má 15.
2. Které skupiny schovat, například healthcare nebo gis, aby výběr nebyl moc dlouhý?
