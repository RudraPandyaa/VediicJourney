export interface TrustMedia {
  _id: string
  url: string
  altText?: string
  width?: number
  height?: number
}

export interface Testimonial {
  _id: string
  name: string
  country?: string
  journey?: string
  quote: string
  rating?: number
  image?: string | TrustMedia | null
  isFeatured: boolean
  sortOrder: number
  isPublished: boolean
  createdAt?: string
  updatedAt?: string
}

export interface TestimonialPayload {
  name: string
  country?: string
  journey?: string
  quote: string
  rating?: number
  image?: string
  isFeatured?: boolean
  sortOrder?: number
  isPublished?: boolean
}

export type CertificateType =
  | 'certificate'
  | 'award'
  | 'membership'
  | 'association'

export interface Certificate {
  _id: string
  title: string
  type: CertificateType
  organization?: string
  description?: string
  image: string | TrustMedia
  externalUrl?: string
  sortOrder: number
  isPublished: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CertificatePayload {
  title: string
  type: CertificateType
  organization?: string
  description?: string
  image: string
  externalUrl?: string
  sortOrder?: number
  isPublished?: boolean
}

export const useTrustContent = () => {
  const { request } = useAdminApi()

  const testimonials = useState<Testimonial[]>(
    'admin-testimonials',
    () => [],
  )

  const certificates = useState<Certificate[]>(
    'admin-certificates',
    () => [],
  )

  const loading = useState(
    'admin-trust-loading',
    () => false,
  )

  const error = useState<string | null>(
    'admin-trust-error',
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

    return []
  }

  const normalizeItem = <T>(
    response: any,
  ): T => {
    return response?.data ?? response
  }

  const fetchTestimonials = async () => {
    loading.value = true
    error.value = null

    try {
      const response =
        await request<any>(
          '/admin/testimonials',
        )

      testimonials.value =
        normalizeList<Testimonial>(
          response,
        )

      return testimonials.value
    } catch (err: any) {
      error.value =
        err?.data?.message ||
        'Unable to load testimonials.'

      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchTestimonial = async (
    id: string,
  ) => {
    const response =
      await request<any>(
        `/admin/testimonials/${id}`,
      )

    return normalizeItem<Testimonial>(
      response,
    )
  }

  const createTestimonial = async (
    payload: TestimonialPayload,
  ) => {
    return request(
      '/admin/testimonials',
      {
        method: 'POST',
        body: payload,
      },
    )
  }

  const updateTestimonial = async (
    id: string,
    payload: Partial<TestimonialPayload>,
  ) => {
    return request(
      `/admin/testimonials/${id}`,
      {
        method: 'PATCH',
        body: payload,
      },
    )
  }

  const deleteTestimonial = async (
    id: string,
  ) => {
    return request(
      `/admin/testimonials/${id}`,
      {
        method: 'DELETE',
      },
    )
  }

  const fetchCertificates = async () => {
    loading.value = true
    error.value = null

    try {
      const response =
        await request<any>(
          '/admin/certificates',
        )

      certificates.value =
        normalizeList<Certificate>(
          response,
        )

      return certificates.value
    } catch (err: any) {
      error.value =
        err?.data?.message ||
        'Unable to load certificates.'

      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchCertificate = async (
    id: string,
  ) => {
    const response =
      await request<any>(
        `/admin/certificates/${id}`,
      )

    return normalizeItem<Certificate>(
      response,
    )
  }

  const createCertificate = async (
    payload: CertificatePayload,
  ) => {
    return request(
      '/admin/certificates',
      {
        method: 'POST',
        body: payload,
      },
    )
  }

  const updateCertificate = async (
    id: string,
    payload: Partial<CertificatePayload>,
  ) => {
    return request(
      `/admin/certificates/${id}`,
      {
        method: 'PATCH',
        body: payload,
      },
    )
  }

  const deleteCertificate = async (
    id: string,
  ) => {
    return request(
      `/admin/certificates/${id}`,
      {
        method: 'DELETE',
      },
    )
  }

  return {
    testimonials,
    certificates,
    loading,
    error,

    fetchTestimonials,
    fetchTestimonial,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,

    fetchCertificates,
    fetchCertificate,
    createCertificate,
    updateCertificate,
    deleteCertificate,
  }
}