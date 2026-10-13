<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

import type {
  Enquiry,
} from '~/composables/useEnquiries'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const { admin } = useAuth()

const {
  journeys,
  fetchJourneys,
} = useJourneys()

const {
  destinations,
  fetchDestinations,
} = useDestinations()

const {
  fetchEnquiries,
} = useEnquiries()

const {
  articles,
  fetchArticles,
} = useJournal()

const {
  testimonials,
  certificates,
  fetchTestimonials,
  fetchCertificates,
} = useTrustContent()

const loading = ref(true)

const error =
  ref<string | null>(null)

const totalJourneys = ref(0)
const totalDestinations = ref(0)
const newEnquiries = ref(0)
const totalArticles = ref(0)

const recentEnquiries =
  ref<Enquiry[]>([])

const publishedJourneys =
  computed(() =>
    journeys.value.filter(
      item => item.isPublished,
    ).length,
  )

const publishedDestinations =
  computed(() =>
    destinations.value.filter(
      item => item.isPublished,
    ).length,
  )

const publishedTestimonials =
  computed(() =>
    testimonials.value.filter(
      item => item.isPublished,
    ).length,
  )

const publishedCertificates =
  computed(() =>
    certificates.value.filter(
      item => item.isPublished,
    ).length,
  )

const loadDashboard = async () => {
  loading.value = true
  error.value = null

  try {
    await Promise.all([
      fetchJourneys(),
      fetchDestinations(),

      fetchEnquiries({
        page: 1,
        limit: 5,
        status: 'new',
      }),

      fetchArticles(),

      fetchTestimonials(),
      fetchCertificates(),
    ])

    totalJourneys.value =
      journeys.value.length

    totalDestinations.value =
      destinations.value.length

    totalArticles.value =
      articles.value.length

    const enquiryComposable =
      useEnquiries()

    newEnquiries.value =
      enquiryComposable.pagination.value.total

    recentEnquiries.value =
      enquiryComposable.enquiries.value.slice(
        0,
        5,
      )
  } catch (err: any) {
    console.error(
      'Dashboard load error:',
      err,
    )

    error.value =
      err?.data?.message ||
      err?.message ||
      'Unable to load dashboard data.'
  } finally {
    loading.value = false
  }
}

const formatLabel = (
  value?: string,
) => {
  if (!value) return '—'

  return value
    .replace(/_/g, ' ')
    .replace(
      /\b\w/g,
      char => char.toUpperCase(),
    )
}

const formatDate = (
  value?: string,
) => {
  if (!value) return '—'

  return new Intl.DateTimeFormat(
    'en-IN',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    },
  ).format(new Date(value))
}

const journeyName = (
  item: Enquiry,
) => {
  if (
    item.journey &&
    typeof item.journey === 'object'
  ) {
    return item.journey.title
  }

  return (
    item.destination ||
    'General enquiry'
  )
}

onMounted(loadDashboard)
</script>

