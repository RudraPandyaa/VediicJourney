<template>
  <main class="about-page">
    <section class="about-hero">
      <SiteHeader />
      <div class="about-hero__content">
        <h1 class="about-hero__title">
          {{ content.hero?.heading }}
        </h1>

        <p class="about-hero__intro body-large">
          {{ content.hero?.description }}
        </p>
      </div>
      <div class="about-hero__image">
        <img
          :src="
            mediaUrl(
              content.hero?.image,
              '/images/destinations/south-africa.jpg'
            )
          "
          alt="Travel destination"
        />
      </div>
    </section>

    <section class="about-story">
      <div class="about-story__grid">

        <!-- LEFT: CULTURE + PURPOSE -->
        <div class="about-story__content">

          <article class="about-story__block">

            <h2 class="about-story__title">
                {{ content.culture?.heading }}
            </h2>

            <div class="about-story__line"></div>

            <div class="about-story__text">
              <p
                v-for="(paragraph, index) in content.culture?.paragraphs || []"
                :key="`culture-${index}`"
              >
                {{ paragraph }}
              </p>
            </div>
          </article>

          <article class="about-story__block about-story__block--purpose">

            <h2 class="about-story__title">
                {{ content.purpose?.heading }}
            </h2>

            <div class="about-story__line"></div>

            <div class="about-story__text">
              <p
                v-for="(paragraph, index) in content.purpose?.paragraphs || []"
                :key="`purpose-${index}`"
              >
                {{ paragraph }}
              </p>
            </div>
          </article>

        </div>

        <!-- RIGHT: STEPPED IMAGE PLACEHOLDER COLLAGE -->
        <div
          class="about-story__collage"
          aria-label="Travel image collage"
        >
          <!-- LEFT: Images 1–3 -->
          <div class="about-story__column about-story__column--left">
            <div
              v-for="(image, index) in (content.collage?.images || []).slice(0, 3)"
              :key="`collage-left-${index}`"
              class="about-story__placeholder"
            >
              <img
                :src="mediaUrl(image)"
                alt="Travel destination"
              />
            </div>
          </div>

          <!-- CENTER: Images 4–7 -->
          <div class="about-story__column about-story__column--center">
            <div
              v-for="(image, index) in (content.collage?.images || []).slice(3, 7)"
              :key="`collage-center-${index}`"
              class="about-story__placeholder"
            >
              <img
                :src="mediaUrl(image)"
                alt="Travel destination"
              />
            </div>
          </div>

          <!-- RIGHT: Images 8–12 -->
          <div class="about-story__column about-story__column--right">
            <div
              v-for="(image, index) in (content.collage?.images || []).slice(7, 12)"
              :key="`collage-right-${index}`"
              class="about-story__placeholder"
            >
              <img
                :src="mediaUrl(image)"
                alt="Travel destination"
              />
            </div>
          </div>
        </div>

      </div>
    </section>

    <section class="about-beliefs">
      <div class="about-beliefs__header">
        <h2>{{ content.beliefs?.heading }}</h2>
      </div>

      <div class="about-beliefs__list">
        <article
          v-for="(item, index) in content.beliefs?.items || []"
          :key="`belief-${index}`"
          class="about-belief"
        >
          <div class="about-belief__content">
            <h3>{{ item.title }}</h3>

            <div class="about-belief__line"></div>

            <p>
              {{ item.description }}
            </p>
          </div>
        </article>
      </div>
    </section>

    <section class="about-difference">
      <div class="about-difference__image">
        <img
          :src="mediaUrl(content.founder?.image, '/images/owner.jpg')"
          :alt="`${content.founder?.name || 'Vedic Journey'} Founder`"
        />
      </div>

      <div class="about-difference__content">
        <p class="about-difference__eyebrow eyebrow">
          {{ content.founder?.eyebrow }}
        </p>

        <h2>
          {{ content.founder?.name }}
        </h2>

        <div class="about-difference__line"></div>

        <p class="about-difference__description body-large">
          {{ content.founder?.description }}
        </p>

        <div class="about-difference__features">
          <div
            v-for="(feature, index) in content.founder?.features || []"
            :key="`founder-feature-${index}`"
            class="about-difference__feature"
          >
            <strong>{{ feature }}</strong>
          </div>
        </div>
      </div>
    </section>

    <section class="about-philosophy">
      <div class="about-philosophy__inner">
        <blockquote>
          {{ content.philosophy?.quote }}
        </blockquote>

        <p class="about-philosophy__text">
          {{ content.philosophy?.description }}
        </p>
      </div>
    </section>

    <section class="about-destinations">
      <div class="about-destinations__content">
        <h2>
          {{ content.destinationsCta?.heading }}
        </h2>

        <p class="body-large">
          {{ content.destinationsCta?.description }}
        </p>

        <NuxtLink
          :to="content.destinationsCta?.buttonUrl || '/destinations'"
          class="about-destinations__link"
        >
          <span>
            {{ content.destinationsCta?.buttonLabel }}
          </span>

          <span class="about-destinations__arrow">
            <Icon name="lucide:arrow-right" />
          </span>
        </NuxtLink>
      </div>

      <div class="about-destinations__image">
        <img
          :src="
            mediaUrl(
              content.destinationsCta?.image,
              '/images/destinations/middle-east.jpg'
            )
          "
          alt="Vedic Journey destination"
        />
      </div>
    </section>

    <section class="about-final">
      <h2>
        {{ content.finalCta?.heading }}
      </h2>

      <NuxtLink
        :to="content.finalCta?.buttonUrl || '/contact'"
        class="about-final__link"
      >
        <span>
          {{ content.finalCta?.buttonLabel }}
        </span>

        <span>
          <Icon name="lucide:arrow-right" />
        </span>
      </NuxtLink>
    </section>
  </main>
