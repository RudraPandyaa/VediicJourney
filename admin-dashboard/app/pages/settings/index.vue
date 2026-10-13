<template>
  <div class="settings-page">
    <header class="page-header">
      <div>
        <span class="eyebrow">
          WEBSITE CONFIGURATION
        </span>

        <h1>Site Settings</h1>

        <p>
          Manage Vedic Journey branding, contact
          information, social profiles, global SEO
          defaults and footer content.
        </p>
      </div>

      <button
        class="save-top"
        :disabled="saving || loading"
        @click="save"
      >
        {{ saving ? 'Saving...' : 'Save Changes' }}
      </button>
    </header>

    <div
      v-if="loading"
      class="state-card"
    >
      Loading site settings...
    </div>

    <div
      v-else-if="loadError"
      class="state-card error-state"
    >
      <strong>Unable to load settings</strong>

      <p>{{ error }}</p>

      <button @click="load">
        Try Again
      </button>
    </div>

    <div
      v-else
      class="settings-layout"
    >
      <main class="settings-content">

        <!-- BRAND -->
        <section class="settings-card">
          <div class="section-heading">
            <div class="section-icon">
              VJ
            </div>

            <div>
              <h2>Brand Identity</h2>

              <p>
                Primary brand assets used across
                the public website.
              </p>
            </div>
          </div>

          <div class="field">
            <label>Website Logo</label>

            <p class="field-help">
              Use the official Vedic Journey logo.
              Transparent PNG or WebP is recommended.
            </p>

            <div
              v-if="selectedLogo"
              class="logo-preview"
            >
              <div class="logo-image">
                <img
                  :src="selectedLogo.url"
                  :alt="
                    selectedLogo.altText ||
                    'Vedic Journey logo'
                  "
                >
              </div>

              <div class="media-info">
                <strong>
                  Current website logo
                </strong>

                <span>
                  Selected from Media Library
                </span>

                <button
                  type="button"
                  @click="openLogoPicker"
                >
                  Change Logo
                </button>
              </div>
            </div>

            <button
              v-else
              type="button"
              class="media-selector"
              @click="openLogoPicker"
            >
              <strong>+ Select Website Logo</strong>

              <span>
                Choose from Media Library
              </span>
            </button>
          </div>
        </section>

        <!-- CONTACT -->
        <section class="settings-card">
          <div class="section-heading">
            <div class="section-number">
              01
            </div>

            <div>
              <h2>Contact Information</h2>

              <p>
                Main contact details shown throughout
                the Vedic Journey website.
              </p>
            </div>
          </div>

          <div class="two-column">
            <div class="field">
              <label>Email Address</label>

              <input
                v-model="form.email"
                type="email"
                placeholder="hello@vedicjourney.com"
              >
            </div>

            <div class="field">
              <label>Phone Number</label>

              <input
                v-model="form.phone"
                type="text"
                placeholder="+91..."
              >
            </div>

            <div class="field">
              <label>WhatsApp Number</label>

              <input
                v-model="form.whatsapp"
                type="text"
                placeholder="+91..."
              >

              <p class="field-help">
                Include country code for international
                travellers.
              </p>
            </div>
          </div>

          <div class="field">
            <label>Office Address</label>

            <textarea
              v-model="form.address"
              rows="4"
              maxlength="500"
              placeholder="Enter business address..."
            />

            <div class="character-count">
              {{ form.address.length }} / 500
            </div>
          </div>
        </section>

        <!-- SOCIAL -->
        <section class="settings-card">
          <div class="section-heading">
            <div class="section-number">
              02
            </div>

            <div>
              <h2>Social Profiles</h2>

              <p>
                Add the full URL for each official
                Vedic Journey social profile.
              </p>
            </div>
          </div>

          <div class="two-column">
            <div class="field">
              <label>Instagram</label>

              <input
                v-model="form.socialLinks.instagram"
                type="url"
                placeholder="https://instagram.com/..."
              >
            </div>

            <div class="field">
              <label>Facebook</label>

              <input
                v-model="form.socialLinks.facebook"
                type="url"
                placeholder="https://facebook.com/..."
              >
            </div>

            <div class="field">
              <label>YouTube</label>

              <input
                v-model="form.socialLinks.youtube"
                type="url"
                placeholder="https://youtube.com/..."
              >
            </div>

            <div class="field">
              <label>LinkedIn</label>

              <input
                v-model="form.socialLinks.linkedin"
                type="url"
                placeholder="https://linkedin.com/..."
              >
            </div>
          </div>
        </section>

        <!-- SEO -->
        <section class="settings-card">
          <div class="section-heading">
            <div class="section-number">
              03
            </div>

            <div>
              <h2>Global SEO Defaults</h2>

              <p>
                Default search and social metadata.
                Individual pages can override these
                values through Page CMS.
              </p>
            </div>
          </div>

          <div class="field">
            <div class="label-row">
              <label>Default SEO Title</label>

              <span
                :class="{
                  warning:
                    form.seo.title.length > 60,
                }"
              >
                {{ form.seo.title.length }} / 70
              </span>
            </div>

            <input
              v-model="form.seo.title"
              type="text"
              maxlength="70"
              placeholder="Vedic Journey | Luxury Travel Redefined"
            >
          </div>

          <div class="field">
            <div class="label-row">
              <label>Default Meta Description</label>

              <span
                :class="{
                  warning:
                    form.seo.description.length > 160,
                }"
              >
                {{ form.seo.description.length }} / 180
              </span>
            </div>

            <textarea
              v-model="form.seo.description"
              rows="4"
              maxlength="180"
              placeholder="Describe Vedic Journey for search engines..."
            />
          </div>

          <div class="field">
            <label>Default Social Share Image</label>

            <p class="field-help">
              Used when a page does not have its own
              Open Graph image.
            </p>

            <div
              v-if="selectedOgImage"
              class="og-preview"
            >
              <img
                :src="selectedOgImage.url"
                :alt="
                  selectedOgImage.altText ||
                  'Social share image'
                "
              >

              <div>
                <strong>
                  Default OG Image
                </strong>

                <span>
                  Recommended ratio 1.91:1
                </span>

                <button
                  type="button"
                  @click="openOgPicker"
                >
                  Change Image
                </button>
              </div>
            </div>

            <button
              v-else
              type="button"
              class="media-selector"
              @click="openOgPicker"
            >
              <strong>
                + Select Social Share Image
              </strong>

              <span>
                Choose from Media Library
              </span>
            </button>
          </div>

          <!-- GOOGLE PREVIEW -->
          <div class="search-preview">
            <span class="preview-label">
              SEARCH PREVIEW
            </span>

            <div class="preview-url">
              vedicjourney.in
            </div>

            <div class="preview-title">
              {{
                form.seo.title ||
                'Vedic Journey | Luxury Travel Redefined'
              }}
            </div>

            <p>
              {{
                form.seo.description ||
                'Your global meta description will appear here.'
              }}
            </p>
          </div>
        </section>

        <!-- FOOTER -->
        <section class="settings-card">
          <div class="section-heading">
            <div class="section-number">
              04
            </div>

            <div>
              <h2>Footer Content</h2>

              <p>
                Global text displayed in the website
                footer.
              </p>
            </div>
          </div>

          <div class="field">
            <div class="label-row">
              <label>Footer Text</label>

              <span>
                {{ form.footerText.length }} / 500
              </span>
            </div>

            <textarea
              v-model="form.footerText"
              rows="5"
              maxlength="500"
              placeholder="Add a short brand statement for the footer..."
            />
          </div>
        </section>
      </main>

      <!-- SIDE PANEL -->
      <aside class="settings-sidebar">
        <section class="side-card">
          <span class="side-eyebrow">
            SETTINGS STATUS
          </span>

          <h3>Website Essentials</h3>

          <div class="check-list">
            <div>
              <span
                class="check"
                :class="{ done: !!selectedLogo }"
              >
                {{ selectedLogo ? '✓' : '·' }}
              </span>

              <span>Brand logo</span>
            </div>

            <div>
              <span
                class="check"
                :class="{ done: !!form.email }"
              >
                {{ form.email ? '✓' : '·' }}
              </span>

              <span>Contact email</span>
            </div>

            <div>
              <span
                class="check"
                :class="{ done: !!form.phone }"
              >
                {{ form.phone ? '✓' : '·' }}
              </span>

              <span>Phone number</span>
            </div>

            <div>
              <span
                class="check"
                :class="{ done: !!form.seo.title }"
              >
                {{ form.seo.title ? '✓' : '·' }}
              </span>

              <span>Global SEO title</span>
            </div>

            <div>
              <span
                class="check"
                :class="{ done: !!form.seo.description }"
              >
                {{
                  form.seo.description
                    ? '✓'
                    : '·'
                }}
              </span>

              <span>Meta description</span>
            </div>

            <div>
              <span
                class="check"
                :class="{ done: !!selectedOgImage }"
              >
                {{ selectedOgImage ? '✓' : '·' }}
              </span>

              <span>Social share image</span>
            </div>
          </div>
        </section>

        <section class="side-card note-card">
          <span class="side-eyebrow">
            SEO NOTE
          </span>

          <h3>Global defaults</h3>

          <p>
            These SEO values act as website-wide
            fallbacks. Page-specific SEO configured
            in Page CMS should take priority on the
            public frontend.
          </p>
        </section>

        <section
          v-if="settings?.updatedAt"
          class="last-updated"
        >
          <span>Last saved</span>

          <strong>
            {{ formatDate(settings.updatedAt) }}
          </strong>
        </section>
      </aside>
    </div>

    <div
      v-if="successMessage"
      class="toast success-toast"
    >
      ✓ {{ successMessage }}
    </div>

    <div
      v-if="saveError"
      class="toast error-toast"
    >
      {{ saveError }}
    </div>

    <ClientOnly>
      <MediaPickerModal
        :open="mediaPickerOpen"
        :title="
          pickerMode === 'logo'
            ? 'Select website logo'
            : 'Select social share image'
        "
        @close="closeMediaPicker"
        @select="selectMedia"
      />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import MediaPickerModal from '~/components/media/MediaPickerModal.vue'

