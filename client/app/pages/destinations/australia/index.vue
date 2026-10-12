<template>
  <main class="continent-page">

    <!-- ==================================================
         HERO
    =================================================== -->

    <section class="continent-hero">

      <!-- NAVBAR ABOVE THE HERO IMAGE -->
      <SiteHeader />

      <!-- FULLSCREEN AUSTRALIA IMAGE -->
      <div class="continent-hero__image">
        <img
          src="/images/destinations/australia.jpg"
          alt="Australia"
        />
      </div>

      <!-- DARK OVERLAY -->
      <div class="continent-hero__overlay"></div>

      <!-- HERO CONTENT -->
      <div class="continent-hero__content">

        <h1 class="continent-hero__heading">
          <span>AUSTRALIA</span>
        </h1>

        <p class="continent-hero__description">
          A tapestry of history, art, and romantic landscapes.
          Explore our curated experiences across the iconic
          countries of Australia.
        </p>

      </div>

    </section>


    <!-- ==================================================
         ABOUT AUSTRALIA + PLAN YOUR JOURNEY
    =================================================== -->

    <section class="journey-cta">

      <div class="journey-cta__container">

        <div class="journey-cta__about">

          <p class="journey-cta__eyebrow">
            DISCOVER AUSTRALIA
          </p>

          <h2 class="journey-cta__heading">
            About Australia
          </h2>

          <p class="journey-cta__description">
            A tapestry of history, art, and romantic landscapes.
            Explore our curated experiences across the iconic
            countries of Australia.
          </p>

        </div>

        <aside class="journey-cta__cta">

          <div class="journey-cta__cta-inner">

            <p class="journey-cta__cta-eyebrow">
              YOUR JOURNEY, YOUR WAY
            </p>

            <h3 class="journey-cta__cta-heading">
              Plan Your Journey
            </h3>

            <p class="journey-cta__cta-description">
              Let us help you create a journey through Australia
              designed around your interests and pace.
            </p>

            <NuxtLink
              to="/contact"
              class="journey-cta__button"
            >
              <span>Plan Your Journey</span>
              <Icon name="lucide:arrow-right" />
            </NuxtLink>

          </div>

        </aside>

      </div>

    </section>


    <!-- ==================================================
         AUSTRALIAAN COUNTRIES
         Static data for now — will be replaced by Vendure.
    =================================================== -->

    <section
      class="countries-section"
      ref="countriesSection"
    >

      <div class="countries-section__header">

        <p class="countries-section__eyebrow">
          DISCOVER AUSTRALIA
        </p>

        <h2 class="countries-section__heading">
          Explore Australiaan Countries
        </h2>

        <p class="countries-section__description">
          Discover the diverse cultures, landscapes and
          experiences across Australia.
        </p>

      </div>

      <div class="countries-slider">

        <button
          class="countries-slider__control countries-slider__control--prev"
          type="button"
          aria-label="Previous country"
          @click="previousCountry"
        >
          <Icon name="lucide:arrow-left" />
        </button>

        <div
          ref="countriesViewport"
          class="countries-slider__viewport"
        >
          <div
            class="countries-slider__track"
            :style="countryTrackStyle"
          >

            <NuxtLink
              v-for="(country, index) in infiniteCountries"
              :key="`${country.slug || country.id || country.name || 'country'}-${index}`"
              :to="countryPath(country)"
              class="country-card"
            >
              <div class="country-card__image">
                <img
                  :src="countryImage(country)"
                  :alt="country.name"
                />
              </div>

              <div class="country-card__overlay"></div>

              <div class="country-card__content">
                <span class="country-card__name">
                  {{ country.name }}
                </span>

                <span class="country-card__explore">
                  Explore
                  <Icon name="lucide:arrow-right" />
                </span>
              </div>
            </NuxtLink>

          </div>
        </div>

        <button
          class="countries-slider__control countries-slider__control--next"
          type="button"
          aria-label="Next country"
          @click="nextCountry"
        >
          <Icon name="lucide:arrow-right" />
        </button>

      </div>

    </section>


    <!-- ==================================================
         AUSTRALIA ITINERARIES
         Static UI for now — will be replaced by Vendure.
    =================================================== -->

    <section class="itineraries-section">

      <div class="itineraries-section__header">

        <p class="itineraries-section__eyebrow">
          CURATED JOURNEYS
        </p>

        <h2 class="itineraries-section__heading">
          Suggested Australia Tours
        </h2>

        <p class="itineraries-section__description">
          Thoughtfully planned journeys designed to help
          you experience the best of Australia.
        </p>

      </div>

      <div class="itineraries-slider">

        <button
          class="itineraries-slider__control itineraries-slider__control--prev"
          type="button"
          aria-label="Previous itinerary"
          @click="previousItinerary"
        >
          <Icon name="lucide:arrow-left" />
        </button>

        <div
          ref="itinerariesViewport"
          class="itineraries-slider__viewport"
        >
          <div
            class="itineraries-slider__track"
            :style="itineraryTrackStyle"
          >

            <article
              v-for="(itinerary, index) in infiniteItineraries"
              :key="`${itinerary.id}-${index}`"
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
        </div>

        <button
          class="itineraries-slider__control itineraries-slider__control--next"
          type="button"
          aria-label="Next itinerary"
          @click="nextItinerary"
        >
          <Icon name="lucide:arrow-right" />
        </button>

      </div>

    </section>

  </main>
