<template>
  <div class="places-grid" ref="gridRef">
    <article
      v-for="(state, index) in states"
      :key="state.id"
      class="place-card"
      :class="{ 'place-card--reverse': index % 2 !== 0 }"
    >
      <div class="place-card__visual">
        <img
          :src="state.image"
          :alt="state.name"
          class="place-card__image"
        >
        <div class="place-card__overlay" />
      </div>
      <div class="place-card__content">
        <h4 class="place-card__name">{{ state.name }}</h4>
        <p class="place-card__desc">{{ state.description }}</p>
        
        <NuxtLink
          :to="`${basePath}/${state.id}`"
          class="place-card__explore text-link"
        >
          <span>Explore {{ state.name }}</span>
          <Icon name="lucide:arrow-right" />
        </NuxtLink>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export interface StateDisplayData {
  id: string
  name: string
  description: string
  image: string
}

const props = defineProps<{
  states: StateDisplayData[]
  basePath: string
}>()

const gridRef = ref<HTMLElement | null>(null)
let ctx: gsap.Context | null = null

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)

  if (!gridRef.value) return

  ctx = gsap.context(() => {
    const cards = gridRef.value!.querySelectorAll<HTMLElement>('.place-card')

    cards.forEach((card, index) => {
      const visual = card.querySelector<HTMLElement>('.place-card__visual')
      const image = card.querySelector<HTMLElement>('.place-card__image')
      const content = card.querySelector<HTMLElement>('.place-card__content')

      if (!visual || !image || !content) return

      const fromLeft = index % 2 === 0

      gsap.set(visual, {
        clipPath: fromLeft ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)'
      })

      gsap.set(image, {
        scale: 1.12,
        xPercent: fromLeft ? -5 : 5
      })

      gsap.set(content, {
        opacity: 0,
        x: fromLeft ? 30 : -30
      })

      const cardTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      })

      cardTimeline
        .to(visual, {
          clipPath: 'inset(0 0% 0 0%)',
          duration: 1.15,
          ease: 'power3.inOut'
        }, 0)
        .to(image, {
          scale: 1,
          xPercent: 0,
          duration: 1.35,
          ease: 'power3.out'
        }, 0)
        .to(content, {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: 'power3.out'
        }, 0.5)

      gsap.fromTo(image,
        { yPercent: -3 },
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
  }, gridRef.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;

.places-grid {
  display: flex;
  flex-direction: column;
  gap: 60px;
  margin-top: 40px;
  
  @media (min-width: 768px) {
    gap: 80px;
  }
}

.place-card {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  align-items: center;
  
  @media (min-width: 768px) {
    grid-template-columns: 1.2fr 1fr;
    gap: 40px;
    
    &--reverse {
      grid-template-columns: 1fr 1.2fr;
      
      .place-card__visual {
        order: 2;
      }
      .place-card__content {
        order: 1;
      }
    }
  }
  
  &__visual {
    position: relative;
    width: 100%;
    aspect-ratio: 4/3;
    overflow: hidden;
    background: $color-sand;
    border-radius: 8px;
    will-change: clip-path;
  }
  
  &__image {
    width: 100%;
    height: 106%;
    object-fit: cover;
    will-change: transform;
  }
  
  &__overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(
      to top,
      rgba(15, 15, 12, 0.1) 0%,
      transparent 50%
    );
  }
  
  &__content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    will-change: transform, opacity;
  }
  
  &__name {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2.8rem;
  font-weight: 400;
  margin: 0;
  color: $color-charcoal;
}
  
  &__desc {
    font-family: 'Manrope', sans-serif;
    font-size: 18px;
    color: $color-text-muted;
    line-height: 1.8;
    margin: 0;
  }
  
  &__explore {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 16px;

  margin-top: 10px;
  padding: 14px 22px;

  border: 1px solid $color-charcoal;
  border-radius: 0;

  background: $color-charcoal;
  color: $color-ivory;

  text-decoration: none;

  font-family: 'Manrope', sans-serif;
  font-size: 12px;
  font-weight: 500;

  letter-spacing: 0.12em;
  text-transform: uppercase;

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
    color: $color-charcoal;
    border-color: $color-charcoal;
  }
}
}
</style>
