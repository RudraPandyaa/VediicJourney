import { useAuth } from '../composables/useAuth'

export default defineNuxtRouteMiddleware(
  async () => {
    if (import.meta.server) {
      return
    }

    const {
      isAuthenticated,
      restoreSession,
    } = useAuth()

    if (isAuthenticated.value) {
      return
    }

    const restored =
      await restoreSession()

    if (!restored) {
      return navigateTo('/login')
    }
  },
)