</template>


<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import SiteHeader from '~/components/layout/SiteHeader.vue'
import { australiaData as statesData } from '~/data/australiaData'

const states = statesData

const countriesViewport = ref<HTMLElement | null>(null)
const countrySlidesPerView = ref(4)
const currentCountryIndex = ref(0)
const isCountryAnimating = ref(false)

const itinerariesViewport = ref<HTMLElement | null>(null)
const slidesPerView = ref(3)
const currentItineraryIndex = ref(0)
const isItineraryAnimating = ref(false)

const countryGap = computed(() => {
  if (typeof window === 'undefined') return 18
  return window.innerWidth <= 640 ? 14 : 18
})

const infiniteCountries = computed(() => [
  ...states,
  ...states,
  ...states
])

const countryTrackStyle = computed(() => {
  const viewportWidth = countriesViewport.value?.clientWidth || 0
  const gap = countryGap.value
  const cardWidth =
    (viewportWidth - gap * (countrySlidesPerView.value - 1)) /
    countrySlidesPerView.value

  const step = cardWidth + gap

  return {
    '--country-gap': `${gap}px`,
    '--country-card-width': `${cardWidth}px`,
    transform: `translate3d(${-currentCountryIndex.value * step}px, 0, 0)`,
    transition: isCountryAnimating.value
      ? 'transform 450ms cubic-bezier(0.22, 1, 0.36, 1)'
      : 'none'
  }
})

const updateCountrySlidesPerView = () => {
  if (typeof window === 'undefined') return

  if (window.innerWidth <= 640) {
    countrySlidesPerView.value = 1
  } else if (window.innerWidth <= 900) {
    countrySlidesPerView.value = 2
  } else {
    countrySlidesPerView.value = 4
  }

  currentCountryIndex.value = states.length

  requestAnimationFrame(() => {
    isCountryAnimating.value = false
  })
}

const nextCountry = () => {
  if (isCountryAnimating.value) return

  isCountryAnimating.value = true
  currentCountryIndex.value += 1

  window.setTimeout(() => {
    if (currentCountryIndex.value >= states.length * 2) {
      currentCountryIndex.value -= states.length
    }

    isCountryAnimating.value = false
  }, 450)
}

const previousCountry = () => {
  if (isCountryAnimating.value) return

  isCountryAnimating.value = true
  currentCountryIndex.value -= 1

  window.setTimeout(() => {
    if (currentCountryIndex.value < states.length) {
      currentCountryIndex.value += states.length
    }

    isCountryAnimating.value = false
  }, 450)
}

const itineraryGap = computed(() => {
  if (typeof window === 'undefined') return 24
  return window.innerWidth <= 640 ? 16 : 24
})

const infiniteItineraries = computed(() => [
  ...itineraries,
  ...itineraries,
  ...itineraries
])

const itineraryTrackStyle = computed(() => {
  const viewportWidth = itinerariesViewport.value?.clientWidth || 0
  const gap = itineraryGap.value
  const cardWidth =
    slidesPerView.value === 1
      ? viewportWidth
      : (viewportWidth - gap * (slidesPerView.value - 1)) /
        slidesPerView.value

  const step = cardWidth + gap

  return {
    '--itinerary-gap': `${gap}px`,
    '--itinerary-card-width': `${cardWidth}px`,
    transform: `translate3d(${-currentItineraryIndex.value * step}px, 0, 0)`,
    transition: isItineraryAnimating.value
      ? 'transform 450ms cubic-bezier(0.22, 1, 0.36, 1)'
      : 'none'
  }
})

