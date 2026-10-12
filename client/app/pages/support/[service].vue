<template>
  <div class="service-page">
    <main v-if="support" ref="sectionRef" class="support-detail">
      <SiteHeader />

      <!-- ==========================================================
           HERO
      =========================================================== -->
      <section
        class="support-detail__hero"
        :style="{ backgroundImage: `url(${support.image})` }"
      >
        <div class="support-detail__overlay"></div>

        <div class="support-detail__hero-content">
          <p class="support-detail__eyebrow">
            {{ support.eyebrow }}
          </p>

          <h1 class="support-detail__title">
            {{ support.title }}
          </h1>

          <p class="support-detail__description">
            {{ support.description }}
          </p>
        </div>
      </section>


      <!-- ==========================================================
           SERVICE INTRO + CTA
           CTA is intentionally placed immediately after the hero.
      =========================================================== -->
      <section
        class="support-detail__overview"
        :class="{ 'support-detail__overview--chauffeur': isChauffeurService }"
      >
        <div class="support-detail__overview-inner">

          <div class="support-detail__overview-copy">

            <h2 class="support-detail__heading">
              {{ support.overviewHeading }}
            </h2>

            <p class="support-detail__text">
              {{ support.intro }}
            </p>

            <p
              v-if="support.consultationNote"
              class="support-detail__consultation-note"
            >
              {{ support.consultationNote }}
            </p>
          </div>

          <div class="support-detail__overview-action">
            <p class="support-detail__action-label">
              READY TO GET STARTED?
            </p>

            <NuxtLink
              :to="support.ctaTo"
              class="support-detail__cta-link"
            >
              <span>{{ support.cta }}</span>
              <Icon name="lucide:arrow-right" />
            </NuxtLink>
          </div>

        </div>
      </section>


      <!-- ==========================================================
           DETAILED SERVICE EXPLANATION
      =========================================================== -->
      <section class="support-detail__details-section">
        <div class="support-detail__details-inner">

          <div class="support-detail__details-header">

            <h2 class="support-detail__details-heading">
              Everything you need, clearly taken care of.
            </h2>
          </div>


          <!-- Detailed service cards -->
          <div
            v-if="support.details?.length"
            class="support-detail__details-grid"
          >
            <article
              v-for="(detail, index) in support.details"
              :key="detail.title"
              class="support-detail__detail"
            >
              <div class="support-detail__detail-number">
                {{ String(index + 1).padStart(2, '0') }}
              </div>

              <div class="support-detail__detail-body">
                <h3>
                  {{ detail.title }}
                </h3>

                <p>
                  {{ detail.description }}
                </p>
              </div>
            </article>
          </div>


          <!-- Fallback for services without detailed descriptions -->
          <div
            v-else
            class="support-detail__points-grid"
          >
            <article
              v-for="point in support.points"
              :key="point"
              class="support-detail__point"
              :class="{ 'support-detail__point--chauffeur': isChauffeurService }"
            >
              <span
                v-if="!isChauffeurService"
                class="support-detail__point-number"
              >
                {{ String(support.points.indexOf(point) + 1).padStart(2, '0') }}
              </span>

              <h3>
                {{ point }}
              </h3>
            </article>
          </div>

        </div>
      </section>


        <section class="support-detail__process-section">
          <div class="support-detail__process-inner">

            <div class="support-detail__process-header">
              <h2 class="support-detail__process-heading">
                YOUR JOURNEY, SIMPLY ARRANGED.
              </h2>
            </div>

            <div class="support-detail__process-grid">
              <article
                v-for="(step, index) in support.process"
                :key="step.title"
                class="support-detail__process-item"
              >
                <div>
                  <h3>{{ step.title }}</h3>
                  <p>{{ step.description }}</p>
                </div>
              </article>
            </div>

          </div>
        </section>


        <section class="support-detail__final-cta">
          <div class="support-detail__final-cta-inner">
            <p class="support-detail__label">
              PRIVATE CHAUFFEUR SERVICES
            </p>

            <h2>
              TELL US WHERE<br>
              YOU NEED TO GO.
            </h2>

            <NuxtLink
              :to="support.ctaTo"
              class="support-detail__cta-link"
            >
              <span>{{ support.cta }}</span>
              <Icon name="lucide:arrow-right" />
            </NuxtLink>
          </div>
        </section>

        
    </main>
