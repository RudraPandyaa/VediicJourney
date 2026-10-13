export type EnquiryType =
  | 'journey'
  | 'general'
  | 'flight'
  | 'visa'

export type EnquiryStatus =
  | 'new'
  | 'contacted'
  | 'in_progress'
  | 'converted'
  | 'closed'

export interface EnquiryJourney {
  _id: string
  title: string
  slug: string
}

export interface EnquiryTravelStyle {
  _id: string
  name: string
  slug: string
}

export interface Enquiry {
  _id: string

  type: EnquiryType

  name: string
  email: string

  phone?: string
  country?: string

  destination?: string

  journey?:
    | string
    | EnquiryJourney
    | null

  travelStyle?:
    | string
    | EnquiryTravelStyle
    | null

  travelDate?: string

  duration?: number
  travellers?: number

  message?: string

  departureCity?: string
  arrivalCity?: string

  departureDate?: string
  returnDate?: string

  travelClass?: string
  passengers?: number

  status: EnquiryStatus

  notes?: string

  createdAt?: string
  updatedAt?: string
}

export interface EnquiryPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface EnquiryFilters {
  page?: number
  limit?: number

  status?:
    | EnquiryStatus
    | ''

  type?:
    | EnquiryType
    | ''
}

export interface UpdateEnquiryPayload {
  status?: EnquiryStatus
  notes?: string
}

export const useEnquiries = () => {
  const { request } = useAdminApi()

  const enquiries =
    useState<Enquiry[]>(
      'admin-enquiries',
      () => [],
    )

  const pagination =
    useState<EnquiryPagination>(
      'admin-enquiries-pagination',
      () => ({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      }),
    )

  const loading =
    useState(
      'admin-enquiries-loading',
      () => false,
    )

  const error =
    useState<string | null>(
      'admin-enquiries-error',
      () => null,
    )

  const fetchEnquiries = async (
    filters: EnquiryFilters = {},
  ) => {
    loading.value = true
    error.value = null

    const params =
      new URLSearchParams()

    params.set(
      'page',
      String(filters.page ?? 1),
    )

    params.set(
      'limit',
      String(filters.limit ?? 20),
    )

    if (filters.status) {
      params.set(
        'status',
        filters.status,
      )
    }

    if (filters.type) {
      params.set(
        'type',
        filters.type,
      )
    }

    try {
      const response =
        await request<any>(
          `/admin/enquiries?${params.toString()}`,
        )

      enquiries.value =
        Array.isArray(response?.data)
          ? response.data
          : []

      pagination.value = {
        page:
          response?.pagination?.page ??
          1,

        limit:
          response?.pagination?.limit ??
          20,

        total:
          response?.pagination?.total ??
          0,

        totalPages:
          response?.pagination
            ?.totalPages ?? 0,
      }

      return enquiries.value
    } catch (err: any) {
      error.value =
        err?.data?.message ||
        err?.message ||
        'Unable to load enquiries.'

      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchEnquiry = async (
    id: string,
  ) => {
    const response =
      await request<any>(
        `/admin/enquiries/${id}`,
      )

    return (
      response?.data ??
      response
    ) as Enquiry
  }

  const updateEnquiry = async (
    id: string,
    payload: UpdateEnquiryPayload,
  ) => {
    const response =
      await request<any>(
        `/admin/enquiries/${id}`,
        {
          method: 'PATCH',
          body: payload,
        },
      )

    return (
      response?.data ??
      response
    ) as Enquiry
  }

  const deleteEnquiry = async (
    id: string,
  ) => {
    return request(
      `/admin/enquiries/${id}`,
      {
        method: 'DELETE',
      },
    )
  }

  return {
    enquiries,
    pagination,
    loading,
    error,

    fetchEnquiries,
    fetchEnquiry,
    updateEnquiry,
    deleteEnquiry,
  }
}