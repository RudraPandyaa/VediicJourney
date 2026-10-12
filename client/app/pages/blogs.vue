<template>
  <main class="blogs-page">

    <!-- ======================================================
         HERO
    ======================================================= -->

    <section class="blogs-hero">

      <SiteHeader />

      <div class="blogs-hero__content">

        <p class="blogs-hero__eyebrow eyebrow">
          THE VEDIC JOURNEY JOURNAL
        </p>

        <h1 class="blogs-hero__title">
          STORIES FROM<br />
          THE JOURNEY.
        </h1>

        <p class="blogs-hero__intro body-large">
          Discover stories, ideas and inspiration from across the world —
          from destinations and cultures to thoughtful ways of travelling.
        </p>

      </div>

      <div class="blogs-hero__image">
        <img
          src="/images/destinations/japan.jpg"
          alt="Japan travel destination"
        />
      </div>

    </section>


    <!-- ======================================================
         FEATURED STORY
    ======================================================= -->

    <section class="blogs-featured">

      <div class="blogs-featured__header">

        <h2>
          STORIES WORTH
          TRAVELLING FOR.
        </h2>

      </div>


      <article class="blogs-featured__article">

        <NuxtLink
          to="/blogs/the-art-of-slow-travel"
          class="blogs-featured__image"
        >
          <img
            src="/images/destinations/japan.jpg"
            alt="Japan travel experience"
          />
        </NuxtLink>


        <div class="blogs-featured__content">


          <h3>
            Discovering Japan Beyond
            the Tourist Trail
          </h3>

          <div class="blogs-featured__line"></div>

          <p class="blogs-featured__description">
            Travel deeper, take your time and discover the quieter
            side of Japan through its landscapes, traditions,
            food and everyday rituals.
          </p>

          <div class="blogs-featured__meta">
            <span>12 SEPTEMBER 2026</span>

            <NuxtLink
              to="/blogs/the-art-of-slow-travel"
              class="blogs-featured__link"
            >
              <span>Read Story</span>
              <Icon name="lucide:arrow-right" />
            </NuxtLink>
          </div>

        </div>

      </article>

    </section>


    <!-- ======================================================
         JOURNAL
    ======================================================= -->

    <section class="blogs-journal">

      <div class="blogs-journal__header">

        <div>

          <h2>
            TRAVEL INSPIRATION.
          </h2>
        </div>


        <div class="blogs-journal__intro">

          <p>
            Stories from destinations, cultures and experiences
            that inspire us to see the world differently.
          </p>

        </div>

      </div>


      <!-- ====================================================
           CATEGORY FILTERS
      ===================================================== -->

      <div class="blogs-filters">

        <button
          v-for="category in categories"
          :key="category"
          type="button"
          class="blogs-filters__button"
          :class="{
            'is-active': activeCategory === category
          }"
          @click="activeCategory = category"
        >
          {{ category }}
        </button>

      </div>


      <!-- ====================================================
           BLOG GRID
      ===================================================== -->

      <div class="blogs-grid">

        <article
          v-for="post in filteredPosts"
          :key="post.slug"
          class="blog-card"
        >

          <NuxtLink
            :to="`/blogs/${post.slug}`"
            class="blog-card__image"
          >

            <img
              :src="post.image"
              :alt="post.title"
            />

            <span class="blog-card__arrow">
              <Icon name="lucide:arrow-up-right" />
            </span>

          </NuxtLink>


          <div class="blog-card__content">

            <div class="blog-card__top">

              <span class="blog-card__category">
                {{ post.category }}
              </span>

              <span class="blog-card__date">
                {{ post.date }}
              </span>

            </div>


            <h3 class="blog-card__title">
              {{ post.title }}
            </h3>


            <p class="blog-card__excerpt">
              {{ post.excerpt }}
            </p>


            <NuxtLink
              :to="`/blogs/${post.slug}`"
              class="blog-card__link"
            >
              <span>Read Story</span>

              <Icon name="lucide:arrow-right" />
            </NuxtLink>

          </div>

        </article>

      </div>

    </section>


    <!-- ======================================================
         WORLD STORIES
    ======================================================= -->

    <section class="blogs-world">

      <div class="blogs-world__image">

        <img
          src="/images/destinations/south-africa.jpg"
          alt="South Africa travel destination"
        />

      </div>


      <div class="blogs-world__content">

        <h2>
          ONE WORLD.<br />
          MANY STORIES.
        </h2>

        <div class="blogs-world__line"></div>

        <p class="blogs-world__text">
          From the ancient streets of Europe to the wild landscapes
          of Africa and the spiritual traditions of Asia, every
          destination has a story waiting to be discovered.
        </p>


        <NuxtLink
          to="/destinations"
          class="blogs-world__link"
        >
          <span>Explore Destinations</span>

          <Icon name="lucide:arrow-right" />
        </NuxtLink>

      </div>

    </section>

    <!-- ======================================================
         FINAL CTA
    ======================================================= -->

    <section class="blogs-final">

      <h2>
        READY TO BEGIN<br />
        YOUR JOURNEY?
      </h2>

      <NuxtLink
        to="/contact"
        class="blogs-final__link"
      >
        <span>Plan Your Journey</span>

        <Icon name="lucide:arrow-right" />
      </NuxtLink>

    </section>

  </main>