</div>
      </template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SiteHeader from '~/components/layout/SiteHeader.vue'

interface SupportPage {
    title: string
    eyebrow: string
    description: string
    image: string
    intro: string
    overviewHeading?: string
    points: string[]
    details?: {
        title: string
        description: string
    }[]
    process?: {
        title: string
        description: string
    }[]
    consultationNote?: string
    cta: string
    ctaTo: string
}

const supportPages: Record<string, SupportPage> = {
    visa: {
        title: 'Visa Assistance',
        eyebrow: 'TRAVEL SUPPORT',
        description:
            'Clear guidance through visa requirements and documentation, helping make the process feel straightforward from the start.',
        image: '/images/support/visa.jpg',
        overviewHeading:
            'Premium visa assistance, handled with care.',
        intro:
            'Our premium visa assistance service supports you through the key stages of the visa process, from consultation and appointment assistance to application support, document quality checks and submission where applicable.',
        points: [
            'Visa consultation',
            'Appointment assistance',
            'Application/form assistance',
            'E-visa processing',
            'Document quality check',
            'Submission & collection where applicable'
        ],
        details: [
            {
                title: 'Visa consultation',
                description:
                    'Understand the visa process, requirements and next steps for your planned destination through a dedicated consultation.'
            },
            {
                title: 'Appointment assistance',
                description:
                    'Assistance with the appointment-taking process and the practical steps required to move your visa application forward.'
            },
            {
                title: 'Application / form assistance',
                description:
                    'Support with filling up the required visa application forms and ensuring the information is prepared clearly and consistently.'
            },
            {
                title: 'E-visa processing',
                description:
                    'Assistance with the online e-visa process, from preparing the required information to completing the application process.'
            },
            {
                title: 'Document quality check',
                description:
                    'A quality check of the required documents to help identify missing, incomplete or unsuitable documentation before submission.'
            },
            {
                title: 'Submission & collection where applicable',
                description:
                    'Support with submission and collection of visa documents wherever the relevant process allows or requires this service.'
            }
        ],
        consultationNote:
            'Consultation charge is applicable to consultation only.',
        cta: 'Book a consultation', 
        ctaTo: '/support/visa/consultation'
    },

    flights: {
        title: 'Flights & Connections',
        eyebrow: 'TRAVEL SUPPORT',
        description:
            'Thoughtfully considered routes and connections designed around comfort, timing and the rhythm of your journey.',
        image: '/images/support/flights.jpg',
        overviewHeading:
            'Flights and connections, thoughtfully planned.',
        intro:
            'We help shape your flight plan around your itinerary, preferred timing and the connections that make your journey feel seamless.',
        points: [
            'Route planning',
            'Flight connection guidance',
            'Schedule coordination',
            'Journey-focused flight planning'
        ],
        cta: 'Plan your journey',
        ctaTo: '/contact'
    },

    'private-chauffeur': {
        title: 'Private Chauffeur Services',
        eyebrow: 'TRAVEL SUPPORT',
        description:
            'Comfortable, chauffeur-driven transportation for airport transfers, inter-city journeys, personal travel and group movements.',
        image: '/images/support/transfers.jpg',
        overviewHeading:
            'Private transportation, thoughtfully arranged for every journey.',
        intro:
            'We provide chauffeur-driven cars and luxury coaches for seamless airport transfers, inter-city travel, car-at-disposal requirements and domestic group journeys.',
        points: [
            'Airport transfers',
            'Inter-city transfers',
            'Car at disposal',
            'Luxury coaches — Mercedes & Volvo'
        ],
        details: [
            {
                title: 'Airport transfers',
                description:
                    'Chauffeur-driven transfers for smooth and comfortable journeys to or from the airport, tailored around your travel schedule.'
            },
            {
                title: 'Inter-city transfers',
                description:
                    'Private transportation between cities for a comfortable and convenient journey, whether travelling alone, with family or as a group.'
            },
            {
                title: 'Car at disposal',
                description:
                    'A private chauffeur and car available for your planned travel, meetings, sightseeing, shopping, events or other movements throughout the day.'
            },
            {
                title: 'Luxury coaches',
                description:
                    'Mercedes and Volvo luxury coaches for domestic travel and larger groups, providing a comfortable way to travel together.'
            }
        ],
        process: [
            {
                title: 'Share your requirements',
                description:
                    'Tell us about your journey, preferred dates, locations and the type of transportation you require.'
            },
            {
                title: 'Discuss your journey',
                description:
                    'Our team reviews your requirements and connects with you to understand the details of your travel.'
            },
            {
                title: 'We arrange the service',
                description:
                    'Once your requirements are confirmed, we coordinate the appropriate chauffeur-driven car or luxury coach for your journey.'
            }
        ],
        cta: 'Enquire now',
        ctaTo: '/contact'
    },

    'on-ground-support': {
        title: 'On-ground Support',
        eyebrow: 'TRAVEL SUPPORT',
        description:
            'Personal assistance throughout your journey, with trusted local support whenever and wherever it is needed.',
        image: '/images/support/support.jpg',
        intro:
            'Travel with the reassurance of local assistance throughout your journey, whenever support is needed on the ground.',
        points: [
            'Local assistance',
            'Journey coordination',
            'Destination support',
            'Personal travel assistance'
        ],
        cta: 'Plan your journey',
        ctaTo: '/contact'
    }
}

