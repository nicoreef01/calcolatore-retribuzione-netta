# Net Salary Calculator — Jet HR Product Builder

Prototipo interattivo di **Calcolatore retribuzione netta**: simula il netto annuale e mensile a partire dalla RAL, con modello fiscale 2024 semplificato per un impiegato privato a tempo indeterminato residente a Milano.

> **Disclaimer**: questo è un calcolo semplificato a scopo informativo e non sostituisce un'elaborazione ufficiale del cedolino paga.

## Stack

- Vue 3 (Composition API, `<script setup lang="ts">`)
- TypeScript strict
- SCSS (token centralizzati, BEM)
- Vite
- Vitest

## Run locally

```bash
npm install
npm run dev        # dev server
npm run test       # unit test del dominio (Vitest)
npm run typecheck  # vue-tsc --noEmit
npm run build      # typecheck + build di produzione
npm run preview    # serve la build
```

Strumenti di QA visivi (opzionali, richiedono il preview server attivo su `:4173`):

```bash
node scripts/shot.mjs "http://localhost:4173/" 375 820 shot.png      # screenshot fedele via CDP
node scripts/measure.mjs "http://localhost:4173/" 320 700            # verifica overflow orizzontale
node scripts/test-clamp.mjs                                          # smoke test interazione input (eventi reali)
```

## Calculation model

Pipeline a cascata, un'unica fonte di verità nel dominio:

```
RAL
→ Contributi INPS dipendente (9,19%, aliquota semplificata)
→ Reddito imponibile = max(0, RAL − INPS)
→ IRPEF lorda (scaglioni 23% ≤ 28k, 35% ≤ 50k, 43% oltre)
→ Detrazione ordinaria da lavoro dipendente 2024
→ IRPEF netta = max(0, lorda − detrazione)
→ Addizionale regionale Lombardia (scaglioni progressivi 1,23% → 1,73%)
→ Addizionale comunale Milano (0,80%, esenzione sotto € 23.000 di imponibile)
→ Netto annuale
→ Netto mensile = netto annuale / mensilità (13 o 14)
```

Precisione: nessun arrotondamento intermedio; si arrotonda solo per la presentazione. Le mensilità incidono **solo** sul netto per cedolino, mai sui risultati annuali.

## Assumptions / simplifications

- **Anno fiscale 2024**, lavoratore dipendente del settore privato, contratto a tempo indeterminato, impiegato 365 giorni (nessuna proporzione per giorni).
- **Aliquota INPS dipendente 9,19%**: assunzione di modello esplicita del prototipo, non è l'aliquota universale (dipende da CCNL, fondo previdenza, esoneri).
- Residenza/domicilio fiscale a **Milano, Lombardia**, per tutto l'anno.
- **Nessun familiare a carico**, nessun coniuge, nessuna detrazione per spese, nessun bonus o credito d'imposta oltre alla detrazione ordinaria.
- Nessun trattamento integrativo / bonus IRPEF, nessun esonero contributivo temporaneo, nessun welfare aziendale.
- Niente TFR, straordinari, variabile, fringe benefit, previdenza integrativa.
- La soglia comunale di € 23.000 è di **esenzione** (non franchigia): sopra soglia l'aliquota si applica all'intero imponibile del modello.
- I risultati sono stime indicative, non un elaborato paga ufficiale.

## Architecture

Separazione netta dei ruoli:

```
src/
├── domain/salary/          ← dominio puro, zero Vue
│   ├── salary.types.ts     tipi (SalaryCalculationResult, InstallmentCount…)
│   ├── salary.constants.ts aliquote e scaglioni come configurazione readonly
│   ├── calculateSalary.ts  orchestratore della pipeline
│   ├── calculateProgressiveTax.ts  utilità generica per scaglioni
│   ├── calculations/       una funzione, un calcolo (INPS, IRPEF, detrazione, addizionali)
│   └── __tests__/          unit test Vitest
├── composables/
│   ├── useSalaryCalculator.ts  ponte reattivo UI ↔ dominio
│   └── useToast.ts
├── components/
│   ├── base/               BaseCard, InfoTooltip
│   ├── calculator/         SalaryInput, InstallmentSelector, SalaryResult,
│   │                       CalculationBreakdown/Row, DistributionBar/Legend
│   └── layout/             AppSidebar, AppHeader
├── utils/                  Intl.NumberFormat (EUR/percentuali), parsing input
├── styles/                 token SCSS (abstracts), base, utilities
├── views/                  SalaryCalculatorView (composizione)
└── config/appContent.ts    copy e contenuti configurabili
```

I componenti non contengono formule: ricevono risultati tipati dal motore tramite la composable. Gli scaglioni IRPEF/regionali sono dati di configurazione passati a `calculateProgressiveTax` (Open/Closed). Ogni cifra deriva dal "motore".
