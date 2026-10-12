<script setup lang="ts">
import {
  useDestinations,
  type Destination,
} from '../../composables/useDestinations'

import {
  useRegions,
} from '../../composables/useRegions'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})
import DestinationFormDrawer from '../../components/destinations/DestinationFormDrawer.vue'


const {
  destinations,
  loading,
  saving,
  deletingId,
  error,

  fetchDestinations,
  fetchDestination,
  createDestination,
  updateDestination,
  deleteDestination,
} = useDestinations()

const {
  regions,
  fetchRegions,
} = useRegions()

const search = ref('')
const regionFilter = ref('')
const statusFilter = ref('all')
const formOpen = ref(false)

const editingDestination =
  ref<Destination | null>(null)

const formError = ref('')

const loadingEditId =
  ref<string | null>(null)
const deleteTarget =
  ref<Destination | null>(null)

const actionError = ref('')

const filteredDestinations =
  computed(() => {
    const query =
      search.value
        .trim()
        .toLowerCase()

    return destinations.value.filter(
      (destination) => {
        const region =
          typeof destination.region ===
          'string'
            ? null
            : destination.region

        const matchesSearch =
          !query ||
          destination.name
            .toLowerCase()
            .includes(query) ||
          destination.slug
            .toLowerCase()
            .includes(query)

        const matchesRegion =
          !regionFilter.value ||
          region?._id ===
            regionFilter.value

        const matchesStatus =
          statusFilter.value === 'all' ||
          (
            statusFilter.value ===
            'published'
              ? destination.isPublished
              : !destination.isPublished
          )

        return (
          matchesSearch &&
          matchesRegion &&
          matchesStatus
        )
      },
    )
  })

const publishedCount = computed(
  () =>
    destinations.value.filter(
      item => item.isPublished,
    ).length,
)

const featuredCount = computed(
  () =>
    destinations.value.filter(
      item => item.isFeatured,
    ).length,
)

const regionName = (
  destination: Destination,
) => {
  if (
    typeof destination.region ===
    'string'
  ) {
    return '—'
  }

  return destination.region?.name || '—'
}

const requestDelete = (
  destination: Destination,
) => {
  deleteTarget.value = destination
  actionError.value = ''
}

const closeDelete = () => {
  if (deletingId.value) return

  deleteTarget.value = null
  actionError.value = ''
}

const confirmDelete = async () => {
  if (!deleteTarget.value) return

  try {
    actionError.value = ''

    await deleteDestination(
      deleteTarget.value._id,
    )

    deleteTarget.value = null
  } catch (err: any) {
    actionError.value =
      err?.data?.message ||
      'Unable to delete destination.'
  }
}

const openCreate = () => {
  editingDestination.value = null
  formError.value = ''
  formOpen.value = true
}

const openEdit = async (
  destination: Destination,
) => {
  loadingEditId.value = destination._id
  formError.value = ''

  try {
    const fullDestination =
      await fetchDestination(destination._id)

    editingDestination.value =
      fullDestination

    formOpen.value = true
  } catch (err: any) {
    formError.value =
      err?.data?.message ||
      'Unable to load destination.'
  } finally {
    loadingEditId.value = null
  }
}

const closeForm = () => {
  if (saving.value) return

  formOpen.value = false
  editingDestination.value = null
  formError.value = ''
}

const handleSave = async (
  payload: DestinationPayload,
) => {
  formError.value = ''

  try {
    if (editingDestination.value) {
      await updateDestination(
        editingDestination.value._id,
        payload,
      )
    } else {
      await createDestination(payload)
    }

    closeForm()
  } catch (err: any) {
    formError.value =
      err?.data?.message ||
      'Unable to save destination.'
  }
}

onMounted(async () => {
  await Promise.all([
    fetchDestinations(),
    fetchRegions(),
  ])
})
</script>

