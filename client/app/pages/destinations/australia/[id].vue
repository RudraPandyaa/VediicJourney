<template>
  <main v-if="stateData" class="state-itinerary-page">

    <NuxtLink to="/destinations/australia" class="back-button">
      <Icon name="lucide:arrow-left" />
      <span>Back to Destinations</span>
    </NuxtLink>

    <!-- ==================================================
         HERO
    =================================================== -->

    <section class="state-hero">
      <div class="state-hero__image-wrap">
        <img
          :src="stateData.image"
          :alt="stateData.name"
          class="state-hero__image"
        />
        <div class="state-hero__overlay"></div>
      </div>

      <div class="state-hero__content">
        <h1 class="state-hero__heading heading-xl">
          {{ stateData.name }}
        </h1>

        <p class="state-hero__tagline">
          {{ stateData.tagline }}
        </p>
      </div>
    </section>


    <!-- ==================================================
         ABOUT + PLAN YOUR JOURNEY
    =================================================== -->

    <section class="country-intro">
      <div class="country-intro__container">

        <div class="country-intro__about">
          <p class="country-intro__eyebrow">
            DISCOVER {{ stateData.name.toUpperCase() }}
          </p>

          <h2 class="country-intro__heading">
            About {{ stateData.name }}
          </h2>

          <p class="country-intro__description">
            {{ stateData.description }}
          </p>
        </div>

        <aside class="country-intro__cta">
          <div class="country-intro__cta-inner">

            <p class="country-intro__cta-eyebrow">
              YOUR JOURNEY, YOUR WAY
            </p>

            <h3 class="country-intro__cta-heading">
              Plan Your Journey
            </h3>

            <p class="country-intro__cta-description">
              Let us help you create a journey through
              {{ stateData.name }} designed around your interests and pace.
            </p>

            <NuxtLink
              to="/contact"
              class="country-intro__cta-button"
            >
              <span>Plan Your Journey</span>
              <Icon name="lucide:arrow-right" />
            </NuxtLink>

          </div>
        </aside>

      </div>
    </section>


    <!-- ==================================================
         PLACES / ART GALLERY
    =================================================== -->

    <section class="places-gallery">

      <div class="places-gallery__header">

        <p class="places-gallery__eyebrow">
          DISCOVER {{ stateData.name.toUpperCase() }}
        </p>

        <h2 class="places-gallery__heading">
          Places to Visit in {{ stateData.name }}
        </h2>

        <p class="places-gallery__description">
          A visual collection of the places and landscapes that
          make {{ stateData.name }} worth discovering.
        </p>

      </div>

      <div class="places-gallery__grid">

        <div
          v-for="(row, rowIndex) in galleryRows"
          :key="`gallery-row-${rowIndex}`"
          class="places-gallery__row"
          :class="[
            `places-gallery__row--${rowIndex % 3}`,
            `places-gallery__row--count-${row.length}`
          ]"
        >

          <figure
            v-for="(place, placeIndex) in row"
            :key="place.name || `${rowIndex}-${placeIndex}`"
            class="places-gallery__item"
          >

            <div class="places-gallery__image-wrap">

              <img
                :src="placeImage(place)"
                :alt="place.name"
                class="places-gallery__image"
              />

              <div class="places-gallery__overlay"></div>

              <figcaption class="places-gallery__content">

                <h3 class="places-gallery__name">
                  {{ place.name }}
                </h3>

              </figcaption>

            </div>

          </figure>

        </div>

      </div>

    </section>


    <!-- ==================================================
         COUNTRY ITINERARIES
    =================================================== -->

    <section class="itineraries-section itineraries-section--country">

      <div class="itineraries-section__header">

        <p class="itineraries-section__eyebrow">
          {{ stateData.name.toUpperCase() }} ITINERARIES
        </p>

        <h2 class="itineraries-section__heading">
          Journeys Through {{ stateData.name }}
        </h2>

        <p class="itineraries-section__description">
          Follow thoughtfully planned journeys through the
          highlights of {{ stateData.name }}.
        </p>

      </div>

      <div class="itineraries-section__grid">

        <article
          v-for="itinerary in countryItineraries"
          :key="itinerary.id"
          class="itinerary-card"
        >

          <div class="itinerary-card__image">
            <img
              :src="itinerary.image"
              :alt="itinerary.title"
            />
          </div>

          <div class="itinerary-card__content">

            <div class="itinerary-card__meta">
              {{ itinerary.nights }} NIGHTS / {{ itinerary.days }} DAYS
            </div>

            <h3 class="itinerary-card__title">
              {{ itinerary.title }}
            </h3>

            <p class="itinerary-card__route">
              {{ itinerary.route }}
            </p>

            <p class="itinerary-card__description">
              {{ itinerary.description }}
            </p>

            <NuxtLink
              :to="itinerary.to"
              class="itinerary-card__button"
            >
              <span>View Itinerary</span>
              <Icon name="lucide:arrow-right" />
            </NuxtLink>

          </div>

        </article>

      </div>

    </section>

  </main>

  <main v-else class="state-itinerary-page not-found">

    <NuxtLink to="/destinations/australia" class="back-button">
      <Icon name="lucide:arrow-left" />
      <span>Back to Destinations</span>
    </NuxtLink>

    <div class="not-found__content">
      <h1 class="heading-lg">Destination not found</h1>

      <NuxtLink
        to="/destinations/australia"
        class="btn-primary"
      >
        Back to Australia Destinations
      </NuxtLink>
    </div>

  </main>
