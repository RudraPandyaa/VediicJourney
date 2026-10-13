<script setup lang="ts">
import {
  useMedia,
  type MediaItem,
} from '../../composables/useMedia'

const props = withDefaults(
  defineProps<{
    open: boolean
    multiple?: boolean
    selected?: string[]
    title?: string
  }>(),
  {
    multiple: false,
    selected: () => [],
    title: 'Select visual',
  },
)

const emit = defineEmits<{
  close: []
  select: [items: MediaItem[]]
}>()

const {
  media,
  loading,
  fetchMedia,
} = useMedia()

const search = ref('')
const localSelected = ref<string[]>([])

const images = computed(() => {
  const query =
    search.value.trim().toLowerCase()

  return media.value
    .filter(item => item.type === 'image')
    .filter((item) => {
      if (!query) return true

      return (
        item.filename
          .toLowerCase()
          .includes(query) ||
        item.altText
          ?.toLowerCase()
          .includes(query)
      )
    })
})

const isSelected = (id: string) =>
  localSelected.value.includes(id)

const toggle = (item: MediaItem) => {
  if (!props.multiple) {
    emit('select', [item])
    emit('close')
    return
  }

  if (isSelected(item._id)) {
    localSelected.value =
      localSelected.value.filter(
        id => id !== item._id,
      )
  } else {
    localSelected.value = [
      ...localSelected.value,
      item._id,
    ]
  }
}

const confirmSelection = () => {
  const selectedItems =
    media.value.filter(item =>
      localSelected.value.includes(
        item._id,
      ),
    )

  emit('select', selectedItems)
  emit('close')
}

watch(
  () => props.open,
  async (open) => {
    if (!open) return

    search.value = ''
    localSelected.value = [
      ...props.selected,
    ]

    await fetchMedia()
  },
)
</script>

<template>
  <Teleport to="body">
    <Transition name="media-picker">
      <div
        v-if="open"
        class="picker-backdrop"
        @click.self="$emit('close')"
      >
        <section class="picker-panel">
          <header>
            <div>
              <p>MEDIA LIBRARY</p>
              <h2>{{ title }}</h2>
            </div>

            <button
              class="close"
              type="button"
              @click="$emit('close')"
            >
              ×
            </button>
          </header>

          <div class="search-box">
            <span>⌕</span>

            <input
              v-model="search"
              type="search"
              placeholder="Search images..."
            >
          </div>

          <div
            v-if="loading"
            class="loading-grid"
          >
            <div
              v-for="i in 8"
              :key="i"
              class="skeleton"
            />
          </div>

          <div
            v-else-if="images.length"
            class="image-grid"
          >
            <button
              v-for="item in images"
              :key="item._id"
              type="button"
              class="image-card"
              :class="{
                selected:
                  isSelected(item._id),
              }"
              @click="toggle(item)"
            >
              <img
                :src="item.url"
                :alt="
                  item.altText ||
                  item.filename
                "
              >

              <div class="image-info">
                <span>
                  {{
                    item.altText ||
                    item.filename
                  }}
                </span>
              </div>

              <div
                v-if="isSelected(item._id)"
                class="check"
              >
                ✓
              </div>
            </button>
          </div>

          <div
            v-else
            class="empty"
          >
            <span>✦</span>
            <h3>No images found</h3>
            <p>
              Upload imagery in the Media
              Library first.
            </p>
          </div>

          <footer v-if="multiple">
            <span>
              {{ localSelected.length }}
              selected
            </span>

            <div>
              <button
                type="button"
                class="cancel"
                @click="$emit('close')"
              >
                Cancel
              </button>

              <button
                type="button"
                class="confirm"
                @click="confirmSelection"
              >
                Use selected images
              </button>
            </div>
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.picker-backdrop {
  position: fixed;
  z-index: 20000;
  inset: 0;
  display: grid;
  padding: 24px;
  place-items: center;
  background: rgba(9, 6, 9, .72);
  backdrop-filter: blur(8px);
}
.picker-panel {
  display: flex;
  width: min(100%, 920px);
  max-height: min(760px, calc(100vh - 48px));
  padding: 28px;
  overflow: hidden;
  border-radius: 22px;
  flex-direction: column;
  background: white;
  box-shadow:
    0 40px 100px rgba(12, 4, 11, .32);
}

