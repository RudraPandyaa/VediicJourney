<template>
  <main v-if="stateData" class="state-itinerary-page">
    <NuxtLink to="/destinations/middle-east" class="back-button">
      <Icon name="lucide:arrow-left" />
      <span>Back to Destinations</span>
    </NuxtLink>
    <!-- Hero Section -->
    <section class="state-hero">
      <div class="state-hero__image-wrap">
        <img :src="stateData.image" :alt="stateData.name" class="state-hero__image" />
        <div class="state-hero__overlay"></div>
      </div>
      
      <div class="state-hero__content">
        <p class="state-hero__eyebrow eyebrow">Itinerary</p>
        <h1 class="state-hero__heading heading-xl">{{ stateData.name }}</h1>
        <p class="state-hero__tagline">{{ stateData.tagline }}</p>
      </div>
    </section>

    <!-- Details Section -->
    <section class="state-details">
      <div class="state-details__container">
        
        <!-- Left Column: Intro & Places -->
        <div class="state-details__main">
          <div class="content-block">
            <h2 class="heading-lg">About {{ stateData.name }}</h2>
            <p class="body-large description">{{ stateData.description }}</p>
          </div>
          
          <div class="content-block places-block">
            <h3 class="heading-md">Places to Visit</h3>
            <p class="body-regular places-intro">
              Explore the most iconic and breathtaking destinations that {{ stateData.name }} has to offer.
            </p>
            <PlacesGrid :places="stateData.places" />
          </div>
        </div>

        <!-- Right Column: Itinerary Timeline -->
        <aside class="state-details__sidebar">
          <div class="itinerary-card">
            <h3 class="heading-md itinerary-card__title">Suggested Itinerary</h3>
            
            <div class="timeline">
              <div 
                v-for="(day, index) in stateData.itinerary" 
                :key="index"
                class="timeline__item"
              >
                <div class="timeline__marker"></div>
                <div class="timeline__content">
                  <h4 class="timeline__day">{{ day.day }}</h4>
                  <h5 class="timeline__title">{{ day.title }}</h5>
                  <p class="timeline__desc">{{ day.description }}</p>
                </div>
              </div>
            </div>
            
            <button class="btn-primary mt-8">Inquire About This Journey</button>
          </div>
        </aside>

      </div>
    </section>
  </main>
  
  <main v-else class="state-itinerary-page not-found">
    <NuxtLink to="/destinations/middle-east" class="back-button">
      <Icon name="lucide:arrow-left" />
      <span>Back to Destinations</span>
    </NuxtLink>
    <div class="not-found__content">
      <h1 class="heading-lg">Destination not found</h1>
      <NuxtLink to="/destinations/middle-east" class="btn-primary">Back to Middle East Destinations</NuxtLink>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import PlacesGrid from '~/components/destinations/PlacesGrid.vue'
import { middleEastData as statesData } from '~/data/middleEastData'

const route = useRoute()
const stateId = route.params.id as string

const stateData = computed(() => {
  return statesData.find(s => s.id === stateId) || null
})

let ctx: gsap.Context | null = null

onMounted(() => {
  if (!stateData.value) return

  gsap.registerPlugin(ScrollTrigger)

  ctx = gsap.context(() => {
    // Hero Animations
    gsap.from('.state-hero__eyebrow', {
      opacity: 0,
      y: 20,
      duration: 1,
      ease: 'power3.out',
      delay: 0.2
    })
    
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

    // Content Reveal
    gsap.from('.content-block', {
      opacity: 0,
      y: 40,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.state-details',
        start: 'top 75%',
      }
    })

    gsap.from('.itinerary-card', {
      opacity: 0,
      x: 30,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.state-details',
        start: 'top 75%',
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

.state-itinerary-page {
  background: $color-ivory;
  color: $color-charcoal;
  min-height: 100svh;
}

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
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-weight: 400;
    line-height: 1.05;
    letter-spacing: -0.02em;
    font-size: clamp(3.5rem, 6vw, 6rem);
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
   DETAILS SECTION
================================================== */
.state-details {
  padding: clamp(60px, 10vw, 120px) var(--page-padding);
  
  &__container {
    max-width: $container-max;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 80px;
  }
}

.content-block {
  margin-bottom: 60px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .heading-lg {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(2.5rem, 3.5vw, 3.5rem);
    font-weight: 400;
    margin: 0 0 24px 0;
  }
  
  .heading-md {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 2.2rem;
    font-weight: 400;
    margin: 0 0 16px 0;
  }
  
  .description {
    color: $color-text-muted;
    line-height: 1.6;
  }
}

.places-intro {
  color: $color-text-muted;
  margin-bottom: 32px;
}

.places-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  
  &__item {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 24px;
    background: rgba($color-sand, 0.2);
    border: 1px solid rgba($color-charcoal, 0.05);
    border-radius: 12px;
    transition: transform $transition-fast, background $transition-fast;
    
    &:hover {
      transform: translateY(-2px);
      background: rgba($color-sand, 0.4);
    }
  }
  
  &__icon {
    width: 24px;
    height: 24px;
    color: $color-stone;
    flex-shrink: 0;
    margin-top: 2px;
  }
  
  &__content {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  &__name {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.6rem;
    font-weight: 600;
    margin: 0;
  }
  
  &__desc {
    font-family: 'Manrope', sans-serif;
    font-size: 15px;
    color: $color-text-muted;
    margin: 0;
    line-height: 1.5;
  }
}

/* ==================================================
   SIDEBAR & TIMELINE
================================================== */
.itinerary-card {
  background: rgba($color-sand, 0.15);
  border: 1px solid rgba($color-charcoal, 0.05);
  border-radius: 12px;
  padding: 40px;
  
  &__title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 2.2rem;
    font-weight: 400;
    margin: 0 0 40px 0;
    padding-bottom: 24px;
    border-bottom: 1px solid rgba($color-charcoal, 0.1);
  }
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 32px;
  
  &__item {
    position: relative;
    padding-left: 32px;
    
    &::before {
      content: '';
      position: absolute;
      left: 7px;
      top: 24px;
      bottom: -32px;
      width: 1px;
      background: rgba($color-charcoal, 0.2);
    }
    
    &:last-child::before {
      display: none;
    }
  }
  
  &__marker {
    position: absolute;
    left: 0;
    top: 6px;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: $color-ivory;
    border: 2px solid $color-charcoal;
  }
  
  &__day {
    font-family: 'Manrope', sans-serif;
    font-size: 12px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: $color-stone;
    margin: 0 0 8px 0;
  }
  
  &__title {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 12px 0;
  }
  
  &__desc {
    color: $color-text-muted;
    line-height: 1.5;
    margin: 0;
  }
}

.mt-8 {
  margin-top: 40px;
}

.btn-primary {
  display: inline-block;
  width: 100%;
  padding: 16px;
  background: $color-charcoal;
  color: $color-ivory-light;
  border: none;
  font-family: 'Manrope', sans-serif;
  font-size: 14px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: background $transition-fast;
  
  &:hover {
    background: lighten($color-charcoal, 15%);
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
      font-family: 'Cormorant Garamond', Georgia, serif;
      margin-bottom: 32px;
    }
    
    .btn-primary {
      width: auto;
      padding: 16px 32px;
    }
  }
}
</style>
