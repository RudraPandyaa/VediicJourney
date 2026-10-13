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
            <span>TRUST CREDENTIAL</span>

            <h2>
              {{
                certificate
                  ? 'Edit Credential'
                  : 'New Credential'
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
          <div class="field">
            <label>Title *</label>

            <input
              v-model="form.title"
              maxlength="200"
            >
          </div>

          <div class="two">
            <div class="field">
              <label>Type *</label>

              <select v-model="form.type">
                <option value="certificate">
                  Certificate
                </option>

                <option value="award">
                  Award
                </option>

                <option value="membership">
                  Membership
                </option>

                <option value="association">
                  Association
                </option>
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
            <label>Organization</label>

            <input
              v-model="form.organization"
              maxlength="200"
            >
          </div>

          <div class="field">
            <label>Description</label>

            <textarea
              v-model="form.description"
              rows="5"
              maxlength="1000"
            />
          </div>

          <div class="field">
            <label>External URL</label>

            <input
              v-model="form.externalUrl"
              type="url"
              placeholder="https://..."
            >
          </div>

          <div class="field">
            <label>
              Credential Image / Logo *
            </label>

            <div
              v-if="selectedImage"
              class="media-preview"
            >
              <img
                :src="selectedImage.url"
                :alt="
                  selectedImage.altText ||
                  form.title
                "
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
              + Select Credential Image
            </button>
          </div>

          <label class="publish-row">
            <div>
              <strong>Published</strong>
              <span>
                Show this credential publicly.
              </span>
            </div>

            <input
              v-model="form.isPublished"
              type="checkbox"
            >
          </label>

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
                : certificate
                  ? 'Save Changes'
                  : 'Create Credential'
            }}
          </button>
        </footer>
      </section>
    </div>
  </Teleport>

  <ClientOnly>
    <MediaPickerModal
      :open="pickerOpen"
      title="Select credential image"
      @close="pickerOpen = false"
      @select="selectImage"
    />
  </ClientOnly>
</template>

<script setup lang="ts">
import MediaPickerModal from '~/components/media/MediaPickerModal.vue'
import type { MediaItem } from '~/composables/useMedia'

import type {
  Certificate,
  CertificateType,
} from '~/composables/useTrustContent'

const props = defineProps<{
  open: boolean
  certificate?: Certificate | null
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const {
  createCertificate,
  updateCertificate,
} = useTrustContent()

const pickerOpen = ref(false)
const selectedImage =
  ref<MediaItem | null>(null)

const saving = ref(false)
const formError = ref<string | null>(null)

const form = reactive({
  title: '',
  type:
    'certificate' as CertificateType,
  organization: '',
  description: '',
  image: '',
  externalUrl: '',
  sortOrder: 0,
  isPublished: true,
})

const reset = () => {
  form.title = ''
  form.type = 'certificate'
  form.organization = ''
  form.description = ''
  form.image = ''
  form.externalUrl = ''
  form.sortOrder = 0
  form.isPublished = true

  selectedImage.value = null
  formError.value = null
}

const populate = (
  item: Certificate,
) => {
  form.title = item.title
  form.type = item.type
  form.organization =
    item.organization || ''
  form.description =
    item.description || ''
  form.externalUrl =
    item.externalUrl || ''
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

    if (props.certificate) {
      populate(props.certificate)
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
  if (!form.title.trim()) {
    formError.value =
      'Credential title is required.'
    return
  }

  if (!form.image) {
    formError.value =
      'Credential image is required.'
    return
  }

  saving.value = true
  formError.value = null

  try {
    const payload: any = {
      title: form.title.trim(),
      type: form.type,
      organization:
        form.organization.trim(),
      description:
        form.description.trim(),
      image: form.image,
      sortOrder:
        Number(form.sortOrder) || 0,
      isPublished:
        form.isPublished,
    }

    if (form.externalUrl.trim()) {
      payload.externalUrl =
        form.externalUrl.trim()
    }

    if (props.certificate?._id) {
      await updateCertificate(
        props.certificate._id,
        payload,
      )
    } else {
      await createCertificate(payload)
    }

    emit('saved')
  } catch (err: any) {
    formError.value =
      err?.data?.message ||
      'Unable to save credential.'
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
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 13px;
  border: 1px solid var(--border);
  border-radius: 9px;
}

.media-preview img {
  width: 95px;
  height: 70px;
  object-fit: contain;
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
  min-height: 80px;
  border: 1px dashed #d9cdd6;
  border-radius: 9px;
}

.publish-row {
  padding: 13px;
  display: flex;
  justify-content: space-between;
  border-radius: 8px;
  background: #faf8f9;
}

.publish-row strong,
.publish-row span {
  display: block;
}

.publish-row strong {
  font-size: 12px;
}

.publish-row span {
  margin-top: 3px;
  color: var(--muted);
  font-size: 10px;
}

.publish-row input {
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