import type {
  MediaItem,
} from '~/composables/useMedia'

import type {
  SettingsMedia,
  UpdateSiteSettingsPayload,
} from '~/composables/useSiteSettings'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const {
  settings,
  loading,
  saving,
  error,
  fetchSettings,
  updateSettings,
} = useSiteSettings()

const loadError = ref(false)
const saveError = ref<string | null>(null)
const successMessage = ref<string | null>(null)

const mediaPickerOpen = ref(false)

const pickerMode =
  ref<'logo' | 'ogImage'>('logo')

const selectedLogo =
  ref<SettingsMedia | null>(null)

const selectedOgImage =
  ref<SettingsMedia | null>(null)

const form = reactive({
  logo: '',

  email: '',
  phone: '',
  whatsapp: '',
  address: '',

  socialLinks: {
    instagram: '',
    facebook: '',
    youtube: '',
    linkedin: '',
  },

  seo: {
    title: '',
    description: '',
    ogImage: '',
  },

  footerText: '',
})

let successTimer:
  ReturnType<typeof setTimeout> | null =
    null

const populate = () => {
  const data = settings.value

  if (!data) return

  form.email = data.email || ''
  form.phone = data.phone || ''
  form.whatsapp = data.whatsapp || ''
  form.address = data.address || ''

  form.socialLinks.instagram =
    data.socialLinks?.instagram || ''

  form.socialLinks.facebook =
    data.socialLinks?.facebook || ''

  form.socialLinks.youtube =
    data.socialLinks?.youtube || ''

  form.socialLinks.linkedin =
    data.socialLinks?.linkedin || ''

  form.seo.title =
    data.seo?.title || ''

  form.seo.description =
    data.seo?.description || ''

  form.footerText =
    data.footerText || ''

  if (
    data.logo &&
    typeof data.logo === 'object'
  ) {
    selectedLogo.value =
      data.logo as SettingsMedia

    form.logo = data.logo._id
  } else {
    selectedLogo.value = null

    form.logo =
      typeof data.logo === 'string'
        ? data.logo
        : ''
  }

  const ogImage =
    data.seo?.ogImage

  if (
    ogImage &&
    typeof ogImage === 'object'
  ) {
    selectedOgImage.value =
      ogImage as SettingsMedia

    form.seo.ogImage =
      ogImage._id
  } else {
    selectedOgImage.value = null

    form.seo.ogImage =
      typeof ogImage === 'string'
        ? ogImage
        : ''
  }
}

