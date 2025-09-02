import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  router: {
    options: {
      strict: true, // 将 strict 设为 false
    },
  },
  runtimeConfig: {
    // 仅服务端可见
    upstream: process.env.UPSTREAM || "http://127.0.0.1:8077", // 你的后端基础域名
    wsUpstream: process.env.WS_UPSTREAM || "ws://127.0.0.1:8077", // 你的 WS 服务
    public: {
      // 注意这里直接给"完整前缀"，包含 /api
      wsUpstream: process.env.WS_UPSTREAM || "ws://127.0.0.1:8077/api",
      apiBase: "/api", // 前端请求 /api/**，对应后台的 /api/**
      wsUrl: "/ws", // 如果要同域 WS，可再配反代；暂时可用你现有的 ws://localhost:3001/ws

      // 语言配置
      defaultLanguage: process.env.NUXT_DEFAULT_LANGUAGE || "zh",
      availableLanguages: process.env.NUXT_AVAILABLE_LANGUAGES || "zh,en,ja,ko",
      forceLanguage: process.env.NUXT_FORCE_LANGUAGE || undefined,
      enableLanguageSwitch: process.env.NUXT_ENABLE_LANGUAGE_SWITCH !== "false",

      // 主题配置
      defaultTheme: process.env.NUXT_DEFAULT_THEME || "auto",
      availableThemes: process.env.NUXT_AVAILABLE_THEMES || "light,dark,auto",
      forceTheme: process.env.NUXT_FORCE_THEME || undefined,
      enableThemeSwitch: process.env.NUXT_ENABLE_THEME_SWITCH !== "false",

      // 应用配置
      appName: process.env.NUXT_APP_NAME || "PowerX Admin",
      appVersion: process.env.NUXT_APP_VERSION || "1.0.0",
      debugMode: process.env.NUXT_DEBUG_MODE === "true",

      // 功能开关
      enableUserPreferences:
        process.env.NUXT_ENABLE_USER_PREFERENCES !== "false",
    },
  },

  // 添加开发服务器代理配置
  nitro: {
    routeRules: {
      "/__up/_p/**": { proxy: "http://127.0.0.1:8077/_p/**" },

      // 这个是后端页面里请求的地址，所以需要套一层代理
      "/_p/**": { proxy: "http://127.0.0.1:8077/_p/**" },
    },
    devProxy: {
      "/api/_nuxt_icon": {},
      "/api/": {
        target: "http://127.0.0.1:8077/api",
        changeOrigin: true,
        prependPath: true,
        ws: true, // 必须：让 dev 代理支持 WebSocket
      },
    },
  },
  srcDir: "app",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxt/icon", "@nuxtjs/i18n", "@pinia/nuxt"],
  css: ["~/assets/css/main.css", "@/assets/scss/main.scss"],
  compatibilityDate: "2024-11-01",
  ui: { fonts: false },
  icon: {
    // 即使是 SPA 也强制走本地 server 端点（/_icon）
    provider: "server",
    // 如需自定义缓存或前缀，再加 server 相关配置
  },

  // i18n 配置
  i18n: {
    defaultLocale: process.env.NUXT_DEFAULT_LANGUAGE || "zh",
    locales: [
      { code: "zh", name: "简体中文", file: "zh.json" },
      { code: "en", name: "English", file: "en.json" },
      { code: "ja", name: "日本語", file: "ja.json" },
      { code: "ko", name: "한국어", file: "ko.json" },
    ],
    langDir: "locales",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "no prefix",
      alwaysRedirect: false,
      fallbackLocale: process.env.NUXT_DEFAULT_LANGUAGE || "zh",
    },
  },

  vite: {
    plugins: [tailwindcss()], // ✅ 官方 v4 推荐做法
  },
});
