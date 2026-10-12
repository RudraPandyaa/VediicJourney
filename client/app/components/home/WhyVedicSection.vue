<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const sectionRef = ref<HTMLElement | null>(null)

const points = [
  {
    number: '01',
    title: 'INSTANT PRICING',
    text: 'Enjoy complete price transparency and travel within budget.',
    icon: 'lucide:tag'
  },
  {
    number: '02',
    title: '100% TAILOR MADE',
    text: 'Your entire holiday is designed around your requirements.',
    icon: 'lucide:mouse-pointer-click'
  },
  {
    number: '03',
    title: 'EXPERT KNOWLEDGE',
    text: 'All our specialists have travelled extensively or lived in their specialist regions.',
    icon: 'lucide:users-round'
  },
  {
    number: '04',
    title: 'THE BEST GUIDES',
    text: 'Make the difference between a good trip and an outstanding one.',
    icon: 'lucide:concierge-bell'
  }
]

let ctx: gsap.Context | null = null

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)

  if (!sectionRef.value) return

  ctx = gsap.context(() => {
    gsap.set('.why-vedic__heading-text', {
      yPercent: 110
    })

    gsap.set('.why-vedic__divider', {
      scaleX: 0
    })

    gsap.set('.why-vedic__point', {
      opacity: 0,
      y: 35
    })

    const intro = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 75%',
        once: true
      }
    })

    intro
      .to(
        '.why-vedic__heading-text',
        {
          yPercent: 0,
          duration: 1,
          ease: 'power3.out'
        },
        0
      )
      .to(
        '.why-vedic__divider',
        {
          scaleX: 1,
          duration: 0.8,
          ease: 'power3.inOut'
        },
        0.25
      )
      .to(
        '.why-vedic__point',
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out'
        },
        0.4
      )
  }, sectionRef.value)
})

onBeforeUnmount(() => {
  ctx?.revert()
})
</script>

<template>
  <section ref="sectionRef" class="why-vedic">
    <div class="why-vedic__inner">

      <!-- ================================================
           HEADER
      ================================================= -->

      <header class="why-vedic__header">

        <h2 class="why-vedic__heading heading-xl">
          <span class="why-vedic__heading-line">
            <span class="why-vedic__heading-text">
              WHY CHOOSE US?
            </span>
          </span>
        </h2>

        <div class="why-vedic__divider"></div>

      </header>


      <!-- ================================================
           POINTS
      ================================================= -->

      <div class="why-vedic__points">

        <article v-for="point in points" :key="point.number" class="why-vedic__point">

          <div class="why-vedic__icon">
            <Icon :name="point.icon" :size="72" />
          </div>

          <h3 class="why-vedic__point-title">
            {{ point.title }}
          </h3>

          <p class="why-vedic__point-text">
            {{ point.text }}
          </p>

        </article>

      </div>

    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;

.why-vedic {
  position: relative;
  z-index: 2;

  overflow: hidden;

  background: $color-charcoal;
  color: $color-ivory;

  &__inner {
    position: relative;
    z-index: 2;

    padding:
      clamp(110px, 10vw, 180px) var(--page-padding) clamp(110px, 11vw, 190px);
  }

  // ==========================================================
  // HEADER
  // ==========================================================

  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__heading {
    margin: 0;

    color: $color-ivory-light;

    text-align: center;
    line-height: 0.93;

    font-family: 'Bebas Neue', sans-serif;
    letter-spacing: 0.02em;
  }

  &__heading-line {
    display: block;
    overflow: hidden;

    padding:
      0.06em 0.12em 0.15em 0.04em;
  }

  &__heading-text {
    display: block;

    will-change: transform;
  }

  &__divider {
    width: min(460px, 42vw);
    height: 1px;

    margin-top: clamp(45px, 4vw, 65px);

    background: $color-sand;

    transform-origin: center;
    will-change: transform;
  }

  // ==========================================================
  // FOUR POINTS
  // ==========================================================

  &__points {
    display: grid;

    grid-template-columns: repeat(4, minmax(0, 1fr));

    gap: clamp(30px, 4vw, 75px);

    margin-top: clamp(70px, 6vw, 105px);
  }

  &__point {
    display: flex;
    flex-direction: column;
    align-items: center;

    min-width: 0;

    text-align: center;

    opacity: 0;
    will-change: transform, opacity;
  }

  &__icon {
    display: flex;

    align-items: center;
    justify-content: center;

    width: 76px;
    height: 76px;

    margin-bottom: clamp(38px, 4vw, 58px);

    color: $color-ivory-light;

    :deep(svg) {
      width: 58px;
      height: 58px;

      stroke-width: 1.45;
    }
  }

  &__point-title {
    margin: 0;

    color: $color-ivory-light;

    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(1.65rem, 2vw, 2.45rem);
    font-weight: 400;
    line-height: 1;
    letter-spacing: 0.025em;

    white-space: nowrap;
  }

  &__point-text {
    max-width: 330px;

    margin: clamp(30px, 3vw, 48px) auto 0;

    color: rgba(244, 240, 232, 0.68);

    font-family: 'Manrope', sans-serif;
    font-size: var(--fs-body-sm);
    line-height: 1.7;
  }
}


// ============================================================
// LAPTOP
// ============================================================

@media (max-width: 1200px) {
  .why-vedic {
    &__points {
      gap: 30px;
    }

    &__point-title {
      font-size: clamp(1.45rem, 2vw, 2.1rem);
    }

    &__point-text {
      max-width: 280px;
    }
  }
}


// ============================================================
// TABLET
// ============================================================

@media (max-width: 900px) {
  .why-vedic {
    &__inner {
      padding:
        90px var(--page-padding) 100px;
    }

    &__points {
      grid-template-columns: repeat(2, minmax(0, 1fr));

      row-gap: 75px;
    }
  }
}


// ============================================================
// MOBILE
// ============================================================

@media (max-width: 600px) {
  .why-vedic {
    &__inner {
      padding:
        75px var(--page-padding) 85px;
    }

    &__divider {
      width: 170px;

      margin-top: 35px;
    }

    &__points {
      grid-template-columns: 1fr;

      gap: 65px;

      margin-top: 60px;
    }

    &__icon {
      width: 65px;
      height: 65px;

      margin-bottom: 28px;

      :deep(svg) {
        width: 50px;
        height: 50px;
      }
    }

    &__point-title {
      font-size: 2rem;
      white-space: normal;
    }

    &__point-text {
      max-width: 310px;

      margin-top: 18px;
    }
  }
}


// ============================================================
// REDUCED MOTION
// ============================================================

@media (prefers-reduced-motion: reduce) {
  .why-vedic {

    &__heading-text,
    &__divider,
    &__point {
      opacity: 1 !important;

      transform: none !important;

      transition: none !important;
    }
  }
}
</style>
