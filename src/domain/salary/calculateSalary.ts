import { calculateEmployeeDeduction } from './calculations/calculateEmployeeDeduction'
import { calculateInps } from './calculations/calculateInps'
import { calculateIrpefGross } from './calculations/calculateIrpefGross'
import { calculateMunicipalTax } from './calculations/calculateMunicipalTax'
import { calculateRegionalTax } from './calculations/calculateRegionalTax'
import type { DistributionKey, SalaryCalculationInput, SalaryCalculationResult } from './salary.types'

/**
 * Pipeline di calcolo (waterfall):
 * RAL → INPS → imponibile → IRPEF lorda → detrazione → IRPEF netta
 *     → addizionale regionale → addizionale comunale → netto annuale → netto mensile.
 *
 * Precisione: nessun arrotondamento intermedio; si arrotonda solo in fase di presentazione.
 */
export function calculateSalary(input: SalaryCalculationInput): SalaryCalculationResult {
  const grossAnnualSalary = Math.max(0, input.grossAnnualSalary)
  const { installments } = input

  const employeeInps = calculateInps(grossAnnualSalary)
  const taxableIncome = Math.max(0, grossAnnualSalary - employeeInps)

  const grossIrpef = calculateIrpefGross(taxableIncome)
  const employeeDeduction = calculateEmployeeDeduction(taxableIncome)
  const netIrpef = Math.max(0, grossIrpef - employeeDeduction)

  const regionalTax = calculateRegionalTax(taxableIncome)
  const municipalTax = calculateMunicipalTax(taxableIncome)

  const totalDeductions = employeeInps + netIrpef + regionalTax + municipalTax
  const annualNet = grossAnnualSalary - totalDeductions
  // Le mensilità incidono SOLO sul netto per cedolino, mai sui risultati annuali.
  const monthlyNet = annualNet / installments

  const effectiveTaxRate = percentageOf(grossAnnualSalary, totalDeductions)

  const distribution = [
    { key: 'net', amount: annualNet },
    { key: 'inps', amount: employeeInps },
    { key: 'irpef', amount: netIrpef },
    { key: 'regional', amount: regionalTax },
    { key: 'municipal', amount: municipalTax },
  ].map(({ key, amount }) => ({
    key: key as DistributionKey,
    amount,
    percentageOfGross: percentageOf(grossAnnualSalary, amount),
  }))

  return {
    grossAnnualSalary,
    installments,
    employeeInps,
    taxableIncome,
    grossIrpef,
    employeeDeduction,
    netIrpef,
    regionalTax,
    municipalTax,
    totalDeductions,
    annualNet,
    monthlyNet,
    effectiveTaxRate,
    distribution,
  }
}

function percentageOf(grossAnnualSalary: number, amount: number): number {
  if (grossAnnualSalary <= 0) {
    return 0
  }

  return (amount / grossAnnualSalary) * 100
}