<template>
  <div class="dashboard page-enter">

    <!-- HEADER -->
    <header class="page-heading">
      <div>
        <p class="eyebrow">
          TRAVEL CONSOLE
        </p>

        <h1>
          Welcome back,
          {{ admin?.name || 'Admin' }}.
        </h1>

        <p class="subtitle">
          Manage journeys, traveller enquiries
          and Vedic Journey website content
          from one place.
        </p>
      </div>

      <button
        type="button"
        class="primary-button"
        @click="navigateTo('/journeys')"
      >
        <span>＋</span>
        Create Journey
      </button>
    </header>

    <!-- ERROR -->
    <section
      v-if="error"
      class="error-card"
    >
      <div>
        <strong>
          Dashboard data couldn't be loaded.
        </strong>

        <p>{{ error }}</p>
      </div>

      <button @click="loadDashboard">
        Try Again
      </button>
    </section>

    <!-- STATS -->
    <section class="stats">
      <article class="stat-card">
        <div class="stat-top">
          <span class="stat-label">
            JOURNEYS
          </span>

          <span class="stat-icon">
            J
          </span>
        </div>

        <strong>
          {{ loading ? '—' : totalJourneys }}
        </strong>

        <p>
          {{ publishedJourneys }}
          published journeys
        </p>
      </article>

      <article class="stat-card">
        <div class="stat-top">
          <span class="stat-label">
            DESTINATIONS
          </span>

          <span class="stat-icon">
            D
          </span>
        </div>

        <strong>
          {{
            loading
              ? '—'
              : totalDestinations
          }}
        </strong>

        <p>
          {{ publishedDestinations }}
          published destinations
        </p>
      </article>

      <article
        class="stat-card enquiry-stat"
        @click="
          navigateTo('/enquiries')
        "
      >
        <div class="stat-top">
          <span class="stat-label">
            NEW ENQUIRIES
          </span>

          <span class="stat-icon">
            E
          </span>
        </div>

        <strong>
          {{ loading ? '—' : newEnquiries }}
        </strong>

        <p>
          Awaiting your attention
        </p>
      </article>

      <article class="stat-card accent">
        <div class="stat-top">
          <span class="stat-label">
            JOURNAL
          </span>

          <span class="stat-icon">
            A
          </span>
        </div>

        <strong>
          {{ loading ? '—' : totalArticles }}
        </strong>

        <p>
          Journal articles
        </p>
      </article>
    </section>

    <!-- MAIN GRID -->
    <section class="dashboard-grid">

      <!-- RECENT ENQUIRIES -->
      <article class="dashboard-card enquiries-card">
        <header class="card-header">
          <div>
            <span class="section-eyebrow">
              TRAVELLER REQUESTS
            </span>

            <h2>New Enquiries</h2>

            <p>
              Latest enquiries waiting
              for attention.
            </p>
          </div>

          <button
            type="button"
            class="text-button"
            @click="
              navigateTo('/enquiries')
            "
          >
            View all
            <span>→</span>
          </button>
        </header>

        <div
          v-if="loading"
          class="loading-state"
        >
          Loading enquiries...
        </div>

        <div
          v-else-if="
            !recentEnquiries.length
          "
          class="empty-state"
        >
          <div class="empty-symbol">
            ✓
          </div>

          <strong>
            You're all caught up
          </strong>

          <p>
            There are currently no new
            traveller enquiries.
          </p>
        </div>

        <div
          v-else
          class="enquiry-list"
        >
          <button
            v-for="item in recentEnquiries"
            :key="item._id"
            type="button"
            class="enquiry-row"
            @click="
              navigateTo('/enquiries')
            "
          >
            <div class="traveller-avatar">
              {{
                item.name
                  .charAt(0)
                  .toUpperCase()
              }}
            </div>

            <div class="traveller-info">
              <strong>
                {{ item.name }}
              </strong>

              <span>
                {{
                  journeyName(item)
                }}
              </span>
            </div>

            <div class="enquiry-type">
              {{
                formatLabel(
                  item.type,
                )
              }}
            </div>

            <div class="enquiry-date">
              {{
                formatDate(
                  item.createdAt,
                )
              }}
            </div>

            <div class="row-arrow">
              →
            </div>
          </button>
        </div>
      </article>

      <!-- QUICK ACTIONS -->
      <article class="dashboard-card quick-card">
        <header class="card-header">
          <div>
            <span class="section-eyebrow">
              SHORTCUTS
            </span>

            <h2>Quick Actions</h2>

            <p>
              Common content management
              tasks.
            </p>
          </div>
        </header>

        <div class="quick-actions">
          <button
            @click="
              navigateTo('/journeys')
            "
          >
            <span class="quick-icon">
              J
            </span>

            <span>
              <strong>
                Create Journey
              </strong>

              <small>
                Add a new itinerary
              </small>
            </span>

            <b>→</b>
          </button>

          <button
            @click="
              navigateTo(
                '/destinations',
              )
            "
          >
            <span class="quick-icon">
              D
            </span>

            <span>
              <strong>
                Add Destination
              </strong>

              <small>
                Manage destination content
              </small>
            </span>

            <b>→</b>
          </button>

          <button
            @click="
              navigateTo('/media')
            "
          >
            <span class="quick-icon">
              M
            </span>

            <span>
              <strong>
                Media Library
              </strong>

              <small>
                Upload images and video
              </small>
            </span>

            <b>→</b>
          </button>

          <button
            @click="
              navigateTo('/pages')
            "
          >
            <span class="quick-icon">
              P
            </span>

            <span>
              <strong>
                Website Pages
              </strong>

              <small>
                Edit website content
              </small>
            </span>

            <b>→</b>
          </button>
        </div>
      </article>

      <!-- CONTENT OVERVIEW -->
      <article class="dashboard-card content-card">
        <header class="card-header">
          <div>
            <span class="section-eyebrow">
              WEBSITE CONTENT
            </span>

            <h2>Published Content</h2>

            <p>
              Live content currently available
              for the public website.
            </p>
          </div>
        </header>

        <div class="content-overview">
          <button
            @click="
              navigateTo('/journeys')
            "
          >
            <span>Journeys</span>

            <strong>
              {{ publishedJourneys }}
            </strong>
          </button>

          <button
            @click="
              navigateTo(
                '/destinations',
              )
            "
          >
            <span>Destinations</span>

            <strong>
              {{ publishedDestinations }}
            </strong>
          </button>

          <button
            @click="
              navigateTo('/trust')
            "
          >
            <span>Testimonials</span>

            <strong>
              {{ publishedTestimonials }}
            </strong>
          </button>

          <button
            @click="
              navigateTo('/trust')
            "
          >
            <span>
              Awards & Credentials
            </span>

            <strong>
              {{ publishedCertificates }}
            </strong>
          </button>
        </div>
      </article>

      <!-- BRAND CARD -->
      <article class="brand-card">
        <div class="brand-mark">
          VJ
        </div>

        <span class="brand-eyebrow">
          VEDIC JOURNEY
        </span>

        <h2>
          Luxury Travel
          <br>
          Redefined.
        </h2>

        <p>
          Curate exceptional journeys,
          publish inspiring stories and
          manage every traveller enquiry
          from your travel console.
        </p>

        <button
          type="button"
          @click="
            navigateTo('/settings')
          "
        >
          Website Settings
          <span>→</span>
        </button>
      </article>
    </section>
  </div>
