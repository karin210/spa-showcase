<template>
  <div class="starting-animation" aria-hidden="true">
    <BrandMark tone="light" class="starting-animation__brand" />
  </div>
</template>

<style scoped>
.starting-animation {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-primary);
  /* Hold, then fade out (CSS only). */
  animation: starting-animation-hide 0.6s ease 1.6s forwards;
}

.starting-animation__brand {
  animation: starting-animation-breathe 1.6s ease-in-out;
}

.starting-animation__brand :deep(.brand-mark__name) {
  font-size: clamp(2rem, 7vw, 4.5rem);
}

.starting-animation__brand :deep(.brand-mark__sub) {
  font-size: clamp(1rem, 3vw, 1.8rem);
}

.starting-animation__brand :deep(.brand-mark__glyph) {
  width: clamp(2.5rem, 8vw, 5rem);
  height: clamp(2.5rem, 8vw, 5rem);
}

@keyframes starting-animation-breathe {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes starting-animation-hide {
  to {
    opacity: 0;
    visibility: hidden;
  }
}

@media (prefers-reduced-motion: reduce) {
  .starting-animation {
    display: none;
  }
}
</style>
