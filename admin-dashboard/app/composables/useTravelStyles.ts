import { useAdminApi } from './useAdminApi'
import type { MediaItem } from './useMedia'

export interface TravelStyle {
  _id: string
  name: string
  slug: string
  shortDescription?: string
  image?: MediaItem | null
  sortOrder: number
  isPublished: boolean
  createdAt?: string
  updatedAt?: string
}

export interface TravelStylePayload {
  name: string
  slug: string
  shortDescription?: string
  image?: string
  sortOrder?: number
  isPublished?: boolean
}

interface TravelStylesResponse {
  success: boolean
  data: TravelStyle[]
}

interface TravelStyleResponse {
  success: boolean
  data: TravelStyle
}

export const useTravelStyles = () => {
  const { request } = useAdminApi()

  const travelStyles = ref<TravelStyle[]>([])
  const loading = ref(false)
  const saving = ref(false)
  const deletingId = ref<string | null>(null)
  const error = ref<string | null>(null)

  const fetchTravelStyles = async () => {
    loading.value = true
    error.value = null

    try {
      const response =
        await request<TravelStylesResponse>(
          '/admin/travel-styles',
        )

      travelStyles.value = response.data || []
    } catch (err: any) {
      error.value =
        err?.data?.message ||
        'Unable to load travel styles.'
    } finally {
      loading.value = false
    }
  }

  const createTravelStyle = async (
    payload: TravelStylePayload,
  ) => {
    saving.value = true

    try {
      const response =
        await request<TravelStyleResponse>(
          '/admin/travel-styles',
          {
            method: 'POST',
            body: payload,
          },
        )

      await fetchTravelStyles()
      return response.data
    } finally {
      saving.value = false
    }
  }

  const updateTravelStyle = async (
    id: string,
    payload: Partial<TravelStylePayload>,
  ) => {
    saving.value = true

    try {
      const response =
        await request<TravelStyleResponse>(
          `/admin/travel-styles/${id}`,
          {
            method: 'PATCH',
            body: payload,
          },
        )

      await fetchTravelStyles()
      return response.data
    } finally {
      saving.value = false
    }
  }

  const deleteTravelStyle = async (
    id: string,
  ) => {
    deletingId.value = id

    try {
      await request(
        `/admin/travel-styles/${id}`,
        {
          method: 'DELETE',
        },
      )

      travelStyles.value =
        travelStyles.value.filter(
          item => item._id !== id,
        )
    } finally {
      deletingId.value = null
    }
  }

  return {
    travelStyles,
    loading,
    saving,
    deletingId,
    error,

    fetchTravelStyles,
    createTravelStyle,
    updateTravelStyle,
    deleteTravelStyle,
  }
}