<script setup lang="ts">
import CustomCursor from '~/components/ui/CustomCursor.vue'
import SiteFooter from '~/components/layout/SiteFooter.vue'
</script>

<template>
  <div class="app-wrapper">
    <NuxtPage />

    <SiteFooter />

    <CustomCursor />
  </div>
</template>