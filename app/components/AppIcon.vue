<script setup lang="ts">
// Decorative line icons (24×24, stroke = currentColor). Always aria-hidden: the
// control that hosts an icon carries the accessible name.
import type { IconName } from "~/types/icon";

defineProps<{ name: IconName }>();

const PATHS: Record<IconName, string[]> = {
  calendar: ["M8 2v4", "M16 2v4", "M3 10h18", "M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"],
  user: ["M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z", "M4 20c0-4 3.6-7 8-7s8 3 8 7"],
  phone: [
    "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z",
  ],
  whatsapp: [
    "M3 21l1.65-4.6A8.5 8.5 0 1 1 7.6 19.4L3 21Z",
    "M9 10c0 3 2 5 5 5l1.2-1.2-1.8-.9-.8.8c-1-.4-1.9-1.3-2.3-2.3l.8-.8-.9-1.8L9 10Z",
  ],
  instagram: [
    "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Z",
    "M16 11.4A4 4 0 1 1 12.6 8a4 4 0 0 1 3.4 3.4Z",
    "M17.5 6.5h.01",
  ],
  close: ["M18 6 6 18", "M6 6l12 12"],
  users: ["M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z", "M22 21v-2a4 4 0 0 0-3-3.9", "M16 3.1a4 4 0 0 1 0 7.8"],
  team: ["M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z", "M6 21v-1a6 6 0 0 1 12 0v1", "M5 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z", "M19 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z", "M2 18v-.5A3.5 3.5 0 0 1 5 14", "M22 18v-.5a3.5 3.5 0 0 0-3-3.5"],
  controls: ["M4 21v-7", "M4 10V3", "M12 21v-9", "M12 8V3", "M20 21v-5", "M20 12V3", "M1 14h6", "M9 8h6", "M17 16h6"],
  metrics: ["M3 3v18h18", "M7 16v-4", "M12 16V8", "M17 16v-7"],
  bookings: ["M9 2h6a1 1 0 0 1 1 1v2H8V3a1 1 0 0 1 1-1Z", "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2", "m9 14 2 2 4-4"],
  collapse: ["M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z", "M9 3v18", "m16 15-3-3 3-3"],
  edit: ["M12 20h9", "M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"],
  "map-pin": ["M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z", "M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"],
  clock: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z", "M12 6v6l4 2"],
  leaf: ["M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z", "M2 21c0-3 1.9-5.4 5.1-6C9.5 14.5 12 13 13 12"],
  info: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z", "M12 16v-4", "M12 8h.01"],
  "arrow-up": ["m18 15-6-6-6 6"],
};
</script>

<template>
  <svg
    class="app-icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.75"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path v-for="(path, index) in PATHS[name]" :key="index" :d="path" />
  </svg>
</template>

<style scoped>
.app-icon {
  width: 1.25em;
  height: 1.25em;
  flex-shrink: 0;
}
</style>
