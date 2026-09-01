import { computed, ref } from 'vue'
import { calculateSalary } from '@/domain/salary/calculateSalary'
import { DEFAULT_INSTALLMENTS, DEFAULT_RAL } from '@/domain/salary/salary.constants'
import type { InstallmentCount } from '@/domain/salary/salary.types'

/**
 * Ponte tra UI e dominio: stato reattivo dei parametri e risultato derivato.
 * Nessuna formula qui — solo orchestrare `calculateSalary`.
 */
export function useSalaryCalculator() {
  const grossAnnualSalary = ref(DEFAULT_RAL)
  const installments = ref<InstallmentCount>(DEFAULT_INSTALLMENTS)

  const result = computed(() =>
    calculateSalary({
      grossAnnualSalary: grossAnnualSalary.value,
      installments: installments.value,
    }),
  )

  return {
    grossAnnualSalary,
    installments,
    result,
  }
}