const route = useRoute()

const support = computed(() => {
    return supportPages[String(route.params.service).toLowerCase()] ?? null
})

const isChauffeurService = computed(() => {
    return String(route.params.service).toLowerCase() === 'private-chauffeur'
})

const sectionRef = ref<HTMLElement | null>(null)
let ctx: gsap.Context | null = null

onMounted(() => {
    if (typeof window === 'undefined' || !support.value || !sectionRef.value) return

    gsap.registerPlugin(ScrollTrigger)

    ctx = gsap.context(() => {
        gsap.from('.support-detail__eyebrow', {
            y: 20,
            opacity: 0,
            duration: 0.7,
            ease: 'power3.out'
        })

        gsap.from('.support-detail__title', {
            y: 50,
            opacity: 0,
            duration: 0.9,
            delay: 0.1,
            ease: 'power3.out'
        })

        gsap.from('.support-detail__description', {
            y: 25,
            opacity: 0,
            duration: 0.7,
            delay: 0.2,
            ease: 'power3.out'
        })

        gsap.from('.support-detail__overview-copy, .support-detail__overview-action', {
            y: 30,
            opacity: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.support-detail__overview',
                start: 'top 80%',
                once: true
            }
        })

        gsap.from('.support-detail__details-header', {
            y: 25,
            opacity: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.support-detail__details-section',
                start: 'top 82%',
                once: true
            }
        })

        gsap.from(
            '.support-detail__detail, .support-detail__point',
            {
                y: 25,
                opacity: 0,
                duration: 0.6,
                stagger: 0.08,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.support-detail__details, .support-detail__points',
                    start: 'top 85%',
                    once: true
                }
            }
        )

        if (isChauffeurService.value) {            gsap.from('.support-detail__process-header, .support-detail__process-item', {
                y: 25,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.support-detail__process-section',
                    start: 'top 82%',
                    once: true
                }
            })

            gsap.from('.support-detail__final-cta-inner', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.support-detail__final-cta',
                    start: 'top 82%',
                    once: true
                }
            })
        }
    }, sectionRef.value)
})

onUnmounted(() => {
    ctx?.revert()
})

useSeoMeta({
    title: () => `${support.value?.title ?? 'Travel Support'} | Vedic Journey`,
    description: () =>
        support.value?.description ??
        'Explore travel support services with Vedic Journey.'
})
</script>

<style lang="scss" scoped>

@use '~/assets/scss/variables' as *;

.support-detail {
  background: $color-ivory-light;
  color: $color-charcoal;
}