</template>


<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { australiaData as statesData } from '~/data/australiaData'

const route = useRoute()
const stateId = route.params.id as string

const stateData = computed(() => {
  return statesData.find(s => s.id === stateId) || null
})

const placeImage = (place: any) => {
  return (
    place.image ||
    place.heroImage ||
    place.imageUrl ||
    '/images/destinations/australia.jpg'
  )
}


/*
 * Static UI data for the design phase.
 * These country itineraries will later come directly from Vendure.
 *
 * Country → Itineraries
 */
const countryItineraries = computed(() => {
  const country = stateData.value
  if (!country) return []

  const firstImage =
    country.places?.[0]?.image ||
    country.image ||
    '/images/destinations/australia.jpg'

  const secondImage =
    country.places?.[1]?.image ||
    firstImage

  const thirdImage =
    country.places?.[2]?.image ||
    firstImage

  const placeRoute = (count: number) =>
    country.places?.slice(0, count).map((place: any) => place.name).join(' · ') ||
    country.name

  return [
    {
      id: `${country.id}-highlights`,
      title: `${country.name} Highlights`,
      nights: 5,
      days: 4,
      route: placeRoute(3),
      description:
        `Discover the highlights of ${country.name} through a thoughtfully planned journey.`,
      image: firstImage,
      to: `/destinations/australia/${country.id}/itineraries/${country.id}-highlights`
    },
    {
      id: `${country.id}-explorer`,
      title: `${country.name} Explorer`,
      nights: 7,
      days: 6,
      route: placeRoute(4),
      description:
        `Experience more of ${country.name}, from its iconic places to its lesser-known highlights.`,
      image: secondImage,
      to: `/destinations/australia/${country.id}/itineraries/${country.id}-explorer`
    },
    {
      id: `${country.id}-escape`,
      title: `${country.name} Escape`,
      nights: 6,
      days: 5,
      route: placeRoute(3),
      description:
        `Take a slower journey through ${country.name}, combining memorable places and experiences.`,
      image: thirdImage,
      to: `/destinations/australia/${country.id}/itineraries/${country.id}-escape`
    }
  ]
})

const galleryRows = computed(() => {
  const places = stateData.value?.places ?? []
  const rows: any[][] = []

  for (let index = 0; index < places.length; index += 5) {
    rows.push(places.slice(index, index + 5))
  }

  return rows
})

