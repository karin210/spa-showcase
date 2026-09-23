<script setup lang="ts">
import { CONTACT, whatsappUrl } from "~/data/brand";
</script>

<template>
  <section id="contact" class="contact" aria-labelledby="contact-title">
    <header class="contact__header">
      <h2 id="contact-title" class="section-title">Contacto</h2>
      <p class="section-subtitle">Te esperamos con una infusión caliente y música tranquila</p>
    </header>

    <div class="contact__content">
      <address class="contact__details">
        <p class="contact__label">Dirección</p>
        <p class="contact__address">
          <template v-for="(line, index) in CONTACT.addressLines" :key="line">
            <br v-if="index > 0" />{{ line }}
          </template>
        </p>
        <SecondaryBtn :href="CONTACT.mapLinkUrl" external class="contact__directions">
          <template #icon><AppIcon name="map-pin" /></template>
          Cómo llegar
        </SecondaryBtn>

        <p class="contact__label">Teléfono</p>
        <ul class="contact__phones" role="list">
          <li v-for="phone in CONTACT.phones" :key="phone.tel">
            <SecondaryBtn :href="`tel:${phone.tel}`">
              <template #icon><AppIcon name="phone" /></template>
              {{ phone.display }}
            </SecondaryBtn>
          </li>
        </ul>

        <p class="contact__label">Redes</p>
        <div class="contact__social">
          <a
            :href="whatsappUrl(CONTACT.whatsappMessage)"
            class="contact__social-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Enviar un WhatsApp a Alma Serena"
          >
            <AppIcon name="whatsapp" />
          </a>
          <a
            :href="CONTACT.instagramUrl"
            class="contact__social-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visitar Instagram"
          >
            <AppIcon name="instagram" />
          </a>
        </div>
      </address>

      <div class="contact__map">
        <iframe
          class="contact__map-frame"
          :src="CONTACT.mapEmbedUrl"
          title="Mapa de la zona donde se ubica el spa"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  padding: var(--space-lg) var(--space-md);
  background-color: var(--color-secondary);
}

.contact__header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: center;
}

.contact__content {
  width: 100%;
  max-width: 64rem;
  margin-inline: auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-md);
}

@media (min-width: 48rem) {
  .contact__content {
    grid-template-columns: 1fr 1.4fr;
  }
}

.contact__details {
  font-style: normal;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 0.6rem;
}

.contact__label {
  margin: 0;
  font-size: clamp(0.75rem, 1.5vw, 0.88rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--color-primary);
}

.contact__directions + .contact__label {
  margin-top: 0.75rem;
}

.contact__address {
  margin: 0;
  font-family: var(--font-serif);
  font-size: clamp(1.25rem, 3vw, 1.7rem);
  line-height: 1.35;
}

.contact__phones {
  list-style: none;
  margin: 0 0 0.75rem;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.contact__social {
  display: flex;
  gap: 0.75rem;
}

.contact__social-link {
  display: inline-flex;
  padding: 0.55rem;
  border-radius: 50%;
  color: var(--color-primary);
  background-color: var(--color-surface);
  font-size: clamp(1.2rem, 2.5vw, 1.45rem);
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.contact__social-link:hover {
  background-color: var(--color-primary);
  color: var(--color-on-dark);
}

.contact__social-link:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 3px;
}

.contact__map {
  position: relative;
  min-height: clamp(16rem, 40vw, 24rem);
  overflow: hidden;
  border-radius: var(--radius-md);
  box-shadow: 0 4px 18px var(--color-shadow);
}

.contact__map-frame {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  filter: saturate(0.8) sepia(0.12) contrast(1.02);
}
</style>
