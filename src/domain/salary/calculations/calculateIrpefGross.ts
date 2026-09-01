import { calculateProgressiveTax } from '../calculateProgressiveTax'
import { IRPEF_BRACKETS_2024 } from '../salary.constants'

/** IRPEF lorda 2024: imposta progressiva sugli scaglioni 23% / 35% / 43%. */
export function calculateIrpefGross(taxableIncome: number): number {
  return calculateProgressiveTax(Math.max(0, taxableIncome), IRPEF_BRACKETS_2024)
}
