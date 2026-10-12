<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const { admin } = useAuth()
</script>

<template>
  <div class="dashboard page-enter">
    <div class="page-heading">
      <div>
        <p class="eyebrow">
          TRAVEL CONSOLE
        </p>

        <h1>
          Welcome back,
          {{ admin?.name || 'Admin' }}.
        </h1>

        <p class="subtitle">
          Manage extraordinary journeys
          across the world.
        </p>
      </div>

      <button class="primary-button">
        <span>＋</span>
        Create Journey
      </button>
    </div>

    <div class="stats">
      <article class="stat-card reveal-card interactive-card">
        <span class="stat-label">
          JOURNEYS
        </span>

        <strong>—</strong>

        <p>Curated itineraries</p>
      </article>

      <article class="stat-card reveal-card interactive-card">
        <span class="stat-label">
          DESTINATIONS
        </span>

        <strong>—</strong>

        <p>Across the world</p>
      </article>

      <article class="stat-card reveal-card interactive-card">
        <span class="stat-label">
          NEW ENQUIRIES
        </span>

        <strong>—</strong>

        <p>Awaiting attention</p>
      </article>

      <article class="stat-card accent reveal-card interactive-card">
        <span class="stat-label">
          WEBSITE
        </span>

        <strong>Live</strong>

        <p>Content management</p>
      </article>
    </div>

    <section class="empty-dashboard">
      <div class="symbol">
        ✦
      </div>

      <p class="eyebrow">
        VEDIC JOURNEY
      </p>

      <h2>
        Your travel command centre.
      </h2>

      <p>
        Dashboard analytics and recent
        enquiries will appear here as we
        connect the CMS modules.
      </p>
    </section>
  </div>
</template>

<style scoped>
.page-heading {
  display: flex;
  margin-bottom: 30px;
  align-items: flex-end;
  justify-content: space-between;
  gap: 30px;
}

.eyebrow {
  margin: 0 0 9px;
  color: var(--brand-dark);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.18em;
}

h1 {
  margin: 0;
  color: var(--text);
  font-family: Georgia, serif;
  font-size: 38px;
  font-weight: 400;
  letter-spacing: -0.025em;
}

.subtitle {
  margin: 10px 0 0;
  color: var(--muted);
  font-size: 13px;
}

.primary-button {
  display: flex;
  min-height: 44px;
  padding: 0 18px;
  border: 0;
  border-radius: 9px;
  align-items: center;
  gap: 8px;
  background: var(--brand-gradient);
  color: white;
  font-size: 12px;
  font-weight: 600;
  box-shadow:
    0 8px 20px
    rgba(166, 15, 165, 0.18);
}

.stats {
  display: grid;
  margin-bottom: 28px;
  grid-template-columns:
    repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.stat-card {
  padding: 22px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: var(--shadow);
}

.stat-label {
  color: var(--muted);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.14em;
}

.stat-card strong {
  display: block;
  margin: 15px 0 5px;
  color: var(--text);
  font-family: Georgia, serif;
  font-size: 30px;
  font-weight: 400;
}

.stat-card p {
  margin: 0;
  color: var(--muted);
  font-size: 11px;
}

.stat-card.accent {
  border-color:
    rgba(216, 11, 185, 0.13);
  background:
    linear-gradient(
      145deg,
      #fff,
      #fff7fd
    );
}

.stat-card.accent strong {
  color: var(--brand-dark);
}

.empty-dashboard {
  padding: 70px 30px;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  text-align: center;
  background: var(--surface);
}

.symbol {
  display: grid;
  width: 48px;
  height: 48px;
  margin: 0 auto 22px;
  border-radius: 14px;
  place-items: center;
  background: var(--brand-gradient);
  color: white;
}

.empty-dashboard h2 {
  margin: 0 0 10px;
  font-family: Georgia, serif;
  font-size: 27px;
  font-weight: 400;
}

.empty-dashboard > p:last-child {
  max-width: 480px;
  margin: auto;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.7;
}

@media (max-width: 1100px) {
  .stats {
    grid-template-columns:
      repeat(2, 1fr);
  }
}
</style>