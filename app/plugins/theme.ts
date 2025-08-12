// 全局主题插件
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  // 在客户端初始化主题
  if (process.client) {
    // 从本地存储获取主题设置
    const savedTheme = localStorage.getItem('theme') || 'auto'
    
    // 应用主题
    applyTheme(savedTheme)
    
    // 监听系统主题变化
    if (savedTheme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e: MediaQueryListEvent) => {
        if (e.matches) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
      
      try {
        // 现代浏览器
        mediaQuery.addEventListener('change', handleChange)
      } catch (e) {
        try {
          // 旧浏览器
          mediaQuery.addListener(handleChange as any)
        } catch (e2) {
          console.log('无法添加事件监听器', e2)
        }
      }
    }
  }
})

// 应用主题函数
function applyTheme(theme: string) {
  // 移除所有主题相关的类
  document.documentElement.classList.remove('dark', 'light', 'auto')
  
  if (theme === 'auto') {
    // 添加自动主题类
    document.documentElement.classList.add('auto')
    
    // 自动模式根据系统偏好设置
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  } else if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}