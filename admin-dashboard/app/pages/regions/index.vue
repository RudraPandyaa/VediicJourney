<script setup lang="ts">
import RegionFormModal from '../../components/regions/RegionFormModal.vue'

import {
  useRegions,
  type Region,
  type RegionPayload,
} from '../../composables/useRegions'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const {
  regions,
  loading,
  saving,
  deletingId,
  error,
  fetchRegions,
  createRegion,
  updateRegion,
  deleteRegion,
} = useRegions()

type StatusFilter =
  | 'all'
  | 'published'
  | 'draft'

const search = ref('')
const statusFilter =
  ref<StatusFilter>('all')

const formOpen = ref(false)
const editingRegion =
  ref<Region | null>(null)

const deleteTarget =
  ref<Region | null>(null)

const actionError = ref('')

const filteredRegions = computed(() => {
  const query =
    search.value
      .trim()
      .toLowerCase()

  return regions.value.filter(
    (region) => {
      const matchesSearch =
        !query ||
        region.name
          .toLowerCase()
          .includes(query) ||
        region.slug
          .toLowerCase()
          .includes(query)

      const matchesStatus =
        statusFilter.value === 'all' ||
        (
          statusFilter.value ===
          'published'
            ? region.isPublished
            : !region.isPublished
        )

      return (
        matchesSearch &&
        matchesStatus
      )
    },
  )
})

const publishedCount = computed(
  () =>
    regions.value.filter(
      region => region.isPublished,
    ).length,
)

const draftCount = computed(
  () =>
    regions.value.length -
    publishedCount.value,
)

const openCreate = () => {
  editingRegion.value = null
  actionError.value = ''
  formOpen.value = true
}

const openEdit = (region: Region) => {
  editingRegion.value = region
  actionError.value = ''
  formOpen.value = true
}

const closeForm = () => {
  if (saving.value) return

  formOpen.value = false
  editingRegion.value = null
  actionError.value = ''
}

const handleSave = async (
  payload: RegionPayload,
) => {
  actionError.value = ''

  try {
    if (editingRegion.value) {
      await updateRegion(
        editingRegion.value._id,
        payload,
      )
    } else {
      await createRegion(payload)
    }

    closeForm()
  } catch (err: any) {
    actionError.value =
      err?.data?.message ||
      'Unable to save region.'
  }
}

const requestDelete = (
  region: Region,
) => {
  deleteTarget.value = region
  actionError.value = ''
}

const closeDelete = () => {
  if (deletingId.value) return

  deleteTarget.value = null
  actionError.value = ''
}

const confirmDelete = async () => {
  if (!deleteTarget.value) return

  actionError.value = ''

  try {
    await deleteRegion(
      deleteTarget.value._id,
    )

    deleteTarget.value = null
  } catch (err: any) {
    actionError.value =
      err?.data?.message ||
      'Unable to delete region.'
  }
}

onMounted(fetchRegions)
</script>

