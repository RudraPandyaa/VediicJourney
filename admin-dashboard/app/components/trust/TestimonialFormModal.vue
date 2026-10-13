<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="overlay"
      @mousedown.self="$emit('close')"
    >
      <section class="modal">
        <header>
          <div>
            <span>TRAVELLER STORY</span>

            <h2>
              {{
                testimonial
                  ? 'Edit Testimonial'
                  : 'New Testimonial'
              }}
            </h2>
          </div>

          <button
            class="close"
            @click="$emit('close')"
          >
            ×
          </button>
        </header>

        <div class="body">
          <div class="two">
            <div class="field">
              <label>Name *</label>
              <input
                v-model="form.name"
                maxlength="150"
              >
            </div>

            <div class="field">
              <label>Country</label>
              <input
                v-model="form.country"
                maxlength="100"
              >
            </div>
          </div>

          <div class="field">
            <label>Journey</label>
            <input
              v-model="form.journey"
              maxlength="200"
              placeholder="Kerala Wellness Journey"
            >
          </div>

          <div class="field">
            <label>Traveller Quote *</label>
            <textarea
              v-model="form.quote"
              rows="6"
              maxlength="2000"
            />
          </div>

          <div class="two">
            <div class="field">
              <label>Rating</label>

              <select v-model.number="form.rating">
                <option :value="undefined">
                  No rating
                </option>
                <option :value="5">5 / 5</option>
                <option :value="4">4 / 5</option>
                <option :value="3">3 / 5</option>
                <option :value="2">2 / 5</option>
                <option :value="1">1 / 5</option>
              </select>
            </div>

            <div class="field">
              <label>Sort Order</label>
              <input
                v-model.number="form.sortOrder"
                type="number"
                min="0"
              >
            </div>
          </div>

          <div class="field">
            <label>Traveller Image</label>

            <div
              v-if="selectedImage"
              class="media-preview"
            >
              <img
                :src="selectedImage.url"
                :alt="selectedImage.altText || form.name"
              >

              <button
                @click="pickerOpen = true"
              >
                Change Image
              </button>
            </div>

            <button
              v-else
              class="select-media"
              @click="pickerOpen = true"
            >
              + Select Traveller Image
            </button>
          </div>

          <div class="toggles">
            <label>
              <div>
                <strong>Featured</strong>
                <span>
                  Highlight this testimonial.
                </span>
              </div>

              <input
                v-model="form.isFeatured"
                type="checkbox"
              >
            </label>

            <label>
              <div>
                <strong>Published</strong>
                <span>
                  Show publicly.
                </span>
              </div>

              <input
                v-model="form.isPublished"
                type="checkbox"
              >
            </label>
          </div>

          <p
            v-if="formError"
            class="error"
          >
            {{ formError }}
          </p>
        </div>

        <footer>
          <button
            class="cancel"
            @click="$emit('close')"
          >
            Cancel
          </button>

          <button
            class="save"
            :disabled="saving"
            @click="save"
          >
            {{
              saving
                ? 'Saving...'
                : testimonial
                  ? 'Save Changes'
                  : 'Create Testimonial'
            }}
          </button>
        </footer>
      </section>
    </div>
  </Teleport>

  <ClientOnly>
    <MediaPickerModal
      :open="pickerOpen"
      title="Select traveller image"
      @close="pickerOpen = false"
      @select="selectImage"
    />
  </ClientOnly>
</template>

<script setup lang="ts">
import MediaPickerModal from '~/components/media/MediaPickerModal.vue'

import type { MediaItem } from '~/composables/useMedia'

import type {
  Testimonial,
} from '~/composables/useTrustContent'

