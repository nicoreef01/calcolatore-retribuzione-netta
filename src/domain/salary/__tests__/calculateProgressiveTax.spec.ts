import { describe, expect, it } from 'vitest'
import { calculateProgressiveTax } from '../calculateProgressiveTax'
import type { TaxBracket } from '../salary.types'

const BRACKETS: readonly TaxBracket[] = [
  { upTo: 100, rate: 0.1 },
  { upTo: 200, rate: 0.2 },
  { upTo: null, rate: 0.3 },
]

describe('calculateProgressiveTax', () => {
  it.each([
    { income: 0, expected: 0 },
    { income: -50, expected: 0 },
    { income: 50, expected: 5 },
    { income: 100, expected: 10 },
    { income: 150, expected: 20 },
    { income: 200, expected: 30 },
    { income: 250, expected: 45 },
    { income: 1_000, expected: 270 },
  ])('calcola $income € su scaglioni custom → $expected', ({ income, expected }) => {
    expect(calculateProgressiveTax(income, BRACKETS)).toBeCloseTo(expected, 6)
  })

  it('non muta la configurazione e accetta readonly arrays', () => {
    const readonlyBrackets: readonly TaxBracket[] = [{ upTo: 10, rate: 0.5 }]
    expect(calculateProgressiveTax(20, readonlyBrackets)).toBeCloseTo(5, 6)
  })
})
