import { EMPLOYEE_INPS_RATE } from '../salary.constants'

/** Contributi INPS dipendente secondo l'aliquota semplificata del modello (9,19%). */
export function calculateInps(grossAnnualSalary: number): number {
  return Math.max(0, grossAnnualSalary) * EMPLOYEE_INPS_RATE
}
