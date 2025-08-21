import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  runtimeConfig: {
    // 仅服务端可见
    upstream: process.env.UPSTREAM || "http://127.0.0.1:8077", // 你的后端基础域名
    wsUpstream: process.env.WS_UPSTREAM || "ws://127.0.0.1:3001", // 你的 WS 服务
    public: {
      apiBase: "/api", // 前端请求 /api/**，对应后台的 /api/**
      wsUrl: "/ws", // 如果要同域 WS，可再配反代；暂时可用你现有的 ws://localhost:3001/ws
    },
  },

  // 添加开发服务器代理配置
  nitro: {
    devProxy: {
      "/api": {
        target: "http://127.0.0.1:8077/api",
        changeOrigin: true,
        prependPath: true,
        onRequest(req) {
          console.log(`[代理请求] ${req.method} ${req.url}`);
        },
        onResponse(req, res) {
          console.log(
            `[代理响应] ${req.method} ${req.url} - 状态码: ${res.statusCode}`
          );
        },
      },
    },
  },
  srcDir: "app",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxt/icon", "@nuxtjs/i18n"],
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
    defaultLocale: "zh",
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
      fallbackLocale: "zh",
    },
  },

  vite: {
    plugins: [tailwindcss()], // ✅ 官方 v4 推荐做法
  },
});
