<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div
        v-if="open"
        class="drawer-overlay"
        @click.self="emit('close')"
      >
        <aside class="journey-drawer">
          <!-- Header -->
          <header class="drawer-header">
            <div>
              <span class="eyebrow">JOURNEY MANAGEMENT</span>

              <h2>
                {{ journey ? 'Edit Journey' : 'Create Journey' }}
              </h2>

              <p>
                {{
                  journey
                    ? 'Update journey content, itinerary and publishing settings.'
                    : 'Create a new curated journey for Vedic Journey.'
                }}
              </p>
            </div>

            <button
              type="button"
              class="icon-button"
              aria-label="Close"
              @click="emit('close')"
            >
              ×
            </button>
          </header>

          <!-- Section Navigation -->
          <nav class="section-nav">
            <button
              v-for="item in sections"
              :key="item.id"
              type="button"
              :class="{ active: activeSection === item.id }"
              @click="scrollToSection(item.id)"
            >
              {{ item.label }}
            </button>
          </nav>

          <form
            class="drawer-body"
            @submit.prevent="handleSubmit"
          >
            <!-- ============================= -->
            <!-- BASIC -->
            <!-- ============================= -->
            <section
              id="journey-basic"
              class="form-section"
            >
              <JourneySectionHeading
                number="01"
                title="Basic Information"
                description="Primary information shown across journey cards and detail pages."
              />

              <div class="field-grid">
                <div class="field field-full">
                  <label>
                    Journey Title
                    <span>*</span>
                  </label>

                  <input
                    v-model="form.title"
                    type="text"
                    maxlength="200"
                    placeholder="Sacred Journey Through South India"
                    required
                    @input="handleTitleInput"
                  />
                </div>

                <div class="field field-full">
                  <label>
                    URL Slug
                    <span>*</span>
                  </label>

                  <div class="slug-field">
                    <span>/journeys/</span>

                    <input
                      v-model="form.slug"
                      type="text"
                      maxlength="220"
                      placeholder="sacred-journey-south-india"
                      required
                      @input="slugManuallyEdited = true"
                    />
                  </div>
                </div>

                <div class="field">
                  <label>
                    Duration
                    <span>*</span>
                  </label>

                  <div class="suffix-input">
                    <input
                      v-model.number="form.durationDays"
                      type="number"
                      min="1"
                      required
                    />

                    <span>Days</span>
                  </div>
                </div>

                <div class="field">
                  <label>Sort Order</label>

                  <input
                    v-model.number="form.sortOrder"
                    type="number"
                    min="0"
                  />
                </div>

                <div class="field field-full">
                  <div class="label-row">
                    <label>Short Description</label>

                    <span class="counter">
                      {{ form.shortDescription.length }}/500
                    </span>
                  </div>

                  <textarea
                    v-model="form.shortDescription"
                    rows="3"
                    maxlength="500"
                    placeholder="A concise introduction to this journey..."
                  />
                </div>

                <div class="field field-full">
                  <label>Journey Overview</label>

                  <textarea
                    v-model="form.overview"
                    rows="7"
                    maxlength="15000"
                    placeholder="Describe the journey, its character, destinations and experience..."
                  />
                </div>
              </div>
            </section>

            <!-- ============================= -->
            <!-- DESTINATIONS -->
            <!-- ============================= -->
            <section
              id="journey-destinations"
              class="form-section"
            >
              <JourneySectionHeading
                number="02"
                title="Destinations & Places"
                description="Define where this journey takes place."
              />

              <div class="field">
                <label>
                  Destinations
                  <span>*</span>
                </label>

                <p class="field-help">
                  Select at least one destination. Places will be
                  limited to the selected destinations.
                </p>

                <div
                  v-if="destinations.length"
                  class="selection-grid"
                >
                  <label
                    v-for="destination in destinations"
                    :key="destination._id"
                    class="selection-card"
                    :class="{
                      selected:
                        form.destinations.includes(
                          destination._id,
                        ),
                    }"
                  >
                    <input
                      v-model="form.destinations"
                      type="checkbox"
                      :value="destination._id"
                      @change="handleDestinationChange"
                    />

                    <span class="selection-check">
                      ✓
                    </span>

                    <span class="selection-content">
                      <strong>
                        {{ destination.name }}
                      </strong>

                      <small>
                        {{ destination.slug }}
                      </small>
                    </span>
                  </label>
                </div>

                <p
                  v-else
                  class="empty-inline"
                >
                  No destinations available.
                </p>
              </div>

              <div class="field">
                <label>Places</label>

                <p class="field-help">
                  Optional. Only places belonging to selected
                  destinations are shown.
                </p>

                <div
                  v-if="!form.destinations.length"
                  class="notice-box"
                >
                  Select a destination first to choose places.
                </div>

                <div
                  v-else-if="filteredPlaces.length"
                  class="selection-grid"
                >
                  <label
                    v-for="place in filteredPlaces"
                    :key="place._id"
                    class="selection-card"
                    :class="{
                      selected:
                        form.places.includes(place._id),
                    }"
                  >
                    <input
                      v-model="form.places"
                      type="checkbox"
                      :value="place._id"
                    />

                    <span class="selection-check">
                      ✓
                    </span>

                    <span class="selection-content">
                      <strong>
                        {{ place.name }}
                      </strong>

                      <small>
                        {{ place.slug }}
                      </small>
                    </span>
                  </label>
                </div>

                <div
                  v-else
                  class="notice-box"
                >
                  No places are available for the selected
                  destinations.
                </div>
              </div>
            </section>

            <!-- ============================= -->
            <!-- CLASSIFICATION -->
            <!-- ============================= -->
            <section
              id="journey-classification"
              class="form-section"
            >
              <JourneySectionHeading
                number="03"
                title="Journey Classification"
                description="Connect the journey with relevant experiences and traveller styles."
              />

              <div class="field">
                <label>Experiences</label>

                <div
                  v-if="experiences.length"
                  class="chip-grid"
                >
                  <label
                    v-for="experience in experiences"
                    :key="experience._id"
                    class="choice-chip"
                    :class="{
                      selected:
                        form.experiences.includes(
                          experience._id,
                        ),
                    }"
                  >
                    <input
                      v-model="form.experiences"
                      type="checkbox"
                      :value="experience._id"
                    />

                    {{ experience.name }}
                  </label>
                </div>

                <p
                  v-else
                  class="empty-inline"
                >
                  No experiences available.
                </p>
              </div>

              <div class="field">
                <label>Travel Styles</label>

                <div
                  v-if="travelStyles.length"
                  class="chip-grid"
                >
                  <label
                    v-for="style in travelStyles"
                    :key="style._id"
                    class="choice-chip"
                    :class="{
                      selected:
                        form.travelStyles.includes(
                          style._id,
                        ),
                    }"
                  >
                    <input
                      v-model="form.travelStyles"
                      type="checkbox"
                      :value="style._id"
                    />

                    {{ style.name }}
                  </label>
                </div>

                <p
                  v-else
                  class="empty-inline"
                >
                  No travel styles available.
                </p>
              </div>
            </section>

            <!-- ============================= -->
            <!-- VISUALS -->
            <!-- ============================= -->
            <section
              id="journey-visuals"
              class="form-section"
            >
              <JourneySectionHeading
                number="04"
                title="Journey Visuals"
                description="Select premium imagery for journey cards and detail pages."
              />

              <div class="visual-grid">
                <div class="field">
                  <label>Hero Image</label>

                  <button
                    v-if="!heroPreview"
                    type="button"
                    class="media-placeholder"
                    @click="heroPickerOpen = true"
                  >
                    <span class="media-plus">+</span>
                    <strong>Select Hero Image</strong>
                    <small>Choose from Media Library</small>
                  </button>

                  <div
                    v-else
                    class="selected-media hero-media"
                  >
                    <img
                      :src="heroPreview.url"
                      :alt="heroPreview.altText || ''"
                    />

                    <div class="media-overlay">
                      <button
                        type="button"
                        @click="heroPickerOpen = true"
                      >
                        Change Image
                      </button>
                    </div>
                  </div>

                  <p
                    v-if="journey && heroPreview"
                    class="field-help"
                  >
                    Existing hero images can currently be replaced,
                    but not permanently unset.
                  </p>
                </div>

                <div class="field">
                  <label>SEO / Social Image</label>

                  <button
                    v-if="!ogPreview"
                    type="button"
                    class="media-placeholder"
                    @click="ogPickerOpen = true"
                  >
                    <span class="media-plus">+</span>
                    <strong>Select OG Image</strong>
                    <small>Used when the journey is shared</small>
                  </button>

                  <div
                    v-else
                    class="selected-media hero-media"
                  >
                    <img
                      :src="ogPreview.url"
                      :alt="ogPreview.altText || ''"
                    />

                    <div class="media-overlay">
                      <button
                        type="button"
                        @click="ogPickerOpen = true"
                      >
                        Change Image
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="field">
                <div class="label-row">
                  <div>
                    <label>Gallery</label>

                    <p class="field-help">
                      Up to 30 images.
                    </p>
                  </div>

                  <button
                    type="button"
                    class="text-button"
                    @click="galleryPickerOpen = true"
                  >
                    + Add Images
                  </button>
                </div>

                <div
                  v-if="galleryPreviews.length"
                  class="gallery-grid"
                >
                  <div
                    v-for="media in galleryPreviews"
                    :key="media._id"
                    class="gallery-item"
                  >
                    <img
                      :src="media.url"
                      :alt="media.altText || ''"
                    />

                    <button
                      type="button"
                      aria-label="Remove gallery image"
                      @click="removeGalleryImage(media._id)"
                    >
                      ×
                    </button>
                  </div>
                </div>

                <button
                  v-else
                  type="button"
                  class="gallery-empty"
                  @click="galleryPickerOpen = true"
                >
                  <span>+</span>
                  Add journey gallery images
                </button>
              </div>
            </section>

            <!-- ============================= -->
            <!-- HIGHLIGHTS -->
            <!-- ============================= -->
            <section
              id="journey-highlights"
              class="form-section"
            >
              <JourneySectionHeading
                number="05"
                title="Journey Highlights"
                description="Add short, compelling reasons to choose this journey."
              />

              <div class="repeat-list">
                <div
                  v-for="(_, index) in form.highlights"
                  :key="index"
                  class="repeat-row"
                >
                  <span class="repeat-number">
                    {{ String(index + 1).padStart(2, '0') }}
                  </span>

                  <input
                    v-model="form.highlights[index]"
                    type="text"
                    maxlength="300"
                    placeholder="Private sunrise experience..."
                  />

                  <button
                    type="button"
                    class="remove-button"
                    @click="removeHighlight(index)"
                  >
                    ×
                  </button>
                </div>
              </div>

              <button
                v-if="form.highlights.length < 30"
                type="button"
                class="secondary-button"
                @click="addHighlight"
              >
                + Add Highlight
              </button>
            </section>

            <!-- ============================= -->
            <!-- ITINERARY -->
            <!-- ============================= -->
            <section
              id="journey-itinerary"
              class="form-section"
            >
              <JourneySectionHeading
                number="06"
                title="Day-by-Day Itinerary"
                description="Build the complete journey itinerary in chronological order."
              />

              <div
                v-if="form.itinerary.length"
                class="itinerary-list"
              >
                <article
                  v-for="(day, index) in form.itinerary"
                  :key="day.key"
                  class="itinerary-card"
                >
                  <div class="itinerary-header">
                    <div class="day-marker">
                      <span>DAY</span>
                      <strong>{{ day.day }}</strong>
                    </div>

                    <div class="itinerary-heading">
                      <strong>
                        {{
                          day.title ||
                          `Itinerary Day ${day.day}`
                        }}
                      </strong>

                      <span>
                        Configure day {{ day.day }}
                      </span>
                    </div>

                    <button
                      type="button"
                      class="remove-day"
                      @click="removeItineraryDay(index)"
                    >
                      Remove
                    </button>
                  </div>

                  <div class="field-grid itinerary-fields">
                    <div class="field">
                      <label>Day Number</label>

                      <input
                        v-model.number="day.day"
                        type="number"
                        min="1"
                        required
                      />
                    </div>

                    <div class="field">
                      <label>
                        Day Title
                        <span>*</span>
                      </label>

                      <input
                        v-model="day.title"
                        type="text"
                        maxlength="200"
                        placeholder="Arrival in Varanasi"
                        required
                      />
                    </div>

                    <div class="field field-full">
                      <label>Description</label>

                      <textarea
                        v-model="day.description"
                        rows="4"
                        maxlength="5000"
                        placeholder="Describe the experiences planned for this day..."
                      />
                    </div>

                    <div class="field">
                      <label>Place</label>

                      <select v-model="day.place">
                        <option value="">
                          No specific place
                        </option>

                        <option
                          v-for="place in filteredPlaces"
                          :key="place._id"
                          :value="place._id"
                        >
                          {{ place.name }}
                        </option>
                      </select>
                    </div>

                    <div class="field">
                      <label>Day Image</label>

                      <button
                        type="button"
                        class="small-media-button"
                        @click="openItineraryPicker(index)"
                      >
                        {{
                          getItineraryImage(day.image)
                            ? 'Change Image'
                            : '+ Select Image'
                        }}
                      </button>
                    </div>

                    <div
                      v-if="getItineraryImage(day.image)"
                      class="field field-full"
                    >
                      <div class="day-image-preview">
                        <img
                          :src="
                            getItineraryImage(day.image)?.url
                          "
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </article>
              </div>

              <div
                v-else
                class="itinerary-empty"
              >
                <span>01 — 02 — 03</span>
                <strong>No itinerary days yet</strong>
                <p>
                  Start building the day-by-day journey.
                </p>
              </div>

              <button
                v-if="form.itinerary.length < 60"
                type="button"
                class="secondary-button"
                @click="addItineraryDay"
              >
                + Add Itinerary Day
              </button>
            </section>

            <!-- ============================= -->
            <!-- PUBLISHING -->
            <!-- ============================= -->
            <section
              id="journey-publishing"
              class="form-section"
            >
              <JourneySectionHeading
                number="07"
                title="Publishing"
                description="Control journey visibility and featured placement."
              />

              <div class="toggle-grid">
                <label class="toggle-card">
                  <div>
                    <strong>Published</strong>

                    <span>
                      Make this journey visible on the public
                      website.
                    </span>
                  </div>

                  <input
                    v-model="form.isPublished"
                    type="checkbox"
                  />

                  <span class="toggle">
                    <span />
                  </span>
                </label>

                <label class="toggle-card">
                  <div>
                    <strong>Featured Journey</strong>

                    <span>
                      Allow this journey to appear in featured
                      sections.
                    </span>
                  </div>

                  <input
                    v-model="form.isFeatured"
                    type="checkbox"
                  />

                  <span class="toggle">
                    <span />
                  </span>
                </label>
              </div>
            </section>

            <!-- ============================= -->
            <!-- SEO -->
            <!-- ============================= -->
            <section
              id="journey-seo"
              class="form-section"
            >
              <JourneySectionHeading
                number="08"
                title="Search & Social"
                description="Optional metadata for search engines and social sharing."
              />

              <div class="field-grid">
                <div class="field field-full">
                  <div class="label-row">
                    <label>SEO Title</label>

                    <span class="counter">
                      {{ form.seo.title.length }}/70
                    </span>
                  </div>

                  <input
                    v-model="form.seo.title"
                    type="text"
                    maxlength="70"
                    placeholder="Journey SEO title"
                  />
                </div>

                <div class="field field-full">
                  <div class="label-row">
                    <label>Meta Description</label>

                    <span class="counter">
                      {{ form.seo.description.length }}/180
                    </span>
                  </div>

                  <textarea
                    v-model="form.seo.description"
                    rows="4"
                    maxlength="180"
                    placeholder="A concise search description..."
                  />
                </div>
              </div>
            </section>

            <!-- Error -->
            <div
              v-if="localError || error"
              class="error-message"
            >
              {{ localError || error }}
            </div>

            <!-- Footer -->
            <footer class="drawer-footer">
              <div>
                <span class="save-state">
                  {{
                    form.isPublished
                      ? 'Will be visible publicly'
                      : 'Saved as unpublished'
                  }}
                </span>
              </div>

              <div class="footer-actions">
                <button
                  type="button"
                  class="cancel-button"
                  :disabled="saving"
                  @click="emit('close')"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  class="save-button"
                  :disabled="saving"
                >
                  <span v-if="saving">
                    Saving...
                  </span>

                  <span v-else>
                    {{
                      journey
                        ? 'Save Changes'
                        : 'Create Journey'
                    }}
                  </span>
                </button>
              </div>
            </footer>
          </form>

          <!-- ============================= -->
          <!-- MEDIA PICKERS -->
          <!-- ============================= -->

          <MediaPickerModal
            :open="heroPickerOpen"
            title="Select Hero Image"
            :selected="
              heroPreview ? [heroPreview._id] : []
            "
            @close="heroPickerOpen = false"
            @select="handleHeroSelect"
          />

          <MediaPickerModal
            :open="galleryPickerOpen"
            title="Select Gallery Images"
            multiple
            :selected="form.gallery"
            @close="galleryPickerOpen = false"
            @select="handleGallerySelect"
          />

          <MediaPickerModal
            :open="ogPickerOpen"
            title="Select Social Image"
            :selected="
              ogPreview ? [ogPreview._id] : []
            "
            @close="ogPickerOpen = false"
            @select="handleOgSelect"
          />

          <MediaPickerModal
            :open="itineraryPickerOpen"
            title="Select Itinerary Image"
            :selected="currentItinerarySelected"
            @close="closeItineraryPicker"
            @select="handleItineraryImageSelect"
          />
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { MediaItem } from '~/composables/useMedia'
import type {
  Journey,
  JourneyPayload,
} from '~/composables/useJourneys'