</template>


<script setup lang="ts">

import {
  computed,
  onMounted,
  onUnmounted,
  ref
} from 'vue'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import SiteHeader from '~/components/layout/SiteHeader.vue'


/* ==========================================================
   GSAP
========================================================== */

gsap.registerPlugin(ScrollTrigger)

let ctx: gsap.Context | null = null


/* ==========================================================
   BLOG DATA
========================================================== */

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  image: string
}


const posts: BlogPost[] = [

  {
    slug: 'the-art-of-slow-travel',
    title:
      'Discovering Japan Beyond the Tourist Trail',
    excerpt:
      'Travel deeper, take your time and discover the quieter side of Japan through its landscapes, traditions, food and everyday rituals.',
    category: 'DESTINATIONS',
    date: '12 SEPTEMBER 2026',
    image: '/images/destinations/japan.jpg'
  },

  {
    slug: 'wild-heart-of-south-africa',
    title:
      'Into the Wild Heart of South Africa',
    excerpt:
      'From extraordinary wildlife to dramatic landscapes, discover the experiences that make South Africa unforgettable.',
    category: 'DESTINATIONS',
    date: '04 SEPTEMBER 2026',
    image: '/images/destinations/south-africa.jpg'
  },

  {
    slug: 'finding-stillness-in-bali',
    title:
      'Finding Stillness in Bali',
    excerpt:
      'Explore Bali through its temples, landscapes and traditions while discovering a slower and more mindful way to travel.',
    category: 'WELLNESS',
    date: '28 AUGUST 2026',
    image: '/images/aboutPage/Bali.jpg'
  },

  {
    slug: 'a-different-side-of-italy',
    title:
      'A Different Side of Italy',
    excerpt:
      'Beyond the iconic cities lies another Italy — one shaped by villages, food, landscapes and timeless traditions.',
    category: 'CULTURE',
    date: '19 AUGUST 2026',
    image: '/images/aboutPage/Rome.jpg'
  },

  {
    slug: 'journey-through-france',
    title:
      'A Journey Through France',
    excerpt:
      'From elegant cities to quiet countryside, discover the many layers of French culture and travel.',
    category: 'CULTURE',
    date: '11 AUGUST 2026',
    image: '/images/aboutPage/France.jpg'
  },

  {
    slug: 'how-to-plan-a-meaningful-journey',
    title:
      'How to Plan a More Meaningful Journey',
    excerpt:
      'Thoughtful planning can transform a holiday into an experience that stays with you long after you return home.',
    category: 'TRAVEL TIPS',
    date: '03 AUGUST 2026',
    image: '/images/aboutPage/Rajasthan.jpg'
  }

]


