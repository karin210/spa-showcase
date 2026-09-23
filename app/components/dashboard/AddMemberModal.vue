<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import type { UserRecord, UserRole } from "~/types/user";
import { useUsers } from "~/composables/useUsers";
import { simulateRequest } from "~/utils/mock";
import { initials } from "~/utils/format";

// Non-dismissible: granting panel access is a deliberate decision.
const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{ close: [] }>();

const { t: trans } = useI18n();
const { users, setRole } = useUsers();

const query = ref("");
const searched = ref(false);
const searching = ref(false);
const selected = ref<UserRecord | null>(null);
const role = ref<UserRole>("employee");
const saving = ref(false);
const addedName = ref<string | null>(null);

function reset(): void {
  query.value = "";
  searched.value = false;
  selected.value = null;
  role.value = "employee";
  addedName.value = null;
}

watch(() => props.open, (open) => open && reset());

function normalize(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

// Local, accent-insensitive search over non-staff accounts.
const results = computed<UserRecord[]>(() => {
  if (!searched.value) return [];
  const term = normalize(query.value.trim());
  return users.value.filter(
    (user) => !user.role && normalize(`${user.firstName} ${user.lastName}`).includes(term),
  );
});

async function search(): Promise<void> {
  if (!query.value.trim()) return;
  searching.value = true;
  await simulateRequest(400);
  searching.value = false;
  searched.value = true;
  selected.value = null;
}

async function confirm(): Promise<void> {
  if (!selected.value) return;
  saving.value = true;
  await simulateRequest();
  setRole(selected.value.id, role.value);
  addedName.value = selected.value.firstName;
  saving.value = false;
}
</script>

<template>
  <ModalDialog :open="open" labelledby="add-member-title" @close="emit('close')">
    <h2 id="add-member-title" class="modal-title">{{ trans("dashboard.addMember.title") }}</h2>

    <template v-if="addedName">
      <p class="add-member__success" role="status">{{ trans("dashboard.addMember.added", { name: addedName }) }}</p>
      <div class="modal-actions">
        <button type="button" class="modal-btn modal-btn-cancel" @click="emit('close')">
          {{ trans("dashboard.addMember.exit") }}
        </button>
        <button type="button" class="modal-btn modal-btn-primary" @click="reset">
          {{ trans("dashboard.addMember.addAnother") }}
        </button>
      </div>
    </template>

    <template v-else>
      <form class="add-member__search" role="search" @submit.prevent="search">
        <label class="modal-field add-member__query">
          {{ trans("dashboard.addMember.nameLabel") }}
          <input
            v-model="query"
            class="modal-input"
            type="search"
            :placeholder="trans('dashboard.addMember.namePlaceholder')"
            autocomplete="off"
          />
        </label>
        <SecondaryBtn type="submit" :disabled="searching || !query.trim()">
          {{ searching ? trans("dashboard.addMember.searching") : trans("dashboard.addMember.search") }}
        </SecondaryBtn>
      </form>

      <p v-if="searched && results.length === 0" class="modal-error" role="status">
        {{ trans("dashboard.addMember.noResults") }}
      </p>

      <fieldset v-if="results.length > 0" class="add-member__results">
        <legend class="add-member__legend">{{ trans("dashboard.addMember.pick") }}</legend>
        <label v-for="user in results" :key="user.id" class="add-member__result">
          <input v-model="selected" type="radio" name="member-candidate" :value="user" class="visually-hidden" />
          <img v-if="user.photoURL" :src="user.photoURL" alt="" class="add-member__avatar" />
          <span v-else class="add-member__avatar add-member__avatar--initials" aria-hidden="true">
            {{ initials(user.firstName, user.lastName) }}
          </span>
          <span class="add-member__name">{{ user.firstName }} {{ user.lastName }}</span>
        </label>
      </fieldset>

      <template v-if="selected">
        <i18n-t keypath="dashboard.addMember.confirm" tag="p" class="modal-text" scope="global">
          <template #name>
            <strong>{{ selected.firstName }} {{ selected.lastName }}</strong>
          </template>
        </i18n-t>
        <label class="modal-field">
          {{ trans("dashboard.addMember.role") }}
          <select v-model="role" class="modal-input">
            <option value="employee">{{ trans("dashboard.roles.employee") }}</option>
            <option value="admin">{{ trans("dashboard.roles.admin") }}</option>
          </select>
        </label>
      </template>

      <div class="modal-actions">
        <button type="button" class="modal-btn modal-btn-cancel" :disabled="saving" @click="emit('close')">
          {{ trans("actions.cancel") }}
        </button>
        <button type="button" class="modal-btn modal-btn-primary" :disabled="saving || !selected" @click="confirm">
          {{ saving ? trans("dashboard.addMember.adding") : trans("actions.accept") }}
        </button>
      </div>
    </template>
  </ModalDialog>
</template>

<style scoped>
.add-member__search {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: var(--space-sm);
}

.add-member__query {
  flex: 1 1 12rem;
}

.add-member__results {
  margin: 0;
  padding: 0;
  border: none;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.add-member__legend {
  padding: 0;
  margin-bottom: 0.4rem;
  font-size: clamp(0.85rem, 2vw, 0.95rem);
  font-weight: 500;
}

.add-member__result {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.add-member__result:hover {
  background-color: var(--color-background);
}

.add-member__result:has(input:checked) {
  border-color: var(--color-primary);
  background-color: var(--color-primary-soft);
}

.add-member__result:has(input:focus-visible) {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

.add-member__avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  object-fit: cover;
  filter: saturate(0.92) contrast(1.03);
}

.add-member__avatar--initials {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-primary);
  color: var(--color-on-dark);
  font-size: clamp(0.85rem, 2vw, 0.95rem);
  font-weight: 600;
}

.add-member__name {
  font-weight: 500;
}

.add-member__success {
  margin: 0;
  padding: 0.9rem 1rem;
  border-left: 4px solid var(--color-success);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  background-color: var(--color-primary-soft);
  font-weight: 500;
}
</style>
