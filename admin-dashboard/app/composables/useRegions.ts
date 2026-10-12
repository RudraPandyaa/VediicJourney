import { useAdminApi } from './useAdminApi'
import type { MediaItem } from './useMedia'

export interface Region {
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

export interface RegionPayload {
  name: string
  slug: string
  shortDescription?: string
  image?: string
  sortOrder?: number
  isPublished?: boolean
}

interface RegionListResponse {
  success: boolean
  data: Region[]
}

interface RegionResponse {
  success: boolean
  data: Region
}

export const useRegions = () => {
  const { request } = useAdminApi()

  const regions = ref<Region[]>([])
  const loading = ref(false)
  const saving = ref(false)
  const deletingId = ref<string | null>(null)
  const error = ref<string | null>(null)

  const fetchRegions = async () => {
    loading.value = true
    error.value = null

    try {
      const response =
        await request<RegionListResponse>(
          '/admin/regions',
        )

      regions.value = response.data
    } catch (err: any) {
      error.value =
        err?.data?.message ||
        'Unable to load regions.'
    } finally {
      loading.value = false
    }
  }

  const createRegion = async (
    payload: RegionPayload,
  ) => {
    saving.value = true

    try {
      const response =
        await request<RegionResponse>(
          '/admin/regions',
          {
            method: 'POST',
            body: payload,
          },
        )

      await fetchRegions()

      return response.data
    } finally {
      saving.value = false
    }
  }

  const updateRegion = async (
    id: string,
    payload: Partial<RegionPayload>,
  ) => {
    saving.value = true

    try {
      const response =
        await request<RegionResponse>(
          `/admin/regions/${id}`,
          {
            method: 'PATCH',
            body: payload,
          },
        )

      await fetchRegions()

      return response.data
    } finally {
      saving.value = false
    }
  }

  const deleteRegion = async (
    id: string,
  ) => {
    deletingId.value = id

    try {
      await request(
        `/admin/regions/${id}`,
        {
          method: 'DELETE',
        },
      )

      regions.value =
        regions.value.filter(
          region => region._id !== id,
        )
    } finally {
      deletingId.value = null
    }
  }

  return {
    regions,
    loading,
    saving,
    deletingId,
    error,

    fetchRegions,
    createRegion,
    updateRegion,
    deleteRegion,
  }
}