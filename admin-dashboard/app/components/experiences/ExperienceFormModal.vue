<script setup lang="ts">
import MediaPickerModal from '../media/MediaPickerModal.vue'

import type {
  Experience,
  ExperiencePayload,
} from '../../composables/useExperiences'

import type {
  MediaItem,
} from '../../composables/useMedia'

const props = defineProps<{
  open: boolean
  experience?: Experience | null
  saving?: boolean
}>()

const emit = defineEmits<{
  close: []
  save: [payload: ExperiencePayload]
}>()

const name = ref('')
const slug = ref('')
const shortDescription = ref('')
const imageId = ref('')
const sortOrder = ref(0)
const isPublished = ref(true)

const selectedImage =
  ref<MediaItem | null>(null)

const mediaPickerOpen = ref(false)

const isEditing = computed(
  () => Boolean(props.experience),
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
  name.value =
    props.experience?.name || ''

  slug.value =
    props.experience?.slug || ''

  shortDescription.value =
    props.experience?.shortDescription || ''

  selectedImage.value =
    props.experience?.image || null

  imageId.value =
    props.experience?.image?._id || ''

  sortOrder.value =
    props.experience?.sortOrder ?? 0

  isPublished.value =
    props.experience?.isPublished ?? true

  mediaPickerOpen.value = false
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
}

const removeImage = () => {
  selectedImage.value = null
  imageId.value = ''
}

const submit = () => {
  if (
    !name.value.trim() ||
    !slug.value.trim()
  ) {
    return
  }

  const payload: ExperiencePayload = {
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

const close = () => {
  if (props.saving) return
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="experience-modal">
      <div
        v-if="open"
        class="modal-backdrop"
        @click.self="close"
      >
        <section class="modal">
          <header class="modal-header">
            <div>
              <p class="eyebrow">
                {{
                  isEditing
                    ? 'EDIT EXPERIENCE'
                    : 'NEW EXPERIENCE'
                }}
              </p>

              <h2>
                {{
                  isEditing
                    ? 'Refine the experience.'
                    : 'Create an experience.'
                }}
              </h2>

              <span>
                Define the experiences travellers
                can discover across Vedic Journey.
              </span>
            </div>

            <button
              type="button"
              class="close-button"
              @click="close"
            >
              ×
            </button>
          </header>

          <form
            class="form"
            @submit.prevent="submit"
          >
            <div class="form-grid">
              <div class="field">
                <label>
                  Experience name
                </label>

                <input
                  v-model="name"
                  required
                  maxlength="100"
                  placeholder="e.g. Wellness"
                >
              </div>

              <div class="field">
                <label>Slug</label>

                <input
                  v-model="slug"
                  required
                  maxlength="120"
                  placeholder="wellness"
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
                maxlength="500"
                rows="4"
                placeholder="Describe this travel experience..."
              />
            </div>

            <div class="field">
              <div class="label-row">
                <label>Experience visual</label>
                <span>Optional</span>
              </div>

              <div
                v-if="selectedImage"
                class="selected-image"
              >
                <img
                  :src="selectedImage.url"
                  :alt="
                    selectedImage.altText ||
                    selectedImage.filename
                  "
                >

                <div class="image-overlay">
                  <div>
                    <strong>
                      {{
                        selectedImage.altText ||
                        selectedImage.filename
                      }}
                    </strong>

                    <small>
                      {{ selectedImage.filename }}
                    </small>
                  </div>

                  <div class="image-actions">
                    <button
                      type="button"
                      @click="
                        mediaPickerOpen = true
                      "
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
                class="media-button"
                @click="
                  mediaPickerOpen = true
                "
              >
                <span class="media-icon">
                  ✦
                </span>

                <span class="media-copy">
                  <strong>
                    Choose from Media Library
                  </strong>

                  <small>
                    Select an image representing
                    this experience
                  </small>
                </span>

                <span class="arrow">→</span>
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

                <span class="switch" />
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
                      : 'Create experience'
                }}

                <span v-if="!saving">
                  →
                </span>
              </button>
            </footer>
          </form>
        </section>
      </div>
    </Transition>
  </Teleport>

  <MediaPickerModal
    :open="mediaPickerOpen"
    title="Select experience visual"
    :selected="
      imageId ? [imageId] : []
    "
    @close="
      mediaPickerOpen = false
    "
    @select="handleImageSelect"
  />
</template>

<style scoped>
.modal-backdrop {
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

.modal {
  width: min(100%, 760px);
  max-height: calc(100vh - 48px);
  padding: 32px;
  overflow-y: auto;
  border-radius: 22px;
  background: white;
  box-shadow:
    0 35px 90px rgba(14, 5, 13, .3);
}

.modal-header {
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

.modal-header h2 {
  margin: 0;
  color: var(--text);
  font-family: Georgia, serif;
  font-size: 32px;
  font-weight: 400;
}

.modal-header > div > span {
  display: block;
  max-width: 520px;
  margin-top: 10px;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.6;
}

.close-button {
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
  border-color:
    rgba(216, 11, 185, .4);
  box-shadow:
    0 0 0 4px
    rgba(216, 11, 185, .05);
}

.media-button {
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

.media-copy {
  flex: 1;
}

.media-copy strong,
.media-copy small {
  display: block;
}

.media-copy strong {
  color: var(--text);
  font-size: 14px;
}

.media-copy small {
  margin-top: 4px;
  color: var(--muted);
  font-size: 12px;
}

.arrow {
  color: var(--brand-dark);
  font-size: 20px;
}

.selected-image {
  position: relative;
  height: 230px;
  overflow: hidden;
  border-radius: 14px;
  background: #eee8ec;
}

.selected-image > img {
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
  background: rgba(12, 8, 11, .74);
  color: white;
  backdrop-filter: blur(9px);
}

.image-overlay strong,
.image-overlay small {
  display: block;
}

.image-overlay strong {
  font-size: 13px;
}

.image-overlay small {
  margin-top: 3px;
  color: rgba(255,255,255,.65);
  font-size: 11px;
}

.image-actions {
  display: flex;
  gap: 7px;
}

.image-actions button {
  min-height: 35px;
  padding: 0 11px;
  border: 1px solid
    rgba(255,255,255,.2);
  border-radius: 8px;
  background:
    rgba(255,255,255,.1);
  color: white;
  cursor: pointer;
  font-size: 12px;
}

.image-actions .remove {
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
  transition: background .2s ease;
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

.publish-card
input:checked + .switch {
  background: var(--brand);
}

.publish-card
input:checked + .switch::after {
  transform: translateX(18px);
}

footer {
  display: flex;
  padding-top: 4px;
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

.experience-modal-enter-active,
.experience-modal-leave-active {
  transition: opacity .22s ease;
}

.experience-modal-enter-from,
.experience-modal-leave-to {
  opacity: 0;
}

@media(max-width: 650px) {
  .modal-backdrop {
    padding: 10px;
    align-items: end;
  }

  .modal {
    max-height: 94vh;
    padding: 23px 18px;
  }

  .form-grid,
  .settings-grid {
    grid-template-columns: 1fr;
  }
}
</style>