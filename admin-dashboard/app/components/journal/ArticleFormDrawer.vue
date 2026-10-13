<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="open" class="drawer-shell">
        <div
          class="backdrop"
          @click="$emit('close')"
        />

        <aside class="drawer">
          <header class="drawer-header">
            <div>
              <span class="eyebrow">
                JOURNAL
              </span>

              <h2>
                {{
                  article
                    ? 'Edit Article'
                    : 'New Article'
                }}
              </h2>

              <p>
                {{
                  article
                    ? 'Update journal content and publishing settings.'
                    : 'Create a new Vedic Journey journal article.'
                }}
              </p>
            </div>

            <button
              type="button"
              class="close-btn"
              @click="$emit('close')"
            >
              ×
            </button>
          </header>

          <div class="drawer-body">
            <!-- BASIC -->
            <section class="panel">
              <div class="panel-heading">
                <span>01</span>

                <div>
                  <h3>Article Details</h3>
                  <p>
                    Basic information used throughout
                    the journal.
                  </p>
                </div>
              </div>

              <div class="field">
                <label>Title *</label>

                <input
                  v-model="form.title"
                  type="text"
                  maxlength="200"
                  placeholder="Article title"
                  @input="handleTitleInput"
                />
              </div>

              <div class="field">
                <label>Slug *</label>

                <input
                  v-model="form.slug"
                  type="text"
                  maxlength="220"
                  placeholder="article-slug"
                />
              </div>

              <div class="two-column">
                <div class="field">
                  <label>Category *</label>

                  <select v-model="form.category">
                    <option value="">
                      Select category
                    </option>

                    <option
                      v-for="category in categories"
                      :key="category._id"
                      :value="category._id"
                    >
                      {{ category.name }}
                    </option>
                  </select>
                </div>

                <div class="field">
                  <label>Author</label>

                  <input
                    v-model="form.author"
                    type="text"
                    maxlength="100"
                    placeholder="Author name"
                  />
                </div>
              </div>

              <div class="field">
                <div class="label-row">
                  <label>Excerpt</label>

                  <span>
                    {{ form.excerpt.length }}/800
                  </span>
                </div>

                <textarea
                  v-model="form.excerpt"
                  rows="4"
                  maxlength="800"
                  placeholder="Short introduction shown on journal cards..."
                />
              </div>
            </section>

            <!-- CONTENT -->
            <section class="panel">
              <div class="panel-heading">
                <span>02</span>

                <div>
                  <h3>Article Content</h3>
                  <p>
                    Main editorial content of the article.
                  </p>
                </div>
              </div>

              <div class="field">
                <label>Content</label>

                <textarea
                  v-model="form.content"
                  class="content-editor"
                  rows="18"
                  maxlength="100000"
                  placeholder="Write the article content..."
                />
              </div>

              <p class="field-note">
                Rich-text editing can be introduced later
                if required by the final journal design.
              </p>
            </section>

            <!-- COVER -->
            <section class="panel">
              <div class="panel-heading">
                <span>03</span>

                <div>
                  <h3>Cover Image</h3>
                  <p>
                    Primary visual for this journal article.
                  </p>
                </div>
              </div>

              <div
                v-if="selectedCover"
                class="media-preview"
              >
                <img
                  :src="selectedCover.url"
                  :alt="
                    selectedCover.altText ||
                    form.title
                  "
                />

                <div class="media-info">
                  <strong>Cover Image</strong>

                  <span>
                    {{
                      selectedCover.altText ||
                      'No alt text'
                    }}
                  </span>
                </div>

                <button
                  type="button"
                  @click="openCoverPicker"
                >
                  Change
                </button>
              </div>

              <button
                v-else
                type="button"
                class="media-select"
                @click="openCoverPicker"
              >
                + Select Cover Image
              </button>

              <p class="field-note">
                Existing image can be changed. Removal is
                not enabled because the current backend
                DTO does not accept null.
              </p>
            </section>

            <!-- PUBLISHING -->
            <section class="panel">
              <div class="panel-heading">
                <span>04</span>

                <div>
                  <h3>Publishing</h3>
                  <p>
                    Control article visibility and
                    featured placement.
                  </p>
                </div>
              </div>

              <div class="toggle-list">
                <label class="toggle-row">
                  <div>
                    <strong>Published</strong>

                    <span>
                      Make this article publicly visible.
                    </span>
                  </div>

                  <input
                    v-model="form.isPublished"
                    type="checkbox"
                  />
                </label>

                <label class="toggle-row">
                  <div>
                    <strong>Featured Article</strong>

                    <span>
                      Highlight this article in featured
                      journal sections.
                    </span>
                  </div>

                  <input
                    v-model="form.isFeatured"
                    type="checkbox"
                  />
                </label>
              </div>

              <div
                v-if="article?.publishedAt"
                class="publication-info"
              >
                <span>FIRST PUBLISHED</span>

                <strong>
                  {{
                    formatDate(
                      article.publishedAt,
                    )
                  }}
                </strong>
              </div>
            </section>

            <!-- SEO -->
            <section class="panel">
              <div class="panel-heading">
                <span>05</span>

                <div>
                  <h3>SEO</h3>
                  <p>
                    Search engine and social sharing
                    metadata.
                  </p>
                </div>
              </div>

              <div class="field">
                <div class="label-row">
                  <label>SEO Title</label>

                  <span>
                    {{ form.seo.title.length }}/70
                  </span>
                </div>

                <input
                  v-model="form.seo.title"
                  type="text"
                  maxlength="70"
                  placeholder="Search result title"
                />
              </div>

              <div class="field">
                <div class="label-row">
                  <label>
                    Meta Description
                  </label>

                  <span>
                    {{
                      form.seo.description.length
                    }}/180
                  </span>
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

                <div
                  v-if="selectedOgImage"
                  class="media-preview compact"
                >
                  <img
                    :src="selectedOgImage.url"
                    :alt="
                      selectedOgImage.altText ||
                      ''
                    "
                  />

                  <div class="media-info">
                    <strong>
                      Social Sharing Image
                    </strong>

                    <span>
                      {{
                        selectedOgImage.altText ||
                        'No alt text'
                      }}
                    </span>
                  </div>

                  <button
                    type="button"
                    @click="openOgPicker"
                  >
                    Change
                  </button>
                </div>

                <button
                  v-else
                  type="button"
                  class="media-select"
                  @click="openOgPicker"
                >
                  + Select OG Image
                </button>
              </div>
            </section>
          </div>

          <footer class="drawer-footer">
            <div>
              <p
                v-if="formError"
                class="form-error"
              >
                {{ formError }}
              </p>
            </div>

            <div class="footer-actions">
              <button
                type="button"
                class="cancel-btn"
                :disabled="saving"
                @click="$emit('close')"
              >
                Cancel
              </button>

              <button
                type="button"
                class="save-btn"
                :disabled="saving"
                @click="saveArticle"
              >
                {{
                  saving
                    ? 'Saving...'
                    : article
                      ? 'Save Changes'
                      : 'Create Article'
                }}
              </button>
            </div>
          </footer>
        </aside>
      </div>
    </Transition>
  </Teleport>

  <ClientOnly>
    <MediaPickerModal
      :open="mediaPickerOpen"
      type="image"
      @close="closeMediaPicker"
      @select="selectMedia"
    />
  </ClientOnly>