</template>


<script setup lang="ts">

import {
  computed,
  onMounted,
  onUnmounted
} from 'vue'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import SiteHeader from '~/components/layout/SiteHeader.vue'
const config = useRuntimeConfig()

const { data: aboutResponse } = await useAsyncData(
  'about-page',
  () =>
    $fetch<any>(
      `${config.public.apiBase}/pages/about`
    )
)

const about = computed(() =>
  aboutResponse.value?.data ?? null
)

const content = computed(() =>
  about.value?.content ?? {}
)

const mediaUrl = (
  media: any,
  fallback = ''
) => {
  if (!media) return fallback

  if (typeof media === 'string') {
    return media
  }

  return media?.url || fallback
}

useSeoMeta({
  title: () =>
    about.value?.seo?.title ||
    about.value?.title ||
    'About | Vedic Journey',

  description: () =>
    about.value?.seo?.description || '',

  ogTitle: () =>
    about.value?.seo?.title ||
    about.value?.title ||
    'About | Vedic Journey',

  ogDescription: () =>
    about.value?.seo?.description || '',

  ogImage: () =>
    mediaUrl(about.value?.seo?.ogImage)
})

gsap.registerPlugin(ScrollTrigger)

let ctx: gsap.Context | null = null

onMounted(() => {

  ctx = gsap.context(() => {

    /* ---------------------------------------------------------
       HERO
    --------------------------------------------------------- */

    gsap.from(
      '.about-hero__eyebrow',
      {
        opacity: 0,
        y: 20,
        duration: 0.9,
        ease: 'power3.out'
      }
    )

    gsap.from(
      '.about-hero__title',
      {
        opacity: 0,
        y: 50,
        duration: 1.2,
        delay: 0.15,
        ease: 'power3.out'
      }
    )

    gsap.from(
      '.about-hero__intro',
      {
        opacity: 0,
        y: 25,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out'
      }
    )


    /* ---------------------------------------------------------
       STORY
    --------------------------------------------------------- */

    gsap.from(
      '.about-story__block',
      {
        opacity: 0,
        x: -45,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about-story',
          start: 'top 75%'
        }
      }
    )

    gsap.from(
      '.about-story__placeholder',
      {
        opacity: 0,
        y: 45,
        duration: 0.85,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about-story__collage',
          start: 'top 78%'
        }
      }
    )


    /* ---------------------------------------------------------
       BELIEFS
    --------------------------------------------------------- */

    gsap.from(
      '.about-belief',
      {
        opacity: 0,
        y: 40,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about-beliefs',
          start: 'top 75%'
        }
      }
    )


    /* ---------------------------------------------------------
       DIFFERENCE
    --------------------------------------------------------- */

    gsap.from(
      '.about-difference__image',
      {
        opacity: 0,
        x: -60,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about-difference',
          start: 'top 75%'
        }
      }
    )

    gsap.from(
      '.about-difference__content',
      {
        opacity: 0,
        x: 60,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about-difference',
          start: 'top 75%'
        }
      }
    )


    /* ---------------------------------------------------------
       PHILOSOPHY
    --------------------------------------------------------- */

    gsap.from(
      '.about-philosophy blockquote',
      {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about-philosophy',
          start: 'top 75%'
        }
      }
    )


    /* ---------------------------------------------------------
       FINAL CTA
    --------------------------------------------------------- */

    gsap.from(
      '.about-final h2',
      {
        opacity: 0,
        y: 50,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about-final',
          start: 'top 75%'
        }
      }
    )

  })

})


