<script setup lang="ts">
import MediaPickerModal from '../media/MediaPickerModal.vue'

import type {
  TravelStyle,
  TravelStylePayload,
} from '../../composables/useTravelStyles'

import type {
  MediaItem,
} from '../../composables/useMedia'

const props = defineProps<{
  open: boolean
  travelStyle?: TravelStyle | null
  saving?: boolean
  error?: string
}>()

const emit = defineEmits<{
  close: []
  save: [payload: TravelStylePayload]
}>()

const name = ref('')
const slug = ref('')
const shortDescription = ref('')
const sortOrder = ref(0)
const isPublished = ref(true)

const selectedImage =
  ref<MediaItem | null>(null)

const imageId = ref('')
const pickerOpen = ref(false)

const isEditing = computed(
  () => Boolean(props.travelStyle),
)

const makeSlug = (value: string) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const resetForm = () => {
  const item = props.travelStyle

  name.value = item?.name || ''
  slug.value = item?.slug || ''

  shortDescription.value =
    item?.shortDescription || ''

  sortOrder.value =
    item?.sortOrder ?? 0

  isPublished.value =
    item?.isPublished ?? true

  selectedImage.value =
    item?.image || null

  imageId.value =
    item?.image?._id || ''

  pickerOpen.value = false
}

watch(
  () => props.open,
  (open) => {
    if (open) resetForm()
  },
)

watch(name, (value) => {
  if (!isEditing.value) {
    slug.value = makeSlug(value)
  }
})

const handleImageSelect = (
  items: MediaItem[],
) => {
  const image = items[0]
  if (!image) return

  selectedImage.value = image
  imageId.value = image._id
  pickerOpen.value = false
}

const removeImage = () => {
  selectedImage.value = null
  imageId.value = ''
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

  const payload: TravelStylePayload = {
    name: name.value.trim(),
    slug: slug.value.trim(),
    shortDescription:
      shortDescription.value.trim(),
    sortOrder:
      Number(sortOrder.value) || 0,
    isPublished: isPublished.value,
  }

  if (imageId.value) {
    payload.image = imageId.value
  }

  emit('save', payload)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="backdrop"
        @click.self="close"
      >
        <section class="modal-card">
          <header>
            <div>
              <p class="eyebrow">
                {{
                  isEditing
                    ? 'EDIT TRAVEL STYLE'
                    : 'NEW TRAVEL STYLE'
                }}
              </p>

              <h2>
                {{
                  isEditing
                    ? 'Refine the travel style.'
                    : 'Create a travel style.'
                }}
              </h2>

              <p class="intro">
                Define how travellers prefer
                to experience their journey.
              </p>
            </div>

            <button
              type="button"
              class="close"
              @click="close"
            >
              ×
            </button>
          </header>

          <form
            class="form"
            @submit.prevent="submit"
          >
            <div
              v-if="error"
              class="form-error"
            >
              {{ error }}
            </div>

            <div class="form-grid">
              <div class="field">
                <label>
                  Travel style name
                </label>

                <input
                  v-model="name"
                  required
                  maxlength="100"
                  placeholder="e.g. Family"
                >
              </div>

              <div class="field">
                <label>Slug</label>

                <input
                  v-model="slug"
                  required
                  maxlength="120"
                  placeholder="family"
                >
              </div>
            </div>

            <div class="field">
              <div class="label-row">
                <label>
                  Short description
                </label>

                <span>
                  {{ shortDescription.length }}/500
                </span>
              </div>

              <textarea
                v-model="shortDescription"
                rows="4"
                maxlength="500"
                placeholder="Describe this style of travel..."
              />
            </div>

            <div class="field">
              <div class="label-row">
                <label>Visual</label>
                <span>Optional</span>
              </div>

              <div
                v-if="selectedImage"
                class="image-preview"
              >
                <img
                  :src="selectedImage.url"
                  :alt="
                    selectedImage.altText ||
                    selectedImage.filename ||
                    name
                  "
                >

                <div class="image-overlay">
                  <div>
                    <strong>
                      {{
                        selectedImage.altText ||
                        selectedImage.filename ||
                        'Travel style image'
                      }}
                    </strong>
                  </div>

                  <div class="image-actions">
                    <button
                      type="button"
                      @click="pickerOpen = true"
                    >
                      Change
                    </button>

                    <button
                      type="button"
                      class="remove-image"
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
                class="media-selector"
                @click="pickerOpen = true"
              >
                <span class="media-icon">
                  ✦
                </span>

                <span>
                  <strong>
                    Choose from Media Library
                  </strong>

                  <small>
                    Select a visual for this
                    travel style
                  </small>
                </span>

                <b>→</b>
              </button>
            </div>

            <div class="settings-grid">
              <div class="field">
                <label>Sort order</label>

                <input
                  v-model.number="sortOrder"
                  type="number"
                  min="0"
                >
              </div>

              <label class="publish-card">
                <span>
                  <strong>Published</strong>

                  <small>
                    Visible on the public website
                  </small>
                </span>

                <input
                  v-model="isPublished"
                  type="checkbox"
                >

                <i class="switch" />
              </label>
            </div>

            <footer>
              <button
                type="button"
                class="cancel"
                :disabled="saving"
                @click="close"
              >
                Cancel
              </button>

              <button
                type="submit"
                class="save"
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
                      : 'Create travel style'
                }}

                <span v-if="!saving">→</span>
              </button>
            </footer>
          </form>
        </section>
      </div>
    </Transition>
  </Teleport>

  <MediaPickerModal
    :open="pickerOpen"
    title="Select travel style visual"
    :selected="
      imageId ? [imageId] : []
    "
    @close="pickerOpen = false"
    @select="handleImageSelect"
  />
</template>

