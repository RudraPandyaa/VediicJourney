<template>
  <div class="enquiries-page">
    <header class="page-header">
      <div>
        <span class="eyebrow">
          TRAVEL ENQUIRIES
        </span>

        <h1>Enquiries</h1>

        <p>
          Review traveller requests,
          manage follow-ups and track
          enquiries through conversion.
        </p>
      </div>
    </header>

    <section class="summary-grid">
      <article>
        <span>MATCHING ENQUIRIES</span>
        <strong>
          {{ pagination.total }}
        </strong>
        <p>
          Based on active filters
        </p>
      </article>

      <article>
        <span>NEW ON PAGE</span>
        <strong>
          {{ pageCount('new') }}
        </strong>
        <p>Current loaded page</p>
      </article>

      <article>
        <span>IN PROGRESS ON PAGE</span>
        <strong>
          {{ pageCount('in_progress') }}
        </strong>
        <p>Current loaded page</p>
      </article>

      <article>
        <span>CONVERTED ON PAGE</span>
        <strong>
          {{ pageCount('converted') }}
        </strong>
        <p>Current loaded page</p>
      </article>
    </section>

    <section class="toolbar">
      <div class="search-box">
        <span>⌕</span>

        <input
          v-model="search"
          type="search"
          placeholder="Search loaded enquiries..."
        >
      </div>

      <select
        v-model="statusFilter"
        @change="filtersChanged"
      >
        <option value="">
          All statuses
        </option>

        <option value="new">
          New
        </option>

        <option value="contacted">
          Contacted
        </option>

        <option value="in_progress">
          In Progress
        </option>

        <option value="converted">
          Converted
        </option>

        <option value="closed">
          Closed
        </option>
      </select>

      <select
        v-model="typeFilter"
        @change="filtersChanged"
      >
        <option value="">
          All enquiry types
        </option>

        <option value="journey">
          Journey
        </option>

        <option value="general">
          General
        </option>

        <option value="flight">
          Flight
        </option>

        <option value="visa">
          Visa
        </option>
      </select>
    </section>

    <div
      v-if="error"
      class="state error-state"
    >
      <strong>
        Unable to load enquiries
      </strong>

      <span>{{ error }}</span>

        <button @click="() => loadEnquiries()">
            Try Again
        </button>
    </div>

    <div
      v-else-if="loading"
      class="state"
    >
      Loading enquiries...
    </div>

    <div
      v-else-if="!filteredEnquiries.length"
      class="state"
    >
      <strong>
        No enquiries found
      </strong>

      <span>
        No traveller requests match
        the current filters.
      </span>
    </div>

    <section
      v-else
      class="table-card"
    >
      <div class="table-head">
        <span>TRAVELLER</span>
        <span>TYPE</span>
        <span>DESTINATION / JOURNEY</span>
        <span>STATUS</span>
        <span>RECEIVED</span>
        <span />
      </div>

      <button
        v-for="item in filteredEnquiries"
        :key="item._id"
        type="button"
        class="table-row"
        @click="openEnquiry(item)"
      >
        <div class="traveller">
          <div class="avatar">
            {{
              item.name
                .charAt(0)
                .toUpperCase()
            }}
          </div>

          <div>
            <strong>
              {{ item.name }}
            </strong>

            <span>
              {{ item.email }}
            </span>

            <small v-if="item.country">
              {{ item.country }}
            </small>
          </div>
        </div>

        <div>
          <span class="type-badge">
            {{ formatLabel(item.type) }}
          </span>
        </div>

        <div class="destination">
          <strong>
            {{
              journeyTitle(item) ||
              item.destination ||
              '—'
            }}
          </strong>

          <span
            v-if="
              journeyTitle(item) &&
              item.destination
            "
          >
            {{ item.destination }}
          </span>
        </div>

        <div>
          <span
            class="status"
            :class="
              `status-${item.status}`
            "
          >
            {{
              formatLabel(
                item.status,
              )
            }}
          </span>
        </div>

        <div class="date">
          {{ formatDate(item.createdAt) }}
        </div>

        <div class="view-cell">
          View →
        </div>
      </button>

      <footer
        v-if="pagination.totalPages > 1"
        class="pagination"
      >
        <span>
          Page
          {{ pagination.page }}
          of
          {{ pagination.totalPages }}
          ·
          {{ pagination.total }}
          enquiries
        </span>

        <div>
          <button
            :disabled="
              pagination.page <= 1
            "
            @click="
              changePage(
                pagination.page - 1,
              )
            "
          >
            Previous
          </button>

          <button
            :disabled="
              pagination.page >=
              pagination.totalPages
            "
            @click="
              changePage(
                pagination.page + 1,
              )
            "
          >
            Next
          </button>
        </div>
      </footer>
    </section>

    <ClientOnly>
      <EnquiryDetailDrawer
        :open="drawerOpen"
        :enquiry="selectedEnquiry"
        @close="closeDrawer"
        @updated="handleUpdated"
        @deleted="handleDeleted"
      />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import EnquiryDetailDrawer from '~/components/enquiries/EnquiryDetailDrawer.vue'

