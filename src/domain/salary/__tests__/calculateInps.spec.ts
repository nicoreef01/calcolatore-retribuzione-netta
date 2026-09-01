import { describe, expect, it } from 'vitest'
import { calculateInps } from '../calculations/calculateInps'
import { EMPLOYEE_INPS_RATE } from '../salary.constants'

describe('calculateInps', () => {
  it('applica l’aliquota semplificata al 9,19%', () => {
    expect(calculateInps(30_000)).toBeCloseTo(2_757, 6)
  })

  it('è coerente con la costante di modello', () => {
    expect(calculateInps(100_000)).toBeCloseTo(100_000 * EMPLOYEE_INPS_RATE, 6)
  })

  it('gestisce input non positivi senza valori negativi', () => {
    expect(calculateInps(0)).toBe(0)
    expect(calculateInps(-1_000)).toBe(0)
  })
})
