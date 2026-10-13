<template>
  <div class="section-heading">
    <span class="section-number">
      {{ number }}
    </span>

    <div>
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  number: string
  title: string
  description: string
}>()
</script>

<style scoped>
.section-heading {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 26px;
}

.section-number {
  padding-top: 4px;
  color: #d80bb9;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
}

h3 {
  margin: 0;
  color: #211d21;
  font-size: 21px;
  line-height: 1.25;
}

p {
  margin: 5px 0 0;
  color: #80777f;
  font-size: 13px;
  line-height: 1.55;
}
</style>