</template>

<script setup lang="ts">
import MediaPickerModal from '~/components/media/MediaPickerModal.vue'

import type {
  Article,
  ArticleCategory,
} from '~/composables/useJournal'

interface MediaItem {
  _id: string
  url: string
  altText?: string
}

const props = defineProps<{
  open: boolean
  article?: Article | null
  categories: ArticleCategory[]
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const {
  createArticle,
  updateArticle,
} = useJournal()

const saving = ref(false)
const formError = ref<string | null>(null)

const selectedCover =
  ref<MediaItem | null>(null)

const selectedOgImage =
  ref<MediaItem | null>(null)

const mediaPickerOpen = ref(false)

const mediaTarget =
  ref<'cover' | 'og'>('cover')

const slugManuallyEdited = ref(false)

const form = reactive({
  title: '',
  slug: '',
  category: '',
  author: '',
  excerpt: '',
  content: '',

  coverImage: '',

  isFeatured: false,
  isPublished: false,

  seo: {
    title: '',
    description: '',
    ogImage: '',
  },
})

const slugify = (
  value: string,
) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const handleTitleInput = () => {
  if (
    !props.article &&
    !slugManuallyEdited.value
  ) {
    form.slug = slugify(form.title)
  }
}

watch(
  () => form.slug,
  (value, oldValue) => {
    if (
      props.article ||
      !form.title ||
      value === slugify(form.title) ||
      oldValue === undefined
    ) {
      return
    }

    slugManuallyEdited.value = true
  },
)

const getId = (
  value: any,
) => {
  if (!value) return ''

  return typeof value === 'object'
    ? value._id || ''
    : value
}

const getMedia = (
  value: any,
): MediaItem | null => {
  if (
    value &&
    typeof value === 'object' &&
    value._id &&
    value.url
  ) {
    return {
      _id: value._id,
      url: value.url,
      altText: value.altText,
    }
  }

  return null
}

const resetForm = () => {
  form.title = ''
  form.slug = ''
  form.category = ''
  form.author = ''
  form.excerpt = ''
  form.content = ''
  form.coverImage = ''

  form.isFeatured = false
  form.isPublished = false

  form.seo.title = ''
  form.seo.description = ''
  form.seo.ogImage = ''

  selectedCover.value = null
  selectedOgImage.value = null

  formError.value = null
  slugManuallyEdited.value = false
}

const populateForm = (
  article: Article,
) => {
  form.title = article.title || ''
  form.slug = article.slug || ''

  form.category =
    getId(article.category)

  form.author =
    article.author || ''

  form.excerpt =
    article.excerpt || ''

  form.content =
    article.content || ''

  form.coverImage =
    getId(article.coverImage)

  selectedCover.value =
    getMedia(article.coverImage)

  form.isFeatured =
    article.isFeatured ?? false

  form.isPublished =
    article.isPublished ?? false

  form.seo.title =
    article.seo?.title || ''

  form.seo.description =
    article.seo?.description || ''

  form.seo.ogImage =
    getId(article.seo?.ogImage)

  selectedOgImage.value =
    getMedia(article.seo?.ogImage)

  slugManuallyEdited.value = true
}

watch(
  () => props.open,
  value => {
    if (!value) return

    resetForm()

    if (props.article) {
      populateForm(props.article)
    }
  },
  {
    immediate: true,
  },
)

watch(
  () => props.article,
  value => {
    if (
      props.open &&
      value
    ) {
      resetForm()
      populateForm(value)
    }
  },
)

const openCoverPicker = () => {
  mediaTarget.value = 'cover'
  mediaPickerOpen.value = true
}

const openOgPicker = () => {
  mediaTarget.value = 'og'
  mediaPickerOpen.value = true
}

const closeMediaPicker = () => {
  mediaPickerOpen.value = false
}

const selectMedia = (
  items: MediaItem[],
) => {
  const media = items[0]

  if (!media) return

  if (mediaTarget.value === 'cover') {
    selectedCover.value = media
    form.coverImage = media._id
  } else {
    selectedOgImage.value = media
    form.seo.ogImage = media._id
  }

  mediaPickerOpen.value = false
}

const saveArticle = async () => {
  if (saving.value) return

  if (!form.title.trim()) {
    formError.value =
      'Article title is required.'
    return
  }

  if (!form.slug.trim()) {
    formError.value =
      'Article slug is required.'
    return
  }

  if (!form.category) {
    formError.value =
      'Please select an article category.'
    return
  }

  saving.value = true
  formError.value = null

  try {
    const payload: any = {
      title: form.title.trim(),

      slug:
        slugify(form.slug),

      category:
        form.category,

      excerpt:
        form.excerpt.trim(),

      content:
        form.content,

      author:
        form.author.trim(),

      isFeatured:
        form.isFeatured,

      isPublished:
        form.isPublished,

      seo: {
        title:
          form.seo.title.trim(),

        description:
          form.seo.description.trim(),
      },
    }

    if (form.coverImage) {
      payload.coverImage =
        form.coverImage
    }

    if (form.seo.ogImage) {
      payload.seo.ogImage =
        form.seo.ogImage
    }

    if (props.article?._id) {
      await updateArticle(
        props.article._id,
        payload,
      )
    } else {
      await createArticle(
        payload,
      )
    }

    emit('saved')
  } catch (error: any) {
    formError.value =
      error?.data?.message ||
      error?.message ||
      'Unable to save article.'
  } finally {
    saving.value = false
  }
}

const formatDate = (
  value?: string | null,
) => {
  if (!value) return '—'

  return new Intl.DateTimeFormat(
    'en-IN',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    },
  ).format(new Date(value))
}
</script>

