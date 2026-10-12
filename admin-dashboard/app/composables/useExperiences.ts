import { useAdminApi } from './useAdminApi'
import type { MediaItem } from './useMedia'

export interface Experience {
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

export interface ExperiencePayload {
  name: string
  slug: string
  shortDescription?: string
  image?: string
  sortOrder?: number
  isPublished?: boolean
}

interface ExperiencesResponse {
  success: boolean
  data: Experience[]
}

interface ExperienceResponse {
  success: boolean
  data: Experience
}

export const useExperiences = () => {
  const { request } = useAdminApi()

  const experiences = ref<Experience[]>([])
  const loading = ref(false)
  const saving = ref(false)
  const deletingId = ref<string | null>(null)
  const error = ref<string | null>(null)

  const fetchExperiences = async () => {
    loading.value = true
    error.value = null

    try {
      const response =
        await request<ExperiencesResponse>(
          '/admin/experiences',
        )

      experiences.value = response.data || []
    } catch (err: any) {
      error.value =
        err?.data?.message ||
        'Unable to load experiences.'
    } finally {
      loading.value = false
    }
  }

  const createExperience = async (
    payload: ExperiencePayload,
  ) => {
    saving.value = true

    try {
      const response =
        await request<ExperienceResponse>(
          '/admin/experiences',
          {
            method: 'POST',
            body: payload,
          },
        )

      await fetchExperiences()

      return response.data
    } finally {
      saving.value = false
    }
  }

  const updateExperience = async (
    id: string,
    payload: Partial<ExperiencePayload>,
  ) => {
    saving.value = true

    try {
      const response =
        await request<ExperienceResponse>(
          `/admin/experiences/${id}`,
          {
            method: 'PATCH',
            body: payload,
          },
        )

      await fetchExperiences()

      return response.data
    } finally {
      saving.value = false
    }
  }

  const deleteExperience = async (
    id: string,
  ) => {
    deletingId.value = id

    try {
      await request(
        `/admin/experiences/${id}`,
        {
          method: 'DELETE',
        },
      )

      experiences.value =
        experiences.value.filter(
          item => item._id !== id,
        )
    } finally {
      deletingId.value = null
    }
  }

  return {
    experiences,
    loading,
    saving,
    deletingId,
    error,

    fetchExperiences,
    createExperience,
    updateExperience,
    deleteExperience,
  }
}