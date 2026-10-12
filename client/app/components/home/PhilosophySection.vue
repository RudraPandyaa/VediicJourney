<template>
  <section ref="sectionRef" class="philosophy">

    <div class="philosophy__content">

      <!-- Heading -->
      <h2 class="philosophy__title heading-xl">
        <span v-for="(character, index) in headingCharacters" :key="`${character}-${index}`"
          class="philosophy__title-character" aria-hidden="true">
          {{ character === ' ' ? '\u00A0' : character }}
        </span>

        <span class="sr-only">
          Discover the journey that's yours.
        </span>
      </h2>

      <!-- Intro -->
      <p class="philosophy__description body">
        Tell us what inspires you, how you like to travel, and what
        you want to experience. We'll turn your ideas into a
        thoughtfully planned journey shaped around you.
      </p>

      <!-- CTA -->
      <NuxtLink to="/contact" class="philosophy__link" aria-label="Plan your journey with Vedic Journey">
        <span class="philosophy__link-text">
          Contact US
        </span>

        <span class="philosophy__link-arrow">
          <Icon name="lucide:arrow-right" />
        </span>
      </NuxtLink>

    </div>

  </section>
</template>

<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const sectionRef = ref<HTMLElement | null>(null)

const headingText = "Discover the journey that's yours."
const headingCharacters = headingText.split('')

let ctx: gsap.Context | undefined

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)

  if (!sectionRef.value) return

  ctx = gsap.context(() => {
    const mm = gsap.matchMedia()

    mm.add('(min-width: 769px)', () => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top 92%',
          end: 'top 45%',
          scrub: 2
        }
      })

      timeline.from(
        '.philosophy__title-character',
        {
          opacity: 0,
          yPercent: 100,
          stagger: 0.045,
          ease: 'power2.out',
          duration: 0.18
        },
        0
      )

      timeline.from(
        '.philosophy__description',
        {
          y: 24,
          opacity: 0,
          ease: 'power2.out',
          duration: 0.65
        },
        0.22
      )

      timeline.from(
        '.philosophy__link',
        {
          y: 18,
          opacity: 0,
          ease: 'power2.out',
          duration: 0.55
        },
        0.35
      )
    })

    mm.add('(max-width: 768px)', () => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top 88%'
        }
      })

      timeline.from(
  '.philosophy__title-character',
  {
    opacity: 0,
    y: 8,
    stagger: 0.08,
    ease: 'none',
    duration: 0.3
  },
  0
)

      timeline.from(
        '.philosophy__description',
        {
          y: 22,
          opacity: 0,
          duration: 0.65
        },
        '-=0.45'
      )

      timeline.from(
        '.philosophy__link',
        {
          opacity: 0,
          y: 15,
          duration: 0.5
        },
        '-=0.3'
      )
    })

    return () => {
      mm.revert()
    }
  }, sectionRef.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;


// ============================================================
// SECTION
// ============================================================

.philosophy {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;

  min-height: 52svh;

  overflow: hidden;

  background: #000;
  color: $color-ivory-light;
}


// ============================================================
// CONTENT
// ============================================================

.philosophy__content {
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100vw;
  max-width: none;

  margin-left: calc(50% - 50vw);
  margin-right: 0;

  padding:
    clamp(70px, 8vw, 105px) var(--page-padding);

  text-align: center;
}


// ============================================================
// HEADING
// ============================================================

.philosophy__title {
  position: relative;
  z-index: 2;

  display: block;

  width: 100%;
  max-width: none;

  margin: 0;

  font-family: 'Bebas Neue', sans-serif;

  letter-spacing: 0.02em;

  color: $color-ivory-light;

  white-space: nowrap;

  text-align: center;
}


.philosophy__title {
  white-space: nowrap;
  text-align: center;
}


.philosophy__title-character {
  display: inline-block;

  will-change: transform, opacity;
}


// ============================================================
// DESCRIPTION
// ============================================================

.philosophy__description {
  width: 100%;
  max-width: 760px;

  margin:
    clamp(28px, 3vw, 38px) auto 0;

  color: rgba(250, 248, 243, 0.9);

  line-height: 1.75;

  text-align: center;
}


// ============================================================
// CTA
// ============================================================

.philosophy__link {
  display: inline-flex;

  flex: 0 0 auto;

  align-items: center;

  justify-content: center;

  gap: 12px;

  min-height: 54px;

  width: fit-content;

  margin-top: 34px;

  padding:
    0 25px;

  border:
    1px solid #fff;

  background: #fff;

  color: #000;

  font-family:
    'Manrope',
    sans-serif;

  font-size:
    var(--fs-link);

  font-weight: 500;

  letter-spacing: 0.07em;

  text-decoration: none;

  text-transform: uppercase;

  transition:
    background $transition-medium,
    color $transition-medium;
}


.philosophy__link-arrow {
  display: flex;

  align-items: center;

  justify-content: center;

  :deep(svg) {
    width: 16px;

    height: 16px;
  }
}


.philosophy__link:hover {
  background: transparent;

  color: #fff;
}


// ============================================================
// TABLET
// ============================================================

@media (max-width: 1024px) {
  .philosophy {
    min-height: 48svh;
  }

  .philosophy__content {
    max-width: 900px;

    padding:
      65px var(--page-padding);
  }
}


// ============================================================
// MOBILE
// ============================================================

@media (max-width: 768px) {
  .philosophy {
    min-height: auto;
  }

  .philosophy__content {
    max-width: 620px;

    padding:
      60px var(--page-padding) 70px;
  }

  .philosophy__description {
    max-width: 520px;
  }

  .philosophy__link {
    margin-top: 30px;
  }
}


// ============================================================
// SMALL MOBILE
// ============================================================

@media (max-width: 480px) {
  .philosophy__content {
    padding:
      50px var(--page-padding) 60px;
  }

  .philosophy__link {
    width: 100%;
    max-width: 300px;
  }
}


// ============================================================
// ACCESSIBILITY
// ============================================================

.sr-only {
  position: absolute;

  width: 1px;
  height: 1px;

  padding: 0;
  margin: -1px;

  overflow: hidden;

  clip: rect(0, 0, 0, 0);

  white-space: nowrap;

  border: 0;
}


// ============================================================
// REDUCED MOTION
// ============================================================

@media (prefers-reduced-motion: reduce) {

  .philosophy__title-character,
  .philosophy__description,
  .philosophy__link {
    transform: none !important;
  }
}
</style>
