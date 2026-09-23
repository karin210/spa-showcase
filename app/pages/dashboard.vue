<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import type { DashboardTab } from "~/types/dashboard";

const { t: trans } = useI18n();

useHead(() => ({ title: trans("dashboard.meta.title") }));

const activeTab = ref<DashboardTab>("bookings");
</script>

<template>
  <SiteHeader />
  <div class="dashboard">
    <DashboardSideNavMenu :active-tab="activeTab" @update:tab="activeTab = $event" />
    <main class="dashboard__main">
      <DashboardUsers v-if="activeTab === 'users'" />
      <DashboardBookings v-else-if="activeTab === 'bookings'" />
      <DashboardTeam v-else-if="activeTab === 'team'" />
      <DashboardControls v-else-if="activeTab === 'controls'" />
      <DashboardMetrics v-else />
    </main>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  min-height: calc(100vh - var(--header-height));
}

.dashboard__main {
  flex: 1;
  min-width: 0;
  max-width: 72rem;
  padding: clamp(1.25rem, 3vw, 2.5rem) clamp(1rem, 3vw, 2.5rem);
}

@media (max-width: 48rem) {
  .dashboard {
    flex-direction: column;
  }
}
</style>
