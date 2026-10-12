<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface Journey {
  title: string
  slug: string
  region: string
  duration: string
  route: string
  image: string
}

const journeys: Journey[] = [
  {
    title: 'Europe',
    slug: 'europe',
    region: 'Europe',
    duration: '',
    route: '',
    image: '/images/destinations/europe.jpg'
  },
  {
    title: 'South Africa',
    slug: 'south-africa',
    region: 'South Africa',
    duration: '',
    route: '',
    image: '/images/destinations/south-africa.jpg'
  },
  {
    title: 'Asia',
    slug: 'asia',
    region: 'Asia',
    duration: '',
    route: '',
    image: '/images/destinations/asia.jpg'
  },
  {
    title: 'South America',
    slug: 'south-america',
    region: 'South America',
    duration: '',
    route: '',
    image: '/images/destinations/south-america.jpg'
  }
]

const sectionRef = ref<HTMLElement | null>(null)

let ctx: gsap.Context | null = null
let mm: gsap.MatchMedia | null = null

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)

  if (!sectionRef.value) return

  ctx = gsap.context(() => {
    mm = gsap.matchMedia()

    /* ======================================================== */
    /* DESKTOP */
    /* ======================================================== */

    mm.add('(min-width: 769px)', () => {
      if (!sectionRef.value) return

      /* ------------------------------------------------------ */
      /* HEADER */
      /* ------------------------------------------------------ */

      gsap.set('.journeys__eyebrow', {
        opacity: 0,
        y: 20
      })

      /* Each word starts completely below its masked line. */
      /* The parent line clips the word so it feels like it is */
      /* sliding out from behind a curtain. */
      gsap.set('.journeys__heading-text', {
        yPercent: 110
      })

      gsap.set('.journeys__intro', {
        opacity: 0,
        y: 25
      })

      gsap.set('.journeys__all', {
        opacity: 0,
        y: 18
      })

      const headerTimeline = gsap.timeline({
        scrollTrigger: {
          /* Trigger from the heading itself rather than the whole */
          /* section, so the animation waits until the typography */
          /* is properly on screen. */
          trigger: sectionRef.value.querySelector('.journeys__heading'),
          start: 'top 55%',
          end: 'bottom 45%',
          toggleActions: 'play none none reverse'
        }
      })

      headerTimeline
        .to(
          '.journeys__eyebrow',
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: 'power3.out'
          },
          0
        )
        .to(
          '.journeys__heading-text',
          {
            yPercent: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: 'power4.out'
          },
          0.08
        )
        .to(
          '.journeys__intro',
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out'
          },
          0.3
        )
        .to(
          '.journeys__all',
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: 'power3.out'
          },
          0.42
        )

      /* ------------------------------------------------------ */
      /* JOURNEY CARDS */
      /* ------------------------------------------------------ */

      const cards =
        sectionRef.value.querySelectorAll<HTMLElement>(
          '.journeys__card'
        )

      cards.forEach((card, index) => {
        const visual =
          card.querySelector<HTMLElement>(
            '.journeys__visual'
          )

        const image =
          card.querySelector<HTMLElement>(
            '.journeys__image'
          )

        const content =
          card.querySelector<HTMLElement>(
            '.journeys__card-content'
          )

        if (!visual || !image || !content) return

        const fromLeft = index % 2 === 0

        gsap.set(visual, {
          clipPath: fromLeft
            ? 'inset(0 100% 0 0)'
            : 'inset(0 0 0 100%)'
        })

        gsap.set(image, {
          scale: 1.12,
          xPercent: fromLeft ? -5 : 5
        })

        gsap.set(content, {
          opacity: 0,
          y: 28
        })

        const cardTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: 'top 82%',
            toggleActions: 'play none none reverse'
          }
        })

        cardTimeline
          .to(
            visual,
            {
              clipPath: 'inset(0 0% 0 0%)',
              duration: 1.15,
              ease: 'power3.inOut'
            },
            0
          )
          .to(
            image,
            {
              scale: 1,
              xPercent: 0,
              duration: 1.35,
              ease: 'power3.out'
            },
            0
          )
          .to(
            content,
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: 'power3.out'
            },
            0.5
          )

        /* ---------------------------------------------------- */
        /* SUBTLE PARALLAX */
        /* ---------------------------------------------------- */

        gsap.fromTo(
          image,
          {
            yPercent: -3
          },
          {
            yPercent: 3,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2
            }
          }
        )
      })

      return () => {
        headerTimeline.kill()
      }
    })

    /* ======================================================== */
    /* MOBILE */
    /* ======================================================== */

    mm.add('(max-width: 768px)', () => {
      if (!sectionRef.value) return

      const headerTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.value.querySelector('.journeys__heading'),
          start: 'top 65%',
          end: 'bottom 45%',
          toggleActions: 'play none none reverse'
        }
      })

      headerTimeline
        .from('.journeys__eyebrow', {
          opacity: 0,
          y: 18,
          duration: 0.5,
          ease: 'power3.out'
        })
        .from(
          '.journeys__heading-text',
          {
            yPercent: 110,
            duration: 0.8,
            stagger: 0.10,
            ease: 'power4.out'
          },
          0.05
        )
        .from(
          '.journeys__intro',
          {
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: 'power3.out'
          },
          0.25
        )

      const cards =
        sectionRef.value.querySelectorAll<HTMLElement>(
          '.journeys__card'
        )

      cards.forEach((card) => {
        const visual =
          card.querySelector<HTMLElement>(
            '.journeys__visual'
          )

        const image =
          card.querySelector<HTMLElement>(
            '.journeys__image'
          )

        const content =
          card.querySelector<HTMLElement>(
            '.journeys__card-content'
          )

        if (!visual || !image || !content) return

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            once: true
          }
        })

        timeline
          .from(
            visual,
            {
              clipPath: 'inset(0 100% 0 0)',
              duration: 0.95,
              ease: 'power3.inOut'
            },
            0
          )
          .from(
            image,
            {
              scale: 1.1,
              duration: 1.1,
              ease: 'power3.out'
            },
            0
          )
          .from(
            content,
            {
              opacity: 0,
              y: 24,
              duration: 0.6,
              ease: 'power3.out'
            },
            0.4
          )
      })

      return () => {
        headerTimeline.kill()
      }
    })
  }, sectionRef.value)
})