const mounted = ref(false)

onMounted(() => {
  mounted.value = true
})

const props = defineProps<{
  open: boolean
  journey?: Journey | null
}>()

const emit = defineEmits<{
  close: []
  saved: [journey: Journey]
}>()

const { createJourney, updateJourney } =
  useJourneys()

const {
  destinations,
  fetchDestinations,
} = useDestinations()

const {
  places,
  fetchPlaces,
} = usePlaces()

const {
  experiences,
  fetchExperiences,
} = useExperiences()

const {
  travelStyles,
  fetchTravelStyles,
} = useTravelStyles()

const saving = ref(false)
const localError = ref<string | null>(null)
const error = ref<string | null>(null)

const slugManuallyEdited = ref(false)

const heroPickerOpen = ref(false)
const galleryPickerOpen = ref(false)
const ogPickerOpen = ref(false)
const itineraryPickerOpen = ref(false)

const itineraryPickerIndex =
  ref<number | null>(null)

const heroPreview =
  ref<MediaItem | null>(null)

const ogPreview =
  ref<MediaItem | null>(null)

const galleryPreviews =
  ref<MediaItem[]>([])

const itineraryMedia = ref<
  Record<string, MediaItem>
>({})

let itineraryKey = 0

const sections = [
  {
    id: 'journey-basic',
    label: 'Basic',
  },
  {
    id: 'journey-destinations',
    label: 'Locations',
  },
  {
    id: 'journey-classification',
    label: 'Classification',
  },
  {
    id: 'journey-visuals',
    label: 'Visuals',
  },
  {
    id: 'journey-highlights',
    label: 'Highlights',
  },
  {
    id: 'journey-itinerary',
    label: 'Itinerary',
  },
  {
    id: 'journey-publishing',
    label: 'Publishing',
  },
  {
    id: 'journey-seo',
    label: 'SEO',
  },
]

