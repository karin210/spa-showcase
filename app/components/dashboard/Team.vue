<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import type { UserRecord, UserRole } from "~/types/user";
import { useUsers } from "~/composables/useUsers";
import { useSession } from "~/composables/useSession";
import { useToast } from "~/composables/useToast";
import { simulateRequest } from "~/utils/mock";

// Each role is also its i18n key (dashboard.roles.<role>).
const ROLES: UserRole[] = ["admin", "employee"];

const { t: trans } = useI18n();
const { users, setRole } = useUsers();
const { user: sessionUser } = useSession();
const toast = useToast();

const members = computed<UserRecord[]>(() =>
  users.value.filter((user) => user.role).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()),
);

function roleLabel(role: UserRole | undefined): string {
  return role ? trans(`dashboard.roles.${role}`) : "";
}

function changeRole(member: UserRecord, event: Event): void {
  const select = event.target as HTMLSelectElement;
  const role = select.value as UserRole;
  setRole(member.id, role);
  toast.show(trans("dashboard.team.roleChanged", { name: member.firstName, role: roleLabel(role).toLowerCase() }));
  select.value = "";
}

const addOpen = ref(false);

// ── Remove ──
const memberToRemove = ref<UserRecord | null>(null);
const removing = ref(false);

async function confirmRemove(): Promise<void> {
  const member = memberToRemove.value;
  if (!member) return;
  removing.value = true;
  await simulateRequest();
  setRole(member.id, undefined);
  removing.value = false;
  memberToRemove.value = null;
  toast.show(trans("dashboard.team.removed", { name: member.firstName }));
}
</script>

<template>
  <section class="panel" aria-labelledby="team-heading">
    <header class="panel-header">
      <h2 id="team-heading" class="panel-heading">{{ trans("dashboard.tabs.team") }}</h2>
      <p class="panel-count">{{ trans("dashboard.team.total", { count: members.length }) }}</p>
    </header>

    <div class="panel-toolbar">
      <SecondaryBtn @click="addOpen = true">
        <template #icon><AppIcon name="team" /></template>
        {{ trans("dashboard.team.add") }}
      </SecondaryBtn>
    </div>

    <p v-if="members.length === 0" class="panel-state">{{ trans("dashboard.team.empty") }}</p>
    <ul v-else class="person-list" role="list">
      <DashboardPersonCard v-for="member in members" :key="member.id" :user="member">
        <template #actions>
          <span class="role-badge">{{ roleLabel(member.role) }}</span>
          <select
            class="panel-select"
            :disabled="member.id === sessionUser.id"
            :title="member.id === sessionUser.id ? trans('dashboard.team.ownRole') : undefined"
            :aria-label="trans('dashboard.team.changeRoleOf', { name: member.firstName })"
            @change="changeRole(member, $event)"
          >
            <option value="" disabled selected hidden>{{ trans("dashboard.team.changeRole") }}</option>
            <option v-for="role in ROLES" :key="role" :value="role">{{ roleLabel(role) }}</option>
          </select>
          <button
            type="button"
            class="remove-btn"
            :disabled="member.id === sessionUser.id"
            :title="member.id === sessionUser.id ? trans('dashboard.team.ownAccount') : undefined"
            @click="memberToRemove = member"
          >
            {{ trans("dashboard.team.remove") }}
          </button>
        </template>
      </DashboardPersonCard>
    </ul>

    <DashboardAddMemberModal :open="addOpen" @close="addOpen = false" />

    <ConfirmModal
      :open="!!memberToRemove"
      :title="trans('dashboard.team.removeModal.title')"
      :confirm-label="trans('dashboard.team.removeModal.title')"
      :busy-label="trans('dashboard.team.removeModal.removing')"
      :busy="removing"
      @close="memberToRemove = null"
      @confirm="confirmRemove"
    >
      <i18n-t v-if="memberToRemove" keypath="dashboard.team.removeModal.confirm" tag="span" scope="global">
        <template #name>
          <strong>{{ memberToRemove.firstName }} {{ memberToRemove.lastName }}</strong>
        </template>
      </i18n-t>
    </ConfirmModal>
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
}

.panel-select:disabled,
.remove-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.remove-btn {
  padding: 0.45rem 0.9rem;
  border: 1px solid var(--color-error);
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--color-error);
  font-size: clamp(0.8rem, 1.8vw, 0.9rem);
  font-weight: 600;
  cursor: pointer;
}

.remove-btn:hover:not(:disabled) {
  background-color: var(--color-error);
  color: var(--color-on-dark);
}

.remove-btn:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}
</style>
