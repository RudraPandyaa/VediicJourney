import { useAdminApi } from './useAdminApi'
import type { MediaItem } from './useMedia'

export interface DestinationRegion {
  _id: string
  name: string
  slug: string
}

export interface DestinationSeo {
  title?: string
  description?: string
  ogImage?: MediaItem | null
}

export interface Destination {
  _id: string
  name: string
  slug: string

  region:
    | DestinationRegion
    | string

  shortDescription?: string
  overview?: string

  heroImage?: MediaItem | null
  gallery?: MediaItem[]

  isFeatured: boolean
  sortOrder: number
  isPublished: boolean

  seo?: DestinationSeo

  createdAt?: string
  updatedAt?: string
}

export interface DestinationPayload {
  name: string
  slug: string
  region: string

  shortDescription?: string
  overview?: string

  heroImage?: string
  gallery?: string[]

  isFeatured?: boolean
  sortOrder?: number
  isPublished?: boolean

  seo?: {
    title?: string
    description?: string
    ogImage?: string
  }
}

interface DestinationListResponse {
  success: boolean
  data: Destination[]
}

interface DestinationResponse {
  success: boolean
  data: Destination
}

export const useDestinations = () => {
  const { request } = useAdminApi()

  const destinations =
    ref<Destination[]>([])

  const loading = ref(false)
  const saving = ref(false)

  const deletingId =
    ref<string | null>(null)

  const error =
    ref<string | null>(null)

  const fetchDestinations =
    async () => {
      loading.value = true
      error.value = null

      try {
        const response =
          await request<DestinationListResponse>(
            '/admin/destinations',
          )

        destinations.value =
          response.data || []
      } catch (err: any) {
        error.value =
          err?.data?.message ||
          'Unable to load destinations.'
      } finally {
        loading.value = false
      }
    }

    const fetchDestination = async (
      id: string,
    ) => {
      const response =
        await request<{
          success: boolean
          data: Destination
        }>(
          `/admin/destinations/${id}`,
        )

      return response.data
    }

  const createDestination =
    async (
      payload: DestinationPayload,
    ) => {
      saving.value = true

      try {
        const response =
          await request<DestinationResponse>(
            '/admin/destinations',
            {
              method: 'POST',
              body: payload,
            },
          )

        await fetchDestinations()

        return response.data
      } finally {
        saving.value = false
      }
    }

  const updateDestination =
    async (
      id: string,
      payload:
        Partial<DestinationPayload>,
    ) => {
      saving.value = true

      try {
        const response =
          await request<DestinationResponse>(
            `/admin/destinations/${id}`,
            {
              method: 'PATCH',
              body: payload,
            },
          )

        await fetchDestinations()

        return response.data
      } finally {
        saving.value = false
      }
    }

  const deleteDestination =
    async (id: string) => {
      deletingId.value = id

      try {
        await request(
          `/admin/destinations/${id}`,
          {
            method: 'DELETE',
          },
        )

        destinations.value =
          destinations.value.filter(
            item => item._id !== id,
          )
      } finally {
        deletingId.value = null
      }
    }

  const getRegionId = (
    destination: Destination,
  ) => {
    return typeof destination.region ===
      'string'
      ? destination.region
      : destination.region._id
  }

  return {
    destinations,
    loading,
    saving,
    deletingId,
    error,

    fetchDestinations,
    fetchDestination,
    createDestination,
    updateDestination,
    deleteDestination,
    getRegionId,
  }
}