let ctx: gsap.Context | null = null

onMounted(() => {
  if (!stateData.value) return

  gsap.registerPlugin(ScrollTrigger)

  ctx = gsap.context(() => {

    gsap.from('.state-hero__heading', {
      opacity: 0,
      y: 30,
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.4
    })

    gsap.from('.state-hero__tagline', {
      opacity: 0,
      y: 20,
      duration: 1,
      ease: 'power3.out',
      delay: 0.6
    })

    gsap.from(
      '.country-intro__about, .country-intro__cta',
      {
        opacity: 0,
        y: 35,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: '.country-intro',
          start: 'top 78%'
        }
      }
    )

    gsap.from('.places-gallery__item', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.08,
      scrollTrigger: {
        trigger: '.places-gallery',
        start: 'top 78%'
      }
    })

    gsap.from(
      '.itineraries-section__header',
      {
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: '.itineraries-section',
          start: 'top 80%'
        }
      }
    )

    gsap.from('.itinerary-card', {
      opacity: 0,
      y: 35,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: {
        trigger: '.itineraries-section__grid',
        start: 'top 82%'
      }
    })

  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>


<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;


/* ==================================================
   PAGE
================================================== */

.state-itinerary-page {
  background: $color-ivory;
  color: $color-charcoal;
  min-height: 100svh;
}


/* ==================================================
   BACK BUTTON
================================================== */

.back-button {
  position: absolute;
  top: 40px;
  left: var(--page-padding, 40px);
  z-index: 100;

  display: flex;
  align-items: center;
  gap: 8px;

  color: $color-ivory;
  text-decoration: none;

  font-family: 'Manrope', sans-serif;
  font-weight: 500;
  font-size: 14px;

  text-transform: uppercase;
  letter-spacing: 0.1em;

  transition: transform $transition-fast;

  &:hover {
    transform: translateX(-5px);
  }
}


/* ==================================================
   HERO
================================================== */

.state-hero {
  position: relative;

  height: 70svh;
  min-height: 500px;

  display: flex;
  align-items: center;
  justify-content: center;

  text-align: center;

  color: $color-ivory-light;

  overflow: hidden;

  &__image-wrap {
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__overlay {
    position: absolute;
    inset: 0;

    background: linear-gradient(
      to bottom,
      rgba(10, 10, 8, 0.3) 0%,
      rgba(10, 10, 8, 0.7) 100%
    );
  }

  &__content {
    position: relative;
    z-index: 1;

    padding: 0 var(--page-padding);
    max-width: 800px;
  }

  &__eyebrow {
    margin-bottom: 24px;
    color: rgba($color-ivory, 0.9);
  }

  &__heading {
    margin: 0 0 16px 0;

    font-family: 'Bebas Neue', sans-serif;
    font-weight: 400;

    line-height: 0.9;
    letter-spacing: 0.02em;

    font-size: clamp(4.5rem, 8vw, 8rem);
  }

  &__tagline {
    font-family: 'Manrope', sans-serif;

    font-size: clamp(14px, 2vw, 18px);

    letter-spacing: 0.15em;
    text-transform: uppercase;

    color: rgba($color-sand, 0.9);
  }
}


/* ==================================================
   ABOUT + PLAN YOUR JOURNEY
================================================== */

.country-intro {
  padding:
    clamp(70px, 9vw, 120px)
    var(--page-padding);

  background: $color-ivory-light;

  &__container {
    max-width: $container-max;
    margin: 0 auto;

    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(320px, 0.8fr);

    gap: clamp(50px, 7vw, 100px);

    align-items: stretch;
  }

  &__about {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  &__eyebrow,
  &__cta-eyebrow {
    margin: 0 0 18px;

    font-family: 'Manrope', sans-serif;
    font-size: 11px;
    font-weight: 500;

    letter-spacing: 0.16em;
    text-transform: uppercase;

    color: $color-text-muted;
  }

  &__heading {
    margin: 0 0 24px;

    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2.5rem, 3.5vw, 3.5rem);
    font-weight: 400;

    line-height: 0.9;
    letter-spacing: 0.02em;

    color: $color-charcoal;
  }

  &__description {
    margin: 0;

    font-family: 'Manrope', sans-serif;
    font-size: var(--fs-body);
    font-weight: 400;

    line-height: 1.72;

    color: $color-text-muted;
  }

  &__cta {
    display: flex;
    align-items: stretch;

    border-left: 1px solid rgba($color-charcoal, 0.14);

    padding-left: clamp(30px, 5vw, 70px);
  }

  &__cta-inner {
    width: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;

    padding:
      clamp(34px, 4vw, 54px);

    background: $color-charcoal;
    color: $color-ivory-light;
  }

  &__cta-eyebrow {
    color: rgba($color-ivory-light, 0.65);
  }

  &__cta-heading {
    margin: 0;

    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3rem, 4.5vw, 4.5rem);
    font-weight: 400;

    line-height: 0.9;
    letter-spacing: 0.02em;

    color: $color-ivory-light;
  }

  &__cta-description {
    margin: 24px 0 0;

    font-family: 'Manrope', sans-serif;
    font-size: var(--fs-body);
    font-weight: 400;

    line-height: 1.7;

    color: rgba($color-ivory-light, 0.72);
  }

  &__cta-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    align-self: flex-start;

    gap: 16px;

    margin-top: 30px;
    padding: 14px 22px;

    border: 1px solid $color-ivory-light;
    border-radius: 0;

    background: $color-ivory-light;
    color: $color-charcoal;

    font-family: 'Manrope', sans-serif;
    font-size: 12px;
    font-weight: 500;

    letter-spacing: 0.12em;
    text-transform: uppercase;
    text-decoration: none;

    transition:
      background $transition-fast,
      color $transition-fast,
      border-color $transition-fast;

    :deep(svg) {
      width: 16px;
      height: 16px;
    }

    &:hover {
      background: transparent;
      color: $color-ivory-light;
      border-color: $color-ivory-light;
    }
  }
}


