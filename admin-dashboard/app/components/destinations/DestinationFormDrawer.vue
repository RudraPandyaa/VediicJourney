<script setup lang="ts">
import MediaPickerModal from '../media/MediaPickerModal.vue'

import type {
  Destination,
  DestinationPayload,
} from '../../composables/useDestinations'

import type {
  Region,
} from '../../composables/useRegions'

import type {
  MediaItem,
} from '../../composables/useMedia'

type PickerTarget =
  | 'hero'
  | 'gallery'
  | 'og'
  | null

const props = defineProps<{
  open: boolean
  destination?: Destination | null
  regions: Region[]
  saving?: boolean
  error?: string
}>()

const emit = defineEmits<{
  close: []
  save: [payload: DestinationPayload]
}>()

const name = ref('')
const slug = ref('')
const regionId = ref('')
const shortDescription = ref('')
const overview = ref('')
const sortOrder = ref(0)

const isFeatured = ref(false)
const isPublished = ref(false)

const heroImage =
  ref<MediaItem | null>(null)

const gallery =
  ref<MediaItem[]>([])

const seoTitle = ref('')
const seoDescription = ref('')

const ogImage =
  ref<MediaItem | null>(null)

const pickerTarget =
  ref<PickerTarget>(null)

const isEditing = computed(
  () => Boolean(props.destination),
)

const pickerOpen = computed(
  () => pickerTarget.value !== null,
)

const pickerMultiple = computed(
  () => pickerTarget.value === 'gallery',
)

const pickerTitle = computed(() => {
  if (pickerTarget.value === 'hero') {
    return 'Select hero image'
  }

  if (pickerTarget.value === 'gallery') {
    return 'Select gallery images'
  }

  if (pickerTarget.value === 'og') {
    return 'Select SEO image'
  }

  return 'Select media'
})

const pickerSelected = computed(() => {
  if (pickerTarget.value === 'hero') {
    return heroImage.value
      ? [heroImage.value._id]
      : []
  }

  if (pickerTarget.value === 'gallery') {
    return gallery.value.map(
      item => item._id,
    )
  }

  if (pickerTarget.value === 'og') {
    return ogImage.value
      ? [ogImage.value._id]
      : []
  }

  return []
})

const makeSlug = (value: string) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const getRegionId = () => {
  if (!props.destination) return ''

  return typeof props.destination.region ===
    'string'
    ? props.destination.region
    : props.destination.region?._id || ''
}

