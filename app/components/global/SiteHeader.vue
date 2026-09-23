<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useSession } from "~/composables/useSession";

interface SectionLink {
  // i18n key for the link text.
  labelKey: string;
  target: string;
}

const sectionLinks: SectionLink[] = [{ labelKey: "nav.contact", target: "#contact" }];

const route = useRoute();
const { t: trans, locale } = useI18n();
const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();
const { user, isStaff } = useSession();

const mobileMenuOpen = ref(false);

// Offers both languages up front, below the header. It is server-rendered, so it is
// in place from the first paint instead of popping in after hydration and pushing the
// page down; only dismissing it animates. Dismissing it (or picking a language) is
// kept in shared state so it stays hidden on the other routes' headers too. Not
// persisted: a full page load shows it again.
const languageBannerDismissed = useState<boolean>("language-banner-dismissed", () => false);

function dismissLanguageBanner(): void {
  languageBannerDismissed.value = true;
}

// switchLocalePath returns "" for a route with no counterpart in that locale; fall
// back to that locale's home page (see LanguageToggle.vue for the same fallback).
const esPath = computed<string>(() => switchLocalePath("es") || localePath("index", "es"));
const enPath = computed<string>(() => switchLocalePath("en") || localePath("index", "en"));

function closeMenu(): void {
  mobileMenuOpen.value = false;
}

function scrollToSection(selector: string): void {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelector(selector)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
}

async function onSectionClick(link: SectionLink): Promise<void> {
  closeMenu();
  const home = localePath("index");
  if (route.path !== home) {
    await navigateTo(home);
    await nextTick();
  }
  scrollToSection(link.target);
}
</script>

<template>
  <header class="site-header">
    <div class="site-header__inner">
      <NuxtLink :to="localePath('index')" class="site-header__logo" :aria-label="trans('nav.homeLink')">
        <BrandMark />
      </NuxtLink>

      <nav class="site-header__nav" :aria-label="trans('nav.primary')">
        <ul class="site-header__nav-list" role="list">
          <li>
            <NuxtLink :to="localePath('services')" class="site-header__nav-link">{{ trans("nav.services") }}</NuxtLink>
          </li>
          <li v-for="link in sectionLinks" :key="link.target">
            <button type="button" class="site-header__nav-link" @click="onSectionClick(link)">
              {{ trans(link.labelKey) }}
            </button>
          </li>
          <li>
            <NuxtLink :to="localePath('about-us')" class="site-header__nav-link">{{ trans("nav.about") }}</NuxtLink>
          </li>
          <li>
            <NuxtLink :to="localePath('work-with-us')" class="site-header__nav-link">{{ trans("nav.careers") }}</NuxtLink>
          </li>
          <li v-if="isStaff">
            <NuxtLink :to="localePath('dashboard')" class="site-header__nav-link">{{ trans("nav.dashboard") }}</NuxtLink>
          </li>
        </ul>
      </nav>

      <div class="site-header__actions">
        <!-- Desktop only: below 48em the same toggle lives in the mobile drawer. -->
        <LanguageToggle class="site-header__language" />

        <NuxtLink :to="localePath('booking')" class="site-header__icon-btn" :aria-label="trans('actions.book')">
          <AppIcon name="calendar" />
        </NuxtLink>

        <NuxtLink
          :to="localePath('profile')"
          class="site-header__icon-btn site-header__profile"
          :aria-label="trans('actions.viewProfile')"
        >
          <img v-if="user.photoURL" :src="user.photoURL" alt="" class="site-header__profile-photo" />
          <AppIcon v-else name="user" />
        </NuxtLink>

        <button
          type="button"
          class="site-header__hamburger"
          :aria-expanded="mobileMenuOpen"
          aria-controls="mobile-nav"
          :aria-label="mobileMenuOpen ? trans('nav.closeMenu') : trans('nav.openMenu')"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <span class="site-header__hamburger-bar" />
          <span class="site-header__hamburger-bar" />
          <span class="site-header__hamburger-bar" />
        </button>
      </div>
    </div>
  </header>

  <Transition name="language-banner-slide">
    <section v-if="!languageBannerDismissed" class="language-banner" :aria-label="trans('languageBanner.prompt')">
      <div></div>
      <p class="language-banner__text">{{ trans("languageBanner.prompt") }}</p>

      <div class="language-banner__options">
        <NuxtLink
          :to="esPath"
          lang="es"
          hreflang="es"
          class="language-banner__option"
          :aria-current="locale === 'es' ? 'true' : undefined"
          @click="dismissLanguageBanner"
        >
          {{ trans("language.es.name") }}
        </NuxtLink>
        <NuxtLink
          :to="enPath"
          lang="en"
          hreflang="en"
          class="language-banner__option"
          :aria-current="locale === 'en' ? 'true' : undefined"
          @click="dismissLanguageBanner"
        >
          {{ trans("language.en.name") }}
        </NuxtLink>
      </div>

      <button
        type="button"
        class="language-banner__close"
        :aria-label="trans('languageBanner.close')"
        @click="dismissLanguageBanner"
      >
        <AppIcon name="close" />
      </button>
    </section>
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
    :aria-label="trans('nav.mobile')"
  >
    <button type="button" class="mobile-nav__close" :aria-label="trans('nav.closeMenu')" @click="closeMenu">
      <AppIcon name="close" />
    </button>

    <ul class="mobile-nav__list" role="list">
      <li>
        <NuxtLink :to="localePath('index')" class="mobile-nav__link" @click="closeMenu">{{ trans("nav.home") }}</NuxtLink>
      </li>
      <li>
        <NuxtLink :to="localePath('profile')" class="mobile-nav__link" @click="closeMenu">
          {{ trans("nav.profile") }}
        </NuxtLink>
      </li>
      <li>
        <NuxtLink :to="localePath('booking')" class="mobile-nav__link" @click="closeMenu">{{ trans("nav.book") }}</NuxtLink>
      </li>
      <li>
        <NuxtLink :to="localePath('about-us')" class="mobile-nav__link" @click="closeMenu">
          {{ trans("nav.about") }}
        </NuxtLink>
      </li>
      <li>
        <NuxtLink :to="localePath('services')" class="mobile-nav__link" @click="closeMenu">
          {{ trans("nav.services") }}
        </NuxtLink>
      </li>
      <li>
        <NuxtLink :to="localePath('work-with-us')" class="mobile-nav__link" @click="closeMenu">
          {{ trans("nav.careers") }}
        </NuxtLink>
      </li>
      <li v-for="link in sectionLinks" :key="link.target">
        <button type="button" class="mobile-nav__link" @click="onSectionClick(link)">{{ trans(link.labelKey) }}</button>
      </li>
      <li v-if="isStaff">
        <NuxtLink :to="localePath('dashboard')" class="mobile-nav__link" @click="closeMenu">
          {{ trans("nav.dashboard") }}
        </NuxtLink>
      </li>
      <li class="mobile-nav__language">
        <span id="mobile-language-label" class="mobile-nav__language-label">{{ trans("language.label") }}</span>
        <LanguageToggle aria-describedby="mobile-language-label" @navigate="closeMenu" />
      </li>
    </ul>
  </nav>
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

