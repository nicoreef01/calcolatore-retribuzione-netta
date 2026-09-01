/**
 * Contenuto configurabile del prototipo (sidebar, link, disclaimer).
 * Nessun asset reale: i link mostrano un toast invece di finte azioni.
 */
export const profile = {
  initials: 'LP',
  name: 'Luca Pantano',
  role: 'AI Product Designer',
} as const

export const sidebarLinks = [
  {
    id: 'cv',
    label: 'Scarica il mio Curriculum',
    href: 'https://drive.google.com/file/d/1cgOJhISZl89viiOd2EQXrz_Dj_vpnyAx/view?usp=sharing',
  },
  {
    id: 'linkedin',
    label: 'Guarda il mio profilo Linkedin',
    href: 'https://www.linkedin.com/in/luca-pantano-4157b442b/',
  },
] as const

export const disclaimer =
  'Questo è un calcolo semplificato a scopo informativo e non sostituisce un’elaborazione ufficiale del cedolino paga.'

export const howWeCalculate = {
  summary: 'Come calcoliamo?',
  intro: 'Modello fiscale 2024 — lavoratore dipendente privato, persona sola, residente a Milano.',
  assumptions: [
    'Dipendente privato a tempo indeterminato, impiegato 365 giorni fiscali',
    'Aliquota INPS dipendente semplificata al 9,19% (assunzione di modello)',
    'IRPEF 2024 con scaglioni 23% / 35% / 43% e detrazione ordinaria da lavoro dipendente',
    'Addizionale regionale Lombardia progressiva (1,23% → 1,73%)',
    'Addizionale comunale Milano 0,80%, con esenzione sotto € 23.000 di imponibile',
    'Nessun familiare a carico, nessun trattamento integrativo, nessun esonero contributivo',
  ],
  closing:
    'Le mensilità (13 o 14) modificano solo il netto medio per cedolino: il netto annuale non cambia.',
} as const
