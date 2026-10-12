<script setup lang="ts">
import MediaCard from '../../components/media/MediaCard.vue'
import MediaUploadModal from '../../components/media/MediaUploadModal.vue'

import {
  useMedia,
  type MediaItem,
} from '../../composables/useMedia'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

type MediaFilter =
  | 'all'
  | 'image'
  | 'video'

const {
  media,
  loading,
  uploading,
  deletingId,
  error,
  fetchMedia,
  uploadMedia,
  deleteMedia,
} = useMedia()

const search = ref('')
const activeFilter =
  ref<MediaFilter>('all')

const uploadModalOpen = ref(false)

const deleteTarget =
  ref<MediaItem | null>(null)

const deleteError = ref('')

const filteredMedia = computed(() => {
  const query =
    search.value
      .trim()
      .toLowerCase()

  return media.value.filter((item) => {
    const matchesType =
      activeFilter.value === 'all' ||
      item.type === activeFilter.value

    if (!matchesType) {
      return false
    }

    if (!query) {
      return true
    }

    return (
      item.filename
        .toLowerCase()
        .includes(query) ||
      item.altText
        ?.toLowerCase()
        .includes(query)
    )
  })
})

const imageCount = computed(
  () =>
    media.value.filter(
      item => item.type === 'image',
    ).length,
)

const videoCount = computed(
  () =>
    media.value.filter(
      item => item.type === 'video',
    ).length,
)

const handleUpload = async (
  payload: {
    file: File
    altText: string
  },
) => {
  try {
    await uploadMedia(
      payload.file,
      payload.altText,
    )

    uploadModalOpen.value = false
  } catch {
    // Error already handled
    // inside useMedia().
  }
}

const requestDelete = (
  item: MediaItem,
) => {
  deleteError.value = ''
  deleteTarget.value = item
}

const closeDelete = () => {
  if (deletingId.value) return

  deleteTarget.value = null
  deleteError.value = ''
}

const confirmDelete = async () => {
  if (!deleteTarget.value) {
    return
  }

  deleteError.value = ''

  try {
    await deleteMedia(
      deleteTarget.value._id,
    )

    deleteTarget.value = null
  } catch (err: any) {
    deleteError.value =
      err?.data?.message ||
      'This asset could not be deleted.'
  }
}

onMounted(() => {
  fetchMedia()
})
</script>

