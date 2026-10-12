<template>
  <main class="journey-page">
    <SiteHeader />
    
    <section class="journey-hero">
      <div class="journey-hero__content">
        <p class="journey-hero__eyebrow eyebrow">Plan Your Journey</p>
        <h1 class="journey-hero__heading heading-xl">
          Discover the world's most <br />
          <em>extraordinary</em> destinations.
        </h1>
      </div>
    </section>

    <section class="journey-countries">
      <div
        v-for="(country, index) in countries"
        :key="country.name"
        class="country-block"
        :class="{'country-block--reverse': index % 2 !== 0}"
        ref="countryRefs"
      >
        <div class="country-block__image-wrapper">
          <div class="country-block__image-inner">
            <img :src="country.image" :alt="country.name" class="country-block__image" />
          </div>
        </div>
        
        <div class="country-block__content">
          <span class="country-block__number">{{ String(index + 1).padStart(2, '0') }}</span>
          <h2 class="country-block__name">{{ country.name }}</h2>
          <p class="country-block__description body-large">{{ country.description }}</p>
          
          <NuxtLink :to="`/destinations/${country.slug}`" class="country-block__explore text-link">
            <span>Explore {{ country.name }}</span>
            <Icon name="lucide:arrow-right" />
          </NuxtLink>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SiteHeader from '~/components/layout/SiteHeader.vue'

const countries = [
  {
    name: 'India',
    slug: 'india',
    description: 'Ancient traditions, soulful landscapes and extraordinary cultures come together in journeys shaped with depth, warmth and discovery.',
    image: '/images/destinations/india.jpg'
  },
  {
    name: 'Europe',
    slug: 'europe',
    description: 'Timeless cities, beautiful countryside and enduring traditions unfold through journeys that reveal a more intimate side of Europe.',
    image: '/images/destinations/europe.avif'
  },
  {
    name: 'Africa',
    slug: 'africa',
    description: 'Vast wilderness, remarkable wildlife and powerful landscapes create unforgettable journeys filled with wonder, stillness and connection.',
    image: '/images/destinations/africa.jpg'
  },
  {
    name: 'South America',
    slug: 'south-america',
    description: 'Dramatic landscapes, vibrant cultures and ancient stories come alive through journeys filled with colour, rhythm and discovery.',
    image: '/images/destinations/south-america.jpg'
  },
  {
    name: 'Middle East',
    slug: 'middle-east',
    description: 'Ancient heritage, striking landscapes and contemporary elegance meet in journeys shaped by culture, contrast and extraordinary hospitality.',
    image: '/images/destinations/middle-east.jpg'
  }
]

const countryRefs = ref<HTMLElement[]>([])
let ctx: gsap.Context | null = null

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)

  ctx = gsap.context(() => {
    // Hero Entrance
    gsap.from('.journey-hero__eyebrow', {
      opacity: 0,
      y: 20,
      duration: 1,
      ease: 'power3.out',
      delay: 0.2
    })
    
    gsap.from('.journey-hero__heading', {
      opacity: 0,
      y: 40,
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.4
    })

    // Country Blocks Scroll Animation
    countryRefs.value.forEach((block) => {
      const image = block.querySelector('.country-block__image-inner')
      const contentElements = block.querySelectorAll('.country-block__number, .country-block__name, .country-block__description, .country-block__explore')

      // Image Parallax Effect
      gsap.fromTo(image, 
        { yPercent: -15, scale: 1.1 },
        {
          yPercent: 15,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: block,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      )

      // Content Entrance
      gsap.fromTo(contentElements,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: block,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;

.journey-page {
  background: $color-ivory;
  color: $color-charcoal;
  min-height: 100svh;
  padding-top: 120px;
}

.journey-hero {
  padding: clamp(60px, 8vw, 120px) var(--page-padding);
  text-align: center;
  
  &__eyebrow {
    margin-bottom: 24px;
  }
  
  &__heading {
    margin: 0 auto;
    max-width: 1000px;
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-weight: 400;
    line-height: 1.1;
    letter-spacing: -0.02em;
    
    em {
      font-style: italic;
    }
  }
}

.journey-countries {
  padding: 0 var(--page-padding) clamp(100px, 12vw, 180px);
  display: flex;
  flex-direction: column;
  gap: clamp(80px, 10vw, 160px);
}

.country-block {
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  align-items: center;
  max-width: $container-max;
  margin: 0 auto;
  width: 100%;
  
  @media (min-width: 992px) {
    grid-template-columns: 1.2fr 1fr;
    gap: clamp(60px, 8vw, 120px);
  }
  
  &--reverse {
    @media (min-width: 992px) {
      grid-template-columns: 1fr 1.2fr;
      
      .country-block__image-wrapper {
        order: 2;
      }
      
      .country-block__content {
        order: 1;
        padding-left: 0;
        padding-right: 4vw;
      }
    }
  }
  
  &__image-wrapper {
    width: 100%;
    aspect-ratio: 4 / 5;
    overflow: hidden;
    background: $color-sand;
    border-radius: 4px;
    
    @media (min-width: 992px) {
      aspect-ratio: 16 / 11;
    }
  }
  
  &__image-inner {
    width: 100%;
    height: 120%; // Extra height for parallax
    margin-top: -10%;
  }
  
  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  &__content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  
  &__number {
    font-family: 'Manrope', sans-serif;
    font-size: 14px;
    letter-spacing: 0.12em;
    color: $color-stone;
    margin-bottom: 24px;
    display: inline-block;
    
    &::after {
      content: '';
      display: inline-block;
      width: 40px;
      height: 1px;
      background: $color-stone;
      vertical-align: middle;
      margin-left: 16px;
      opacity: 0.5;
    }
  }
  
  &__name {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(3rem, 5vw, 4.5rem);
    font-weight: 400;
    line-height: 1;
    margin: 0 0 24px 0;
    color: $color-charcoal;
  }
  
  &__description {
    color: $color-text-muted;
    margin: 0 0 40px 0;
    max-width: 480px;
    line-height: 1.6;
  }
  
  &__explore {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    font-family: 'Manrope', sans-serif;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: $color-charcoal;
    text-decoration: none;
    border-bottom: 1px solid rgba($color-charcoal, 0.2);
    padding-bottom: 8px;
    transition: border-color $transition-fast;
    
    :deep(svg) {
      width: 16px;
      height: 16px;
      transition: transform $transition-fast;
    }
    
    &:hover {
      border-color: $color-charcoal;
      
      :deep(svg) {
        transform: translateX(4px);
      }
    }
  }
}
</style>
