<template>
  <div class="trust-page">
    <header class="page-header">
      <div>
        <span class="eyebrow">
          SOCIAL PROOF
        </span>

        <h1>Trust Content</h1>

        <p>
          Manage traveller testimonials, awards,
          memberships and professional credentials.
        </p>
      </div>

      <button
        class="primary-btn"
        @click="openCreate"
      >
        {{
          activeTab === 'testimonials'
            ? '+ New Testimonial'
            : '+ New Certificate'
        }}
      </button>
    </header>

    <section class="summary-grid">
      <article>
        <span>TESTIMONIALS</span>
        <strong>{{ testimonials.length }}</strong>
      </article>

      <article>
        <span>FEATURED</span>
        <strong>{{ featuredTestimonials }}</strong>
      </article>

      <article>
        <span>CREDENTIALS</span>
        <strong>{{ certificates.length }}</strong>
      </article>

      <article>
        <span>PUBLISHED</span>
        <strong>{{ publishedTotal }}</strong>
      </article>
    </section>

    <nav class="tabs">
      <button
        :class="{
          active:
            activeTab === 'testimonials',
        }"
        @click="
          activeTab = 'testimonials'
        "
      >
        Traveller Testimonials
        <span>{{ testimonials.length }}</span>
      </button>

      <button
        :class="{
          active:
            activeTab === 'certificates',
        }"
        @click="
          activeTab = 'certificates'
        "
      >
        Awards & Credentials
        <span>{{ certificates.length }}</span>
      </button>
    </nav>

    <div
      v-if="loading"
      class="state"
    >
      Loading trust content...
    </div>

    <div
      v-else-if="error"
      class="state error"
    >
      {{ error }}
    </div>

    <!-- TESTIMONIALS -->
    <section
      v-else-if="
        activeTab === 'testimonials'
      "
      class="content-card"
    >
      <div
        v-if="!testimonials.length"
        class="empty"
      >
        <strong>
          No testimonials yet
        </strong>

        <p>
          Add genuine traveller stories
          and feedback.
        </p>
      </div>

      <div
        v-else
        class="trust-list"
      >
        <article
          v-for="item in testimonials"
          :key="item._id"
          class="trust-row testimonial-row"
        >
          <div class="avatar">
            <img
              v-if="imageUrl(item.image)"
              :src="imageUrl(item.image)"
              :alt="item.name"
            >

            <span v-else>
              {{
                item.name
                  .charAt(0)
                  .toUpperCase()
              }}
            </span>
          </div>

          <div class="main-info">
            <div class="title-line">
              <strong>{{ item.name }}</strong>

              <span
                v-if="item.isFeatured"
                class="featured"
              >
                Featured
              </span>
            </div>

            <span class="meta">
              {{
                [
                  item.country,
                  item.journey,
                ]
                  .filter(Boolean)
                  .join(' · ') || '—'
              }}
            </span>

            <p>
              “{{ item.quote }}”
            </p>
          </div>

          <div class="rating">
            <span>RATING</span>
            <strong>
              {{ item.rating || '—' }}
              <small v-if="item.rating">
                / 5
              </small>
            </strong>
          </div>

          <div>
            <span
              class="status"
              :class="
                item.isPublished
                  ? 'published'
                  : 'draft'
              "
            >
              {{
                item.isPublished
                  ? 'Published'
                  : 'Draft'
              }}
            </span>
          </div>

          <div class="actions">
            <button
              @click="
                editTestimonial(item)
              "
            >
              Edit
            </button>

            <button
              class="delete"
              @click="
                removeTestimonial(item)
              "
            >
              Delete
            </button>
          </div>
        </article>
      </div>
    </section>

    <!-- CERTIFICATES -->
    <section
      v-else
      class="content-card"
    >
      <div
        v-if="!certificates.length"
        class="empty"
      >
        <strong>
          No credentials yet
        </strong>

        <p>
          Add awards, memberships and
          professional certificates.
        </p>
      </div>

      <div
        v-else
        class="trust-list"
      >
        <article
          v-for="item in certificates"
          :key="item._id"
          class="trust-row certificate-row"
        >
          <div class="credential-image">
            <img
              v-if="imageUrl(item.image)"
              :src="imageUrl(item.image)"
              :alt="item.title"
            >
          </div>

          <div class="main-info">
            <div class="title-line">
              <strong>
                {{ item.title }}
              </strong>

              <span class="type-badge">
                {{ formatType(item.type) }}
              </span>
            </div>

            <span class="meta">
              {{ item.organization || '—' }}
            </span>

            <p v-if="item.description">
              {{ item.description }}
            </p>
          </div>

          <div>
            <span
              class="status"
              :class="
                item.isPublished
                  ? 'published'
                  : 'draft'
              "
            >
              {{
                item.isPublished
                  ? 'Published'
                  : 'Draft'
              }}
            </span>
          </div>

          <div class="order">
            <span>ORDER</span>
            <strong>
              {{ item.sortOrder ?? 0 }}
            </strong>
          </div>

          <div class="actions">
            <button
              @click="
                editCertificate(item)
              "
            >
              Edit
            </button>

            <button
              class="delete"
              @click="
                removeCertificate(item)
              "
            >
              Delete
            </button>
          </div>
        </article>
      </div>
    </section>

    <ClientOnly>
      <TestimonialFormModal
        :open="testimonialModalOpen"
        :testimonial="
          editingTestimonial
        "
        @close="closeTestimonial"
        @saved="testimonialSaved"
      />

      <CertificateFormModal
        :open="certificateModalOpen"
        :certificate="
          editingCertificate
        "
        @close="closeCertificate"
        @saved="certificateSaved"
      />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import TestimonialFormModal from '~/components/trust/TestimonialFormModal.vue'