header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

header p {
  margin: 0 0 7px;
  color: var(--brand-dark);
  font-size: 8px;
  font-weight: 750;
  letter-spacing: .2em;
}

header h2 {
  margin: 0;
  font-family: Georgia, serif;
  font-size: 30px;
  font-weight: 400;
}

.close {
  display: grid;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid var(--border);
  border-radius: 9px;
  place-items: center;
  background: white;
  color: var(--muted);
  cursor: pointer;
  font-size: 19px;
}

.search-box {
  position: relative;
  margin: 24px 0 18px;
}

.search-box span {
  position: absolute;
  top: 50%;
  left: 15px;
  color: var(--muted);
  transform: translateY(-50%);
}

.search-box input {
  width: 100%;
  height: 46px;
  padding: 0 15px 0 42px;
  border: 1px solid var(--border);
  border-radius: 10px;
  outline: none;
  font: inherit;
  font-size: 10px;
}

.search-box input:focus {
  border-color:
    rgba(216, 11, 185, .35);
  box-shadow:
    0 0 0 4px
    rgba(216, 11, 185, .04);
}

.image-grid,
.loading-grid {
  display: grid;
  padding-right: 5px;
  overflow-y: auto;
  grid-template-columns:
    repeat(4, minmax(0, 1fr));
  gap: 11px;
}

.image-card {
  position: relative;
  height: 155px;
  padding: 0;
  overflow: hidden;
  border: 2px solid transparent;
  border-radius: 12px;
  background: #eee;
  cursor: pointer;
}

.image-card.selected {
  border-color: var(--brand);
  box-shadow:
    0 0 0 3px
    rgba(216, 11, 185, .08);
}

.image-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .3s ease;
}

.image-card:hover img {
  transform: scale(1.035);
}

.image-info {
  position: absolute;
  right: 7px;
  bottom: 7px;
  left: 7px;
  padding: 8px;
  overflow: hidden;
  border-radius: 7px;
  background: rgba(9, 6, 9, .68);
  color: white;
  font-size: 7px;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  backdrop-filter: blur(6px);
}

.check {
  position: absolute;
  top: 8px;
  right: 8px;
  display: grid;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  place-items: center;
  background: var(--brand-gradient);
  color: white;
  font-size: 10px;
}

.loading-grid .skeleton {
  height: 155px;
  border-radius: 12px;
}

.empty {
  padding: 80px 20px;
  color: var(--muted);
  text-align: center;
}

.empty > span {
  display: grid;
  width: 44px;
  height: 44px;
  margin: auto;
  border-radius: 12px;
  place-items: center;
  background: var(--brand-gradient);
  color: white;
}

.empty h3 {
  margin: 14px 0 5px;
  color: var(--text);
  font-family: Georgia, serif;
  font-size: 21px;
  font-weight: 400;
}

.empty p {
  margin: 0;
  font-size: 9px;
}

footer {
  display: flex;
  margin-top: 18px;
  padding-top: 17px;
  border-top: 1px solid var(--border);
  align-items: center;
  justify-content: space-between;
}

footer > span {
  color: var(--muted);
  font-size: 9px;
}

footer > div {
  display: flex;
  gap: 8px;
}

footer button {
  min-height: 40px;
  padding: 0 14px;
  border-radius: 9px;
  cursor: pointer;
  font-size: 8px;
  font-weight: 700;
}

.cancel {
  border: 1px solid var(--border);
  background: white;
}

.confirm {
  border: 0;
  background: var(--brand-gradient);
  color: white;
}

.media-picker-enter-active,
.media-picker-leave-active {
  transition: opacity .22s ease;
}

.media-picker-enter-from,
.media-picker-leave-to {
  opacity: 0;
}

@media(max-width: 750px) {
  .picker-backdrop {
    padding: 10px;
  }

  .picker-panel {
    padding: 20px 16px;
  }

  .image-grid,
  .loading-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  footer {
    align-items: stretch;
    flex-direction: column;
    gap: 10px;
  }

  footer > div {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
</style>