const updateSlidesPerView = () => {
  if (typeof window === 'undefined') return

  if (window.innerWidth <= 640) {
    slidesPerView.value = 1
  } else if (window.innerWidth <= 900) {
    slidesPerView.value = 2
  } else {
    slidesPerView.value = 3
  }

  // Keep the slider in the middle copy so it can move infinitely
  // in either direction.
  currentItineraryIndex.value = itineraries.length

  requestAnimationFrame(() => {
    isItineraryAnimating.value = false
  })
}

const nextItinerary = () => {
  if (isItineraryAnimating.value) return

  isItineraryAnimating.value = true
  currentItineraryIndex.value += 1

  window.setTimeout(() => {
    if (currentItineraryIndex.value >= itineraries.length * 2) {
      // Jump silently to the same position in the middle copy.
      currentItineraryIndex.value -= itineraries.length
    }

    isItineraryAnimating.value = false
  }, 450)
}

const previousItinerary = () => {
  if (isItineraryAnimating.value) return

  isItineraryAnimating.value = true
  currentItineraryIndex.value -= 1

  window.setTimeout(() => {
    if (currentItineraryIndex.value < itineraries.length) {
      // Jump silently to the equivalent position in the middle copy.
      currentItineraryIndex.value += itineraries.length
    }

    isItineraryAnimating.value = false
  }, 450)
}

const countryImage = (country: any) =>
  country.image ||
  country.heroImage ||
  country.imageUrl ||
  country.coverImage ||
  '/images/destinations/australia.jpg'

const countryPath = (country: any) =>
  `/destinations/australia/${country.slug || String(country.name).toLowerCase().replace(/\\s+/g, '-')}`

/*
 * Static itinerary data for the UI phase.
 * This will later come directly from Vendure.
 */
const itineraries = [
  {
    id: 'australiaan-highlights',
    title: 'Australiaan Highlights',
    nights: 5,
    days: 4,
    route: 'Spain · France · Italy',
    description:
      'Experience some of Australia’s most iconic destinations through a thoughtfully planned journey.',
    image: '/images/destinations/australia.jpg',
    to: '/destinations/australia/itineraries/australiaan-highlights'
  },
  {
    id: 'mediterranean-escape',
    title: 'Mediterranean Escape',
    nights: 7,
    days: 6,
    route: 'Spain · Italy · Greece',
    description:
      'Discover beautiful Mediterranean destinations, historic cities and unforgettable landscapes.',
    image: '/images/destinations/australia.jpg',
    to: '/destinations/australia/itineraries/mediterranean-escape'
  },
  {
    id: 'alpine-australia',
    title: 'Alpine Australia',
    nights: 6,
    days: 5,
    route: 'Switzerland · Austria · France',
    description:
      'Travel through dramatic alpine landscapes, charming cities and timeless Australiaan scenery.',
    image: '/images/destinations/australia.jpg',
    to: '/destinations/australia/itineraries/alpine-australia'
  },
  {
    id: 'northern-australia',
    title: 'Northern Australia',
    nights: 8,
    days: 7,
    route: 'Norway · Finland · Iceland',
    description:
      'Discover the northern landscapes, coastal cities and unforgettable natural experiences of Australia.',
    image: '/images/destinations/australia.jpg',
    to: '/destinations/australia/itineraries/northern-australia'
  }
]

let ctx: gsap.Context | null = null

onMounted(() => {
  updateCountrySlidesPerView()
  updateSlidesPerView()

  window.addEventListener('resize', updateCountrySlidesPerView)
  window.addEventListener('resize', updateSlidesPerView)

  gsap.registerPlugin(ScrollTrigger)

  ctx = gsap.context(() => {

    // Hero entrance
    gsap.from('.continent-hero__heading', {
      opacity: 0,
      y: 30,
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.3
    })

    gsap.from('.continent-hero__description', {
      opacity: 0,
      y: 30,
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.5
    })

    // Section entrances
    gsap.from(
      '.journey-cta__about, .journey-cta__cta, .countries-section__header, .itineraries-section__header',
      {
        opacity: 0,
        y: 35,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: '.journey-cta',
          start: 'top 82%'
        }
      }
    )

    gsap.from('.itinerary-card', {
      opacity: 0,
      y: 40,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: {
        trigger: '.itineraries-slider',
        start: 'top 82%'
      }
    })

  })
})

