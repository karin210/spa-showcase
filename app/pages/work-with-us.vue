<script setup lang="ts">
import { whatsappUrl } from "~/data/brand";
import { VACANCIES, WORK_BANNER, WORK_BENEFITS, WORK_INTRO } from "~/data/vacancies";

useHead({ title: "Vacantes" });

function applyUrl(vacancyTitle: string): string {
  return whatsappUrl(`¡Hola! Me interesa la vacante de ${vacancyTitle}. ¿Me podrían dar más información?`);
}
</script>

<template>
  <SiteHeader />
  <main class="work-page">
    <PageBanner
      :photo-id="WORK_BANNER.photoId"
      :image-alt="WORK_BANNER.imageAlt"
      eyebrow="Trabaja con nosotros"
      title="Cuida a otras personas en un lugar que también te cuida"
      title-id="work-title"
    />

    <section class="benefits" aria-labelledby="benefits-title">
      <header class="benefits__header">
        <h2 id="benefits-title" class="section-title">¿Por qué Alma Serena?</h2>
        <p class="benefits__intro">{{ WORK_INTRO }}</p>
      </header>

      <ul class="benefits__grid" role="list">
        <li v-for="benefit in WORK_BENEFITS" :key="benefit.title" class="benefit">
          <AppIcon name="leaf" class="benefit__icon" />
          <h3 class="benefit__title">{{ benefit.title }}</h3>
          <p class="benefit__description">{{ benefit.description }}</p>
        </li>
      </ul>
    </section>

    <section class="vacancies" aria-labelledby="vacancies-title">
      <header class="vacancies__header">
        <h2 id="vacancies-title" class="section-title">Vacantes abiertas</h2>
        <p class="section-subtitle">{{ VACANCIES.length }} posiciones disponibles en Morelia</p>
      </header>

      <ul class="vacancies__list" role="list">
        <li v-for="vacancy in VACANCIES" :key="vacancy.id">
          <article class="vacancy" :aria-labelledby="`${vacancy.id}-title`">
            <header class="vacancy__header">
              <h3 :id="`${vacancy.id}-title`" class="vacancy__title">{{ vacancy.title }}</h3>
              <ul class="vacancy__tags" role="list">
                <li class="vacancy__tag">{{ vacancy.employmentType }}</li>
                <li class="vacancy__tag"><AppIcon name="clock" /> {{ vacancy.schedule }}</li>
                <li class="vacancy__tag vacancy__tag--salary">{{ vacancy.salary }}</li>
              </ul>
            </header>

            <p class="vacancy__summary">{{ vacancy.summary }}</p>

            <CollapsibleDisclosure class="vacancy__details">
              <template #summary>Ver responsabilidades y requisitos</template>
              <div class="vacancy__details-body">
                <section class="vacancy__block" :aria-labelledby="`${vacancy.id}-responsibilities`">
                  <h4 :id="`${vacancy.id}-responsibilities`" class="vacancy__label">Responsabilidades</h4>
                  <ul class="vacancy__bullets">
                    <li v-for="item in vacancy.responsibilities" :key="item">{{ item }}</li>
                  </ul>
                </section>
                <section class="vacancy__block" :aria-labelledby="`${vacancy.id}-requirements`">
                  <h4 :id="`${vacancy.id}-requirements`" class="vacancy__label">Requisitos</h4>
                  <ul class="vacancy__bullets">
                    <li v-for="item in vacancy.requirements" :key="item">{{ item }}</li>
                  </ul>
                </section>
              </div>
            </CollapsibleDisclosure>

            <SecondaryBtn :href="applyUrl(vacancy.title)" external class="vacancy__apply">
              <template #icon><AppIcon name="whatsapp" /></template>
              Postularme por WhatsApp
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