const activeSection = ref('journey-basic')

const createEmptyForm = () => ({
  title: '',
  slug: '',
  shortDescription: '',
  overview: '',
  durationDays: 1,

  destinations: [] as string[],
  places: [] as string[],
  experiences: [] as string[],
  travelStyles: [] as string[],

  heroImage: '',
  gallery: [] as string[],

  highlights: [] as string[],

  itinerary: [] as Array<{
    key: number
    day: number
    title: string
    description: string
    place: string
    image: string
  }>,

  isFeatured: false,
  sortOrder: 0,
  isPublished: false,

  seo: {
    title: '',
    description: '',
    ogImage: '',
  },
})

const form = reactive(createEmptyForm())

const getId = (
  value:
    | string
    | { _id?: string }
    | null
    | undefined,
) => {
  if (!value) return ''

  if (typeof value === 'string') {
    return value
  }

  return value._id || ''
}

const filteredPlaces = computed(() => {
  if (!form.destinations.length) {
    return []
  }

  return places.value.filter((place: any) => {
    const destinationId =
      getId(place.destination)

    return form.destinations.includes(
      destinationId,
    )
  })
})

const currentItinerarySelected =
  computed(() => {
    if (
      itineraryPickerIndex.value === null
    ) {
      return []
    }

    const day =
      form.itinerary[
        itineraryPickerIndex.value
      ]

    if (!day?.image) {
      return []
    }

    return [day.image]
  })

