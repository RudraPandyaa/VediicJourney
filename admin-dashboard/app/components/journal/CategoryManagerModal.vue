<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="overlay"
        @mousedown.self="$emit('close')"
      >
        <div class="modal-card">
          <header class="modal-header">
            <div>
              <span class="eyebrow">JOURNAL</span>
              <h2>Article Categories</h2>
              <p>
                Organize journal articles into editorial categories.
              </p>
            </div>

            <button
              class="close-btn"
              type="button"
              @click="$emit('close')"
            >
              ×
            </button>
          </header>

          <div class="modal-body">
            <!-- Form -->
            <section class="form-panel">
              <h3>
                {{ editingId ? 'Edit Category' : 'New Category' }}
              </h3>

              <div class="field">
                <label>Name *</label>

                <input
                  v-model="form.name"
                  type="text"
                  maxlength="100"
                  placeholder="Travel Stories"
                  @input="handleNameInput"
                />
              </div>

              <div class="field">
                <label>Slug *</label>

                <input
                  v-model="form.slug"
                  type="text"
                  maxlength="120"
                  placeholder="travel-stories"
                />
              </div>

              <div class="field">
                <label>Description</label>

                <textarea
                  v-model="form.description"
                  rows="4"
                  maxlength="500"
                  placeholder="Short category description..."
                />
              </div>

              <div class="field">
                <label>Sort Order</label>

                <input
                  v-model.number="form.sortOrder"
                  type="number"
                  min="0"
                />
              </div>

              <label class="toggle-row">
                <div>
                  <strong>Published</strong>
                  <span>
                    Show this category publicly.
                  </span>
                </div>

                <input
                  v-model="form.isPublished"
                  type="checkbox"
                />
              </label>

              <p
                v-if="formError"
                class="form-error"
              >
                {{ formError }}
              </p>

              <div class="form-actions">
                <button
                  v-if="editingId"
                  class="cancel-btn"
                  type="button"
                  @click="resetForm"
                >
                  Cancel
                </button>

                <button
                  class="save-btn"
                  type="button"
                  :disabled="saving"
                  @click="saveCategory"
                >
                  {{
                    saving
                      ? 'Saving...'
                      : editingId
                        ? 'Update Category'
                        : 'Add Category'
                  }}
                </button>
              </div>
            </section>

            <!-- Categories -->
            <section class="categories-panel">
              <div class="list-heading">
                <div>
                  <h3>Categories</h3>
                  <span>{{ categories.length }} total</span>
                </div>
              </div>

              <div
                v-if="!categories.length"
                class="empty-state"
              >
                No categories yet.
              </div>

              <div
                v-else
                class="category-list"
              >
                <article
                  v-for="category in categories"
                  :key="category._id"
                  class="category-row"
                >
                  <div class="order">
                    {{ category.sortOrder ?? 0 }}
                  </div>

                  <div class="category-info">
                    <div class="name-row">
                      <strong>
                        {{ category.name }}
                      </strong>

                      <span
                        class="status"
                        :class="
                          category.isPublished
                            ? 'published'
                            : 'draft'
                        "
                      >
                        {{
                          category.isPublished
                            ? 'Published'
                            : 'Draft'
                        }}
                      </span>
                    </div>

                    <span class="slug">
                      /{{ category.slug }}
                    </span>

                    <p v-if="category.description">
                      {{ category.description }}
                    </p>
                  </div>

                  <div class="row-actions">
                    <button
                      type="button"
                      @click="editCategory(category)"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      class="delete"
                      @click="removeCategory(category)"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type {
  ArticleCategory,
} from '~/composables/useJournal'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
  changed: []
}>()

const {
  categories,
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = useJournal()

const editingId = ref<string | null>(null)
const saving = ref(false)
const formError = ref<string | null>(null)
const slugManuallyEdited = ref(false)

const form = reactive({
  name: '',
  slug: '',
  description: '',
  sortOrder: 0,
  isPublished: true,
})

const slugify = (value: string) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const handleNameInput = () => {
  if (!editingId.value && !slugManuallyEdited.value) {
    form.slug = slugify(form.name)
  }
}

watch(
  () => form.slug,
  (value, oldValue) => {
    if (
      editingId.value ||
      !form.name ||
      value === slugify(form.name) ||
      oldValue === undefined
    ) {
      return
    }

    slugManuallyEdited.value = true
  },
)

const resetForm = () => {
  editingId.value = null
  slugManuallyEdited.value = false
  formError.value = null

  form.name = ''
  form.slug = ''
  form.description = ''
  form.sortOrder = 0
  form.isPublished = true
}

const editCategory = (
  category: ArticleCategory,
) => {
  editingId.value = category._id
  slugManuallyEdited.value = true
  formError.value = null

  form.name = category.name
  form.slug = category.slug
  form.description =
    category.description || ''

  form.sortOrder =
    category.sortOrder ?? 0

  form.isPublished =
    category.isPublished
}

const saveCategory = async () => {
  if (!form.name.trim()) {
    formError.value =
      'Category name is required.'
    return
  }

  if (!form.slug.trim()) {
    formError.value =
      'Category slug is required.'
    return
  }

  saving.value = true
  formError.value = null

  const payload = {
    name: form.name.trim(),
    slug: slugify(form.slug),
    description:
      form.description.trim(),
    sortOrder:
      Number(form.sortOrder) || 0,
    isPublished:
      form.isPublished,
  }

  try {
    if (editingId.value) {
      await updateCategory(
        editingId.value,
        payload,
      )
    } else {
      await createCategory(payload)
    }

    await fetchCategories()

    resetForm()
    emit('changed')
  } catch (error: any) {
    formError.value =
      error?.data?.message ||
      error?.message ||
      'Unable to save category.'
  } finally {
    saving.value = false
  }
}

const removeCategory = async (
  category: ArticleCategory,
) => {
  const confirmed = window.confirm(
    `Delete "${category.name}"?`,
  )

  if (!confirmed) return

  try {
    await deleteCategory(
      category._id,
    )

    if (
      editingId.value ===
      category._id
    ) {
      resetForm()
    }

    await fetchCategories()
    emit('changed')
  } catch (error: any) {
    /*
     * Backend will intentionally
     * reject deletion when articles
     * are using this category.
     */
    window.alert(
      error?.data?.message ||
      error?.message ||
      'Unable to delete category.',
    )
  }
}

watch(
  () => props.open,
  async value => {
    if (!value) {
      resetForm()
      return
    }

    try {
      await fetchCategories()
    } catch {
      // existing composable error handling
    }
  },
)
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  padding: 30px;
  display: grid;
  place-items: center;
  background: rgba(13, 11, 14, .58);
  backdrop-filter: blur(5px);
}

