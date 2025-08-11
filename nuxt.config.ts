import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'app',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/icon'],           // ✅ 保留 Nuxt UI，移除 @nuxtjs/tailwindcss
  css: ['~/assets/css/main.css', '@/assets/scss/main.scss'],
  compatibilityDate: '2024-11-01',
  ui: { fonts: false },

  vite: {
    plugins: [tailwindcss()],      // ✅ 官方 v4 推荐做法
  },
})
