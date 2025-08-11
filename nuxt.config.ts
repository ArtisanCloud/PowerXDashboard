export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  compatibilityDate: '2024-11-01',
  
  // 禁用字体获取，避免Google Fonts警告
  ui: {
    fonts: false
  }
})