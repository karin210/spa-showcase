<script setup lang="ts">
import { ref } from "vue";
import type { DashboardTab } from "~/types/dashboard";
import type { IconName } from "~/types/icon";

interface NavTab {
  id: DashboardTab;
  label: string;
  icon: IconName;
}

const TABS: NavTab[] = [
  { id: "users", label: "Usuarios", icon: "users" },
  { id: "bookings", label: "Citas", icon: "bookings" },
  { id: "team", label: "Equipo", icon: "team" },
  { id: "controls", label: "Controles", icon: "controls" },
  { id: "metrics", label: "Métricas", icon: "metrics" },
];

defineProps<{ activeTab: DashboardTab }>();
const emit = defineEmits<{ "update:tab": [tab: DashboardTab] }>();

const collapsed = ref(false);
</script>

<template>
  <aside class="side-nav" :class="{ 'side-nav--collapsed': collapsed }">
    <!-- Toggle + tabs are wrapped so a single element can stick. -->
    <div class="side-nav__sticky">
      <button
        type="button"
        class="side-nav__toggle"
        :aria-expanded="!collapsed"
        aria-controls="dashboard-nav-tabs"
        :aria-label="collapsed ? 'Expandir menú' : 'Colapsar menú'"
        @click="collapsed = !collapsed"
      >
        <AppIcon name="collapse" class="side-nav__toggle-icon" />
      </button>

      <nav id="dashboard-nav-tabs" class="side-nav__tabs" aria-label="Secciones del panel">
        <button
          v-for="tab in TABS"
          :key="tab.id"
          type="button"
          class="side-nav__tab"
          :aria-current="activeTab === tab.id ? 'page' : undefined"
          :aria-label="collapsed ? tab.label : undefined"
          @click="emit('update:tab', tab.id)"
        >
          <AppIcon :name="tab.icon" class="side-nav__tab-icon" />
          <span class="side-nav__tab-label">{{ tab.label }}</span>
        </button>
      </nav>
    </div>
  </aside>
</template>

<style scoped>
.side-nav {
  --side-nav-padding: clamp(0.75rem, 2vw, 1.5rem);
  background-color: var(--color-surface);
  border-right: 1px solid var(--color-border);
  padding: var(--side-nav-padding);
  padding-right: 0;
}

.side-nav__sticky {
  position: sticky;
  top: calc(var(--header-height) + var(--side-nav-padding));
  display: flex;
  flex-direction: column;
  gap: clamp(0.5rem, 1vw, 1rem);
}

.side-nav__toggle {
  align-self: flex-end;
  display: flex;
  margin-right: var(--side-nav-padding);
  padding: 0.35rem;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--color-primary);
  font-size: clamp(1.1rem, 2vw, 1.3rem);
  cursor: pointer;
}

.side-nav__toggle:hover {
  background-color: var(--color-hover);
}

.side-nav__toggle:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

.side-nav__toggle-icon {
  transition: transform 0.25s ease;
}

.side-nav--collapsed .side-nav__toggle-icon {
  transform: rotate(180deg);
}

.side-nav__tabs {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.side-nav__tab {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: clamp(0.7rem, 1.6vw, 0.9rem) clamp(0.8rem, 1.8vw, 1.25rem);
  border: none;
  border-left: 3px solid transparent;
  background: transparent;
  color: var(--color-ink);
  font-size: clamp(0.9rem, 1.6vw, 1rem);
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.side-nav__tab:hover {
  background-color: var(--color-hover);
  border-left-color: var(--color-primary);
}

.side-nav__tab:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: -2px;
}

.side-nav__tab[aria-current="page"] {
  background-color: var(--color-primary-soft);
  border-left-color: var(--color-primary);
  color: var(--color-primary);
  font-weight: 600;
}

.side-nav__tab-icon {
  font-size: clamp(1.1rem, 2vw, 1.25rem);
}

.side-nav__tab-label {
  overflow: hidden;
  white-space: nowrap;
  width: auto;
  transition: width 0.25s ease;
}

.side-nav--collapsed .side-nav__tab-label {
  width: 0;
}

.side-nav--collapsed .side-nav__tab {
  gap: 0;
}

/* Narrow screens: the menu becomes a horizontal, scrollable strip above the panel. */
@media (max-width: 48rem) {
  .side-nav {
    border-right: none;
    border-bottom: 1px solid var(--color-border);
    padding: 0;
  }

  .side-nav__sticky {
    position: static;
  }

  .side-nav__toggle {
    display: none;
  }

  .side-nav__tabs {
    flex-direction: row;
    overflow-x: auto;
    gap: 0;
  }

  .side-nav__tab {
    flex-direction: column;
    gap: 0.2rem;
    flex: 1 0 auto;
    border-left: none;
    border-bottom: 3px solid transparent;
    font-size: clamp(0.75rem, 2.8vw, 0.85rem);
  }

  .side-nav__tab:hover,
  .side-nav__tab[aria-current="page"] {
    border-bottom-color: var(--color-primary);
  }

  .side-nav--collapsed .side-nav__tab-label {
    width: auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .side-nav__toggle-icon,
  .side-nav__tab-label {
    transition: none;
  }
}
</style>
