<script setup lang="ts">
import PlaceFormModal from '../../components/places/PlaceFormModal.vue'

import {
  usePlaces,
  type Place,
  type PlacePayload,
} from '../../composables/usePlaces'

import {
  useDestinations,
} from '../../composables/useDestinations'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const {
  places,
  loading,
  saving,
  deletingId,
  error,
  fetchPlaces,
  createPlace,
  updatePlace,
  deletePlace,
} = usePlaces()

const {
  destinations,
  fetchDestinations,
} = useDestinations()

const search = ref('')
const destinationFilter = ref('')
const statusFilter = ref('all')

const formOpen = ref(false)
const editingPlace = ref<Place | null>(null)
const deleteTarget = ref<Place | null>(null)

const formError = ref('')
const deleteError = ref('')

const filteredPlaces = computed(() => {
  const query =
    search.value.trim().toLowerCase()

  return places.value.filter((place) => {
    const destinationId =
      typeof place.destination === 'string'
        ? place.destination
        : place.destination?._id

    const destinationName =
      typeof place.destination === 'string'
        ? ''
        : place.destination?.name || ''

    const matchesSearch =
      !query ||
      place.name
        .toLowerCase()
        .includes(query) ||
      place.slug
        .toLowerCase()
        .includes(query) ||
      destinationName
        .toLowerCase()
        .includes(query)

    const matchesDestination =
      !destinationFilter.value ||
      destinationId ===
        destinationFilter.value

    const matchesStatus =
      statusFilter.value === 'all' ||
      (
        statusFilter.value ===
        'published'
          ? place.isPublished
          : !place.isPublished
      )

    return (
      matchesSearch &&
      matchesDestination &&
      matchesStatus
    )
  })
})

const publishedCount = computed(
  () =>
    places.value.filter(
      place => place.isPublished,
    ).length,
)

const draftCount = computed(
  () =>
    places.value.length -
    publishedCount.value,
)

const destinationName = (
  place: Place,
) => {
  if (
    typeof place.destination === 'string'
  ) {
    return '—'
  }

  return place.destination?.name || '—'
}

const openCreate = () => {
  editingPlace.value = null
  formError.value = ''
  formOpen.value = true
}

const openEdit = (
  place: Place,
) => {
  editingPlace.value = place
  formError.value = ''
  formOpen.value = true
}

const closeForm = () => {
  if (saving.value) return

  formOpen.value = false
  editingPlace.value = null
  formError.value = ''
}

const handleSave = async (
  payload: PlacePayload,
) => {
  formError.value = ''

  try {
    if (editingPlace.value) {
      await updatePlace(
        editingPlace.value._id,
        payload,
      )
    } else {
      await createPlace(payload)
    }

    closeForm()
  } catch (err: any) {
    formError.value =
      err?.data?.message ||
      'Unable to save place.'
  }
}

const requestDelete = (
  place: Place,
) => {
  deleteTarget.value = place
  deleteError.value = ''
}

const closeDelete = () => {
  if (deletingId.value) return

  deleteTarget.value = null
  deleteError.value = ''
}

const confirmDelete = async () => {
  if (!deleteTarget.value) return

  deleteError.value = ''

  try {
    await deletePlace(
      deleteTarget.value._id,
    )

    deleteTarget.value = null
  } catch (err: any) {
    deleteError.value =
      err?.data?.message ||
      'Unable to delete place.'
  }
}

onMounted(async () => {
  await Promise.all([
    fetchPlaces(),
    fetchDestinations(),
  ])
})
</script>

