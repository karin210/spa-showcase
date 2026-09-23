<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { whatsappUrl } from "~/data/brand";
import { VACANCY_IDS, WORK_BANNER_PHOTO_ID, WORK_BENEFIT_IDS } from "~/data/vacancies";

const { t: trans, tm, rt } = useI18n();

useHead(() => ({ title: trans("careers.meta.title") }));

// Responsibilities and requirements are lists in the catalogue, resolved one by one.
function vacancyList(vacancyId: string, list: "responsibilities" | "requirements"): string[] {
  return (tm(`careers.vacancies.items.${vacancyId}.${list}`) as unknown[]).map((item) => rt(item as string));
}

function applyUrl(vacancyId: string): string {
  const title = trans(`careers.vacancies.items.${vacancyId}.title`);
  return whatsappUrl(trans("careers.vacancies.applyMessage", { title }));
}
</script>

<template>
  <SiteHeader />
  <main class="work-page">
    <PageBanner
      :photo-id="WORK_BANNER_PHOTO_ID"
      :image-alt="trans('careers.banner.imageAlt')"
      :eyebrow="trans('careers.banner.eyebrow')"
      :title="trans('careers.banner.title')"
      title-id="work-title"
    />

    <section class="benefits" aria-labelledby="benefits-title">
      <header class="benefits__header">
        <h2 id="benefits-title" class="section-title">{{ trans("careers.benefits.title") }}</h2>
        <p class="benefits__intro">{{ trans("careers.benefits.intro") }}</p>
      </header>

      <ul class="benefits__grid" role="list">
        <li v-for="benefitId in WORK_BENEFIT_IDS" :key="benefitId" class="benefit">
          <AppIcon name="leaf" class="benefit__icon" />
          <h3 class="benefit__title">{{ trans(`careers.benefits.items.${benefitId}.title`) }}</h3>
          <p class="benefit__description">{{ trans(`careers.benefits.items.${benefitId}.description`) }}</p>
        </li>
      </ul>
    </section>

    <section class="vacancies" aria-labelledby="vacancies-title">
      <header class="vacancies__header">
        <h2 id="vacancies-title" class="section-title">{{ trans("careers.vacancies.title") }}</h2>
        <p class="section-subtitle">{{ trans("careers.vacancies.count", VACANCY_IDS.length) }}</p>
      </header>

      <ul class="vacancies__list" role="list">
        <li v-for="vacancyId in VACANCY_IDS" :key="vacancyId">
          <article class="vacancy" :aria-labelledby="`${vacancyId}-title`">
            <header class="vacancy__header">
              <h3 :id="`${vacancyId}-title`" class="vacancy__title">
                {{ trans(`careers.vacancies.items.${vacancyId}.title`) }}
              </h3>
              <ul class="vacancy__tags" role="list">
                <li class="vacancy__tag">{{ trans(`careers.vacancies.items.${vacancyId}.employmentType`) }}</li>
                <li class="vacancy__tag">
                  <AppIcon name="clock" /> {{ trans(`careers.vacancies.items.${vacancyId}.schedule`) }}
                </li>
                <li class="vacancy__tag vacancy__tag--salary">
                  {{ trans(`careers.vacancies.items.${vacancyId}.salary`) }}
                </li>
              </ul>
            </header>

            <p class="vacancy__summary">{{ trans(`careers.vacancies.items.${vacancyId}.summary`) }}</p>

            <CollapsibleDisclosure class="vacancy__details">
              <template #summary>{{ trans("careers.vacancies.details") }}</template>
              <div class="vacancy__details-body">
                <section class="vacancy__block" :aria-labelledby="`${vacancyId}-responsibilities`">
                  <h4 :id="`${vacancyId}-responsibilities`" class="vacancy__label">
                    {{ trans("careers.vacancies.responsibilities") }}
                  </h4>
                  <ul class="vacancy__bullets">
                    <li v-for="item in vacancyList(vacancyId, 'responsibilities')" :key="item">{{ item }}</li>
                  </ul>
                </section>
                <section class="vacancy__block" :aria-labelledby="`${vacancyId}-requirements`">
                  <h4 :id="`${vacancyId}-requirements`" class="vacancy__label">
                    {{ trans("careers.vacancies.requirements") }}
                  </h4>
                  <ul class="vacancy__bullets">
                    <li v-for="item in vacancyList(vacancyId, 'requirements')" :key="item">{{ item }}</li>
                  </ul>
                </section>
              </div>
            </CollapsibleDisclosure>

            <SecondaryBtn :href="applyUrl(vacancyId)" external class="vacancy__apply">
              <template #icon><AppIcon name="whatsapp" /></template>
              {{ trans("careers.vacancies.apply") }}
            </SecondaryBtn>
          </article>
        </li>
      </ul>
    </section>
  </main>
  <SiteFooter />