</template>

<style scoped>
.dashboard {
  width: 100%;
  padding-bottom: 50px;
}

/* HEADER */

.page-heading {
  margin-bottom: 30px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 30px;
}

.eyebrow {
  margin: 0 0 9px;
  color: var(--brand-dark);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: .15em;
}

h1 {
  margin: 0;
  color: var(--text);
  font-size: 42px;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -.035em;
}

.subtitle {
  max-width: 640px;
  margin: 11px 0 0;
  color: var(--muted);
  font-size: 15px;
  line-height: 1.6;
}

.primary-button {
  min-height: 46px;
  padding: 0 18px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 0;
  border-radius: 10px;
  background: var(--brand-gradient);
  color: #fff;
  font: inherit;
  font-size: 14px;
  font-weight: 750;
  box-shadow:
    0 9px 24px
    rgba(166, 15, 165, .17);
  cursor: pointer;
}

.primary-button span {
  font-size: 18px;
}

/* ERROR */

.error-card {
  margin-bottom: 18px;
  padding: 17px 19px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  border: 1px solid #efd1d5;
  border-radius: 13px;
  background: #fff7f8;
}

.error-card strong {
  color: #9f414b;
  font-size: 15px;
}

.error-card p {
  margin: 5px 0 0;
  color: #9b656b;
  font-size: 13px;
}