<template>
  <div class="regions-page page-enter">
    <header class="page-header">
      <div>
        <p class="eyebrow">
          TRAVEL ARCHITECTURE
        </p>

        <h1>Regions</h1>

        <p class="description">
          Organise the world into meaningful
          travel regions for Vedic Journey.
        </p>
      </div>

      <button
        type="button"
        class="primary-button"
        @click="openCreate"
      >
        <span>＋</span>
        Add region
      </button>
    </header>

    <section class="summary-grid">
      <article>
        <span>TOTAL REGIONS</span>
        <strong>{{ regions.length }}</strong>
      </article>

      <article>
        <span>PUBLISHED</span>
        <strong>{{ publishedCount }}</strong>
      </article>

      <article>
        <span>DRAFT</span>
        <strong>{{ draftCount }}</strong>
      </article>
    </section>

    <section class="toolbar">
      <div class="search">
        <span>⌕</span>

        <input
          v-model="search"
          type="search"
          placeholder="Search regions..."
        >
      </div>

      <div class="filters">
        <button
          :class="{
            active:
              statusFilter === 'all',
          }"
          @click="statusFilter = 'all'"
        >
          All
        </button>

        <button
          :class="{
            active:
              statusFilter === 'published',
          }"
          @click="
            statusFilter = 'published'
          "
        >
          Published
        </button>

        <button
          :class="{
            active:
              statusFilter === 'draft',
          }"
          @click="statusFilter = 'draft'"
        >
          Draft
        </button>
      </div>
    </section>

    <div
      v-if="error"
      class="error-banner"
    >
      <span>{{ error }}</span>

      <button @click="fetchRegions">
        Try again
      </button>
    </div>

    <!-- LOADING -->

    <div
      v-if="loading"
      class="region-list"
    >
      <div
        v-for="index in 5"
        :key="index"
        class="region-row skeleton-row"
      >
        <div class="skeleton skeleton-image" />
        <div class="skeleton skeleton-text" />
        <div class="skeleton skeleton-status" />
      </div>
    </div>

    <!-- LIST -->

    <section
      v-else-if="filteredRegions.length"
      class="region-table"
    >
      <div class="table-header">
        <span>REGION</span>
        <span>STATUS</span>
        <span>ORDER</span>
        <span>ACTIONS</span>
      </div>

      <TransitionGroup
        name="row"
        tag="div"
      >
        <article
          v-for="region in filteredRegions"
          :key="region._id"
          class="region-row"
        >
          <div class="region-info">
            <div class="region-image">
              <img
                v-if="region.image?.url"
                :src="region.image.url"
                :alt="
                  region.image.altText ||
                  region.name
                "
              >

              <span v-else>
                ✦
              </span>
            </div>

            <div>
              <strong>
                {{ region.name }}
              </strong>

              <p>/{{ region.slug }}</p>

              <small>
                {{
                  region.shortDescription ||
                  'No description added.'
                }}
              </small>
            </div>
          </div>

          <div>
            <span
              class="status"
              :class="{
                published:
                  region.isPublished,
              }"
            >
              <i />

              {{
                region.isPublished
                  ? 'Published'
                  : 'Draft'
              }}
            </span>
          </div>

          <div class="order">
            {{ region.sortOrder ?? 0 }}
          </div>

          <div class="actions">
            <button
              type="button"
              class="edit-button"
              @click="openEdit(region)"
            >
              Edit
            </button>

            <button
              type="button"
              class="delete-button"
              :disabled="
                deletingId === region._id
              "
              @click="requestDelete(region)"
            >
              ×
            </button>
          </div>
        </article>
      </TransitionGroup>
    </section>

    <!-- EMPTY -->

    <section
      v-else
      class="empty-state"
    >
      <div>✦</div>

      <p>
        {{
          search ||
          statusFilter !== 'all'
            ? 'NO RESULTS'
            : 'TRAVEL REGIONS'
        }}
      </p>

      <h2>
        {{
          search ||
          statusFilter !== 'all'
            ? 'No regions found.'
            : 'Shape the world.'
        }}
      </h2>

      <span>
        {{
          search ||
          statusFilter !== 'all'
            ? 'Try changing your search or filter.'
            : 'Create your first region to begin organising destinations.'
        }}
      </span>

      <button
        v-if="
          !search &&
          statusFilter === 'all'
        "
        @click="openCreate"
      >
        Add first region
      </button>
    </section>

    <RegionFormModal
      :open="formOpen"
      :region="editingRegion"
      :saving="saving"
      @close="closeForm"
      @save="handleSave"
    />

    <!-- DELETE -->

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

            <p>DELETE REGION</p>

            <h2>
              Remove
              {{ deleteTarget.name }}?
            </h2>

            <span>
              This region will be permanently
              removed. Regions being used by
              destinations cannot be deleted.
            </span>

            <div
              v-if="actionError"
              class="delete-error"
            >
              {{ actionError }}
            </div>

            <div class="delete-actions">
              <button
                class="keep"
                :disabled="
                  Boolean(deletingId)
                "
                @click="closeDelete"
              >
                Keep region
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
                    : 'Delete region'
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
  letter-spacing: 0.2em;
}

.page-header h1 {
  margin: 0;
  font-family: Georgia, serif;
  font-size: 39px;
  font-weight: 400;
  letter-spacing: -0.035em;
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
    rgba(166, 15, 165, 0.18);
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
  letter-spacing: 0.13em;
}

.summary-grid strong {
  display: block;
  margin-top: 8px;
  font-family: Georgia, serif;
  font-size: 25px;
  font-weight: 400;
}

.toolbar {
  display: flex;
  margin-bottom: 17px;
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: 13px;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  background: white;
}

.search {
  position: relative;
  width: min(100%, 390px);
}

.search span {
  position: absolute;
  top: 50%;
  left: 13px;
  color: var(--muted);
  transform: translateY(-50%);
}

.search input {
  width: 100%;
  height: 40px;
  padding: 0 13px 0 38px;
  border: 0;
  border-radius: 8px;
  outline: none;
  background: var(--surface-soft);
  font: inherit;
  font-size: 10px;
}

.filters {
  display: flex;
  padding: 3px;
  border-radius: 8px;
  background: #f6f2f5;
}

.filters button {
  min-height: 34px;
  padding: 0 12px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  font-size: 8px;
  font-weight: 650;
}

.filters button.active {
  background: white;
  color: var(--brand-dark);
  box-shadow:
    0 3px 10px
    rgba(36, 17, 32, 0.06);
}

.region-table {
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: white;
}

.table-header,
.region-row {
  display: grid;
  grid-template-columns:
    minmax(330px, 1fr)
    150px
    90px
    140px;
  align-items: center;
}

.table-header {
  min-height: 42px;
  padding: 0 18px;
  border-bottom: 1px solid var(--border);
  background: #fbf9fa;
  color: #8f858d;
  font-size: 7px;
  font-weight: 750;
  letter-spacing: 0.16em;
}

.region-row {
  min-height: 92px;
  padding: 12px 18px;
  border-bottom: 1px solid var(--border);
  transition: background 0.2s ease;
}

