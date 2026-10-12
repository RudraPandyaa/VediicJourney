<script setup lang="ts">
import HeroSection from '~/components/home/HeroSection.vue'
import PhilosophySection from '~/components/home/PhilosophySection.vue'
import ExperienceSection from '~/components/home/ExperienceSection.vue'
import JourneySection from '~/components/home/JourneySection.vue'
import WhyVedicSection from '~/components/home/WhyVedicSection.vue'
import TravelSupportSection from '~/components/home/TravelSupportSection.vue'
import CertificateSection from '~/components/home/CertificateSection.vue'

</script>

<template>
  <main>
    <HeroSection />
    <PhilosophySection />
    <JourneySection/>
    <ExperienceSection/>
    <TravelSupportSection/>
    <WhyVedicSection />
    <CertificateSection />
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