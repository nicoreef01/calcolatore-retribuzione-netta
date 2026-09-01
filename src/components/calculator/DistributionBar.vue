<script setup lang="ts">
import { computed } from 'vue'
import type { DistributionItemData } from '@/components/calculator/distribution.types'
import { formatPercent } from '@/utils/number'

const props = defineProps<{
  items: readonly DistributionItemData[]
}>()

// Sotto questa soglia percentuale il testo dentro il segmento sarebbe illeggibile.
const MIN_LABEL_PERCENTAGE = 7

const visibleLabels = computed(() =>
  new Set(
    props.items
      .filter((item) => item.percentage >= MIN_LABEL_PERCENTAGE)
      .map((item) => item.key),
  ),
)

const ariaSummary = computed(() =>
  props.items.map((item) => `${item.label} ${formatPercent(item.percentage)}`).join(', '),
)
</script>

<template>
  <div class="distribution-bar" role="img" :aria-label="`Ripartizione della RAL: ${ariaSummary}`">
    <div
      v-for="item in items"
      :key="item.key"
      class="distribution-bar__segment"
      :class="`distribution-bar__segment--${item.key}`"
      :style="{ flexGrow: item.percentage }"
    >
      <span
        v-if="visibleLabels.has(item.key)"
        class="distribution-bar__label"
        :class="{ 'distribution-bar__label--light': item.key === 'net' }"
        >{{ formatPercent(item.percentage) }}</span
      >
    </div>
  </div>
</template>

<style scoped lang="scss">
.distribution-bar {
  display: flex;
  height: 42px;
  border-radius: $radius-input;
  overflow: hidden;
}

.distribution-bar__segment {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-basis: 0;
  min-width: 6px;
  transition: flex-grow $transition-base;
}

.distribution-bar__segment--net {
  background: $color-tax-net;
}

.distribution-bar__segment--inps {
  background: $color-tax-inps;
}

.distribution-bar__segment--irpef {
  background: $color-tax-irpef;
}

.distribution-bar__segment--regional {
  background: $color-tax-regional;
}

.distribution-bar__segment--municipal {
  background: $color-tax-municipal;
}

.distribution-bar__label {
  font-size: $font-size-caption;
  font-weight: 600;
  color: $color-text-primary;
  font-variant-numeric: tabular-nums;
}

.distribution-bar__label--light {
  color: #ffffff;
}
</style>