/* Scoped under the actions row to outrank LanguageToggle's own equal-specificity
   display rule. Shown from 48em up, alongside the desktop nav. */
.site-header__actions .site-header__language {
  display: none;
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

/* ── Language banner ──
   Sits right below the header in normal flow (not fixed/absolute) so it pushes page
   content down rather than overlaying it. */
.language-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.4rem var(--space-sm);
  padding: clamp(0.25rem, 0.8vw, 0.4rem) var(--space-md);
  background-color: var(--color-primary-soft);
  border-bottom: 1px solid var(--color-border);
}

.language-banner__text {
  flex: 1 1 auto;
  margin: 0;
  font-size: clamp(0.85rem, 2vw, 0.98rem);
  font-weight: 500;
  line-height: 1.3;
  color: var(--color-ink);
}

.language-banner__options {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.language-banner__option {
  padding: 0.2rem 0.75rem;
  line-height: 1.5;
  border: 1px solid var(--color-primary);
  border-radius: 999px;
  background-color: transparent;
  color: var(--color-primary);
  font-size: clamp(0.78rem, 1.8vw, 0.9rem);
  font-weight: 600;
  text-decoration: none;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.language-banner__option:hover,
.language-banner__option[aria-current="true"] {
  background-color: var(--color-primary);
  color: var(--color-on-dark);
}

.language-banner__option:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

.language-banner__close {
  display: inline-flex;
  flex-shrink: 0;
  padding: 0.3rem;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--color-ink);
  cursor: pointer;
}

.language-banner__close:hover {
  background-color: var(--color-hover);
}

.language-banner__close:focus-visible {
  outline: 2px solid var(--color-focus);
}

/* Only the exit animates: the banner is server-rendered, so there is no enter. */
.language-banner-slide-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.language-banner-slide-leave-to {
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

.mobile-nav__language {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-sm);
  padding-inline: var(--space-md);
  border-bottom: 1px solid var(--color-border);
}

.mobile-nav__language-label {
  font-size: clamp(1rem, 3vw, 1.1rem);
  font-weight: 500;
  color: var(--color-ink);
}

@media (min-width: 48em) {
  .site-header__logo {
    margin-right: auto;
  }

  .site-header__actions .site-header__language {
    display: flex;
    margin-right: 0.25rem;
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
  .mobile-nav-backdrop {
    transition: none;
  }

  /* Keep only the fade for the language banner. */
  .language-banner-slide-leave-active {
    transition: opacity 0.3s ease;
  }

  .language-banner-slide-leave-to {
    transform: none;
  }
}
</style>