const load = async () => {
  loadError.value = false

  try {
    await fetchSettings()
    populate()
  } catch {
    loadError.value = true
  }
}

const openLogoPicker = () => {
  pickerMode.value = 'logo'
  mediaPickerOpen.value = true
}

const openOgPicker = () => {
  pickerMode.value = 'ogImage'
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

  if (pickerMode.value === 'logo') {
    selectedLogo.value =
      media as SettingsMedia

    form.logo = media._id
  } else {
    selectedOgImage.value =
      media as SettingsMedia

    form.seo.ogImage = media._id
  }

  mediaPickerOpen.value = false
}

const cleanUrl = (
  value: string,
) => {
  return value.trim()
}

const save = async () => {
  saveError.value = null
  successMessage.value = null

  const payload: UpdateSiteSettingsPayload = {
    email: form.email.trim(),
    phone: form.phone.trim(),
    whatsapp: form.whatsapp.trim(),
    address: form.address.trim(),

    socialLinks: {
      instagram:
        cleanUrl(form.socialLinks.instagram),

      facebook:
        cleanUrl(form.socialLinks.facebook),

      youtube:
        cleanUrl(form.socialLinks.youtube),

      linkedin:
        cleanUrl(form.socialLinks.linkedin),
    },

    seo: {
      title:
        form.seo.title.trim(),

      description:
        form.seo.description.trim(),
    },

    footerText:
      form.footerText.trim(),
  }

  if (form.logo) {
    payload.logo = form.logo
  }

  if (form.seo.ogImage) {
    payload.seo!.ogImage =
      form.seo.ogImage
  }

  try {
    await updateSettings(payload)

    populate()

    successMessage.value =
      'Site settings saved successfully.'

    if (successTimer) {
      clearTimeout(successTimer)
    }

    successTimer = setTimeout(() => {
      successMessage.value = null
    }, 3000)
  } catch (err: any) {
    saveError.value =
      Array.isArray(err?.data?.message)
        ? err.data.message.join(', ')
        : err?.data?.message ||
          'Unable to save site settings.'
  }
}