onBeforeUnmount(() => {
  mm?.revert()
  ctx?.revert()
})
</script>

<template>
  <section ref="sectionRef" class="journeys">
    <div class="journeys__inner">

      <section class="journeys__india">

        <!-- LEFT: INDIA DETAILS -->
        <div class="journeys__india-details">

          <p class="journeys__india-label">
            THE SOUL OF INDIA
          </p>

          <div class="journeys__india-copy">

            <p class="journeys__india-description">
              India is a journey through ancient traditions,
              living cultures, sacred landscapes and stories
              that have travelled through generations. From
              timeless cities and spiritual places to rich
              flavours, vibrant communities and extraordinary
              experiences, every journey reveals another side
              of the country.
            </p>

            <p class="journeys__india-description">
              Discover India beyond the familiar — thoughtfully,
              slowly and through experiences that bring you
              closer to its people, places and heritage.
            </p>

          </div>

          <NuxtLink to="/destinations/asia/india" class="journeys__india-cta">
            <span>EXPLORE INDIA</span>
            <Icon name="lucide:arrow-right" />
          </NuxtLink>

        </div>


        <!-- RIGHT: VIDEO + BIG TYPOGRAPHY -->
        <div class="journeys__india-visual">

          <video class="journeys__india-video" autoplay muted loop playsinline preload="metadata" aria-hidden="true">
            <source src="/videos/hero.mp4" type="video/mp4">
          </video>

          <div class="journeys__india-video-overlay" />

          <div class="journeys__india-heading">

            <span class="journeys__india-heading-line">
              <span class="journeys__india-heading-text">
                LET'S
              </span>
            </span>

            <span class="journeys__india-heading-line">
              <span class="journeys__india-heading-text">
                EXPERIENCE
              </span>
            </span>

            <span class="journeys__india-heading-line">
              <span class="journeys__india-heading-text">
                INDIA,
              </span>
            </span>

            <span class="journeys__india-heading-line">
              <span class="journeys__india-heading-text">
                BEYOND
              </span>
            </span>

            <span class="journeys__india-heading-line">
              <span class="journeys__india-heading-text">
                THE ORDINARY.
              </span>
            </span>

          </div>

        </div>

      </section>

      <div class="journeys__layout">

        <!-- LEFT: SECTION HEADING -->
        <header class="journeys__header">
          <h2 class="journeys__heading heading-xl">
            <span class="journeys__heading-line">
              <span class="journeys__heading-text">
                LET'S
              </span>
            </span>

            <span class="journeys__heading-line">
              <span class="journeys__heading-text">
                MAKE
              </span>
            </span>

            <span class="journeys__heading-line">
              <span class="journeys__heading-text">
                SOMETHING
              </span>
            </span>

            <span class="journeys__heading-line">
              <span class="journeys__heading-text">
                GREAT
              </span>
            </span>

            <span class="journeys__heading-line">
              <span class="journeys__heading-text">
                TOGETHER!
              </span>
            </span>
          </h2>
        </header>

        <!-- RIGHT: DESTINATION CARDS -->
        <div class="journeys__grid">
          <article v-for="(journey, index) in journeys" :key="journey.slug" class="journeys__card"
            :class="`journeys__card--${index + 1}`">
            <NuxtLink :to="`/destinations/${journey.slug}`" class="journeys__visual-link"
              :aria-label="`Explore ${journey.title}`">
              <div class="journeys__visual">
                <img :src="journey.image" :alt="journey.title" class="journeys__image">

                <div class="journeys__overlay" />
              </div>
            </NuxtLink>

            <div class="journeys__card-content">
              <NuxtLink :to="`/destinations/${journey.slug}`" class="journeys__title-link">
                <h3 class="journeys__title">
                  {{ journey.title }}
                </h3>
              </NuxtLink>

              <NuxtLink :to="`/destinations/${journey.slug}`" class="journeys__explore">
                <span>SEE MORE</span>
                <Icon name="lucide:arrow-right" />
              </NuxtLink>
            </div>
          </article>
        </div>

      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;

