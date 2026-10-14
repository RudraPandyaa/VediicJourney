<script setup lang="ts">
import HeroSection from '~/components/home/HeroSection.vue'
import PhilosophySection from '~/components/home/PhilosophySection.vue'
import ExperienceSection from '~/components/home/ExperienceSection.vue'
import JourneySection from '~/components/home/JourneySection.vue'
import WhyVedicSection from '~/components/home/WhyVedicSection.vue'
import TravelSupportSection from '~/components/home/TravelSupportSection.vue'
import CertificateSection from '~/components/home/CertificateSection.vue'

const config = useRuntimeConfig()

const { data: homeResponse } = await useAsyncData(
  'home-page',
  () =>
    $fetch<any>(
      `${config.public.apiBase}/pages/home`
    )
)

const home = computed(() =>
  homeResponse.value?.data ?? null
)

const { data: certificatesResponse } = await useAsyncData(
  'home-certificates',
  () =>
    $fetch<any>(
      `${config.public.apiBase}/certificates`
    )
)

const certificates = computed(() =>
  certificatesResponse.value?.data ?? []
)
</script>

<template>
  <main>
    <HeroSection
      v-if="home?.content?.hero"
      :hero="home.content.hero"
    />
    <PhilosophySection
      v-if="home?.content?.philosophy"
      :philosophy="home.content.philosophy"
    />
    <JourneySection
      v-if="
        home?.content?.indiaSpotlight &&
        home?.content?.journeys
      "
      :india-spotlight="home.content.indiaSpotlight"
      :journey-content="home.content.journeys"
    />
    <ExperienceSection
      v-if="home?.content?.experiences"
      :experience-content="home.content.experiences"
    />
    <TravelSupportSection
      v-if="home?.content?.travelSupport"
      :travel-support="home.content.travelSupport"
    />
    <WhyVedicSection
      v-if="home?.content?.whyVedic"
      :why-vedic="home.content.whyVedic"
    />
    <CertificateSection
      v-if="certificates.length"
      :certificate-content="home?.content?.certificates"
      :certificates="certificates"
    />
  </main>
</template>

<style lang="scss" scoped>
  h2 {
    max-width: 900px;
    margin-top: 30px;

    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(4rem, 8vw, 8rem);
    font-weight: 400;
    line-height: 0.9;
    letter-spacing: -0.04em;
  }
</style>