const slugify = (value: string) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const handleTitleInput = () => {
  if (
    !props.journey &&
    !slugManuallyEdited.value
  ) {
    form.slug = slugify(form.title)
  }
}

const scrollToSection = (
  id: string,
) => {
  activeSection.value = id

  document
    .getElementById(id)
    ?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
}

const handleDestinationChange = () => {
  const allowedPlaceIds =
    new Set(
      filteredPlaces.value.map(
        (place: any) => place._id,
      ),
    )

  form.places =
    form.places.filter(id =>
      allowedPlaceIds.has(id),
    )

  form.itinerary.forEach(day => {
    if (
      day.place &&
      !allowedPlaceIds.has(day.place)
    ) {
      day.place = ''
    }
  })
}

const addHighlight = () => {
  if (form.highlights.length >= 30) {
    return
  }

  form.highlights.push('')
}

const removeHighlight = (
  index: number,
) => {
  form.highlights.splice(index, 1)
}

const addItineraryDay = () => {
  if (form.itinerary.length >= 60) {
    return
  }

  itineraryKey += 1

  form.itinerary.push({
    key: itineraryKey,
    day: form.itinerary.length + 1,
    title: '',
    description: '',
    place: '',
    image: '',
  })
}

const removeItineraryDay = (
  index: number,
) => {
  form.itinerary.splice(index, 1)

  form.itinerary.forEach(
    (day, dayIndex) => {
      day.day = dayIndex + 1
    },
  )
}