import type {
  Enquiry,
  EnquiryStatus,
  EnquiryType,
} from '~/composables/useEnquiries'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const {
  enquiries,
  pagination,
  loading,
  error,
  fetchEnquiries,
  fetchEnquiry,
} = useEnquiries()

const search = ref('')

const statusFilter =
  ref<EnquiryStatus | ''>('')

const typeFilter =
  ref<EnquiryType | ''>('')

const drawerOpen = ref(false)

const selectedEnquiry =
  ref<Enquiry | null>(null)

const openingId =
  ref<string | null>(null)

const filteredEnquiries = computed(
  () => {
    const query =
      search.value
        .trim()
        .toLowerCase()

    if (!query) {
      return enquiries.value
    }

    return enquiries.value.filter(
      item => {
        const journey =
          journeyTitle(item)

        return [
          item.name,
          item.email,
          item.phone,
          item.country,
          item.destination,
          journey,
        ]
          .filter(Boolean)
          .some(value =>
            String(value)
              .toLowerCase()
              .includes(query),
          )
      },
    )
  },
)

const pageCount = (
  status: EnquiryStatus,
) => {
  return enquiries.value.filter(
    item => item.status === status,
  ).length
}

const journeyTitle = (
  item: Enquiry,
) => {
  if (
    item.journey &&
    typeof item.journey === 'object'
  ) {
    return item.journey.title
  }

  return ''
}

const formatLabel = (
  value: string,
) => {
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

const loadEnquiries = async (
  page = 1,
) => {
  try {
    await fetchEnquiries({
      page,
      limit:
        pagination.value.limit ||
        20,
      status:
        statusFilter.value,
      type:
        typeFilter.value,
    })
  } catch {
    // composable handles error
  }
}

const filtersChanged = () => {
  search.value = ''
  loadEnquiries(1)
}

const changePage = (
  page: number,
) => {
  loadEnquiries(page)
}

const openEnquiry = async (
  item: Enquiry,
) => {
  if (openingId.value) return

  openingId.value = item._id

  try {
    selectedEnquiry.value =
      await fetchEnquiry(item._id)

    drawerOpen.value = true
  } catch (err) {
    console.error(
      'Unable to load enquiry',
      err,
    )
  } finally {
    openingId.value = null
  }
}

const closeDrawer = () => {
  drawerOpen.value = false
  selectedEnquiry.value = null
}

const handleUpdated = async (
  enquiry: Enquiry,
) => {
  selectedEnquiry.value = enquiry

  await loadEnquiries(
    pagination.value.page,
  )
}

const handleDeleted = async () => {
  closeDrawer()

  const currentPage =
    pagination.value.page

  await loadEnquiries(currentPage)

  if (
    !enquiries.value.length &&
    currentPage > 1
  ) {
    await loadEnquiries(
      currentPage - 1,
    )
  }
}

onMounted(() => {
  loadEnquiries(1)
})
</script>

<style scoped>
.enquiries-page {
  width: 100%;
}

.page-header {
  margin-bottom: 30px;
}

.eyebrow {
  display: block;
  margin-bottom: 9px;
  color: var(--brand-dark);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: .14em;
}

.page-header h1 {
  margin: 0;
  color: var(--text);
  font-size: 42px;
  font-weight: 700;
  line-height: 1.08;
  letter-spacing: -.035em;
}

.page-header p {
  max-width: 680px;
  margin: 11px 0 0;
  color: var(--muted);
  font-size: 15px;
  line-height: 1.65;
}

/* SUMMARY */

.summary-grid {
  margin-bottom: 18px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 13px;
}

.summary-grid article {
  min-height: 112px;
  padding: 20px;
  border: 1px solid var(--border);
  border-radius: 15px;
  background: var(--surface);
  box-shadow: 0 7px 22px rgba(35, 15, 32, .035);
}

.summary-grid article > span {
  color: #82777f;
  font-size: 12px;
  font-weight: 800;
  line-height: 1.3;
  letter-spacing: .07em;
}

.summary-grid strong {
  margin-top: 12px;
  display: block;
  color: var(--text);
  font-size: 30px;
  font-weight: 750;
  line-height: 1;
}

.summary-grid p {
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.4;
}

/* TOOLBAR */

.toolbar {
  margin-bottom: 15px;
  padding: 12px;
  display: grid;
  grid-template-columns: 1fr 205px 205px;
  gap: 10px;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--surface);
}

.search-box {
  height: 46px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #e6dfe4;
  border-radius: 9px;
  background: #fff;
  transition:
    border-color .2s ease,
    box-shadow .2s ease;
}

.search-box:focus-within {
  border-color: rgba(216, 11, 185, .4);
  box-shadow: 0 0 0 4px rgba(216, 11, 185, .05);
}

.search-box > span {
  color: #8e838b;
  font-size: 19px;
  line-height: 1;
}

.search-box input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--text);
  font: inherit;
  font-size: 14px;
}

.search-box input::placeholder {
  color: #a59ca3;
}

