<template>
  <div class="journal-page">
    <header class="page-header">
      <div>
        <span class="eyebrow">CONTENT</span>
        <h1>Journal</h1>
        <p>
          Create and manage travel stories, insights and
          editorial content for Vedic Journey.
        </p>
      </div>

      <div class="header-actions">
        <button
          class="secondary-btn"
          @click="categoryManagerOpen = true"
        >
          Manage Categories
        </button>

        <button
          class="primary-btn"
          @click="openCreate"
        >
          + New Article
        </button>
      </div>
    </header>

    <!-- Summary -->
    <section class="summary-grid">
      <article class="summary-card">
        <span>TOTAL ARTICLES</span>
        <strong>{{ pagination.total }}</strong>
        <p>All journal content</p>
      </article>

      <article class="summary-card">
        <span>PUBLISHED ON PAGE</span>
        <strong>{{ publishedCount }}</strong>
        <p>Current loaded page</p>
      </article>

      <article class="summary-card">
        <span>DRAFTS ON PAGE</span>
        <strong>{{ draftCount }}</strong>
        <p>Current loaded page</p>
      </article>

      <article class="summary-card">
        <span>FEATURED ON PAGE</span>
        <strong>{{ featuredCount }}</strong>
        <p>Current loaded page</p>
      </article>
    </section>

    <!-- Toolbar -->
    <section class="toolbar">
      <div class="search-box">
        <span>⌕</span>

        <input
          v-model="search"
          type="text"
          placeholder="Search loaded articles..."
        />
      </div>

      <select v-model="statusFilter">
        <option value="all">
          All statuses
        </option>

        <option value="published">
          Published
        </option>

        <option value="draft">
          Draft
        </option>
      </select>

      <select v-model="categoryFilter">
        <option value="all">
          All categories
        </option>

        <option
          v-for="category in categories"
          :key="category._id"
          :value="category._id"
        >
          {{ category.name }}
        </option>
      </select>
    </section>

    <!-- Error -->
    <div
      v-if="error"
      class="message-state error-state"
    >
      <div>
        <strong>Unable to load journal</strong>
        <span>{{ error }}</span>
      </div>

      <button @click="loadData">
        Try Again
      </button>
    </div>

    <!-- Loading -->
    <div
      v-else-if="loading"
      class="message-state"
    >
      Loading journal...
    </div>

    <!-- Empty -->
    <div
      v-else-if="!filteredArticles.length"
      class="empty-state"
    >
      <div class="empty-mark">J</div>

      <h3>No articles found</h3>

      <p>
        {{
          articles.length
            ? 'No articles match the current filters.'
            : 'Create the first journal article for Vedic Journey.'
        }}
      </p>

      <button
        v-if="!articles.length"
        class="primary-btn"
        @click="openCreate"
      >
        + New Article
      </button>
    </div>

    <!-- Table -->
    <section
      v-else
      class="table-card"
    >
      <div class="table-head">
        <span>ARTICLE</span>
        <span>CATEGORY</span>
        <span>AUTHOR</span>
        <span>STATUS</span>
        <span>PUBLISHED</span>
        <span />
      </div>

      <div
        v-for="article in filteredArticles"
        :key="article._id"
        class="table-row"
      >
        <div class="article-cell">
          <div class="cover">
            <img
              v-if="coverUrl(article)"
              :src="coverUrl(article)"
              :alt="article.title"
            />

            <span v-else>
              {{ article.title.charAt(0).toUpperCase() }}
            </span>
          </div>

          <div>
            <strong>{{ article.title }}</strong>

            <span>
              /journal/{{ article.slug }}
            </span>

            <small v-if="article.isFeatured">
              Featured
            </small>
          </div>
        </div>

        <span class="regular-cell">
          {{ categoryName(article) }}
        </span>

        <span class="regular-cell">
          {{ article.author || '—' }}
        </span>

        <span>
          <span
            class="status-badge"
            :class="
              article.isPublished
                ? 'published'
                : 'draft'
            "
          >
            {{
              article.isPublished
                ? 'Published'
                : 'Draft'
            }}
          </span>
        </span>

        <span class="regular-cell">
          {{ formatDate(article.publishedAt) }}
        </span>

        <div class="row-actions">
          <button
            :disabled="loadingEditId === article._id"
            @click="openEdit(article)"
          >
            {{
              loadingEditId === article._id
                ? 'Loading...'
                : 'Edit'
            }}
          </button>

          <button
            class="delete-btn"
            @click="removeArticle(article)"
          >
            Delete
          </button>
        </div>
      </div>

      <!-- Pagination -->
      <footer
        v-if="pagination.totalPages > 1"
        class="pagination"
      >
        <span>
          Page {{ pagination.page }}
          of {{ pagination.totalPages }}
        </span>

        <div>
          <button
            :disabled="pagination.page <= 1"
            @click="changePage(pagination.page - 1)"
          >
            Previous
          </button>

          <button
            :disabled="
              pagination.page >= pagination.totalPages
            "
            @click="changePage(pagination.page + 1)"
          >
            Next
          </button>
        </div>
      </footer>
    </section>

    <!-- Components added in Part 2 -->
    <ClientOnly>
      <ArticleFormDrawer
        :open="formOpen"
        :article="editingArticle"
        :categories="categories"
        @close="closeForm"
        @saved="handleSaved"
      />

      <CategoryManagerModal
        :open="categoryManagerOpen"
        @close="categoryManagerOpen = false"
        @changed="handleCategoriesChanged"
      />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import ArticleFormDrawer from '~/components/journal/ArticleFormDrawer.vue'
