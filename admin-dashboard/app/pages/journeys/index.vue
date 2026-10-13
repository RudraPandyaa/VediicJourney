<template>
  <div class="journeys-page">
    <!-- =========================
         PAGE HEADER
    ========================== -->
    <header class="page-header">
      <div>
        <span class="eyebrow">JOURNEY MANAGEMENT</span>

        <h1>Journeys</h1>

        <p>
          Create and manage bespoke travel journeys,
          itineraries and publishing visibility.
        </p>
      </div>

      <button
        type="button"
        class="primary-button"
        @click="openCreate"
      >
        <span class="button-plus">+</span>
        Create Journey
      </button>
    </header>

    <!-- =========================
         SUMMARY
    ========================== -->
    <section class="summary-grid">
      <article class="summary-card">
        <div class="summary-top">
          <span class="summary-label">TOTAL JOURNEYS</span>
          <span class="summary-icon">01</span>
        </div>

        <strong>{{ journeys.length }}</strong>

        <p>All curated journeys</p>
      </article>

      <article class="summary-card">
        <div class="summary-top">
          <span class="summary-label">PUBLISHED</span>
          <span class="summary-dot published-dot" />
        </div>

        <strong>{{ publishedCount }}</strong>

        <p>Visible on the website</p>
      </article>

      <article class="summary-card">
        <div class="summary-top">
          <span class="summary-label">DRAFTS</span>
          <span class="summary-dot draft-dot" />
        </div>

        <strong>{{ draftCount }}</strong>

        <p>Not publicly visible</p>
      </article>

      <article class="summary-card">
        <div class="summary-top">
          <span class="summary-label">FEATURED</span>
          <span class="featured-mark">✦</span>
        </div>

        <strong>{{ featuredCount }}</strong>

        <p>Available for featured sections</p>
      </article>
    </section>

    <!-- =========================
         CONTENT CARD
    ========================== -->
    <section class="content-card">
      <!-- Toolbar -->
      <div class="toolbar">
        <div class="search-box">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
            />
          </svg>

          <input
            v-model="search"
            type="search"
            placeholder="Search journeys..."
          />
        </div>

        <div class="filters">
          <select v-model="statusFilter">
            <option value="all">
              All status
            </option>

            <option value="published">
              Published
            </option>

            <option value="draft">
              Draft
            </option>
          </select>

          <select v-model="featuredFilter">
            <option value="all">
              All journeys
            </option>

            <option value="featured">
              Featured
            </option>

            <option value="standard">
              Not featured
            </option>
          </select>
        </div>
      </div>

      <!-- Error -->
      <div
        v-if="error"
        class="page-error"
      >
        <div>
          <strong>Unable to load journeys</strong>
          <span>{{ error }}</span>
        </div>

        <button
          type="button"
          @click="loadJourneys"
        >
          Try Again
        </button>
      </div>

      <!-- Loading -->
      <div
        v-else-if="loading"
        class="loading-list"
      >
        <div
          v-for="index in 5"
          :key="index"
          class="loading-row"
        >
          <div class="skeleton skeleton-image" />

          <div class="skeleton-content">
            <div class="skeleton skeleton-title" />
            <div class="skeleton skeleton-text" />
          </div>

          <div class="skeleton skeleton-small" />
          <div class="skeleton skeleton-small" />
        </div>
      </div>

      <!-- Empty -->
      <div
        v-else-if="!filteredJourneys.length"
        class="empty-state"
      >
        <div class="empty-icon">
          VJ
        </div>

        <template v-if="journeys.length">
          <h3>No journeys found</h3>

          <p>
            Try changing your search or filters.
          </p>

          <button
            type="button"
            class="secondary-button"
            @click="clearFilters"
          >
            Clear Filters
          </button>
        </template>

        <template v-else>
          <h3>Create your first journey</h3>

          <p>
            Build curated itineraries with destinations,
            experiences and premium imagery.
          </p>

          <button
            type="button"
            class="primary-button empty-create"
            @click="openCreate"
          >
            + Create Journey
          </button>
        </template>
      </div>

      <!-- Table -->
      <div
        v-else
        class="table-wrapper"
      >
        <table>
          <thead>
            <tr>
              <th>JOURNEY</th>
              <th>DESTINATIONS</th>
              <th>DURATION</th>
              <th>STATUS</th>
              <th>ORDER</th>
              <th class="actions-column">
                ACTIONS
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="journey in filteredJourneys"
              :key="journey._id"
            >
              <!-- Journey -->
              <td>
                <div class="journey-cell">
                  <div class="journey-image">
                    <img
                      v-if="journey.heroImage?.url"
                      :src="journey.heroImage.url"
                      :alt="
                        journey.heroImage.altText ||
                        journey.title
                      "
                    />

                    <div
                      v-else
                      class="image-fallback"
                    >
                      <span>
                        {{ getInitials(journey.title) }}
                      </span>
                    </div>

                    <span
                      v-if="journey.isFeatured"
                      class="featured-badge"
                      title="Featured Journey"
                    >
                      ✦
                    </span>
                  </div>

                  <div class="journey-info">
                    <strong>
                      {{ journey.title }}
                    </strong>

                    <span>
                      /{{ journey.slug }}
                    </span>
                  </div>
                </div>
              </td>

              <!-- Destinations -->
              <td>
                <div class="destination-list">
                  <span
                    v-for="destination in visibleDestinations(
                      journey,
                    )"
                    :key="destination._id"
                    class="destination-chip"
                  >
                    {{ destination.name }}
                  </span>

                  <span
                    v-if="
                      journey.destinations.length > 2
                    "
                    class="more-chip"
                  >
                    +{{
                      journey.destinations.length - 2
                    }}
                  </span>

                  <span
                    v-if="
                      !journey.destinations.length
                    "
                    class="muted-value"
                  >
                    —
                  </span>
                </div>
              </td>

              <!-- Duration -->
              <td>
                <div class="duration-value">
                  <strong>
                    {{ journey.durationDays }}
                  </strong>

                  <span>
                    {{
                      journey.durationDays === 1
                        ? 'day'
                        : 'days'
                    }}
                  </span>
                </div>
              </td>

              <!-- Status -->
              <td>
                <span
                  class="status-badge"
                  :class="
                    journey.isPublished
                      ? 'published'
                      : 'draft'
                  "
                >
                  <span />

                  {{
                    journey.isPublished
                      ? 'Published'
                      : 'Draft'
                  }}
                </span>
              </td>

              <!-- Order -->
              <td>
                <span class="order-value">
                  {{
                    String(
                      journey.sortOrder ?? 0,
                    ).padStart(2, '0')
                  }}
                </span>
              </td>

              <!-- Actions -->
              <td>
                <div class="row-actions">
                  <button
                    type="button"
                    class="action-button edit"
                    :disabled="
                      loadingEditId === journey._id
                    "
                    @click="openEdit(journey)"
                  >
                    {{
                      loadingEditId === journey._id
                        ? 'Loading...'
                        : 'Edit'
                    }}
                  </button>

                  <button
                    type="button"
                    class="action-menu"
                    aria-label="Journey actions"
                    @click.stop="
                      toggleMenu(journey._id)
                    "
                  >
                    •••
                  </button>

                  <div
                    v-if="
                      openMenuId === journey._id
                    "
                    class="action-dropdown"
                  >
                    <button
                      type="button"
                      @click="
                        openEditFromMenu(journey)
                      "
                    >
                      Edit Journey
                    </button>

                    <button
                      type="button"
                      class="danger-action"
                      @click="
                        askDelete(journey)
                      "
                    >
                      Delete Journey
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Table footer -->
      <footer
        v-if="
          !loading &&
          filteredJourneys.length
        "
        class="table-footer"
      >
        <span>
          Showing
          <strong>
            {{ filteredJourneys.length }}
          </strong>
          of
          <strong>
            {{ journeys.length }}
          </strong>
          journeys
        </span>
      </footer>
    </section>

    <!-- =========================
         DELETE DIALOG
    ========================== -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="deleteTarget"
          class="dialog-overlay"
          @click.self="closeDelete"
        >
          <div class="delete-dialog">
            <div class="delete-icon">
              !
            </div>

            <span class="dialog-eyebrow">
              DELETE JOURNEY
            </span>

            <h3>
              Delete “{{ deleteTarget.title }}”?
            </h3>

            <p>
              This action permanently removes the journey
              and cannot be undone.
            </p>

            <div
              v-if="deleteError"
              class="delete-error"
            >
              {{ deleteError }}
            </div>

            <div class="dialog-actions">
              <button
                type="button"
                class="dialog-cancel"
                :disabled="deleting"
                @click="closeDelete"
              >
                Cancel
              </button>

              <button
                type="button"
                class="dialog-delete"
                :disabled="deleting"
                @click="confirmDelete"
              >
                {{
                  deleting
                    ? 'Deleting...'
                    : 'Delete Journey'
                }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- =========================
         JOURNEY DRAWER
    ========================== -->
    <ClientOnly>
    <JourneyFormDrawer
        :open="formOpen"
        :journey="editingJourney"
        @close="closeForm"
        @saved="handleSaved"
    />

    <template #fallback>
        <div />
    </template>
    </ClientOnly>

    <!-- Form loading overlay -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="loadingEditId"
          class="edit-loading-overlay"
        >
          <div class="edit-loading-card">
            <span class="loading-spinner" />

            <div>
              <strong>Loading journey</strong>
              <p>
                Preparing the complete journey editor...
              </p>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import JourneyFormDrawer from '~/components/journeys/JourneyFormDrawer.vue'

import type {
  Journey,
} from '~/composables/useJourneys'
definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const {
  journeys,
  loading,
  error,
  fetchJourneys,
  fetchJourney,
  deleteJourney,
} = useJourneys()

const search = ref('')
const statusFilter = ref('all')
const featuredFilter = ref('all')

const formOpen = ref(false)

const editingJourney =
  ref<Journey | null>(null)

const loadingEditId =
  ref<string | null>(null)

const openMenuId =
  ref<string | null>(null)

const deleteTarget =
  ref<Journey | null>(null)

const deleting = ref(false)

const deleteError =
  ref<string | null>(null)

const publishedCount = computed(() =>
  journeys.value.filter(
    journey => journey.isPublished,
  ).length,
)

const draftCount = computed(() =>
  journeys.value.filter(
    journey => !journey.isPublished,
  ).length,
)

const featuredCount = computed(() =>
  journeys.value.filter(
    journey => journey.isFeatured,
  ).length,
)

const filteredJourneys = computed(() => {
  const query =
    search.value.trim().toLowerCase()

  return journeys.value.filter(
    journey => {
      const destinationText =
        (journey.destinations || [])
          .map(destination =>
            typeof destination === 'string'
              ? ''
              : destination.name,
          )
          .join(' ')
          .toLowerCase()

      const matchesSearch =
        !query ||
        journey.title
          .toLowerCase()
          .includes(query) ||
        journey.slug
          .toLowerCase()
          .includes(query) ||
        destinationText.includes(query)

      const matchesStatus =
        statusFilter.value === 'all' ||
        (statusFilter.value ===
          'published' &&
          journey.isPublished) ||
        (statusFilter.value ===
          'draft' &&
          !journey.isPublished)

      const matchesFeatured =
        featuredFilter.value === 'all' ||
        (featuredFilter.value ===
          'featured' &&
          journey.isFeatured) ||
        (featuredFilter.value ===
          'standard' &&
          !journey.isFeatured)

      return (
        matchesSearch &&
        matchesStatus &&
        matchesFeatured
      )
    },
  )
})

const visibleDestinations = (
  journey: Journey,
) => {
  return (journey.destinations || [])
    .filter(
      destination =>
        typeof destination !== 'string',
    )
    .slice(0, 2)
}

const getInitials = (
  title: string,
) => {
  return title
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase()
}

const clearFilters = () => {
  search.value = ''
  statusFilter.value = 'all'
  featuredFilter.value = 'all'
}

const loadJourneys = async () => {
  try {
    await fetchJourneys()
  } catch {
    // Error state is handled by composable.
  }
}

const openCreate = () => {
  editingJourney.value = null
  formOpen.value = true
  openMenuId.value = null
}

const openEdit = async (
  journey: Journey,
) => {
  if (loadingEditId.value) {
    return
  }

  openMenuId.value = null
  loadingEditId.value = journey._id

  try {
    const fullJourney =
      await fetchJourney(journey._id)

    editingJourney.value =
      fullJourney

    formOpen.value = true
  } catch (err: any) {
    window.alert(
      err?.message ||
        'Unable to load journey.',
    )
  } finally {
    loadingEditId.value = null
  }
}

const openEditFromMenu = async (
  journey: Journey,
) => {
  openMenuId.value = null
  await openEdit(journey)
}

const closeForm = () => {
  formOpen.value = false
  editingJourney.value = null
}

const handleSaved = async () => {
  formOpen.value = false
  editingJourney.value = null

  await loadJourneys()
}

const toggleMenu = (
  id: string,
) => {
  openMenuId.value =
    openMenuId.value === id
      ? null
      : id
}

const askDelete = (
  journey: Journey,
) => {
  openMenuId.value = null
  deleteError.value = null
  deleteTarget.value = journey
}

const closeDelete = () => {
  if (deleting.value) {
    return
  }

  deleteTarget.value = null
  deleteError.value = null
}

const confirmDelete = async () => {
  if (!deleteTarget.value) {
    return
  }

  deleting.value = true
  deleteError.value = null

  try {
    await deleteJourney(
      deleteTarget.value._id,
    )

    deleteTarget.value = null
  } catch (err: any) {
    deleteError.value =
      err?.message ||
      'Unable to delete journey.'
  } finally {
    deleting.value = false
  }
}

const closeMenus = () => {
  openMenuId.value = null
}

onMounted(async () => {
  document.addEventListener(
    'click',
    closeMenus,
  )

  await loadJourneys()
})

onBeforeUnmount(() => {
  document.removeEventListener(
    'click',
    closeMenus,
  )
})
</script>

<style scoped>
.journeys-page {
  width: 100%;
}

/* =========================
   HEADER
========================= */

.page-header {
  margin-bottom: 30px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 28px;
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
  max-width: 610px;
  margin: 11px 0 0;
  color: #80777f;
  font-size: 14px;
  line-height: 1.65;
}

.primary-button {
  min-height: 47px;
  padding: 0 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border: 0;
  border-radius: 11px;
  background: linear-gradient(
    135deg,
    #ec12c7 0%,
    #a20eac 52%,
    #651070 100%
  );
  box-shadow:
    0 10px 24px rgba(162, 14, 172, 0.2);
  color: #fff;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.primary-button:hover {
  transform: translateY(-1px);
  box-shadow:
    0 14px 30px rgba(162, 14, 172, 0.25);
}

.button-plus {
  font-size: 20px;
  font-weight: 400;
}

/* =========================
   SUMMARY
========================= */

.summary-grid {
  margin-bottom: 24px;
  display: grid;
  grid-template-columns:
    repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.summary-card {
  min-height: 145px;
  padding: 20px;
  border: 1px solid #ebe5ea;
  border-radius: 16px;
  background: #fff;
  box-shadow:
    0 10px 28px rgba(35, 15, 32, 0.035);
}

.summary-top {
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.summary-label {
  color: #938991;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.13em;
}

.summary-icon {
  color: #c3b8c1;
  font-size: 10px;
  font-weight: 800;
}

.summary-card > strong {
  display: block;
  color: #211d21;
  font-size: 28px;
  line-height: 1;
}

.summary-card p {
  margin: 9px 0 0;
  color: #938991;
  font-size: 12px;
}

.summary-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.published-dot {
  background: #328462;
}

.draft-dot {
  background: #b9afb7;
}

.featured-mark {
  color: #d80bb9;
  font-size: 15px;
}

/* =========================
   CARD / TOOLBAR
========================= */

.content-card {
  overflow: visible;
  border: 1px solid #ebe5ea;
  border-radius: 18px;
  background: #fff;
  box-shadow:
    0 12px 35px rgba(35, 15, 32, 0.045);
}

.toolbar {
  padding: 18px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  border-bottom: 1px solid #eee8ed;
}

.search-box {
  width: min(390px, 100%);
  position: relative;
}

.search-box svg {
  position: absolute;
  top: 50%;
  left: 14px;
  width: 18px;
  height: 18px;
  transform: translateY(-50%);
  fill: none;
  stroke: #948a92;
  stroke-width: 1.7;
  stroke-linecap: round;
}

.search-box input {
  width: 100%;
  height: 44px;
  padding: 0 14px 0 42px;
  border: 1px solid #e7e0e5;
  border-radius: 10px;
  outline: none;
  background: #fbfafb;
  color: #211d21;
  font-family: inherit;
  font-size: 14px;
}

.search-box input:focus {
  border-color:
    rgba(216, 11, 185, 0.45);
  background: #fff;
  box-shadow:
    0 0 0 3px rgba(216, 11, 185, 0.07);
}

.filters {
  display: flex;
  gap: 9px;
}

.filters select {
  min-width: 145px;
  height: 44px;
  padding: 0 34px 0 13px;
  border: 1px solid #e7e0e5;
  border-radius: 10px;
  outline: none;
  background: #fff;
  color: #514950;
  font-family: inherit;
  font-size: 13px;
}

/* =========================
   TABLE
========================= */

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  min-width: 920px;
  border-collapse: collapse;
}

thead th {
  padding: 13px 18px;
  border-bottom: 1px solid #eee8ed;
  background: #fbfafb;
  color: #968c94;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.11em;
  text-align: left;
}

tbody td {
  padding: 15px 18px;
  border-bottom: 1px solid #f0ebef;
  color: #4b444a;
  font-size: 13px;
  vertical-align: middle;
}

tbody tr {
  transition: background 0.18s ease;
}

tbody tr:hover {
  background: #fdfbfc;
}

tbody tr:last-child td {
  border-bottom: 0;
}

.actions-column {
  width: 130px;
}

.journey-cell {
  min-width: 270px;
  display: flex;
  align-items: center;
  gap: 13px;
}

.journey-image {
  position: relative;
  width: 66px;
  height: 52px;
  flex: 0 0 66px;
  overflow: visible;
  border-radius: 10px;
  background: #f0ebef;
}

.journey-image > img,
.image-fallback {
  width: 100%;
  height: 100%;
  border-radius: 10px;
}

.journey-image > img {
  display: block;
  object-fit: cover;
}

.image-fallback {
  display: grid;
  place-items: center;
  background:
    linear-gradient(
      135deg,
      #f9eaf6,
      #eee5f0
    );
}

.image-fallback span {
  color: #97119e;
  font-size: 13px;
  font-weight: 800;
}

.featured-badge {
  position: absolute;
  top: -7px;
  right: -7px;
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  border: 2px solid #fff;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    #ec12c7,
    #821092
  );
  color: #fff;
  font-size: 10px;
}

.journey-info {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.journey-info strong {
  max-width: 240px;
  overflow: hidden;
  color: #292328;
  font-size: 14px;
  font-weight: 750;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.journey-info span {
  max-width: 230px;
  overflow: hidden;
  color: #978d95;
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.destination-list {
  max-width: 240px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.destination-chip,
.more-chip {
  padding: 6px 8px;
  border-radius: 7px;
  background: #f7f3f6;
  color: #625960;
  font-size: 11px;
  font-weight: 650;
}

.more-chip {
  background: #f8eefa;
  color: #9b149d;
}

.muted-value {
  color: #aaa1a8;
}

.duration-value {
  display: flex;
  align-items: baseline;
  gap: 5px;
}

.duration-value strong {
  color: #302a2f;
  font-size: 15px;
}

.duration-value span {
  color: #91878f;
  font-size: 11px;
}

.status-badge {
  width: fit-content;
  padding: 7px 9px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 750;
}

.status-badge > span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-badge.published {
  background: #eef7f3;
  color: #32785d;
}

.status-badge.published > span {
  background: #328462;
}

.status-badge.draft {
  background: #f4f1f3;
  color: #756c73;
}

.status-badge.draft > span {
  background: #aaa0a8;
}

.order-value {
  color: #5c545a;
  font-size: 12px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

/* =========================
   ACTIONS
========================= */

.row-actions {
  position: relative;
  display: flex;
  align-items: center;
  gap: 5px;
}

.action-button {
  min-height: 35px;
  padding: 0 11px;
  border: 1px solid #e5dde3;
  border-radius: 8px;
  background: #fff;
  color: #5c535a;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.action-button.edit:hover {
  border-color:
    rgba(216, 11, 185, 0.3);
  color: #a20eac;
  background: #fff9fe;
}

.action-button:disabled {
  opacity: 0.55;
  cursor: wait;
}

.action-menu {
  width: 35px;
  height: 35px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #81777f;
  font-size: 14px;
  letter-spacing: 1px;
  cursor: pointer;
}

.action-menu:hover {
  background: #f6f2f5;
}

.action-dropdown {
  position: absolute;
  top: 41px;
  right: 0;
  z-index: 30;
  width: 160px;
  padding: 6px;
  border: 1px solid #e9e2e7;
  border-radius: 10px;
  background: #fff;
  box-shadow:
    0 14px 36px rgba(32, 15, 28, 0.12);
}

.action-dropdown button {
  width: 100%;
  padding: 10px 11px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: #4f474d;
  font-family: inherit;
  font-size: 12px;
  font-weight: 650;
  text-align: left;
  cursor: pointer;
}

.action-dropdown button:hover {
  background: #f8f5f7;
}

.action-dropdown .danger-action {
  color: #b94a55;
}

/* =========================
   FOOTER
========================= */

.table-footer {
  padding: 14px 20px;
  border-top: 1px solid #eee8ed;
  color: #8f858d;
  font-size: 12px;
}

.table-footer strong {
  color: #514950;
}

/* =========================
   ERROR / EMPTY
========================= */

.page-error {
  margin: 20px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  border: 1px solid #f0d0d4;
  border-radius: 12px;
  background: #fff6f7;
}

.page-error div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-error strong {
  color: #9e3c47;
  font-size: 14px;
}

.page-error span {
  color: #a96971;
  font-size: 12px;
}

.page-error button {
  min-height: 38px;
  padding: 0 13px;
  border: 1px solid #e9c5c9;
  border-radius: 8px;
  background: #fff;
  color: #a03f49;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.empty-state {
  min-height: 380px;
  padding: 50px 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.empty-icon {
  width: 62px;
  height: 62px;
  margin-bottom: 17px;
  display: grid;
  place-items: center;
  border-radius: 18px;
  background: linear-gradient(
    135deg,
    #f9e9f6,
    #eee5f0
  );
  color: #a20eac;
  font-size: 15px;
  font-weight: 850;
}

.empty-state h3 {
  margin: 0;
  color: #302a2f;
  font-size: 19px;
}

.empty-state p {
  max-width: 390px;
  margin: 8px 0 20px;
  color: #8b8189;
  font-size: 13px;
  line-height: 1.6;
}

.secondary-button {
  min-height: 42px;
  padding: 0 15px;
  border: 1px solid #e1d9df;
  border-radius: 9px;
  background: #fff;
  color: #574f55;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.empty-create {
  min-height: 44px;
}

/* =========================
   LOADING
========================= */

.loading-list {
  padding: 5px 0;
}

.loading-row {
  min-height: 82px;
  padding: 14px 18px;
  display: grid;
  grid-template-columns:
    66px 1fr 130px 100px;
  align-items: center;
  gap: 14px;
  border-bottom: 1px solid #f0ebef;
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
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.7),
    transparent
  );
  animation: shimmer 1.4s infinite;
}

.skeleton-image {
  width: 66px;
  height: 52px;
  border-radius: 10px;
}

.skeleton-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-title {
  width: 190px;
  height: 13px;
}

.skeleton-text {
  width: 130px;
  height: 9px;
}

.skeleton-small {
  width: 80px;
  height: 25px;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

/* =========================
   DELETE DIALOG
========================= */

.dialog-overlay {
  position: fixed;
  inset: 0;
  z-index: 1600;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(13, 11, 14, 0.58);
  backdrop-filter: blur(5px);
}

.delete-dialog {
  width: min(440px, 100%);
  padding: 30px;
  border-radius: 18px;
  background: #fff;
  box-shadow:
    0 30px 80px rgba(20, 8, 17, 0.2);
  text-align: center;
}

.delete-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 15px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #fff0f2;
  color: #b94a55;
  font-size: 20px;
  font-weight: 850;
}

.dialog-eyebrow {
  color: #b94a55;
  font-size: 10px;
  font-weight: 850;
  letter-spacing: 0.14em;
}

.delete-dialog h3 {
  margin: 9px 0 9px;
  color: #292328;
  font-size: 20px;
  line-height: 1.3;
}

.delete-dialog p {
  margin: 0;
  color: #887e86;
  font-size: 13px;
  line-height: 1.6;
}

.delete-error {
  margin-top: 15px;
  padding: 11px 12px;
  border-radius: 9px;
  background: #fff3f4;
  color: #a9414c;
  font-size: 12px;
  line-height: 1.5;
}

.dialog-actions {
  margin-top: 24px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 9px;
}

.dialog-cancel,
.dialog-delete {
  min-height: 44px;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 750;
  cursor: pointer;
}

.dialog-cancel {
  border: 1px solid #e4dce2;
  background: #fff;
  color: #61585f;
}

.dialog-delete {
  border: 0;
  background: #b94a55;
  color: #fff;
}

.dialog-cancel:disabled,
.dialog-delete:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* =========================
   EDIT LOADING
========================= */

.edit-loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 1150;
  display: grid;
  place-items: center;
  background: rgba(13, 11, 14, 0.32);
  backdrop-filter: blur(3px);
}

.edit-loading-card {
  min-width: 300px;
  padding: 20px 22px;
  display: flex;
  align-items: center;
  gap: 15px;
  border-radius: 14px;
  background: #fff;
  box-shadow:
    0 22px 60px rgba(20, 8, 17, 0.16);
}

.loading-spinner {
  width: 27px;
  height: 27px;
  flex: 0 0 27px;
  border: 3px solid #eee3ec;
  border-top-color: #c313b6;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.edit-loading-card strong {
  color: #322c31;
  font-size: 14px;
}

.edit-loading-card p {
  margin: 4px 0 0;
  color: #91878f;
  font-size: 12px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* =========================
   TRANSITIONS
========================= */

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* =========================
   RESPONSIVE
========================= */

@media (max-width: 1100px) {
  .summary-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .page-header {
    align-items: stretch;
    flex-direction: column;
  }

  .page-header h1 {
    font-size: 34px;
  }

  .page-header .primary-button {
    width: 100%;
  }

  .summary-grid {
    grid-template-columns: 1fr 1fr;
  }

  .summary-card {
    min-height: 130px;
  }

  .toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .search-box {
    width: 100%;
  }

  .filters {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .filters select {
    width: 100%;
    min-width: 0;
  }

  .loading-row {
    grid-template-columns: 58px 1fr;
  }

  .loading-row
    > :nth-child(n + 3) {
    display: none;
  }
}

@media (max-width: 480px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }

  .filters {
    grid-template-columns: 1fr;
  }

  .dialog-actions {
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