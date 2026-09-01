<script setup lang="ts">
import { formatCurrency } from '@/utils/currency'

defineProps<{
  monthlyNet: number
  annualNet: number
}>()
</script>

<template>
  <div class="salary-result">
    <div class="salary-result__tile">
      <p class="salary-result__label">Netto mensile</p>
      <p class="salary-result__amount">{{ formatCurrency(monthlyNet) }}</p>
      <p class="salary-result__note">circa</p>
    </div>

    <div class="salary-result__tile salary-result__tile--featured">
      <p class="salary-result__label">Netto annuale</p>
      <p class="salary-result__amount salary-result__amount--featured">
        {{ formatCurrency(annualNet) }}
      </p>
      <p class="salary-result__note">circa</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.salary-result {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $space-3;
}

.salary-result__tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-1;
  padding: $space-6 $space-4;
  border: 1px solid $color-border;
  border-radius: $radius-tile;
  background: $color-surface;
  text-align: center;
  min-width: 0;
}

.salary-result__tile--featured {
  border-color: $color-brand-green-border;
  background: $color-brand-green-soft;
}

.salary-result__label {
  font-size: $font-size-secondary + 1px;
  font-weight: 600;
  color: $color-text-primary;
}

.salary-result__amount {
  font-size: clamp(22px, 6.2vw, $font-size-amount);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.1;
  color: $color-text-primary;
  font-variant-numeric: tabular-nums;
}

.salary-result__amount--featured {
  font-size: clamp(24px, 6.8vw, $font-size-amount-lg);
}

.salary-result__note {
  font-size: $font-size-caption;
  color: $color-text-muted;
}
</style>
