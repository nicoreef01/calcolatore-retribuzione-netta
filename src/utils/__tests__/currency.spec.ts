import { describe, expect, it } from 'vitest'
import { formatAmount, formatCurrency, formatDeduction } from '../currency'

describe('formatCurrency', () => {
  it('prefisso € e separatore delle migliaia come da reference', () => {
    expect(formatCurrency(30_000)).toBe('€ 30.000')
    expect(formatCurrency(1_720)).toBe('€ 1.720')
  })

  it('non introducono decimali per importi con centesimi', () => {
    expect(formatCurrency(22_360.5212)).toBe('€ 22.361')
    expect(formatCurrency(1_720.04)).toBe('€ 1.720')
  })

  it('il separatore di gruppo è quello fornito da Intl per it-IT', () => {
    expect(formatCurrency(1_720)).not.toContain(',')
    expect(formatDeduction(2_757)).toBe('- € 2.757')
  })
})

describe('formatAmount', () => {
  it('numero senza simbolo, per il campo input con prefisso dedicato', () => {
    expect(formatAmount(30_000)).toBe('30.000')
    expect(formatAmount(250_000)).toBe('250.000')
 expect(formatAmount(1_720.04)).toBe('1.720')
  })
})
