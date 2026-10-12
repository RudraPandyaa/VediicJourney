<script setup lang="ts">
import AdminSidebar from '../components/layout/AdminSidebar.vue'
import AdminHeader from '../components/layout/AdminHeader.vue'
</script>

<template>
  <div class="admin-layout">
    <AdminSidebar />

    <div class="workspace">
      <AdminHeader />

      <main class="page-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.admin-layout {
  min-height: 100vh;
  background: var(--bg);
}

.workspace {
  min-height: 100vh;
  margin-left: 292px;
}

.page-content {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 40px 42px 64px;
}

@media (max-width: 900px) {
  .workspace {
    margin-left: 0;
  }

  .page-content {
    padding: 24px 20px 50px;
  }
}
</style>