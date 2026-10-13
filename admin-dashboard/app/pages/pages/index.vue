<template>
  <div class="pages-page">
    <header class="page-header">
      <div>
        <span class="eyebrow">CONTENT MANAGEMENT</span>
        <h1>Pages</h1>
        <p>
          Manage the content, publishing status and SEO settings
          for the main Vedic Journey website pages.
        </p>
      </div>
    </header>

    <!-- Stats -->
    <section class="summary-grid">
      <article class="summary-card">
        <span class="summary-label">TOTAL PAGES</span>
        <strong>{{ pages.length }}</strong>
        <p>Website content pages</p>
      </article>

      <article class="summary-card">
        <span class="summary-label">PUBLISHED</span>
        <strong>{{ publishedCount }}</strong>
        <p>Currently visible</p>
      </article>

      <article class="summary-card">
        <span class="summary-label">DRAFTS</span>
        <strong>{{ draftCount }}</strong>
        <p>Not publicly visible</p>
      </article>
    </section>

    <!-- Error -->
    <div
      v-if="error"
      class="error-state"
    >
      <div>
        <strong>Unable to load pages</strong>
        <span>{{ error }}</span>
      </div>

      <button @click="loadPages">
        Try Again
      </button>
    </div>

    <!-- Loading -->
    <div
      v-else-if="loading"
      class="pages-grid"
    >
      <div
        v-for="index in 4"
        :key="index"
        class="page-card skeleton-card"
      >
        <div class="skeleton skeleton-icon" />
        <div class="skeleton skeleton-title" />
        <div class="skeleton skeleton-text" />
      </div>
    </div>

    <!-- Empty -->
    <div
      v-else-if="!pages.length"
      class="empty-state"
    >
      <div class="empty-icon">VJ</div>

      <h3>No pages found</h3>

      <p>
        No Page CMS records are currently available.
      </p>
    </div>

    <!-- Pages -->
    <section
      v-else
      class="pages-grid"
    >
      <article
        v-for="page in sortedPages"
        :key="page._id"
        class="page-card"
      >
        <div class="card-top">
          <div
            class="page-icon"
            :class="`page-icon--${page.key}`"
          >
            {{ pageInitial(page.key) }}
          </div>

          <span
            class="status"
            :class="
              page.isPublished
                ? 'published'
                : 'draft'
            "
          >
            <span />
            {{
              page.isPublished
                ? 'Published'
                : 'Draft'
            }}
          </span>
        </div>

        <div class="card-content">
          <span class="page-key">
            {{ page.key }}
          </span>

          <h2>
            {{ pageName(page.key) }}
          </h2>

          <p>
            {{ pageDescription(page.key) }}
          </p>
        </div>

        <div class="page-meta">
          <div>
            <span>SEO TITLE</span>

            <strong>
              {{ page.seo?.title || 'Not configured' }}
            </strong>
          </div>

          <div>
            <span>LAST UPDATED</span>

            <strong>
              {{ formatDate(page.updatedAt) }}
            </strong>
          </div>
        </div>

        <footer class="card-footer">
          <button
            type="button"
            class="edit-button"
            @click="editPage(page.key)"
          >
            Edit Page

            <span>→</span>
          </button>
        </footer>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import type {
  AdminPage,
} from '~/composables/usePages'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const {
  pages,
  loading,
  error,
  fetchPages,
} = usePages()

const pageOrder = [
  'home',
  'about',
  'destinations',
  'contact',
]

const publishedCount = computed(() =>
  pages.value.filter(
    page => page.isPublished,
  ).length,
)

const draftCount = computed(() =>
  pages.value.filter(
    page => !page.isPublished,
  ).length,
)

const sortedPages = computed(() => {
  return [...pages.value].sort(
    (a, b) => {
      const aIndex =
        pageOrder.indexOf(a.key)

      const bIndex =
        pageOrder.indexOf(b.key)

      return (
        (aIndex === -1 ? 999 : aIndex) -
        (bIndex === -1 ? 999 : bIndex)
      )
    },
  )
})

const pageName = (key: string) => {
  const names: Record<string, string> = {
    home: 'Home Page',
    about: 'About Page',
    destinations: 'Destinations Page',
    contact: 'Contact Page',
  }

  return names[key] || key
}

const pageDescription = (
  key: string,
) => {
  const descriptions:
    Record<string, string> = {
      home:
        'Manage the homepage hero, featured content, journeys, destinations and storytelling sections.',

      about:
        'Manage the Vedic Journey story, founder content, values and supporting brand sections.',

      destinations:
        'Manage the destinations landing page introduction, presentation and supporting sections.',

      contact:
        'Manage contact page messaging, introduction and enquiry-related content.',
    }

  return (
    descriptions[key] ||
    'Manage page content and SEO settings.'
  )
}

const pageInitial = (
  key: string,
) => {
  const initials:
    Record<string, string> = {
      home: 'H',
      about: 'A',
      destinations: 'D',
      contact: 'C',
    }

  return (
    initials[key] ||
    key.charAt(0).toUpperCase()
  )
}

const formatDate = (
  value?: string,
) => {
  if (!value) {
    return '—'
  }

  return new Intl.DateTimeFormat(
    'en-IN',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    },
  ).format(new Date(value))
}

const editPage = (
  key: string,
) => {
  navigateTo(`/pages/${key}`)
}

const loadPages = async () => {
  try {
    await fetchPages()
  } catch {
    // composable handles error
  }
}

onMounted(loadPages)
</script>

<style scoped>
.pages-page {
  width: 100%;
}

