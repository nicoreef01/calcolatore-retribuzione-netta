import { MILAN_EXEMPTION_THRESHOLD, MILAN_MUNICIPAL_RATE } from '../salary.constants'

/**
 * Addizionale comunale di Milano (0,80%).
 * La soglia di €23.000 è di ESAZIONE, non una franchigia deducibile:
 * sopra soglia l'aliquota si applica all'intero imponibile del modello.
 */
export function calculateMunicipalTax(taxableIncome: number): number {
  if (taxableIncome <= MILAN_EXEMPTION_THRESHOLD) {
    return 0
  }

  return taxableIncome * MILAN_MUNICIPAL_RATE
}