<template>
  <div class="destinations-page page-enter">
    <header class="page-header">
      <div>
        <p class="eyebrow">
          TRAVEL COLLECTION
        </p>

        <h1>Destinations</h1>

        <p class="description">
          Curate the places Vedic Journey
          presents to travellers around the
          world.
        </p>
      </div>

      <button
        class="primary-button"
        type="button"
        @click="openCreate"
      >
        <span>＋</span>
        Add destination
      </button>
    </header>

    <section class="summary-grid">
      <article>
        <span>TOTAL</span>
        <strong>
          {{ destinations.length }}
        </strong>
      </article>

      <article>
        <span>PUBLISHED</span>
        <strong>
          {{ publishedCount }}
        </strong>
      </article>

      <article>
        <span>FEATURED</span>
        <strong>
          {{ featuredCount }}
        </strong>
      </article>
    </section>

    <section class="toolbar">
      <div class="search">
        <span>⌕</span>

        <input
          v-model="search"
          type="search"
          placeholder="Search destinations..."
        >
      </div>

      <select v-model="regionFilter">
        <option value="">
          All regions
        </option>

        <option
          v-for="region in regions"
          :key="region._id"
          :value="region._id"
        >
          {{ region.name }}
        </option>
      </select>

      <select v-model="statusFilter">
        <option value="all">
          All statuses
        </option>

        <option value="published">
          Published
        </option>

        <option value="draft">
          Draft
        </option>
      </select>
    </section>

    <div
      v-if="error"
      class="error-banner"
    >
      {{ error }}
    </div>

    <section
      v-if="loading"
      class="loading-list"
    >
      <div
        v-for="i in 5"
        :key="i"
        class="loading-row skeleton"
      />
    </section>

    <section
      v-else-if="
        filteredDestinations.length
      "
      class="destination-table"
    >
      <div class="table-head">
        <span>DESTINATION</span>
        <span>REGION</span>
        <span>STATUS</span>
        <span>FEATURED</span>
        <span>ACTIONS</span>
      </div>

      <article
        v-for="
          destination
          in filteredDestinations
        "
        :key="destination._id"
        class="destination-row"
      >
        <div class="destination-info">
          <div class="visual">
            <img
              v-if="
                destination.heroImage?.url
              "
              :src="
                destination.heroImage.url
              "
              :alt="
                destination.heroImage
                  .altText ||
                destination.name
              "
            >

            <span v-else>✦</span>
          </div>

          <div>
            <strong>
              {{ destination.name }}
            </strong>

            <p>
              /{{ destination.slug }}
            </p>

            <small>
              {{
                destination
                  .shortDescription ||
                'No description added.'
              }}
            </small>
          </div>
        </div>

        <div class="region-cell">
          {{ regionName(destination) }}
        </div>

        <div>
          <span
            class="status"
            :class="{
              published:
                destination.isPublished,
            }"
          >
            <i />

            {{
              destination.isPublished
                ? 'Published'
                : 'Draft'
            }}
          </span>
        </div>

        <div>
          <span
            v-if="
              destination.isFeatured
            "
            class="featured"
          >
            ★ Featured
          </span>

          <span v-else class="muted">
            —
          </span>
        </div>

        <div class="actions">
          <button
            :disabled="
              loadingEditId === destination._id
            "
            @click="openEdit(destination)"
          >
            {{
              loadingEditId === destination._id
                ? 'Loading...'
                : 'Edit'
            }}
          </button>

          <button
            class="delete"
            @click="
              requestDelete(
                destination,
              )
            "
          >
            ×
          </button>
        </div>
      </article>
    </section>

    <section
      v-else
      class="empty-state"
    >
      <span>✦</span>

      <p>DESTINATIONS</p>

      <h2>
        {{
          search ||
          regionFilter ||
          statusFilter !== 'all'
            ? 'No destinations found.'
            : 'Build the collection.'
        }}
      </h2>

      <small>
        {{
          search ||
          regionFilter ||
          statusFilter !== 'all'
            ? 'Try changing your filters.'
            : 'Add your first destination to begin.'
        }}
      </small>
    </section>

    <Teleport to="body">
      <Transition name="delete-dialog">
        <div
          v-if="deleteTarget"
          class="delete-backdrop"
          @click.self="closeDelete"
        >
          <div class="delete-box">
            <div class="danger">×</div>

            <p>DELETE DESTINATION</p>

            <h2>
              Remove
              {{ deleteTarget.name }}?
            </h2>

            <span>
              Destinations connected to places
              or journeys cannot be deleted.
            </span>

            <div
              v-if="actionError"
              class="delete-error"
            >
              {{ actionError }}
            </div>

            <div class="delete-actions">
              <button
                class="cancel"
                @click="closeDelete"
              >
                Keep destination
              </button>

              <button
                class="confirm"
                :disabled="
                  Boolean(deletingId)
                "
                @click="confirmDelete"
              >
                {{
                  deletingId
                    ? 'Deleting...'
                    : 'Delete destination'
                }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <DestinationFormDrawer
      :open="formOpen"
      :destination="editingDestination"
      :regions="regions"
      :saving="saving"
      :error="formError"
      @close="closeForm"
      @save="handleSave"
    />
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  margin-bottom: 27px;
  align-items: flex-end;
  justify-content: space-between;
  gap: 30px;
}

