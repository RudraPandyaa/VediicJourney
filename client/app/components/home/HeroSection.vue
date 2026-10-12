<template>
  <section
    ref="heroRef"
    class="hero"
  >
    <!-- Background Video -->
    <div class="hero__media">
      <video
        ref="videoRef"
        class="hero__video"
        autoplay
        muted
        loop
        playsinline
        preload="metadata"
      >
        <source
          src="/videos/hero.mp4"
          type="video/mp4"
        >
      </video>
    </div>

    <!-- Cinematic Overlays -->
    <div class="hero__overlay" />
    <div class="hero__gradient" />

    <!-- Header -->
    <SiteHeader />

    <!-- Hero Content -->
    <div class="hero__inner">
      <div class="hero__content">
        <!-- Eyebrow -->
        <p class="hero__eyebrow eyebrow hero-animate-eyebrow">
          <span>luxury travel redefined</span>
        </p>

        <!-- Main Heading -->
        <h1 class="hero__title display-title">
          <span class="hero__title-line">
            <span class="hero__title-text">
              Journeys beyond
            </span>
          </span>

          <span class="hero__title-line">
            <span class="hero__title-text">
              the ordinary.
            </span>
          </span>
        </h1>

        <!-- Description -->
        <p class="hero__description body-large hero-animate-description">
          Beyond destinations. Bespoke journeys created for the way you dream of travelling.
        </p>

        <!-- CTA -->
        <NuxtLink
          to="/destinations"
        class="hero__cta text-link hero-animate-cta"
        >
          <span>Begin Your Journey</span>

          <span class="hero__cta-arrow">
            <Icon name="lucide:arrow-right" />
          </span>
        </NuxtLink>
      </div>

      <!-- Hero Footer -->
      <div class="hero__footer hero-animate-footer">

        <button
          class="hero__scroll"
          type="button"
          aria-label="Scroll to explore"
          @click="scrollToNextSection"
        >
          <span>Scroll to explore</span>

          <span class="hero__scroll-line" />
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import SiteHeader from '~/components/layout/SiteHeader.vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const heroRef = ref<HTMLElement | null>(null)
const videoRef = ref<HTMLVideoElement | null>(null)

let ctx: gsap.Context | undefined