<template>
  <div class="media-page page-enter">
    <!-- PAGE HEADER -->

    <header class="page-header">
      <div class="heading-copy">
        <p class="eyebrow">
          MEDIA LIBRARY
        </p>

        <h1>Visual assets</h1>

        <p class="description">
          Curate the imagery and films
          that shape the Vedic Journey
          experience.
        </p>
      </div>

      <button
        type="button"
        class="primary-button"
        @click="uploadModalOpen = true"
      >
        <span class="plus">＋</span>

        Upload media
      </button>
    </header>

    <!-- TOOLBAR -->

    <section class="toolbar">
      <div class="search-box">
        <span class="search-icon">
          ⌕
        </span>

        <input
          v-model="search"
          type="search"
          placeholder="Search visual assets..."
        >
      </div>

      <div class="filters">
        <button
          type="button"
          :class="{
            active:
              activeFilter === 'all',
          }"
          @click="activeFilter = 'all'"
        >
          All

          <span>
            {{ media.length }}
          </span>
        </button>

        <button
          type="button"
          :class="{
            active:
              activeFilter === 'image',
          }"
          @click="activeFilter = 'image'"
        >
          Images

          <span>
            {{ imageCount }}
          </span>
        </button>

        <button
          type="button"
          :class="{
            active:
              activeFilter === 'video',
          }"
          @click="activeFilter = 'video'"
        >
          Videos

          <span>
            {{ videoCount }}
          </span>
        </button>
      </div>
    </section>

    <!-- ERROR -->

    <div
      v-if="error && !loading"
      class="page-error"
    >
      <div>
        <strong>
          Unable to load visual assets.
        </strong>

        <p>{{ error }}</p>
      </div>

      <button
        type="button"
        @click="fetchMedia"
      >
        Try again
      </button>
    </div>

    <!-- ASSET HEADING -->

    <div
      v-if="!error || media.length"
      class="asset-heading"
    >
      <div>
        <span class="heading-line" />

        <p>
          {{
            activeFilter === 'all'
              ? 'ALL ASSETS'
              : activeFilter === 'image'
                ? 'IMAGES'
                : 'VIDEOS'
          }}
        </p>
      </div>

      <span class="asset-count">
        {{ filteredMedia.length }}
        {{
          filteredMedia.length === 1
            ? 'asset'
            : 'assets'
        }}
      </span>
    </div>

    <!-- LOADING -->

    <div
      v-if="loading"
      class="media-grid"
    >
      <article
        v-for="index in 8"
        :key="index"
        class="skeleton-card"
      >
        <div class="skeleton preview-skeleton" />

        <div class="skeleton-content">
          <div
            class="skeleton skeleton-title"
          />

          <div
            class="skeleton skeleton-file"
          />

          <div
            class="skeleton skeleton-meta"
          />
        </div>
      </article>
    </div>

    <!-- MEDIA GRID -->

    <TransitionGroup
      v-else-if="filteredMedia.length"
      name="asset"
      tag="div"
      class="media-grid"
    >
      <MediaCard
        v-for="item in filteredMedia"
        :key="item._id"
        :item="item"
        :deleting="
          deletingId === item._id
        "
        @delete="requestDelete"
      />
    </TransitionGroup>

    <!-- EMPTY -->

    <section
      v-else-if="!error"
      class="empty-state"
    >
      <div class="empty-symbol">
        ✦
      </div>

      <template v-if="search">
        <p class="empty-eyebrow">
          NO RESULTS
        </p>

        <h2>
          No visual assets found.
        </h2>

        <p>
          Try another search term or
          change the current filter.
        </p>

        <button
          type="button"
          class="secondary-button"
          @click="
            search = '';
            activeFilter = 'all'
          "
        >
          Clear filters
        </button>
      </template>

      <template v-else>
        <p class="empty-eyebrow">
          BEGIN YOUR COLLECTION
        </p>

        <h2>
          Your visual story starts here.
        </h2>

        <p>
          Upload destination imagery,
          journey photography and films
          for the Vedic Journey website.
        </p>

        <button
          type="button"
          class="secondary-button"
          @click="
            uploadModalOpen = true
          "
        >
          Upload first asset
        </button>
      </template>
    </section>

    <!-- UPLOAD -->

    <MediaUploadModal
      :open="uploadModalOpen"
      :uploading="uploading"
      @close="uploadModalOpen = false"
      @upload="handleUpload"
    />

    <!-- DELETE CONFIRMATION -->

    <Teleport to="body">
      <Transition name="confirm">
        <div
          v-if="deleteTarget"
          class="confirm-backdrop"
          @click.self="closeDelete"
        >
          <section class="confirm-dialog">
            <div class="danger-symbol">
              ×
            </div>

            <p class="confirm-eyebrow">
              REMOVE ASSET
            </p>

            <h2>
              Delete this visual?
            </h2>

            <p class="confirm-copy">
              <strong>
                {{
                  deleteTarget.altText ||
                  deleteTarget.filename
                }}
              </strong>

              will be permanently removed
              from the media library.
            </p>

            <div
              v-if="deleteError"
              class="delete-error"
            >
              {{ deleteError }}
            </div>

            <div class="confirm-actions">
              <button
                type="button"
                class="cancel-delete"
                :disabled="
                  Boolean(deletingId)
                "
                @click="closeDelete"
              >
                Keep asset
              </button>

              <button
                type="button"
                class="confirm-delete"
                :disabled="
                  Boolean(deletingId)
                "
                @click="confirmDelete"
              >
                {{
                  deletingId
                    ? 'Deleting...'
                    : 'Delete asset'
                }}
              </button>
            </div>

            <p class="reference-note">
              Assets currently used by
              website content cannot be
              deleted.
            </p>
          </section>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.media-page {
  width: 100%;
}

/* HEADER */

.page-header {
  display: flex;
  margin-bottom: 31px;
  align-items: flex-end;
  justify-content: space-between;
  gap: 30px;
}

.eyebrow {
  margin: 0 0 10px;
  color: var(--brand-dark);
  font-size: 9px;
  font-weight: 750;
  letter-spacing: 0.2em;
}

.page-header h1 {
  margin: 0;
  color: var(--text);
  font-family:
    Georgia,
    'Times New Roman',
    serif;
  font-size: 39px;
  font-weight: 400;
  letter-spacing: -0.035em;
}

.description {
  max-width: 480px;
  margin: 10px 0 0;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.65;
}

.primary-button {
  display: flex;
  min-height: 45px;
  padding: 0 18px;
  border: 0;
  border-radius: 10px;
  align-items: center;
  gap: 9px;
  background: var(--brand-gradient);
  color: white;
  cursor: pointer;
  font-size: 11px;
  font-weight: 650;
  box-shadow:
    0 10px 25px
    rgba(166, 15, 165, 0.19);
  transition:
    transform 0.23s ease,
    box-shadow 0.23s ease;
}