const normalizeMediaSelection = (
  selection: MediaItem | MediaItem[],
) => {
  if (Array.isArray(selection)) {
    return selection
  }

  return selection ? [selection] : []
}

const handleHeroSelect = (
  selection: MediaItem | MediaItem[],
) => {
  const selected =
    normalizeMediaSelection(selection)[0]

  if (!selected) return

  heroPreview.value = selected
  form.heroImage = selected._id
  heroPickerOpen.value = false
}

const handleOgSelect = (
  selection: MediaItem | MediaItem[],
) => {
  const selected =
    normalizeMediaSelection(selection)[0]

  if (!selected) return

  ogPreview.value = selected
  form.seo.ogImage = selected._id
  ogPickerOpen.value = false
}

const handleGallerySelect = (
  selection: MediaItem | MediaItem[],
) => {
  const selected =
    normalizeMediaSelection(selection)

  galleryPreviews.value =
    selected.slice(0, 30)

  form.gallery =
    galleryPreviews.value.map(
      media => media._id,
    )

  galleryPickerOpen.value = false
}

const removeGalleryImage = (
  id: string,
) => {
  galleryPreviews.value =
    galleryPreviews.value.filter(
      media => media._id !== id,
    )

  form.gallery =
    form.gallery.filter(
      mediaId => mediaId !== id,
    )
}

const openItineraryPicker = (
  index: number,
) => {
  itineraryPickerIndex.value = index
  itineraryPickerOpen.value = true
}

const closeItineraryPicker = () => {
  itineraryPickerOpen.value = false
  itineraryPickerIndex.value = null
}

const handleItineraryImageSelect = (
  selection: MediaItem | MediaItem[],
) => {
  if (
    itineraryPickerIndex.value === null
  ) {
    return
  }

  const selected =
    normalizeMediaSelection(selection)[0]

  if (!selected) return

  const day =
    form.itinerary[
      itineraryPickerIndex.value
    ]

  if (!day) return

  day.image = selected._id

  itineraryMedia.value[selected._id] =
    selected

  closeItineraryPicker()
}

const getItineraryImage = (
  id: string,
) => {
  if (!id) return null

  return itineraryMedia.value[id] || null
}

const resetForm = () => {
  Object.assign(
    form,
    createEmptyForm(),
  )

  heroPreview.value = null
  ogPreview.value = null
  galleryPreviews.value = []
  itineraryMedia.value = {}

  slugManuallyEdited.value = false
  localError.value = null
  activeSection.value = 'journey-basic'
}

const populateForm = (
  journey: Journey,
) => {
  resetForm()

  form.title = journey.title || ''
  form.slug = journey.slug || ''

  form.shortDescription =
    journey.shortDescription || ''

  form.overview =
    journey.overview || ''

  form.durationDays =
    journey.durationDays || 1

  form.destinations =
    (journey.destinations || [])
      .map(item => getId(item))
      .filter(Boolean)

  form.places =
    (journey.places || [])
      .map(item => getId(item))
      .filter(Boolean)

  form.experiences =
    (journey.experiences || [])
      .map(item => getId(item))
      .filter(Boolean)

  form.travelStyles =
    (journey.travelStyles || [])
      .map(item => getId(item))
      .filter(Boolean)

  if (
    journey.heroImage &&
    typeof journey.heroImage !== 'string'
  ) {
    heroPreview.value =
      journey.heroImage

    form.heroImage =
      journey.heroImage._id
  }

  galleryPreviews.value =
    (journey.gallery || []).filter(
      (
        media,
      ): media is MediaItem =>
        typeof media !== 'string',
    )

  form.gallery =
    (journey.gallery || [])
      .map(media => getId(media))
      .filter(Boolean)

  form.highlights = [
    ...(journey.highlights || []),
  ]

  form.itinerary =
    (journey.itinerary || []).map(
      (item, index) => {
        itineraryKey += 1

        const imageId =
          getId(item.image)

        if (
          item.image &&
          typeof item.image !== 'string'
        ) {
          itineraryMedia.value[
            item.image._id
          ] = item.image
        }

        return {
          key: itineraryKey,
          day: item.day || index + 1,
          title: item.title || '',
          description:
            item.description || '',
          place: getId(item.place),
          image: imageId,
        }
      },
    )

  form.isFeatured =
    Boolean(journey.isFeatured)

  form.isPublished =
    Boolean(journey.isPublished)

  form.sortOrder =
    journey.sortOrder || 0

  form.seo.title =
    journey.seo?.title || ''

  form.seo.description =
    journey.seo?.description || ''

  if (
    journey.seo?.ogImage &&
    typeof journey.seo.ogImage !==
      'string'
  ) {
    ogPreview.value =
      journey.seo.ogImage

    form.seo.ogImage =
      journey.seo.ogImage._id
  }

  slugManuallyEdited.value = true
}

const loadDependencies = async () => {
  await Promise.all([
    fetchDestinations(),
    fetchPlaces(),
    fetchExperiences(),
    fetchTravelStyles(),
  ])
}