<style scoped>
.backdrop {
  position: fixed;
  z-index: 1200;
  inset: 0;
  display: grid;
  padding: 24px;
  overflow-y: auto;
  place-items: center;
  background: rgba(10, 7, 10, .7);
  backdrop-filter: blur(8px);
}

.modal-card {
  width: min(100%, 760px);
  max-height: calc(100vh - 48px);
  padding: 32px;
  overflow-y: auto;
  border-radius: 22px;
  background: white;
  box-shadow: 0 35px 90px rgba(14,5,13,.3);
}

header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
}

.eyebrow {
  margin: 0 0 9px;
  color: var(--brand-dark);
  font-size: 11px;
  font-weight: 750;
  letter-spacing: .18em;
}

header h2 {
  margin: 0;
  color: var(--text);
  font-family: Georgia, serif;
  font-size: 32px;
  font-weight: 400;
}

.intro {
  margin: 10px 0 0;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.6;
}

.close {
  display: grid;
  width: 40px;
  height: 40px;
  flex: 0 0 auto;
  padding: 0;
  border: 1px solid var(--border);
  border-radius: 10px;
  place-items: center;
  background: white;
  color: var(--muted);
  cursor: pointer;
  font-size: 22px;
}

.form {
  display: flex;
  margin-top: 30px;
  flex-direction: column;
  gap: 24px;
}

.form-error {
  padding: 13px 15px;
  border: 1px solid #efd6dc;
  border-radius: 10px;
  background: #fff7f9;
  color: #a34257;
  font-size: 13px;
}

.form-grid,
.settings-grid {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.field label {
  display: block;
  margin-bottom: 9px;
  color: var(--text);
  font-size: 13px;
  font-weight: 650;
}

.label-row {
  display: flex;
  margin-bottom: 9px;
  align-items: center;
  justify-content: space-between;
}

.label-row label {
  margin: 0;
}

.label-row span {
  color: var(--muted);
  font-size: 12px;
}

.field input,
.field textarea {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 11px;
  outline: none;
  background: white;
  color: var(--text);
  font: inherit;
  font-size: 14px;
}

.field input {
  height: 50px;
  padding: 0 15px;
}

.field textarea {
  padding: 14px 15px;
  resize: vertical;
  line-height: 1.6;
}

.field input:focus,
.field textarea:focus {
  border-color: rgba(216,11,185,.4);
  box-shadow:
    0 0 0 4px rgba(216,11,185,.05);
}

.media-selector {
  display: flex;
  width: 100%;
  min-height: 88px;
  padding: 15px;
  border: 1px dashed #d9ced6;
  border-radius: 13px;
  align-items: center;
  gap: 14px;
  background: #fcfafb;
  cursor: pointer;
  text-align: left;
}

.media-selector > span:nth-child(2) {
  flex: 1;
}

.media-selector strong,
.media-selector small {
  display: block;
}

.media-selector strong {
  color: var(--text);
  font-size: 14px;
}

.media-selector small {
  margin-top: 4px;
  color: var(--muted);
  font-size: 12px;
}

.media-selector b {
  color: var(--brand-dark);
  font-size: 20px;
}

.media-icon {
  display: grid;
  width: 46px;
  height: 46px;
  flex: 0 0 auto;
  border-radius: 12px;
  place-items: center;
  background: var(--brand-gradient);
  color: white;
}

.image-preview {
  position: relative;
  height: 230px;
  overflow: hidden;
  border-radius: 14px;
  background: #eee8ec;
}

.image-preview > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  right: 12px;
  bottom: 12px;
  left: 12px;
  display: flex;
  padding: 13px;
  border-radius: 10px;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  background: rgba(12,8,11,.74);
  color: white;
  backdrop-filter: blur(9px);
}

.image-overlay strong {
  font-size: 13px;
}

.image-actions {
  display: flex;
  gap: 7px;
}

.image-actions button {
  min-height: 35px;
  padding: 0 11px;
  border: 1px solid rgba(255,255,255,.2);
  border-radius: 8px;
  background: rgba(255,255,255,.1);
  color: white;
  cursor: pointer;
  font-size: 12px;
}

.image-actions .remove-image {
  color: #ffc1cb;
}

.publish-card {
  display: flex;
  min-height: 78px;
  padding: 15px 17px;
  border: 1px solid var(--border);
  border-radius: 12px;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  cursor: pointer;
}

.publish-card strong,
.publish-card small {
  display: block;
}

.publish-card strong {
  color: var(--text);
  font-size: 14px;
}

.publish-card small {
  margin-top: 4px;
  color: var(--muted);
  font-size: 12px;
}

.publish-card input {
  position: absolute;
  opacity: 0;
}

.switch {
  position: relative;
  width: 42px;
  height: 24px;
  flex: 0 0 auto;
  border-radius: 100px;
  background: #ddd6db;
  transition: .2s ease;
}

.switch::after {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: white;
  content: '';
  transition: transform .2s ease;
}

.publish-card input:checked + .switch {
  background: var(--brand);
}

.publish-card input:checked + .switch::after {
  transform: translateX(18px);
}

footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

footer button {
  min-height: 46px;
  padding: 0 19px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
}

.cancel {
  border: 1px solid var(--border);
  background: white;
  color: var(--text);
}

.save {
  display: flex;
  border: 0;
  align-items: center;
  gap: 18px;
  background: var(--brand-gradient);
  color: white;
}

footer button:disabled {
  cursor: not-allowed;
  opacity: .55;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity .22s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

@media(max-width: 650px) {
  .backdrop {
    padding: 10px;
    align-items: end;
  }

  .modal-card {
    max-height: 94vh;
    padding: 23px 18px;
  }

  .form-grid,
  .settings-grid {
    grid-template-columns: 1fr;
  }
}
</style>