.primary-button:hover {
  box-shadow:
    0 14px 30px
    rgba(166, 15, 165, 0.26);
  transform: translateY(-2px);
}

.plus {
  font-size: 16px;
  font-weight: 400;
}

/* TOOLBAR */

.toolbar {
  display: flex;
  margin-bottom: 29px;
  padding: 11px;
  border: 1px solid var(--border);
  border-radius: 14px;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: var(--surface);
  box-shadow:
    0 7px 25px
    rgba(37, 17, 33, 0.025);
}

.search-box {
  position: relative;
  width: min(100%, 410px);
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 14px;
  color: #9b9299;
  font-size: 16px;
  transform: translateY(-50%);
}

.search-box input {
  width: 100%;
  height: 42px;
  padding: 0 14px 0 40px;
  border: 1px solid transparent;
  border-radius: 9px;
  outline: none;
  background: var(--surface-soft);
  color: var(--text);
  font: inherit;
  font-size: 11px;
  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}

.search-box input:focus {
  border-color:
    rgba(216, 11, 185, 0.25);
  background: white;
  box-shadow:
    0 0 0 3px
    rgba(216, 11, 185, 0.045);
}

.search-box input::placeholder {
  color: #a9a0a7;
}

.filters {
  display: flex;
  padding: 3px;
  border-radius: 9px;
  background: #f6f2f5;
}

.filters button {
  display: flex;
  min-height: 36px;
  padding: 0 12px;
  border: 0;
  border-radius: 7px;
  align-items: center;
  gap: 7px;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  font-size: 9px;
  font-weight: 650;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease;
}

.filters button span {
  color: #a69da4;
  font-size: 8px;
}

.filters button.active {
  background: white;
  color: var(--brand-dark);
  box-shadow:
    0 3px 10px
    rgba(36, 17, 32, 0.06);
}

.filters button.active span {
  color: var(--brand);
}

/* ASSET TITLE */

.asset-heading {
  display: flex;
  margin-bottom: 15px;
  align-items: center;
  justify-content: space-between;
}

.asset-heading > div {
  display: flex;
  align-items: center;
  gap: 9px;
}

.asset-heading p {
  margin: 0;
  color: #81777f;
  font-size: 8px;
  font-weight: 750;
  letter-spacing: 0.17em;
}

.heading-line {
  width: 17px;
  height: 1px;
  background: var(--brand);
}

.asset-count {
  color: #9d949b;
  font-size: 9px;
}

/* GRID */

.media-grid {
  display: grid;
  grid-template-columns:
    repeat(
      4,
      minmax(0, 1fr)
    );
  gap: 18px;
}

/* SKELETON */

.skeleton-card {
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: white;
}

.preview-skeleton {
  height: 230px;
}

.skeleton-content {
  padding: 18px;
}

.skeleton-title {
  width: 64%;
  height: 11px;
  border-radius: 10px;
}

.skeleton-file {
  width: 42%;
  height: 7px;
  margin-top: 10px;
  border-radius: 10px;
}

.skeleton-meta {
  width: 53%;
  height: 6px;
  margin-top: 18px;
  border-radius: 10px;
}

/* EMPTY */

.empty-state {
  display: flex;
  min-height: 390px;
  padding: 50px 25px;
  border: 1px dashed #ded6dc;
  border-radius: 18px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background:
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.8),
      rgba(251, 248, 250, 0.8)
    );
  text-align: center;
}

.empty-symbol {
  display: grid;
  width: 48px;
  height: 48px;
  margin-bottom: 19px;
  border-radius: 14px;
  place-items: center;
  background: var(--brand-gradient);
  color: white;
  box-shadow:
    0 10px 25px
    rgba(170, 13, 161, 0.16);
}

.empty-eyebrow {
  margin: 0 0 8px;
  color: var(--brand-dark);
  font-size: 8px;
  font-weight: 750;
  letter-spacing: 0.2em;
}

.empty-state h2 {
  margin: 0;
  font-family: Georgia, serif;
  font-size: 25px;
  font-weight: 400;
}

.empty-state > p:last-of-type {
  max-width: 420px;
  margin: 11px auto 0;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.7;
}

.secondary-button {
  min-height: 39px;
  margin-top: 20px;
  padding: 0 15px;
  border: 1px solid var(--border);
  border-radius: 9px;
  background: white;
  color: var(--text);
  cursor: pointer;
  font-size: 9px;
  font-weight: 650;
}

/* ERROR */

.page-error {
  display: flex;
  margin-bottom: 25px;
  padding: 15px 17px;
  border: 1px solid #ecd5dc;
  border-radius: 11px;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  background: #fff8fa;
}

