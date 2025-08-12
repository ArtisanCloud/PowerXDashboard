<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { clearError } from '#app'
import type { NuxtError } from '#app'

// 接收 Nuxt 传入的错误对象
const props = defineProps<{ error: NuxtError | null }>()

// 全局主题状态（保留你的写法）
const theme = useState<'auto' | 'light' | 'dark'>('theme', () => 'auto')

// i18n
const { t } = useI18n()

// 标题（只定义一次）
const errorTitle = computed(() => {
  if (props.error?.statusCode === 404) {
    return t('error.notFound', '页面未找到')
  }
  return props.error?.statusMessage || t('error.occurred', '发生错误')
})

// 行为：返回上一页 / 返回首页
const router = useRouter()

const handleGoBack = () => {
  // 如果没有历史记录就回首页，避免无效 back
  if (history.length > 1) {
    router.back()
  } else {
    clearError({ redirect: '/' })
  }
}

const handleGoHome = () => {
  // 清理错误并重定向到首页
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center">
    <h1 class="text-2xl md:text-3xl font-semibold mb-4">
      {{ errorTitle }}
    </h1>

    <p class="text-gray-500 dark:text-gray-400 mb-8">
      {{ t('error.tip', '请尝试返回或回到首页。') }}
    </p>

    <div class="flex justify-center space-x-4">
      <button
        @click="handleGoBack"
        type="button"
        class="not-prose appearance-none
                px-6 py-2 rounded-lg transition-colors
                !bg-gray-200 dark:!bg-gray-700
                !text-gray-700 dark:!text-gray-200
                hover:!bg-gray-300 dark:hover:!bg-gray-600
                border border-gray-300/70 dark:border-transparent
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
        {{ t('error.goBack', '返回上一页') }}
        </button>
      <button
        @click="handleGoHome"
        type="button"
        class="not-prose appearance-none
                px-6 py-2 rounded-lg transition-colors
                !bg-blue-600 !text-white
                hover:!bg-blue-700
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
        {{ t('error.goHome', '返回首页') }}
        </button>
    </div>
  </div>
</template>
