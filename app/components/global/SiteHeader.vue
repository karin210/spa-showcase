<script setup lang="ts">
import { nextTick, ref } from "vue";
import { useRoute } from "vue-router";
import { useSession } from "~/composables/useSession";
import { useToast } from "~/composables/useToast";
import { simulateRequest } from "~/utils/mock";

interface SectionLink {
  label: string;
  target: string;
}

const sectionLinks: SectionLink[] = [
  { label: "Servicios", target: "#services" },
  { label: "Contacto", target: "#contact" },
];

const route = useRoute();
const { user, isStaff } = useSession();
const toast = useToast();

const mobileMenuOpen = ref(false);
const demoBannerVisible = useState<boolean>("demo-banner-visible", () => true);

const signOutOpen = ref(false);
const isSigningOut = ref(false);

function closeMenu(): void {
  mobileMenuOpen.value = false;
}

function scrollToSection(selector: string): void {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelector(selector)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
}

async function onSectionClick(link: SectionLink): Promise<void> {
  closeMenu();
  if (route.path !== "/") {
    await navigateTo("/");
    await nextTick();
  }
  scrollToSection(link.target);
}

async function confirmSignOut(): Promise<void> {
  isSigningOut.value = true;
  await simulateRequest();
  isSigningOut.value = false;
  signOutOpen.value = false;
  closeMenu();
  toast.show("Modo demostración: la sesión permanece activa.");
}
</script>

<template>
  <header class="site-header">
    <div class="site-header__inner">
      <NuxtLink to="/" class="site-header__logo" aria-label="Alma Serena — página de inicio">
        <BrandMark />
      </NuxtLink>

      <nav class="site-header__nav" aria-label="Navegación principal">
        <ul class="site-header__nav-list" role="list">
          <li v-for="link in sectionLinks" :key="link.target">
            <button type="button" class="site-header__nav-link" @click="onSectionClick(link)">
              {{ link.label }}
            </button>
          </li>
          <li v-if="isStaff">
            <NuxtLink to="/panel-administrativo" class="site-header__nav-link">Panel administrativo</NuxtLink>
          </li>
        </ul>
      </nav>

      <div class="site-header__actions">
        <NuxtLink to="/agendar" class="site-header__icon-btn" aria-label="Agendar cita">
          <AppIcon name="calendar" />
        </NuxtLink>

        <NuxtLink to="/perfil" class="site-header__icon-btn site-header__profile" aria-label="Ver perfil de usuario">
          <img v-if="user.photoURL" :src="user.photoURL" alt="" class="site-header__profile-photo" />
          <AppIcon v-else name="user" />
        </NuxtLink>

        <button
          type="button"
          class="site-header__hamburger"
          :aria-expanded="mobileMenuOpen"
          aria-controls="mobile-nav"
          :aria-label="mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <span class="site-header__hamburger-bar" />
          <span class="site-header__hamburger-bar" />
          <span class="site-header__hamburger-bar" />
        </button>
      </div>
    </div>
  </header>

  <Transition name="demo-banner-slide">
    <aside v-if="demoBannerVisible" class="demo-banner" aria-label="Aviso de demostración">
      <p class="demo-banner__text">
        Sitio de demostración para spas. Todos los datos, nombres y citas son ficticios.
      </p>
      <button type="button" class="demo-banner__close" aria-label="Cerrar aviso de demostración" @click="demoBannerVisible = false">
        <AppIcon name="close" />
      </button>
    </aside>
  </Transition>

  <div
    class="mobile-nav-backdrop"
    :class="{ 'mobile-nav-backdrop--visible': mobileMenuOpen }"
    aria-hidden="true"
    @click="closeMenu"
  />

  <nav
    id="mobile-nav"
    class="mobile-nav"
    :class="{ 'mobile-nav--open': mobileMenuOpen }"
    :inert="!mobileMenuOpen"
    aria-label="Menú móvil"
  >
    <button type="button" class="mobile-nav__close" aria-label="Cerrar menú" @click="closeMenu">
      <AppIcon name="close" />
    </button>

    <ul class="mobile-nav__list" role="list">
      <li><NuxtLink to="/" class="mobile-nav__link" @click="closeMenu">Inicio</NuxtLink></li>
      <li><NuxtLink to="/perfil" class="mobile-nav__link" @click="closeMenu">Mi perfil</NuxtLink></li>
      <li><NuxtLink to="/agendar" class="mobile-nav__link" @click="closeMenu">Agendar</NuxtLink></li>
      <li v-for="link in sectionLinks" :key="link.target">
        <button type="button" class="mobile-nav__link" @click="onSectionClick(link)">{{ link.label }}</button>
      </li>
      <li v-if="isStaff">
        <NuxtLink to="/panel-administrativo" class="mobile-nav__link" @click="closeMenu">Panel administrativo</NuxtLink>
      </li>
    </ul>

    <button type="button" class="mobile-nav__link mobile-nav__link--signout" @click="signOutOpen = true">
      Cerrar sesión
    </button>
  </nav>

  <ConfirmModal
    :open="signOutOpen"
    title="Cerrar sesión"
    confirm-label="Cerrar sesión"
    busy-label="Cerrando sesión…"
    :busy="isSigningOut"
    @close="signOutOpen = false"
    @confirm="confirmSignOut"
  >
    ¿Seguro que quieres cerrar sesión?
  </ConfirmModal>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: var(--color-surface);
  box-shadow: 0 1px 10px var(--color-shadow);
}