const buildPayload =
  (): JourneyPayload => {
    const payload: JourneyPayload = {
      title: form.title.trim(),
      slug: form.slug
        .trim()
        .toLowerCase(),

      shortDescription:
        form.shortDescription.trim(),

      overview:
        form.overview.trim(),

      durationDays:
        Number(form.durationDays),

      destinations: [
        ...form.destinations,
      ],

      places: [...form.places],

      experiences: [
        ...form.experiences,
      ],

      travelStyles: [
        ...form.travelStyles,
      ],

      gallery: [
        ...form.gallery,
      ],

      highlights:
        form.highlights
          .map(item => item.trim())
          .filter(Boolean),

      itinerary:
        form.itinerary.map(day => ({
          day: Number(day.day),
          title: day.title.trim(),
          description:
            day.description.trim(),
          ...(day.place
            ? { place: day.place }
            : {}),
          ...(day.image
            ? { image: day.image }
            : {}),
        })),

      isFeatured:
        form.isFeatured,

      sortOrder:
        Number(form.sortOrder || 0),

      isPublished:
        form.isPublished,

      seo: {
        title:
          form.seo.title.trim(),

        description:
          form.seo.description.trim(),
      },
    }

    if (form.heroImage) {
      payload.heroImage =
        form.heroImage
    }

    if (form.seo.ogImage) {
      payload.seo = {
        ...payload.seo,
        ogImage:
          form.seo.ogImage,
      }
    }

    return payload
  }

const validateForm = () => {
  if (!form.title.trim()) {
    return 'Journey title is required.'
  }

  if (!form.slug.trim()) {
    return 'Journey slug is required.'
  }

  if (
    !Number(form.durationDays) ||
    Number(form.durationDays) < 1
  ) {
    return 'Journey duration must be at least 1 day.'
  }

  if (!form.destinations.length) {
    return 'Select at least one destination.'
  }

  const invalidItinerary =
    form.itinerary.some(
      day =>
        !day.title.trim() ||
        Number(day.day) < 1,
    )

  if (invalidItinerary) {
    return 'Every itinerary day requires a valid day number and title.'
  }

  return null
}

const handleSubmit = async () => {
  localError.value = validateForm()

  if (localError.value) {
    return
  }

  saving.value = true

  try {
    const payload = buildPayload()

    let saved: Journey

    if (props.journey?._id) {
      saved = await updateJourney(
        props.journey._id,
        payload,
      )
    } else {
      saved =
        await createJourney(payload)
    }

    emit('saved', saved)
    emit('close')
  } catch (err: any) {
    localError.value =
      err?.message ||
      'Unable to save journey.'
  } finally {
    saving.value = false
  }
}

watch(
  () => props.open,
  async value => {
    if (!value) return

    localError.value = null

    try {
      await loadDependencies()

      if (props.journey) {
        populateForm(props.journey)
      } else {
        resetForm()
      }
    } catch (err: any) {
      localError.value =
        err?.message ||
        'Unable to load journey form data.'
    }
  },
)

watch(
  () => props.journey,
  value => {
    if (
      props.open &&
      value
    ) {
      populateForm(value)
    }
  },
  {
    deep: true,
  },
)
</script>

<style scoped>
.drawer-overlay {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: flex;
  justify-content: flex-end;
  background: rgba(13, 11, 14, 0.55);
  backdrop-filter: blur(5px);
}

.journey-drawer {
  width: min(940px, 94vw);
  height: 100vh;
  overflow: hidden;
  background: #f7f5f4;
  box-shadow: -24px 0 70px rgba(22, 10, 20, 0.16);
}

.drawer-header {
  height: 132px;
  padding: 28px 34px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  background: #fff;
  border-bottom: 1px solid #ebe5ea;
}

.eyebrow {
  display: block;
  margin-bottom: 7px;
  color: #a20eac;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.15em;
}

.drawer-header h2 {
  margin: 0;
  color: #211d21;
  font-size: 30px;
  line-height: 1.15;
}

.drawer-header p {
  margin: 8px 0 0;
  color: #80777f;
  font-size: 14px;
  line-height: 1.5;
}

.icon-button {
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  border: 1px solid #ebe5ea;
  border-radius: 50%;
  background: #fff;
  color: #211d21;
  font-size: 26px;
  cursor: pointer;
}

.section-nav {
  height: 58px;
  padding: 0 30px;
  display: flex;
  align-items: center;
  gap: 5px;
  overflow-x: auto;
  background: #fff;
  border-bottom: 1px solid #ebe5ea;
}

