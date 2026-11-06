# Jak otestovat celou aplikaci

Živá verze běží na https://codeforge-drab-three.vercel.app. Pro lokální test spusť `npm run dev` a použij `http://localhost:3000`.

V Supabase musí být **Site URL** nastavená na adresu, kterou testuješ, jinak odkazy z e-mailů a schvalování přístupu povedou jinam.

Přechod z lokální instalace pluginu na verzi z GitHubu:

```bash
claude plugin uninstall codeforge@codeforge && claude plugin marketplace remove codeforge
```

## 1. Web bez přihlášení

1. Otevři landing page, projdi videa, FAQ a odkazy v navigaci.
2. Otevři `/agents`, vyhledej „Unity“, vyber oddělení a otevři detail agenta.

## 2. Účet

Vestavěná e-mailová služba Supabase pošle maximálně 2 e-maily za hodinu a jen členům týmu.

1. Přihlas se. Odkaz **Forgot your password?** pošle e-mail, po kliknutí nastavíš nové heslo.
2. V **Settings** změň jméno a zkontroluj pozdrav na Home.
3. V **Settings** změň heslo a přihlas se znovu.
4. Zkus **Sign out**.

## 3. Projekty na webu

1. V horním pruhu klikni na **Create game**, otevři **Team** a uprav oddělení.
2. Napiš zadání a klikni na **Build**.
3. Na detailu projektu klikni na **Share**, otevři odkaz v anonymním okně a pak **Stop sharing**.
4. Zkontroluj, že stránka **Results** odpovídá stavu sdílení.
5. Smaž projekt ikonou koše.

## 4. Claude Code

1. Na stránce **Connect** zkopíruj příkaz a spusť ho v terminálu. Otevře prohlížeč, kde schválíš přístup.
2. Spusť Claude Code a v něm malé zadání, ať to nestojí moc tokenů:
   ```
   /codeforge:build Simple browser tic-tac-toe game in one HTML file
   ```
3. Stránka **Connect** se po prvním použití sama přepne na „Claude is connected“.
4. Brain založí projekt, naplánuje práci a požádá o schválení. Po schválení sleduj web, detail projektu se každých 10 sekund obnoví.
5. Zkontroluj kroky, agenty, sdílenou paměť, Activity Log a rozpočet.

Rozdělanou práci obnovíš příkazem z detailu projektu: `/codeforge:build <ID projektu>`.

## 5. Claude na webu

Jde otestovat až po nasazení na veřejnou HTTPS adresu, postup je v `docs/MCP.md`. Pak v chatu napiš například: „Use Codeforge to build a booking page for my barbershop.“

## Co hledat

- Agenti se na dashboardu objevují a mění stav.
- Úkol skončí jako hotový jen s důkazem a po opakované chybě se práce zastaví.
- Spotřeba tokenů odpovídá tomu, co Brain nahlásí. Server ji sám neměří.
