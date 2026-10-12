import { useApi } from '~/composables/useApi'

export interface AdminUser {
  id: string
  name: string
  email: string
  role?: string
}

interface LoginResponse {
  success: boolean
  accessToken: string
  admin: AdminUser
}

interface RefreshResponse {
  success: boolean
  accessToken: string
}

interface MeResponse {
  success: boolean
  admin: AdminUser
}

export const useAuth = () => {
  const { api } = useApi()

  const accessToken = useState<string | null>(
    'admin-access-token',
    () => null,
  )

  const admin = useState<AdminUser | null>(
    'admin-user',
    () => null,
  )

  const authInitialized = useState<boolean>(
    'admin-auth-initialized',
    () => false,
  )

  const isAuthenticated = computed(() => {
    return Boolean(
      accessToken.value &&
      admin.value,
    )
  })

  const login = async (
    email: string,
    password: string,
  ) => {
    const response =
      await api<LoginResponse>(
        '/admin/auth/login',
        {
          method: 'POST',

          body: {
            email,
            password,
          },
        },
      )

    accessToken.value =
      response.accessToken

    admin.value =
      response.admin

    authInitialized.value = true

    return response
  }

  const fetchMe = async () => {
    if (!accessToken.value) {
      return false
    }

    try {
      const response =
        await api<MeResponse>(
          '/admin/auth/me',
          {
            method: 'GET',

            headers: {
              Authorization:
                `Bearer ${accessToken.value}`,
            },
          },
        )

      admin.value = response.admin

      return true
    } catch {
      admin.value = null

      return false
    }
  }

  const refresh = async () => {
    try {
      const response =
        await api<RefreshResponse>(
          '/admin/auth/refresh',
          {
            method: 'POST',
          },
        )

      accessToken.value =
        response.accessToken

      return true
    } catch {
      accessToken.value = null
      admin.value = null

      return false
    }
  }

  const restoreSession = async () => {
    if (
      accessToken.value &&
      admin.value
    ) {
      authInitialized.value = true
      return true
    }

    const refreshed =
      await refresh()

    if (!refreshed) {
      authInitialized.value = true
      return false
    }

    const userLoaded =
      await fetchMe()

    authInitialized.value = true

    if (!userLoaded) {
      accessToken.value = null
      admin.value = null

      return false
    }

    return true
  }

  const logout = async () => {
    try {
      if (accessToken.value) {
        await api(
          '/admin/auth/logout',
          {
            method: 'POST',

            headers: {
              Authorization:
                `Bearer ${accessToken.value}`,
            },
          },
        )
      }
    } catch {
      // Clear frontend session even if
      // backend logout request fails.
    } finally {
      accessToken.value = null
      admin.value = null
      authInitialized.value = true

      await navigateTo('/login')
    }
  }

  const getAuthHeaders = () => {
    if (!accessToken.value) {
      return {}
    }

    return {
      Authorization:
        `Bearer ${accessToken.value}`,
    }
  }

  return {
    accessToken,
    admin,
    authInitialized,

    isAuthenticated,

    login,
    logout,
    refresh,
    fetchMe,
    restoreSession,
    getAuthHeaders,
  }
}