/* ==========================================================
   CATEGORIES
========================================================== */

const categories = [
  'ALL',
  'DESTINATIONS',
  'CULTURE',
  'TRAVEL TIPS',
  'WELLNESS',
  'INSPIRATION'
]


const activeCategory = ref('ALL')


const filteredPosts = computed(() => {

  if (activeCategory.value === 'ALL') {
    return posts
  }

  return posts.filter(
    post => post.category === activeCategory.value
  )

})


/* ==========================================================
   ANIMATIONS
========================================================== */

onMounted(() => {

  ctx = gsap.context(() => {


    /* --------------------------------------------------------
       HERO
    -------------------------------------------------------- */

    gsap.from(
      '.blogs-hero__eyebrow',
      {
        opacity: 0,
        y: 20,
        duration: 0.9,
        ease: 'power3.out'
      }
    )


    gsap.from(
      '.blogs-hero__title',
      {
        opacity: 0,
        y: 50,
        duration: 1.2,
        delay: 0.15,
        ease: 'power3.out'
      }
    )


    gsap.from(
      '.blogs-hero__intro',
      {
        opacity: 0,
        y: 25,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out'
      }
    )


    /* --------------------------------------------------------
       FEATURED
    -------------------------------------------------------- */

    gsap.from(
      '.blogs-featured__header',
      {
        opacity: 0,
        x: -45,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.blogs-featured',
          start: 'top 75%'
        }
      }
    )


    gsap.from(
      '.blogs-featured__image',
      {
        opacity: 0,
        x: 50,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.blogs-featured__article',
          start: 'top 78%'
        }
      }
    )


    gsap.from(
      '.blogs-featured__content',
      {
        opacity: 0,
        x: 50,
        duration: 1,
        delay: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.blogs-featured__article',
          start: 'top 78%'
        }
      }
    )


    /* --------------------------------------------------------
       JOURNAL
    -------------------------------------------------------- */

    gsap.from(
      '.blogs-journal__header',
      {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.blogs-journal',
          start: 'top 75%'
        }
      }
    )


    gsap.from(
      '.blogs-filters',
      {
        opacity: 0,
        y: 25,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.blogs-filters',
          start: 'top 85%'
        }
      }
    )


    gsap.from(
      '.blog-card',
      {
        opacity: 0,
        y: 45,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.blogs-grid',
          start: 'top 78%'
        }
      }
    )


    /* --------------------------------------------------------
       WORLD STORIES
    -------------------------------------------------------- */

    gsap.from(
      '.blogs-world__image',
      {
        opacity: 0,
        x: -55,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.blogs-world',
          start: 'top 75%'
        }
      }
    )


    gsap.from(
      '.blogs-world__content',
      {
        opacity: 0,
        x: 55,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.blogs-world',
          start: 'top 75%'
        }
      }
    )


    /* --------------------------------------------------------
       INSPIRATION
    -------------------------------------------------------- */

    gsap.from(
      '.blogs-inspiration__inner',
      {
        opacity: 0,
        y: 45,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.blogs-inspiration',
          start: 'top 75%'
        }
      }
    )


    /* --------------------------------------------------------
       FINAL CTA
    -------------------------------------------------------- */

    gsap.from(
      '.blogs-final h2',
      {
        opacity: 0,
        y: 50,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.blogs-final',
          start: 'top 75%'
        }
      }
    )


    gsap.from(
      '.blogs-final__link',
      {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.blogs-final',
          start: 'top 75%'
        }
      }
    )

  })

})


/* ==========================================================
   CLEANUP
========================================================== */

onUnmounted(() => {

  ctx?.revert()

})

</script>


<style lang="scss" scoped>

