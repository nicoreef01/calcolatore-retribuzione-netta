import { describe, expect, it } from 'vitest'
import { calculateRegionalTax } from '../calculations/calculateRegionalTax'

describe('calculateRegionalTax (Lombardia progressiva)', () => {
  it.each([
    { income: 10_000, expected: 123 },
    { income: 15_000, expected: 184.5 },
    { income: 20_000, expected: 184.5 + 5_000 * 0.0158 },
    { income: 28_000, expected: 184.5 + 13_000 * 0.0158 },
    { income: 40_000, expected: 184.5 + 13_000 * 0.0158 + 12_000 * 0.0172 },
    {
      income: 60_000,
      expected: 184.5 + 13_000 * 0.0158 + 22_000 * 0.0172 + 10_000 * 0.0173,
    },
  ])('imponibile $income € → $expected', ({ income, expected }) => {
    expect(calculateRegionalTax(income)).toBeCloseTo(expected, 6)
  })

  it('NON è un’aliquota fissa: progressione verificata sugli scaglioni', () => {
    const atThreshold = calculateRegionalTax(15_000)
    const justAbove = calculateRegionalTax(15_001)
    expect(justAbove).toBeGreaterThan(atThreshold)
    expect(justAbove - atThreshold).toBeCloseTo(0.0158, 4)
  })
})