const resetForm = () => {
  const item = props.destination

  name.value = item?.name || ''
  slug.value = item?.slug || ''

  regionId.value = getRegionId()

  shortDescription.value =
    item?.shortDescription || ''

  overview.value =
    item?.overview || ''

  sortOrder.value =
    item?.sortOrder ?? 0

  isFeatured.value =
    item?.isFeatured ?? false

  isPublished.value =
    item?.isPublished ?? false

  heroImage.value =
    item?.heroImage || null

  gallery.value =
    item?.gallery
      ? [...item.gallery]
      : []

  seoTitle.value =
    item?.seo?.title || ''

  seoDescription.value =
    item?.seo?.description || ''

  ogImage.value =
    item?.seo?.ogImage || null

  pickerTarget.value = null
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

const openPicker = (
  target: Exclude<
    PickerTarget,
    null
  >,
) => {
  pickerTarget.value = target
}

const closePicker = () => {
  pickerTarget.value = null
}

const handleMediaSelect = (
  items: MediaItem[],
) => {
  if (pickerTarget.value === 'hero') {
    heroImage.value =
      items[0] || null
  }

  if (
    pickerTarget.value === 'gallery'
  ) {
    gallery.value = items
  }

  if (pickerTarget.value === 'og') {
    ogImage.value =
      items[0] || null
  }

  closePicker()
}

const removeGalleryImage = (
  id: string,
) => {
  gallery.value =
    gallery.value.filter(
      item => item._id !== id,
    )
}

const close = () => {
  if (props.saving) return
  emit('close')
}

const submit = () => {
  if (
    !name.value.trim() ||
    !slug.value.trim() ||
    !regionId.value
  ) {
    return
  }

  const payload: DestinationPayload = {
    name: name.value.trim(),
    slug: slug.value.trim(),
    region: regionId.value,

    shortDescription:
      shortDescription.value.trim(),

    overview:
      overview.value.trim(),

    gallery:
      gallery.value.map(
        item => item._id,
      ),

    isFeatured:
      isFeatured.value,

    isPublished:
      isPublished.value,

    sortOrder:
      Number(sortOrder.value) || 0,

    seo: {
      title:
        seoTitle.value.trim(),

      description:
        seoDescription.value.trim(),
    },
  }

  if (heroImage.value) {
    payload.heroImage =
      heroImage.value._id
  }

  if (ogImage.value) {
    payload.seo!.ogImage =
      ogImage.value._id
  }

  emit('save', payload)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div
        v-if="open"
        class="drawer-backdrop"
        @click.self="close"
      >
        <aside class="drawer">
          <header class="drawer-header">
            <div>
              <p class="eyebrow">
                {{
                  isEditing
                    ? 'EDIT DESTINATION'
                    : 'NEW DESTINATION'
                }}
              </p>

              <h2>
                {{
                  isEditing
                    ? 'Refine the destination.'
                    : 'Create a destination.'
                }}
              </h2>

              <p class="intro">
                Build the destination page,
                visuals and discovery metadata
                from one place.
              </p>
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
            class="drawer-form"
            @submit.prevent="submit"
          >
            <div
              v-if="error"
              class="form-error"
            >
              {{ error }}
            </div>

            <!-- BASIC -->

            <section class="form-section">
              <div class="section-heading">
                <span>01</span>

                <div>
                  <h3>
                    Basic information
                  </h3>

                  <p>
                    Core information used
                    throughout the website.
                  </p>
                </div>
              </div>

              <div class="form-grid">
                <div class="field">
                  <label>
                    Destination name
                    <b>*</b>
                  </label>

                  <input
                    v-model="name"
                    maxlength="120"
                    required
                    placeholder="e.g. Italy"
                  >
                </div>

                <div class="field">
                  <label>
                    Slug
                    <b>*</b>
                  </label>

                  <input
                    v-model="slug"
                    maxlength="150"
                    required
                    placeholder="italy"
                  >
                </div>

                <div class="field">
                  <label>
                    Region
                    <b>*</b>
                  </label>

                  <select
                    v-model="regionId"
                    required
                  >
                    <option
                      value=""
                      disabled
                    >
                      Select region
                    </option>

                    <option
                      v-for="region in regions"
                      :key="region._id"
                      :value="region._id"
                    >
                      {{ region.name }}
                    </option>
                  </select>
                </div>

                <div class="field">
                  <label>
                    Sort order
                  </label>

                  <input
                    v-model.number="
                      sortOrder
                    "
                    type="number"
                    min="0"
                  >
                </div>
              </div>

              <div class="field">
                <div class="label-row">
                  <label>
                    Short description
                  </label>

                  <span>
                    {{
                      shortDescription.length
                    }}/500
                  </span>
                </div>

                <textarea
                  v-model="
                    shortDescription
                  "
                  maxlength="500"
                  rows="4"
                  placeholder="A concise introduction to this destination..."
                />
              </div>

              <div class="field">
                <div class="label-row">
                  <label>
                    Overview
                  </label>

                  <span>
                    {{ overview.length }}/10000
                  </span>
                </div>

                <textarea
                  v-model="overview"
                  maxlength="10000"
                  rows="7"
                  placeholder="Write the detailed destination overview..."
                />
              </div>
            </section>

            <!-- VISUALS -->

            <section class="form-section">
              <div class="section-heading">
                <span>02</span>

                <div>
                  <h3>
                    Visual identity
                  </h3>

                  <p>
                    Curate the destination's
                    main visual story.
                  </p>
                </div>
              </div>

              <div class="field">
                <div class="label-row">
                  <label>Hero image</label>
                  <span>Primary visual</span>
                </div>

                <div
                  v-if="heroImage"
                  class="hero-preview"
                >
                  <img
                    :src="heroImage.url"
                    :alt="
                      heroImage.altText ||
                      heroImage.filename
                    "
                  >

                  <div class="media-overlay">
                    <div>
                      <strong>
                        {{
                          heroImage.altText ||
                          heroImage.filename
                        }}
                      </strong>

                      <small>
                        Hero image
                      </small>
                    </div>

                    <button
                      type="button"
                      @click="
                        openPicker('hero')
                      "
                    >
                      Change
                    </button>
                  </div>
                </div>

                <button
                  v-else
                  type="button"
                  class="media-selector"
                  @click="
                    openPicker('hero')
                  "
                >
                  <span class="media-icon">
                    ✦
                  </span>

                  <span class="media-copy">
                    <strong>
                      Choose hero image
                    </strong>

                    <small>
                      Select from your Media
                      Library
                    </small>
                  </span>

                  <span class="media-arrow">
                    →
                  </span>
                </button>
              </div>

              <div class="field">
                <div class="label-row">
                  <label>
                    Destination gallery
                  </label>

                  <span>
                    {{ gallery.length }}
                    selected
                  </span>
                </div>

                <div
                  v-if="gallery.length"
                  class="gallery-grid"
                >
                  <div
                    v-for="
                      image in gallery
                    "
                    :key="image._id"
                    class="gallery-item"
                  >
                    <img
                      :src="image.url"
                      :alt="
                        image.altText ||
                        image.filename
                      "
                    >

                    <button
                      type="button"
                      title="Remove image"
                      @click="
                        removeGalleryImage(
                          image._id,
                        )
                      "
                    >
                      ×
                    </button>
                  </div>

                  <button
                    type="button"
                    class="add-gallery"
                    @click="
                      openPicker('gallery')
                    "
                  >
                    <span>＋</span>
                    Manage gallery
                  </button>
                </div>

                <button
                  v-else
                  type="button"
                  class="media-selector"
                  @click="
                    openPicker('gallery')
                  "
                >
                  <span class="media-icon">
                    ▦
                  </span>

                  <span class="media-copy">
                    <strong>
                      Build gallery
                    </strong>

                    <small>
                      Select multiple destination
                      images
                    </small>
                  </span>

                  <span class="media-arrow">
                    →
                  </span>
                </button>
              </div>
            </section>

            <!-- PUBLISHING -->

            <section class="form-section">
              <div class="section-heading">
                <span>03</span>

                <div>
                  <h3>
                    Publishing
                  </h3>

                  <p>
                    Control visibility and
                    destination prominence.
                  </p>
                </div>
              </div>

              <div class="toggle-grid">
                <label class="toggle-card">
                  <span>
                    <strong>
                      Featured destination
                    </strong>

                    <small>
                      Highlight this destination
                      in curated sections.
                    </small>
                  </span>

                  <input
                    v-model="isFeatured"
                    type="checkbox"
                  >

                  <i class="switch" />
                </label>

                <label class="toggle-card">
                  <span>
                    <strong>
                      Published
                    </strong>

                    <small>
                      Make this destination
                      publicly visible.
                    </small>
                  </span>

                  <input
                    v-model="isPublished"
                    type="checkbox"
                  >

                  <i class="switch" />
                </label>
              </div>
            </section>

            <!-- SEO -->

            <section class="form-section">
              <div class="section-heading">
                <span>04</span>

                <div>
                  <h3>
                    Search & sharing
                  </h3>

                  <p>
                    Configure metadata for
                    search engines and social
                    previews.
                  </p>
                </div>
              </div>

              <div class="field">
                <div class="label-row">
                  <label>SEO title</label>

                  <span>
                    {{ seoTitle.length }}/70
                  </span>
                </div>

                <input
                  v-model="seoTitle"
                  maxlength="70"
                  placeholder="Premium journeys through Italy | Vedic Journey"
                >
              </div>

              <div class="field">
                <div class="label-row">
                  <label>
                    Meta description
                  </label>

                  <span>
                    {{
                      seoDescription.length
                    }}/180
                  </span>
                </div>

                <textarea
                  v-model="seoDescription"
                  maxlength="180"
                  rows="4"
                  placeholder="Write a concise search description..."
                />
              </div>

              <div class="field">
                <div class="label-row">
                  <label>
                    Social sharing image
                  </label>

                  <span>OG image</span>
                </div>

                <div
                  v-if="ogImage"
                  class="og-preview"
                >
                  <img
                    :src="ogImage.url"
                    :alt="
                      ogImage.altText ||
                      ogImage.filename
                    "
                  >

                  <div>
                    <strong>
                      {{
                        ogImage.altText ||
                        ogImage.filename
                      }}
                    </strong>

                    <button
                      type="button"
                      @click="
                        openPicker('og')
                      "
                    >
                      Change image
                    </button>
                  </div>
                </div>

                <button
                  v-else
                  type="button"
                  class="media-selector"
                  @click="
                    openPicker('og')
                  "
                >
                  <span class="media-icon">
                    ◇
                  </span>

                  <span class="media-copy">
                    <strong>
                      Select sharing image
                    </strong>

                    <small>
                      Used for social and SEO
                      previews
                    </small>
                  </span>

                  <span class="media-arrow">
                    →
                  </span>
                </button>
              </div>
            </section>

            <footer class="drawer-footer">
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
                  !slug.trim() ||
                  !regionId
                "
              >
                {{
                  saving
                    ? 'Saving...'
                    : isEditing
                      ? 'Save changes'
                      : 'Create destination'
                }}

                <span v-if="!saving">
                  →
                </span>
              </button>
            </footer>
          </form>
        </aside>
      </div>
    </Transition>
  </Teleport>

  <MediaPickerModal
    :open="pickerOpen"
    :multiple="pickerMultiple"
    :selected="pickerSelected"
    :title="pickerTitle"
    @close="closePicker"
    @select="handleMediaSelect"
  />
</template>

<style scoped>
.drawer-backdrop {
  position: fixed;
  z-index: 1100;
  inset: 0;
  background: rgba(12, 8, 12, .58);
  backdrop-filter: blur(5px);
}

.drawer {
  position: absolute;
  top: 0;
  right: 0;
  width: min(820px, 100%);
  height: 100%;
  overflow-y: auto;
  background: #fbf9fa;
  box-shadow:
    -25px 0 70px
    rgba(20, 8, 18, .18);
}

.drawer-header {
  position: sticky;
  z-index: 4;
  top: 0;
  display: flex;
  padding: 30px 34px 26px;
  border-bottom: 1px solid var(--border);
  align-items: flex-start;
  justify-content: space-between;
  gap: 30px;
  background:
    rgba(255, 255, 255, .96);
  backdrop-filter: blur(14px);
}

.eyebrow {
  margin: 0 0 8px;
  color: var(--brand-dark);
  font-size: 11px;
  font-weight: 750;
  letter-spacing: .18em;
}

.drawer-header h2 {
  margin: 0;
  color: var(--text);
  font-family: Georgia, serif;
  font-size: 34px;
  font-weight: 400;
  letter-spacing: -.025em;
}

.intro {
  max-width: 530px;
  margin: 9px 0 0;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.6;
}

.close-button {
  display: grid;
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  padding: 0;
  border: 1px solid var(--border);
  border-radius: 11px;
  place-items: center;
  background: white;
  color: var(--muted);
  cursor: pointer;
  font-size: 23px;
}

.drawer-form {
  padding: 28px 34px 0;
}

.form-error {
  margin-bottom: 20px;
  padding: 14px 16px;
  border: 1px solid #efd4dc;
  border-radius: 11px;
  background: #fff5f8;
  color: #a33d55;
  font-size: 13px;
  line-height: 1.5;
}

.form-section {
  margin-bottom: 22px;
  padding: 26px;
  border: 1px solid var(--border);
  border-radius: 17px;
  background: white;
  box-shadow:
    0 8px 30px
    rgba(35, 15, 32, .025);
}

.section-heading {
  display: flex;
  margin-bottom: 24px;
  align-items: flex-start;
  gap: 13px;
}

.section-heading > span {
  display: grid;
  width: 35px;
  height: 35px;
  flex: 0 0 auto;
  border-radius: 10px;
  place-items: center;
  background: #f8eaf6;
  color: var(--brand-dark);
  font-size: 11px;
  font-weight: 750;
}

.section-heading h3 {
  margin: 0;
  color: var(--text);
  font-size: 19px;
  font-weight: 700;
}

.section-heading p {
  margin: 5px 0 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.5;
}

.form-grid {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
  gap: 17px;
}

.field {
  margin-bottom: 20px;
}

.form-section > .field:last-child {
  margin-bottom: 0;
}

.field label {
  display: block;
  margin-bottom: 9px;
  color: var(--text);
  font-size: 13px;
  font-weight: 650;
}

.field label b {
  color: var(--brand);
}

.label-row {
  display: flex;
  margin-bottom: 9px;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.label-row label {
  margin: 0;
}

.label-row span {
  color: var(--muted);
  font-size: 11px;
}

.field input,
.field select,
.field textarea {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 11px;
  outline: none;
  background: white;
  color: var(--text);
  font: inherit;
  font-size: 14px;
  transition:
    border-color .2s ease,
    box-shadow .2s ease;
}

.field input,
.field select {
  height: 50px;
  padding: 0 15px;
}

.field textarea {
  padding: 14px 15px;
  resize: vertical;
  line-height: 1.65;
}

.field input:focus,
.field select:focus,
.field textarea:focus {
  border-color:
    rgba(216, 11, 185, .42);
  box-shadow:
    0 0 0 4px
    rgba(216, 11, 185, .055);
}

.media-selector {
  display: flex;
  width: 100%;
  min-height: 88px;
  padding: 15px;
  border: 1px dashed #d9cdd6;
  border-radius: 13px;
  align-items: center;
  gap: 14px;
  background: #fcfafb;
  cursor: pointer;
  text-align: left;
}

.media-icon {
  display: grid;
  width: 47px;
  height: 47px;
  flex: 0 0 auto;
  border-radius: 12px;
  place-items: center;
  background: var(--brand-gradient);
  color: white;
  font-size: 16px;
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

.media-arrow {
  color: var(--brand-dark);
  font-size: 21px;
}

.hero-preview {
  position: relative;
  height: 285px;
  overflow: hidden;
  border-radius: 14px;
  background: #eee8ec;
}

.hero-preview > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.media-overlay {
  position: absolute;
  right: 13px;
  bottom: 13px;
  left: 13px;
  display: flex;
  padding: 14px;
  border-radius: 11px;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  background: rgba(12, 8, 11, .76);
  color: white;
  backdrop-filter: blur(10px);
}

.media-overlay strong,
.media-overlay small {
  display: block;
}

.media-overlay strong {
  font-size: 13px;
}

.media-overlay small {
  margin-top: 4px;
  color: rgba(255,255,255,.68);
  font-size: 11px;
}

.media-overlay button,
.og-preview button {
  min-height: 37px;
  padding: 0 13px;
  border: 1px solid
    rgba(255,255,255,.22);
  border-radius: 8px;
  background:
    rgba(255,255,255,.12);
  color: white;
  cursor: pointer;
  font-size: 12px;
  font-weight: 650;
}

.gallery-grid {
  display: grid;
  grid-template-columns:
    repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.gallery-item {
  position: relative;
  height: 120px;
  overflow: hidden;
  border-radius: 11px;
  background: #eee8ec;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-item button {
  position: absolute;
  top: 7px;
  right: 7px;
  display: grid;
  width: 29px;
  height: 29px;
  padding: 0;
  border: 0;
  border-radius: 8px;
  place-items: center;
  background: rgba(16, 9, 14, .76);
  color: white;
  cursor: pointer;
  font-size: 16px;
}

.add-gallery {
  display: flex;
  min-height: 120px;
  border: 1px dashed #d9cdd6;
  border-radius: 11px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 7px;
  background: #fcfafb;
  color: var(--brand-dark);
  cursor: pointer;
  font-size: 12px;
  font-weight: 650;
}

.add-gallery span {
  font-size: 21px;
}

.toggle-grid {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
  gap: 13px;
}

.toggle-card {
  display: flex;
  min-height: 90px;
  padding: 17px;
  border: 1px solid var(--border);
  border-radius: 13px;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  cursor: pointer;
}

.toggle-card strong,
.toggle-card small {
  display: block;
}

.toggle-card strong {
  color: var(--text);
  font-size: 14px;
}

.toggle-card small {
  max-width: 220px;
  margin-top: 5px;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.45;
}

.toggle-card input {
  position: absolute;
  opacity: 0;
}

.switch {
  position: relative;
  width: 43px;
  height: 25px;
  flex: 0 0 auto;
  border-radius: 100px;
  background: #ddd6db;
  transition: background .2s ease;
}

.switch::after {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 19px;
  height: 19px;
  border-radius: 50%;
  background: white;
  content: '';
  transition: transform .2s ease;
}

.toggle-card
input:checked + .switch {
  background: var(--brand);
}

.toggle-card
input:checked + .switch::after {
  transform: translateX(18px);
}

.og-preview {
  display: flex;
  min-height: 120px;
  padding: 13px;
  border-radius: 13px;
  align-items: center;
  gap: 15px;
  background: #171217;
}

.og-preview img {
  width: 150px;
  height: 94px;
  border-radius: 9px;
  object-fit: cover;
}

.og-preview > div {
  display: flex;
  min-width: 0;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.og-preview strong {
  overflow: hidden;
  color: white;
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.drawer-footer {
  position: sticky;
  z-index: 3;
  bottom: 0;
  display: flex;
  margin: 0 -34px;
  padding: 17px 34px;
  border-top: 1px solid var(--border);
  justify-content: flex-end;
  gap: 10px;
  background:
    rgba(255,255,255,.96);
  backdrop-filter: blur(14px);
}

.drawer-footer button {
  min-height: 47px;
  padding: 0 20px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
}

.cancel-button {
  border: 1px solid var(--border);
  background: white;
  color: var(--text);
}

.save-button {
  display: flex;
  min-width: 170px;
  border: 0;
  align-items: center;
  justify-content: center;
  gap: 18px;
  background: var(--brand-gradient);
  color: white;
  box-shadow:
    0 10px 25px
    rgba(172, 12, 163, .16);
}

.drawer-footer button:disabled {
  cursor: not-allowed;
  opacity: .55;
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity .25s ease;
}

.drawer-enter-active .drawer,
.drawer-leave-active .drawer {
  transition: transform .3s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from .drawer,
.drawer-leave-to .drawer {
  transform: translateX(100%);
}

@media(max-width: 680px) {
  .drawer-header {
    padding: 24px 20px 20px;
  }

  .drawer-header h2 {
    font-size: 29px;
  }

  .drawer-form {
    padding: 20px 16px 0;
  }

  .form-section {
    padding: 20px 16px;
  }

  .form-grid,
  .toggle-grid {
    grid-template-columns: 1fr;
  }

  .gallery-grid {
    grid-template-columns:
      repeat(2, 1fr);
  }

  .drawer-footer {
    margin: 0 -16px;
    padding: 14px 16px;
  }

  .og-preview {
    align-items: stretch;
    flex-direction: column;
  }

  .og-preview img {
    width: 100%;
    height: 160px;
  }
}
</style>