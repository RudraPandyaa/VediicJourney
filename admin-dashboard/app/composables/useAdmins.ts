import { useAdminApi } from '~/composables/useAdminApi'

export type AdminStatus =
  | 'invited'
  | 'active'
  | 'disabled'

export interface AdminMember {
  id: string
  name: string
  email: string
  isActive: boolean
  status: AdminStatus
  lastLoginAt: string | null
  inviteExpiresAt: string | null
  createdAt: string
  updatedAt: string
}

interface AdminListResponse {
  success: boolean
  data: AdminMember[]
}

interface InviteAdminResponse {
  success: boolean
  message: string
  data: AdminMember
}

interface StatusResponse {
  success: boolean
  message: string
  data: AdminMember
}

export const useAdmins = () => {
  const { request } = useAdminApi()

  const admins = useState<AdminMember[]>(
    'admin-members',
    () => [],
  )

  const loading = useState<boolean>(
    'admin-members-loading',
    () => false,
  )

  const fetchAdmins = async () => {
    loading.value = true

    try {
      const response =
        await request<AdminListResponse>(
          '/admin/admins',
          {
            method: 'GET',
          },
        )

      admins.value = response.data

      return response
    } finally {
      loading.value = false
    }
  }

  const inviteAdmin = async (
    name: string,
    email: string,
  ) => {
    const response =
      await request<InviteAdminResponse>(
        '/admin/admins/invite',
        {
          method: 'POST',

          body: {
            name,
            email,
          },
        },
      )

    await fetchAdmins()

    return response
  }

  const updateAdminStatus = async (
    id: string,
    isActive: boolean,
  ) => {
    const response =
      await request<StatusResponse>(
        `/admin/admins/${id}/status`,
        {
          method: 'PATCH',

          body: {
            isActive,
          },
        },
      )

    await fetchAdmins()

    return response
  }

  return {
    admins,
    loading,

    fetchAdmins,
    inviteAdmin,
    updateAdminStatus,
  }
}