.toolbar select {
  height: 46px;
  padding: 0 12px;
  border: 1px solid #e6dfe4;
  border-radius: 9px;
  outline: none;
  background: #fff;
  color: #514950;
  font: inherit;
  font-size: 14px;
  font-weight: 550;
  cursor: pointer;
}

.toolbar select:focus {
  border-color: rgba(216, 11, 185, .4);
  box-shadow: 0 0 0 4px rgba(216, 11, 185, .05);
}

/* TABLE */

.table-card {
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 15px;
  background: var(--surface);
  box-shadow: 0 8px 25px rgba(35, 15, 32, .035);
}

.table-head,
.table-row {
  display: grid;
  grid-template-columns:
    minmax(250px, 1.4fr)
    120px
    minmax(210px, 1fr)
    140px
    130px
    80px;
  align-items: center;
  gap: 16px;
}

.table-head {
  min-height: 52px;
  padding: 0 19px;
  background: #fbf9fa;
  color: #81767e;
  font-size: 12px;
  font-weight: 800;
  line-height: 1.3;
  letter-spacing: .055em;
}

.table-row {
  width: 100%;
  min-height: 88px;
  padding: 13px 19px;
  border: 0;
  border-top: 1px solid #f0ebef;
  background: #fff;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: background .18s ease;
}

.table-row:hover {
  background: #fdf9fc;
}

/* TRAVELLER */

.traveller {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 46px;
  height: 46px;
  flex: 0 0 46px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #f7eaf5;
  color: var(--brand-dark);
  font-size: 15px;
  font-weight: 800;
}

.traveller > div:last-child {
  min-width: 0;
}

.traveller strong,
.traveller span,
.traveller small {
  display: block;
}

.traveller strong {
  overflow: hidden;
  color: #352f34;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.traveller span {
  margin-top: 4px;
  overflow: hidden;
  color: #746a72;
  font-size: 13px;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.traveller small {
  margin-top: 4px;
  color: #958b93;
  font-size: 12px;
  line-height: 1.3;
}

/* TYPE */

.type-badge {
  padding: 7px 10px;
  display: inline-block;
  border-radius: 999px;
  background: #f6eff5;
  color: #8d168e;
  font-size: 12px;
  font-weight: 750;
  line-height: 1.2;
}

/* DESTINATION */

.destination {
  min-width: 0;
}

.destination strong,
.destination span {
  display: block;
}

.destination strong {
  color: #4c444a;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.4;
}

.destination span {
  margin-top: 5px;
  color: #887e86;
  font-size: 12px;
  line-height: 1.4;
}

/* STATUS */

.status {
  padding: 7px 10px;
  display: inline-block;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 750;
  line-height: 1.2;
  white-space: nowrap;
}

.status-new {
  background: #f8eaf6;
  color: #a20eac;
}

.status-contacted {
  background: #eef3fa;
  color: #53719c;
}

.status-in_progress {
  background: #fff5e7;
  color: #956620;
}

.status-converted {
  background: #edf7f2;
  color: #328462;
}

.status-closed {
  background: #f2eff1;
  color: #776e75;
}

/* DATE / ACTION */

.date {
  color: #6f656d;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
}

.view-cell {
  color: var(--brand-dark);
  font-size: 13px;
  font-weight: 750;
  text-align: right;
  white-space: nowrap;
}

/* PAGINATION */

.pagination {
  min-height: 66px;
  padding: 0 19px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--border);
  background: #fcfafb;
}

.pagination > span {
  color: #756b73;
  font-size: 13px;
  font-weight: 500;
}

.pagination > div {
  display: flex;
  gap: 8px;
}

.pagination button,
.state button {
  min-height: 39px;
  padding: 0 14px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: #fff;
  color: #514950;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition:
    border-color .18s ease,
    background .18s ease;
}

.pagination button:hover:not(:disabled),
.state button:hover {
  border-color: #d8cbd5;
  background: #faf6f9;
}

.pagination button:disabled {
  opacity: .4;
  cursor: default;
}

/* EMPTY / ERROR / LOADING */

.state {
  min-height: 300px;
  padding: 30px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 8px;
  border: 1px solid var(--border);
  border-radius: 15px;
  background: #fff;
  color: #81777f;
  font-size: 14px;
  line-height: 1.5;
  text-align: center;
}

.state strong {
  color: #40383e;
  font-size: 17px;
  font-weight: 700;
}

.state span {
  color: var(--muted);
  font-size: 14px;
}

.state button {
  margin-top: 7px;
}

.error-state,
.error-state span {
  color: var(--danger);
}

/* RESPONSIVE */

@media (max-width: 1150px) {
  .table-card {
    overflow-x: auto;
  }

  .table-head,
  .table-row {
    min-width: 1020px;
  }
}

@media (max-width: 900px) {
  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .toolbar {
    grid-template-columns: 1fr 180px 180px;
  }
}

@media (max-width: 650px) {
  .page-header h1 {
    font-size: 34px;
  }

  .summary-grid,
  .toolbar {
    grid-template-columns: 1fr;
  }

  .summary-grid article {
    min-height: auto;
  }
}
</style>