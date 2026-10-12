<script setup lang="ts">
const props = defineProps<{
  open: boolean
  uploading?: boolean
}>()

const emit = defineEmits<{
  close: []
  upload: [
    payload: {
      file: File
      altText: string
    },
  ]
}>()

const file = ref<File | null>(null)
const altText = ref('')
const dragging = ref(false)
const input = ref<HTMLInputElement | null>(null)
const previewUrl = ref<string | null>(null)

const isImage = computed(() =>
  file.value?.type.startsWith('image/'),
)

const reset = () => {
  file.value = null
  altText.value = ''
  dragging.value = false

  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = null
  }
}

const selectFile = (selected?: File) => {
  if (!selected) return

  file.value = selected

  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }

  previewUrl.value =
    URL.createObjectURL(selected)
}

const handleInput = (event: Event) => {
  const target =
    event.target as HTMLInputElement

  selectFile(target.files?.[0])
}

const handleDrop = (event: DragEvent) => {
  dragging.value = false

  selectFile(
    event.dataTransfer?.files?.[0],
  )
}

const close = () => {
  if (props.uploading) return

  reset()
  emit('close')
}

const submit = () => {
  if (!file.value) return

  emit('upload', {
    file: file.value,
    altText: altText.value,
  })
}

watch(
  () => props.open,
  (open) => {
    if (!open) reset()
  },
)

onBeforeUnmount(reset)
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="modal-backdrop"
        @click.self="close"
      >
        <section class="upload-modal">
          <header class="modal-header">
            <div>
              <p>MEDIA LIBRARY</p>

              <h2>Upload visual</h2>
            </div>

            <button
              type="button"
              class="close-button"
              :disabled="uploading"
              @click="close"
            >
              ×
            </button>
          </header>

          <p class="intro">
            Add imagery or films to the
            Vedic Journey visual collection.
          </p>

          <input
            ref="input"
            type="file"
            hidden
            accept="
              image/jpeg,
              image/png,
              image/webp,
              image/avif,
              video/mp4,
              video/webm,
              video/quicktime
            "
            @change="handleInput"
          >

          <div
            class="drop-zone"
            :class="{
              dragging,
              selected: file,
            }"
            @click="input?.click()"
            @dragover.prevent="dragging = true"
            @dragleave.prevent="dragging = false"
            @drop.prevent="handleDrop"
          >
            <template v-if="file">
              <img
                v-if="isImage && previewUrl"
                :src="previewUrl"
                alt=""
                class="selected-preview"
              >

              <video
                v-else-if="previewUrl"
                :src="previewUrl"
                class="selected-preview"
                muted
              />

              <div class="selected-overlay">
                <strong>{{ file.name }}</strong>

                <span>
                  Click to choose another file
                </span>
              </div>
            </template>

            <template v-else>
              <div class="upload-symbol">
                ↑
              </div>

              <strong>
                Drop your visual here
              </strong>

              <p>
                or click to choose from
                your computer
              </p>

              <span class="formats">
                JPEG · PNG · WEBP · AVIF ·
                MP4 · WEBM
              </span>
            </template>
          </div>

          <div class="field">
            <label for="media-alt">
              Alternative text
            </label>

            <input
              id="media-alt"
              v-model="altText"
              type="text"
              placeholder="
                e.g. Himalayan valley at sunrise
              "
            >

            <small>
              Describe the visual for
              accessibility and SEO.
            </small>
          </div>

          <footer class="modal-footer">
            <button
              type="button"
              class="cancel-button"
              :disabled="uploading"
              @click="close"
            >
              Cancel
            </button>

            <button
              type="button"
              class="upload-button"
              :disabled="!file || uploading"
              @click="submit"
            >
              {{
                uploading
                  ? 'Uploading...'
                  : 'Upload visual'
              }}

              <span v-if="!uploading">
                →
              </span>
            </button>
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  z-index: 1000;
  inset: 0;
  display: grid;
  padding: 24px;
  overflow-y: auto;
  place-items: center;
  background: rgba(10, 7, 10, 0.68);
  backdrop-filter: blur(7px);
}