.eyebrow {
  margin: 0 0 9px;
  color: var(--brand-dark);
  font-size: 9px;
  font-weight: 750;
  letter-spacing: .2em;
}

.page-header h1 {
  margin: 0;
  font-family: Georgia, serif;
  font-size: 39px;
  font-weight: 400;
  letter-spacing: -.035em;
}

.description {
  margin: 9px 0 0;
  color: var(--muted);
  font-size: 11px;
}

.primary-button {
  display: flex;
  min-height: 44px;
  padding: 0 17px;
  border: 0;
  border-radius: 10px;
  align-items: center;
  gap: 8px;
  background: var(--brand-gradient);
  color: white;
  cursor: pointer;
  font-size: 10px;
  font-weight: 700;
  box-shadow:
    0 10px 24px
    rgba(166, 15, 165, .18);
}

.summary-grid {
  display: grid;
  margin-bottom: 17px;
  grid-template-columns:
    repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.summary-grid article {
  padding: 17px 18px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: white;
}

.summary-grid span {
  color: var(--muted);
  font-size: 8px;
  font-weight: 700;
  letter-spacing: .13em;
}

.summary-grid strong {
  display: block;
  margin-top: 8px;
  font-family: Georgia, serif;
  font-size: 25px;
  font-weight: 400;
}

.toolbar {
  display: grid;
  margin-bottom: 17px;
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: 13px;
  grid-template-columns:
    minmax(250px, 1fr)
    190px
    160px;
  gap: 9px;
  background: white;
}

.search {
  position: relative;
}

.search span {
  position: absolute;
  top: 50%;
  left: 13px;
  color: var(--muted);
  transform: translateY(-50%);
}

.search input,
.toolbar select {
  width: 100%;
  height: 40px;
  border: 0;
  border-radius: 8px;
  outline: none;
  background: var(--surface-soft);
  color: var(--text);
  font: inherit;
  font-size: 9px;
}

.search input {
  padding: 0 13px 0 38px;
}

.toolbar select {
  padding: 0 12px;
}

.destination-table {
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: white;
}

.table-head,
.destination-row {
  display: grid;
  grid-template-columns:
    minmax(310px, 1fr)
    150px
    130px
    120px
    130px;
  align-items: center;
}

.table-head {
  min-height: 42px;
  padding: 0 18px;
  border-bottom: 1px solid var(--border);
  background: #fbf9fa;
  color: #8f858d;
  font-size: 7px;
  font-weight: 750;
  letter-spacing: .15em;
}

.destination-row {
  min-height: 94px;
  padding: 12px 18px;
  border-bottom: 1px solid var(--border);
  transition: background .2s ease;
}

.destination-row:last-child {
  border-bottom: 0;
}

.destination-row:hover {
  background: #fdfbfc;
}

.destination-info {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 14px;
}

.visual {
  display: grid;
  width: 72px;
  height: 62px;
  flex: 0 0 auto;
  overflow: hidden;
  border-radius: 10px;
  place-items: center;
  background: var(--brand-gradient);
  color: white;
}

.visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.destination-info > div:last-child {
  min-width: 0;
}

.destination-info strong {
  font-size: 11px;
}

.destination-info p {
  margin: 3px 0;
  color: var(--brand-dark);
  font-size: 8px;
}

.destination-info small {
  display: block;
  max-width: 360px;
  overflow: hidden;
  color: var(--muted);
  font-size: 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.region-cell {
  color: var(--text);
  font-size: 9px;
}

.status {
  display: inline-flex;
  padding: 6px 9px;
  border-radius: 100px;
  align-items: center;
  gap: 6px;
  background: #f3f0f2;
  color: #837980;
  font-size: 8px;
}

.status i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #a89fa6;
}

.status.published {
  background: #eef8f3;
  color: #32755a;
}

.status.published i {
  background: #3e946d;
}

.featured {
  color: #a06c21;
  font-size: 8px;
  font-weight: 650;
}

.muted {
  color: var(--muted);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 7px;
}

.actions button {
  min-height: 33px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: white;
  cursor: pointer;
}

.edit {
  padding: 0 12px;
  font-size: 8px;
  font-weight: 650;
}

.delete {
  width: 33px;
  padding: 0;
  color: #a64a5e;
  font-size: 16px;
}

.loading-row {
  height: 92px;
  margin-bottom: 8px;
  border-radius: 12px;
}

.error-banner {
  margin-bottom: 15px;
  padding: 12px 14px;
  border: 1px solid #efd6dc;
  border-radius: 9px;
  background: #fff7f9;
  color: #a34257;
  font-size: 9px;
}

.empty-state {
  padding: 80px 20px;
  border: 1px dashed #ddd4da;
  border-radius: 15px;
  background: white;
  text-align: center;
}

.empty-state > span {
  display: grid;
  width: 46px;
  height: 46px;
  margin: auto;
  border-radius: 13px;
  place-items: center;
  background: var(--brand-gradient);
  color: white;
}

.empty-state p {
  margin: 17px 0 7px;
  color: var(--brand-dark);
  font-size: 8px;
  font-weight: 750;
  letter-spacing: .18em;
}

.empty-state h2 {
  margin: 0;
  font-family: Georgia, serif;
  font-size: 25px;
  font-weight: 400;
}

.empty-state small {
  display: block;
  margin-top: 9px;
  color: var(--muted);
}

/* DELETE */

.delete-backdrop {
  position: fixed;
  z-index: 1500;
  inset: 0;
  display: grid;
  padding: 20px;
  place-items: center;
  background: rgba(10, 7, 10, .7);
  backdrop-filter: blur(7px);
}

.delete-box {
  width: min(100%, 420px);
  padding: 30px;
  border-radius: 19px;
  background: white;
  text-align: center;
}

.danger {
  display: grid;
  width: 44px;
  height: 44px;
  margin: auto;
  border-radius: 12px;
  place-items: center;
  background: #fff0f3;
  color: #a83f55;
  font-size: 20px;
}

.delete-box > p {
  margin: 16px 0 7px;
  color: #a83f55;
  font-size: 8px;
  font-weight: 750;
  letter-spacing: .18em;
}

.delete-box h2 {
  margin: 0;
  font-family: Georgia, serif;
  font-size: 26px;
  font-weight: 400;
}

.delete-box > span {
  display: block;
  margin-top: 11px;
  color: var(--muted);
  font-size: 10px;
  line-height: 1.6;
}

.delete-error {
  margin-top: 14px;
  padding: 10px;
  border-radius: 8px;
  background: #fff6f8;
  color: #a33e55;
  font-size: 9px;
}

.delete-actions {
  display: grid;
  margin-top: 23px;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.delete-actions button {
  min-height: 41px;
  border-radius: 9px;
  cursor: pointer;
  font-size: 8px;
  font-weight: 700;
}

.delete-actions .cancel {
  border: 1px solid var(--border);
  background: white;
}

.delete-actions .confirm {
  border: 0;
  background: #a94459;
  color: white;
}

@media(max-width: 1100px) {
  .destination-table {
    overflow-x: auto;
  }

  .table-head,
  .destination-row {
    min-width: 850px;
  }
}

@media(max-width: 650px) {
  .page-header {
    align-items: stretch;
    flex-direction: column;
  }

  .primary-button {
    justify-content: center;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .toolbar {
    grid-template-columns: 1fr;
  }
}
</style>