/** Costanti della detrazione ordinaria da lavoro dipendente (modello 2024). */
const FLAT_DEDUCTION_LOW = 1_955
const BASE_DEDUCTION_MID = 1_910
const MID_COEFFICIENT = 1_190
const MID_CEILING = 28_000
const MID_FLOOR = 15_000
const MID_SPAN = MID_CEILING - MID_FLOOR
const HIGH_CEILING = 50_000
const HIGH_SPAN = HIGH_CEILING - MID_CEILING

/**
 * Detrazione ordinaria da lavoro dipendente 2024 (365 giorni, nessun altro onere).
 * La legge presenta una discontinuità reale a €15.000: sotto soglia la detrazione
 * è fissa, sopra scala decrescente — si applica la formula così com'è.
 */
export function calculateEmployeeDeduction(taxableIncome: number): number {
  if (taxableIncome <= 15_000) {
    return FLAT_DEDUCTION_LOW
  }

  if (taxableIncome <= 28_000) {
    return clampToZero(
      BASE_DEDUCTION_MID + MID_COEFFICIENT * ((MID_CEILING - taxableIncome) / MID_SPAN),
    )
  }

  if (taxableIncome <= 50_000) {
    return clampToZero(BASE_DEDUCTION_MID * ((HIGH_CEILING - taxableIncome) / HIGH_SPAN))
  }

  return 0
}

function clampToZero(value: number): number {
  return Math.max(0, value)
}
