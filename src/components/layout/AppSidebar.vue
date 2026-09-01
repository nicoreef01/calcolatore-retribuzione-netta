<script setup lang="ts">
import { ref } from 'vue'
import { profile, sidebarLinks } from '@/config/appContent'

const isCollapsed = ref(false)
</script>

<template>
  <aside class="app-sidebar" :class="{ 'app-sidebar--collapsed': isCollapsed }">
    <div class="app-sidebar__header">
      <span v-if="!isCollapsed" class="app-sidebar__brand">AI Builder – Jet HR</span>
      <button
        type="button"
        class="app-sidebar__mark"
        :aria-expanded="!isCollapsed"
        :aria-label="isCollapsed ? 'Espandi il menu laterale' : 'Riduci il menu laterale'"
        :title="isCollapsed ? 'Espandi il menu laterale' : 'Riduci il menu laterale'"
        @click="isCollapsed = !isCollapsed"
      >
        <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
          <path
            d="M10 3.5 5.5 8l4.5 4.5"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>

    <nav class="app-sidebar__nav" aria-label="Collegamenti del profilo">
      <a
        v-for="link in sidebarLinks"
        :key="link.id"
        :href="link.href"
        target="_blank"
        rel="noopener noreferrer"
        class="app-sidebar__nav-item"
        :title="link.label"
      >
        <svg
          v-if="link.id === 'cv'"
          viewBox="0 0 16 16"
          width="15"
          height="15"
          aria-hidden="true"
          class="app-sidebar__nav-icon"
        >
          <path
            d="M8 2v8m0 0 3-3m-3 3L5 7M3 12.5h10"
            fill="none"
            stroke="currentColor"
            stroke-width="1.4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <svg
          v-else
          viewBox="0 0 16 16"
          width="15"
          height="15"
          aria-hidden="true"
          class="app-sidebar__nav-icon"
        >
          <path
            d="M6 7v5M6 4.2v.1M9.5 12V9.2c0-1.2.8-2.2 2-2.2s2 1 2 2.2V12"
            fill="none"
            stroke="currentColor"
            stroke-width="1.4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <rect x="2" y="2" width="12" height="12" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.4" />
        </svg>
        <span v-if="!isCollapsed">{{ link.label }}</span>
      </a>
    </nav>

    <div class="app-sidebar__profile">
      <span class="app-sidebar__avatar" aria-hidden="true">{{ profile.initials }}</span>
      <span v-if="!isCollapsed" class="app-sidebar__profile-text">
        <span class="app-sidebar__profile-name">{{ profile.name }}</span>
        <span class="app-sidebar__profile-role">{{ profile.role }}</span>
      </span>
    </div>
  </aside>
</template>

<style scoped lang="scss">
.app-sidebar {
  position: sticky;
  top: 0;
  align-self: flex-start;
  display: flex;
  flex-direction: column;
  gap: $space-8;
  width: $sidebar-width;
  height: 100vh;
  flex-shrink: 0;
  padding: $space-5 $space-5 $space-5 $space-6;
  border-right: 1px solid $color-border;
  background: $color-surface;
  overflow: hidden auto;
  transition: width $transition-base;
}

.app-sidebar--collapsed {
  width: 68px;
  padding-inline: $space-3;

  .app-sidebar__header {
    justify-content: center;
  }

  .app-sidebar__nav-item {
    justify-content: center;
    padding-inline: 0;
  }

  .app-sidebar__profile {
    justify-content: center;
    padding: $space-2;
  }

  .app-sidebar__avatar {
    width: 30px;
    height: 30px;
  }
}

.app-sidebar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $space-2;
}

.app-sidebar__brand {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: $color-text-primary;
  white-space: nowrap;
}

.app-sidebar__mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  border: 1px solid $color-border-strong;
  border-radius: 5px;
  background: $color-surface;
  color: $color-text-secondary;
  transition:
    color $transition-fast,
    border-color $transition-fast;

  svg {
    transition: transform $transition-base;
  }

  &:hover {
    color: $color-text-primary;
    border-color: $color-text-muted;
  }

  @include focus-ring;
}

.app-sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: $space-1;
}

.app-sidebar__nav-item {
  display: flex;
  align-items: center;
  gap: $space-3;
  padding: $space-2;
  border-radius: 8px;
  font-size: $font-size-secondary + 1px;
  font-weight: 500;
  color: $color-text-secondary;
  text-align: left;
  text-decoration: none;
  white-space: nowrap;
  transition:
    color $transition-fast,
    background-color $transition-fast;

  &:hover {
    color: $color-text-primary;
    background: $color-surface-soft;
  }

  @include focus-ring;
}

.app-sidebar__nav-icon {
  flex-shrink: 0;
  color: $color-text-muted;
}

.app-sidebar__profile {
  display: flex;
  align-items: center;
  gap: $space-3;
  margin-top: auto;
  padding: $space-3;
  border: 1px solid $color-border;
  border-radius: $radius-tile;
  white-space: nowrap;
}

.app-sidebar__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border-radius: 8px;
  background: #171a15;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.app-sidebar__profile-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.app-sidebar__profile-name {
  font-size: $font-size-secondary + 0.5px;
  font-weight: 600;
  color: $color-text-primary;
}

.app-sidebar__profile-role {
  font-size: $font-size-caption;
  color: $color-text-muted;
}

@include sidebar-down {
  .app-sidebar {
    position: static;
    flex-direction: row;
    align-items: center;
    gap: $space-4;
    width: 100%;
    height: auto;
    min-height: 0;
    padding: $space-3 $space-4;
    border-right: 0;
    border-bottom: 1px solid $color-border;
    overflow: visible;
  }

  .app-sidebar__nav {
    flex-direction: row;
    flex-wrap: wrap;
    margin-left: auto;
  }

  .app-sidebar__nav-item {
    padding: $space-1 $space-2;
  }

  .app-sidebar__profile {
    margin-top: 0;
    padding: $space-1 $space-2 $space-1 $space-1;
    border: 0;
  }

  .app-sidebar__mark {
    display: none;
  }
}

@include phone-down {
  .app-sidebar__nav {
    display: none;
  }
}
</style>