const formatDate = (
  value: string,
) => {
  return new Intl.DateTimeFormat(
    'en-IN',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
  ).format(new Date(value))
}

onMounted(load)

onBeforeUnmount(() => {
  if (successTimer) {
    clearTimeout(successTimer)
  }
})
</script>

<style scoped>
.settings-page {
  width: 100%;
  padding-bottom: 60px;
}

/* HEADER */

.page-header {
  margin-bottom: 30px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
}

.eyebrow {
  display: block;
  margin-bottom: 9px;
  color: var(--brand-dark);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: .14em;
}

.page-header h1 {
  margin: 0;
  color: var(--text);
  font-size: 42px;
  font-weight: 700;
  line-height: 1.08;
  letter-spacing: -.035em;
}

.page-header p {
  max-width: 680px;
  margin: 11px 0 0;
  color: var(--muted);
  font-size: 15px;
  line-height: 1.65;
}

.save-top {
  min-height: 46px;
  padding: 0 19px;
  border: 0;
  border-radius: 10px;
  background: var(--brand-gradient);
  box-shadow:
    0 9px 24px rgba(162, 14, 172, .16);
  color: #fff;
  font: inherit;
  font-size: 14px;
  font-weight: 750;
  cursor: pointer;
}

.save-top:disabled {
  opacity: .55;
  cursor: default;
}

/* LAYOUT */

.settings-layout {
  display: grid;
  grid-template-columns:
    minmax(0, 1fr)
    285px;
  align-items: start;
  gap: 18px;
}

.settings-content {
  min-width: 0;
}

