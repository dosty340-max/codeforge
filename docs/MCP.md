# MCP server

Claude se s Codeforge spojuje přes `/mcp` (Streamable HTTP, bez session). Každý požadavek běží s tokenem uživatele, takže u všech nástrojů platí Row Level Security a server nepotřebuje tajný klíč.

## Zapnutí přihlášení

V Supabase musí jednou proběhnout tohle nastavení (**Authentication → OAuth Server**):

1. Zapnout OAuth 2.1 server.
2. Authorization Path nastavit na `/oauth/consent`.
3. Zapnout Dynamic Client Registration.

Celá adresa souhlasu je Site URL z **Authentication → URL Configuration** plus tato cesta. Stav ověří tenhle požadavek, po zapnutí nesmí vracet `feature_disabled`:

```bash
curl https://yzltbwoyikafemvynwus.supabase.co/.well-known/oauth-authorization-server/auth/v1
```

## Připojení

Plugin ve složce `plugin/` server přidá sám. Adresa je v `plugin/.mcp.json` zapsaná natvrdo, protože s proměnnou v adrese desktopová aplikace Claude hlásila, že sezení ukazuje na jiný server. Při nasazení ji změň a zvyš verzi pluginu. Stránka Connect nabízí jeden příkaz, který plugin nainstaluje a otevře schválení přístupu. Přihlášení přes tlačítko a stránku Anthropicu nejde, protože [podmínky](https://code.claude.com/docs/en/legal-and-compliance.md) zakazují třetím stranám nabízet přihlášení přes Claude.ai.

Stav „Claude is connected“ zapisuje `/mcp` do `mcp_connections`, jen pro OAuth tokeny s `client_id`. Bez pluginu:

```bash
claude mcp add --transport http codeforge http://localhost:3000/mcp
```

Pak v Claude Code spusť `/mcp` a schval přístup. Claude na webu a v desktopové aplikaci potřebuje veřejnou HTTPS adresu, proto se při nasazení nastaví `NEXT_PUBLIC_SITE_URL`.

## Claude na webu a v aplikaci

Nejde to z localhostu, protože server volají servery Claude. Po nasazení:

1. Nastav `NEXT_PUBLIC_SITE_URL` na veřejnou HTTPS adresu.
2. Tutéž adresu dej do Supabase jako Site URL v **Authentication → URL Configuration**.
3. V Claude přidej custom connector s adresou `<veřejná adresa>/mcp`, klikni na Connect a schval přístup.

Plugin tam neběží. Pravidla Brainu proto posílá přímo server (`src/lib/mcp/instructions.ts`) a nabízí prompt `build`. Jeden Claude postupně hraje všechny role a výsledky ukládá do `submit_result`. Pro plnou stavbu je lepší Claude Code: pracuje se soubory, spouští specialisty souběžně a reálné testy.

## Nástroje

| Nástroj | Účel |
|---|---|
| `list_projects` | Seznam projektů uživatele |
| `create_project` | Založí projekt s typem, týmem a rozpočtem |
| `create_task` | Přidá úkol, případně pro konkrétního agenta |
| `get_task` | Převezme další čekající úkol, včetně předchozí chyby |
| `submit_result` | Odevzdá výsledek nebo chybu |
| `read_memory` | Přečte poslední verzi sdílené paměti |
| `write_memory` | Uloží novou verzi do sdílené paměti |
| `report_status` | Aktualizuje agenta, spotřebu a fázi projektu |
| `ask_user` | Zapíše otázku na dashboard |
| `get_project` | Vrátí stav projektu, úkolů a rozpočtu |
| `list_agents` | Hledá specialisty v katalogu |
| `get_agent_instructions` | Vrátí instrukce jednoho specialisty |

## Pravidla na serveru

- **Opravy:** chybný úkol dostane 3 opravné smyčky, další chyba ho zastaví.
- **Stejná chyba dvakrát:** úkol se zastaví a na dashboard se zapíše otázka.
- **Hotovo:** úkol nejde dokončit bez `evidence`. Server kontroluje, že důkaz je uvedený, ne že je pravdivý.
- **Kontrakty:** `contracts` smí změnit jen volající s rolí `brain`. Role je deklarace agenta, proti úmyslnému obejití nechrání.
- **Rozpočet:** při 80 % přijde varování, při 100 % odpověď `stop`.
- **Události:** všechny změny se zapisují do Activity Logu.

Kola vyjednávání mezi agenty (maximálně 2) server nehlídá, jsou v pravidlech pluginu. Spotřebu tokenů hlásí Brain, server ji sám neměří.

## Plugin

- `plugin/skills/build/SKILL.md`: příkaz `/codeforge:build`, hlavní konverzace v něm funguje jako Brain.
- `plugin/agents/specialist.md`: obecný specialista na Sonnetu, svou roli si načte přes `get_agent_instructions`.
- `.claude-plugin/marketplace.json`: instalace z tohoto repozitáře.