onUnmounted(() => {

  ctx?.revert()

})

</script>


<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;


/* ============================================================
   PAGE
============================================================ */

.about-page {
  background: $color-ivory;
  color: $color-charcoal;
  min-height: 100svh;
}


/* ============================================================
   HERO
============================================================ */

.about-hero {
  position: relative;

  display: flex;
  align-items: center;

  width: 100%;
  height: 100svh;
  min-height: 680px;

  overflow: hidden;

  background: $color-charcoal;
  color: $color-ivory-light;

  isolation: isolate;

  // ==========================================================
  // BACKGROUND IMAGE
  // ==========================================================

  &__image {
    position: absolute;
    z-index: $z-video;

    inset: 0;

    width: 100%;
    height: 100%;

    overflow: hidden;

    margin: 0;

    img {
      display: block;

      width: 100%;
      height: 100%;

      object-fit: cover;
      object-position: center;

      transform: scale(1.01);
    }

    /*
     * Cinematic overlay for the background image.
     * The existing page colors are not changed.
     */
    &::after {
      position: absolute;

      z-index: $z-overlay;

      inset: 0;

      background:
        linear-gradient(90deg,
          rgba(7, 7, 6, 0.48) 0%,
          rgba(7, 7, 6, 0.25) 42%,
          rgba(7, 7, 6, 0.08) 75%,
          rgba(7, 7, 6, 0.12) 100%),
        linear-gradient(0deg,
          rgba(7, 7, 6, 0.38) 0%,
          rgba(7, 7, 6, 0.06) 48%,
          rgba(7, 7, 6, 0.18) 100%);

      content: '';

      pointer-events: none;
    }
  }

  // ==========================================================
  // NAVBAR — ABOVE BACKGROUND
  // ==========================================================

  :deep(.site-header) {
    position: absolute;

    z-index: $z-content;

    top: 0;
    right: 0;
    left: 0;
  }

  // ==========================================================
  // HERO CONTENT
  // ==========================================================

  &__content {
    position: relative;

    z-index: $z-content;

    width: 100%;
    max-width: 1100px;

    margin-inline: auto;

    padding:
      clamp(70px, 9vw, 140px) var(--page-padding) clamp(80px, 10vw, 150px);

    text-align: center;
  }

  &__eyebrow {
    margin-bottom: 28px;
  }

  &__title {
    margin: 0;

    font-family:
      'Bebas Neue',
      sans-serif;

    font-size:
      clamp(4.5rem, 9vw, 9.5rem);

    font-weight: 400;

    line-height: 0.82;

    letter-spacing: 0.02em;

    color: #fff;

    em {
      color: $color-charcoal;

      font-family:
        'Cormorant Garamond',
        Georgia,
        serif;

      font-size: 0.75em;
      font-style: italic;
      letter-spacing: -0.02em;
    }
  }

  &__intro {
    max-width: 650px;

    margin:
      45px auto 0;

    color: #fff;

    line-height: 1.7;
  }
}


