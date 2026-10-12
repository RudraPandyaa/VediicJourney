import {useAdminApi} from './useAdminApi'

export interface MediaItem {
  _id: string
  type: 'image' | 'video'
  filename: string
  url: string
  altText?: string
  mimeType: string
  size: number
  width?: number
  height?: number
  storageKey: string
  createdAt?: string
  updatedAt?: string
}

export const useMedia = () => {
  const { request } = useAdminApi()

  const media = ref<MediaItem[]>([])
  const loading = ref(false)
  const uploading = ref(false)
  const deletingId = ref<string | null>(null)
  const error = ref<string | null>(null)

  const fetchMedia = async () => {
    loading.value = true
    error.value = null

    try {
      const response =
        await request<any>(
          '/admin/media?limit=100',
        )

      if (Array.isArray(response)) {
        media.value = response
      } else if (
        Array.isArray(response?.data)
      ) {
        media.value = response.data
      } else if (
        Array.isArray(response?.data?.data)
      ) {
        media.value = response.data.data
      } else {
        media.value = []
      }
    } catch (err: any) {
      error.value =
        err?.data?.message ||
        'Unable to load media.'
    } finally {
      loading.value = false
    }
  }

  const uploadMedia = async (
    file: File,
    altText = '',
  ) => {
    uploading.value = true
    error.value = null

    try {
      const formData = new FormData()

      formData.append('file', file)

      if (altText.trim()) {
        formData.append(
          'altText',
          altText.trim(),
        )
      }

      const uploaded =
        await request<MediaItem>(
            '/admin/media/upload',
          {
            method: 'POST',
            body: formData,
          },
        )

      await fetchMedia()

      return uploaded
    } catch (err: any) {
      error.value =
        err?.data?.message ||
        'Unable to upload media.'

      throw err
    } finally {
      uploading.value = false
    }
  }

  const deleteMedia = async (
    id: string,
  ) => {
    deletingId.value = id
    error.value = null

    try {
      await request(
        `/admin/media/${id}`,
        {
          method: 'DELETE',
        },
      )

      media.value =
        media.value.filter(
          item => item._id !== id,
        )
    } catch (err: any) {
      error.value =
        err?.data?.message ||
        'Unable to delete media.'

      throw err
    } finally {
      deletingId.value = null
    }
  }

  const formatFileSize = (
    bytes: number,
  ) => {
    if (!bytes) return '0 KB'

    const mb =
      bytes / 1024 / 1024

    if (mb >= 1) {
      return `${mb.toFixed(1)} MB`
    }

    return `${Math.round(
      bytes / 1024,
    )} KB`
  }

  return {
    media,
    loading,
    uploading,
    deletingId,
    error,

    fetchMedia,
    uploadMedia,
    deleteMedia,
    formatFileSize,
  }
}