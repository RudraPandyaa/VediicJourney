export interface PageSeo {
  title?: string
  description?: string
  ogImage?: string | {
    _id: string
    url: string
    altText?: string
  } | null
}

export interface AdminPage {
  _id: string
  key: string
  title: string
  content: Record<string, any>
  seo?: PageSeo
  isPublished: boolean
  createdAt?: string
  updatedAt?: string
}

export interface UpdatePagePayload {
  title?: string
  content?: Record<string, any>
  seo?: PageSeo
  isPublished?: boolean
}

export const usePages = () => {
  const { request } = useAdminApi()

  const pages = useState<AdminPage[]>(
    'admin-pages',
    () => [],
  )

  const loading = useState<boolean>(
    'admin-pages-loading',
    () => false,
  )

  const error = useState<string | null>(
    'admin-pages-error',
    () => null,
  )

  const normalizeList = (
    response: any,
  ): AdminPage[] => {
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

  const normalizeItem = (
    response: any,
  ): AdminPage => {
    if (
      response?.data &&
      !Array.isArray(response.data)
    ) {
      return response.data
    }

    return response
  }

  const fetchPages = async () => {
    loading.value = true
    error.value = null

    try {
      const response =
        await request<any>(
          '/admin/pages',
        )

      pages.value =
        normalizeList(response)

      return pages.value
    } catch (err: any) {
      error.value =
        err?.data?.message ||
        err?.message ||
        'Unable to load pages.'

      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchPage = async (
    key: string,
  ) => {
    error.value = null

    try {
      const response =
        await request<any>(
          `/admin/pages/${key}`,
        )

      return normalizeItem(response)
    } catch (err: any) {
      error.value =
        err?.data?.message ||
        err?.message ||
        'Unable to load page.'

      throw err
    }
  }

  const updatePage = async (
    key: string,
    payload: UpdatePagePayload,
  ) => {
    error.value = null

    try {
      const response =
        await request<any>(
          `/admin/pages/${key}`,
          {
            method: 'PATCH',
            body: payload,
          },
        )

      const updated =
        normalizeItem(response)

      const index =
        pages.value.findIndex(
          page => page.key === key,
        )

      if (index !== -1) {
        pages.value[index] =
          updated
      }

      return updated
    } catch (err: any) {
      error.value =
        err?.data?.message ||
        err?.message ||
        'Unable to update page.'

      throw err
    }
  }

  return {
    pages,
    loading,
    error,

    fetchPages,
    fetchPage,
    updatePage,
  }
}