/* ==================================================
   PLACES ART GALLERY
================================================== */

.places-gallery {
  padding:
    clamp(90px, 10vw, 140px)
    var(--page-padding)
    clamp(100px, 12vw, 170px);

  background: $color-ivory;

  &__header {
    max-width: 800px;
    margin: 0 auto clamp(45px, 6vw, 75px);

    text-align: center;
  }

  &__eyebrow {
    margin: 0 0 18px;

    font-family: 'Manrope', sans-serif;
    font-size: 11px;
    font-weight: 500;

    letter-spacing: 0.16em;
    text-transform: uppercase;

    color: $color-text-muted;
  }

  &__heading {
    margin: 0;

    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2.5rem, 3.5vw, 3.5rem);
    font-weight: 400;

    line-height: 0.9;
    letter-spacing: 0.02em;

    color: $color-charcoal;
  }

  &__description {
    max-width: 620px;
    margin: 24px auto 0;

    font-family: 'Manrope', sans-serif;
    font-size: var(--fs-body);
    font-weight: 400;

    line-height: 1.7;

    color: $color-text-muted;
  }

  /*
   * Compact justified photography gallery.
   * Each row has one shared height and custom fractional
   * columns, so the widths vary without sizing images
   * individually.
   */
  &__grid {
    width: 100%;
    max-width: 1320px;

    margin: 0 auto;

    display: flex;
    flex-direction: column;

    gap: 4px;
  }

  &__row {
    width: 100%;

    display: grid;

    gap: 4px;

    grid-auto-rows: clamp(150px, 13vw, 210px);

    overflow: hidden;
  }

  &__row--0 {
    grid-template-columns:
      1.12fr
      0.92fr
      0.86fr
      0.96fr
      1.14fr;
  }

  &__row--1 {
    grid-template-columns:
      1.16fr
      0.9fr
      1fr
      0.84fr
      1.08fr;
  }

  &__row--2 {
    grid-template-columns:
      0.96fr
      1.08fr
      0.94fr
      0.84fr
      1.18fr;
  }

  &__row--count-1 {
    grid-template-columns: 1fr;
  }

  &__row--count-2 {
    grid-template-columns: 1.12fr 0.88fr;
  }

  &__row--count-3 {
    grid-template-columns: 1.1fr 0.9fr 1fr;
  }

  &__row--count-4 {
    grid-template-columns: 1.08fr 0.92fr 0.9fr 1.1fr;
  }

  &__item {
    position: relative;

    min-width: 0;
    min-height: 0;

    margin: 0;

    overflow: hidden;

    background: $color-charcoal;

    border: 0;

    cursor: default;
  }

  &__image-wrap {
    position: relative;

    width: 100%;
    height: 100%;

    overflow: hidden;
  }

  &__image {
    display: block;

    width: 100%;
    height: 100%;

    object-fit: cover;

    transition:
      transform $transition-fast,
      filter $transition-fast;
  }

  &__overlay {
    position: absolute;
    inset: 0;

    background:
      linear-gradient(
        180deg,
        rgba(7, 7, 6, 0.02) 25%,
        rgba(7, 7, 6, 0.18) 48%,
        rgba(7, 7, 6, 0.78) 100%
      );

    transition:
      background $transition-fast;
  }

  &__content {
    position: absolute;
    z-index: 2;
    inset: auto 0 0;

    display: flex;
    align-items: flex-end;
    justify-content: space-between;

    padding: clamp(16px, 1.8vw, 24px);

    border-top: 1px solid rgba($color-ivory-light, 0.18);
  }

  &__name {
    margin: 0;

    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2rem, 3vw, 3rem);
    font-weight: 400;

    line-height: 0.9;
    letter-spacing: 0.02em;

    color: $color-ivory-light;
  }

  &__item:hover {
    .places-gallery__image {
      transform: scale(1.045);
      filter: saturate(1.04);
    }

    .places-gallery__overlay {
      background:
        linear-gradient(
          180deg,
          rgba(7, 7, 6, 0.05) 20%,
          rgba(7, 7, 6, 0.28) 48%,
          rgba(7, 7, 6, 0.84) 100%
        );
    }
  }
}