.section-nav button {
  padding: 9px 12px;
  white-space: nowrap;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: #80777f;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.section-nav button.active,
.section-nav button:hover {
  color: #a20eac;
  background: #fbf0fa;
}

.drawer-body {
  height: calc(100vh - 190px);
  padding: 30px 34px 120px;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.form-section {
  margin-bottom: 24px;
  padding: 28px;
  scroll-margin-top: 20px;
  background: #fff;
  border: 1px solid #ebe5ea;
  border-radius: 20px;
  box-shadow: 0 12px 35px rgba(35, 15, 32, 0.04);
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.field {
  margin-bottom: 22px;
}

.field:last-child {
  margin-bottom: 0;
}

.field-full {
  grid-column: 1 / -1;
}

.field label,
.label-row label {
  display: block;
  margin-bottom: 8px;
  color: #3a3339;
  font-size: 13px;
  font-weight: 700;
}

.field label span {
  color: #d80bb9;
}

.field-help {
  margin: -2px 0 11px;
  color: #938991;
  font-size: 12px;
  line-height: 1.5;
}

input,
select,
textarea {
  width: 100%;
  border: 1px solid #e6dfe5;
  border-radius: 11px;
  outline: none;
  background: #fff;
  color: #211d21;
  font-family: inherit;
  font-size: 14px;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

input,
select {
  min-height: 46px;
  padding: 0 14px;
}

textarea {
  padding: 13px 14px;
  line-height: 1.6;
  resize: vertical;
}

input:focus,
select:focus,
textarea:focus {
  border-color: rgba(216, 11, 185, 0.55);
  box-shadow: 0 0 0 3px rgba(216, 11, 185, 0.08);
}

.label-row {
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.label-row label {
  margin: 0;
}

.counter {
  color: #9c929a;
  font-size: 11px;
}

.slug-field,
.suffix-input {
  display: flex;
  align-items: center;
  overflow: hidden;
  border: 1px solid #e6dfe5;
  border-radius: 11px;
  background: #fff;
}

.slug-field:focus-within,
.suffix-input:focus-within {
  border-color: rgba(216, 11, 185, 0.55);
  box-shadow: 0 0 0 3px rgba(216, 11, 185, 0.08);
}

.slug-field > span,
.suffix-input > span {
  padding: 0 14px;
  color: #91878f;
  font-size: 13px;
  white-space: nowrap;
}

.slug-field input,
.suffix-input input {
  border: 0;
  border-radius: 0;
  box-shadow: none;
}

.selection-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.selection-card {
  position: relative;
  min-height: 67px;
  margin: 0 !important;
  padding: 13px 14px;
  display: flex !important;
  align-items: center;
  gap: 12px;
  border: 1px solid #ebe5ea;
  border-radius: 12px;
  background: #fff;
  cursor: pointer;
}

.selection-card input,
.choice-chip input,
.toggle-card input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.selection-card.selected {
  border-color: rgba(216, 11, 185, 0.35);
  background: #fff7fd;
}

.selection-check {
  width: 24px;
  height: 24px;
  flex: 0 0 24px;
  display: grid;
  place-items: center;
  border: 1px solid #ddd4dc;
  border-radius: 7px;
  color: transparent !important;
  font-size: 12px;
}

.selection-card.selected .selection-check {
  border-color: transparent;
  background: linear-gradient(
    135deg,
    #ec12c7,
    #821092
  );
  color: #fff !important;
}

.selection-content {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.selection-content strong {
  color: #2c272b;
  font-size: 14px;
}

.selection-content small {
  color: #91878f;
  font-size: 11px;
}

.chip-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
}

.choice-chip {
  position: relative;
  margin: 0 !important;
  padding: 10px 14px;
  border: 1px solid #e5dee4;
  border-radius: 999px;
  background: #fff;
  color: #655d64 !important;
  font-size: 13px !important;
  cursor: pointer;
}

.choice-chip.selected {
  border-color: rgba(216, 11, 185, 0.25);
  background: #faebf8;
  color: #98109e !important;
}

.notice-box,
.empty-inline {
  padding: 15px 16px;
  border: 1px dashed #dfd5dd;
  border-radius: 11px;
  background: #fbf9fa;
  color: #8b8189;
  font-size: 13px;
}

.visual-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.media-placeholder {
  width: 100%;
  min-height: 190px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 1px dashed #d9ced7;
  border-radius: 14px;
  background: #fbf9fa;
  color: #655d64;
  cursor: pointer;
}

.media-placeholder:hover {
  border-color: rgba(216, 11, 185, 0.5);
  background: #fff8fd;
}

.media-plus {
  width: 39px;
  height: 39px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #f5e8f3;
  color: #a20eac;
  font-size: 24px;
}

.media-placeholder strong {
  font-size: 14px;
}

.media-placeholder small {
  color: #938991;
  font-size: 12px;
}

.selected-media {
  position: relative;
  overflow: hidden;
  border-radius: 14px;
  background: #eee8ed;
}

.hero-media {
  height: 190px;
}

.selected-media img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.media-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 12px;
  background: linear-gradient(
    transparent 45%,
    rgba(13, 11, 14, 0.7)
  );
}

.media-overlay button {
  padding: 9px 12px;
  border: 0;
  border-radius: 8px;
  background: #fff;
  color: #211d21;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.text-button {
  border: 0;
  background: transparent;
  color: #a20eac;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}

.gallery-item {
  position: relative;
  aspect-ratio: 1 / 0.78;
  overflow: hidden;
  border-radius: 11px;
  background: #eee8ed;
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
  width: 27px;
  height: 27px;
  border: 0;
  border-radius: 50%;
  background: rgba(13, 11, 14, 0.78);
  color: #fff;
  font-size: 17px;
  cursor: pointer;
}

.gallery-empty {
  width: 100%;
  min-height: 110px;
  border: 1px dashed #d9ced7;
  border-radius: 13px;
  background: #fbf9fa;
  color: #80777f;
  font-size: 13px;
  cursor: pointer;
}

.gallery-empty span {
  margin-right: 5px;
  color: #a20eac;
  font-size: 19px;
}

.repeat-list {
  display: flex;
  flex-direction: column;
  gap: 9px;
  margin-bottom: 14px;
}

.repeat-row {
  display: grid;
  grid-template-columns: 38px 1fr 38px;
  align-items: center;
  gap: 9px;
}

.repeat-number {
  color: #a20eac;
  font-size: 11px;
  font-weight: 800;
}

.remove-button {
  width: 38px;
  height: 38px;
  border: 1px solid #eee4e7;
  border-radius: 9px;
  background: #fff;
  color: #b94a55;
  font-size: 19px;
  cursor: pointer;
}

.secondary-button {
  padding: 11px 15px;
  border: 1px solid #e3d9e1;
  border-radius: 10px;
  background: #fff;
  color: #4c444b;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.secondary-button:hover {
  border-color: rgba(216, 11, 185, 0.3);
  color: #a20eac;
}

.itinerary-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 15px;
}

.itinerary-card {
  overflow: hidden;
  border: 1px solid #ebe5ea;
  border-radius: 15px;
  background: #fdfcfc;
}

.itinerary-header {
  padding: 14px 17px;
  display: flex;
  align-items: center;
  gap: 14px;
  background: #fbf8fa;
  border-bottom: 1px solid #eee7ec;
}

.day-marker {
  width: 52px;
  height: 52px;
  flex: 0 0 52px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: linear-gradient(
    135deg,
    #ec12c7,
    #821092
  );
  color: #fff;
}

.day-marker span {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.day-marker strong {
  font-size: 19px;
}

.itinerary-heading {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.itinerary-heading strong {
  color: #2d272c;
  font-size: 14px;
}

.itinerary-heading span {
  color: #928890;
  font-size: 11px;
}

.remove-day {
  border: 0;
  background: transparent;
  color: #b94a55;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.itinerary-fields {
  padding: 20px;
}

.small-media-button {
  width: 100%;
  min-height: 46px;
  border: 1px dashed #d8ccd5;
  border-radius: 10px;
  background: #fff;
  color: #8e168f;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.day-image-preview {
  width: 180px;
  height: 100px;
  overflow: hidden;
  border-radius: 10px;
}

.day-image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.itinerary-empty {
  min-height: 155px;
  margin-bottom: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px dashed #dcd1d9;
  border-radius: 14px;
  background: #fbf9fa;
  text-align: center;
}

.itinerary-empty span {
  margin-bottom: 8px;
  color: #b31bad;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.14em;
}

.itinerary-empty strong {
  color: #3d363c;
  font-size: 15px;
}

.itinerary-empty p {
  margin: 5px 0 0;
  color: #938991;
  font-size: 12px;
}

.toggle-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.toggle-card {
  position: relative;
  margin: 0 !important;
  padding: 17px;
  display: flex !important;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  border: 1px solid #e8e1e6;
  border-radius: 13px;
  background: #fff;
  cursor: pointer;
}

.toggle-card > div {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.toggle-card strong {
  color: #332d32;
  font-size: 14px;
}

.toggle-card div span {
  max-width: 250px;
  color: #8d838b !important;
  font-size: 11px;
  line-height: 1.45;
}

.toggle {
  position: relative;
  width: 44px;
  height: 25px;
  flex: 0 0 44px;
  border-radius: 999px;
  background: #ddd5db;
  transition: 0.2s ease;
}

.toggle span {
  position: absolute;
  top: 4px;
  left: 4px;
  width: 17px;
  height: 17px;
  border-radius: 50%;
  background: #fff;
  transition: 0.2s ease;
}

.toggle-card input:checked + .toggle {
  background: linear-gradient(
    135deg,
    #ec12c7,
    #821092
  );
}

.toggle-card input:checked + .toggle span {
  transform: translateX(19px);
}

.error-message {
  margin-bottom: 18px;
  padding: 13px 15px;
  border: 1px solid #f0ced2;
  border-radius: 11px;
  background: #fff5f6;
  color: #a73e49;
  font-size: 13px;
  line-height: 1.5;
}

.drawer-footer {
  position: sticky;
  bottom: -120px;
  z-index: 20;
  margin: 30px -34px -120px;
  padding: 17px 34px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  border-top: 1px solid #e8e1e6;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(14px);
}

.save-state {
  color: #8a8088;
  font-size: 12px;
}

.footer-actions {
  display: flex;
  gap: 10px;
}

.cancel-button,
.save-button {
  min-height: 44px;
  padding: 0 18px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
}

.cancel-button {
  border: 1px solid #e3dce1;
  background: #fff;
  color: #655d64;
}

.save-button {
  min-width: 145px;
  border: 0;
  background: linear-gradient(
    135deg,
    #ec12c7 0%,
    #a20eac 52%,
    #651070 100%
  );
  color: #fff;
  box-shadow: 0 8px 22px rgba(162, 14, 172, 0.2);
}

.cancel-button:disabled,
.save-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.25s ease;
}

.drawer-enter-active .journey-drawer,
.drawer-leave-active .journey-drawer {
  transition: transform 0.3s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from .journey-drawer,
.drawer-leave-to .journey-drawer {
  transform: translateX(45px);
}

@media (max-width: 760px) {
  .journey-drawer {
    width: 100%;
  }

  .drawer-header {
    height: auto;
    padding: 22px;
  }

  .drawer-header h2 {
    font-size: 25px;
  }

  .section-nav {
    padding: 0 18px;
  }

  .drawer-body {
    height: calc(100vh - 180px);
    padding: 20px 18px 110px;
  }

  .form-section {
    padding: 20px;
  }

  .field-grid,
  .selection-grid,
  .visual-grid,
  .toggle-grid {
    grid-template-columns: 1fr;
  }

  .gallery-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .drawer-footer {
    margin-left: -18px;
    margin-right: -18px;
    padding: 14px 18px;
  }

  .save-state {
    display: none;
  }

  .footer-actions {
    width: 100%;
  }

  .cancel-button,
  .save-button {
    flex: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition: none !important;
  }
}
</style>