/* ============================================================
   CULTURE + PURPOSE
============================================================ */

.about-story {
  padding:
    clamp(100px, 12vw, 180px) var(--page-padding);

  overflow: hidden;
}

.about-story__grid {
  width: 100%;
  max-width: $container-max;

  margin-inline: auto;

  display: grid;

  grid-template-columns:
    minmax(0, 0.82fr) minmax(0, 1.18fr);

  gap:
    clamp(55px, 8vw, 130px);

  align-items: start;
}

// ==========================================================
// LEFT CONTENT
// ==========================================================

.about-story__content {
  max-width: 610px;

  padding-top: 20px;
}

.about-story__block {
  max-width: 570px;
}

.about-story__block--purpose {
  margin-top:
    clamp(85px, 10vw, 145px);
}

.about-story__eyebrow {
  margin-bottom: 22px;
}

.about-story__title {
  margin: 0;

  font-family:
    'Bebas Neue',
    sans-serif;

  font-size:
    clamp(4rem, 6.2vw, 6.8rem);

  font-weight: 400;

  line-height: 0.86;

  letter-spacing: 0.02em;
}

.about-story__line {
  width: 100%;
  height: 1px;

  margin:
    34px 0 28px;

  background:
    rgba($color-charcoal, 0.18);
}

/*
   * Same body typography family used by the page's
   * descriptive text.
   */
