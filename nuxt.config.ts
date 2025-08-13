import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  runtimeConfig: {
    // 仅服务端可见
    upstream: process.env.UPSTREAM || 'http://127.0.0.1:8077',    // 你的后端基础域名
    wsUpstream: process.env.WS_UPSTREAM || 'ws://127.0.0.1:3001', // 你的 WS 服务
    public: {
      apiBase: '/api/v1', // 前端仍然请求 /api/v1/**，由我们在 server 里转发
      wsUrl: '/ws'        // 如果要同域 WS，可再配反代；暂时可用你现有的 ws://localhost:3001/ws
    }
  },
  srcDir: 'app',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/icon', '@nuxtjs/i18n'],
  css: ['~/assets/css/main.css', '@/assets/scss/main.scss'],
  compatibilityDate: '2024-11-01',
  ui: { fonts: false },

  components: [{ path: '~/components', pathPrefix: false }],

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
