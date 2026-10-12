import { useAdminApi } from './useAdminApi'
import type { MediaItem } from './useMedia'

export interface PlaceDestination {
  _id: string
  name: string
  slug: string
}

export interface Place {
  _id: string
  name: string
  slug: string

  destination:
    | PlaceDestination
    | string

  shortDescription?: string
  image?: MediaItem | null

  sortOrder: number
  isPublished: boolean

  createdAt?: string
  updatedAt?: string
}

export interface PlacePayload {
  name: string
  slug: string
  destination: string
  shortDescription?: string
  image?: string
  sortOrder?: number
  isPublished?: boolean
}

interface PlacesResponse {
  success: boolean
  data: Place[]
}

interface PlaceResponse {
  success: boolean
  data: Place
}

export const usePlaces = () => {
  const { request } = useAdminApi()

  const places = ref<Place[]>([])
  const loading = ref(false)
  const saving = ref(false)
  const deletingId = ref<string | null>(null)
  const error = ref<string | null>(null)

  const fetchPlaces = async (
    destination?: string,
  ) => {
    loading.value = true
    error.value = null

    try {
      const query = destination
        ? `?destination=${destination}`
        : ''

      const response =
        await request<PlacesResponse>(
          `/admin/places${query}`,
        )

      places.value = response.data || []
    } catch (err: any) {
      error.value =
        err?.data?.message ||
        'Unable to load places.'
    } finally {
      loading.value = false
    }
  }

  const createPlace = async (
    payload: PlacePayload,
  ) => {
    saving.value = true

    try {
      const response =
        await request<PlaceResponse>(
          '/admin/places',
          {
            method: 'POST',
            body: payload,
          },
        )

      await fetchPlaces()

      return response.data
    } finally {
      saving.value = false
    }
  }

  const updatePlace = async (
    id: string,
    payload: Partial<PlacePayload>,
  ) => {
    saving.value = true

    try {
      const response =
        await request<PlaceResponse>(
          `/admin/places/${id}`,
          {
            method: 'PATCH',
            body: payload,
          },
        )

      await fetchPlaces()

      return response.data
    } finally {
      saving.value = false
    }
  }

  const deletePlace = async (
    id: string,
  ) => {
    deletingId.value = id

    try {
      await request(
        `/admin/places/${id}`,
        {
          method: 'DELETE',
        },
      )

      places.value =
        places.value.filter(
          place => place._id !== id,
        )
    } finally {
      deletingId.value = null
    }
  }

  return {
    places,
    loading,
    saving,
    deletingId,
    error,

    fetchPlaces,
    createPlace,
    updatePlace,
    deletePlace,
  }
}