.support-detail__hero {
  position: relative;
  display: flex;
  align-items: flex-end;
  min-height: 100svh;
  overflow: hidden;
  background-position: center;
  background-size: cover;
  isolation: isolate;
}

.support-detail__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.2) 0%,
    rgba(0, 0, 0, 0.32) 45%,
    rgba(0, 0, 0, 0.78) 100%
  );
  z-index: -1;
}

.support-detail__hero-content {
  width: 100%;
  max-width: $container-max;
  margin-inline: auto;
  padding:
    0
    var(--page-padding)
    clamp(70px, 9vw, 130px);
  color: #fff;
}

.support-detail__eyebrow,
.support-detail__label {
  margin: 0 0 18px;
  font-family: 'Manrope', sans-serif;
  font-size: var(--fs-link);
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.support-detail__title {
  max-width: 1100px;
  margin: 0;
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(5rem, 10vw, 10rem);
  font-weight: 400;
  line-height: 0.82;
  letter-spacing: 0.015em;
}

.support-detail__description {
  max-width: 650px;
  margin: 28px 0 0;
  font-family: 'Manrope', sans-serif;
  font-size: var(--fs-body-lg);
  line-height: 1.65;
}


/* ==========================================================
   OVERVIEW + CTA
========================================================== */

.support-detail__overview {
  padding:
    clamp(75px, 8vw, 120px)
    var(--page-padding)
    clamp(80px, 9vw, 130px);
}

.support-detail__overview-inner {
  display: flex;
//   grid-template-columns: minmax(0, 1.35fr) minmax(280px, 0.65fr);
  gap: clamp(60px, 10vw, 160px);
  align-items: end;
  max-width: $container-max;
  margin-inline: auto;
}

.support-detail__overview-copy {
  max-width: 850px;
}

.support-detail__heading {
  max-width: 1250px;
  margin: 0;
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(4rem, 6.5vw, 7rem);
  font-weight: 400;
  line-height: 0.86;
  letter-spacing: 0.02em;
}

.support-detail__text {
  max-width: 720px;
  margin: 30px 0 0;
  color: $color-text-muted;
  font-family: 'Manrope', sans-serif;
  line-height: 1.7;
}

.support-detail__consultation-note {
  max-width: 720px;
  margin: 28px 0 0;
  padding-top: 22px;
  border-top: 1px solid rgba(23, 23, 21, 0.2);
  font-family: 'Manrope', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.6;
}

.support-detail__overview-action {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  min-height: 150px;
  padding: 0;
}

.support-detail__action-label {
  margin: 0 0 22px;
  color: $color-text-muted;
  font-family: 'Manrope', sans-serif;
  font-size: var(--fs-link);
  font-weight: 500;
  letter-spacing: 0.08em;
}

.support-detail__cta-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 54px;
  padding: 0 25px;
  border: 1px solid $color-charcoal;
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
}

.support-detail__cta-link :deep(svg) {
  width: 16px;
  height: 16px;
}

.support-detail__cta-link:hover {
  background: transparent;
  color: #000;
}


/* ==========================================================
   DETAILS
========================================================== */

.support-detail__details-section {
  padding:
    clamp(80px, 9vw, 130px)
    var(--page-padding)
    clamp(90px, 10vw, 150px);
  border-top: 1px solid rgba(23, 23, 21, 0.2);
}

.support-detail__details-inner {
  max-width: $container-max;
  margin-inline: auto;
}

.support-detail__details-header {
  margin-bottom: clamp(45px, 5vw, 70px);
}

.support-detail__details-heading {
  max-width: none;
  margin: 0;
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(3.4rem, 4.8vw, 5.8rem);
  font-weight: 400;
  line-height: 0.9;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.support-detail__details-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  border-top: 1px solid rgba(23, 23, 21, 0.2);
}

.support-detail__detail {
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr);
  gap: 18px;
  min-height: 220px;
  padding: 30px 35px 34px 0;
  border-bottom: 1px solid rgba(23, 23, 21, 0.2);
}