</template>

<style scoped>
.work-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  padding-bottom: var(--space-lg);
}

/* ── Benefits ── */
.benefits {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  width: min(92vw, 64rem);
  margin-inline: auto;
}

.benefits__header {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  max-width: 44rem;
  margin-inline: auto;
  text-align: center;
}

.benefits__intro {
  margin: 0;
  font-family: var(--font-serif);
  font-size: clamp(1.15rem, 2.4vw, 1.4rem);
  line-height: 1.6;
}

.benefits__grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
  gap: var(--space-sm);
}

.benefit {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: var(--space-md);
  border-radius: var(--radius-md);
  background-color: var(--color-secondary);
}

.benefit__icon {
  font-size: clamp(1.3rem, 2.6vw, 1.5rem);
  color: var(--color-primary);
}

.benefit__title {
  margin: 0;
  font-size: clamp(1.15rem, 2.4vw, 1.3rem);
  font-weight: 700;
}

.benefit__description {
  margin: 0;
  font-size: clamp(0.92rem, 1.6vw, 1rem);
  color: var(--color-ink-muted);
}

/* ── Vacancies ── */
.vacancies {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  width: min(92vw, 52rem);
  margin-inline: auto;
}

.vacancies__header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: center;
}

.vacancies__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.vacancy {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: var(--space-md);
  border-left: 4px solid var(--color-primary);
  border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
  background-color: var(--color-surface);
  box-shadow: 0 2px 16px var(--color-shadow);
}

.vacancy__header {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.vacancy__title {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(1.4rem, 3vw, 1.8rem);
  color: var(--color-ink);
}

.vacancy__tags {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.vacancy__tag {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.8rem;
  font-size: clamp(0.8rem, 1.8vw, 0.9rem);
  color: var(--color-primary-dark);
  background-color: var(--color-primary-soft);
  border-radius: 999px;
}

.vacancy__tag--salary {
  font-weight: 600;
}

.vacancy__summary {
  margin: 0;
  font-size: clamp(1rem, 1.6vw, 1.05rem);
  line-height: 1.65;
  color: var(--color-ink-muted);
}

.vacancy__details :deep(.disclosure__summary) {
  justify-content: flex-start;
  padding-block: 0.25rem;
  font-size: clamp(0.92rem, 1.8vw, 1rem);
  font-weight: 600;
  color: var(--color-primary);
}

.vacancy__details-body {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
  gap: var(--space-sm) var(--space-md);
  padding-top: var(--space-sm);
}

.vacancy__block {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.vacancy__label {
  margin: 0;
  font-family: var(--font-body);
  font-size: clamp(0.75rem, 1.5vw, 0.88rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--color-primary);
}

.vacancy__bullets {
  margin: 0;
  padding-left: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: clamp(0.92rem, 1.6vw, 1rem);
}

.vacancy__bullets li::marker {
  color: var(--color-primary);
}

.vacancy__apply {
  align-self: flex-start;
}
</style>