/* ==================================================
   ITINERARIES
================================================== */

.itineraries-section {
  padding:
    clamp(90px, 10vw, 140px)
    var(--page-padding)
    clamp(100px, 12vw, 170px);

  background: $color-charcoal;
  color: $color-ivory-light;

  &--country {
    padding-top: 0;
  }

  &__header {
    max-width: 800px;
    margin: 0 auto clamp(45px, 6vw, 70px);

    text-align: center;
  }

  &__eyebrow {
    margin: 0 0 18px;

    font-family: 'Manrope', sans-serif;
    font-size: 11px;
    font-weight: 500;

    letter-spacing: 0.16em;
    text-transform: uppercase;

    color: rgba($color-ivory-light, 0.65);
  }

  &__heading {
    margin: 0;

    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2.5rem, 3.5vw, 3.5rem);
    font-weight: 400;

    line-height: 0.9;
    letter-spacing: 0.02em;

    color: $color-ivory-light;
  }

  &__description {
    max-width: 620px;
    margin: 24px auto 0;

    font-family: 'Manrope', sans-serif;
    font-size: var(--fs-body);
    font-weight: 400;

    line-height: 1.7;

    color: rgba($color-ivory-light, 0.72);
  }

  &__grid {
    width: 100%;
    max-width: 1180px;

    margin: 0 auto;

    display: grid;

    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 24px;
  }
}