/* CARDS */

.settings-card {
  margin-bottom: 16px;
  padding: 25px;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: #fff;
  box-shadow:
    0 8px 28px rgba(35, 15, 32, .035);
}

.section-heading {
  margin-bottom: 24px;
  padding-bottom: 19px;
  display: flex;
  align-items: center;
  gap: 14px;
  border-bottom: 1px solid #f0ebef;
}

.section-icon,
.section-number {
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: #f7eaf5;
  color: var(--brand-dark);
  font-size: 13px;
  font-weight: 800;
}

.section-heading h2 {
  margin: 0;
  color: #373136;
  font-size: 19px;
  font-weight: 700;
  line-height: 1.3;
}

.section-heading p {
  margin: 5px 0 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.5;
}

/* FORM */

.two-column {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 15px;
}

.field {
  margin-bottom: 20px;
}

.field:last-child {
  margin-bottom: 0;
}

.field label {
  margin-bottom: 8px;
  display: block;
  color: #494148;
  font-size: 14px;
  font-weight: 700;
}

.field-help {
  margin: -2px 0 10px;
  color: #8a8088;
  font-size: 13px;
  line-height: 1.5;
}

.field input,
.field textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #e4dde2;
  border-radius: 9px;
  outline: none;
  background: #fff;
  color: var(--text);
  font: inherit;
  font-size: 14px;
  transition:
    border-color .2s ease,
    box-shadow .2s ease;
}

.field input {
  height: 46px;
  padding: 0 13px;
}

.field textarea {
  padding: 12px 13px;
  line-height: 1.65;
  resize: vertical;
}

.field input:focus,
.field textarea:focus {
  border-color: rgba(216, 11, 185, .42);
  box-shadow:
    0 0 0 4px rgba(216, 11, 185, .055);
}

.field input::placeholder,
.field textarea::placeholder {
  color: #aaa1a8;
}

.label-row {
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.label-row label {
  margin: 0;
}

.label-row span,
.character-count {
  color: #8d838b;
  font-size: 12px;
  font-weight: 600;
}

.label-row span.warning {
  color: var(--warning);
}

.character-count {
  margin-top: 6px;
  text-align: right;
}

/* MEDIA */

.logo-preview,
.og-preview {
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 18px;
  border: 1px solid #e9e2e7;
  border-radius: 12px;
  background: #faf8f9;
}

.logo-image {
  width: 170px;
  height: 90px;
  padding: 12px;
  box-sizing: border-box;
  display: grid;
  place-items: center;
  border: 1px solid #ece5ea;
  border-radius: 10px;
  background: #fff;
}

.logo-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.media-info strong,
.media-info span,
.og-preview strong,
.og-preview span {
  display: block;
}

.media-info strong,
.og-preview strong {
  color: #40383e;
  font-size: 14px;
  font-weight: 700;
}

.media-info span,
.og-preview span {
  margin-top: 5px;
  color: var(--muted);
  font-size: 13px;
}

.media-info button,
.og-preview button {
  margin-top: 11px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--brand-dark);
  font: inherit;
  font-size: 13px;
  font-weight: 750;
  cursor: pointer;
}

.og-preview img {
  width: 190px;
  height: 100px;
  border-radius: 9px;
  object-fit: cover;
  background: #eee;
}

.media-selector {
  width: 100%;
  min-height: 105px;
  padding: 18px;
  border: 1px dashed #d8cbd5;
  border-radius: 11px;
  background: #fcfafb;
  color: var(--brand-dark);
  font: inherit;
  cursor: pointer;
}

.media-selector strong,
.media-selector span {
  display: block;
}

.media-selector strong {
  font-size: 14px;
  font-weight: 750;
}

.media-selector span {
  margin-top: 6px;
  color: var(--muted);
  font-size: 13px;
}

/* SEARCH PREVIEW */

.search-preview {
  margin-top: 8px;
  padding: 19px;
  border: 1px solid #e8e2e6;
  border-radius: 12px;
  background: #fafafa;
}

.preview-label {
  display: block;
  margin-bottom: 15px;
  color: #7f747c;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .09em;
}