<style scoped>
.drawer-shell {
  position: fixed;
  inset: 0;
  z-index: 10000;
}

.backdrop {
  position: absolute;
  inset: 0;
  background: rgba(13, 11, 14, .58);
  backdrop-filter: blur(4px);
}

.drawer {
  position: absolute;
  top: 0;
  right: 0;
  width: min(720px, 100%);
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f8f6f7;
  box-shadow:
    -25px 0 70px rgba(12, 6, 11, .18);
}

.drawer-header {
  padding: 22px 25px;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  border-bottom: 1px solid #e9e2e7;
  background: #fff;
}

.eyebrow {
  display: block;
  margin-bottom: 6px;
  color: #a20eac;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .14em;
}

.drawer-header h2 {
  margin: 0;
  color: #292329;
  font-size: 24px;
}

.drawer-header p {
  margin: 6px 0 0;
  color: #8b8189;
  font-size: 12px;
}

.close-btn {
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  border: 1px solid #e7dfe5;
  border-radius: 9px;
  background: #fff;
  color: #675e65;
  font-size: 22px;
  cursor: pointer;
}

.drawer-body {
  min-height: 0;
  overflow-y: auto;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.panel {
  padding: 21px;
  border: 1px solid #ebe5ea;
  border-radius: 14px;
  background: #fff;
}

.panel-heading {
  margin-bottom: 19px;
  display: flex;
  gap: 11px;
}

.panel-heading > span {
  width: 30px;
  height: 30px;
  flex: 0 0 30px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: #f9edf7;
  color: #a20eac;
  font-size: 9px;
  font-weight: 800;
}

.panel-heading h3 {
  margin: 0;
  color: #393238;
  font-size: 15px;
}

.panel-heading p {
  margin: 4px 0 0;
  color: #958b93;
  font-size: 11px;
}

.field {
  margin-top: 16px;
}

.field:first-of-type {
  margin-top: 0;
}

.field label {
  margin-bottom: 7px;
  display: block;
  color: #514950;
  font-size: 13px;
  font-weight: 700;
}

.label-row {
  display: flex;
  justify-content: space-between;
}

.label-row span {
  color: #9a9098;
  font-size: 10px;
}

.field input,
.field textarea,
.field select {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #e5dee3;
  border-radius: 8px;
  background: #fff;
  color: #302a2f;
  font: inherit;
  font-size: 13px;
  outline: none;
}

.field input,
.field select {
  height: 42px;
  padding: 0 11px;
}

.field textarea {
  padding: 10px 11px;
  line-height: 1.6;
  resize: vertical;
}

.field input:focus,
.field textarea:focus,
.field select:focus {
  border-color:
    rgba(216, 11, 185, .5);
  box-shadow:
    0 0 0 3px
    rgba(216, 11, 185, .06);
}

.content-editor {
  min-height: 330px;
}

.two-column {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.field-note {
  margin: 9px 0 0;
  color: #9a9098;
  font-size: 10px;
  line-height: 1.5;
}

.media-select {
  width: 100%;
  min-height: 90px;
  border: 1px dashed #d9cdd6;
  border-radius: 10px;
  background: #fdfbfd;
  color: #a20eac;
  font: inherit;
  font-size: 12px;
  font-weight: 750;
  cursor: pointer;
}

.media-preview {
  padding: 10px;
  display: grid;
  grid-template-columns:
    115px 1fr auto;
  align-items: center;
  gap: 12px;
  border: 1px solid #e9e2e7;
  border-radius: 10px;
}

.media-preview.compact {
  grid-template-columns:
    85px 1fr auto;
}

.media-preview img {
  width: 115px;
  height: 76px;
  border-radius: 7px;
  object-fit: cover;
}

.media-preview.compact img {
  width: 85px;
  height: 60px;
}

.media-info {
  min-width: 0;
}

.media-info strong,
.media-info span {
  display: block;
}

.media-info strong {
  color: #494148;
  font-size: 12px;
}

.media-info span {
  margin-top: 4px;
  color: #938991;
  font-size: 10px;
}

.media-preview button {
  border: 0;
  background: transparent;
  color: #a20eac;
  font: inherit;
  font-size: 11px;
  font-weight: 750;
  cursor: pointer;
}

.toggle-list {
  display: grid;
  gap: 8px;
}

.toggle-row {
  padding: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  border-radius: 9px;
  background: #faf8f9;
  cursor: pointer;
}

.toggle-row strong,
.toggle-row span {
  display: block;
}

.toggle-row strong {
  color: #494148;
  font-size: 12px;
}

.toggle-row span {
  margin-top: 4px;
  color: #958b93;
  font-size: 10px;
}

.toggle-row input {
  width: 18px;
  height: 18px;
  accent-color: #b20eaf;
}

.publication-info {
  margin-top: 15px;
  padding-top: 14px;
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #eee8ec;
}

.publication-info span {
  color: #9a9098;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: .09em;
}

.publication-info strong {
  color: #5b5359;
  font-size: 11px;
}

.drawer-footer {
  padding: 14px 20px;
  min-height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  border-top: 1px solid #e9e2e7;
  background: #fff;
}

.footer-actions {
  display: flex;
  gap: 8px;
}

.save-btn,
.cancel-btn {
  min-height: 41px;
  padding: 0 15px;
  border-radius: 8px;
  font: inherit;
  font-size: 12px;
  font-weight: 750;
  cursor: pointer;
}

.save-btn {
  border: 0;
  background:
    linear-gradient(
      135deg,
      #ec12c7,
      #821092
    );
  color: #fff;
}

.cancel-btn {
  border: 1px solid #e4dce2;
  background: #fff;
  color: #625a60;
}

.save-btn:disabled,
.cancel-btn:disabled {
  opacity: .55;
  cursor: wait;
}

.form-error {
  margin: 0;
  color: #b94a55;
  font-size: 11px;
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity .2s ease;
}

.drawer-enter-active .drawer,
.drawer-leave-active .drawer {
  transition: transform .25s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from .drawer,
.drawer-leave-to .drawer {
  transform: translateX(100%);
}

@media (max-width: 650px) {
  .two-column {
    grid-template-columns: 1fr;
  }

  .media-preview,
  .media-preview.compact {
    grid-template-columns: 70px 1fr;
  }

  .media-preview img,
  .media-preview.compact img {
    width: 70px;
    height: 55px;
  }

  .media-preview button {
    grid-column: 1 / -1;
  }
}
</style>