const scrollToNextSection = () => {
  const nextSection = heroRef.value?.nextElementSibling

  if (nextSection instanceof HTMLElement) {
    nextSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
}

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)

  if (!heroRef.value) return

  ctx = gsap.context(() => {
    // --------------------------------------------------------
    // ENTRANCE
    // --------------------------------------------------------

    const tl = gsap.timeline({
      defaults: {
        ease: 'power3.out'
      }
    })

    tl.from('.site-header', {
      y: -16,
      opacity: 0,
      duration: 0.9
    })

      .from(
        '.hero-animate-eyebrow',
        {
          y: 16,
          opacity: 0,
          duration: 0.7
        },
        '-=0.45'
      )

      .from(
        '.hero__title-text',
        {
          yPercent: 105,
          duration: 1.1,
          stagger: 0.1
        },
        '-=0.4'
      )

      .from(
        '.hero-animate-description',
        {
          y: 18,
          opacity: 0,
          duration: 0.75
        },
        '-=0.55'
      )

      .from(
        '.hero-animate-cta',
        {
          y: 16,
          opacity: 0,
          duration: 0.7
        },
        '-=0.5'
      )

      .from(
        '.hero-animate-footer',
        {
          y: 10,
          opacity: 0,
          duration: 0.8
        },
        '-=0.35'
      )

    // --------------------------------------------------------
    // SCROLL — CONTENT
    // --------------------------------------------------------

    gsap.to('.hero__content', {
      y: -40,
      opacity: 0,

      scrollTrigger: {
        trigger: heroRef.value,
        start: '12% top',
        end: '70% top',
        scrub: 1
      }
    })

    // IMPORTANT:
    // Don't fade the footer independently.
    // It should remain visible at initial viewport.

    // --------------------------------------------------------
    // SCROLL — VIDEO
    // --------------------------------------------------------

    if (videoRef.value) {
      gsap.fromTo(
        videoRef.value,
        {
          scale: 1.01
        },
        {
          scale: 1.06,
          ease: 'none',

          scrollTrigger: {
            trigger: heroRef.value,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2
          }
        }
      )
    }

    ScrollTrigger.refresh()
  }, heroRef.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;

.hero {
  position: relative;
  overflow: hidden;

  width: 100%;
  height: 100svh;
  min-height: 680px;

  // background: $color-charcoal;
  color: $color-ivory-light;

  // ==========================================================
  // VIDEO
  // ==========================================================

  &__media {
    position: absolute;
    z-index: $z-video;
    inset: 0;

    overflow: hidden;
  }

  &__video {
    width: 100%;
    height: 100%;

    object-fit: cover;
    object-position: center;

    transform: scale(1.01);
    will-change: transform;
  }

  // ==========================================================
  // OVERLAYS
  // ==========================================================

  &__overlay {
    position: absolute;
    z-index: $z-overlay;
    inset: 0;

    // background: rgba(9, 9, 8, 0.28);

    pointer-events: none;
  }

  &__gradient {
    position: absolute;
    z-index: $z-overlay;
    inset: 0;

    background:
      linear-gradient(
        90deg,
        rgba(7, 7, 6, 0.62) 0%,
        rgba(7, 7, 6, 0.32) 38%,
        rgba(7, 7, 6, 0.08) 72%,
        rgba(7, 7, 6, 0) 100%
      ),
      linear-gradient(
        0deg,
        rgba(7, 7, 6, 0.55) 0%,
        rgba(7, 7, 6, 0.12) 38%,
        transparent 60%
      );

    pointer-events: none;
  }

  // ==========================================================
  // MAIN CONTAINER
  // ==========================================================

  &__inner {
    position: relative;
    z-index: $z-content;

    width: min(
      calc(100% - (var(--page-padding) * 2)),
      #{$container-max}
    );

    height: 100%;
    margin-inline: auto;
  }

  // ==========================================================
  // HERO CONTENT
  // ==========================================================

    &__content {
    position: absolute;
    top: 45%;
    left: 0;

    width: min(900px, 68vw);

    transform: translateY(-50%);

    will-change: transform, opacity;
    }

  // ==========================================================
  // EYEBROW
  // ==========================================================

  &__eyebrow {
    display: flex;
    align-items: center;
    gap: 16px;

    margin-bottom: 20px;

    color: rgba(250, 248, 243, 0.88);
  }

  &__eyebrow-line {
    display: block;
    flex-shrink: 0;

    width: 36px;
    height: 1px;

    background: rgba(250, 248, 243, 0.65);
  }

  // ==========================================================
  // TITLE
  // ==========================================================

  &__title {
    margin: 0;

    color: $color-ivory-light;
  }

  &__title-line {
    display: block;
    overflow: hidden;

    padding-bottom: 0.07em;
  }

  &__title-text {
    display: block;
    font-family: 'Bebas Neue', sans-serif;
    letter-spacing: 0.02em;
    will-change: transform;
  }

  // ==========================================================
  // DESCRIPTION
  // ==========================================================

  &__description {
    max-width: 560px;

    margin-top: 20px;

    color: rgba(250, 248, 243, 0.88);
  }

 // ==========================================================
// CTA
// ==========================================================

&__cta {
  display: inline-flex;

  align-items: center;
  justify-content: center;

  gap: 12px;

  width: fit-content;

  min-height: 54px;

  margin-top: 25px;
  padding: 0 25px;

  border: 1px solid #fff;

  background: #fff;

  color: #000;

  font-family: 'Manrope', sans-serif;

  font-size: var(--fs-link);

  font-weight: 500;

  letter-spacing: 0.07em;

  text-decoration: none;

  text-transform: uppercase;

  transition:
    background $transition-medium,
    color $transition-medium;

  &:hover {
    background: transparent;

    color: #fff;

    /*
     * No gap change here.
     * Arrow stays exactly where it is.
     */
  }
}


// ==========================================================
// CTA ARROW
// ==========================================================

&__cta-arrow {
  display: flex;

  align-items: center;
  justify-content: center;

  :deep(svg) {
    width: 16px;
    height: 16px;
  }
}

  // ==========================================================
  // HERO FOOTER
  // ==========================================================

    &__footer {
    position: absolute;
    z-index: 5;

    right: 0;
    bottom: 28px;
    left: 0;

    display: flex;
    align-items: center;
    justify-content: space-between;

    width: 100%;

    opacity: 1;
    visibility: visible;

    color: rgba(250, 248, 243, 0.82);

    pointer-events: auto;
    }

    &__regions {
    display: flex;
    align-items: center;
    gap: 12px;

    margin: 0;

    font-family: 'Manrope', sans-serif;
    font-size: var(--fs-nav);
    font-weight: 500;
    line-height: 1;
    letter-spacing: 0.11em;
    text-transform: uppercase;

    span:nth-child(even) {
        opacity: 0.45;
    }
    }

    &__scroll {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 10px;

        color: rgba(250, 248, 243, 0.82);

        font-family: 'Manrope', sans-serif;
        font-size: var(--fs-nav);
        font-weight: 500;
        line-height: 1;
        letter-spacing: 0.12em;
        text-transform: uppercase;
    }

  &__scroll-line {
    position: relative;

    display: block;
    overflow: hidden;

    width: 72px;
    height: 1px;

    background: rgba(250, 248, 243, 0.3);

    &::after {
      position: absolute;
      inset: 0;

      background: $color-ivory-light;

      content: '';

      transform: translateX(-100%);

      animation: hero-scroll-line 2.4s ease-in-out infinite;
    }
  }
}

// ============================================================
// SCROLL INDICATOR ANIMATION
// ============================================================

@keyframes hero-scroll-line {
  0% {
    transform: translateX(-100%);
  }

  50% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(100%);
  }
}