.error-card button {
  min-height: 39px;
  padding: 0 14px;
  border: 1px solid #e5bdc2;
  border-radius: 8px;
  background: #fff;
  color: #a8434d;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

/* STATS */

.stats {
  margin-bottom: 18px;
  display: grid;
  grid-template-columns:
    repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.stat-card {
  min-height: 145px;
  padding: 21px;
  box-sizing: border-box;
  border: 1px solid var(--border);
  border-radius: 15px;
  background: var(--surface);
  box-shadow:
    0 9px 28px
    rgba(35, 15, 32, .035);
}

.stat-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.stat-label {
  color: #766c74;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: .08em;
}

.stat-icon {
  width: 31px;
  height: 31px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: #f7eaf5;
  color: var(--brand-dark);
  font-size: 12px;
  font-weight: 850;
}

.stat-card > strong {
  margin: 18px 0 7px;
  display: block;
  color: var(--text);
  font-size: 32px;
  font-weight: 750;
  line-height: 1;
}

.stat-card > p {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.4;
}

.stat-card.accent {
  border-color:
    rgba(216, 11, 185, .14);
  background:
    linear-gradient(
      145deg,
      #fff,
      #fff7fd
    );
}

.stat-card.accent > strong {
  color: var(--brand-dark);
}

.enquiry-stat {
  cursor: pointer;
  transition:
    transform .18s ease,
    box-shadow .18s ease;
}

.enquiry-stat:hover {
  transform: translateY(-2px);
  box-shadow:
    0 15px 34px
    rgba(35, 15, 32, .07);
}

/* DASHBOARD GRID */

.dashboard-grid {
  display: grid;
  grid-template-columns:
    minmax(0, 1.6fr)
    minmax(300px, .75fr);
  gap: 18px;
}

.dashboard-card {
  border: 1px solid var(--border);
  border-radius: 16px;
  background: #fff;
  box-shadow:
    0 9px 28px
    rgba(35, 15, 32, .035);
}

.card-header {
  padding: 22px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  border-bottom:
    1px solid #f0ebef;
}

.section-eyebrow {
  color: var(--brand-dark);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .11em;
}

.card-header h2 {
  margin: 7px 0 0;
  color: #373136;
  font-size: 19px;
  font-weight: 700;
}

.card-header p {
  margin: 6px 0 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.5;
}

.text-button {
  padding: 5px 0;
  border: 0;
  background: transparent;
  color: var(--brand-dark);
  font: inherit;
  font-size: 13px;
  font-weight: 750;
  white-space: nowrap;
  cursor: pointer;
}

.text-button span {
  margin-left: 4px;
}

/* ENQUIRIES */

.enquiry-list {
  padding: 0 20px;
}

.enquiry-row {
  width: 100%;
  min-height: 76px;
  padding: 12px 2px;
  display: grid;
  grid-template-columns:
    44px
    minmax(150px, 1fr)
    100px
    115px
    20px;
  align-items: center;
  gap: 12px;
  border: 0;
  border-bottom:
    1px solid #f0ebef;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.enquiry-row:last-child {
  border-bottom: 0;
}

.enquiry-row:hover {
  background: #fdfafd;
}

.traveller-avatar {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #f7eaf5;
  color: var(--brand-dark);
  font-size: 14px;
  font-weight: 800;
}

.traveller-info {
  min-width: 0;
}

.traveller-info strong,
.traveller-info span {
  display: block;
}

.traveller-info strong {
  color: #40383e;
  font-size: 14px;
  font-weight: 700;
}

.traveller-info span {
  margin-top: 4px;
  overflow: hidden;
  color: var(--muted);
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.enquiry-type {
  color: #675e65;
  font-size: 13px;
  font-weight: 650;
}

.enquiry-date {
  color: #81777f;
  font-size: 13px;
}

.row-arrow {
  color: var(--brand-dark);
  font-size: 16px;
  font-weight: 700;
}

/* LOADING / EMPTY */

.loading-state,
.empty-state {
  min-height: 260px;
  padding: 25px;
  display: grid;
  place-items: center;
  align-content: center;
  text-align: center;
}

.loading-state {
  color: var(--muted);
  font-size: 14px;
}

.empty-symbol {
  width: 44px;
  height: 44px;
  margin-bottom: 12px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #edf7f2;
  color: var(--success);
  font-size: 18px;
  font-weight: 800;
}

.empty-state strong {
  color: #40383e;
  font-size: 16px;
}

.empty-state p {
  max-width: 330px;
  margin: 6px 0 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.55;
}

/* QUICK ACTIONS */

.quick-actions {
  padding: 10px 18px 18px;
}

.quick-actions button {
  width: 100%;
  min-height: 68px;
  padding: 10px 4px;
  display: grid;
  grid-template-columns:
    40px 1fr 20px;
  align-items: center;
  gap: 11px;
  border: 0;
  border-bottom:
    1px solid #f0ebef;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.quick-actions button:last-child {
  border-bottom: 0;
}

.quick-actions button:hover {
  background: #fdfafd;
}

.quick-icon {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 9px;
  background: #f7eaf5;
  color: var(--brand-dark);
  font-size: 13px;
  font-weight: 850;
}

.quick-actions strong,
.quick-actions small {
  display: block;
}

.quick-actions strong {
  color: #494148;
  font-size: 14px;
  font-weight: 700;
}

.quick-actions small {
  margin-top: 4px;
  color: var(--muted);
  font-size: 12px;
}

.quick-actions b {
  color: var(--brand-dark);
  font-size: 16px;
}

/* CONTENT OVERVIEW */

.content-overview {
  padding: 18px;
  display: grid;
  grid-template-columns:
    repeat(2, 1fr);
  gap: 10px;
}

.content-overview button {
  min-height: 92px;
  padding: 15px;
  border: 1px solid #eee8ec;
  border-radius: 11px;
  background: #faf8f9;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    border-color .18s ease,
    background .18s ease;
}

.content-overview button:hover {
  border-color: #ddced9;
  background: #fff;
}

.content-overview span,
.content-overview strong {
  display: block;
}

.content-overview span {
  color: #756b73;
  font-size: 13px;
  font-weight: 650;
}

.content-overview strong {
  margin-top: 9px;
  color: #302a2f;
  font-size: 25px;
  font-weight: 750;
}

/* BRAND */

.brand-card {
  padding: 27px;
  border-radius: 16px;
  background:
    linear-gradient(
      145deg,
      #151116 0%,
      #251622 60%,
      #3a1735 100%
    );
  color: #fff;
  box-shadow:
    0 14px 35px
    rgba(25, 8, 22, .14);
}

.brand-mark {
  width: 46px;
  height: 46px;
  margin-bottom: 23px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: var(--brand-gradient);
  color: #fff;
  font-size: 13px;
  font-weight: 850;
}

.brand-eyebrow {
  color: #eaa6df;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .13em;
}

.brand-card h2 {
  margin: 10px 0 12px;
  color: #fff;
  font-size: 25px;
  font-weight: 650;
  line-height: 1.25;
}

.brand-card p {
  margin: 0;
  color: #c6bac3;
  font-size: 13px;
  line-height: 1.7;
}

.brand-card button {
  width: 100%;
  min-height: 43px;
  margin-top: 24px;
  padding: 0 13px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border:
    1px solid rgba(255,255,255,.14);
  border-radius: 9px;
  background:
    rgba(255,255,255,.07);
  color: #fff;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

/* RESPONSIVE */

@media (max-width: 1150px) {
  .stats {
    grid-template-columns:
      repeat(2, 1fr);
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 750px) {
  .page-heading {
    align-items: stretch;
    flex-direction: column;
  }

  h1 {
    font-size: 34px;
  }

  .primary-button {
    justify-content: center;
  }

  .stats {
    grid-template-columns: 1fr;
  }

  .enquiry-row {
    grid-template-columns:
      42px 1fr 20px;
  }

  .enquiry-type,
  .enquiry-date {
    display: none;
  }
}

@media (max-width: 550px) {
  .content-overview {
    grid-template-columns: 1fr;
  }
}
</style>