.page-error strong {
  color: #873d51;
  font-size: 11px;
}

.page-error p {
  margin: 4px 0 0;
  color: #a06675;
  font-size: 9px;
}

.page-error button {
  min-height: 34px;
  padding: 0 12px;
  border: 1px solid #e4c9d1;
  border-radius: 8px;
  background: white;
  color: #91475a;
  cursor: pointer;
  font-size: 9px;
}

/* GRID TRANSITIONS */

.asset-enter-active,
.asset-leave-active,
.asset-move {
  transition:
    opacity 0.32s ease,
    transform 0.32s
    cubic-bezier(
      0.22,
      1,
      0.36,
      1
    );
}

.asset-enter-from,
.asset-leave-to {
  opacity: 0;
  transform:
    translateY(10px)
    scale(0.98);
}

.asset-leave-active {
  position: absolute;
}

/* RESPONSIVE */

@media (max-width: 1450px) {
  .media-grid {
    grid-template-columns:
      repeat(
        3,
        minmax(0, 1fr)
      );
  }
}

@media (max-width: 1100px) {
  .media-grid {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }
}

@media (max-width: 750px) {
  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .primary-button {
    width: 100%;
    justify-content: center;
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
    grid-template-columns:
      repeat(3, 1fr);
  }

  .filters button {
    justify-content: center;
  }
}

@media (max-width: 580px) {
  .page-header h1 {
    font-size: 34px;
  }

  .media-grid {
    grid-template-columns: 1fr;
  }

  .asset-heading {
    margin-top: 4px;
  }
}
</style>

<style>
/*
 Delete dialog is teleported to body,
 so these styles cannot be scoped.
*/

.confirm-backdrop {
  position: fixed;
  z-index: 1200;
  inset: 0;
  display: grid;
  padding: 20px;
  place-items: center;
  background: rgba(10, 7, 10, 0.68);
  backdrop-filter: blur(7px);
}

.confirm-dialog {
  width: min(100%, 430px);
  padding: 30px;
  border-radius: 19px;
  background: white;
  text-align: center;
  box-shadow:
    0 35px 90px
    rgba(14, 5, 13, 0.3);
}

.danger-symbol {
  display: grid;
  width: 45px;
  height: 45px;
  margin: 0 auto 17px;
  border-radius: 13px;
  place-items: center;
  background: #fff1f4;
  color: #ad4058;
  font-size: 21px;
}

.confirm-eyebrow {
  margin: 0 0 8px;
  color: #a54057;
  font-size: 8px;
  font-weight: 750;
  letter-spacing: 0.2em;
}

.confirm-dialog h2 {
  margin: 0;
  color: #241e23;
  font-family: Georgia, serif;
  font-size: 27px;
  font-weight: 400;
}

.confirm-copy {
  margin: 12px auto 0;
  color: #81777f;
  font-size: 10px;
  line-height: 1.7;
}

.confirm-copy strong {
  color: #40363e;
}

.confirm-actions {
  display: grid;
  margin-top: 24px;
  grid-template-columns: 1fr 1fr;
  gap: 9px;
}

.cancel-delete,
.confirm-delete {
  min-height: 42px;
  border-radius: 9px;
  cursor: pointer;
  font-size: 9px;
  font-weight: 700;
}

.cancel-delete {
  border: 1px solid #ebe5ea;
  background: white;
  color: #3c343a;
}

.confirm-delete {
  border: 0;
  background: #a94459;
  color: white;
}

.cancel-delete:disabled,
.confirm-delete:disabled {
  cursor: wait;
  opacity: 0.6;
}

.reference-note {
  margin: 14px 0 0;
  color: #aaa0a8;
  font-size: 8px;
}

.delete-error {
  margin-top: 15px;
  padding: 10px 12px;
  border: 1px solid #efd6dc;
  border-radius: 8px;
  background: #fff6f8;
  color: #a23f55;
  font-size: 9px;
}

.confirm-enter-active,
.confirm-leave-active {
  transition: opacity 0.22s ease;
}

.confirm-enter-active
.confirm-dialog,
.confirm-leave-active
.confirm-dialog {
  transition:
    opacity 0.25s ease,
    transform 0.28s
    cubic-bezier(
      0.22,
      1,
      0.36,
      1
    );
}

.confirm-enter-from,
.confirm-leave-to {
  opacity: 0;
}

.confirm-enter-from
.confirm-dialog,
.confirm-leave-to
.confirm-dialog {
  opacity: 0;
  transform:
    translateY(10px)
    scale(0.975);
}
</style>