import CertificateFormModal from '~/components/trust/CertificateFormModal.vue'

import type {
  Testimonial,
  Certificate,
} from '~/composables/useTrustContent'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const {
  testimonials,
  certificates,
  loading,
  error,
  fetchTestimonials,
  fetchTestimonial,
  deleteTestimonial,
  fetchCertificates,
  fetchCertificate,
  deleteCertificate,
} = useTrustContent()

const activeTab =
  ref<'testimonials' | 'certificates'>(
    'testimonials',
  )

const testimonialModalOpen = ref(false)
const certificateModalOpen = ref(false)

const editingTestimonial =
  ref<Testimonial | null>(null)

const editingCertificate =
  ref<Certificate | null>(null)

const featuredTestimonials = computed(
  () =>
    testimonials.value.filter(
      item => item.isFeatured,
    ).length,
)

const publishedTotal = computed(
  () =>
    testimonials.value.filter(
      item => item.isPublished,
    ).length +
    certificates.value.filter(
      item => item.isPublished,
    ).length,
)

const imageUrl = (
  value: any,
) => {
  return value &&
    typeof value === 'object'
    ? value.url || ''
    : ''
}

const formatType = (
  value: string,
) => {
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char =>
      char.toUpperCase(),
    )
}

const openCreate = () => {
  if (
    activeTab.value ===
    'testimonials'
  ) {
    editingTestimonial.value = null
    testimonialModalOpen.value = true
  } else {
    editingCertificate.value = null
    certificateModalOpen.value = true
  }
}

const editTestimonial = async (
  item: Testimonial,
) => {
  try {
    editingTestimonial.value =
      await fetchTestimonial(item._id)

    testimonialModalOpen.value = true
  } catch (err) {
    console.error(err)
  }
}

const editCertificate = async (
  item: Certificate,
) => {
  try {
    editingCertificate.value =
      await fetchCertificate(item._id)

    certificateModalOpen.value = true
  } catch (err) {
    console.error(err)
  }
}

const closeTestimonial = () => {
  testimonialModalOpen.value = false
  editingTestimonial.value = null
}

const closeCertificate = () => {
  certificateModalOpen.value = false
  editingCertificate.value = null
}

const testimonialSaved = async () => {
  closeTestimonial()
  await fetchTestimonials()
}

const certificateSaved = async () => {
  closeCertificate()
  await fetchCertificates()
}

const removeTestimonial = async (
  item: Testimonial,
) => {
  if (
    !window.confirm(
      `Delete testimonial from "${item.name}"?`,
    )
  ) {
    return
  }

  try {
    await deleteTestimonial(item._id)
    await fetchTestimonials()
  } catch (err: any) {
    window.alert(
      err?.data?.message ||
      'Unable to delete testimonial.',
    )
  }
}

const removeCertificate = async (
  item: Certificate,
) => {
  if (
    !window.confirm(
      `Delete "${item.title}"?`,
    )
  ) {
    return
  }

  try {
    await deleteCertificate(item._id)
    await fetchCertificates()
  } catch (err: any) {
    window.alert(
      err?.data?.message ||
      'Unable to delete credential.',
    )
  }
}

onMounted(async () => {
  try {
    await Promise.all([
      fetchTestimonials(),
      fetchCertificates(),
    ])
  } catch {
    // composable handles error
  }
})
</script>

<style scoped>
.trust-page {
  width: 100%;
}