const props = defineProps<{
  open: boolean
  testimonial?: Testimonial | null
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const {
  createTestimonial,
  updateTestimonial,
} = useTrustContent()

const pickerOpen = ref(false)
const selectedImage =
  ref<MediaItem | null>(null)

const saving = ref(false)
const formError = ref<string | null>(null)

const form = reactive({
  name: '',
  country: '',
  journey: '',
  quote: '',
  rating: undefined as number | undefined,
  image: '',
  isFeatured: false,
  sortOrder: 0,
  isPublished: true,
})

const reset = () => {
  form.name = ''
  form.country = ''
  form.journey = ''
  form.quote = ''
  form.rating = undefined
  form.image = ''
  form.isFeatured = false
  form.sortOrder = 0
  form.isPublished = true

  selectedImage.value = null
  formError.value = null
}

const populate = (
  item: Testimonial,
) => {
  form.name = item.name
  form.country = item.country || ''
  form.journey = item.journey || ''
  form.quote = item.quote
  form.rating = item.rating
  form.isFeatured =
    item.isFeatured ?? false
  form.sortOrder =
    item.sortOrder ?? 0
  form.isPublished =
    item.isPublished ?? false

  if (
    item.image &&
    typeof item.image === 'object'
  ) {
    form.image = item.image._id

    selectedImage.value =
      item.image as MediaItem
  }
}

watch(
  () => props.open,
  value => {
    if (!value) return

    reset()

    if (props.testimonial) {
      populate(props.testimonial)
    }
  },
)

const selectImage = (
  items: MediaItem[],
) => {
  const item = items[0]

  if (!item) return

  selectedImage.value = item
  form.image = item._id
  pickerOpen.value = false
}

const save = async () => {
  if (!form.name.trim()) {
    formError.value =
      'Traveller name is required.'
    return
  }

  if (!form.quote.trim()) {
    formError.value =
      'Testimonial quote is required.'
    return
  }

  saving.value = true
  formError.value = null

  try {
    const payload: any = {
      name: form.name.trim(),
      country:
        form.country.trim(),
      journey:
        form.journey.trim(),
      quote:
        form.quote.trim(),
      isFeatured:
        form.isFeatured,
      sortOrder:
        Number(form.sortOrder) || 0,
      isPublished:
        form.isPublished,
    }

    if (form.rating) {
      payload.rating = form.rating
    }

    if (form.image) {
      payload.image = form.image
    }

    if (props.testimonial?._id) {
      await updateTestimonial(
        props.testimonial._id,
        payload,
      )
    } else {
      await createTestimonial(payload)
    }

    emit('saved')
  } catch (err: any) {
    formError.value =
      err?.data?.message ||
      'Unable to save testimonial.'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.overlay {
  position: fixed;
  z-index: 10000;
  inset: 0;
  padding: 25px;
  display: grid;
  place-items: center;
  background: rgba(13,11,14,.6);
  backdrop-filter: blur(5px);
}

.modal {
  width: min(650px, 100%);
  max-height: calc(100vh - 50px);
  overflow-y: auto;
  border-radius: 18px;
  background: #fff;
}

header {
  padding: 22px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid var(--border);
}

header span {
  color: var(--brand-dark);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .13em;
}

header h2 {
  margin: 6px 0 0;
  font-size: 23px;
}

.close {
  width: 36px;
  height: 36px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: white;
  font-size: 20px;
  cursor: pointer;
}

.body {
  padding: 22px;
}

.two {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.field {
  margin-bottom: 15px;
}

.field label {
  margin-bottom: 7px;
  display: block;
  font-size: 13px;
  font-weight: 700;
}

.field input,
.field select,
.field textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 11px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font: inherit;
  font-size: 13px;
}

.media-preview {
  padding: 9px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid var(--border);
  border-radius: 9px;
}

.media-preview img {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
}

.media-preview button,
.select-media {
  border: 0;
  background: transparent;
  color: var(--brand-dark);
  font-weight: 700;
  cursor: pointer;
}

.select-media {
  width: 100%;
  min-height: 75px;
  border: 1px dashed #d9cdd6;
  border-radius: 9px;
}

.toggles {
  display: grid;
  gap: 8px;
}

.toggles label {
  padding: 13px;
  display: flex;
  justify-content: space-between;
  border-radius: 8px;
  background: #faf8f9;
}

.toggles strong,
.toggles span {
  display: block;
}

.toggles strong {
  font-size: 12px;
}

.toggles span {
  margin-top: 3px;
  color: var(--muted);
  font-size: 10px;
}

.toggles input {
  accent-color: var(--brand);
}

.error {
  color: var(--danger);
  font-size: 11px;
}

footer {
  padding: 15px 22px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  border-top: 1px solid var(--border);
}

footer button {
  min-height: 40px;
  padding: 0 14px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
}

.cancel {
  border: 1px solid var(--border);
  background: white;
}

.save {
  border: 0;
  background: var(--brand-gradient);
  color: white;
}

@media(max-width:600px) {
  .two {
    grid-template-columns: 1fr;
  }
}
</style>