/* ============================================================ */
/* SECTION */
/* ============================================================ */

.journeys {
  position: relative;
  z-index: 2;

  overflow: hidden;

  background: $color-ivory-light;
  color: $color-charcoal;

  &__inner {
  width: 100%;

  padding:
    0
    0
    clamp(90px, 8vw, 160px);
}

  /* ========================================================== */
  /* MAIN LAYOUT */
  /* ========================================================== */

  &__layout {
  display: grid;

  grid-template-columns:
    minmax(620px, 1.15fr)
    minmax(0, 1.6fr);

  align-items: center;

  gap:
    clamp(
      50px,
      6vw,
      100px
    );

  width: 100%;

  margin-inline: auto;
}

  /* ========================================================== */
  /* LEFT HEADING */
  /* ========================================================== */

  &__header {
    position: relative;
    top: auto;
    align-self: center;
    padding-top: 0;
  }

  &__eyebrow {
    margin: 0 0 58px;
    color: $color-text-muted;
  }

  &__heading {
    width: fit-content;
    min-width: max-content;
    max-width: none;
    margin: 0;

    color: #000000;

    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(7rem, 11vw, 12rem);
    font-weight: 400;
    line-height: 0.84;
    letter-spacing: 0.02em;
  }

  &__heading-line {
    display: block;
    overflow: hidden;
    padding: 0.02em 0.08em 0.10em 0;
  }

  &__heading-text {
    display: block;
    white-space: nowrap;
    font-family: 'Bebas Neue', sans-serif;
    letter-spacing: 0.02em;
    will-change: transform;
  }

  /* ========================================================== */
  /* DESTINATION GRID */
  /* ========================================================== */

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: clamp(18px, 2vw, 32px);
    row-gap: clamp(70px, 7vw, 115px);
    align-items: start;
  }

  /* ========================================================== */
  /* CARD POSITIONS — STAGGERED LIKE REFERENCE */
  /* ========================================================== */

  &__card {
    position: relative;
    min-width: 0;

    &--1 {
      grid-column: 1;
      margin-top: 0;
    }

    &--2 {
      grid-column: 2;
      margin-top: clamp(75px, 7vw, 115px);
    }

    &--3 {
      grid-column: 1;
      margin-top: clamp(0px, 0vw, 0px);
    }

    &--4 {
      grid-column: 2;
      margin-top: clamp(75px, 7vw, 115px);
    }
  }

  /* ========================================================== */
  /* IMAGE */
  /* ========================================================== */

  &__visual-link {
    display: block;
    color: inherit;
    text-decoration: none;
  }

  &__visual {
    position: relative;
    width: 100%;
    aspect-ratio: 0.78;
    overflow: hidden;
    background: $color-sand;
    will-change: clip-path;
  }

  &__image {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(1);
    will-change: transform;
    transition:
      transform 1.2s cubic-bezier(0.22, 1, 0.36, 1);
  }

  &__overlay {
    position: absolute;
    z-index: 2;
    inset: 0;
    pointer-events: none;

    background:
      linear-gradient(to top,
        rgba(15, 15, 12, 0.28) 0%,
        rgba(15, 15, 12, 0.02) 45%,
        transparent 70%);

    opacity: 0.35;

    transition:
      opacity 700ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  /* ========================================================== */
  /* IMAGE ARROW */
  /* ========================================================== */

  &__image-arrow {
    position: absolute;
    z-index: 5;
    top: 50%;
    right: 18px;

    display: grid;
    width: 48px;
    height: 48px;
    place-items: center;

    border: 1px solid rgba(250, 248, 243, 0.75);
    border-radius: 50%;

    color: $color-ivory-light;
    background: rgba(15, 15, 12, 0.12);
    backdrop-filter: blur(5px);

    opacity: 0;
    transform: translate(10px, -50%);

    transition:
      opacity $transition-medium,
      transform $transition-medium,
      background $transition-medium,
      color $transition-medium;

    :deep(svg) {
      width: 17px;
      height: 17px;
    }
  }

  &__visual-link:hover {
    .journeys__image {
      transform: scale(1.045);
    }

    .journeys__overlay {
      opacity: 0.8;
    }

    .journeys__image-arrow {
      opacity: 1;
      transform: translate(0, -50%);
      background: $color-ivory-light;
      color: $color-charcoal;
    }
  }

  /* ========================================================== */
  /* CONTENT BELOW IMAGE */
  /* ========================================================== */

  &__card-content {
    padding-top: 18px;
    will-change: transform, opacity;
  }

  &__title-link {
    display: block;
    color: $color-plum;
    text-decoration: none;
  }

  &__title {
    margin: 0;

    color: #000;

    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(1.65rem, 2vw, 2.15rem);
    font-weight: 400;
    line-height: 1;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  &__explore {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 12px;

    min-height: 54px;
    margin-top: 18px;
    padding: 0 25px;

    border: 1px solid #000;
    background: #000;
    color: #fff;

    font-family: 'Manrope', sans-serif;
    font-size: var(--fs-link);
    font-weight: 500;
    letter-spacing: 0.07em;

    text-decoration: none;
    text-transform: uppercase;

    transition:
      background $transition-medium,
      color $transition-medium;

    :deep(svg) {
      width: 16px;
      height: 16px;

      /* No arrow animation */
      transition: none;
    }

    &:hover {
      background: transparent;
      color: #000;
    }

    &:hover :deep(svg) {
      /* Keep arrow completely static */
      transform: none;
    }
  }
  /* ========================================================== */
/* INDIA INTRODUCTION */
/* ========================================================== */

&__india {
  display: grid;

  grid-template-columns:
    minmax(0, 1fr)
    minmax(0, 1fr);

  width: 100%;

  min-height:
    clamp(
      620px,
      48vw,
      780px
    );

  margin-bottom:
    clamp(
      110px,
      10vw,
      170px
    );

  border-bottom: 1px solid rgba(15, 15, 12, 0.18);
}


/* ========================================================== */
/* INDIA DETAILS */
/* ========================================================== */

&__india-details {
  position: relative;

  display: flex;

  flex-direction: column;

  justify-content: center;

  min-width: 0;

  padding:
    clamp(50px, 6vw, 100px)
    clamp(35px, 6vw, 110px)
    clamp(50px, 6vw, 100px)
    clamp(25px, 4vw, 70px);

  background: #000;
  color: #fff;

  border-right:
    1px solid
    rgba(
      15,
      15,
      12,
      0.18
    );
}


&__india-copy {
  max-width: 620px;
}


&__india-label {
  position: absolute;

  top: clamp(24px, 3vw, 48px);
  right: clamp(35px, 6vw, 110px);
  left: clamp(25px, 4vw, 70px);

  margin: 0;

  color: #fff;

  font-family: 'Bebas Neue', sans-serif;

  font-size: clamp(2rem, 5.2vw, 10rem);

  font-weight: 400;

  letter-spacing: 0.02em;

  line-height: 0.9;

  text-transform: uppercase;
}


&__india-description {
  max-width: 600px;

  margin: 0 0 22px;

  color: #fff;

  font-family: 'Manrope', sans-serif;

  font-size:
    clamp(
      1rem,
      1.25vw,
      1.25rem
    );

  line-height: 1.75;
}


&__india-description:last-child {
  margin-bottom: 0;
}


/* ========================================================== */
/* EXPLORE INDIA BUTTON */
/* ========================================================== */

&__india-cta {
  display: inline-flex;

  align-items: center;

  justify-content: center;

  align-self: flex-start;

  gap: 12px;

  min-height: 54px;

  margin-top: 42px;

  padding: 0 25px;

  border: 1px solid #000;

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

  :deep(svg) {
    width: 16px;
    height: 16px;

    transition: none;
  }

  &:hover {
    background: transparent;
    color: #fff;
  }

  &:hover :deep(svg) {
    transform: none;
  }
}


/* ========================================================== */
/* INDIA VIDEO AREA */
/* ========================================================== */

&__india-visual {
  position: relative;

  display: flex;

  align-items: center;

  justify-content: center;

  min-width: 0;

  overflow: hidden;

  background: #000;
}


&__india-video {
  position: absolute;

  z-index: 1;

  inset: 0;

  width: 100%;
  height: 100%;

  object-fit: cover;

  transform: scale(1.08);

  opacity: 0.9;

  pointer-events: none;
}


&__india-video-overlay {
  position: absolute;

  z-index: 2;

  inset: 0;

  background:
    linear-gradient(
      135deg,
      rgba(0, 0, 0, 0.62),
      rgba(0, 0, 0, 0.18)
    );

  pointer-events: none;
}


/* ========================================================== */
/* INDIA BIG TYPOGRAPHY */
/* ========================================================== */

&__india-heading {
  position: relative;

  z-index: 3;

  width: 100%;

  padding: 40px;

  color: #fff;

  font-family:
    'Bebas Neue',
    sans-serif;

  font-size:
    clamp(
      5.5rem,
      8.5vw,
      10rem
    );

  font-weight: 400;

  line-height: 0.82;

  letter-spacing: 0.02em;
}


&__india-heading-line {
  display: block;

  overflow: hidden;

  width: fit-content;

  padding:
    0.02em
    0.08em
    0.10em
    0;
}


&__india-heading-text {
  display: block;

  white-space: nowrap;

  will-change: transform;
}
}

/* ============================================================ */
/* LARGE DESKTOP */
/* ============================================================ */

@media (min-width: 1600px) {
  .journeys {
    &__layout {
      max-width: 1600px;
      grid-template-columns: minmax(520px, 1.15fr) minmax(0, 1.6fr);
    }

    &__visual {
      aspect-ratio: 0.82;
    }
  }
}

/* ============================================================ */
/* LAPTOP */
/* ============================================================ */

@media (max-width: 1200px) {
  .journeys {
    &__layout {
      gap: 70px;
      grid-template-columns: minmax(560px, 0.9fr) minmax(0, 1.6fr);
    }

    &__header {
      padding-top: 45px;
    }

    &__eyebrow {
      margin-bottom: 42px;
    }

    &__grid {
      column-gap: 22px;
    }

    &__card {

      &--2,
      &--4 {
        margin-top: 65px;
      }
    }
  }
}

/* ============================================================ */
/* TABLET */
/* ============================================================ */

@media (max-width: 900px) {
  .journeys {
    &__inner {
      padding:
        0 0 110px;
    }

    &__layout {
      grid-template-columns: 1fr;
      gap: 70px;
    }

    &__header {
      position: relative;
      top: auto;
      padding-top: 0;
    }

    &__heading {
      max-width: 700px;
    }

    &__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    &__card {

      &--1,
      &--2,
      &--3,
      &--4 {
        grid-column: auto;
        margin-top: 0;
      }

      &--2,
      &--4 {
        margin-top: 70px;
      }
    }
  }
}

/* ============================================================ */
/* MOBILE */
/* ============================================================ */

@media (max-width: 600px) {
  .journeys {
    &__inner {
      padding:
        0 0 80px;
    }

    &__layout {
      gap: 55px;
    }

    &__eyebrow {
      margin-bottom: 28px;
    }

    &__heading {
      width: 100%;
      max-width: 100%;
      color: #000000;
      font-size: clamp(4.2rem, 18vw, 6rem);
      line-height: 0.88;
    }

    &__grid {
      display: block;
    }

    &__card,
    &__card--1,
    &__card--2,
    &__card--3,
    &__card--4 {
      width: 100%;
      margin: 0 0 60px;
    }

    &__card:last-child {
      margin-bottom: 0;
    }

    &__visual {
      aspect-ratio: 0.9;
    }

    &__image-arrow {
      top: auto;
      right: 14px;
      bottom: 14px;

      width: 42px;
      height: 42px;

      opacity: 1;
      transform: none;
    }

    &__title {
      font-size: 2rem;
    }
  }
}

/* ============================================================ */
/* REDUCED MOTION */
/* ============================================================ */

@media (prefers-reduced-motion: reduce) {
  .journeys {

    &__eyebrow,
    &__heading-line,
    &__heading-text,
    &__visual,
    &__image,
    &__card-content {
      opacity: 1 !important;
      transform: none !important;
      transition: none !important;
    }
  }
}
</style>