<template>
  <div class="places-page page-enter">
    <header class="page-header">
      <div>
        <p class="eyebrow">
          DESTINATION DETAIL
        </p>

        <h1>Places</h1>

        <p class="description">
          Curate cities, regions and meaningful
          places within each destination.
        </p>
      </div>

      <button
        type="button"
        class="primary-button"
        @click="openCreate"
      >
        <span>＋</span>
        Add place
      </button>
    </header>

    <section class="summary-grid">
      <article>
        <span>TOTAL PLACES</span>
        <strong>{{ places.length }}</strong>
      </article>

      <article>
        <span>PUBLISHED</span>
        <strong>
          {{ publishedCount }}
        </strong>
      </article>

      <article>
        <span>DRAFT</span>
        <strong>
          {{ draftCount }}
        </strong>
      </article>
    </section>

    <section class="toolbar">
      <div class="search">
        <span>⌕</span>

        <input
          v-model="search"
          type="search"
          placeholder="Search places..."
        >
      </div>

      <select v-model="destinationFilter">
        <option value="">
          All destinations
        </option>

        <option
          v-for="destination in destinations"
          :key="destination._id"
          :value="destination._id"
        >
          {{ destination.name }}
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
      <span>{{ error }}</span>

      <button @click="fetchPlaces()">
        Try again
      </button>
    </div>

    <div
      v-if="formError"
      class="error-banner"
    >
      {{ formError }}
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
      v-else-if="filteredPlaces.length"
      class="place-table"
    >
      <div class="table-head">
        <span>PLACE</span>
        <span>DESTINATION</span>
        <span>STATUS</span>
        <span>ORDER</span>
        <span>ACTIONS</span>
      </div>

      <TransitionGroup
        name="place-row"
        tag="div"
      >
        <article
          v-for="place in filteredPlaces"
          :key="place._id"
          class="place-row"
        >
          <div class="place-info">
            <div class="visual">
              <img
                v-if="place.image?.url"
                :src="place.image.url"
                :alt="
                  place.image.altText ||
                  place.name
                "
              >

              <span v-else>✦</span>
            </div>

            <div>
              <strong>
                {{ place.name }}
              </strong>

              <p>/{{ place.slug }}</p>

              <small>
                {{
                  place.shortDescription ||
                  'No description added.'
                }}
              </small>
            </div>
          </div>

          <div class="destination-cell">
            {{ destinationName(place) }}
          </div>

          <div>
            <span
              class="status"
              :class="{
                published:
                  place.isPublished,
              }"
            >
              <i />

              {{
                place.isPublished
                  ? 'Published'
                  : 'Draft'
              }}
            </span>
          </div>

          <div class="order">
            {{ place.sortOrder ?? 0 }}
          </div>

          <div class="actions">
            <button
              class="edit"
              @click="openEdit(place)"
            >
              Edit
            </button>

            <button
              class="delete"
              :disabled="
                deletingId === place._id
              "
              @click="requestDelete(place)"
            >
              ×
            </button>
          </div>
        </article>
      </TransitionGroup>
    </section>

    <section
      v-else
      class="empty-state"
    >
      <div>✦</div>

      <p>PLACES</p>

      <h2>
        {{
          search ||
          destinationFilter ||
          statusFilter !== 'all'
            ? 'No places found.'
            : 'Add meaningful places.'
        }}
      </h2>

      <span>
        {{
          search ||
          destinationFilter ||
          statusFilter !== 'all'
            ? 'Try changing your search or filters.'
            : 'Create places within your destinations to build richer journeys.'
        }}
      </span>

      <button
        v-if="
          !search &&
          !destinationFilter &&
          statusFilter === 'all'
        "
        @click="openCreate"
      >
        Add first place
      </button>
    </section>

    <PlaceFormModal
      :open="formOpen"
      :place="editingPlace"
      :destinations="destinations"
      :saving="saving"
      @close="closeForm"
      @save="handleSave"
    />

    <Teleport to="body">
      <Transition name="delete-modal">
        <div
          v-if="deleteTarget"
          class="delete-backdrop"
          @click.self="closeDelete"
        >
          <section class="delete-dialog">
            <div class="danger-icon">
              ×
            </div>

            <p>DELETE PLACE</p>

            <h2>
              Remove
              {{ deleteTarget.name }}?
            </h2>

            <span>
              Places being used by journeys
              or itinerary days cannot be
              deleted.
            </span>

            <div
              v-if="deleteError"
              class="delete-error"
            >
              {{ deleteError }}
            </div>

            <div class="delete-actions">
              <button
                class="keep"
                :disabled="
                  Boolean(deletingId)
                "
                @click="closeDelete"
              >
                Keep place
              </button>

              <button
                class="remove"
                :disabled="
                  Boolean(deletingId)
                "
                @click="confirmDelete"
              >
                {{
                  deletingId
                    ? 'Deleting...'
                    : 'Delete place'
                }}
              </button>
            </div>
          </section>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  margin-bottom: 28px;
  align-items: flex-end;
  justify-content: space-between;
  gap: 30px;
}