.upload-modal {
  width: min(100%, 560px);
  padding: 28px;
  border: 1px solid
    rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  background: #fff;
  box-shadow:
    0 35px 90px rgba(15, 5, 14, 0.28);
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.modal-header p {
  margin: 0 0 8px;
  color: var(--brand-dark);
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.2em;
}

.modal-header h2 {
  margin: 0;
  font-family: Georgia, serif;
  font-size: 29px;
  font-weight: 400;
}

.close-button {
  display: grid;
  width: 34px;
  height: 34px;
  padding: 0;
  border: 1px solid var(--border);
  border-radius: 9px;
  place-items: center;
  background: #fff;
  color: var(--muted);
  cursor: pointer;
  font-size: 19px;
}

.intro {
  margin: 10px 0 23px;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.65;
}

.drop-zone {
  position: relative;
  display: flex;
  min-height: 245px;
  padding: 28px;
  overflow: hidden;
  border: 1px dashed #d9ced6;
  border-radius: 15px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  cursor: pointer;
  background:
    linear-gradient(
      145deg,
      #fcfafb,
      #f8f4f7
    );
  text-align: center;
  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    transform 0.2s ease;
}

.drop-zone:hover,
.drop-zone.dragging {
  border-color: var(--brand);
  background: #fff8fd;
}

.drop-zone.dragging {
  transform: scale(0.99);
}

.upload-symbol {
  display: grid;
  width: 46px;
  height: 46px;
  margin-bottom: 16px;
  border-radius: 13px;
  place-items: center;
  background: var(--brand-gradient);
  color: white;
  font-size: 19px;
  box-shadow:
    0 10px 24px
    rgba(181, 12, 169, 0.18);
}

.drop-zone strong {
  color: var(--text);
  font-size: 12px;
}

.drop-zone p {
  margin: 7px 0 18px;
  color: var(--muted);
  font-size: 10px;
}

.formats {
  color: #a59ca3;
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 0.08em;
}

.selected-preview {
  position: absolute;
  width: 100%;
  height: 100%;
  inset: 0;
  object-fit: cover;
}

.selected-overlay {
  position: absolute;
  inset: auto 12px 12px;
  z-index: 2;
  padding: 12px 14px;
  border-radius: 10px;
  background: rgba(12, 8, 11, 0.72);
  color: white;
  backdrop-filter: blur(9px);
}

.selected-overlay strong,
.selected-overlay span {
  display: block;
}

.selected-overlay strong {
  overflow: hidden;
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.selected-overlay span {
  margin-top: 4px;
  color: rgba(255, 255, 255, 0.62);
  font-size: 8px;
}

.field {
  margin-top: 22px;
}

.field label {
  display: block;
  margin-bottom: 8px;
  color: var(--text);
  font-size: 10px;
  font-weight: 650;
}

.field input {
  width: 100%;
  height: 48px;
  padding: 0 14px;
  border: 1px solid var(--border);
  border-radius: 10px;
  outline: none;
  color: var(--text);
  font: inherit;
  font-size: 11px;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.field input:focus {
  border-color:
    rgba(216, 11, 185, 0.5);
  box-shadow:
    0 0 0 4px
    rgba(216, 11, 185, 0.055);
}

.field small {
  display: block;
  margin-top: 7px;
  color: var(--muted);
  font-size: 8px;
}

.modal-footer {
  display: flex;
  margin-top: 27px;
  justify-content: flex-end;
  gap: 9px;
}

.cancel-button,
.upload-button {
  min-height: 42px;
  padding: 0 17px;
  border-radius: 9px;
  cursor: pointer;
  font-size: 10px;
  font-weight: 650;
}

.cancel-button {
  border: 1px solid var(--border);
  background: white;
  color: var(--text);
}

.upload-button {
  display: flex;
  border: 0;
  align-items: center;
  gap: 16px;
  background: var(--brand-gradient);
  color: white;
  box-shadow:
    0 9px 22px
    rgba(172, 12, 163, 0.17);
}

.upload-button:disabled,
.cancel-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-active .upload-modal,
.modal-leave-active .upload-modal {
  transition:
    transform 0.3s
    cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .upload-modal,
.modal-leave-to .upload-modal {
  opacity: 0;
  transform:
    translateY(12px)
    scale(0.975);
}

@media (max-width: 600px) {
  .modal-backdrop {
    padding: 12px;
    align-items: end;
  }

  .upload-modal {
    padding: 22px 18px;
    border-radius: 19px 19px 10px 10px;
  }

  .drop-zone {
    min-height: 210px;
  }

  .modal-footer {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .upload-button {
    justify-content: space-between;
  }
}
</style>