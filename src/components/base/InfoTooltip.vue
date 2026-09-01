<script setup lang="ts">
import { useId } from 'vue'

defineProps<{
  /** Testo del tooltip. */
  text: string
  /** Etichetta accessibile del pulsante-icona. */
  label?: string
}>()

const tooltipId = useId()
</script>

<template>
  <span class="info-tooltip">
    <button
      type="button"
      class="info-tooltip__trigger"
      :aria-label="label ?? 'Informazioni'"
      :aria-describedby="tooltipId"
    >
      <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true" class="info-tooltip__icon">
        <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.4" />
        <rect x="7.25" y="7" width="1.5" height="4.6" rx="0.75" fill="currentColor" />
        <circle cx="8" cy="4.7" r="0.9" fill="currentColor" />
      </svg>
    </button>
    <span :id="tooltipId" role="tooltip" class="info-tooltip__bubble">{{ text }}</span>
  </span>
</template>

<style scoped lang="scss">
.info-tooltip {
  position: relative;
  display: inline-flex;
  color: $color-text-muted;
}

.info-tooltip__trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  border-radius: 50%;
  color: $color-text-muted;
  transition: color $transition-fast;

  &:hover {
    color: $color-brand-green;
  }

  @include focus-ring;
}

.info-tooltip__bubble {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  z-index: 30;
  width: min(230px, calc(100vw - 48px));
  padding: $space-2 $space-3;
  border: 1px solid $color-border;
  border-radius: 8px;
  background: $color-surface;
  box-shadow: 0 6px 18px rgb(27 30 24 / 8%);
  color: $color-text-primary;
  font-size: $font-size-caption;
  font-weight: 400;
  line-height: 1.45;
  text-align: left;
  letter-spacing: normal;
  opacity: 0;
  visibility: hidden;
  transform: translateX(-50%) translateY(4px);
  transition:
    opacity $transition-fast,
    transform $transition-fast,
    visibility $transition-fast;
  pointer-events: none;

  .info-tooltip:hover &,
  .info-tooltip:focus-within & {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(0);
  }

  @media (max-width: 600px) {
    left: auto;
    right: -8px;
    transform: translateY(4px);

    .info-tooltip:hover &,
    .info-tooltip:focus-within & {
      transform: translateY(0);
    }
  }
}
</style>