.eyebrow {
  margin: 0 0 10px;
  color: var(--brand-dark);
  font-size: 11px;
  font-weight: 750;
  letter-spacing: .18em;
}

.page-header h1 {
  margin: 0;
  font-family: Georgia, serif;
  font-size: 42px;
  font-weight: 400;
  letter-spacing: -.035em;
}

.description {
  margin: 10px 0 0;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.6;
}

.primary-button {
  display: flex;
  min-height: 48px;
  padding: 0 19px;
  border: 0;
  border-radius: 11px;
  align-items: center;
  gap: 9px;
  background: var(--brand-gradient);
  color: white;
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
  box-shadow:
    0 10px 24px
    rgba(166,15,165,.18);
}

.summary-grid {
  display: grid;
  margin-bottom: 18px;
  grid-template-columns:
    repeat(3, minmax(0,1fr));
  gap: 13px;
}

.summary-grid article {
  padding: 20px;
  border: 1px solid var(--border);
  border-radius: 13px;
  background: white;
}

.summary-grid span {
  color: var(--muted);
  font-size: 10px;
  font-weight: 750;
  letter-spacing: .13em;
}

.summary-grid strong {
  display: block;
  margin-top: 9px;
  font-family: Georgia, serif;
  font-size: 29px;
  font-weight: 400;
}

.toolbar {
  display: grid;
  margin-bottom: 18px;
  padding: 11px;
  border: 1px solid var(--border);
  border-radius: 14px;
  grid-template-columns:
    minmax(250px,1fr)
    210px
    180px;
  gap: 10px;
  background: white;
}

.search {
  position: relative;
}

.search span {
  position: absolute;
  top: 50%;
  left: 14px;
  color: var(--muted);
  transform: translateY(-50%);
}

.search input,
.toolbar select {
  width: 100%;
  height: 44px;
  border: 0;
  border-radius: 9px;
  outline: none;
  background: var(--surface-soft);
  color: var(--text);
  font: inherit;
  font-size: 14px;
}

.search input {
  padding: 0 14px 0 40px;
}

.toolbar select {
  padding: 0 13px;
}

.place-table {
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 15px;
  background: white;
}

.table-head,
.place-row {
  display: grid;
  grid-template-columns:
    minmax(330px,1fr)
    190px
    150px
    90px
    140px;
  align-items: center;
}

.table-head {
  min-height: 48px;
  padding: 0 20px;
  border-bottom: 1px solid var(--border);
  background: #fbf9fa;
  color: #8f858d;
  font-size: 10px;
  font-weight: 750;
  letter-spacing: .14em;
}

.place-row {
  min-height: 104px;
  padding: 14px 20px;
  border-bottom: 1px solid var(--border);
  transition: background .2s ease;
}

.place-row:last-child {
  border-bottom: 0;
}

.place-row:hover {
  background: #fdfbfc;
}

.place-info {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 15px;
}

.visual {
  display: grid;
  width: 76px;
  height: 68px;
  flex: 0 0 auto;
  overflow: hidden;
  border-radius: 11px;
  place-items: center;
  background: var(--brand-gradient);
  color: white;
}

.visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.place-info > div:last-child {
  min-width: 0;
}

.place-info strong {
  color: var(--text);
  font-size: 14px;
}

.place-info p {
  margin: 4px 0;
  color: var(--brand-dark);
  font-size: 12px;
}