.itinerary-card {
  min-width: 0;

  border:
    1px solid
    rgba($color-ivory-light, 0.18);

  background:
    rgba($color-ivory-light, 0.04);

  overflow: hidden;

  &__image {
    width: 100%;
    aspect-ratio: 16 / 9;

    overflow: hidden;

    background: $color-charcoal;

    img {
      display: block;

      width: 100%;
      height: 100%;

      object-fit: cover;

      transition: transform $transition-fast;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    padding: 30px;
  }

  &__meta {
    margin-bottom: 14px;

    font-family: 'Manrope', sans-serif;
    font-size: 11px;
    font-weight: 500;

    letter-spacing: 0.14em;
    text-transform: uppercase;

    color: rgba($color-ivory-light, 0.68);
  }

  &__title {
    margin: 0;

    font-family: 'Bebas Neue', sans-serif;
    font-size: 2.8rem;
    font-weight: 400;

    line-height: 0.9;
    letter-spacing: 0.02em;

    color: $color-ivory-light;
  }

  &__route {
    margin: 16px 0 0;

    font-family: 'Manrope', sans-serif;
    font-size: 13px;
    font-weight: 500;

    letter-spacing: 0.08em;
    text-transform: uppercase;

    color: $color-ivory-light;
  }

  &__description {
    margin: 16px 0 0;

    font-family: 'Manrope', sans-serif;
    font-size: var(--fs-body);
    font-weight: 400;

    line-height: 1.7;

    color: rgba($color-ivory-light, 0.72);
  }

  &__button {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    gap: 16px;

    margin-top: 26px;
    padding: 14px 22px;

    border: 1px solid $color-ivory-light;
    border-radius: 0;

    background: $color-ivory-light;
    color: $color-charcoal;

    font-family: 'Manrope', sans-serif;
    font-size: 12px;
    font-weight: 500;

    letter-spacing: 0.12em;
    text-transform: uppercase;
    text-decoration: none;

    transition:
      background $transition-fast,
      color $transition-fast,
      border-color $transition-fast;

    :deep(svg) {
      width: 16px;
      height: 16px;
    }

    &:hover {
      background: transparent;
      color: $color-ivory-light;
      border-color: $color-ivory-light;
    }
  }

  &:hover {
    .itinerary-card__image img {
      transform: scale(1.03);
    }
  }
}


/* ==================================================
   NOT FOUND
================================================== */

.not-found {
  display: flex;
  align-items: center;
  justify-content: center;

  &__content {
    text-align: center;
    padding: 0 20px;

    .heading-lg {
      font-family: 'Bebas Neue', sans-serif;
      margin-bottom: 32px;
    }

    .btn-primary {
      width: auto;
      padding: 16px 32px;
    }
  }
}


/* ==================================================
   RESPONSIVE
================================================== */

@media (max-width: 900px) {
  .country-intro {
    &__container {
      grid-template-columns: 1fr;
      gap: 50px;
    }

    &__cta {
      border-left: 0;
      border-top: 1px solid rgba($color-charcoal, 0.14);
      padding-left: 0;
      padding-top: 30px;
    }
  }

  .places-gallery {
    &__row {
      grid-auto-rows: 180px;
    }
  }

  .itineraries-section {
    &__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
}

@media (max-width: 640px) {
  .state-hero {
    min-height: 520px;
  }

  .country-intro {
    padding-top: 70px;

    &__cta-inner {
      padding: 30px 24px;
    }

    &__cta-button {
      width: 100%;
    }
  }

  .places-gallery {
    padding-top: 80px;

    &__grid {
      gap: 4px;
    }

    &__row {
      grid-auto-rows: 145px;
      gap: 4px;
    }

    &__content {
      padding: 16px;
    }
  }

  .itineraries-section {
    padding-top: 80px;

    &--country {
      padding-top: 0;
    }

    &__grid {
      grid-template-columns: 1fr;
    }

    .itinerary-card__content {
      padding: 24px;
    }

    .itinerary-card__button {
      width: 100%;
    }
  }
}
</style>
