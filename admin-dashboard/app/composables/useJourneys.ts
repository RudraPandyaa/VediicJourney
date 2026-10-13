import type { MediaItem } from './useMedia'

export interface JourneyRelation {
  _id: string
  name: string
  slug: string
}

export interface JourneyPlace {
  _id: string
  name: string
  slug: string
  destination?: string | JourneyRelation
}

export interface JourneyItineraryDay {
  day: number
  title: string
  description?: string
  place?: JourneyPlace | string | null
  image?: MediaItem | string | null
}

export interface JourneySeo {
  title?: string
  description?: string
  ogImage?: MediaItem | string | null
}

export interface Journey {
  _id: string
  title: string
  slug: string
  shortDescription?: string
  overview?: string
  durationDays: number

  destinations: JourneyRelation[]
  places?: JourneyPlace[]
  experiences?: JourneyRelation[]
  travelStyles?: JourneyRelation[]

  heroImage?: MediaItem | null
  gallery?: MediaItem[]

  highlights?: string[]
  itinerary?: JourneyItineraryDay[]

  isFeatured: boolean
  sortOrder: number
  isPublished: boolean

  seo?: JourneySeo

  createdAt?: string
  updatedAt?: string
}

export interface JourneyItineraryPayload {
  day: number
  title: string
  description?: string
  place?: string
  image?: string
}

export interface JourneyPayload {
  title: string
  slug: string
  shortDescription?: string
  overview?: string
  durationDays: number

  destinations: string[]
  places?: string[]
  experiences?: string[]
  travelStyles?: string[]

  heroImage?: string
  gallery?: string[]

  highlights?: string[]
  itinerary?: JourneyItineraryPayload[]

  isFeatured?: boolean
  sortOrder?: number
  isPublished?: boolean

  seo?: {
    title?: string
    description?: string
    ogImage?: string
  }
}

export const useJourneys = () => {
  const { request } = useAdminApi()

  const journeys = useState<Journey[]>(
    'admin-journeys',
    () => [],
  )

  const loading = useState<boolean>(
    'admin-journeys-loading',
    () => false,
  )

  const error = useState<string | null>(
    'admin-journeys-error',
    () => null,
  )

  const getErrorMessage = (
    err: any,
    fallback: string,
  ) => {
    const message =
      err?.data?.message ||
      err?.response?._data?.message ||
      err?.message

    if (Array.isArray(message)) {
      return message.join(', ')
    }

    return message || fallback
  }

  const fetchJourneys = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await request<any>(
        '/admin/journeys',
      )

      journeys.value = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
          ? response.data
          : []
    } catch (err: any) {
      error.value = getErrorMessage(
        err,
        'Unable to load journeys.',
      )

      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchJourney = async (
    id: string,
  ): Promise<Journey> => {
    try {
      const response = await request<any>(
        `/admin/journeys/${id}`,
      )

      return response?.data ?? response
    } catch (err: any) {
      throw new Error(
        getErrorMessage(
          err,
          'Unable to load journey.',
        ),
      )
    }
  }

  const createJourney = async (
    payload: JourneyPayload,
  ): Promise<Journey> => {
    try {
      const response = await request<any>(
        '/admin/journeys',
        {
          method: 'POST',
          body: payload,
        },
      )

      await fetchJourneys()

      return response?.data ?? response
    } catch (err: any) {
      throw new Error(
        getErrorMessage(
          err,
          'Unable to create journey.',
        ),
      )
    }
  }

  const updateJourney = async (
    id: string,
    payload: Partial<JourneyPayload>,
  ): Promise<Journey> => {
    try {
      const response = await request<any>(
        `/admin/journeys/${id}`,
        {
          method: 'PATCH',
          body: payload,
        },
      )

      await fetchJourneys()

      return response?.data ?? response
    } catch (err: any) {
      throw new Error(
        getErrorMessage(
          err,
          'Unable to update journey.',
        ),
      )
    }
  }

  const deleteJourney = async (
    id: string,
  ) => {
    try {
      const response = await request<any>(
        `/admin/journeys/${id}`,
        {
          method: 'DELETE',
        },
      )

      journeys.value =
        journeys.value.filter(
          journey => journey._id !== id,
        )

      return response
    } catch (err: any) {
      throw new Error(
        getErrorMessage(
          err,
          'Unable to delete journey.',
        ),
      )
    }
  }

  return {
    journeys,
    loading,
    error,

    fetchJourneys,
    fetchJourney,
    createJourney,
    updateJourney,
    deleteJourney,
  }
}