.place-info small {
  display: block;
  max-width: 390px;
  overflow: hidden;
  color: var(--muted);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.destination-cell,
.order {
  color: var(--text);
  font-size: 13px;
}

.status {
  display: inline-flex;
  padding: 7px 10px;
  border-radius: 100px;
  align-items: center;
  gap: 7px;
  background: #f3f0f2;
  color: #837980;
  font-size: 11px;
  font-weight: 650;
}

.status i {
  width: 6px;
  height: 6px;
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

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.actions button {
  min-height: 38px;
  border: 1px solid var(--border);
  border-radius: 9px;
  background: white;
  cursor: pointer;
}

.edit {
  padding: 0 14px;
  color: var(--text);
  font-size: 12px;
  font-weight: 650;
}

.delete {
  width: 38px;
  padding: 0;
  color: #a64a5e;
  font-size: 18px;
}

.loading-row {
  height: 102px;
  margin-bottom: 9px;
  border-radius: 13px;
}

.error-banner {
  display: flex;
  margin-bottom: 16px;
  padding: 13px 15px;
  border: 1px solid #efd6dc;
  border-radius: 10px;
  justify-content: space-between;
  background: #fff7f9;
  color: #a34257;
  font-size: 13px;
}

.error-banner button {
  border: 0;
  background: transparent;
  color: #8c3448;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
}

.empty-state {
  padding: 80px 25px;
  border: 1px dashed #ddd4da;
  border-radius: 16px;
  background: white;
  text-align: center;
}

.empty-state > div {
  display: grid;
  width: 48px;
  height: 48px;
  margin: auto;
  border-radius: 13px;
  place-items: center;
  background: var(--brand-gradient);
  color: white;
}

.empty-state p {
  margin: 19px 0 8px;
  color: var(--brand-dark);
  font-size: 11px;
  font-weight: 750;
  letter-spacing: .17em;
}

.empty-state h2 {
  margin: 0;
  font-family: Georgia, serif;
  font-size: 28px;
  font-weight: 400;
}

.empty-state > span {
  display: block;
  margin: 11px auto 0;
  color: var(--muted);
  font-size: 13px;
}

.empty-state button {
  min-height: 43px;
  margin-top: 20px;
  padding: 0 16px;
  border: 0;
  border-radius: 9px;
  background: var(--brand-gradient);
  color: white;
  cursor: pointer;
  font-size: 13px;
}

.place-row-enter-active,
.place-row-leave-active {
  transition:
    opacity .25s ease,
    transform .25s ease;
}

.place-row-enter-from,
.place-row-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

@media(max-width:1100px) {
  .place-table {
    overflow-x: auto;
  }

  .table-head,
  .place-row {
    min-width: 900px;
  }
}

@media(max-width:650px) {
  .page-header {
    align-items: stretch;
    flex-direction: column;
  }

  .primary-button {
    justify-content: center;
  }

  .summary-grid,
  .toolbar {
    grid-template-columns: 1fr;
  }
}
</style>

<style>
.delete-backdrop {
  position: fixed;
  z-index: 1500;
  inset: 0;
  display: grid;
  padding: 20px;
  place-items: center;
  background: rgba(10,7,10,.7);
  backdrop-filter: blur(7px);
}

.delete-dialog {
  width: min(100%, 430px);
  padding: 32px;
  border-radius: 20px;
  background: white;
  text-align: center;
}

.danger-icon {
  display: grid;
  width: 46px;
  height: 46px;
  margin: auto;
  border-radius: 12px;
  place-items: center;
  background: #fff0f3;
  color: #a83f55;
  font-size: 22px;
}

.delete-dialog > p {
  margin: 17px 0 8px;
  color: #a83f55;
  font-size: 11px;
  font-weight: 750;
  letter-spacing: .17em;
}

.delete-dialog h2 {
  margin: 0;
  color: #241e23;
  font-family: Georgia, serif;
  font-size: 28px;
  font-weight: 400;
}

.delete-dialog > span {
  display: block;
  margin: 12px auto 0;
  color: #837980;
  font-size: 13px;
  line-height: 1.6;
}

.delete-error {
  margin-top: 15px;
  padding: 11px;
  border: 1px solid #efd5dc;
  border-radius: 9px;
  background: #fff6f8;
  color: #a33e55;
  font-size: 12px;
}

.delete-actions {
  display: grid;
  margin-top: 24px;
  grid-template-columns: 1fr 1fr;
  gap: 9px;
}

.delete-actions button {
  min-height: 44px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
}

.delete-actions .keep {
  border: 1px solid #ebe5ea;
  background: white;
}

.delete-actions .remove {
  border: 0;
  background: #a94459;
  color: white;
}

.delete-actions button:disabled {
  cursor: wait;
  opacity: .6;
}
</style>