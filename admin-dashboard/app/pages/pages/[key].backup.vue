<template>
  <div class="editor-page">
    <header class="editor-header">
      <div>
        <button class="back-btn" @click="navigateTo('/pages')">
          ← Back to Pages
        </button>

        <span class="eyebrow">PAGE CMS</span>
        <h1>{{ page?.title || pageLabel }}</h1>

        <p>
          Manage page content, SEO and publishing settings.
        </p>
      </div>

      <div v-if="page" class="header-actions">
        <span
          class="status"
          :class="form.isPublished ? 'published' : 'draft'"
        >
          {{ form.isPublished ? 'Published' : 'Draft' }}
        </span>

        <button
          class="save-btn"
          :disabled="saving"
          @click="savePage"
        >
          {{ saving ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </header>

    <div v-if="loadingPage" class="loading-state">
      Loading page content...
    </div>

    <div v-else-if="loadError" class="error-state">
      <strong>Unable to load page</strong>
      <span>{{ loadError }}</span>

      <button @click="loadPage">
        Try Again
      </button>
    </div>

    <template v-else-if="page">
      <div class="editor-layout">
        <!-- MAIN -->
        <main class="editor-main">
          <!-- General -->
          <section class="panel">
            <div class="panel-heading">
              <div>
                <span>GENERAL</span>
                <h2>Page Information</h2>
              </div>
            </div>

            <div class="field">
              <label>Page Title</label>

              <input
                v-model="form.title"
                type="text"
                maxlength="150"
                placeholder="Page title"
              />

              <small>
                Internal/page-level title. Maximum 150 characters.
              </small>
            </div>
          </section>

          <!-- CONTENT -->
          <section class="panel">
            <div class="panel-heading">
              <div>
                <span>CONTENT</span>
                <h2>Page Sections</h2>
              </div>

              <span class="page-type">
                {{ pageLabel }}
              </span>
            </div>

            <!-- HOME -->
            <template v-if="pageKey === 'home'">
              <div class="section-block">
                <div class="section-title">
                  <span>01</span>
                  <div>
                    <h3>Hero Section</h3>
                    <p>Main homepage introduction.</p>
                  </div>
                </div>

                <div class="field">
                  <label>Eyebrow</label>
                  <input
                    v-model="form.content.hero.eyebrow"
                    type="text"
                    placeholder="Bespoke journeys across the world"
                  />
                </div>

                <div class="field">
                  <label>Heading</label>
                  <input
                    v-model="form.content.hero.heading"
                    type="text"
                    placeholder="Travel, thoughtfully redefined"
                  />
                </div>

                <div class="field">
                  <label>Description</label>
                  <textarea
                    v-model="form.content.hero.description"
                    rows="4"
                    placeholder="Homepage hero introduction..."
                  />
                </div>

                <div class="two-column">
                  <div class="field">
                    <label>CTA Label</label>
                    <input
                      v-model="form.content.hero.ctaLabel"
                      type="text"
                      placeholder="Plan Your Journey"
                    />
                  </div>

                  <div class="field">
                    <label>CTA Link</label>
                    <input
                      v-model="form.content.hero.ctaLink"
                      type="text"
                      placeholder="/contact"
                    />
                  </div>
                </div>
              </div>

              <div class="section-block">
                <div class="section-title">
                  <span>02</span>
                  <div>
                    <h3>Featured Journeys</h3>
                    <p>
                      Copy displayed above dynamically selected journeys.
                    </p>
                  </div>
                </div>

                <div class="field">
                  <label>Heading</label>
                  <input
                    v-model="form.content.featuredJourneys.heading"
                    type="text"
                    placeholder="Journeys worth taking"
                  />
                </div>

                <div class="field">
                  <label>Description</label>
                  <textarea
                    v-model="form.content.featuredJourneys.description"
                    rows="3"
                  />
                </div>
              </div>

              <div class="section-block">
                <div class="section-title">
                  <span>03</span>
                  <div>
                    <h3>Destinations</h3>
                    <p>Homepage destination discovery section.</p>
                  </div>
                </div>

                <div class="field">
                  <label>Heading</label>
                  <input
                    v-model="form.content.destinations.heading"
                    type="text"
                  />
                </div>

                <div class="field">
                  <label>Description</label>
                  <textarea
                    v-model="form.content.destinations.description"
                    rows="3"
                  />
                </div>
              </div>

              <div class="section-block">
                <div class="section-title">
                  <span>04</span>
                  <div>
                    <h3>Experiences</h3>
                    <p>Homepage experience discovery section.</p>
                  </div>
                </div>

                <div class="field">
                  <label>Heading</label>
                  <input
                    v-model="form.content.experiences.heading"
                    type="text"
                  />
                </div>

                <div class="field">
                  <label>Description</label>
                  <textarea
                    v-model="form.content.experiences.description"
                    rows="3"
                  />
                </div>
              </div>

              <div class="section-block">
                <div class="section-title">
                  <span>05</span>
                  <div>
                    <h3>Brand Story</h3>
                    <p>Short Vedic Journey introduction.</p>
                  </div>
                </div>

                <div class="field">
                  <label>Heading</label>
                  <input
                    v-model="form.content.story.heading"
                    type="text"
                  />
                </div>

                <div class="field">
                  <label>Description</label>
                  <textarea
                    v-model="form.content.story.description"
                    rows="5"
                  />
                </div>
              </div>

              <div class="section-block">
                <div class="section-title">
                  <span>06</span>
                  <div>
                    <h3>Final CTA</h3>
                    <p>Closing journey planning call-to-action.</p>
                  </div>
                </div>

                <div class="field">
                  <label>Heading</label>
                  <input
                    v-model="form.content.cta.heading"
                    type="text"
                  />
                </div>

                <div class="field">
                  <label>Description</label>
                  <textarea
                    v-model="form.content.cta.description"
                    rows="3"
                  />
                </div>

                <div class="two-column">
                  <div class="field">
                    <label>Button Label</label>
                    <input
                      v-model="form.content.cta.label"
                      type="text"
                    />
                  </div>

                  <div class="field">
                    <label>Button Link</label>
                    <input
                      v-model="form.content.cta.link"
                      type="text"
                    />
                  </div>
                </div>
              </div>
            </template>

            <!-- ABOUT -->
            <template v-else-if="pageKey === 'about'">
              <div class="section-block">
                <div class="section-title">
                  <span>01</span>
                  <div>
                    <h3>Hero</h3>
                    <p>About page introduction.</p>
                  </div>
                </div>

                <div class="field">
                  <label>Heading</label>
                  <input v-model="form.content.hero.heading" type="text" />
                </div>

                <div class="field">
                  <label>Description</label>
                  <textarea
                    v-model="form.content.hero.description"
                    rows="4"
                  />
                </div>
              </div>

              <div class="section-block">
                <div class="section-title">
                  <span>02</span>
                  <div>
                    <h3>Our Story</h3>
                    <p>The Vedic Journey brand story.</p>
                  </div>
                </div>

                <div class="field">
                  <label>Heading</label>
                  <input v-model="form.content.story.heading" type="text" />
                </div>

                <div class="field">
                  <label>Content</label>
                  <textarea
                    v-model="form.content.story.description"
                    rows="8"
                  />
                </div>
              </div>

              <div class="section-block">
                <div class="section-title">
                  <span>03</span>
                  <div>
                    <h3>Founder</h3>
                    <p>Founder introduction and message.</p>
                  </div>
                </div>

                <div class="field">
                  <label>Name</label>
                  <input v-model="form.content.founder.name" type="text" />
                </div>

                <div class="field">
                  <label>Title</label>
                  <input v-model="form.content.founder.title" type="text" />
                </div>

                <div class="field">
                  <label>Story</label>
                  <textarea
                    v-model="form.content.founder.description"
                    rows="7"
                  />
                </div>
              </div>

              <div class="section-block">
                <div class="section-title">
                  <span>04</span>
                  <div>
                    <h3>Final CTA</h3>
                    <p>Closing call-to-action.</p>
                  </div>
                </div>

                <div class="field">
                  <label>Heading</label>
                  <input v-model="form.content.cta.heading" type="text" />
                </div>

                <div class="field">
                  <label>Description</label>
                  <textarea
                    v-model="form.content.cta.description"
                    rows="3"
                  />
                </div>
              </div>
            </template>

            <!-- DESTINATIONS -->
            <template v-else-if="pageKey === 'destinations'">
              <div class="section-block">
                <div class="section-title">
                  <span>01</span>
                  <div>
                    <h3>Hero</h3>
                    <p>Destinations landing page introduction.</p>
                  </div>
                </div>

                <div class="field">
                  <label>Heading</label>
                  <input v-model="form.content.hero.heading" type="text" />
                </div>

                <div class="field">
                  <label>Description</label>
                  <textarea
                    v-model="form.content.hero.description"
                    rows="4"
                  />
                </div>
              </div>

              <div class="section-block">
                <div class="section-title">
                  <span>02</span>
                  <div>
                    <h3>Destination Collection</h3>
                    <p>
                      Copy shown above dynamic regions and destinations.
                    </p>
                  </div>
                </div>

                <div class="field">
                  <label>Heading</label>
                  <input
                    v-model="form.content.collection.heading"
                    type="text"
                  />
                </div>

                <div class="field">
                  <label>Description</label>
                  <textarea
                    v-model="form.content.collection.description"
                    rows="4"
                  />
                </div>
              </div>

              <div class="section-block">
                <div class="section-title">
                  <span>03</span>
                  <div>
                    <h3>Final CTA</h3>
                    <p>Destination enquiry call-to-action.</p>
                  </div>
                </div>

                <div class="field">
                  <label>Heading</label>
                  <input v-model="form.content.cta.heading" type="text" />
                </div>

                <div class="field">
                  <label>Description</label>
                  <textarea
                    v-model="form.content.cta.description"
                    rows="3"
                  />
                </div>
              </div>
            </template>

            <!-- CONTACT -->
            <template v-else-if="pageKey === 'contact'">
              <div class="section-block">
                <div class="section-title">
                  <span>01</span>
                  <div>
                    <h3>Hero</h3>
                    <p>Contact page introduction.</p>
                  </div>
                </div>

                <div class="field">
                  <label>Heading</label>
                  <input v-model="form.content.hero.heading" type="text" />
                </div>

                <div class="field">
                  <label>Description</label>
                  <textarea
                    v-model="form.content.hero.description"
                    rows="4"
                  />
                </div>
              </div>

              <div class="section-block">
                <div class="section-title">
                  <span>02</span>
                  <div>
                    <h3>Enquiry Introduction</h3>
                    <p>Copy displayed near the enquiry form.</p>
                  </div>
                </div>

                <div class="field">
                  <label>Heading</label>
                  <input
                    v-model="form.content.enquiry.heading"
                    type="text"
                  />
                </div>

                <div class="field">
                  <label>Description</label>
                  <textarea
                    v-model="form.content.enquiry.description"
                    rows="5"
                  />
                </div>
              </div>
            </template>
          </section>

          <!-- SEO -->
          <section class="panel">
            <div class="panel-heading">
              <div>
                <span>SEARCH & SHARING</span>
                <h2>SEO</h2>
              </div>
            </div>

            <div class="field">
              <div class="label-row">
                <label>SEO Title</label>
                <span>{{ form.seo.title.length }}/70</span>
              </div>

              <input
                v-model="form.seo.title"
                type="text"
                maxlength="70"
                placeholder="SEO title"
              />
            </div>

            <div class="field">
              <div class="label-row">
                <label>Meta Description</label>
                <span>{{ form.seo.description.length }}/180</span>
              </div>

              <textarea
                v-model="form.seo.description"
                rows="4"
                maxlength="180"
                placeholder="Search engine description..."
              />
            </div>

            <div class="field">
              <label>Open Graph Image</label>

              <div v-if="selectedOgImage" class="media-preview">
                <img
                  :src="selectedOgImage.url"
                  :alt="selectedOgImage.altText || ''"
                />

                <div>
                  <strong>Social sharing image</strong>
                  <span>{{ selectedOgImage.altText || 'No alt text' }}</span>
                </div>

                <button type="button" @click="mediaPickerOpen = true">
                  Change
                </button>
              </div>

              <button
                v-else
                type="button"
                class="media-select"
                @click="mediaPickerOpen = true"
              >
                + Select from Media Library
              </button>

              <small>
                Existing OG image can be changed. Removal is not enabled
                because the current backend DTO does not accept null.
              </small>
            </div>
          </section>
        </main>

        <!-- SIDEBAR -->
        <aside class="editor-sidebar">
          <section class="panel sticky-panel">
            <div class="panel-heading">
              <div>
                <span>VISIBILITY</span>
                <h2>Publishing</h2>
              </div>
            </div>

            <label class="publish-toggle">
              <div>
                <strong>Published</strong>
                <span>
                  Make this page available on the public website.
                </span>
              </div>

              <input
                v-model="form.isPublished"
                type="checkbox"
              />
            </label>

            <div class="sidebar-divider" />

            <div class="info-row">
              <span>Page Key</span>
              <strong>{{ page.key }}</strong>
            </div>

            <div class="info-row">
              <span>Last Updated</span>
              <strong>{{ formatDate(page.updatedAt) }}</strong>
            </div>

            <button
              class="save-btn full"
              :disabled="saving"
              @click="savePage"
            >
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>

            <p v-if="saveSuccess" class="save-success">
              Changes saved successfully.
            </p>

            <p v-if="saveError" class="save-error">
              {{ saveError }}
            </p>
          </section>
        </aside>
      </div>
    </template>

    <ClientOnly>
      <MediaPickerModal
        :open="mediaPickerOpen"
        type="image"
        @close="mediaPickerOpen = false"
        @select="selectOgImage"
      />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import MediaPickerModal from '~/components/media/MediaPickerModal.vue'
import type { AdminPage } from '~/composables/usePages'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

interface MediaItem {
  _id: string
  url: string
  altText?: string
}

const route = useRoute()

const {
  fetchPage,
  updatePage,
} = usePages()

const pageKey = computed(() =>
  String(route.params.key || '').toLowerCase(),
)

const allowedPages = [
  'home',
  'about',
  'destinations',
  'contact',
]

const page = ref<AdminPage | null>(null)
const loadingPage = ref(true)
const saving = ref(false)
const loadError = ref<string | null>(null)
const saveError = ref<string | null>(null)
const saveSuccess = ref(false)

const mediaPickerOpen = ref(false)
const selectedOgImage = ref<MediaItem | null>(null)

const createDefaultContent = (key: string) => {
  if (key === 'home') {
    return {
      hero: {
        eyebrow: '',
        heading: '',
        description: '',
        ctaLabel: '',
        ctaLink: '',
      },
      featuredJourneys: {
        heading: '',
        description: '',
      },
      destinations: {
        heading: '',
        description: '',
      },
      experiences: {
        heading: '',
        description: '',
      },
      story: {
        heading: '',
        description: '',
      },
      cta: {
        heading: '',
        description: '',
        label: '',
        link: '',
      },
    }
  }

  if (key === 'about') {
    return {
      hero: {
        heading: '',
        description: '',
      },
      story: {
        heading: '',
        description: '',
      },
      founder: {
        name: '',
        title: '',
        description: '',
      },
      cta: {
        heading: '',
        description: '',
      },
    }
  }

  if (key === 'destinations') {
    return {
      hero: {
        heading: '',
        description: '',
      },
      collection: {
        heading: '',
        description: '',
      },
      cta: {
        heading: '',
        description: '',
      },
    }
  }

  return {
    hero: {
      heading: '',
      description: '',
    },
    enquiry: {
      heading: '',
      description: '',
    },
  }
}

const form = reactive({
  title: '',
  content: createDefaultContent(pageKey.value) as any,
  seo: {
    title: '',
    description: '',
    ogImage: '' as string,
  },
  isPublished: true,
})

const pageLabel = computed(() => {
  const labels: Record<string, string> = {
    home: 'Home Page',
    about: 'About Page',
    destinations: 'Destinations Page',
    contact: 'Contact Page',
  }

  return labels[pageKey.value] || 'Page'
})

const mergeContent = (
  defaults: Record<string, any>,
  saved: Record<string, any>,
) => {
  const result = structuredClone(defaults)

  for (const [key, value] of Object.entries(saved || {})) {
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      typeof result[key] === 'object'
    ) {
      result[key] = {
        ...result[key],
        ...value,
      }
    } else {
      result[key] = value
    }
  }

  return result
}

const loadPage = async () => {
  if (!allowedPages.includes(pageKey.value)) {
    return navigateTo('/pages')
  }

  loadingPage.value = true
  loadError.value = null

  try {
    const data = await fetchPage(pageKey.value)

    page.value = data

    form.title = data.title || ''
    form.content = mergeContent(
      createDefaultContent(pageKey.value),
      data.content || {},
    )

    form.seo.title = data.seo?.title || ''
    form.seo.description = data.seo?.description || ''

    const ogImage = data.seo?.ogImage

    if (
      ogImage &&
      typeof ogImage === 'object'
    ) {
      selectedOgImage.value = ogImage as MediaItem
      form.seo.ogImage = ogImage._id
    } else {
      selectedOgImage.value = null
      form.seo.ogImage =
        typeof ogImage === 'string'
          ? ogImage
          : ''
    }

    form.isPublished = data.isPublished ?? true
  } catch (error: any) {
    loadError.value =
      error?.data?.message ||
      error?.message ||
      'Unable to load page.'
  } finally {
    loadingPage.value = false
  }
}

const selectOgImage = (
  items: MediaItem[],
) => {
  const media = items[0]

  if (!media) return

  selectedOgImage.value = media
  form.seo.ogImage = media._id
  mediaPickerOpen.value = false
}

const savePage = async () => {
  if (saving.value) return

  saving.value = true
  saveError.value = null
  saveSuccess.value = false

  try {
    const seo: Record<string, string> = {
      title: form.seo.title.trim(),
      description: form.seo.description.trim(),
    }

    if (form.seo.ogImage) {
      seo.ogImage = form.seo.ogImage
    }

    const updated = await updatePage(
    pageKey.value,
    {
        title: form.title.trim(),
        content: JSON.parse(
        JSON.stringify(form.content),
        ),
        seo,
        isPublished: form.isPublished,
    },
    )

    page.value = updated
    saveSuccess.value = true

    window.setTimeout(() => {
      saveSuccess.value = false
    }, 2500)
  } catch (error: any) {
    saveError.value =
      error?.data?.message ||
      error?.message ||
      'Unable to save page.'
  } finally {
    saving.value = false
  }
}

const formatDate = (value?: string) => {
  if (!value) return '—'

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

onMounted(loadPage)
</script>

<style scoped>
.editor-page {
  width: 100%;
}

.editor-header {
  margin-bottom: 24px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 30px;
}

.back-btn {
  margin: 0 0 20px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #81777f;
  font: inherit;
  font-size: 13px;
  font-weight: 650;
  cursor: pointer;
}

.back-btn:hover {
  color: #a20eac;
}

.eyebrow {
  display: block;
  margin-bottom: 8px;
  color: #a20eac;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .16em;
}

.editor-header h1 {
  margin: 0;
  color: #211d21;
  font-size: 42px;
  letter-spacing: -.035em;
}

.editor-header p {
  margin: 9px 0 0;
  color: #80777f;
  font-size: 14px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status {
  padding: 8px 11px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 750;
}

.status.published {
  background: #edf7f2;
  color: #328462;
}

.status.draft {
  background: #f1eef0;
  color: #776e75;
}

.save-btn {
  min-height: 42px;
  padding: 0 18px;
  border: 0;
  border-radius: 9px;
  background: linear-gradient(135deg, #ec12c7, #821092);
  color: white;
  font: inherit;
  font-size: 13px;
  font-weight: 750;
  cursor: pointer;
}

.save-btn:disabled {
  opacity: .55;
  cursor: wait;
}

.save-btn.full {
  width: 100%;
  margin-top: 22px;
}

.editor-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 310px;
  gap: 20px;
  align-items: start;
}

.editor-main {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.panel {
  padding: 24px;
  border: 1px solid #ebe5ea;
  border-radius: 17px;
  background: #fff;
  box-shadow: 0 10px 30px rgba(35, 15, 32, .035);
}

.panel-heading {
  margin-bottom: 23px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.panel-heading span {
  color: #a20eac;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .13em;
}

.panel-heading h2 {
  margin: 5px 0 0;
  color: #2a2529;
  font-size: 20px;
}

.page-type {
  padding: 7px 10px;
  border-radius: 7px;
  background: #faf5f9;
}

.section-block {
  padding: 22px 0;
  border-top: 1px solid #f0ebef;
}

.section-block:first-of-type {
  padding-top: 0;
  border-top: 0;
}

.section-title {
  margin-bottom: 20px;
  display: flex;
  gap: 12px;
}

.section-title > span {
  width: 31px;
  height: 31px;
  flex: 0 0 31px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: #faf0f8;
  color: #a20eac;
  font-size: 10px;
  font-weight: 800;
}

.section-title h3 {
  margin: 0;
  color: #312b30;
  font-size: 15px;
}

.section-title p {
  margin: 4px 0 0;
  color: #91878f;
  font-size: 12px;
}

.field {
  margin-top: 17px;
}

.field:first-child {
  margin-top: 0;
}

.field label {
  display: block;
  margin-bottom: 7px;
  color: #514950;
  font-size: 13px;
  font-weight: 700;
}

.field input,
.field textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #e6dfe4;
  border-radius: 9px;
  background: #fff;
  color: #2a2529;
  font: inherit;
  font-size: 14px;
  outline: none;
  transition: border-color .18s ease, box-shadow .18s ease;
}

.field input {
  height: 44px;
  padding: 0 13px;
}

.field textarea {
  padding: 12px 13px;
  line-height: 1.6;
  resize: vertical;
}

.field input:focus,
.field textarea:focus {
  border-color: rgba(216, 11, 185, .55);
  box-shadow: 0 0 0 3px rgba(216, 11, 185, .07);
}

.field small {
  display: block;
  margin-top: 7px;
  color: #9b9199;
  font-size: 11px;
  line-height: 1.5;
}

.label-row {
  display: flex;
  justify-content: space-between;
}

.label-row span {
  color: #9a9098;
  font-size: 11px;
}

.two-column {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.sticky-panel {
  position: sticky;
  top: 20px;
}

.publish-toggle {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  cursor: pointer;
}

.publish-toggle strong {
  display: block;
  color: #403940;
  font-size: 13px;
}

.publish-toggle span {
  max-width: 190px;
  margin-top: 5px;
  display: block;
  color: #90868e;
  font-size: 11px;
  line-height: 1.5;
}

.publish-toggle input {
  width: 18px;
  height: 18px;
  accent-color: #b20eaf;
}

.sidebar-divider {
  height: 1px;
  margin: 21px 0;
  background: #eee8ec;
}

.info-row {
  margin-top: 14px;
  display: flex;
  justify-content: space-between;
  gap: 15px;
}

.info-row span {
  color: #938991;
  font-size: 11px;
}

.info-row strong {
  color: #514950;
  font-size: 11px;
  text-align: right;
}

.media-select {
  width: 100%;
  min-height: 80px;
  border: 1px dashed #d9cdd6;
  border-radius: 10px;
  background: #fdfbfd;
  color: #a20eac;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.media-preview {
  padding: 10px;
  display: grid;
  grid-template-columns: 76px 1fr auto;
  align-items: center;
  gap: 12px;
  border: 1px solid #e9e2e7;
  border-radius: 10px;
}

.media-preview img {
  width: 76px;
  height: 55px;
  border-radius: 7px;
  object-fit: cover;
}

.media-preview strong,
.media-preview span {
  display: block;
}

.media-preview strong {
  color: #494148;
  font-size: 12px;
}

.media-preview span {
  margin-top: 4px;
  color: #938991;
  font-size: 10px;
}

.media-preview button {
  border: 0;
  background: transparent;
  color: #a20eac;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.save-success,
.save-error {
  margin: 12px 0 0;
  font-size: 11px;
  text-align: center;
}

.save-success {
  color: #328462;
}

.save-error {
  color: #b94a55;
}

.loading-state,
.error-state {
  min-height: 300px;
  display: grid;
  place-items: center;
  border: 1px solid #ebe5ea;
  border-radius: 17px;
  background: white;
  color: #80777f;
  font-size: 14px;
}

.error-state {
  align-content: center;
  gap: 8px;
}

.error-state strong {
  color: #a3434d;
}

.error-state button {
  margin-top: 10px;
  min-height: 38px;
  padding: 0 14px;
  border: 1px solid #e2d9df;
  border-radius: 8px;
  background: white;
  cursor: pointer;
}

@media (max-width: 1050px) {
  .editor-layout {
    grid-template-columns: 1fr;
  }

  .sticky-panel {
    position: static;
  }
}

@media (max-width: 700px) {
  .editor-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .editor-header h1 {
    font-size: 34px;
  }

  .two-column {
    grid-template-columns: 1fr;
  }
}
</style>