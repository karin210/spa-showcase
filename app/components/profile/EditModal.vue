<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import type { ProfileUpdateInput } from "~/types/user";
import { simulateRequest } from "~/utils/mock";

// Non-dismissible: editing personal data is a deliberate decision, so it closes only
// through Cancelar / Guardar.
const props = defineProps<{
  open: boolean;
  initial: ProfileUpdateInput;
  photoUrl: string | null;
}>();

const emit = defineEmits<{
  close: [];
  save: [input: ProfileUpdateInput & { photoURL: string | null }];
}>();

const { t: trans } = useI18n();

type Field = keyof ProfileUpdateInput;

const form = reactive<ProfileUpdateInput>({ firstName: "", lastName: "", phone: "" });
const edited = reactive<Record<Field, boolean>>({ firstName: false, lastName: false, phone: false });
const touched = reactive<Record<Field, boolean>>({ firstName: false, lastName: false, phone: false });
const photoPreview = ref<string | null>(null);
// i18n key of the photo error, if any.
const photoError = ref<string | null>(null);
const saving = ref(false);

watch(
  () => props.open,
  (open) => {
    if (!open) return;
    Object.assign(form, props.initial);
    (Object.keys(edited) as Field[]).forEach((field) => {
      edited[field] = false;
      touched[field] = false;
    });
    photoPreview.value = props.photoUrl;
    photoError.value = null;
  },
);

// Each field is also its i18n key (profile.edit.fields.<field>.label / .helper).
interface FieldConfig {
  field: Field;
  type: "text" | "tel";
  autocomplete: string;
}

const FIELDS: FieldConfig[] = [
  { field: "firstName", type: "text", autocomplete: "given-name" },
  { field: "lastName", type: "text", autocomplete: "family-name" },
  { field: "phone", type: "tel", autocomplete: "tel" },
];

function isValid(field: Field): boolean {
  const value = form[field].trim();
  if (field === "phone") return /^\+?\d[\d\s]{9,15}$/.test(value);
  return value.length >= 2;
}

// Errors appear only for fields the user has typed into and then left.
function errorFor(config: FieldConfig): string | null {
  const { field } = config;
  return edited[field] && touched[field] && !isValid(field) ? trans(`profile.edit.fields.${field}.helper`) : null;
}

const formValid = computed<boolean>(() => FIELDS.every((config) => isValid(config.field)));

function onPhotoChange(event: Event): void {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    photoError.value = "profile.edit.photoError";
    return;
  }
  photoError.value = null;
  photoPreview.value = URL.createObjectURL(file);
}

async function submit(): Promise<void> {
  if (!formValid.value) return;
  saving.value = true;
  await simulateRequest();
  saving.value = false;
  emit("save", {
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    phone: form.phone.replace(/\s/g, ""),
    photoURL: photoPreview.value,
  });
}
</script>

<template>
  <ModalDialog :open="open" labelledby="edit-profile-title" @close="emit('close')">
    <form class="edit-form" novalidate @submit.prevent="submit">
      <h2 id="edit-profile-title" class="modal-title">{{ trans("profile.edit.title") }}</h2>

      <div class="edit-form__photo">
        <img v-if="photoPreview" :src="photoPreview" :alt="trans('profile.edit.photoPreview')" class="edit-form__avatar" />
        <span v-else class="edit-form__avatar edit-form__avatar--empty"><AppIcon name="user" /></span>
        <label class="edit-form__photo-btn">
          {{ trans("profile.edit.changePhoto") }}
          <input type="file" accept="image/*" class="visually-hidden" @change="onPhotoChange" />
        </label>
      </div>
      <p v-if="photoError" class="modal-error" role="alert">{{ trans(photoError) }}</p>

      <label v-for="config in FIELDS" :key="config.field" class="modal-field">
        {{ trans(`profile.edit.fields.${config.field}.label`) }}
        <input
          v-model="form[config.field]"
          class="modal-input"
          :type="config.type"
          :autocomplete="config.autocomplete"
          :aria-invalid="!!errorFor(config)"
          :aria-describedby="errorFor(config) ? `${config.field}-error` : undefined"
          required
          @input="edited[config.field] = true"
          @blur="touched[config.field] = true"
        />
        <span v-if="errorFor(config)" :id="`${config.field}-error`" class="edit-form__bubble" role="alert">
          {{ errorFor(config) }}
        </span>
      </label>

      <div class="modal-actions">
        <button type="button" class="modal-btn modal-btn-cancel" :disabled="saving" @click="emit('close')">
          {{ trans("actions.cancel") }}
        </button>
        <button type="submit" class="modal-btn modal-btn-primary" :disabled="saving || !formValid">
          {{ saving ? trans("states.saving") : trans("profile.edit.save") }}
        </button>
      </div>
    </form>
  </ModalDialog>
</template>

<style scoped>
.edit-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.edit-form__photo {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.edit-form__avatar {
  width: clamp(4rem, 12vw, 5rem);
  height: clamp(4rem, 12vw, 5rem);
  border-radius: 50%;
  object-fit: cover;
  filter: saturate(0.95) contrast(1.03);
}

.edit-form__avatar--empty {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-primary);
  color: var(--color-on-dark);
  font-size: clamp(1.5rem, 4vw, 2rem);
}

.edit-form__photo-btn {
  padding: 0.45rem 1rem;
  border: 1px solid var(--color-primary);
  border-radius: 999px;
  color: var(--color-primary);
  font-size: clamp(0.85rem, 2vw, 0.95rem);
  font-weight: 500;
  cursor: pointer;
}

.edit-form__photo-btn:hover {
  background-color: var(--color-primary-soft);
}

.edit-form__photo-btn:focus-within {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

/* Branded stand-in for the native validation bubble, anchored under its field. */
.edit-form__bubble {
  align-self: flex-start;
  position: relative;
  margin-top: 0.35rem;
  padding: 0.35rem 0.7rem;
  border-radius: var(--radius-sm);
  background-color: var(--color-tertiary);
  color: var(--color-on-dark);
  font-size: clamp(0.78rem, 1.8vw, 0.85rem);
  font-weight: 500;
  box-shadow: 0 4px 12px var(--color-shadow-strong);
}

.edit-form__bubble::before {
  content: "";
  position: absolute;
  top: -0.35rem;
  left: 1rem;
  border: 0.35rem solid transparent;
  border-top: 0;
  border-bottom-color: var(--color-tertiary);
}
</style>