@use '~/assets/scss/variables' as *;


/* ============================================================
   PAGE
============================================================ */

.blogs-page {
  min-height: 100svh;

  background: $color-ivory;

  color: $color-charcoal;

  overflow: hidden;
}


/* ============================================================
   HERO
============================================================ */

.blogs-hero {
  position: relative;

  display: flex;

  align-items: center;

  width: 100%;

  min-height: 100svh;
  height: 100svh;

  overflow: hidden;

  background: $color-charcoal;

  color: $color-ivory-light;

  isolation: isolate;
}


/* ------------------------------------------------------------
   HEADER
------------------------------------------------------------ */

.blogs-hero {

  :deep(.site-header) {
    position: absolute;

    z-index: 100;

    top: 0;
    right: 0;
    left: 0;
  }

}


/* ------------------------------------------------------------
   HERO IMAGE
------------------------------------------------------------ */

.blogs-hero__image {

  position: absolute;

  z-index: 1;

  inset: 0;

  width: 100%;
  height: 100%;

  overflow: hidden;

}


.blogs-hero__image img {

  display: block;

  width: 100%;
  height: 100%;

  object-fit: cover;

  object-position: center;

  transform: scale(1.01);

}


.blogs-hero__image::after {

  position: absolute;

  z-index: $z-overlay;

  inset: 0;

  content: '';

  background:
    linear-gradient(
      90deg,
      rgba(7, 7, 6, 0.58) 0%,
      rgba(7, 7, 6, 0.32) 45%,
      rgba(7, 7, 6, 0.12) 100%
    ),
    linear-gradient(
      0deg,
      rgba(7, 7, 6, 0.45) 0%,
      rgba(7, 7, 6, 0.05) 55%,
      rgba(7, 7, 6, 0.22) 100%
    );

  pointer-events: none;
}


/* ------------------------------------------------------------
   HERO CONTENT
------------------------------------------------------------ */

.blogs-hero__content {

  position: relative;

  z-index: 2;

  width: 100%;

  max-width: 1100px;

  margin-inline: auto;

  padding:
    clamp(140px, 17vw, 220px)
    var(--page-padding)
    clamp(100px, 12vw, 160px);

  text-align: center;

}


.blogs-hero__eyebrow {

  margin-bottom: 30px;

  color: #fff;

}


.blogs-hero__title {

  margin: 0;

  font-family:
    'Bebas Neue',
    sans-serif;

  font-size:
    clamp(4.8rem, 10vw, 10rem);

  font-weight: 400;

  line-height: 0.82;

  letter-spacing: 0.02em;

  color: #fff;

}


.blogs-hero__intro {

  max-width: 680px;

  margin:
    45px auto 0;

  color: #fff;

  line-height: 1.75;

}


/* ============================================================
   FEATURED STORY
============================================================ */

.blogs-featured {

  padding:
    clamp(100px, 12vw, 175px)
    var(--page-padding);

  overflow: hidden;

}


.blogs-featured__header {

  width: 100%;

  max-width: $container-max;

  margin-inline: auto;

  margin-bottom:
    clamp(55px, 7vw, 90px);

}


.blogs-featured__eyebrow {

  margin-bottom: 25px;

}


