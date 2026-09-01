<script setup lang="ts">
import { computed } from 'vue'
import BaseCard from '@/components/base/BaseCard.vue'
import CalculationBreakdown from '@/components/calculator/CalculationBreakdown.vue'
import type { BreakdownRowData } from '@/components/calculator/breakdown.types'
import DistributionBar from '@/components/calculator/DistributionBar.vue'
import type { DistributionItemData } from '@/components/calculator/distribution.types'
import DistributionLegend from '@/components/calculator/DistributionLegend.vue'
import InstallmentSelector from '@/components/calculator/InstallmentSelector.vue'
import SalaryInput from '@/components/calculator/SalaryInput.vue'
import SalaryResult from '@/components/calculator/SalaryResult.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import { useSalaryCalculator } from '@/composables/useSalaryCalculator'
import { howWeCalculate, disclaimer } from '@/config/appContent'

const { grossAnnualSalary, installments, result } = useSalaryCalculator()

const installmentOptions = [
  { value: 13 as const, label: '13 mensilità' },
  { value: 14 as const, label: '14 mensilità' },
]

const breakdownRows = computed<BreakdownRowData[]>(() => [
  {
    index: 1,
    title: 'Contributi INPS',
    description: 'Pensioni / contributi previdenziali',
    amount: result.value.employeeInps,
    percentage: result.value.distribution[1].percentageOfGross,
  },
  {
    index: 2,
    title: 'IRPEF netta',
    description: 'Imposta sul reddito delle persone fisiche',
    amount: result.value.netIrpef,
    percentage: result.value.distribution[2].percentageOfGross,
  },
  {
    index: 3,
    title: 'Addizionale regionale (Lombardia)',
    description: 'Aliquote regionali progressive',
    amount: result.value.regionalTax,
    percentage: result.value.distribution[3].percentageOfGross,
  },
  {
    index: 4,
    title: 'Addizionale comunale (Milano)',
    description: 'Aliquota 0,80%',
    amount: result.value.municipalTax,
    percentage: result.value.distribution[4].percentageOfGross,
  },
])

const distributionItems = computed<DistributionItemData[]>(() => [
  { key: 'net', label: 'Netto percepito', ...pick(result.value.distribution, 'net') },
  { key: 'inps', label: 'Contributi INPS', ...pick(result.value.distribution, 'inps') },
  { key: 'irpef', label: 'IRPEF netta', ...pick(result.value.distribution, 'irpef') },
  { key: 'regional', label: 'Addizionale regionale', ...pick(result.value.distribution, 'regional') },
  { key: 'municipal', label: 'Addizionale comunale', ...pick(result.value.distribution, 'municipal') },
])

function pick(
  distribution: readonly { key: string; amount: number; percentageOfGross: number }[],
  key: string,
): { amount: number; percentage: number } {
  const item = distribution.find((entry) => entry.key === key)
  return { amount: item?.amount ?? 0, percentage: item?.percentageOfGross ?? 0 }
}
</script>

