<script setup lang="ts">
import CalculationRow from '@/components/calculator/CalculationRow.vue'
import type { BreakdownRowData } from '@/components/calculator/breakdown.types'
import { formatCurrency } from '@/utils/currency'
import { formatPercentOfGross } from '@/utils/number'

defineProps<{
  rows: readonly BreakdownRowData[]
  netLabel: string
  netDescription: string
  netAmount: number
  netPercentage: number
}>()
</script>

<template>
  <div class="calculation-breakdown">
    <CalculationRow v-for="row in rows" :key="row.index" v-bind="row" />

    <div class="calculation-breakdown__net">
      <div class="calculation-breakdown__net-content">
        <p class="calculation-breakdown__net-title">{{ netLabel }}</p>
        <p class="calculation-breakdown__net-description">{{ netDescription }}</p>
      </div>
      <div class="calculation-breakdown__net-values">
        <p class="calculation-breakdown__net-amount">{{ formatCurrency(netAmount) }}</p>
        <p class="calculation-breakdown__net-percentage">
          {{ formatPercentOfGross(netPercentage) }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.calculation-breakdown {
  display: flex;
  flex-direction: column;
}

.calculation-breakdown__net {
  display: flex;
  align-items: center;
  gap: $space-4;
  margin-top: $space-4;
  padding: $space-4 $space-4;
  border: 1px solid $color-brand-green-border;
  border-radius: $radius-tile;
  background: $color-brand-green-soft;
}

.calculation-breakdown__net-content {
  flex: 1;
  min-width: 0;
}

.calculation-breakdown__net-title {
  font-size: $font-size-title - 1px;
  font-weight: 600;
  color: $color-text-primary;
}

.calculation-breakdown__net-description {
  font-size: $font-size-caption;
  color: $color-text-secondary;
}

.calculation-breakdown__net-values {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  flex-shrink: 0;
}

.calculation-breakdown__net-amount {
  font-size: $font-size-amount - 6px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: $color-text-primary;
  font-variant-numeric: tabular-nums;
}

.calculation-breakdown__net-percentage {
  font-size: $font-size-caption;
  color: $color-text-secondary;
  font-variant-numeric: tabular-nums;
}
</style>