.about-story__text {
  max-width: 535px;

  p {
    margin: 0 0 20px;

    font-family:
      'Manrope',
      sans-serif;

    font-size:
      var(--fs-body);

    font-weight: 400;

    line-height: 1.72;

    color:
      $color-text-muted;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

// ==========================================================
// RIGHT STEPPED COLLAGE
// ==========================================================

.about-story__collage {
  --collage-step: clamp(55px, 4.5vw, 80px);

  /*
   * The collage now runs alongside BOTH Culture and Purpose.
   * Keeping the height generous prevents it from ending halfway
   * through the story content.
   */
  width: calc(100% + 11.8vw);
  margin-right: 0;

  display: grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap: 6px;

  min-height:
    clamp(1050px, 78vw, 1320px);

  height: 100%;

  align-self: stretch;
}

.about-story__column {
  display: flex;

  flex-direction: column;

  gap: 6px;

  min-height: 0;
}

/*
 * IMPORTANT:
 * Every column starts at the same top position.
 * The bottom difference is always exactly one --collage-step.
 */
.about-story__column--left {
  height:
    calc(100% - (var(--collage-step) * 2));
}

.about-story__column--center {
  height:
    calc(100% - var(--collage-step));
}

.about-story__column--right {
  height: 100%;
}

.about-story__placeholder {
  display: flex;

  align-items: center;
  justify-content: center;

  min-height: 0;

  overflow: hidden;

  position: relative;

  background:
    rgba($color-charcoal, 0.08);

  border:
    1px solid rgba($color-charcoal, 0.12);

  color:
    rgba($color-charcoal, 0.42);

  font-family:
    'Manrope',
    sans-serif;

  font-size: 10px;

  font-weight: 500;

  letter-spacing: 0.14em;

  text-transform: uppercase;

  flex-shrink: 1;
}

.about-story__placeholder img {
  display: block;

  width: 100%;
  height: 100%;

  max-width: none;
  max-height: none;

  object-fit: cover;
  object-position: center;

  flex: 0 0 100%;
}

/*
 * LEFT COLUMN
 *
 * Three deliberately varied image heights create a more
 * editorial rhythm instead of making every image the same size.
 */
.about-story__column--left {

  .about-story__placeholder:nth-child(1) {
    flex: 1.35 1 0;
  }

  .about-story__placeholder:nth-child(2) {
    flex: 0.85 1 0;
  }

  .about-story__placeholder:nth-child(3) {
    flex: 1.10 1 0;
  }
}

/*
 * CENTER COLUMN
 *
 * The center column is one equal step higher than the right.
 */
.about-story__column--center {

  .about-story__placeholder:nth-child(1) {
    flex: 1.05 1 0;
  }

  .about-story__placeholder:nth-child(2) {
    flex: 1.42 1 0;
  }

  .about-story__placeholder:nth-child(3) {
    flex: 0.82 1 0;
  }

  .about-story__placeholder:nth-child(4) {
    flex: 1.15 1 0;
  }
}

/*
 * RIGHT COLUMN
 *
 * The right column reaches the lowest point.
 */
.about-story__column--right {

  .about-story__placeholder:nth-child(1) {
    flex: 0.82 1 0;
  }

  .about-story__placeholder:nth-child(2) {
    flex: 1.28 1 0;
  }

  .about-story__placeholder:nth-child(3) {
    flex: 0.78 1 0;
  }

  .about-story__placeholder:nth-child(4) {
    flex: 1.20 1 0;
  }

  .about-story__placeholder:nth-child(5) {
    flex: 0.92 1 0;
  }
}


/* ============================================================
   BELIEFS
============================================================ */

/* ============================================================
   BELIEFS
============================================================ */

.about-beliefs {
  padding:
    clamp(100px, 12vw, 180px) var(--page-padding);

  background:
    $color-charcoal;

  color:
    $color-ivory;

  &__header {
    width: 100%;
    max-width: $container-max;

    margin-inline: auto;

    margin-bottom:
      clamp(60px, 8vw, 100px);

    text-align: center;

    .eyebrow {
      color:
        rgba($color-ivory, 0.55);
    }

    h2 {
      margin: 0;

      font-family:
        'Bebas Neue',
        sans-serif;

      font-size:
        clamp(5rem, 10vw, 10rem);

      font-weight: 400;

      line-height: 0.85;

      letter-spacing: 0.02em;

      color:
        $color-ivory;

      em {
        font-family:
          'Cormorant Garamond',
          Georgia,
          serif;

        font-size: 0.75em;

        font-style: italic;

        letter-spacing: -0.02em;

        color:
          $color-sand;
      }
    }
  }

  &__list {
    width: 100%;
    max-width: $container-max;

    margin-inline: auto;

    display: grid;

    grid-template-columns:
      repeat(3, minmax(0, 1fr));

    gap:
      clamp(18px, 2vw, 30px);

    align-items: stretch;
  }
}

.about-belief {
  position: relative;

  display: flex;

  flex-direction: column;

  min-height: 500px;

  padding:
    clamp(32px, 3.5vw, 52px);

  background:
    $color-ivory-light;

  color:
    $color-charcoal;

  border:
    1px solid rgba($color-ivory, 0.12);

  box-shadow:
    0 20px 60px rgba($color-charcoal, 0.18);

  overflow: hidden;

  transition:
    transform $transition-medium,
    box-shadow $transition-medium;

  &:hover {
    transform:
      translateY(-6px);

    box-shadow:
      0 28px 75px rgba($color-charcoal, 0.24);
  }

  &__number {
    margin-bottom:
      clamp(55px, 6vw, 80px);

    font-family:
      'Manrope',
      sans-serif;

    font-size: 11px;

    font-weight: 600;

    letter-spacing:
      0.12em;

    color:
      $color-sand;
  }

  &__content {
    display: flex;

    flex-direction: column;

    flex: 1;

    align-items: center;

    text-align: center;

    h3 {
      margin: 0;

      font-family:
        'Bebas Neue',
        sans-serif;

      font-size:
        clamp(3rem, 4.5vw, 4.8rem);

      font-weight: 400;

      line-height: 0.95;

      letter-spacing: 0.02em;

      color:
        $color-charcoal;
    }

    p {
      max-width: 520px;

      margin: 0;

      font-family:
        'Manrope',
        sans-serif;

      font-size:
        var(--fs-body);

      font-weight: 400;

      line-height: 1.72;

      color:
        $color-text-muted;
    }
  }

  &__line {
    width: 52px;
    height: 1px;

    margin:
      24px auto 30px;

    background:
      rgba($color-charcoal, 0.25);
  }
}


/* ============================================================
   DIFFERENCE
============================================================ */

/* ============================================================
   FOUNDER / DIFFERENCE
============================================================ */

/* ============================================================
   FOUNDER / DIFFERENCE
============================================================ */

.about-difference {
  display: grid;
  grid-template-columns: minmax(360px, 0.72fr) minmax(0, 1.28fr);
  min-height: 720px;
  background: $color-ivory-light;

  &__image {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 720px;
    padding: clamp(55px, 7vw, 90px) clamp(30px, 4vw, 70px);
    overflow: hidden;

    img {
      display: block;
      width: min(100%, 390px);
      height: min(590px, 70vh);
      aspect-ratio: 4 / 5;
      object-fit: cover;
      object-position: center;
      border: 1px solid rgba($color-charcoal, 0.16);
      box-shadow: 0 24px 65px rgba($color-charcoal, 0.12);
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: clamp(70px, 8vw, 115px) var(--page-padding) clamp(70px, 8vw, 115px) clamp(35px, 5vw, 80px);
    background: $color-ivory-light;
  }

  &__eyebrow {
    margin-bottom: 22px;
  }

  h2 {
    margin: 0;
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4.6rem, 6.6vw, 7.5rem);
    font-weight: 400;
    line-height: 0.84;
    letter-spacing: 0.02em;
    white-space: nowrap;

    em {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 0.78em;
      font-style: italic;
      letter-spacing: -0.02em;
      color: $color-sand;
    }
  }

  &__line {
    width: 100%;
    height: 1px;
    margin: 38px 0 30px;
    background: rgba($color-charcoal, 0.18);
  }

  &__description {
    max-width: 650px;
    margin: 0;
    color: $color-text-muted;
    line-height: 1.72;
  }

  &__features {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
    width: 100%;
    max-width: none;
    margin-top: 42px;
  }

  &__feature {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 145px;
    padding: 28px 30px;
    background: rgba($color-ivory, 0.58);
    border: 1px solid rgba($color-charcoal, 0.13);
    box-shadow: 0 10px 35px rgba($color-charcoal, 0.055);
    overflow: hidden;

    // No hover effect.
    transition: none;

    &::before {
      display: none;
    }

    strong {
      display: block;
      margin: 0;
      font-family: 'Manrope', sans-serif;
      font-size: 12px;
      font-weight: 600;
      line-height: 1.45;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      color: $color-charcoal;
    }
  }
}


/* ============================================================
   PHILOSOPHY
============================================================ */

.about-philosophy {
  padding:
    clamp(130px, 16vw, 230px) var(--page-padding);

  text-align: center;

  &__inner {
    max-width: 1500px;

    margin-inline: auto;
  }

  &__eyebrow {
    margin-bottom: 40px;
  }

  blockquote {
    margin: 0;

    font-family: 'Bebas Neue', sans-serif;
    letter-spacing: 0.02em;

    font-size:
      clamp(1.2rem, 5vw, 5.5rem);

    font-weight: 400;

    line-height: 0.95;

    
    color:
      $color-charcoal;
  }

  &__text {
    max-width: 500px;

    margin:
      45px auto 0;

      font-family:
      'Manrope',
      sans-serif;

    color:
      $color-text-muted;

    line-height: 1.7;
  }
}


/* ============================================================
   DESTINATIONS
============================================================ */

.about-destinations {
  display: grid;

  grid-template-columns:
    minmax(0, 0.9fr) minmax(0, 1.1fr);

  min-height: 650px;

  background:
    $color-charcoal;

  color:
    $color-ivory;

  &__content {
    display: flex;

    flex-direction: column;

    justify-content: center;

    padding:
      clamp(60px, 8vw, 120px);
  }

  .eyebrow {
    color:
      rgba($color-ivory, 0.55);
  }

  h2 {
    margin:
      25px 0 35px;

    font-family:
      'Bebas Neue',
      sans-serif;

    font-size:
      clamp(5rem, 8vw, 9rem);

    font-weight: 400;

    line-height: 0.84;

    letter-spacing:
      0.02em;

    em {
      font-family:
        'Cormorant Garamond',
        Georgia,
        serif;

      font-size: 0.78em;

      font-style: italic;

      color:
        $color-sand;
    }
  }

  &__content>p {
    max-width: 500px;

    color:
      rgba($color-ivory, 0.65);

    line-height: 1.7;
  }

  &__link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 18px;

    width: fit-content;
    min-height: 54px;
    margin-top: 45px;
    padding: 0 25px;

    border: 1px solid $color-ivory;
    background: $color-ivory;
    color: $color-charcoal;

    text-decoration: none;

    font-family: 'Manrope', sans-serif;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;

    transition:
      background $transition-fast,
      color $transition-fast,
      border-color $transition-fast;

    &:hover {
      background: transparent;
      color: $color-ivory;
      border-color: $color-ivory;

      // No arrow movement
      .about-destinations__arrow {
        transform: none;
      }
    }
  }

  &__arrow {
    display: flex;
    align-items: center;

    // No transition / animation
    transition: none;
    transform: none;

    :deep(svg) {
      width: 17px;
      height: 17px;
      transition: none;
      transform: none;
    }
  }

  &__image {
    min-height: 500px;

    overflow: hidden;

    img {
      display: block;

      width: 100%;
      height: 100%;

      object-fit: cover;
    }
  }
}


/* ============================================================
   FINAL CTA
============================================================ */

.about-final {
  padding:
    clamp(120px, 15vw, 220px) var(--page-padding);

  text-align: center;

  &__eyebrow {
    margin-bottom: 30px;
  }

  h2 {
    margin: 0;

    font-family:
      'Bebas Neue',
      sans-serif;

    font-size:
      clamp(5rem, 8vw, 7rem);

    font-weight: 400;

    line-height: 0.8;

    letter-spacing:
      0.02em;

    em {
      font-family:
        'Cormorant Garamond',
        Georgia,
        serif;

      font-size: 0.78em;

      font-style: italic;

      letter-spacing:
        -0.02em;

      color:
        $color-sand;
    }
  }

   &__link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 18px;

    width: fit-content;
    min-height: 54px;
    margin-top: 55px;
    padding: 0 25px;

    border: 1px solid $color-charcoal;
    background: $color-charcoal;
    color: $color-ivory;

    text-decoration: none;

    font-family: 'Manrope', sans-serif;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;

    transition:
      background $transition-fast,
      color $transition-fast,
      border-color $transition-fast;

    &:hover {
      background: transparent;
      color: $color-charcoal;
      border-color: $color-charcoal;

      // No arrow movement
      span:last-child {
        transform: none;
      }
    }

    span:last-child {
      display: flex;
      align-items: center;

      // Completely static arrow
      transition: none;
      transform: none;

      :deep(svg) {
        width: 17px;
        height: 17px;
        transition: none;
        transform: none;
      }
    }
  }
}