// ============================================================
// LAPTOP
// 1025px — 1366px
// ============================================================

@media (max-width: 1366px) {
  .hero {
    min-height: 640px;

    &__content {
        top: 44%;
        width: min(820px, 70vw);
    }

    &__description {
      max-width: 520px;
    }

    &__footer {
      bottom: 22px;
    }
  }
}

// ============================================================
// TABLET
// <= 1024px
// ============================================================

@media (max-width: 1024px) {
  .hero {
    min-height: 650px;

    &__content {
      top: 45%;

      width: min(720px, 82vw);
    }

    &__gradient {
      background:
        linear-gradient(
          90deg,
          rgba(7, 7, 6, 0.62) 0%,
          rgba(7, 7, 6, 0.25) 60%,
          rgba(7, 7, 6, 0.08) 100%
        ),
        linear-gradient(
          0deg,
          rgba(7, 7, 6, 0.6) 0%,
          rgba(7, 7, 6, 0.08) 50%
        );
    }

    &__description {
      max-width: 500px;
    }

    &__footer {
      bottom: 24px;
    }
  }
}

// ============================================================
// SMALL TABLET
// <= 768px
// ============================================================

@media (max-width: 768px) {
  .hero {
    min-height: 640px;

    &__video {
      object-position: 58% center;
    }

    &__content {
      top: 48%;

      width: 88%;
      max-width: 620px;
    }

    &__eyebrow {
      gap: 12px;

      margin-bottom: 22px;
    }

    &__eyebrow-line {
      width: 26px;
    }

    &__description {
      max-width: 460px;

      margin-top: 24px;
    }

    &__cta {
      margin-top: 28px;
    }

    &__regions {
      display: none;
    }

    &__footer {
      justify-content: flex-end;
    }
  }
}

// ============================================================
// MOBILE
// <= 600px
// ============================================================

@media (max-width: 600px) {
  .hero {
    min-height: 620px;

    &__video {
      object-position: 60% center;
    }

    &__content {
      top: 45%;

      width: 100%;
      max-width: 100%;
    }

    &__eyebrow {
      flex-wrap: wrap;
      gap: 9px;

      margin-bottom: 18px;
    }

    &__eyebrow-line {
      width: 22px;
    }

    &__description {
      max-width: 340px;
      margin-top: 20px;
    }

    &__cta {
      margin-top: 24px;
    }

    &__regions {
      display: none;
    }

    &__footer {
      bottom: 18px;

      justify-content: flex-end;
    }

    &__scroll {
      margin-left: auto;
    }
  }
}

// ============================================================
// SMALL MOBILE
// <= 390px
// ============================================================

@media (max-width: 390px) {
  .hero {
    min-height: 600px;

    &__content {
      top: 46%;
    }

    &__description {
      max-width: 310px;
    }

    &__footer {
      bottom: 18px;
    }
  }
}

// ============================================================
// SHORT LAPTOP SCREENS
// Example: 1366 × 768
// ============================================================

@media (min-width: 769px) and (max-height: 780px) {
  .hero {
    &__content {
      top: 49%;
    }

    &__eyebrow {
      margin-bottom: 18px;
    }

    &__description {
      margin-top: 20px;
    }

    &__cta {
      margin-top: 24px;
    }

    &__footer {
      bottom: 20px;
    }
  }
}

// ============================================================
// REDUCED MOTION
// ============================================================

@media (prefers-reduced-motion: reduce) {
  .hero {
    &__scroll-line::after {
      animation: none;
    }
  }
}
</style>