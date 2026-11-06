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

```bash
claude mcp add --transport http codeforge http://localhost:3000/mcp
```

Pak v Claude Code spusť `/mcp` a schval přístup. Claude na webu a v desktopové aplikaci potřebuje veřejnou HTTPS adresu, proto se při nasazení nastaví `NEXT_PUBLIC_SITE_URL`.

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

## Pravidla na serveru

- **Opravy:** chybný úkol dostane 3 opravné smyčky, další chyba ho zastaví.
- **Stejná chyba dvakrát:** úkol se zastaví a na dashboard se zapíše otázka.
- **Hotovo:** úkol nejde dokončit bez `evidence`. Server kontroluje, že důkaz je uvedený, ne že je pravdivý.
- **Kontrakty:** `contracts` smí změnit jen volající s rolí `brain`. Role je deklarace agenta, proti úmyslnému obejití nechrání.
- **Rozpočet:** při 80 % přijde varování, při 100 % odpověď `stop`.
- **Události:** všechny změny se zapisují do Activity Logu.

Kola vyjednávání mezi agenty (maximálně 2) server nehlídá, patří do pravidel orchestrace ve fázi 6.