.support-detail__detail:nth-child(odd) {
  padding-right: clamp(30px, 4vw, 60px);
  border-right: 1px solid rgba(23, 23, 21, 0.2);
}

.support-detail__detail:nth-child(even) {
  padding-left: clamp(30px, 4vw, 60px);
}

.support-detail__detail-number {
  padding-top: 2px;
  color: $color-text-muted;
  font-family: 'Manrope', sans-serif;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
}

.support-detail__detail-body h3 {
  margin: 0;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(1rem, 1.15vw, 1.18rem);
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: 0.015em;
  text-transform: uppercase;
  white-space: nowrap;
}

.support-detail__detail-body p {
  max-width: 600px;
  margin: 16px 0 0;
  color: $color-text-muted;
  font-family: 'Manrope', sans-serif;
  font-size: 0.9rem;
  line-height: 1.65;
}

.support-detail__points-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  border-top: 1px solid rgba(23, 23, 21, 0.2);
}

.support-detail__point {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr);
  gap: 18px;
  padding: 28px 30px 28px 0;
  border-bottom: 1px solid rgba(23, 23, 21, 0.2);
}

.support-detail__point:nth-child(odd) {
  border-right: 1px solid rgba(23, 23, 21, 0.2);
}

.support-detail__point:nth-child(even) {
  padding-left: 30px;
}

.support-detail__point-number {
  color: $color-text-muted;
  font-family: 'Manrope', sans-serif;
}

.support-detail__point h3 {
  margin: 0;
  font-family: 'Manrope', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}


.support-detail__process-section {
  padding:
    clamp(90px, 10vw, 145px)
    var(--page-padding);
  border-top: 1px solid rgba(23, 23, 21, 0.2);
}

.support-detail__process-header {
  display: grid;
  grid-template-columns: minmax(0, 0.75fr) minmax(0, 1.25fr);
  gap: clamp(45px, 8vw, 120px);
  align-items: start;
  margin-bottom: clamp(45px, 6vw, 75px);
}

.support-detail__process-header .support-detail__label {
  margin: 0;
}

.support-detail__process-heading {
  max-width: 900px;
  margin: 0;
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(3.8rem, 6vw, 7rem);
  font-weight: 400;
  line-height: 0.86;
  letter-spacing: 0.02em;
}

.support-detail__process-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-top: 1px solid rgba(23, 23, 21, 0.2);
}

.support-detail__process-item {
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr);
  gap: 18px;
  min-height: 220px;
  padding: 30px 35px 30px 0;
  border-bottom: 1px solid rgba(23, 23, 21, 0.2);
}

.support-detail__process-item + .support-detail__process-item {
  padding-left: 35px;
  border-left: 1px solid rgba(23, 23, 21, 0.2);
}

.support-detail__process-number {
  color: $color-text-muted;
  font-family: 'Manrope', sans-serif;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
}

