export interface ArticleCategory {
  _id: string
  name: string
  slug: string
  description?: string
  sortOrder: number
  isPublished: boolean
  createdAt?: string
  updatedAt?: string
}

export interface ArticleMedia {
  _id: string
  url: string
  altText?: string
}

export interface Article {
  _id: string
  title: string
  slug: string

  category?:
    | string
    | ArticleCategory
    | null

  excerpt?: string
  content?: string

  coverImage?:
    | string
    | ArticleMedia
    | null

  author?: string

  isFeatured: boolean
  isPublished: boolean

  publishedAt?: string | null

  seo?: {
    title?: string
    description?: string

    ogImage?:
      | string
      | ArticleMedia
      | null
  }

  createdAt?: string
  updatedAt?: string
}

export interface ArticlePayload {
  title: string
  slug: string
  category: string

  excerpt?: string
  content?: string
  coverImage?: string
  author?: string

  isFeatured?: boolean
  isPublished?: boolean
  publishedAt?: string

  seo?: {
    title?: string
    description?: string
    ogImage?: string
  }
}

export interface CategoryPayload {
  name: string
  slug: string
  description?: string
  sortOrder?: number
  isPublished?: boolean
}

export const useJournal = () => {
  const { request } = useAdminApi()

  const articles = useState<Article[]>(
    'admin-articles',
    () => [],
  )

  const categories = useState<ArticleCategory[]>(
    'admin-article-categories',
    () => [],
  )

  const pagination = useState(
  'admin-journal-pagination',
  () => ({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  }),
)

  const loading = useState(
    'admin-journal-loading',
    () => false,
  )

  const error = useState<string | null>(
    'admin-journal-error',
    () => null,
  )

  const normalizeList = <T>(
    response: any,
  ): T[] => {
    if (Array.isArray(response)) {
      return response
    }

    if (Array.isArray(response?.data)) {
      return response.data
    }

    if (
      Array.isArray(
        response?.data?.data,
      )
    ) {
      return response.data.data
    }

    return []
  }

  const normalizeItem = <T>(
    response: any,
  ): T => {
    return response?.data ?? response
  }

  // -------------------------
  // Categories
  // -------------------------

  const fetchCategories = async () => {
    try {
      const response =
        await request<any>(
          '/admin/article-categories',
        )

      categories.value =
        normalizeList<ArticleCategory>(
          response,
        )

      return categories.value
    } catch (err: any) {
      error.value =
        err?.data?.message ||
        'Unable to load categories.'

      throw err
    }
  }

  const createCategory = async (
    payload: CategoryPayload,
  ) => {
    const response =
      await request<any>(
        '/admin/article-categories',
        {
          method: 'POST',
          body: payload,
        },
      )

    const created =
      normalizeItem<ArticleCategory>(
        response,
      )

    categories.value.push(created)

    return created
  }

  const updateCategory = async (
    id: string,
    payload: Partial<CategoryPayload>,
  ) => {
    const response =
      await request<any>(
        `/admin/article-categories/${id}`,
        {
          method: 'PATCH',
          body: payload,
        },
      )

    const updated =
      normalizeItem<ArticleCategory>(
        response,
      )

    const index =
      categories.value.findIndex(
        item => item._id === id,
      )

    if (index !== -1) {
      categories.value[index] = updated
    }

    return updated
  }

  const deleteCategory = async (
    id: string,
  ) => {
    await request(
      `/admin/article-categories/${id}`,
      {
        method: 'DELETE',
      },
    )

    categories.value =
      categories.value.filter(
        item => item._id !== id,
      )
  }

  // -------------------------
  // Articles
  // -------------------------

    const fetchArticles = async (
    page = 1,
    limit = 20,
    ) => {
    loading.value = true
    error.value = null

    try {
        const response =
        await request<any>(
            `/admin/articles?page=${page}&limit=${limit}`,
        )

        articles.value =
        Array.isArray(response?.data)
            ? response.data
            : []

        pagination.value = {
        page:
            response?.pagination?.page ??
            page,

        limit:
            response?.pagination?.limit ??
            limit,

        total:
            response?.pagination?.total ??
            articles.value.length,

        totalPages:
            response?.pagination?.totalPages ??
            1,
        }

        return articles.value
    } catch (err: any) {
        error.value =
        err?.data?.message ||
        err?.message ||
        'Unable to load articles.'

        throw err
    } finally {
        loading.value = false
    }
    }

  const fetchArticle = async (
    id: string,
  ) => {
    const response =
      await request<any>(
        `/admin/articles/${id}`,
      )

    return normalizeItem<Article>(
      response,
    )
  }

  const createArticle = async (
    payload: ArticlePayload,
  ) => {
    const response =
      await request<any>(
        '/admin/articles',
        {
          method: 'POST',
          body: payload,
        },
      )

    const created =
      normalizeItem<Article>(
        response,
      )

    articles.value.unshift(created)

    return created
  }

  const updateArticle = async (
    id: string,
    payload: Partial<ArticlePayload>,
  ) => {
    const response =
      await request<any>(
        `/admin/articles/${id}`,
        {
          method: 'PATCH',
          body: payload,
        },
      )

    const updated =
      normalizeItem<Article>(
        response,
      )

    const index =
      articles.value.findIndex(
        item => item._id === id,
      )

    if (index !== -1) {
      articles.value[index] = updated
    }

    return updated
  }

  const deleteArticle = async (
    id: string,
  ) => {
    await request(
      `/admin/articles/${id}`,
      {
        method: 'DELETE',
      },
    )

    articles.value =
      articles.value.filter(
        item => item._id !== id,
      )
  }

return {
  articles,
  categories,
  pagination,
  loading,
  error,

  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,

  fetchArticles,
  fetchArticle,
  createArticle,
  updateArticle,
  deleteArticle,
}
}