.modal-card {
  width: min(980px, 100%);
  max-height: calc(100vh - 60px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  background: #f8f6f7;
  box-shadow:
    0 30px 80px rgba(10, 5, 9, .25);
}

.modal-header {
  padding: 23px 25px;
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

.modal-header h2 {
  margin: 0;
  color: #292329;
  font-size: 23px;
}

.modal-header p {
  margin: 6px 0 0;
  color: #8b8189;
  font-size: 12px;
}

.close-btn {
  width: 38px;
  height: 38px;
  border: 1px solid #e8e1e6;
  border-radius: 9px;
  background: #fff;
  color: #675e65;
  font-size: 22px;
  cursor: pointer;
}

.modal-body {
  min-height: 0;
  overflow-y: auto;
  padding: 20px;
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 17px;
}

.form-panel,
.categories-panel {
  padding: 20px;
  border: 1px solid #ebe5ea;
  border-radius: 14px;
  background: #fff;
}

.form-panel h3,
.list-heading h3 {
  margin: 0;
  color: #393238;
  font-size: 15px;
}

.field {
  margin-top: 16px;
}

.field label {
  margin-bottom: 7px;
  display: block;
  color: #514950;
  font-size: 12px;
  font-weight: 700;
}

.field input,
.field textarea {
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

.field input {
  height: 41px;
  padding: 0 11px;
}

.field textarea {
  padding: 10px 11px;
  line-height: 1.55;
  resize: vertical;
}

.field input:focus,
.field textarea:focus {
  border-color:
    rgba(216, 11, 185, .5);
  box-shadow:
    0 0 0 3px
    rgba(216, 11, 185, .06);
}

.toggle-row {
  margin-top: 18px;
  padding: 13px;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  margin-top: 3px;
  color: #958b93;
  font-size: 10px;
}

.toggle-row input {
  width: 17px;
  height: 17px;
  accent-color: #b20eaf;
}

.form-actions {
  margin-top: 18px;
  display: flex;
  justify-content: flex-end;
  gap: 7px;
}

.save-btn,
.cancel-btn {
  min-height: 39px;
  padding: 0 13px;
  border-radius: 8px;
  font: inherit;
  font-size: 11px;
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
  color: white;
}

.cancel-btn {
  border: 1px solid #e3dce1;
  background: #fff;
  color: #665e64;
}

.form-error {
  margin: 12px 0 0;
  color: #b94a55;
  font-size: 11px;
}

.list-heading {
  margin-bottom: 13px;
  display: flex;
  justify-content: space-between;
}

.list-heading span {
  margin-top: 4px;
  display: block;
  color: #958b93;
  font-size: 10px;
}

.category-list {
  display: flex;
  flex-direction: column;
}

.category-row {
  padding: 14px 0;
  display: grid;
  grid-template-columns:
    35px minmax(0, 1fr) auto;
  gap: 11px;
  border-bottom: 1px solid #f0ebef;
}

.category-row:last-child {
  border-bottom: 0;
}

.order {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 7px;
  background: #f7f2f6;
  color: #a20eac;
  font-size: 10px;
  font-weight: 800;
}

.category-info {
  min-width: 0;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 7px;
}

.name-row strong {
  color: #433b42;
  font-size: 12px;
}

.status {
  padding: 4px 6px;
  border-radius: 999px;
  font-size: 8px;
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

.slug {
  margin-top: 4px;
  display: block;
  color: #a0969e;
  font-size: 9px;
}

.category-info p {
  margin: 6px 0 0;
  color: #81777f;
  font-size: 10px;
  line-height: 1.45;
}

.row-actions {
  display: flex;
  gap: 5px;
}

.row-actions button {
  height: 30px;
  padding: 0 8px;
  border: 1px solid #e5dee3;
  border-radius: 6px;
  background: white;
  color: #645c62;
  font: inherit;
  font-size: 9px;
  font-weight: 700;
  cursor: pointer;
}

.row-actions .delete {
  color: #b94a55;
}

.empty-state {
  min-height: 180px;
  display: grid;
  place-items: center;
  color: #948a92;
  font-size: 12px;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity .18s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

@media (max-width: 800px) {
  .overlay {
    padding: 12px;
  }

  .modal-body {
    grid-template-columns: 1fr;
  }
}
</style>