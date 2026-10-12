import { useApi } from './useApi'
import { useAuth } from './useAuth'

export const useAdminApi = () => {
  const { api } = useApi()
  const { accessToken, refresh } = useAuth()

  const request = async <T>(
    url: string,
    options: any = {},
  ): Promise<T> => {
    const makeRequest = () => {
      return api<T>(url, {
        ...options,

        headers: {
          ...options.headers,

          ...(accessToken.value
            ? {
                Authorization:
                  `Bearer ${accessToken.value}`,
              }
            : {}),
        },
      })
    }

    try {
      return await makeRequest()
    } catch (error: any) {
      if (error?.status !== 401) {
        throw error
      }

      const refreshed = await refresh()

      if (!refreshed) {
        await navigateTo('/login')
        throw error
      }

      return await makeRequest()
    }
  }

  return {
    request,
  }
}