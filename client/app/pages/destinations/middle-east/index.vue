<template>
  <main class="india-page">
    <SiteHeader />
    
    <!-- Hero Section -->
    <section class="india-hero">
      <div class="india-hero__content">
        <p class="india-hero__eyebrow eyebrow">Destination</p>
        <h1 class="india-hero__heading heading-xl">
          Discover the magic of <br />
          <em>Middle East</em>
        </h1>
        <p class="india-hero__description body-large">
          A tapestry of ancient wonders and futuristic cities. Explore our curated experiences across the Middle East.
        </p>
      </div>
    </section>

    <!-- States Grid Section -->
    <section class="states-section" ref="statesSection">
      <DestinationsGrid :states="states" basePath="/destinations/middle-east" />
    </section>
  </main>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SiteHeader from '~/components/layout/SiteHeader.vue'
import DestinationsGrid from '~/components/destinations/DestinationsGrid.vue'
import { middleEastData as statesData } from '~/data/middleEastData'

const states = statesData
let ctx: gsap.Context | null = null

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)

  ctx = gsap.context(() => {
    // Hero Entrance
    gsap.from('.india-hero__eyebrow', {
      opacity: 0,
      y: 20,
      duration: 1,
      ease: 'power3.out',
      delay: 0.1
    })
    
    gsap.from('.india-hero__heading', {
      opacity: 0,
      y: 30,
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.3
    })
    
    gsap.from('.india-hero__description', {
      opacity: 0,
      y: 30,
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.5
    })

  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;

.india-page {
  background: $color-ivory;
  color: $color-charcoal;
  min-height: 100svh;
  padding-top: 120px;
}

/* ==================================================
   HERO
================================================== */
.india-hero {
  padding: clamp(60px, 8vw, 120px) var(--page-padding);
  text-align: center;
  
  &__eyebrow {
    margin-bottom: 24px;
  }
  
  &__heading {
    margin: 0 auto 32px;
    max-width: 1000px;
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-weight: 400;
    line-height: 1.05;
    letter-spacing: -0.02em;
    
    em {
      font-style: italic;
    }
  }
  
  &__description {
    max-width: 600px;
    margin: 0 auto;
    color: $color-text-muted;
  }
}

/* ==================================================
   STATES GRID
================================================== */
.states-section {
  padding: 0 var(--page-padding) clamp(100px, 12vw, 180px);
}


</style>