onUnmounted(() => {
  window.removeEventListener('resize', updateCountrySlidesPerView)
  window.removeEventListener('resize', updateSlidesPerView)
  ctx?.revert()
})
</script>


<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;


/* ==================================================
   PAGE
================================================== */

.continent-page {
  background: $color-ivory;
  color: $color-charcoal;
  min-height: 100svh;
}


/* ==================================================
   HERO
================================================== */

.continent-hero {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100svh;
  min-height: 680px;

  overflow: hidden;

  background: $color-charcoal;
  color: $color-ivory-light;

  isolation: isolate;


  :deep(.site-header) {
    position: absolute;
    z-index: $z-content;
    top: 0;
    right: 0;
    left: 0;
  }


  &__image {
    position: absolute;
    z-index: $z-video;
    inset: 0;

    width: 100%;
    height: 100%;

    overflow: hidden;

    img {
      display: block;

      width: 100%;
      height: 100%;

      object-fit: cover;
      object-position: center;

      transform: scale(1.01);
    }
  }


  &__overlay {
    position: absolute;
    z-index: $z-overlay;
    inset: 0;

    background: rgba(7, 7, 6, 0.58);

    pointer-events: none;
  }


  &__content {
    position: relative;
    z-index: $z-content;

    width: 100%;
    max-width: 1100px;

    margin-inline: auto;

    padding:
      120px
      var(--page-padding)
      80px;

    text-align: center;
  }


  &__heading {
    margin: 0;

    font-family:
      'Bebas Neue',
      sans-serif;

    font-size:
      clamp(
        4.5rem,
        9vw,
        9.5rem
      );

    font-weight: 400;

    line-height: 0.82;

    letter-spacing: 0.02em;

    color: #fff;

    span {
      color: #fff;
    }
  }


  &__description {
    max-width: 620px;

    margin:
      42px
      auto
      0;

    font-family:
      'Manrope',
      sans-serif;

    font-size:
      var(--fs-body);

    font-weight: 400;

    line-height: 1.7;

    color: #fff;
  }
}


/* ==================================================
   ABOUT AUSTRALIA + PLAN YOUR JOURNEY
================================================== */

