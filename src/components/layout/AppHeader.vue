<script setup lang="ts">
</script>

<template>
  <header class="app-header">
    <div class="app-header__badge-row">
      <span class="app-header__badge">Tool</span>
      <span class="app-header__rule" aria-hidden="true"></span>
    </div>

    <h1 class="app-header__title">Calcolatore retribuzione netta</h1>
    <p class="app-header__subtitle">
      Simula la retribuzione netta annuale e mensile a partire da una RAL. Calcolo semplificato per
      un impiegato a tempo indeterminato residente a Milano, senza agevolazioni.
    </p>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  display: flex;
  flex-direction: column;
  gap: $space-3;
}

.app-header__badge-row {
  display: flex;
  align-items: center;
  gap: $space-4;
}

.app-header__badge {
  padding: 3px $space-3;
  border: 1px solid $color-brand-green-border;
  border-radius: 7px;
  background: $color-brand-green-soft;
  color: $color-brand-green-dark;
  font-size: $font-size-caption;
  font-weight: 600;
  letter-spacing: 0.01em;
}

.app-header__rule {
  flex: 1;
  height: 1px;
  background: $color-border;
}

.app-header__title {
  margin-top: $space-1;
}

.app-header__subtitle {
  font-size: $font-size-secondary + 1px;
  color: $color-text-secondary;
}
</style>
