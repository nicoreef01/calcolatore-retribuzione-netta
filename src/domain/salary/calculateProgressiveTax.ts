import type { TaxBracket } from './salary.types'

/**
 * Calcola un'imposta progressiva per scaglioni.
 * Ogni aliquota si applica solo alla parte di reddito interna allo scaglione
 * (Open/Closed: gli scaglioni sono configurazione, la logica è generica).
 */
export function calculateProgressiveTax(
  taxableIncome: number,
  brackets: readonly TaxBracket[],
): number {
  let tax = 0
  let lowerBound = 0

  for (const bracket of brackets) {
    const upperBound = bracket.upTo ?? Number.POSITIVE_INFINITY

    if (taxableIncome > lowerBound) {
      const portionInBracket = Math.min(taxableIncome, upperBound) - lowerBound
      tax += Math.max(0, portionInBracket) * bracket.rate
    }

    lowerBound = upperBound
  }

  return tax
}
