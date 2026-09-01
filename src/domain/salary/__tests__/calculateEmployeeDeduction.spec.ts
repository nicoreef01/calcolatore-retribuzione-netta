import { describe, expect, it } from 'vitest'
import { calculateEmployeeDeduction } from '../calculations/calculateEmployeeDeduction'

describe('calculateEmployeeDeduction (modello 2024)', () => {
  it('fascia ≤ 15.000: detrazione fissa 1.955', () => {
    expect(calculateEmployeeDeduction(10_000)).toBe(1_955)
    expect(calculateEmployeeDeduction(15_000)).toBe(1_955)
  })

  it('fascia 15.000–28.000: decresce linealmente da ~3.100 a 1.910', () => {
    expect(calculateEmployeeDeduction(15_001)).toBeCloseTo(
      1_910 + 1_190 * ((28_000 - 15_001) / 13_000),
      6,
    )
    expect(calculateEmployeeDeduction(21_500)).toBeCloseTo(2_505, 6)
    expect(calculateEmployeeDeduction(28_000)).toBeCloseTo(1_910, 6)
  })

  it('fascia 28.000–50.000: decresce fino ad annullarsi', () => {
    expect(calculateEmployeeDeduction(39_000)).toBeCloseTo(955, 6)
    expect(calculateEmployeeDeduction(50_000)).toBe(0)
  })

  it('sopra 50.000: nessuna detrazione', () => {
    expect(calculateEmployeeDeduction(60_000)).toBe(0)
  })

  it('non restituisce mai valori negativi', () => {
    expect(calculateEmployeeDeduction(50_000.01)).toBeGreaterThanOrEqual(0)
  })
})
