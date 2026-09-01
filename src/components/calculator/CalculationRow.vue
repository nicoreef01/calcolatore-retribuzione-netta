<script setup lang="ts">
import { formatDeduction } from '@/utils/currency'
import { formatPercentOfGross } from '@/utils/number'

defineProps<{
  index: number
  title: string
  description: string
  amount: number
  percentage: number
}>()
</script>

<template>
  <div class="calculation-row">
    <span class="calculation-row__index" aria-hidden="true">{{ index }}</span>

    <div class="calculation-row__content">
      <p class="calculation-row__title">{{ title }}</p>
      <p class="calculation-row__description">{{ description }}</p>
    </div>

    <div class="calculation-row__values">
      <p class="calculation-row__amount">{{ formatDeduction(amount) }}</p>
      <p class="calculation-row__percentage">{{ formatPercentOfGross(percentage) }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.calculation-row {
  display: flex;
  align-items: center;
  gap: $space-4;
  padding: $space-4 0;
  border-bottom: 1px solid $color-border;
}

.calculation-row__index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  border-radius: 50%;
  background: $color-surface-soft;
  border: 1px solid $color-border;
  color: $color-text-secondary;
  font-size: $font-size-caption;
  font-weight: 600;
}

.calculation-row__content {
  min-width: 0;
  flex: 1;
}

.calculation-row__title {
  font-size: $font-size-title - 1px;
  font-weight: 600;
  color: $color-text-primary;
}

.calculation-row__description {
  font-size: $font-size-caption;
  color: $color-text-muted;
}

.calculation-row__values {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  flex-shrink: 0;
}

.calculation-row__amount {
  font-size: $font-size-title - 1px;
  font-weight: 600;
  color: $color-text-primary;
  font-variant-numeric: tabular-nums;
}

.calculation-row__percentage {
  font-size: $font-size-caption;
  color: $color-text-muted;
  font-variant-numeric: tabular-nums;
}
</style>