.journey-cta {
  padding:
    clamp(70px, 9vw, 120px)
    var(--page-padding);

  background: $color-ivory-light;

  &__container {
    max-width: $container-max;
    margin: 0 auto;

    display: grid;
    grid-template-columns:
      minmax(0, 1fr)
      minmax(320px, 0.8fr);

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

  &__button {
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
   COUNTRIES
================================================== */

.countries-section {
  padding:
    clamp(90px, 10vw, 140px)
    var(--page-padding)
    clamp(100px, 12vw, 170px);

  &__header {
    width: 100%;
    max-width: 760px;

    margin:
      0
      auto
      clamp(48px, 6vw, 72px);

    text-align: center;
  }

  &__eyebrow {
    margin: 0 0 18px;

    font-family:
      'Manrope',
      sans-serif;

    font-size: 11px;

    font-weight: 500;

    letter-spacing: 0.16em;

    text-transform: uppercase;

    color: $color-text-muted;
  }

  &__heading {
    margin: 0;

    font-family:
      'Bebas Neue',
      sans-serif;

    font-size:
      clamp(
        3.5rem,
        6vw,
        6rem
      );

    font-weight: 400;

    line-height: 0.9;

    letter-spacing: 0.02em;

    color: $color-charcoal;
  }

  &__description {
    max-width: 620px;

    margin:
      24px
      auto
      0;

    font-family:
      'Manrope',
      sans-serif;

    font-size:
      var(--fs-body);

    font-weight: 400;

    line-height: 1.7;

    color: $color-text-muted;
  }

  &__grid {
    width: 100%;
  }
}

.countries-slider {
  position: relative;

  width: 100%;
  max-width: 1180px;

  margin-inline: auto;

  display: grid;

  grid-template-columns: 42px minmax(0, 1fr) 42px;

  align-items: center;

  gap: 18px;

  &__viewport {
    width: 100%;

    overflow: hidden;
  }

  &__track {
    display: flex;

    --country-gap: 18px;
    --country-card-width: calc((100% - 54px) / 4);

    gap: var(--country-gap);

    width: 100%;

    will-change: transform;
  }

  &__control {
    width: 42px;
    height: 42px;

    display: grid;
    place-items: center;

    flex-shrink: 0;

    border: 1px solid rgba($color-charcoal, 0.32);
    border-radius: 0;

    background: transparent;
    color: $color-charcoal;

    cursor: pointer;

    transition:
      background $transition-fast,
      color $transition-fast,
      border-color $transition-fast;

    :deep(svg) {
      width: 16px;
      height: 16px;
    }

    &:hover {
      background: $color-charcoal;
      color: $color-ivory-light;
      border-color: $color-charcoal;
    }
  }
}

.country-card {
  position: relative;

  flex: 0 0 var(--country-card-width);

  min-width: 0;

  aspect-ratio: 1 / 1;

  overflow: hidden;

  color: $color-ivory-light;

  text-decoration: none;

  background: $color-charcoal;

  &__image,
  &__overlay {
    position: absolute;
    inset: 0;
  }

  &__image {
    overflow: hidden;

    img {
      display: block;

      width: 100%;
      height: 100%;

      object-fit: cover;
      object-position: center;

      transition: transform $transition-fast;
    }
  }

  &__overlay {
    background: rgba(7, 7, 6, 0.28);
    transition: background $transition-fast;
  }

  &__content {
    position: relative;
    z-index: 2;

    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: space-between;

    width: 100%;
    height: 100%;

    padding: 26px;
  }

  &__name {
    align-self: flex-start;

    font-family: 'Bebas Neue', sans-serif;
    font-size: 2.8rem;
    font-weight: 400;
    line-height: 0.9;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    color: #fff;
  }

  &__explore {
    display: inline-flex;
    align-items: center;
    align-self: flex-end;

    gap: 10px;

    flex-shrink: 0;

    font-family: 'Manrope', sans-serif;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #fff;

    :deep(svg) {
      width: 14px;
      height: 14px;
    }
  }

  &:hover {
    .country-card__image img {
      transform: scale(1.04);
    }

    .country-card__overlay {
      background: rgba(7, 7, 6, 0.42);
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

  &__header {
    width: 100%;
    max-width: 760px;

    margin:
      0
      auto
      clamp(48px, 6vw, 72px);

    text-align: center;
  }

  &__eyebrow {
    margin: 0 0 18px;

    font-family:
      'Manrope',
      sans-serif;

    font-size: 11px;

    font-weight: 500;

    letter-spacing: 0.16em;

    text-transform: uppercase;

    color: rgba($color-ivory-light, 0.68);
  }

  &__heading {
    margin: 0;

    font-family:
      'Bebas Neue',
      sans-serif;

    font-size:
      clamp(
        3.5rem,
        6vw,
        6rem
      );

    font-weight: 400;

    line-height: 0.9;

    letter-spacing: 0.02em;

    color: $color-ivory-light;
  }

  &__description {
    max-width: 620px;

    margin:
      24px
      auto
      0;

    font-family:
      'Manrope',
      sans-serif;

    font-size:
      var(--fs-body);

    font-weight: 400;

    line-height: 1.7;

    color: rgba($color-ivory-light, 0.72);
  }

  &__list {
    width: 100%;
  }
}

.itineraries-slider {
  position: relative;

  width: 100%;
  max-width: 1180px;

  margin-inline: auto;

  display: grid;

  grid-template-columns: 42px minmax(0, 1fr) 42px;

  align-items: center;

  gap: 18px;

  &__viewport {
    width: 100%;

    overflow: hidden;
  }

  &__track {
    display: flex;

    --itinerary-gap: 24px;
    --itinerary-card-width: calc((100% - 48px) / 3);

    gap: var(--itinerary-gap);

    width: 100%;

    transition: transform 450ms cubic-bezier(0.22, 1, 0.36, 1);

    will-change: transform;
  }

  &__control {
    width: 42px;
    height: 42px;

    display: grid;
    place-items: center;

    flex-shrink: 0;

    border: 1px solid rgba($color-ivory-light, 0.32);
    border-radius: 0;

    background: transparent;
    color: $color-ivory-light;

    cursor: pointer;

    transition:
      background $transition-fast,
      color $transition-fast,
      border-color $transition-fast;

    :deep(svg) {
      width: 16px;
      height: 16px;
    }

    &:hover {
      background: $color-ivory-light;
      color: $color-charcoal;
      border-color: $color-ivory-light;
    }
  }
}

/* ==================================================
   ITINERARY CARD
================================================== */

.itinerary-card {
  flex: 0 0 var(--itinerary-card-width);

  min-width: 0;

  min-height: 470px;

  display: flex;

  flex-direction: column;

  border:
    1px solid
    rgba($color-ivory-light, 0.18);

  background:
    rgba($color-ivory-light, 0.04);

  overflow: hidden;


  &__image {
    height: 190px;

    flex-shrink: 0;

    overflow: hidden;

    background: $color-charcoal;

    img {
      display: block;

      width: 100%;
      height: 100%;

      object-fit: cover;

      object-position: center;

      transition:
        transform $transition-fast;
    }
  }


  &__content {
    display: flex;

    flex: 1;

    flex-direction: column;

    justify-content: center;

    align-items: flex-start;

    padding:
      clamp(26px, 3vw, 38px);
  }


  &__meta {
    margin-bottom: 18px;

    font-family:
      'Manrope',
      sans-serif;

    font-size: 11px;

    font-weight: 500;

    letter-spacing: 0.14em;

    text-transform: uppercase;

    color: rgba($color-ivory-light, 0.68);
  }


  &__title {
    margin: 0;

    font-family:
      'Bebas Neue',
      sans-serif;

    font-size:
      clamp(
        2.8rem,
        4vw,
        4.5rem
      );

    font-weight: 400;

    line-height: 0.9;

    letter-spacing: 0.02em;

    color: $color-ivory-light;
  }


  &__route {
    margin: 20px 0 0;

    font-family:
      'Manrope',
      sans-serif;

    font-size: 13px;

    font-weight: 500;

    letter-spacing: 0.08em;

    text-transform: uppercase;

    color: $color-ivory-light;
  }


  &__description {
    max-width: 560px;

    margin: 18px 0 0;

    font-family:
      'Manrope',
      sans-serif;

    font-size:
      var(--fs-body);

    font-weight: 400;

    line-height: 1.7;

    color: rgba($color-ivory-light, 0.72);
  }


  &__button {
    display: inline-flex;

    align-items: center;
    justify-content: center;

    gap: 16px;

    margin-top: 30px;

    padding: 14px 22px;

    border:
      1px solid
      $color-ivory-light;

    border-radius: 0;

    background: $color-ivory-light;

    color: $color-charcoal;

    font-family:
      'Manrope',
      sans-serif;

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
   RESPONSIVE
================================================== */

@media (max-width: 900px) {
  .journey-cta {
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


  .countries-slider {
    grid-template-columns: 36px minmax(0, 1fr) 36px;
    gap: 12px;

    &__control {
      width: 36px;
      height: 36px;

      :deep(svg) {
        width: 14px;
        height: 14px;
      }
    }
  }

  .itinerary-card {
    flex-basis: var(--itinerary-card-width);
  }
}


@media (max-width: 640px) {
  .journey-cta {
    padding-top: 70px;

    &__cta-inner {
      padding: 30px 24px;
    }

    &__button {
      width: 100%;
    }
  }


  .continent-hero {
    min-height: 620px;

    &__content {
      padding:
        100px
        var(--page-padding)
        60px;
    }
  }

  .journey-cta {
    &__button {
      width: 100%;
      max-width: 320px;
    }
  }

  .countries-section {
    padding-bottom: 90px;
  }

  .countries-slider {
    grid-template-columns: 36px minmax(0, 1fr) 36px;
    gap: 10px;

    &__track {
      gap: 14px;
    }

    &__control {
      width: 36px;
      height: 36px;

      :deep(svg) {
        width: 14px;
        height: 14px;
      }
    }
  }

  .country-card__content {
    padding: 22px;
  }

  .itineraries-section {
    padding-top: 80px;
  }

  .itineraries-slider {
    grid-template-columns: 36px minmax(0, 1fr) 36px;
    gap: 10px;

    &__track {
      gap: 16px;
    }

    &__control {
      width: 36px;
      height: 36px;

      :deep(svg) {
        width: 14px;
        height: 14px;
      }
    }
  }

  .itinerary-card {
    flex-basis: var(--itinerary-card-width);

    &__image {
      height: 220px;
    }

    &__content {
      padding: 30px 24px;
    }

    &__button {
      width: 100%;
    }
  }
}
</style>
