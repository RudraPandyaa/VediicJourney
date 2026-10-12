export default defineNuxtConfig({
  compatibilityDate: '2026-10-12',

  devtools: {
    enabled: true,
  },

  css: [
    '~/assets/css/main.css',
  ],

  runtimeConfig: {
    public: {
      apiBaseUrl:
        process.env.NUXT_PUBLIC_API_BASE_URL ||
        'http://localhost:4000/api/v1',
    },
  },
})