<script setup lang="ts">
import type { DistributionItemData } from '@/components/calculator/distribution.types'
import { formatCurrency } from '@/utils/currency'
import { formatPercent } from '@/utils/number'

defineProps<{
  items: readonly DistributionItemData[]
}>()
</script>

<template>
  <ul class="distribution-legend">
    <li v-for="item in items" :key="item.key" class="distribution-legend__row">
      <span
        class="distribution-legend__marker"
        :class="`distribution-legend__marker--${item.key}`"
        aria-hidden="true"
      ></span>
      <span class="distribution-legend__label">{{ item.label }}</span>
      <span class="distribution-legend__amount">{{ formatCurrency(item.amount) }}</span>
      <span class="distribution-legend__percentage">{{ formatPercent(item.percentage) }}</span>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.distribution-legend {
  display: flex;
  flex-direction: column;
  gap: $space-3;
}

.distribution-legend__row {
  display: grid;
  grid-template-columns: 14px minmax(0, 1fr) auto 52px;
  align-items: center;
  gap: $space-3;
}

.distribution-legend__marker {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.distribution-legend__marker--net {
  background: $color-tax-net;
}

.distribution-legend__marker--inps {
  background: $color-tax-inps;
}

.distribution-legend__marker--irpef {
  background: $color-tax-irpef;
}

.distribution-legend__marker--regional {
  background: $color-tax-regional;
}

.distribution-legend__marker--municipal {
  background: $color-tax-municipal;
}

.distribution-legend__label {
  font-size: $font-size-secondary + 1px;
  color: $color-text-primary;
  min-width: 0;
  overflow-wrap: break-word;
}

.distribution-legend__amount,
.distribution-legend__percentage {
  font-size: $font-size-secondary + 1px;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.distribution-legend__amount {
  font-weight: 500;
  color: $color-text-primary;
}

.distribution-legend__percentage {
  color: $color-text-secondary;
}

@include phone-down {
  .distribution-legend__row {
    grid-template-columns: 14px 1fr auto 44px;
    gap: $space-2;
  }
}
</style>
