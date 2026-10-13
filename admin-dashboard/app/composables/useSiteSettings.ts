export interface SettingsMedia {
  _id: string
  url: string
  altText?: string
  width?: number
  height?: number
}

export interface SocialLinks {
  instagram?: string
  facebook?: string
  youtube?: string
  linkedin?: string
}

export interface GlobalSeo {
  title?: string
  description?: string
  ogImage?: string | SettingsMedia | null
}

export interface SiteSettings {
  _id?: string
  key: string
  logo?: string | SettingsMedia | null
  email: string
  phone: string
  whatsapp: string
  address: string
  socialLinks: SocialLinks
  seo: GlobalSeo
  footerText: string
  createdAt?: string
  updatedAt?: string
}

export interface UpdateSiteSettingsPayload {
  logo?: string
  email?: string
  phone?: string
  whatsapp?: string
  address?: string

  socialLinks?: {
    instagram?: string
    facebook?: string
    youtube?: string
    linkedin?: string
  }

  seo?: {
    title?: string
    description?: string
    ogImage?: string
  }

  footerText?: string
}

export const useSiteSettings = () => {
  const { request } = useAdminApi()

  const settings = useState<SiteSettings | null>(
    'admin-site-settings',
    () => null,
  )

  const loading = useState(
    'admin-site-settings-loading',
    () => false,
  )

  const saving = useState(
    'admin-site-settings-saving',
    () => false,
  )

  const error = useState<string | null>(
    'admin-site-settings-error',
    () => null,
  )

  const fetchSettings = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await request<any>(
        '/admin/site-settings',
      )

      settings.value =
        response?.data ?? response

      return settings.value
    } catch (err: any) {
      error.value =
        err?.data?.message ||
        err?.message ||
        'Unable to load site settings.'

      throw err
    } finally {
      loading.value = false
    }
  }

  const updateSettings = async (
    payload: UpdateSiteSettingsPayload,
  ) => {
    saving.value = true
    error.value = null

    try {
      const response = await request<any>(
        '/admin/site-settings',
        {
          method: 'PATCH',
          body: payload,
        },
      )

      settings.value =
        response?.data ?? response

      return settings.value
    } catch (err: any) {
      error.value =
        Array.isArray(err?.data?.message)
          ? err.data.message.join(', ')
          : err?.data?.message ||
            err?.message ||
            'Unable to save site settings.'

      throw err
    } finally {
      saving.value = false
    }
  }

  return {
    settings,
    loading,
    saving,
    error,
    fetchSettings,
    updateSettings,
  }
}