.site-header__inner {
  height: var(--header-height);
  padding: 0 var(--space-md);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
}

.site-header__logo {
  display: flex;
  text-decoration: none;
  border-radius: var(--radius-sm);
}

.site-header__logo:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 4px;
}

/* ── Desktop nav ── */
.site-header__nav {
  display: none;
}

.site-header__nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  gap: clamp(0.75rem, 2.5vw, 1.75rem);
}

.site-header__nav-link {
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  padding: 0 0 2px;
  cursor: pointer;
  font-size: clamp(0.88rem, 1.2vw, 1rem);
  font-weight: 500;
  letter-spacing: 0.03em;
  color: var(--color-ink);
  text-decoration: none;
  white-space: nowrap;
  transition:
    color 0.2s ease,
    border-color 0.2s ease;
}

.site-header__nav-link:hover,
.site-header__nav-link.router-link-active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.site-header__nav-link:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 3px;
}

/* ── Actions ── */
.site-header__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.site-header__icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: clamp(2.25rem, 5vw, 2.6rem);
  height: clamp(2.25rem, 5vw, 2.6rem);
  padding: 0;
  border: none;
  border-radius: 50%;
  background-color: transparent;
  color: var(--color-primary);
  cursor: pointer;
  overflow: hidden;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.site-header__icon-btn:hover {
  background-color: var(--color-primary);
  color: var(--color-on-dark);
}

.site-header__icon-btn:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 3px;
}

.site-header__profile {
  box-shadow: 0 0 0 2px var(--color-primary-soft);
}

.site-header__profile-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.95) contrast(1.03);
}

.site-header__hamburger {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: clamp(2.25rem, 5vw, 2.6rem);
  height: clamp(2.25rem, 5vw, 2.6rem);
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  cursor: pointer;
  color: var(--color-ink);
}

.site-header__hamburger:hover {
  background-color: var(--color-hover);
}

.site-header__hamburger:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

.site-header__hamburger-bar {
  display: block;
  width: 1.25rem;
  height: 2px;
  background-color: currentColor;
  border-radius: 2px;
}

/* ── Demo banner ── */
.demo-banner {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 0.4rem var(--space-md);
  background-color: var(--color-secondary);
  border-bottom: 1px solid var(--color-border);
}

.demo-banner__text {
  flex: 1;
  margin: 0;
  font-size: clamp(0.8rem, 1.8vw, 0.92rem);
  line-height: 1.35;
  color: var(--color-ink);
}

.demo-banner__close {
  display: inline-flex;
  padding: 0.3rem;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--color-ink);
  cursor: pointer;
}

.demo-banner__close:hover {
  background-color: var(--color-hover);
}

.demo-banner__close:focus-visible {
  outline: 2px solid var(--color-focus);
}

.demo-banner-slide-enter-active,
.demo-banner-slide-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.demo-banner-slide-enter-from,
.demo-banner-slide-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}

/* ── Mobile drawer ── */
.mobile-nav-backdrop {
  position: fixed;
  inset: 0;
  z-index: 98;
  background-color: var(--color-overlay);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.mobile-nav-backdrop--visible {
  opacity: 1;
  pointer-events: auto;
}

.mobile-nav {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 101;
  height: 100dvh;
  width: clamp(16rem, 78vw, 22rem);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background-color: var(--color-surface);
  box-shadow: -4px 0 24px var(--color-shadow-strong);
  transform: translateX(100%);
  visibility: hidden;
  transition:
    transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    visibility 0.35s;
}

.mobile-nav--open {
  transform: translateX(0);
  visibility: visible;
}

.mobile-nav__close {
  align-self: flex-end;
  display: flex;
  padding: 0.5rem;
  margin: var(--space-sm);
  border: none;
  border-radius: 50%;
  background: none;
  color: var(--color-ink);
  font-size: clamp(1.2rem, 3vw, 1.4rem);
  cursor: pointer;
}

.mobile-nav__close:focus-visible {
  outline: 2px solid var(--color-focus);
}

.mobile-nav__list {
  flex: 1 0 auto;
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.mobile-nav__link {
  display: flex;
  width: 100%;
  padding: 0.8rem var(--space-md);
  border: none;
  border-bottom: 1px solid var(--color-border);
  background: none;
  text-align: left;
  font-size: clamp(1rem, 3vw, 1.1rem);
  font-weight: 500;
  color: var(--color-ink);
  text-decoration: none;
  cursor: pointer;
}

.mobile-nav__link:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: -2px;
}

.mobile-nav__link--signout {
  justify-content: center;
  border-bottom: none;
  color: var(--color-error);
  font-weight: 600;
  margin-bottom: env(safe-area-inset-bottom);
}

@media (min-width: 48em) {
  .site-header__logo {
    margin-right: auto;
  }

  .site-header__nav {
    display: block;
  }

  .site-header__hamburger,
  .mobile-nav,
  .mobile-nav-backdrop {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mobile-nav,
  .mobile-nav-backdrop,
  .demo-banner-slide-enter-active,
  .demo-banner-slide-leave-active {
    transition: none;
  }
}
</style>
