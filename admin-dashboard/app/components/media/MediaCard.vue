<script setup lang="ts">
import type { MediaItem } from '../../composables/useMedia'

const props = defineProps<{
  item: MediaItem
  deleting?: boolean
}>()

const emit = defineEmits<{
  delete: [item: MediaItem]
}>()

const formatSize = (bytes: number) => {
  if (!bytes) return '0 KB'

  const mb = bytes / 1024 / 1024

  return mb >= 1
    ? `${mb.toFixed(1)} MB`
    : `${Math.round(bytes / 1024)} KB`
}

const dimensions = computed(() => {
  if (!props.item.width || !props.item.height) {
    return ''
  }

  return `${props.item.width} × ${props.item.height}`
})
</script>

<template>
  <article class="media-card">
    <div class="preview">
      <img
        v-if="item.type === 'image'"
        :src="item.url"
        :alt="item.altText || item.filename"
        loading="lazy"
      >

      <video
        v-else
        :src="item.url"
        preload="metadata"
        muted
      />

      <span class="type-badge">
        {{ item.type }}
      </span>

      <div
        v-if="item.type === 'video'"
        class="play-indicator"
      >
        ▶
      </div>

      <div class="preview-actions">
        <a
          :href="item.url"
          target="_blank"
          rel="noopener noreferrer"
          class="preview-button"
          title="Open asset"
        >
          ↗
        </a>

        <button
          class="delete-button"
          type="button"
          :disabled="deleting"
          title="Delete asset"
          @click="emit('delete', item)"
        >
          {{ deleting ? '…' : '×' }}
        </button>
      </div>
    </div>

    <div class="card-content">
      <div class="card-heading">
        <div>
          <h3>
            {{ item.altText || item.filename }}
          </h3>

          <p>{{ item.filename }}</p>
        </div>

        <span class="asset-dot" />
      </div>

      <div class="meta">
        <span>{{ formatSize(item.size) }}</span>

        <template v-if="dimensions">
          <i />
          <span>{{ dimensions }}</span>
        </template>

        <i />

        <span>
          {{ item.type === 'image' ? 'Image' : 'Video' }}
        </span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.media-card {
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--surface);
  box-shadow:
    0 8px 28px rgba(34, 16, 31, 0.035);
  transition:
    transform 0.28s ease,
    border-color 0.28s ease,
    box-shadow 0.28s ease;
}

.media-card:hover {
  border-color: rgba(216, 11, 185, 0.18);
  box-shadow:
    0 18px 40px rgba(48, 17, 43, 0.09);
  transform: translateY(-4px);
}

.preview {
  position: relative;
  height: 230px;
  overflow: hidden;
  background:
    linear-gradient(
      145deg,
      #f1ecef,
      #e9e3e8
    );
}

.preview img,
.preview video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition:
    transform 0.55s
    cubic-bezier(0.22, 1, 0.36, 1);
}

.media-card:hover .preview img,
.media-card:hover .preview video {
  transform: scale(1.045);
}

.preview::after {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(
      to bottom,
      transparent 55%,
      rgba(12, 8, 11, 0.28)
    );
  content: '';
}

.type-badge {
  position: absolute;
  top: 14px;
  left: 14px;
  z-index: 2;
  padding: 6px 9px;
  border: 1px solid
    rgba(255, 255, 255, 0.22);
  border-radius: 100px;
  background: rgba(13, 9, 13, 0.66);
  color: white;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  backdrop-filter: blur(10px);
}

.preview-actions {
  position: absolute;
  right: 13px;
  bottom: 13px;
  z-index: 3;
  display: flex;
  gap: 7px;
  opacity: 0;
  transform: translateY(7px);
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}

.media-card:hover .preview-actions {
  opacity: 1;
  transform: translateY(0);
}

.preview-button,
.delete-button {
  display: grid;
  width: 34px;
  height: 34px;
  padding: 0;
  border: 1px solid
    rgba(255, 255, 255, 0.2);
  border-radius: 9px;
  place-items: center;
  background: rgba(13, 9, 13, 0.76);
  color: white;
  cursor: pointer;
  font-size: 15px;
  text-decoration: none;
  backdrop-filter: blur(10px);
  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.preview-button:hover {
  background: var(--brand-dark);
  transform: translateY(-2px);
}

.delete-button:hover {
  background: #a83e55;
  transform: translateY(-2px);
}

.delete-button:disabled {
  cursor: wait;
  opacity: 0.6;
}

.play-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 2;
  display: grid;
  width: 48px;
  height: 48px;
  border: 1px solid
    rgba(255, 255, 255, 0.25);
  border-radius: 50%;
  place-items: center;
  background: rgba(13, 9, 13, 0.55);
  color: white;
  font-size: 12px;
  transform: translate(-50%, -50%);
  backdrop-filter: blur(8px);
}

.card-content {
  padding: 17px 18px 16px;
}

.card-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.card-heading > div {
  min-width: 0;
}

.card-heading h3 {
  overflow: hidden;
  margin: 0;
  color: var(--text);
  font-size: 13px;
  font-weight: 650;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-heading p {
  overflow: hidden;
  margin: 6px 0 0;
  color: var(--muted);
  font-size: 9px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.asset-dot {
  width: 6px;
  height: 6px;
  margin-top: 5px;
  flex: 0 0 auto;
  border-radius: 50%;
  background: var(--brand);
  box-shadow:
    0 0 0 4px
    rgba(216, 11, 185, 0.07);
}

.meta {
  display: flex;
  margin-top: 15px;
  align-items: center;
  gap: 7px;
  color: #9a9198;
  font-size: 8px;
  text-transform: uppercase;
  letter-spacing: 0.07em;
}

.meta i {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #d7d0d5;
}

@media (max-width: 700px) {
  .preview {
    height: 210px;
  }

  .preview-actions {
    opacity: 1;
    transform: none;
  }
}
</style>