import CategoryManagerModal from '~/components/journal/CategoryManagerModal.vue'

import type {
  Article,
} from '~/composables/useJournal'

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

const {
  articles,
  categories,
  pagination,
  loading,
  error,

  fetchArticles,
  fetchArticle,
  fetchCategories,
  deleteArticle,
} = useJournal()

const search = ref('')
const statusFilter = ref('all')
const categoryFilter = ref('all')

const formOpen = ref(false)
const editingArticle = ref<Article | null>(null)

const categoryManagerOpen = ref(false)
const loadingEditId = ref<string | null>(null)

const publishedCount = computed(() =>
  articles.value.filter(
    article => article.isPublished,
  ).length,
)

const draftCount = computed(() =>
  articles.value.filter(
    article => !article.isPublished,
  ).length,
)

const featuredCount = computed(() =>
  articles.value.filter(
    article => article.isFeatured,
  ).length,
)

const filteredArticles = computed(() => {
  const query =
    search.value.trim().toLowerCase()

  return articles.value.filter(article => {
    const matchesSearch =
      !query ||
      article.title
        .toLowerCase()
        .includes(query) ||
      article.slug
        .toLowerCase()
        .includes(query) ||
      article.author
        ?.toLowerCase()
        .includes(query)

    const matchesStatus =
      statusFilter.value === 'all' ||
      (
        statusFilter.value ===
          'published' &&
        article.isPublished
      ) ||
      (
        statusFilter.value ===
          'draft' &&
        !article.isPublished
      )

    const category =
      typeof article.category === 'object'
        ? article.category?._id
        : article.category

    const matchesCategory =
      categoryFilter.value === 'all' ||
      category === categoryFilter.value

    return (
      matchesSearch &&
      matchesStatus &&
      matchesCategory
    )
  })
})

const coverUrl = (
  article: Article,
) => {
  return (
    article.coverImage &&
    typeof article.coverImage === 'object'
  )
    ? article.coverImage.url
    : ''
}

