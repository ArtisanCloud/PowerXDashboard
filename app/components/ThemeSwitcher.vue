<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import { ref, watch, onMounted, computed } from 'vue'
import '~/assets/css/theme.css'

// 创建全局状态
const themeState = useState('theme', () => 'auto')

// 主题选项
const themes = [
  { value: 'light', label: '浅色', icon: 'i-heroicons-sun' },
  { value: 'dark', label: '深色', icon: 'i-heroicons-moon' },
  { value: 'auto', label: '自动', icon: 'i-heroicons-computer-desktop' }
]

// 初始化主题
onMounted(() => {
  if (process.client) {
    // 从本地存储获取主题设置
    const savedTheme = localStorage.getItem('theme') || 'auto'
    themeState.value = savedTheme
    applyTheme(savedTheme)
  }
})

// 监听主题变化
watch(themeState, (newTheme) => {
  if (process.client) {
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
    
    // 触发自定义事件，通知其他组件主题已更改
    window.dispatchEvent(new CustomEvent('theme-changed', { detail: newTheme }))
  }
})

// 应用主题
function applyTheme(theme: string) {
  if (!process.client) return
  
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
    
    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      if (themeState.value === 'auto') {
        if (e.matches) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
    }
    
    // 移除旧的监听器（避免重复添加）
    try {
      mediaQuery.removeEventListener('change', handleChange as any)
    } catch (e) {
      // 某些旧浏览器可能不支持 removeEventListener
      console.log('无法移除事件监听器', e)
    }
    
    try {
      mediaQuery.addEventListener('change', handleChange as any)
    } catch (e) {
      // 某些旧浏览器可能使用不同的 API
      try {
        // 尝试旧的 API
        mediaQuery.addListener(handleChange as any)
      } catch (e2) {
        console.log('无法添加事件监听器', e2)
      }
    }
  } else if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// 获取当前主题图标
const currentThemeIcon = computed(() => {
  const theme = themes.find(t => t.value === themeState.value)
  return theme ? theme.icon : 'i-heroicons-sun'
})

// 下拉菜单项
const items = computed<DropdownMenuItem[][]>(() => [
  [{ label: '主题设置', type: 'label' }],
  themes.map(theme => ({
    label: theme.label,
    icon: theme.icon,
    active: themeState.value === theme.value,
    suffix: themeState.value === theme.value ? 'i-heroicons-check-20-solid' : undefined,
    onSelect: () => {
      themeState.value = theme.value
    }
  }))
])
</script>

<template>
  <UDropdownMenu :items="items">
    <UButton variant="ghost" size="sm" class="flex items-center gap-2">
      <UIcon :name="currentThemeIcon" class="w-5 h-5" />
      <span class="hidden sm:inline ml-1">主题</span>
      <UIcon name="i-heroicons-chevron-down-20-solid" class="w-4 h-4" />
    </UButton>
  </UDropdownMenu>
</template>