.support-detail__process-item h3 {
  margin: 0;
  font-family: 'Manrope', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.support-detail__process-item p {
  margin: 15px 0 0;
  color: $color-text-muted;
  font-family: 'Manrope', sans-serif;
  font-size: 0.9rem;
  line-height: 1.65;
}

.support-detail__final-cta {
  padding:
    clamp(90px, 11vw, 165px)
    var(--page-padding);
  background: $color-charcoal;
  color: #fff;
}

.support-detail__final-cta-inner {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.support-detail__final-cta .support-detail__label {
  color: rgba(255, 255, 255, 0.65);
}

.support-detail__final-cta h2 {
  max-width: 1000px;
  margin: 0 0 42px;
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(4.5rem, 9vw, 10rem);
  font-weight: 400;
  line-height: 0.82;
  letter-spacing: 0.015em;
}

.support-detail__final-cta .support-detail__cta-link {
  border-color: #fff;
  background: #fff;
  color: $color-charcoal;
}

.support-detail__final-cta .support-detail__cta-link:hover {
  background: transparent;
  color: #fff;
}





.support-detail__point--chauffeur {
  grid-template-columns: minmax(0, 1fr);
}

.support-detail__point--chauffeur .support-detail__point-number {
  display: none;
}

.support-detail__point--chauffeur h3 {
  grid-column: 1;
}

/* ==========================================================
   PRIVATE CHAUFFEUR — OVERVIEW LAYOUT
========================================================== */

.support-detail__overview--chauffeur .support-detail__overview-inner {
  grid-template-columns: minmax(0, 1fr);
}

.support-detail__overview--chauffeur .support-detail__overview-copy {
  max-width: 980px;
}

.support-detail__overview--chauffeur .support-detail__heading {
  max-width: 850px;
}

.support-detail__overview--chauffeur .support-detail__overview-description {
  max-width: 720px;
}

.support-detail__overview--chauffeur .support-detail__cta-wrap {
  margin-top: 28px;
}

.support-detail__overview--chauffeur .support-detail__cta {
  display: inline-flex;
}

/* Keep the service explanations clean: no numbered markers. */
.support-detail__details--chauffeur .support-detail__detail {
  grid-template-columns: minmax(0, 1fr);
}

.support-detail__details--chauffeur .support-detail__detail-content {
  grid-column: 1;
}

.support-detail__details--chauffeur .support-detail__detail-number {
  display: none;
}

.support-detail__process-item {
  grid-template-columns: minmax(0, 1fr);
}

.support-detail__process-number {
  display: none;
}

/* ==========================================================
   RESPONSIVE
========================================================== */

@media (max-width: 900px) {
  .support-detail__process-header {
    grid-template-columns: 1fr;
    gap: 25px;
  }

  .support-detail__process-grid {
    grid-template-columns: 1fr;
  }

  .support-detail__process-item,
  .support-detail__process-item + .support-detail__process-item {
    padding: 28px 0;
    border-left: 0;
  }

  .support-detail__overview-inner {
    grid-template-columns: 1fr;
    gap: 60px;
  }

  .support-detail__overview-action {
    min-height: auto;
  }

  .support-detail__details-header {
    grid-template-columns: 1fr;
    gap: 25px;
  }

  .support-detail__details-grid,
  .support-detail__points-grid {
    grid-template-columns: 1fr;
  }

  .support-detail__detail,
  .support-detail__detail:nth-child(odd),
  .support-detail__detail:nth-child(even) {
    padding: 28px 0;
    border-right: 0;
  }

  .support-detail__point,
  .support-detail__point:nth-child(odd),
  .support-detail__point:nth-child(even) {
    padding: 24px 0;
    border-right: 0;
  }
}

@media (max-width: 768px) {
  .support-detail__process-section {
    padding-top: 75px;
    padding-bottom: 80px;
  }

  .support-detail__process-item {
    min-height: auto;
  }

  .support-detail__final-cta {
    padding-top: 85px;
    padding-bottom: 90px;
  }

  .support-detail__final-cta h2 {
    margin-bottom: 34px;
  }

  .support-detail__hero-content {
    padding-bottom: 70px;
  }

  .support-detail__title {
    font-size: clamp(4rem, 15vw, 7rem);
  }

  .support-detail__description {
    font-size: 0.95rem;
  }

  .support-detail__overview {
    padding-top: 70px;
    padding-bottom: 80px;
  }

  .support-detail__heading {
    font-size: clamp(3.7rem, 13vw, 6rem);
  }

  .support-detail__details-section {
    padding-top: 70px;
    padding-bottom: 85px;
  }

  .support-detail__details-heading {
    font-size: clamp(3.5rem, 12vw, 5.5rem);
  }

  .support-detail__detail {
    min-height: auto;
    grid-template-columns: 42px minmax(0, 1fr);
    gap: 14px;
  }

  .support-detail__detail-body h3 {
    white-space: normal;
  }

  .support-detail__detail-body p {
    font-size: 0.9rem;
  }

  .support-detail__cta-link {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .support-detail__heading,
  .support-detail__details-heading {
    font-size: 3.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .support-detail__eyebrow,
  .support-detail__title,
  .support-detail__description,
  .support-detail__detail,
  .support-detail__point,
  .support-detail__process-header,
  .support-detail__process-item,
  .support-detail__final-cta-inner {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
</style>