.page-header {
  margin-bottom: 26px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
}

.eyebrow {
  display: block;
  margin-bottom: 8px;
  color: #a20eac;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .15em;
}

.page-header h1 {
  margin: 0;
  color: #211d21;
  font-size: 42px;
  letter-spacing: -.035em;
}

.page-header p {
  max-width: 620px;
  margin: 9px 0 0;
  color: #80777f;
  font-size: 14px;
  line-height: 1.6;
}

.primary-btn {
  min-height: 42px;
  padding: 0 16px;
  border: 0;
  border-radius: 9px;
  background: var(--brand-gradient);
  color: #fff;
  font: inherit;
  font-size: 13px;
  font-weight: 750;
  cursor: pointer;
}

.summary-grid {
  margin-bottom: 17px;
  display: grid;
  grid-template-columns:
    repeat(4, 1fr);
  gap: 11px;
}

.summary-grid article {
  padding: 18px;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: #fff;
}

.summary-grid span {
  color: #928890;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .09em;
}

.summary-grid strong {
  margin-top: 12px;
  display: block;
  color: #2d272c;
  font-size: 28px;
}

.tabs {
  margin-bottom: 13px;
  padding: 5px;
  display: inline-flex;
  gap: 4px;
  border: 1px solid var(--border);
  border-radius: 11px;
  background: #fff;
}

.tabs button {
  min-height: 37px;
  padding: 0 13px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: #766d74;
  font: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.tabs button.active {
  background: #f7eaf5;
  color: #a20eac;
}

.tabs button span {
  margin-left: 6px;
  opacity: .7;
}

.content-card {
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: #fff;
}

.trust-row {
  padding: 15px 17px;
  display: grid;
  align-items: center;
  gap: 15px;
  border-bottom: 1px solid #f0ebef;
}

.testimonial-row {
  grid-template-columns:
    52px
    minmax(300px, 1fr)
    80px
    100px
    120px;
}

.certificate-row {
  grid-template-columns:
    72px
    minmax(300px, 1fr)
    100px
    70px
    120px;
}

.trust-row:last-child {
  border-bottom: 0;
}

.avatar {
  width: 48px;
  height: 48px;
  overflow: hidden;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #f7eaf5;
  color: #a20eac;
  font-weight: 800;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.credential-image {
  width: 68px;
  height: 52px;
  overflow: hidden;
  display: grid;
  place-items: center;
  border: 1px solid #eee7ec;
  border-radius: 8px;
  background: #faf8f9;
}

.credential-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.title-line {
  display: flex;
  align-items: center;
  gap: 7px;
}

.title-line strong {
  color: #40383f;
  font-size: 13px;
}

.meta {
  margin-top: 4px;
  display: block;
  color: #958b93;
  font-size: 10px;
}

.main-info p {
  max-width: 620px;
  margin: 7px 0 0;
  color: #6f666d;
  font-size: 11px;
  line-height: 1.5;
}

.featured,
.type-badge {
  padding: 4px 7px;
  border-radius: 999px;
  background: #f7eaf5;
  color: #a20eac;
  font-size: 8px;
  font-weight: 750;
}

.status {
  padding: 6px 8px;
  display: inline-block;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 750;
}

.status.published {
  background: #edf7f2;
  color: #328462;
}

.status.draft {
  background: #f2eff1;
  color: #776e75;
}

.rating span,
.order span {
  display: block;
  color: #9a9098;
  font-size: 8px;
  font-weight: 800;
}

.rating strong,
.order strong {
  margin-top: 4px;
  display: block;
  color: #514950;
  font-size: 13px;
}

.rating small {
  font-size: 9px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 5px;
}

.actions button {
  padding: 7px 9px;
  border: 1px solid #e6dfe4;
  border-radius: 7px;
  background: #fff;
  color: #625960;
  font: inherit;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
}

.actions .delete {
  color: #b94a55;
}

.empty,
.state {
  min-height: 280px;
  display: grid;
  place-items: center;
  align-content: center;
  color: #8f858d;
  text-align: center;
}

.empty strong {
  color: #443d42;
  font-size: 15px;
}

.empty p {
  margin: 6px 0 0;
  font-size: 11px;
}

.state {
  border: 1px solid var(--border);
  border-radius: 14px;
  background: #fff;
  font-size: 13px;
}

.state.error {
  color: #b94a55;
}

@media (max-width: 1000px) {
  .summary-grid {
    grid-template-columns:
      repeat(2, 1fr);
  }

  .content-card {
    overflow-x: auto;
  }

  .trust-row {
    min-width: 900px;
  }
}
</style>