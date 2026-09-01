import { describe, expect, it } from 'vitest'
import { calculateMunicipalTax } from '../calculations/calculateMunicipalTax'
import { MILAN_MUNICIPAL_RATE } from '../salary.constants'

describe('calculateMunicipalTax (Milano)', () => {
  it('sotto (o uguale a) la soglia di esenzione: zero', () => {
    expect(calculateMunicipalTax(22_999)).toBe(0)
    expect(calculateMunicipalTax(23_000)).toBe(0)
  })

  it('sopra la soglia: 0,80% sull’INTERO imponibile (esenzione, non franchigia)', () => {
    expect(calculateMunicipalTax(23_000.01)).toBeCloseTo(23_000.01 * 0.008, 6)
    expect(calculateMunicipalTax(27_243)).toBeCloseTo(217.944, 6)
  })

  it('non applica mai (imponibile − soglia) × aliquota', () => {
    const income = 30_000
    const franchiseStyle = (income - 23_000) * MILAN_MUNICIPAL_RATE
    expect(calculateMunicipalTax(income)).not.toBeCloseTo(franchiseStyle, 6)
    expect(calculateMunicipalTax(income)).toBeCloseTo(income * MILAN_MUNICIPAL_RATE, 6)
  })
})
