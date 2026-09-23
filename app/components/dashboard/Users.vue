<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import type { UserRecord } from "~/types/user";
import { useUsers } from "~/composables/useUsers";

const PAGE_SIZE = 8;

const { t: trans } = useI18n();
const { users } = useUsers();

const sort = ref<"asc" | "desc">("desc");
const page = ref(1);

const sortedUsers = computed<UserRecord[]>(() =>
  [...users.value].sort((a, b) =>
    sort.value === "asc"
      ? a.createdAt.getTime() - b.createdAt.getTime()
      : b.createdAt.getTime() - a.createdAt.getTime(),
  ),
);

const totalPages = computed<number>(() => Math.ceil(sortedUsers.value.length / PAGE_SIZE));
const pageUsers = computed<UserRecord[]>(() =>
  sortedUsers.value.slice((page.value - 1) * PAGE_SIZE, page.value * PAGE_SIZE),
);

function onSortChange(): void {
  page.value = 1;
}
</script>

<template>
  <section class="panel" aria-labelledby="users-heading">
    <header class="panel-header">
      <h2 id="users-heading" class="panel-heading">{{ trans("dashboard.tabs.users") }}</h2>
      <p class="panel-count">{{ trans("dashboard.users.total", { count: users.length }) }}</p>
    </header>

    <div class="panel-toolbar">
      <label class="toolbar-section">
        <span class="toolbar-label">{{ trans("dashboard.users.sort") }}</span>
        <select v-model="sort" class="panel-select" @change="onSortChange">
          <option value="desc">{{ trans("dashboard.users.newest") }}</option>
          <option value="asc">{{ trans("dashboard.users.oldest") }}</option>
        </select>
      </label>
    </div>

    <p v-if="users.length === 0" class="panel-state">{{ trans("dashboard.users.empty") }}</p>
    <ul v-else class="person-list" role="list">
      <DashboardPersonCard v-for="user in pageUsers" :key="user.id" :user="user">
        <template v-if="user.role" #actions>
          <span class="role-badge">{{ trans(`dashboard.roles.${user.role}`) }}</span>
        </template>
      </DashboardPersonCard>
    </ul>

    <DashboardPaginationFooter :page="page" :total-pages="totalPages" @change="page = $event" />
  </section>
</template>

<style scoped>
.person-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.role-badge {
  padding: 0.35rem 0.9rem;
  border-radius: var(--radius-sm);
  background-color: var(--color-primary);
  color: var(--color-on-dark);
  font-size: clamp(0.78rem, 1.8vw, 0.88rem);
  font-weight: 500;
  white-space: nowrap;
}
</style>
