import { describe, expect, it } from 'vitest'
import { calculateSalary } from '../calculateSalary'
import { EMPLOYEE_INPS_RATE } from '../salary.constants'
import type { SalaryCalculationResult } from '../salary.types'

function compute(ral: number, installments: 13 | 14 = 13): SalaryCalculationResult {
  return calculateSalary({ grossAnnualSalary: ral, installments })
}

/** RAL che produce l'imponibile desiderato: taxable = RAL × (1 − aliquota INPS). */
function ralForTaxable(taxable: number): number {
  return taxable / (1 - EMPLOYEE_INPS_RATE)
}

describe('calculateSalary — caso di riferimento RAL €30.000, 13 mensilità', () => {
  const result = compute(30_000)

  it('INPS dipendente = 9,19% della RAL', () => {
    expect(result.employeeInps).toBeCloseTo(2_757, 6)
  })

  it('imponibile = RAL − INPS', () => {
    expect(result.taxableIncome).toBeCloseTo(27_243, 6)
  })

  it('IRPEF lorda → detrazione → IRPEF netta restano campi separati e coerenti', () => {
    expect(result.grossIrpef).toBeCloseTo(6_265.89, 4)
    expect(result.employeeDeduction).toBeCloseTo(1_979.2946, 3)
    expect(result.netIrpef).toBeCloseTo(result.grossIrpef - result.employeeDeduction, 6)
    expect(result.netIrpef).toBeCloseTo(4_286.5954, 3)
  })

  it('addizionali Lombardia + Milano', () => {
    expect(result.regionalTax).toBeCloseTo(377.9394, 3)
    expect(result.municipalTax).toBeCloseTo(217.944, 3)
  })

  it('netto annuale e mensile coerenti con la pipeline', () => {
    expect(result.annualNet).toBeCloseTo(22_360.5212, 3)
    expect(result.monthlyNet).toBeCloseTo(result.annualNet / 13, 9)
  })

  it('le percentuali di ripartizione sommano a ~100%', () => {
    const sum = result.distribution.reduce((total, item) => total + item.percentageOfGross, 0)
    expect(sum).toBeGreaterThan(99.99)
    expect(sum).toBeLessThan(100.01)
  })

  it('trattenute totali = somma delle componenti', () => {
    expect(result.totalDeductions).toBeCloseTo(
      result.employeeInps + result.netIrpef + result.regionalTax + result.municipalTax,
      9,
    )
  })
})

describe('calculateSalary — soglie fiscali interne', () => {
  it('imponibile esattamente a €28.000', () => {
    const result = compute(ralForTaxable(28_000))
    expect(result.taxableIncome).toBeCloseTo(28_000, 6)
    expect(result.grossIrpef).toBeCloseTo(6_440, 4)
    expect(result.employeeDeduction).toBeCloseTo(1_910, 6)
    expect(result.netIrpef).toBeCloseTo(4_530, 4)
  })

  it('imponibile che attraversa €50.000', () => {
    const result = compute(ralForTaxable(50_001))
    expect(result.taxableIncome).toBeCloseTo(50_001, 6)
    expect(result.grossIrpef).toBeCloseTo(14_140 + 0.43, 4)
    expect(result.employeeDeduction).toBe(0)
  })
})

describe('calculateSalary — mensilità 13 vs 14', () => {
  it('il netto annuale NON cambia, quello mensile sì', () => {
    const at13 = compute(30_000, 13)
    const at14 = compute(30_000, 14)

    expect(at14.annualNet).toBeCloseTo(at13.annualNet, 9)
    expect(at14.employeeInps).toBeCloseTo(at13.employeeInps, 9)
    expect(at14.netIrpef).toBeCloseTo(at13.netIrpef, 9)

    expect(at14.monthlyNet).toBeCloseTo(at13.annualNet / 14, 6)
    expect(at14.monthlyNet).not.toBeCloseTo(at13.monthlyNet, 3)
  })
})

describe('calculateSalary — casi limite', () => {
  it('RAL molto bassa: IRPEF netta azzerata dalla detrazione, comunale sotto soglia', () => {
    const result = compute(5_000)
    expect(result.employeeDeduction).toBe(1_955)
    expect(result.netIrpef).toBe(0)
    expect(result.municipalTax).toBe(0)
    expect(result.annualNet).toBeGreaterThan(0)
  })

  it('RAL minima ma positiva: nessun valore negativo nel risultato', () => {
    const result = compute(100)
    expect(result.annualNet).toBeGreaterThan(0)
    expect(result.monthlyNet).toBeGreaterThan(0)
    expect(result.netIrpef).toBe(0)
  })

  it('RAL elevata: terzo scaglione IRPEF e tutte le addizionali attive', () => {
    const result = compute(100_000)
    expect(result.grossIrpef).toBeCloseTo(31_688.3, 3)
    expect(result.employeeDeduction).toBe(0)
    expect(result.regionalTax).toBeCloseTo(1_474.313, 3)
    expect(result.municipalTax).toBeCloseTo(726.48, 3)
    expect(result.annualNet).toBeCloseTo(56_920.907, 3)
  })
})