const categoryName = (
  article: Article,
) => {
  return (
    article.category &&
    typeof article.category === 'object'
  )
    ? article.category.name
    : '—'
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

const openCreate = () => {
  editingArticle.value = null
  formOpen.value = true
}

const openEdit = async (
  article: Article,
) => {
  if (loadingEditId.value) return

  loadingEditId.value = article._id

  try {
    editingArticle.value =
      await fetchArticle(article._id)

    formOpen.value = true
  } catch (err) {
    console.error(
      'Unable to load article',
      err,
    )
  } finally {
    loadingEditId.value = null
  }
}

const closeForm = () => {
  formOpen.value = false
  editingArticle.value = null
}

const handleSaved = async () => {
  closeForm()

  await fetchArticles(
    pagination.value.page,
    pagination.value.limit,
  )
}

const removeArticle = async (
  article: Article,
) => {
  const confirmed = window.confirm(
    `Delete "${article.title}"? This action cannot be undone.`,
  )

  if (!confirmed) return

  try {
    await deleteArticle(article._id)

    await fetchArticles(
      pagination.value.page,
      pagination.value.limit,
    )
  } catch (err: any) {
    window.alert(
      err?.data?.message ||
      'Unable to delete article.',
    )
  }
}

const changePage = async (
  page: number,
) => {
  await fetchArticles(
    page,
    pagination.value.limit,
  )
}

const handleCategoriesChanged =
  async () => {
    await fetchCategories()
  }

const loadData = async () => {
  try {
    await Promise.all([
      fetchCategories(),
      fetchArticles(1, 20),
    ])
  } catch {
    // errors handled by composable
  }
}

onMounted(loadData)
</script>

<style scoped>
.journal-page {
  width: 100%;
}

.page-header {
  margin-bottom: 28px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 25px;
}

.eyebrow {
  display: block;
  margin-bottom: 8px;
  color: #a20eac;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .16em;
}

.page-header h1 {
  margin: 0;
  color: #211d21;
  font-size: 42px;
  letter-spacing: -.035em;
}

.page-header p {
  max-width: 630px;
  margin: 10px 0 0;
  color: #80777f;
  font-size: 14px;
  line-height: 1.6;
}

.header-actions {
  display: flex;
  gap: 9px;
}

.primary-btn,
.secondary-btn {
  min-height: 42px;
  padding: 0 16px;
  border-radius: 9px;
  font: inherit;
  font-size: 13px;
  font-weight: 750;
  cursor: pointer;
}

.primary-btn {
  border: 0;
  background:
    linear-gradient(
      135deg,
      #ec12c7,
      #821092
    );
  color: #fff;
}

.secondary-btn {
  border: 1px solid #e3dce1;
  background: #fff;
  color: #544c52;
}

.summary-grid {
  margin-bottom: 18px;
  display: grid;
  grid-template-columns:
    repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.summary-card {
  padding: 18px;
  border: 1px solid #ebe5ea;
  border-radius: 14px;
  background: #fff;
}

.summary-card > span {
  color: #948a92;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .1em;
}

.summary-card strong {
  margin-top: 14px;
  display: block;
  color: #292329;
  font-size: 28px;
}

.summary-card p {
  margin: 6px 0 0;
  color: #9a9098;
  font-size: 11px;
}

.toolbar {
  margin-bottom: 14px;
  padding: 12px;
  display: grid;
  grid-template-columns:
    minmax(260px, 1fr)
    180px
    210px;
  gap: 10px;
  border: 1px solid #ebe5ea;
  border-radius: 13px;
  background: #fff;
}

.search-box {
  height: 42px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #e6dfe4;
  border-radius: 8px;
}

.search-box span {
  color: #9c929a;
}

.search-box input {
  width: 100%;
  border: 0;
  outline: 0;
  color: #393238;
  font: inherit;
  font-size: 13px;
}

.toolbar select {
  padding: 0 11px;
  border: 1px solid #e6dfe4;
  border-radius: 8px;
  background: #fff;
  color: #5d555b;
  font: inherit;
  font-size: 12px;
}

.table-card {
  overflow: hidden;
  border: 1px solid #ebe5ea;
  border-radius: 14px;
  background: #fff;
}

.table-head,
.table-row {
  display: grid;
  grid-template-columns:
    minmax(280px, 2fr)
    1fr
    .8fr
    .8fr
    .9fr
    130px;
  align-items: center;
  gap: 15px;
}

.table-head {
  min-height: 44px;
  padding: 0 17px;
  border-bottom: 1px solid #eee8ec;
  background: #fcfafb;
  color: #998f97;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .08em;
}

.table-row {
  min-height: 79px;
  padding: 10px 17px;
  border-bottom: 1px solid #f0ebef;
}

.table-row:last-of-type {
  border-bottom: 0;
}

.article-cell {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 11px;
}

.cover {
  width: 52px;
  height: 52px;
  flex: 0 0 52px;
  overflow: hidden;
  display: grid;
  place-items: center;
  border-radius: 9px;
  background: #f6eaf4;
  color: #a20eac;
  font-size: 16px;
  font-weight: 800;
}

.cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-cell > div:last-child {
  min-width: 0;
}

.article-cell strong {
  display: block;
  overflow: hidden;
  color: #373036;
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.article-cell span {
  margin-top: 5px;
  display: block;
  overflow: hidden;
  color: #9a9098;
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.article-cell small {
  margin-top: 5px;
  display: inline-block;
  color: #a20eac;
  font-size: 9px;
  font-weight: 750;
}

.regular-cell {
  color: #625a60;
  font-size: 12px;
}

.status-badge {
  padding: 6px 8px;
  display: inline-block;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 750;
}

.status-badge.published {
  background: #edf7f2;
  color: #328462;
}

.status-badge.draft {
  background: #f2eff1;
  color: #776e75;
}

.row-actions {
  display: flex;
  justify-content: flex-end;
  gap: 5px;
}

.row-actions button {
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

.row-actions .delete-btn {
  color: #b94a55;
}

.pagination {
  min-height: 55px;
  padding: 0 17px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #eee8ec;
}

.pagination span {
  color: #8f858d;
  font-size: 11px;
}

.pagination div {
  display: flex;
  gap: 6px;
}

.pagination button {
  min-height: 33px;
  padding: 0 11px;
  border: 1px solid #e5dde3;
  border-radius: 7px;
  background: #fff;
  color: #5c545a;
  font: inherit;
  font-size: 11px;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: .4;
  cursor: default;
}

.message-state,
.empty-state {
  min-height: 300px;
  display: grid;
  place-items: center;
  align-content: center;
  border: 1px solid #ebe5ea;
  border-radius: 14px;
  background: #fff;
  color: #847a82;
  font-size: 13px;
  text-align: center;
}

.error-state {
  gap: 7px;
  color: #a64a54;
}

.error-state div {
  display: grid;
  gap: 4px;
}

.error-state button {
  margin-top: 8px;
}

.empty-mark {
  width: 55px;
  height: 55px;
  display: grid;
  place-items: center;
  border-radius: 15px;
  background: #f8eaf6;
  color: #a20eac;
  font-size: 18px;
  font-weight: 850;
}

.empty-state h3 {
  margin: 14px 0 5px;
  color: #393238;
  font-size: 17px;
}

.empty-state p {
  margin: 0 0 15px;
  color: #90868e;
  font-size: 12px;
}

@media (max-width: 1100px) {
  .summary-grid {
    grid-template-columns:
      repeat(2, 1fr);
  }

  .table-card {
    overflow-x: auto;
  }

  .table-head,
  .table-row {
    min-width: 1000px;
  }
}

@media (max-width: 700px) {
  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .page-header h1 {
    font-size: 34px;
  }

  .toolbar,
  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>