export type InstallmentCount = 13 | 14

export interface SalaryCalculationInput {
  /** Retribuzione annua lorda (RAL), in euro. */
  grossAnnualSalary: number
  /** Numero di mensilità: incide solo sul netto mensile, mai sul netto annuale. */
  installments: InstallmentCount
}

export interface TaxBracket {
  /** Limite superiore della scaglione in euro; `null` = nessun limite. */
  upTo: number | null
  /** Aliquota in formato decimale (es. 0.23). */
  rate: number
}

export type DistributionKey = 'net' | 'inps' | 'irpef' | 'regional' | 'municipal'

export interface SalaryDistributionItem {
  key: DistributionKey
  /** Importo in euro. */
  amount: number
  /** Percentuale della RAL (es. 72.1 per il 72,1%). */
  percentageOfGross: number
}

export interface SalaryCalculationResult {
  grossAnnualSalary: number
  installments: InstallmentCount
  /** Contributo INPS dipendente (aliquota semplificata 9,19%). */
  employeeInps: number
  /** Reddito imponibile fiscale: max(0, RAL − INPS). */
  taxableIncome: number
  /** IRPEF lorda, prima delle detrazioni. */
  grossIrpef: number
  /** Detrazione ordinaria da lavoro dipendente (modello 2024). */
  employeeDeduction: number
  /** IRPEF netta: max(0, lorda − detrazione). */
  netIrpef: number
  /** Addizionale regionale Lombardia (scaglioni progressivi). */
  regionalTax: number
  /** Addizionale comunale Milano (0,80% sopra la soglia di esenzione). */
  municipalTax: number
  /** Somma di tutte le trattenute. */
  totalDeductions: number
  annualNet: number
  monthlyNet: number
  /** Trattenute totali in percentuale della RAL (es. 25.46). */
  effectiveTaxRate: number
  distribution: readonly SalaryDistributionItem[]
}
