<script setup lang="ts">
import TravelStyleFormModal from '../../components/travel-styles/TravelStyleFormModal.vue'

import {
  useTravelStyles,
  type TravelStyle,
  type TravelStylePayload,
} from '../../composables/useTravelStyles'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const {
  travelStyles,
  loading,
  saving,
  deletingId,
  error,

  fetchTravelStyles,
  createTravelStyle,
  updateTravelStyle,
  deleteTravelStyle,
} = useTravelStyles()

const search = ref('')
const statusFilter = ref('all')

const formOpen = ref(false)

const editingTravelStyle =
  ref<TravelStyle | null>(null)

const formError = ref('')

const deleteTarget =
  ref<TravelStyle | null>(null)

const deleteError = ref('')

const filteredTravelStyles =
  computed(() => {
    const query =
      search.value.trim().toLowerCase()

    return travelStyles.value.filter(
      (item) => {
        const matchesSearch =
          !query ||
          item.name
            .toLowerCase()
            .includes(query) ||
          item.slug
            .toLowerCase()
            .includes(query)

        const matchesStatus =
          statusFilter.value === 'all' ||
          (
            statusFilter.value ===
            'published'
              ? item.isPublished
              : !item.isPublished
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
    travelStyles.value.filter(
      item => item.isPublished,
    ).length,
)

const draftCount = computed(
  () =>
    travelStyles.value.length -
    publishedCount.value,
)

const openCreate = () => {
  editingTravelStyle.value = null
  formError.value = ''
  formOpen.value = true
}

const openEdit = (
  item: TravelStyle,
) => {
  editingTravelStyle.value = item
  formError.value = ''
  formOpen.value = true
}

const closeForm = () => {
  if (saving.value) return

  formOpen.value = false
  editingTravelStyle.value = null
  formError.value = ''
}

const handleSave = async (
  payload: TravelStylePayload,
) => {
  formError.value = ''

  try {
    if (editingTravelStyle.value) {
      await updateTravelStyle(
        editingTravelStyle.value._id,
        payload,
      )
    } else {
      await createTravelStyle(payload)
    }

    closeForm()
  } catch (err: any) {
    formError.value =
      err?.data?.message ||
      'Unable to save travel style.'
  }
}

const requestDelete = (
  item: TravelStyle,
) => {
  deleteTarget.value = item
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
    await deleteTravelStyle(
      deleteTarget.value._id,
    )

    deleteTarget.value = null
  } catch (err: any) {
    deleteError.value =
      err?.data?.message ||
      'Unable to delete travel style.'
  }
}

onMounted(fetchTravelStyles)
</script>

<template>
  <div class="travel-styles-page page-enter">
    <header class="page-header">
      <div>
        <p class="eyebrow">
          TRAVELLER PROFILE
        </p>

        <h1>Travel Styles</h1>

        <p class="description">
          Organise journeys around the way
          different travellers prefer to explore.
        </p>
      </div>

      <button
        type="button"
        class="primary-button"
        @click="openCreate"
      >
        <span>＋</span>
        Add travel style
      </button>
    </header>

    <section class="summary-grid">
      <article>
        <span>TOTAL STYLES</span>
        <strong>
          {{ travelStyles.length }}
        </strong>
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
          placeholder="Search travel styles..."
        >
      </div>

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
      v-else-if="filteredTravelStyles.length"
      class="style-table"
    >
      <div class="table-head">
        <span>TRAVEL STYLE</span>
        <span>STATUS</span>
        <span>ORDER</span>
        <span>ACTIONS</span>
      </div>

      <article
        v-for="item in filteredTravelStyles"
        :key="item._id"
        class="style-row"
      >
        <div class="style-info">
          <div class="visual">
            <img
              v-if="item.image?.url"
              :src="item.image.url"
              :alt="
                item.image.altText ||
                item.name
              "
            >

            <span v-else>✦</span>
          </div>

          <div>
            <strong>
              {{ item.name }}
            </strong>

            <p>/{{ item.slug }}</p>

            <small>
              {{
                item.shortDescription ||
                'No description added.'
              }}
            </small>
          </div>
        </div>

        <div>
          <span
            class="status"
            :class="{
              published: item.isPublished,
            }"
          >
            <i />

            {{
              item.isPublished
                ? 'Published'
                : 'Draft'
            }}
          </span>
        </div>

        <div class="order">
          {{ item.sortOrder ?? 0 }}
        </div>

        <div class="actions">
          <button
            class="edit"
            @click="openEdit(item)"
          >
            Edit
          </button>

          <button
            class="delete"
            @click="requestDelete(item)"
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
      <div>✦</div>

      <p>TRAVEL STYLES</p>

      <h2>
        {{
          search ||
          statusFilter !== 'all'
            ? 'No travel styles found.'
            : 'Define how people travel.'
        }}
      </h2>

      <span>
        {{
          search ||
          statusFilter !== 'all'
            ? 'Try changing your search or filters.'
            : 'Create styles such as Solo, Couple, Family, Honeymoon and Corporate.'
        }}
      </span>
    </section>

    <TravelStyleFormModal
      :open="formOpen"
      :travel-style="editingTravelStyle"
      :saving="saving"
      :error="formError"
      @close="closeForm"
      @save="handleSave"
    />

    <Teleport to="body">
      <div
        v-if="deleteTarget"
        class="delete-backdrop"
        @click.self="closeDelete"
      >
        <section class="delete-dialog">
          <div class="danger-icon">×</div>

          <p>DELETE TRAVEL STYLE</p>

          <h2>
            Remove {{ deleteTarget.name }}?
          </h2>

          <span>
            A travel style connected to a journey
            or enquiry cannot be deleted.
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
              @click="closeDelete"
            >
              Keep travel style
            </button>

            <button
              class="remove"
              :disabled="Boolean(deletingId)"
              @click="confirmDelete"
            >
              {{
                deletingId
                  ? 'Deleting...'
                  : 'Delete travel style'
              }}
            </button>
          </div>
        </section>
      </div>
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
}

.summary-grid {
  display: grid;
  margin-bottom: 18px;
  grid-template-columns:
    repeat(3, minmax(0, 1fr));
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
    minmax(250px, 1fr) 190px;
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

.style-table {
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 15px;
  background: white;
}

.table-head,
.style-row {
  display: grid;
  grid-template-columns:
    minmax(380px, 1fr)
    160px
    100px
    150px;
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

.style-row {
  min-height: 104px;
  padding: 14px 20px;
  border-bottom: 1px solid var(--border);
}

.style-row:last-child {
  border-bottom: 0;
}

.style-info {
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

.style-info strong {
  font-size: 14px;
}

.style-info p {
  margin: 4px 0;
  color: var(--brand-dark);
  font-size: 12px;
}

.style-info small {
  display: block;
  max-width: 430px;
  overflow: hidden;
  color: var(--muted);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
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

.order {
  font-size: 13px;
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
  font-size: 12px;
  font-weight: 650;
}

.delete {
  width: 38px;
  color: #a64a5e;
  font-size: 18px;
}

.loading-row {
  height: 102px;
  margin-bottom: 9px;
  border-radius: 13px;
}

.error-banner {
  margin-bottom: 16px;
  padding: 13px 15px;
  border: 1px solid #efd6dc;
  border-radius: 10px;
  background: #fff7f9;
  color: #a34257;
  font-size: 13px;
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
  max-width: 520px;
  margin: 11px auto 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.6;
}

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
  font-family: Georgia, serif;
  font-size: 28px;
  font-weight: 400;
}

.delete-dialog > span {
  display: block;
  margin-top: 12px;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.6;
}

.delete-error {
  margin-top: 15px;
  padding: 11px;
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

.keep {
  border: 1px solid var(--border);
  background: white;
}

.remove {
  border: 0;
  background: #a94459;
  color: white;
}

@media(max-width: 800px) {
  .style-table {
    overflow-x: auto;
  }

  .table-head,
  .style-row {
    min-width: 780px;
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

  .summary-grid,
  .toolbar {
    grid-template-columns: 1fr;
  }
}
</style>