<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<template>
  <section class="base-card">
    <h2 v-if="title" class="base-card__title">{{ title }}</h2>
    <slot />
  </section>
</template>

<style scoped lang="scss">
.base-card {
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: $radius-card;
  padding: $space-6;
}

.base-card__title {
  @include heading-section;

  margin-bottom: $space-6;
}
</style>