.preview-url {
  color: #33745a;
  font-size: 13px;
  line-height: 1.4;
}

.preview-title {
  margin-top: 5px;
  color: #3158a6;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.35;
}

.search-preview p {
  max-width: 650px;
  margin: 6px 0 0;
  color: #5d565b;
  font-size: 13px;
  line-height: 1.55;
}

/* SIDEBAR */

.settings-sidebar {
  position: sticky;
  top: 20px;
}

.side-card {
  margin-bottom: 13px;
  padding: 20px;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: #fff;
}

.side-eyebrow {
  color: var(--brand-dark);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .1em;
}

.side-card h3 {
  margin: 8px 0 17px;
  color: #40383e;
  font-size: 17px;
  font-weight: 700;
}

.check-list {
  display: grid;
  gap: 13px;
}

.check-list > div {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #625960;
  font-size: 13px;
  font-weight: 550;
}

.check {
  width: 24px;
  height: 24px;
  flex: 0 0 24px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #f1edef;
  color: #968b93;
  font-size: 13px;
  font-weight: 800;
}

.check.done {
  background: #edf7f2;
  color: var(--success);
}

.note-card {
  background:
    linear-gradient(
      145deg,
      #fff 0%,
      #fcf7fb 100%
    );
}

.note-card h3 {
  margin-bottom: 8px;
}

.note-card p {
  margin: 0;
  color: #756b73;
  font-size: 13px;
  line-height: 1.65;
}

.last-updated {
  padding: 15px 18px;
  border-radius: 12px;
  background: #f1edef;
}

.last-updated span,
.last-updated strong {
  display: block;
}

.last-updated span {
  color: #8b8189;
  font-size: 12px;
}

.last-updated strong {
  margin-top: 4px;
  color: #625960;
  font-size: 13px;
}

/* STATES */

.state-card {
  min-height: 300px;
  padding: 30px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 8px;
  border: 1px solid var(--border);
  border-radius: 15px;
  background: #fff;
  color: var(--muted);
  font-size: 14px;
  text-align: center;
}

.state-card strong {
  color: #40383e;
  font-size: 17px;
}

.state-card p {
  margin: 0;
  font-size: 14px;
}

.state-card button {
  margin-top: 8px;
  min-height: 40px;
  padding: 0 15px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: #fff;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.error-state,
.error-state p {
  color: var(--danger);
}

/* TOAST */

.toast {
  position: fixed;
  z-index: 30000;
  right: 28px;
  bottom: 28px;
  max-width: 390px;
  padding: 14px 18px;
  border-radius: 10px;
  box-shadow:
    0 14px 40px rgba(20, 8, 18, .16);
  font-size: 14px;
  font-weight: 650;
  line-height: 1.4;
}

.success-toast {
  border: 1px solid #cfe6da;
  background: #f0faf5;
  color: #2d7354;
}

.error-toast {
  border: 1px solid #efd3d6;
  background: #fff6f7;
  color: var(--danger);
}

/* RESPONSIVE */

@media (max-width: 1100px) {
  .settings-layout {
    grid-template-columns: 1fr;
  }

  .settings-sidebar {
    position: static;
    display: grid;
    grid-template-columns:
      repeat(2, 1fr);
    gap: 13px;
  }

  .settings-sidebar .side-card {
    margin-bottom: 0;
  }

  .last-updated {
    grid-column: 1 / -1;
  }
}

@media (max-width: 700px) {
  .page-header {
    align-items: stretch;
    flex-direction: column;
  }

  .page-header h1 {
    font-size: 34px;
  }

  .save-top {
    width: 100%;
  }

  .settings-card {
    padding: 19px;
  }

  .two-column,
  .settings-sidebar {
    grid-template-columns: 1fr;
  }

  .last-updated {
    grid-column: auto;
  }

  .logo-preview,
  .og-preview {
    align-items: flex-start;
    flex-direction: column;
  }

  .logo-image,
  .og-preview img {
    width: 100%;
  }

  .toast {
    right: 15px;
    bottom: 15px;
    left: 15px;
    max-width: none;
  }
}
</style>