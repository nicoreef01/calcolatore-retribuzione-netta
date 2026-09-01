import { describe, expect, it } from 'vitest'
import { parseAmount } from '../number'

describe('parseAmount', () => {
  it('estrae le cifre da input con formattazione italiana', () => {
    expect(parseAmount('30.000')).toBe(30_000)
    expect(parseAmount('€ 250.000')).toBe(250_000)
    expect(parseAmount('30000')).toBe(30_000)
  })

  it('restituisce NaN su input non numerico (il chiamante decide il fallback)', () => {
    expect(parseAmount('')).toBeNaN()
    expect(parseAmount('abc')).toBeNaN()
  })
})
