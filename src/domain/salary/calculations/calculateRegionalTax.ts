import { calculateProgressiveTax } from '../calculateProgressiveTax'
import { LOMBARDY_REGIONAL_BRACKETS_2024 } from '../salary.constants'

/** Addizionale regionale Lombardia: scaglioni progressivi 1,23% → 1,73%. */
export function calculateRegionalTax(taxableIncome: number): number {
  return calculateProgressiveTax(Math.max(0, taxableIncome), LOMBARDY_REGIONAL_BRACKETS_2024)
}