.page-header {
  margin-bottom: 30px;
}

.eyebrow {
  display: block;
  margin-bottom: 8px;
  color: #a20eac;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.16em;
}

.page-header h1 {
  margin: 0;
  color: #211d21;
  font-size: 42px;
  line-height: 1.05;
  letter-spacing: -0.035em;
}

.page-header p {
  max-width: 650px;
  margin: 11px 0 0;
  color: #80777f;
  font-size: 14px;
  line-height: 1.65;
}

/* Summary */

.summary-grid {
  margin-bottom: 24px;
  display: grid;
  grid-template-columns:
    repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.summary-card {
  padding: 20px;
  border: 1px solid #ebe5ea;
  border-radius: 16px;
  background: #fff;
  box-shadow:
    0 10px 28px rgba(35, 15, 32, 0.035);
}

.summary-label {
  color: #938991;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.13em;
}

.summary-card strong {
  margin-top: 17px;
  display: block;
  color: #211d21;
  font-size: 28px;
  line-height: 1;
}

.summary-card p {
  margin: 8px 0 0;
  color: #938991;
  font-size: 12px;
}

/* Pages */

.pages-grid {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.page-card {
  min-height: 340px;
  padding: 23px;
  display: flex;
  flex-direction: column;
  border: 1px solid #ebe5ea;
  border-radius: 18px;
  background: #fff;
  box-shadow:
    0 12px 35px rgba(35, 15, 32, 0.045);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.page-card:hover {
  transform: translateY(-2px);
  border-color: #e2d8df;
  box-shadow:
    0 17px 42px rgba(35, 15, 32, 0.07);
}

.card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 15px;
}

.page-icon {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border-radius: 13px;
  background:
    linear-gradient(
      135deg,
      #f9e9f6,
      #eee5f0
    );
  color: #a20eac;
  font-size: 16px;
  font-weight: 850;
}

.status {
  padding: 7px 9px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 750;
}

.status span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status.published {
  background: #eef7f3;
  color: #32785d;
}

.status.published span {
  background: #328462;
}

.status.draft {
  background: #f4f1f3;
  color: #756c73;
}

.status.draft span {
  background: #aaa0a8;
}

.card-content {
  margin-top: 25px;
}

.page-key {
  color: #a20eac;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.card-content h2 {
  margin: 7px 0 8px;
  color: #292328;
  font-size: 21px;
}

.card-content p {
  min-height: 62px;
  margin: 0;
  color: #827981;
  font-size: 13px;
  line-height: 1.6;
}

.page-meta {
  margin-top: 22px;
  padding: 15px 0;
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 15px;
  border-top: 1px solid #f0ebef;
  border-bottom: 1px solid #f0ebef;
}

.page-meta div {
  min-width: 0;
}

.page-meta span {
  display: block;
  margin-bottom: 5px;
  color: #a0969e;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.1em;
}

.page-meta strong {
  display: block;
  overflow: hidden;
  color: #554d53;
  font-size: 11px;
  font-weight: 650;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-footer {
  margin-top: auto;
  padding-top: 17px;
}

.edit-button {
  width: 100%;
  height: 43px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #e7dfe5;
  border-radius: 9px;
  background: #fff;
  color: #514950;
  font-family: inherit;
  font-size: 13px;
  font-weight: 750;
  cursor: pointer;
  transition: all 0.18s ease;
}

.edit-button span {
  color: #b014ae;
  font-size: 17px;
}

.edit-button:hover {
  border-color:
    rgba(216, 11, 185, 0.3);
  background: #fff9fe;
  color: #a20eac;
}

/* Error */

.error-state {
  padding: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  border: 1px solid #f0d0d4;
  border-radius: 14px;
  background: #fff6f7;
}

.error-state div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.error-state strong {
  color: #9e3c47;
  font-size: 14px;
}

.error-state span {
  color: #a96971;
  font-size: 12px;
}

.error-state button {
  min-height: 39px;
  padding: 0 14px;
  border: 1px solid #e9c5c9;
  border-radius: 8px;
  background: #fff;
  color: #a03f49;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

/* Empty */

.empty-state {
  min-height: 330px;
  display: grid;
  place-items: center;
  align-content: center;
  text-align: center;
}

.empty-icon {
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  background:
    linear-gradient(
      135deg,
      #f9e9f6,
      #eee5f0
    );
  color: #a20eac;
  font-size: 14px;
  font-weight: 850;
}

.empty-state h3 {
  margin: 15px 0 6px;
  color: #302a2f;
  font-size: 18px;
}

.empty-state p {
  margin: 0;
  color: #8b8189;
  font-size: 13px;
}

/* Skeleton */

.skeleton-card {
  pointer-events: none;
}

.skeleton {
  position: relative;
  overflow: hidden;
  border-radius: 7px;
  background: #f0ecef;
}

.skeleton::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.7),
      transparent
    );
  animation: shimmer 1.4s infinite;
}

.skeleton-icon {
  width: 48px;
  height: 48px;
  border-radius: 13px;
}

.skeleton-title {
  width: 45%;
  height: 18px;
  margin-top: 30px;
}

.skeleton-text {
  width: 80%;
  height: 11px;
  margin-top: 12px;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

@media (max-width: 900px) {
  .pages-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .page-header h1 {
    font-size: 34px;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .page-meta {
    grid-template-columns: 1fr;
  }
}

@media (
  prefers-reduced-motion: reduce
) {
  *,
  *::before,
  *::after {
    animation: none !important;
    transition: none !important;
  }
}
</style>