<template>
  <div class="salary-calculator">
    <AppHeader />

    <div class="salary-calculator__grid">
      <BaseCard title="Imposta i parametri" class="salary-calculator__parameters">
        <div class="salary-calculator__controls">
          <SalaryInput
            v-model="grossAnnualSalary"
            label="Retribuzione lorda annuale (RAL)"
            info="La Retribuzione Annua Lorda rappresenta la retribuzione lorda annuale utilizzata come base del calcolo."
          />
          <InstallmentSelector
            v-model="installments"
            label="Mensilità"
            info="Il numero di mensilità modifica il netto medio per cedolino, non il netto annuale stimato."
            :options="installmentOptions"
          />
        </div>

        <p class="salary-calculator__caption">
          I calcoli sono basati sul modello fiscale 2024 e sulle semplificazioni dichiarate.
        </p>

        <details class="salary-calculator__how">
          <summary class="salary-calculator__how-summary">
            {{ howWeCalculate.summary }}
            <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true">
              <path
                d="M3 4.5 6 7.5 9 4.5"
                fill="none"
                stroke="currentColor"
                stroke-width="1.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </summary>
          <div class="salary-calculator__how-body">
            <p>{{ howWeCalculate.intro }}</p>
            <ul>
              <li v-for="assumption in howWeCalculate.assumptions" :key="assumption">
                {{ assumption }}
              </li>
            </ul>
            <p>{{ howWeCalculate.closing }}</p>
          </div>
        </details>
      </BaseCard>

      <BaseCard title="Risultato netto" class="salary-calculator__results">
        <SalaryResult :monthly-net="result.monthlyNet" :annual-net="result.annualNet" />
      </BaseCard>
    </div>

    <BaseCard class="salary-calculator__breakdown">
      <div class="salary-calculator__breakdown-grid">
        <div class="salary-calculator__breakdown-left">
          <h2 class="salary-calculator__section-title">Dettaglio trattenute e calcolo</h2>
          <CalculationBreakdown
            :rows="breakdownRows"
            net-label="Netto annuale"
            net-description="Importo che il dipendente percepisce"
            :net-amount="result.annualNet"
            :net-percentage="result.distribution[0].percentageOfGross"
          />
        </div>

        <div class="salary-calculator__breakdown-right">
          <h2 class="salary-calculator__section-title">Ripartizione percentuale</h2>
          <DistributionBar :items="distributionItems" />
          <DistributionLegend class="salary-calculator__legend" :items="distributionItems" />
        </div>
      </div>
    </BaseCard>

    <footer class="salary-calculator__disclaimer">
      <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true" class="salary-calculator__disclaimer-icon">
        <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.3" />
        <rect x="7.25" y="7" width="1.5" height="4.6" rx="0.75" fill="currentColor" />
        <circle cx="8" cy="4.7" r="0.9" fill="currentColor" />
      </svg>
      <p>{{ disclaimer }}</p>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.salary-calculator {
  display: flex;
  flex-direction: column;
  gap: $space-6;
  width: 100%;
  min-width: 0;
  max-width: $content-max-width;
  margin-inline: auto;
}

.salary-calculator__grid {
  display: grid;
  grid-template-columns: 1.28fr 1fr;
  gap: $space-4;
  align-items: stretch;
}

.salary-calculator__controls {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: $space-5;
  align-items: start;
}

.salary-calculator__caption {
  margin-top: $space-5;
  font-size: $font-size-caption;
  color: $color-text-muted;
}

.salary-calculator__how {
  margin-top: $space-3;
}

.salary-calculator__how-summary {
  display: inline-flex;
  align-items: center;
  gap: $space-1;
  font-size: $font-size-caption;
  font-weight: 600;
  color: $color-brand-green-dark;
  cursor: pointer;
  list-style: none;

  &::-webkit-details-marker {
    display: none;
  }

  svg {
    transition: transform $transition-fast;
  }

  @include focus-ring;
}

.salary-calculator__how[open] .salary-calculator__how-summary svg {
  transform: rotate(180deg);
}

.salary-calculator__how-body {
  margin-top: $space-3;
  padding: $space-4;
  border: 1px solid $color-border;
  border-radius: $radius-tile;
  background: $color-surface-soft;
  font-size: $font-size-caption;
  color: $color-text-secondary;

  ul {
    display: flex;
    flex-direction: column;
    gap: $space-1;
    margin: $space-2 0;
    padding-left: $space-4;

    li {
      list-style: disc;
    }
  }
}

.salary-calculator__breakdown-grid {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: $space-8;
}

.salary-calculator__section-title {
  @include heading-section;

  margin-bottom: $space-4;
}

.salary-calculator__legend {
  margin-top: $space-6;
}

.salary-calculator__disclaimer {
  display: flex;
  align-items: center;
  gap: $space-3;
  padding: $space-4 $space-5;
  border: 1px solid $color-border;
  border-radius: $radius-card;
  background: $color-surface;
  color: $color-text-secondary;
  font-size: $font-size-secondary;
}

.salary-calculator__disclaimer-icon {
  flex-shrink: 0;
  color: $color-text-muted;
}

@include parameters-down {
  .salary-calculator__grid {
    grid-template-columns: 1fr;
  }
}

@include breakdown-down {
  .salary-calculator__breakdown-grid {
    grid-template-columns: 1fr;
    gap: $space-6;
  }
}

@include phone-down {
  .salary-calculator__controls {
    grid-template-columns: 1fr;
    gap: $space-4;
  }

  .salary-calculator__disclaimer {
    align-items: flex-start;
  }
}
</style>