.region-row:last-child {
  border-bottom: 0;
}

.region-row:hover {
  background: #fdfbfc;
}

.region-info {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 14px;
}

.region-image {
  display: grid;
  width: 66px;
  height: 60px;
  flex: 0 0 auto;
  overflow: hidden;
  border-radius: 10px;
  place-items: center;
  background: var(--brand-gradient);
  color: white;
}

.region-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.region-info > div:last-child {
  min-width: 0;
}

.region-info strong {
  color: var(--text);
  font-size: 11px;
}

.region-info p {
  margin: 3px 0;
  color: var(--brand-dark);
  font-size: 8px;
}

.region-info small {
  display: block;
  max-width: 390px;
  overflow: hidden;
  color: var(--muted);
  font-size: 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  font-weight: 650;
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

.order {
  color: var(--muted);
  font-size: 10px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 7px;
}

.edit-button,
.delete-button {
  min-height: 33px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: white;
  cursor: pointer;
}

.edit-button {
  padding: 0 12px;
  color: var(--text);
  font-size: 8px;
  font-weight: 650;
}

.delete-button {
  width: 33px;
  padding: 0;
  color: #a64a5e;
  font-size: 16px;
}

.empty-state {
  padding: 75px 25px;
  border: 1px dashed #ddd4da;
  border-radius: 15px;
  background: white;
  text-align: center;
}

.empty-state > div {
  display: grid;
  width: 45px;
  height: 45px;
  margin: auto;
  border-radius: 13px;
  place-items: center;
  background: var(--brand-gradient);
  color: white;
}

.empty-state p {
  margin: 18px 0 7px;
  color: var(--brand-dark);
  font-size: 8px;
  font-weight: 750;
  letter-spacing: 0.18em;
}

.empty-state h2 {
  margin: 0;
  font-family: Georgia, serif;
  font-size: 25px;
  font-weight: 400;
}

.empty-state > span {
  display: block;
  margin: 10px auto 0;
  color: var(--muted);
  font-size: 10px;
}

.empty-state button {
  min-height: 38px;
  margin-top: 19px;
  padding: 0 14px;
  border: 0;
  border-radius: 8px;
  background: var(--brand-gradient);
  color: white;
  cursor: pointer;
  font-size: 8px;
}

.error-banner {
  display: flex;
  margin-bottom: 15px;
  padding: 12px 14px;
  border: 1px solid #efd6dc;
  border-radius: 9px;
  align-items: center;
  justify-content: space-between;
  background: #fff7f9;
  color: #a34257;
  font-size: 9px;
}

.error-banner button {
  border: 0;
  background: transparent;
  color: #8c3448;
  cursor: pointer;
  font-size: 8px;
  font-weight: 700;
}

.skeleton-row {
  margin-bottom: 8px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: white;
}

.skeleton-image {
  width: 65px;
  height: 58px;
  border-radius: 9px;
}

.skeleton-text {
  width: 180px;
  height: 10px;
  border-radius: 10px;
}

.skeleton-status {
  width: 70px;
  height: 20px;
  border-radius: 100px;
}

.row-enter-active,
.row-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.row-enter-from,
.row-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

@media (max-width: 900px) {
  .region-table {
    overflow-x: auto;
  }

  .table-header,
  .region-row {
    min-width: 760px;
  }
}

@media (max-width: 650px) {
  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .primary-button {
    width: 100%;
    justify-content: center;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .search {
    width: 100%;
  }

  .filters {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>

<style>
.delete-backdrop {
  position: fixed;
  z-index: 1200;
  inset: 0;
  display: grid;
  padding: 20px;
  place-items: center;
  background: rgba(10, 7, 10, 0.7);
  backdrop-filter: blur(7px);
}

.delete-dialog {
  width: min(100%, 420px);
  padding: 30px;
  border-radius: 19px;
  background: white;
  text-align: center;
  box-shadow:
    0 35px 90px
    rgba(14, 5, 13, 0.3);
}

.danger-icon {
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

.delete-dialog > p {
  margin: 16px 0 7px;
  color: #a83f55;
  font-size: 8px;
  font-weight: 750;
  letter-spacing: 0.18em;
}

.delete-dialog h2 {
  margin: 0;
  color: #241e23;
  font-family: Georgia, serif;
  font-size: 26px;
  font-weight: 400;
}

.delete-dialog > span {
  display: block;
  margin: 11px auto 0;
  color: #837980;
  font-size: 10px;
  line-height: 1.65;
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
  opacity: 0.6;
}

.delete-error {
  margin-top: 14px;
  padding: 10px;
  border: 1px solid #efd5dc;
  border-radius: 8px;
  background: #fff6f8;
  color: #a33e55;
  font-size: 9px;
}

.delete-modal-enter-active,
.delete-modal-leave-active {
  transition: opacity 0.22s ease;
}

.delete-modal-enter-from,
.delete-modal-leave-to {
  opacity: 0;
}
</style>    