<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import InfoTooltip from '@/components/base/InfoTooltip.vue'
import { RAL_MAX, RAL_MIN } from '@/domain/salary/salary.constants'
import { formatAmount, formatCurrency } from '@/utils/currency'
import { parseAmount } from '@/utils/number'

const props = defineProps<{
  modelValue: number
  label: string
  info?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const displayValue = ref(formatAmount(props.modelValue))
const isFocused = ref(false)

// Mantiene il display allineato quando il valore cambia dall'esterno (es. clamp al blur).
watch(
  () => props.modelValue,
  (value) => {
    if (!isFocused.value) {
      displayValue.value = formatAmount(value)
    }
  },
)

const parsedValue = computed(() => parseAmount(displayValue.value))
const isOutOfRange = computed(
  () =>
    isFocused.value &&
    !Number.isNaN(parsedValue.value) &&
    (parsedValue.value < RAL_MIN || parsedValue.value > RAL_MAX),
)

function onFocus(): void {
  isFocused.value = true
  displayValue.value = Number.isNaN(parsedValue.value)
    ? String(props.modelValue)
    : String(parsedValue.value)
}

function onInput(): void {
  const value = parseAmount(displayValue.value)
  if (!Number.isNaN(value)) {
    emit('update:modelValue', value)
  }
}

function onBlur(): void {
  isFocused.value = false

  let value = parseAmount(displayValue.value)
  if (Number.isNaN(value)) {
    value = props.modelValue
  }

  // Correzione al blur: mai output silenziosamente fuori range.
  value = Math.min(RAL_MAX, Math.max(RAL_MIN, value))
  emit('update:modelValue', value)
  displayValue.value = formatAmount(value)
}
</script>

<template>
  <div class="salary-input">
    <label class="salary-input__label" for="salary-input-field">
      <span>{{ label }}</span>
      <InfoTooltip v-if="info" :text="info" label="Informazioni sulla RAL" />
    </label>

    <div class="salary-input__field" :class="{ 'salary-input__field--invalid': isOutOfRange }">
      <span class="salary-input__currency" aria-hidden="true">€</span>
      <input
        id="salary-input-field"
        v-model="displayValue"
        type="text"
        inputmode="numeric"
        autocomplete="off"
        class="salary-input__control"
        :aria-invalid="isOutOfRange || undefined"
        aria-describedby="salary-input-hint"
        @focus="onFocus"
        @input="onInput"
        @blur="onBlur"
      />
    </div>

    <p v-show="isOutOfRange" id="salary-input-hint" class="salary-input__hint">
      Valore consentito: da {{ formatCurrency(RAL_MIN) }} a {{ formatCurrency(RAL_MAX) }}
    </p>
  </div>
</template>

<style scoped lang="scss">
.salary-input {
  display: flex;
  flex-direction: column;
  gap: $space-2;
}

.salary-input__label {
  display: flex;
  align-items: center;
  gap: $space-1;
  font-size: $font-size-secondary + 1px;
  font-weight: 500;
  color: $color-text-primary;
}

.salary-input__field {
  display: flex;
  align-items: center;
  gap: $space-2;
  height: $control-height;
  padding: 0 $space-4;
  border: 1px solid $color-border;
  border-radius: $radius-input;
  background: $color-surface;
  transition: border-color $transition-fast;

  &:focus-within {
    border-color: $color-brand-green;
  }

  &--invalid {
    border-color: #c05621;
  }
}

.salary-input__currency {
  color: $color-text-muted;
  font-size: $font-size-title;
}

.salary-input__control {
  width: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  font-size: $font-size-amount - 2px;
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.1;
  color: $color-text-primary;

  &:focus {
    outline: none;
  }

  // Nasconde gli spinner che alcuni browser aggiungono su input numerici.
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    appearance: none;
  }
}

.salary-input__hint {
  font-size: $font-size-caption;
  color: #c05621;
}
</style>
