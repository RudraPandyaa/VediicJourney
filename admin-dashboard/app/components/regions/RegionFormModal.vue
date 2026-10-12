<script setup lang="ts">
import type {
  Region,
  RegionPayload,
} from '../../composables/useRegions'

import {
  useMedia,
  type MediaItem,
} from '../../composables/useMedia'

const props = defineProps<{
  open: boolean
  region?: Region | null
  saving?: boolean
}>()

const emit = defineEmits<{
  close: []
  save: [payload: RegionPayload]
}>()

const {
  media,
  loading: mediaLoading,
  fetchMedia,
} = useMedia()

const name = ref('')
const slug = ref('')
const shortDescription = ref('')
const selectedImage = ref<string>('')
const sortOrder = ref(0)
const isPublished = ref(false)

const searchMedia = ref('')
const mediaOpen = ref(false)

const isEditing = computed(
  () => Boolean(props.region),
)

const filteredImages = computed(() => {
  const query =
    searchMedia.value
      .trim()
      .toLowerCase()

  return media.value
    .filter(
      item => item.type === 'image',
    )
    .filter((item) => {
      if (!query) return true

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

const selectedMedia =
  computed<MediaItem | null>(() => {
    if (!selectedImage.value) {
      return null
    }

    const fromLibrary =
      media.value.find(
        item =>
          item._id === selectedImage.value,
      )

    if (fromLibrary) {
      return fromLibrary
    }

    if (
      props.region?.image?._id ===
      selectedImage.value
    ) {
      return props.region.image
    }

    return null
  })

const makeSlug = (value: string) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const resetForm = () => {
  name.value = props.region?.name || ''
  slug.value = props.region?.slug || ''

  shortDescription.value =
    props.region?.shortDescription || ''

  selectedImage.value =
    props.region?.image?._id || ''

  sortOrder.value =
    props.region?.sortOrder ?? 0

  isPublished.value =
    props.region?.isPublished ?? false

  searchMedia.value = ''
  mediaOpen.value = false
}

const openMedia = async () => {
  mediaOpen.value = true

  if (!media.value.length) {
    await fetchMedia()
  }
}

const chooseMedia = (
  item: MediaItem,
) => {
  selectedImage.value = item._id
  mediaOpen.value = false
}

const removeImage = () => {
  selectedImage.value = ''
}

const close = () => {
  if (props.saving) return

  emit('close')
}

const submit = () => {
  if (
    !name.value.trim() ||
    !slug.value.trim()
  ) {
    return
  }

  const payload: RegionPayload = {
    name: name.value.trim(),
    slug: slug.value.trim(),
    shortDescription:
      shortDescription.value.trim(),
    sortOrder:
      Number(sortOrder.value) || 0,
    isPublished: isPublished.value,
  }

  if (selectedImage.value) {
    payload.image = selectedImage.value
  }

  emit('save', payload)
}

watch(
  () => props.open,
  (open) => {
    if (open) {
      resetForm()
    }
  },
)

watch(name, (value) => {
  if (!isEditing.value) {
    slug.value = makeSlug(value)
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="region-modal">
      <div
        v-if="open"
        class="region-backdrop"
        @click.self="close"
      >
        <section class="region-modal">
          <header class="modal-header">
            <div>
              <p class="eyebrow">
                {{
                  isEditing
                    ? 'EDIT REGION'
                    : 'NEW REGION'
                }}
              </p>

              <h2>
                {{
                  isEditing
                    ? 'Refine the region.'
                    : 'Add to the world.'
                }}
              </h2>
            </div>

            <button
              type="button"
              class="close-button"
              :disabled="saving"
              @click="close"
            >
              ×
            </button>
          </header>

          <p class="intro">
            Organise destinations into
            meaningful global travel regions.
          </p>

          <form
            class="region-form"
            @submit.prevent="submit"
          >
            <div class="field-grid">
              <div class="field">
                <label for="region-name">
                  Region name
                </label>

                <input
                  id="region-name"
                  v-model="name"
                  maxlength="100"
                  required
                  placeholder="e.g. Europe"
                >
              </div>

              <div class="field">
                <label for="region-slug">
                  Slug
                </label>

                <input
                  id="region-slug"
                  v-model="slug"
                  maxlength="120"
                  required
                  placeholder="europe"
                >
              </div>
            </div>

            <div class="field">
              <div class="label-row">
                <label>
                  Region visual
                </label>

                <span>Optional</span>
              </div>

              <div
                v-if="selectedMedia"
                class="selected-image"
              >
                <img
                  :src="selectedMedia.url"
                  :alt="
                    selectedMedia.altText ||
                    selectedMedia.filename
                  "
                >

                <div class="image-overlay">
                  <div>
                    <strong>
                      {{
                        selectedMedia.altText ||
                        selectedMedia.filename
                      }}
                    </strong>

                    <span>
                      {{ selectedMedia.filename }}
                    </span>
                  </div>

                  <div class="image-actions">
                    <button
                      type="button"
                      @click="openMedia"
                    >
                      Change
                    </button>

                    <button
                      type="button"
                      class="remove"
                      @click="removeImage"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              <button
                v-else
                type="button"
                class="choose-image"
                @click="openMedia"
              >
                <span class="choose-symbol">
                  ✦
                </span>

                <span>
                  <strong>
                    Choose from Media Library
                  </strong>

                  <small>
                    Select an existing travel
                    visual
                  </small>
                </span>

                <b>→</b>
              </button>
            </div>

            <div class="field">
              <div class="label-row">
                <label for="region-description">
                  Short description
                </label>

                <span>
                  {{ shortDescription.length }}/500
                </span>
              </div>

              <textarea
                id="region-description"
                v-model="shortDescription"
                maxlength="500"
                rows="4"
                placeholder="A concise introduction to this travel region..."
              />
            </div>

            <div class="settings-row">
              <div class="field order-field">
                <label for="sort-order">
                  Sort order
                </label>

                <input
                  id="sort-order"
                  v-model.number="sortOrder"
                  type="number"
                  min="0"
                >
              </div>

              <label class="publish-control">
                <span>
                  <strong>
                    Published
                  </strong>

                  <small>
                    Visible on the public
                    website
                  </small>
                </span>

                <input
                  v-model="isPublished"
                  type="checkbox"
                >

                <span class="switch" />
              </label>
            </div>

            <footer class="modal-footer">
              <button
                type="button"
                class="cancel-button"
                :disabled="saving"
                @click="close"
              >
                Cancel
              </button>

              <button
                type="submit"
                class="save-button"
                :disabled="
                  saving ||
                  !name.trim() ||
                  !slug.trim()
                "
              >
                {{
                  saving
                    ? 'Saving...'
                    : isEditing
                      ? 'Save changes'
                      : 'Create region'
                }}

                <span v-if="!saving">
                  →
                </span>
              </button>
            </footer>
          </form>

          <!-- MEDIA PICKER -->

          <Transition name="picker">
            <div
              v-if="mediaOpen"
              class="media-picker"
            >
              <div class="picker-header">
                <div>
                  <p>MEDIA LIBRARY</p>
                  <h3>Select visual</h3>
                </div>

                <button
                  type="button"
                  @click="mediaOpen = false"
                >
                  ×
                </button>
              </div>

              <div class="picker-search">
                <span>⌕</span>

                <input
                  v-model="searchMedia"
                  type="search"
                  placeholder="Search images..."
                >
              </div>

              <div
                v-if="mediaLoading"
                class="picker-loading"
              >
                Loading visual collection...
              </div>

              <div
                v-else-if="filteredImages.length"
                class="picker-grid"
              >
                <button
                  v-for="item in filteredImages"
                  :key="item._id"
                  type="button"
                  class="picker-item"
                  :class="{
                    active:
                      selectedImage === item._id,
                  }"
                  @click="chooseMedia(item)"
                >
                  <img
                    :src="item.url"
                    :alt="
                      item.altText ||
                      item.filename
                    "
                  >

                  <span>
                    {{
                      item.altText ||
                      item.filename
                    }}
                  </span>
                </button>
              </div>

              <div
                v-else
                class="picker-empty"
              >
                No images found in the
                Media Library.
              </div>
            </div>
          </Transition>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.region-backdrop {
  position: fixed;
  z-index: 1100;
  inset: 0;
  display: grid;
  padding: 24px;
  overflow-y: auto;
  place-items: center;
  background: rgba(10, 7, 10, 0.7);
  backdrop-filter: blur(7px);
}

.region-modal {
  position: relative;
  width: min(100%, 690px);
  max-height: calc(100vh - 48px);
  padding: 30px;
  overflow-x: hidden;
  overflow-y: auto;
  border-radius: 21px;
  background: white;
  box-shadow:
    0 35px 90px rgba(14, 5, 13, 0.3);
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.eyebrow,
.picker-header p {
  margin: 0 0 8px;
  color: var(--brand-dark);
  font-size: 8px;
  font-weight: 750;
  letter-spacing: 0.2em;
}

.modal-header h2 {
  margin: 0;
  color: var(--text);
  font-family: Georgia, serif;
  font-size: 30px;
  font-weight: 400;
}

.close-button,
.picker-header button {
  display: grid;
  width: 35px;
  height: 35px;
  padding: 0;
  border: 1px solid var(--border);
  border-radius: 9px;
  place-items: center;
  background: white;
  color: var(--muted);
  cursor: pointer;
  font-size: 19px;
}

.intro {
  margin: 10px 0 27px;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.65;
}

.region-form {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.field-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.field label {
  display: block;
  margin-bottom: 8px;
  color: var(--text);
  font-size: 10px;
  font-weight: 650;
}

.label-row {
  display: flex;
  margin-bottom: 8px;
  align-items: center;
  justify-content: space-between;
}

.label-row label {
  margin: 0;
}

.label-row span {
  color: var(--muted);
  font-size: 8px;
}

.field input,
.field textarea {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 10px;
  outline: none;
  background: white;
  color: var(--text);
  font: inherit;
  font-size: 11px;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.field input {
  height: 48px;
  padding: 0 14px;
}

.field textarea {
  padding: 13px 14px;
  resize: vertical;
  line-height: 1.65;
}

.field input:focus,
.field textarea:focus {
  border-color:
    rgba(216, 11, 185, 0.42);
  box-shadow:
    0 0 0 4px
    rgba(216, 11, 185, 0.05);
}

.choose-image {
  display: flex;
  width: 100%;
  min-height: 78px;
  padding: 14px;
  border: 1px dashed #d9ced6;
  border-radius: 12px;
  align-items: center;
  gap: 13px;
  background: #fcfafb;
  cursor: pointer;
  text-align: left;
}

.choose-symbol {
  display: grid;
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  border-radius: 11px;
  place-items: center;
  background: var(--brand-gradient);
  color: white;
}

.choose-image > span:nth-child(2) {
  min-width: 0;
  flex: 1;
}

.choose-image strong,
.choose-image small {
  display: block;
}

.choose-image strong {
  color: var(--text);
  font-size: 10px;
}

.choose-image small {
  margin-top: 4px;
  color: var(--muted);
  font-size: 8px;
}

.choose-image b {
  color: var(--brand-dark);
  font-size: 15px;
}

.selected-image {
  position: relative;
  height: 190px;
  overflow: hidden;
  border-radius: 13px;
  background: #eee8ec;
}

.selected-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  right: 10px;
  bottom: 10px;
  left: 10px;
  display: flex;
  padding: 11px 12px;
  border-radius: 10px;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  background: rgba(12, 8, 11, 0.72);
  color: white;
  backdrop-filter: blur(9px);
}

.image-overlay strong,
.image-overlay span {
  display: block;
}

.image-overlay strong {
  font-size: 9px;
}

.image-overlay span {
  margin-top: 3px;
  color: rgba(255, 255, 255, 0.62);
  font-size: 7px;
}

.image-actions {
  display: flex;
  gap: 6px;
}

.image-actions button {
  padding: 7px 9px;
  border: 1px solid
    rgba(255, 255, 255, 0.17);
  border-radius: 7px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  font-size: 8px;
}

.image-actions .remove {
  color: #ffb8c4;
}

.settings-row {
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 14px;
}

.order-field input {
  width: 100%;
}

.publish-control {
  display: flex;
  min-height: 72px;
  padding: 13px 15px;
  border: 1px solid var(--border);
  border-radius: 11px;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  cursor: pointer;
}

.publish-control strong,
.publish-control small {
  display: block;
}

.publish-control strong {
  color: var(--text);
  font-size: 10px;
}

.publish-control small {
  margin-top: 4px;
  color: var(--muted);
  font-size: 8px;
}

.publish-control input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.switch {
  position: relative;
  width: 38px;
  height: 22px;
  flex: 0 0 auto;
  border-radius: 100px;
  background: #ddd6db;
  transition: background 0.2s ease;
}

.switch::after {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  box-shadow:
    0 2px 6px rgba(20, 10, 18, 0.15);
  content: '';
  transition: transform 0.2s ease;
}

.publish-control
input:checked + .switch {
  background: var(--brand);
}

.publish-control
input:checked + .switch::after {
  transform: translateX(16px);
}

.modal-footer {
  display: flex;
  padding-top: 4px;
  justify-content: flex-end;
  gap: 9px;
}

.cancel-button,
.save-button {
  min-height: 43px;
  padding: 0 17px;
  border-radius: 9px;
  font-size: 9px;
  font-weight: 700;
}

.cancel-button {
  border: 1px solid var(--border);
  background: white;
  color: var(--text);
}

.save-button {
  display: flex;
  border: 0;
  align-items: center;
  gap: 18px;
  background: var(--brand-gradient);
  color: white;
  box-shadow:
    0 9px 22px
    rgba(172, 12, 163, 0.17);
}

.cancel-button,
.save-button {
  cursor: pointer;
}

.save-button:disabled,
.cancel-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

/* MEDIA PICKER */

.media-picker {
  position: absolute;
  z-index: 10;
  inset: 0;
  padding: 30px;
  overflow-y: auto;
  background: #fff;
}

.picker-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.picker-header h3 {
  margin: 0;
  font-family: Georgia, serif;
  font-size: 28px;
  font-weight: 400;
}

.picker-search {
  position: relative;
  margin: 24px 0 18px;
}

.picker-search span {
  position: absolute;
  top: 50%;
  left: 14px;
  color: var(--muted);
  transform: translateY(-50%);
}

.picker-search input {
  width: 100%;
  height: 44px;
  padding: 0 14px 0 39px;
  border: 1px solid var(--border);
  border-radius: 9px;
  outline: none;
  font: inherit;
  font-size: 10px;
}

.picker-grid {
  display: grid;
  grid-template-columns:
    repeat(3, minmax(0, 1fr));
  gap: 11px;
}

.picker-item {
  position: relative;
  height: 140px;
  padding: 0;
  overflow: hidden;
  border: 2px solid transparent;
  border-radius: 11px;
  background: #eee;
  cursor: pointer;
}

.picker-item.active {
  border-color: var(--brand);
}

.picker-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.picker-item span {
  position: absolute;
  right: 7px;
  bottom: 7px;
  left: 7px;
  overflow: hidden;
  padding: 7px;
  border-radius: 7px;
  background: rgba(10, 7, 10, 0.66);
  color: white;
  font-size: 7px;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.picker-loading,
.picker-empty {
  padding: 70px 20px;
  color: var(--muted);
  font-size: 10px;
  text-align: center;
}

/* ANIMATION */

.region-modal-enter-active,
.region-modal-leave-active {
  transition: opacity 0.23s ease;
}

.region-modal-enter-from,
.region-modal-leave-to {
  opacity: 0;
}

.region-modal-enter-active
.region-modal,
.region-modal-leave-active
.region-modal {
  transition:
    transform 0.3s
    cubic-bezier(0.22, 1, 0.36, 1);
}

.region-modal-enter-from
.region-modal,
.region-modal-leave-to
.region-modal {
  transform:
    translateY(12px)
    scale(0.975);
}

.picker-enter-active,
.picker-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.3s
    cubic-bezier(0.22, 1, 0.36, 1);
}

.picker-enter-from,
.picker-leave-to {
  opacity: 0;
  transform: translateX(25px);
}

@media (max-width: 650px) {
  .region-backdrop {
    padding: 10px;
    align-items: end;
  }

  .region-modal {
    max-height: 94vh;
    padding: 22px 18px;
    border-radius: 20px 20px 8px 8px;
  }

  .field-grid,
  .settings-row {
    grid-template-columns: 1fr;
  }

  .picker-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  .media-picker {
    padding: 22px 18px;
  }
}
</style>