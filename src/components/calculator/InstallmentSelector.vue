<script setup lang="ts">
import InfoTooltip from '@/components/base/InfoTooltip.vue'
import type { InstallmentCount } from '@/domain/salary/salary.types'

const props = defineProps<{
  modelValue: InstallmentCount
  label: string
  info?: string
  options: readonly { value: InstallmentCount; label: string }[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: InstallmentCount]
}>()

function select(value: InstallmentCount): void {
  if (value !== props.modelValue) {
    emit('update:modelValue', value)
  }
}
</script>

<template>
  <div class="installment-selector">
    <span class="installment-selector__label" id="installment-selector-label">
      <span>{{ label }}</span>
      <InfoTooltip v-if="info" :text="info" label="Informazioni sulle mensilità" />
    </span>

    <div
      class="installment-selector__group"
      role="group"
      aria-labelledby="installment-selector-label"
    >
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        class="installment-selector__option"
        :class="{ 'installment-selector__option--active': option.value === modelValue }"
        :aria-pressed="option.value === modelValue"
        @click="select(option.value)"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.installment-selector {
  display: flex;
  flex-direction: column;
  gap: $space-2;
}

.installment-selector__label {
  display: flex;
  align-items: center;
  gap: $space-1;
  font-size: $font-size-secondary + 1px;
  font-weight: 500;
  color: $color-text-primary;
}

.installment-selector__group {
  display: flex;
  gap: $space-2;
}

.installment-selector__option {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-width: 0;
  min-height: $control-height;
  padding: $space-2 $space-4;
  border: 1px solid $color-border;
  border-radius: $radius-input;
  background: $color-surface;
  font-size: $font-size-secondary + 1px;
  font-weight: 500;
  color: $color-text-secondary;
  white-space: nowrap;
  transition:
    border-color $transition-fast,
    background-color $transition-fast,
    color $transition-fast;

  &:hover {
    border-color: $color-border-strong;
    color: $color-text-primary;
  }

  &--active {
    border-color: $color-brand-green;
    background: $color-brand-green-soft;
    color: $color-brand-green-dark;
    font-weight: 600;
  }

  @include focus-ring;
}

@include phone-down {
  .installment-selector__option {
    padding: $space-2 $space-2;
    font-size: $font-size-secondary;
  }
}
</style>
