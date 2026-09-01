import type { DistributionKey } from '@/domain/salary/salary.types'

/** Elemento condiviso da barra e legenda di ripartizione (chiavi: dominio; label: UI). */
export interface DistributionItemData {
  key: DistributionKey
  label: string
  amount: number
  percentage: number
}