/* ============================================================
   TABLET
============================================================ */

@media (max-width: 991px) {

  .about-story__grid {
    grid-template-columns: 1fr;
  }

  .about-story__content {
    max-width: 700px;
  }

  .about-story__collage {
    width: 100%;
    margin-right: 0;

    min-height: clamp(900px, 105vw, 1100px);
    height: 100%;
  }

  .about-story__column--left {
    height: calc(100% - (var(--collage-step) * 2));
  }

  .about-story__column--center {
    height: calc(100% - var(--collage-step));
  }

  .about-story__column--right {
    height: 100%;
  }

  .about-beliefs__list {
    grid-template-columns:
      repeat(3, minmax(0, 1fr));

    gap: 14px;
  }

  .about-belief {
    min-height: 440px;
    padding: 32px 24px;
  }

  .about-belief__number {
    margin-bottom: 45px;
  }

  .about-belief__content h3 {
    font-size: clamp(2.6rem, 5vw, 3.5rem);
  }

  .about-difference {
    grid-template-columns: 1fr;
  }

  .about-difference__image {
    min-height: 500px;
  }

  .about-destinations {
    grid-template-columns: 1fr;
  }

  .about-destinations__image {
    min-height: 500px;
  }
}


/* ============================================================
   MOBILE
============================================================ */

