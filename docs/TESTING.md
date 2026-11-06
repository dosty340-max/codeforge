# Jak otestovat celou aplikaci

Živá verze běží na https://codeforge-drab-three.vercel.app. Pro lokální test spusť `npm run dev` a použij `http://localhost:3000`.

V Supabase musí být **Site URL** nastavená na adresu, kterou testuješ, jinak odkazy z e-mailů a schvalování přístupu povedou jinam.

Přechod ze starého pluginu `codeforge` na `agentwe`:

```bash
claude plugin uninstall codeforge@codeforge && claude plugin marketplace remove codeforge
```

Nový plugin pak nainstaluješ příkazem ze stránky **Connect**.

## 1. Web bez přihlášení

1. Otevři Explore (`/`), projdi běžící karty, schéma s mozkem a FAQ. Otevři **MCP** a **Pricing**, na ceníku přepni Monthly a Yearly.
2. Otevři `/agents`, vyhledej „Unity“, vyber oddělení a otevři detail agenta.
3. V horním pruhu vyber creatora, zvol modely Brainu a specialistů a obnov stránku. Volba musí zůstat.

## 2. Účet

Vestavěná e-mailová služba Supabase pošle maximálně 2 e-maily za hodinu a jen členům týmu.

1. Přihlas se. Odkaz **Forgot your password?** pošle e-mail, po kliknutí nastavíš nové heslo.
2. V **Settings** změň jméno a zkontroluj iniciály v menu účtu.
3. V **Settings** změň heslo a přihlas se znovu.
4. Zkus **Sign out**.

## 3. Projekty na webu

1. V horním pruhu klikni na **Game Creator**, napiš zadání a klikni na **Open in browser** nebo **Open in Claude Code**. V Claude se má předvybrat zvolený model Brainu.
2. Na detailu projektu klikni na **Share**, otevři odkaz v anonymním okně a pak **Stop sharing**.
3. Zkontroluj, že stránka **Shared results** odpovídá stavu sdílení.
4. Smaž projekt ikonou koše.

## 4. Claude Code

1. Na stránce **Connect** zkopíruj příkaz a spusť ho v terminálu. Otevře prohlížeč, kde schválíš přístup.
2. Spusť Claude Code a v něm malé zadání, ať to nestojí moc tokenů:
   ```
   /agentwe:build Simple browser tic-tac-toe game in one HTML file
   ```
3. Stránka **Connect** se po prvním použití sama přepne na „Claude is connected“.
4. Brain založí projekt, naplánuje práci a požádá o schválení. Po schválení sleduj web, detail projektu se každých 10 sekund obnoví.
5. Zkontroluj kroky, agenty, sdílenou paměť, Activity Log a rozpočet.

Rozdělanou práci obnovíš příkazem z detailu projektu: `/agentwe:build <ID projektu>`.

Jiný model Brainu vyzkoušíš příkazem `/agentwe:build-sonnet`, `build-fable` nebo `build-haiku`. Model specialistů změníš zvolením v aplikaci, zadání pak obsahuje `Specialist model: opus`. Na dashboardu se u agentů má ukázat zvolený model.

## 5. Claude na webu

Jde otestovat až po nasazení na veřejnou HTTPS adresu, postup je v `docs/MCP.md`. Pak v chatu napiš například: „Use AgentWe to build a booking page for my barbershop.“

## 6. ChatGPT a Codex

Jde otestovat až po nasazení. Na stránce **MCP** vyber záložku a projdi návod. Ověř přihlášení, založení projektu a jeho zobrazení na dashboardu.

## Co hledat

- Agenti se na dashboardu objevují a mění stav.
- Úkol skončí jako hotový jen s důkazem a po opakované chybě se práce zastaví.
- Spotřeba tokenů odpovídá tomu, co Brain nahlásí. Server ji sám neměří.
