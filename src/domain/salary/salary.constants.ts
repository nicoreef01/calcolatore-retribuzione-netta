import type { InstallmentCount, TaxBracket } from './salary.types'

/**
 * Aliquota contributiva dipendente del prototipo.
 * ASSUNZIONE DI MODELLO: non è l'aliquota universale per ogni lavoratore dipendente italiano
 * (dipende da CCNL, fondo di previdenza, eventuali esoneri).
 */
export const EMPLOYEE_INPS_RATE = 0.0919

/** Range operativo dell'input RAL: fuori range si corregge al blur. */
export const RAL_MIN = 10_000
export const RAL_MAX = 250_000

export const DEFAULT_RAL = 30_000
export const DEFAULT_INSTALLMENTS: InstallmentCount = 13

/** Addizionale comunale di Milano. */
export const MILAN_MUNICIPAL_RATE = 0.008
/** Soglia di ESAZIONE (non franchigia): sopra soglia si applica l'aliquota all'intero imponibile. */
export const MILAN_EXEMPTION_THRESHOLD = 23_000

/** IRPEF lorda 2024 — scaglioni progressivi. */
export const IRPEF_BRACKETS_2024: readonly TaxBracket[] = [
  { upTo: 28_000, rate: 0.23 },
  { upTo: 50_000, rate: 0.35 },
  { upTo: null, rate: 0.43 },
]

/** Addizionale regionale Lombardia 2024 — progressiva, NON fissa all'1,40%. */
export const LOMBARDY_REGIONAL_BRACKETS_2024: readonly TaxBracket[] = [
  { upTo: 15_000, rate: 0.0123 },
  { upTo: 28_000, rate: 0.0158 },
  { upTo: 50_000, rate: 0.0172 },
  { upTo: null, rate: 0.0173 },
]
