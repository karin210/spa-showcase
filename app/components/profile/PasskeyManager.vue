<script setup lang="ts">
import { ref } from "vue";
import { formatLongDate } from "~/utils/format";
import { addDays } from "~/utils/date";
import { mockId, simulateRequest } from "~/utils/mock";

interface PasskeySummary {
  id: string;
  name: string;
  createdAt: Date;
}

// Mock passkey list: add/remove only change local state.
const passkeys = ref<PasskeySummary[]>([
  { id: "pk-1", name: "iPhone de Valeria", createdAt: addDays(new Date(), -120) },
  { id: "pk-2", name: "Laptop del spa", createdAt: addDays(new Date(), -18) },
]);
const adding = ref(false);
const newName = ref("");
const busy = ref(false);

async function create(): Promise<void> {
  busy.value = true;
  await simulateRequest();
  passkeys.value = [
    ...passkeys.value,
    { id: mockId("pk"), name: newName.value.trim() || "Nueva llave de acceso", createdAt: new Date() },
  ];
  busy.value = false;
  adding.value = false;
  newName.value = "";
}

async function remove(id: string): Promise<void> {
  busy.value = true;
  await simulateRequest(400);
  passkeys.value = passkeys.value.filter((passkey) => passkey.id !== id);
  busy.value = false;
}
</script>

<template>
  <section class="profile-section passkeys" aria-labelledby="passkeys-heading">
    <h3 id="passkeys-heading" class="profile-section__heading">Tus llaves de acceso</h3>
    <p class="passkeys__note">Inicia sesión sin contraseña, con la huella, el rostro o el PIN de tus dispositivos.</p>

    <ul v-if="passkeys.length > 0" class="passkeys__list" role="list">
      <li v-for="passkey in passkeys" :key="passkey.id" class="passkey">
        <div class="passkey__info">
          <span class="passkey__name">{{ passkey.name }}</span>
          <time class="passkey__date" :datetime="passkey.createdAt.toISOString()">
            Añadida el {{ formatLongDate(passkey.createdAt) }}
          </time>
        </div>
        <button
          type="button"
          class="passkey__remove"
          :disabled="busy"
          :aria-label="`Eliminar la llave de acceso ${passkey.name}`"
          @click="remove(passkey.id)"
        >
          Eliminar
        </button>
      </li>
    </ul>
    <p v-else class="passkeys__note">Aún no tienes llaves de acceso.</p>

    <form v-if="adding" class="passkeys__form" @submit.prevent="create">
      <label class="modal-field">
        Nombre de la llave de acceso
        <input v-model="newName" class="modal-input" type="text" maxlength="60" placeholder="Ej. llave de mi iPhone" />
      </label>
      <div class="passkeys__form-actions">
        <SecondaryBtn type="submit" :disabled="busy">{{ busy ? "Creando…" : "Crear llave de acceso" }}</SecondaryBtn>
        <button type="button" class="modal-btn modal-btn-cancel" :disabled="busy" @click="adding = false">Cancelar</button>
      </div>
    </form>
    <SecondaryBtn v-else :disabled="busy" @click="adding = true">Añadir llave de acceso</SecondaryBtn>
  </section>
</template>

<style scoped>
.passkeys {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-sm);
}

.passkeys__note {
  margin: 0;
  font-size: clamp(0.85rem, 2vw, 0.95rem);
  color: var(--color-ink-muted);
}

.passkeys__list {
  align-self: stretch;
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.passkey {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.65rem 0.9rem;
  border-radius: var(--radius-sm);
  background-color: var(--color-background);
}

.passkey__info {
  display: flex;
  flex-direction: column;
}

.passkey__name {
  font-weight: 600;
  font-size: clamp(0.9rem, 2vw, 1rem);
}

.passkey__date {
  font-size: clamp(0.78rem, 1.8vw, 0.86rem);
  color: var(--color-ink-muted);
}

.passkey__remove {
  padding: 0.35em 0.9em;
  border: 1px solid var(--color-error);
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--color-error);
  font-size: clamp(0.82rem, 2vw, 0.9rem);
  font-weight: 600;
  cursor: pointer;
}

.passkey__remove:hover:not(:disabled) {
  background-color: var(--color-error);
  color: var(--color-on-dark);
}

.passkey__remove:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

.passkeys__form {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.passkeys__form-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
</style>
