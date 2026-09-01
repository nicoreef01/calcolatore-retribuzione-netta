<script setup lang="ts">
import AppSidebar from '@/components/layout/AppSidebar.vue'
import SalaryCalculatorView from '@/views/SalaryCalculatorView.vue'
</script>

<template>
  <div class="app-shell">
    <AppSidebar />
    <main class="app-main">
      <SalaryCalculatorView />
    </main>
  </div>
</template>

<style scoped lang="scss">
.app-shell {
  display: flex;
  min-height: 100vh;
}

.app-main {
  flex: 1;
  min-width: 0;
  padding: $space-8 $space-10 $space-12;
}

@include sidebar-down {
  .app-shell {
    flex-direction: column;
  }

  .app-main {
    padding: $space-6 $space-5 $space-10;
  }
}

@include phone-down {
  .app-main {
    padding: $space-5 $space-4 $space-8;
  }
}
</style>
