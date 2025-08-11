import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'app',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/icon', '@nuxtjs/i18n'],
  css: ['~/assets/css/main.css', '@/assets/scss/main.scss'],
  compatibilityDate: '2024-11-01',
  ui: { fonts: false },


  // i18n 配置
  i18n: {
    defaultLocale: 'zh',
    locales: [
      { code: 'zh', name: '简体中文', file: 'zh.json' },
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'ja', name: '日本語', file: 'ja.json' },
      { code: 'ko', name: '한국어', file: 'ko.json' }
    ],
    langDir: 'locales',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'no prefix',
      alwaysRedirect: false,
      fallbackLocale: 'zh'
    }
  },

  vite: {
    plugins: [tailwindcss()],      // ✅ 官方 v4 推荐做法
  },
})