.blogs-featured__header h2 {

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


.blogs-featured__article {

  display: grid;

  grid-template-columns:
    minmax(0, 1.25fr)
    minmax(0, 0.75fr);

  gap:
    clamp(45px, 7vw, 110px);

  width: 100%;

  max-width: $container-max;

  margin-inline: auto;

  align-items: center;

}


.blogs-featured__image {

  position: relative;

  display: block;

  width: 100%;

  aspect-ratio: 1.45 / 1;

  overflow: hidden;

}


.blogs-featured__image img {

  display: block;

  width: 100%;
  height: 100%;

  object-fit: cover;

  transition:
    transform $transition-medium;

}


.blogs-featured__image:hover img {

  transform: scale(1.035);

}


.blogs-featured__content {

  max-width: 550px;

}


.blogs-featured__category {

  margin: 0 0 20px;

  font-family:
    'Manrope',
    sans-serif;

  font-size: 12px;

  font-weight: 600;

  letter-spacing: 0.16em;

  text-transform: uppercase;

  color: $color-text-muted;

}


.blogs-featured__content h3 {

  margin: 0;

  font-family:
    'Bebas Neue',
    sans-serif;

  font-size:
    clamp(3rem, 4.5vw, 5rem);

  font-weight: 400;

  line-height: 0.92;

  letter-spacing: 0.015em;

}


.blogs-featured__line {

  width: 100%;

  height: 1px;

  margin:
    32px 0 28px;

  background:
    rgba($color-charcoal, 0.18);

}


.blogs-featured__description {

  max-width: 500px;

  margin: 0;

  font-family:
    'Manrope',
    sans-serif;

  font-size:
    var(--fs-body);

  line-height: 1.75;

  color: $color-text-muted;

}


.blogs-featured__meta {

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 30px;

  margin-top: 40px;

}


.blogs-featured__meta > span {

  font-family:
    'Manrope',
    sans-serif;

  font-size: 11px;

  font-weight: 600;

  letter-spacing: 0.12em;

  color: $color-text-muted;

}


.blogs-featured__link {

  display: inline-flex;

  align-items: center;
  justify-content: center;

  gap: 12px;

  width: fit-content;

  min-height: 48px;
  padding: 0 20px;

  border: 1px solid $color-charcoal;
  border-radius: 0;

  background: $color-charcoal;

  color: $color-ivory-light;

  font-family:
    'Manrope',
    sans-serif;

  font-size: 12px;

  font-weight: 600;

  letter-spacing: 0.12em;

  text-transform: uppercase;

  text-decoration: none;

  transition:
    background $transition-fast,
    color $transition-fast,
    border-color $transition-fast;

}


.blogs-featured__link:hover {

  background: transparent;

  color: $color-charcoal;

}


.blogs-featured__link svg {

  width: 17px;
  height: 17px;

  transition: none;

}


/* ============================================================
   JOURNAL
============================================================ */

.blogs-journal {

  padding:
    clamp(100px, 12vw, 170px)
    var(--page-padding);

  background:
    $color-ivory-light;

}


.blogs-journal__header {

  display: grid;

  grid-template-columns:
    minmax(0, 1fr)
    minmax(260px, 0.55fr);

  gap:
    clamp(40px, 8vw, 120px);

  width: 100%;

  max-width: $container-max;

  margin-inline: auto;

  align-items: end;

}


.blogs-journal__eyebrow {

  margin-bottom: 25px;

}


.blogs-journal__header h2 {

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


.blogs-journal__intro {

  max-width: 430px;

  padding-bottom: 7px;

}


.blogs-journal__intro p {

  margin: 0;

  font-family:
    'Manrope',
    sans-serif;

  font-size:
    var(--fs-body);

  line-height: 1.75;

  color: $color-text-muted;

}


/* ============================================================
   FILTERS
============================================================ */

.blogs-filters {

  display: flex;

  flex-wrap: wrap;

  gap: 10px;

  width: 100%;

  max-width: $container-max;

  margin:
    clamp(65px, 7vw, 90px)
    auto
    55px;

}


.blogs-filters__button {

  min-height: 44px;
  padding: 0 18px;

  border: 1px solid $color-charcoal;
  border-radius: 0;

  background: $color-charcoal;

  color: $color-ivory-light;

  font-family:
    'Manrope',
    sans-serif;

  font-size: 11px;

  font-weight: 600;

  letter-spacing: 0.12em;

  text-transform: uppercase;

  cursor: pointer;

  transition:
    background $transition-fast,
    color $transition-fast,
    border-color $transition-fast;

}


.blogs-filters__button:hover {

  border-color: $color-charcoal;

  background: transparent;

  color: $color-charcoal;

}


.blogs-filters__button.is-active {

  border-color: $color-charcoal;

  background: $color-ivory-light;

  color: $color-charcoal;

}


/* ============================================================
   BLOG GRID
============================================================ */

.blogs-grid {

  display: grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap:
    clamp(45px, 5vw, 75px)
    clamp(20px, 2.5vw, 40px);

  width: 100%;

  max-width: $container-max;

  margin-inline: auto;

}


.blog-card {

  display: flex;
  flex-direction: column;

  min-width: 0;
  height: 100%;

}


.blog-card__image {

  position: relative;

  display: block;

  width: 100%;

  aspect-ratio: 1.12 / 1;

  overflow: hidden;

  background:
    rgba($color-charcoal, 0.06);

}


.blog-card__image img {

  display: block;

  width: 100%;
  height: 100%;

  object-fit: cover;

  transition:
    transform $transition-medium;

}


.blog-card__image:hover img {

  transform: scale(1.04);

}


.blog-card__arrow {

  position: absolute;

  right: 16px;
  bottom: 16px;

  display: flex;

  align-items: center;
  justify-content: center;

  width: 42px;
  height: 42px;

  background: $color-ivory;

  color: $color-charcoal;

}


.blog-card__arrow svg {

  width: 17px;
  height: 17px;

}


.blog-card__content {

  display: flex;
  flex: 1;
  flex-direction: column;

  padding-top: 24px;

}


.blog-card__top {

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

  margin-bottom: 18px;

}


.blog-card__category,
.blog-card__date {

  font-family:
    'Manrope',
    sans-serif;

  font-size: 10px;

  font-weight: 600;

  letter-spacing: 0.12em;

  text-transform: uppercase;

}


.blog-card__category {

  color: $color-charcoal;

}


.blog-card__date {

  color: $color-text-muted;

}


.blog-card__title {

  margin: 0;

  font-family:
    'Bebas Neue',
    sans-serif;

  font-size:
    clamp(2.5rem, 3.1vw, 3.5rem);

  font-weight: 400;

  line-height: 0.92;

  letter-spacing: 0.015em;

}


.blog-card__excerpt {

  margin:
    22px 0 30px;

  font-family:
    'Manrope',
    sans-serif;

  font-size:
    14px;

  line-height: 1.7;

  color: $color-text-muted;

}


.blog-card__link {

  display: inline-flex;

  align-items: center;
  justify-content: center;

  gap: 12px;

  width: fit-content;
  min-height: 46px;
  margin-top: auto;
  flex-shrink: 0;
  padding: 0 18px;

  border: 1px solid $color-charcoal;
  border-radius: 0;

  background: $color-charcoal;

  color: $color-ivory-light;

  font-family:
    'Manrope',
    sans-serif;

  font-size: 11px;

  font-weight: 600;

  letter-spacing: 0.12em;

  text-transform: uppercase;

  text-decoration: none;

  transition:
    background $transition-fast,
    color $transition-fast,
    border-color $transition-fast;

}


.blog-card__link:hover {

  background: transparent;

  color: $color-charcoal;

}


.blog-card__link svg {

  width: 16px;
  height: 16px;

}


/* ============================================================
   WORLD STORIES
============================================================ */

.blogs-world {

  display: grid;

  grid-template-columns:
    minmax(0, 1fr)
    minmax(0, 1fr);

  min-height:
    clamp(650px, 65vw, 850px);

  background:
    $color-charcoal;

  color:
    $color-ivory-light;

}


.blogs-world__image {

  min-height: 500px;

  overflow: hidden;

}


.blogs-world__image img {

  display: block;

  width: 100%;
  height: 100%;

  object-fit: cover;

}


.blogs-world__content {

  display: flex;

  flex-direction: column;

  justify-content: center;

  max-width: 650px;

  padding:
    clamp(70px, 9vw, 130px);

}


.blogs-world__eyebrow {

  margin-bottom: 28px;

  color: rgba(255, 255, 255, 0.65);

}


.blogs-world__content h2 {

  margin: 0;

  font-family:
    'Bebas Neue',
    sans-serif;

  font-size:
    clamp(4rem, 6vw, 6.5rem);

  font-weight: 400;

  line-height: 0.86;

  letter-spacing: 0.02em;

  color: #fff;

}


.blogs-world__line {

  width: 100%;

  height: 1px;

  margin:
    38px 0 30px;

  background:
    rgba(255, 255, 255, 0.22);

}


.blogs-world__text {

  max-width: 500px;

  margin: 0;

  font-family:
    'Manrope',
    sans-serif;

  font-size:
    var(--fs-body);

  line-height: 1.75;

  color:
    rgba(255, 255, 255, 0.68);

}


.blogs-world__link {

  display: inline-flex;

  align-items: center;
  justify-content: center;

  gap: 13px;

  width: fit-content;
  min-height: 48px;
  margin-top: 38px;
  padding: 0 20px;

  border: 1px solid $color-ivory-light;
  border-radius: 0;

  background: $color-ivory-light;

  color: $color-charcoal;

  font-family:
    'Manrope',
    sans-serif;

  font-size: 12px;

  font-weight: 600;

  letter-spacing: 0.12em;

  text-transform: uppercase;

  text-decoration: none;

  transition:
    background $transition-fast,
    color $transition-fast,
    border-color $transition-fast;

}


.blogs-world__link:hover {

  background: transparent;

  color: $color-ivory-light;

}


.blogs-world__link svg {

  width: 17px;
  height: 17px;

}


/* ============================================================
   INSPIRATION
============================================================ */

.blogs-inspiration {

  padding:
    clamp(120px, 15vw, 210px)
    var(--page-padding);

  background:
    $color-sand;

  text-align: center;

}


.blogs-inspiration__inner {

  width: 100%;

  max-width: 1000px;

  margin-inline: auto;

}


.blogs-inspiration__eyebrow {

  margin-bottom: 28px;

}


.blogs-inspiration h2 {

  margin: 0;

  font-family:
    'Bebas Neue',
    sans-serif;

  font-size:
    clamp(4.2rem, 7vw, 8rem);

  font-weight: 400;

  line-height: 0.84;

  letter-spacing: 0.02em;

}


.blogs-inspiration__text {

  max-width: 620px;

  margin:
    42px auto 0;

  font-family:
    'Manrope',
    sans-serif;

  font-size:
    var(--fs-body);

  line-height: 1.75;

  color:
    $color-text-muted;

}


.blogs-inspiration__link {

  display: inline-flex;

  align-items: center;
  justify-content: center;

  gap: 13px;

  min-height: 48px;
  margin-top: 38px;
  padding: 0 20px;

  border: 1px solid $color-charcoal;
  border-radius: 0;

  background: $color-charcoal;

  color: $color-ivory-light;

  font-family:
    'Manrope',
    sans-serif;

  font-size: 12px;

  font-weight: 600;

  letter-spacing: 0.12em;

  text-transform: uppercase;

  text-decoration: none;

  transition:
    background $transition-fast,
    color $transition-fast,
    border-color $transition-fast;

}


.blogs-inspiration__link:hover {

  background: transparent;
  color: $color-charcoal;

}


.blogs-inspiration__link svg {

  width: 17px;
  height: 17px;

}


/* ============================================================
   FINAL CTA
============================================================ */

.blogs-final {

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  min-height:
    clamp(550px, 65vh, 750px);

  padding:
    100px var(--page-padding);

  background:
    $color-ivory;

  text-align: center;

}


.blogs-final h2 {

  margin: 0;

  font-family:
    'Bebas Neue',
    sans-serif;

  font-size:
    clamp(5rem, 10vw, 10rem);

  font-weight: 400;

  line-height: 0.8;

  letter-spacing: 0.02em;

}


.blogs-final__link {

  display: inline-flex;

  align-items: center;
  justify-content: center;

  gap: 14px;

  min-height: 50px;
  margin-top: 55px;
  padding: 0 22px;

  border: 1px solid $color-charcoal;
  border-radius: 0;

  background: $color-charcoal;

  color: $color-ivory-light;

  font-family:
    'Manrope',
    sans-serif;

  font-size: 12px;

  font-weight: 600;

  letter-spacing: 0.14em;

  text-transform: uppercase;

  text-decoration: none;

  transition:
    background $transition-fast,
    color $transition-fast,
    border-color $transition-fast;

}


.blogs-final__link:hover {

  background: transparent;
  color: $color-charcoal;

}


.blogs-final__link svg {

  width: 18px;
  height: 18px;

}


/* ============================================================
   TABLET
============================================================ */

@media (max-width: 900px) {

  .blogs-featured__article {

    grid-template-columns:
      minmax(0, 1fr);

  }


  .blogs-featured__content {

    max-width: 700px;

  }


  .blogs-journal__header {

    grid-template-columns:
      minmax(0, 1fr);

    gap: 35px;

  }


  .blogs-grid {

    grid-template-columns:
      repeat(2, minmax(0, 1fr));

  }


  .blogs-world {

    grid-template-columns:
      minmax(0, 1fr);

  }


  .blogs-world__image {

    min-height: 550px;

  }


  .blogs-world__content {

    max-width: none;

  }

}


/* ============================================================
   MOBILE
============================================================ */

@media (max-width: 640px) {

  .blogs-hero {

    min-height: 100svh;
    height: 100svh;

  }


  .blogs-hero__content {

    padding:
      130px
      var(--page-padding)
      90px;

  }


  .blogs-hero__title {

    font-size:
      clamp(4rem, 17vw, 6rem);

  }


  .blogs-hero__intro {

    margin-top: 35px;

  }


  .blogs-featured {

    padding:
      90px
      var(--page-padding);

  }


  .blogs-featured__header {

    margin-bottom: 50px;

  }


  .blogs-featured__article {

    gap: 40px;

  }


  .blogs-featured__image {

    aspect-ratio: 1 / 1;

  }


  .blogs-featured__meta {

    align-items: flex-start;

    flex-direction: column;

    gap: 22px;

  }


  .blogs-journal {

    padding:
      90px
      var(--page-padding);

  }


  .blogs-filters {

    gap: 7px;

    margin:
      55px auto
      45px;

  }


  .blogs-filters__button {

    padding:
      10px 14px;

    font-size: 9px;

  }


  .blogs-grid {

    grid-template-columns:
      minmax(0, 1fr);

    gap:
      55px;

  }


  .blog-card__image {

    aspect-ratio: 1.15 / 1;

  }


  .blog-card__top {

    align-items: flex-start;

    flex-direction: column;

    gap: 8px;

  }


  .blogs-world__image {

    min-height: 420px;

  }


  .blogs-world__content {

    padding:
      80px
      var(--page-padding);

  }


  .blogs-inspiration {

    padding:
      100px
      var(--page-padding);

  }


  .blogs-final {

    min-height: 500px;

    padding:
      80px
      var(--page-padding);

  }


  .blogs-final h2 {

    font-size:
      clamp(4rem, 16vw, 6rem);

  }

}


/* ============================================================
   REDUCED MOTION
============================================================ */

@media (prefers-reduced-motion: reduce) {

  .blogs-page *,
  .blogs-page *::before,
  .blogs-page *::after {

    scroll-behavior: auto !important;

    transition-duration: 0.01ms !important;

    animation-duration: 0.01ms !important;

    animation-iteration-count: 1 !important;

  }

}

</style>