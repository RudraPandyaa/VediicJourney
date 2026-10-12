export default defineNuxtConfig({
  compatibilityDate: '2026-09-15',

  devtools: {
    enabled: true
  },

  modules: [
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/eslint',
    '@vueuse/nuxt'
  ],

  css: [
    '~/assets/scss/main.scss'
  ],

  fonts: {
    families: [
      {
        name: 'Cormorant Garamond',
        provider: 'google',
        weights: [400, 500, 600]
      },
      {
        name: 'Manrope',
        provider: 'google',
        weights: [400, 500, 600]
      }
    ]
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1'
        }
      ]
    }
  }
})