@media (max-width: 600px) {

  .about-page {
    padding-top: 90px;
  }

  .about-hero {
    height: 100svh;
    min-height: 620px;
  }

  .about-hero__content {
    padding:
      55px var(--page-padding) 80px;
  }

  .about-hero__title {
    font-size:
      clamp(5rem, 20vw, 7rem);
  }


  .about-story {
    padding:
      90px var(--page-padding);
  }

  .about-story__title {
    font-size:
      clamp(4rem, 18vw, 6rem);
  }

  .about-story__block--purpose {
    margin-top: 75px;
  }

  .about-story__text p {
    font-size: var(--fs-body);
  }

  .about-story__collage {
    width: 100%;
    margin-right: 0;

    grid-template-columns:
      repeat(3, minmax(0, 1fr));

    gap: 3px;

    min-height: clamp(700px, 155vw, 900px);
    height: 100%;

    --collage-step: clamp(32px, 7vw, 50px);
  }

  .about-story__column {
    gap: 3px;
  }

  .about-story__column--left {
    height: calc(100% - (var(--collage-step) * 2));
  }

  .about-story__column--center {
    height: calc(100% - var(--collage-step));
  }

  .about-story__column--right {
    height: 100%;
  }

  .about-story__placeholder {
    font-size: 8px;
  }


  .about-beliefs {
    padding:
      90px var(--page-padding);
  }

  .about-beliefs__header h2 {
    font-size:
      clamp(5rem, 20vw, 7rem);
  }

  .about-beliefs__list {
    grid-template-columns: 1fr;

    gap: 18px;
  }

  .about-belief {
    min-height: 0;

    padding: 35px 28px 45px;
  }

  .about-belief__number {
    margin-bottom: 50px;
  }

  .about-belief__content h3 {
    font-size:
      clamp(2.8rem, 11vw, 4rem);
  }


  .about-difference__content {
    padding:
      70px var(--page-padding);
  }

  .about-difference h2 {
    font-size:
      clamp(5rem, 19vw, 7rem);
  }

  .about-difference__features {
    grid-template-columns: 1fr;
  }


  .about-philosophy {
    padding:
      110px var(--page-padding);
  }

  .about-philosophy blockquote {
    font-size:
      clamp(3rem, 13vw, 4.5rem);
  }


  .about-destinations__content {
    padding:
      80px var(--page-padding);
  }

  .about-destinations h2 {
    font-size:
      clamp(5rem, 19vw, 7rem);
  }

  .about-destinations__image {
    min-height: 400px;
  }


  .about-final {
    padding:
      120px var(--page-padding);
  }

  .about-final h2 {
    font-size:
      clamp(5.5rem, 21vw, 8rem);
  }

}
</style>