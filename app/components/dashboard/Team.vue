<script setup lang="ts">
import { computed, ref } from "vue";
import type { UserRecord, UserRole } from "~/types/user";
import { useUsers } from "~/composables/useUsers";
import { useSession } from "~/composables/useSession";
import { useToast } from "~/composables/useToast";
import { simulateRequest } from "~/utils/mock";

const ROLES: { value: UserRole; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "employee", label: "Empleado" },
];

const { users, setRole } = useUsers();
const { user: sessionUser } = useSession();
const toast = useToast();

const members = computed<UserRecord[]>(() =>
  users.value.filter((user) => user.role).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()),
);

function roleLabel(role: UserRole | undefined): string {
  return ROLES.find((entry) => entry.value === role)?.label ?? "";
}

function changeRole(member: UserRecord, event: Event): void {
  const select = event.target as HTMLSelectElement;
  setRole(member.id, select.value as UserRole);
  toast.show(`${member.firstName} ahora es ${roleLabel(select.value as UserRole).toLowerCase()}.`);
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
  toast.show(`${member.firstName} ya no forma parte del equipo.`);
}
</script>

<template>
  <section class="panel" aria-labelledby="team-heading">
    <header class="panel-header">
      <h2 id="team-heading" class="panel-heading">Equipo</h2>
      <p class="panel-count">Total de miembros: {{ members.length }}</p>
    </header>

    <div class="panel-toolbar">
      <SecondaryBtn @click="addOpen = true">
        <template #icon><AppIcon name="team" /></template>
        Añadir miembro
      </SecondaryBtn>
    </div>

    <p v-if="members.length === 0" class="panel-state">No hay miembros del equipo</p>
    <ul v-else class="person-list" role="list">
      <DashboardPersonCard v-for="member in members" :key="member.id" :user="member">
        <template #actions>
          <span class="role-badge">{{ roleLabel(member.role) }}</span>
          <select
            class="panel-select"
            :disabled="member.id === sessionUser.id"
            :title="member.id === sessionUser.id ? 'No puedes cambiar tu propio rol' : undefined"
            :aria-label="`Cambiar rol de ${member.firstName}`"
            @change="changeRole(member, $event)"
          >
            <option value="" disabled selected hidden>Cambiar rol</option>
            <option v-for="role in ROLES" :key="role.value" :value="role.value">{{ role.label }}</option>
          </select>
          <button
            type="button"
            class="remove-btn"
            :disabled="member.id === sessionUser.id"
            :title="member.id === sessionUser.id ? 'No puedes quitar tu propia cuenta del equipo' : undefined"
            @click="memberToRemove = member"
          >
            Remover
          </button>
        </template>
      </DashboardPersonCard>
    </ul>

    <DashboardAddMemberModal :open="addOpen" @close="addOpen = false" />

    <ConfirmModal
      :open="!!memberToRemove"
      title="Quitar del equipo"
      confirm-label="Quitar del equipo"
      busy-label="Quitando…"
      :busy="removing"
      @close="memberToRemove = null"
      @confirm="confirmRemove"
    >
      ¿Seguro que quieres remover a
      <strong>{{ memberToRemove?.firstName }} {{ memberToRemove?.lastName }}</strong>
      del equipo? Perderá acceso al panel y volverá a ser una cuenta de cliente.
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
