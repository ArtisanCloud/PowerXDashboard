<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useWindowSize } from '../composables/useWindowSize'

// 侧边栏折叠状态
const sidebarCollapsed = ref(false)

// 切换侧边栏状态
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

// 响应式处理
const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)

// 移动端自动折叠侧边栏
watch(isMobile, (mobile) => {
  if (mobile) {
    sidebarCollapsed.value = true
  }
})

// 移动端遮罩层
const showMobileOverlay = computed(() => isMobile.value && !sidebarCollapsed.value)

// 点击遮罩层关闭侧边栏
const closeMobileSidebar = () => {
  if (isMobile.value) {
    sidebarCollapsed.value = true
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- 移动端遮罩层 -->
    <div 
      v-if="showMobileOverlay"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
      @click="closeMobileSidebar"
    />

    <!-- 侧边栏 -->
    <div 
      class="fixed md:relative z-50 h-full transition-transform duration-300 ease-in-out"
      :class="[
        sidebarCollapsed ? '-translate-x-full md:translate-x-0' : 'translate-x-0',
        sidebarCollapsed ? 'md:w-16' : 'md:w-64'
      ]"
    >
      <div class="h-full">
        <Sidebar :collapsed="sidebarCollapsed" />
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- 顶部导航 -->
      <div class="sticky top-0 z-30">
        <Header @toggle-sidebar="toggleSidebar" />
      </div>

      <!-- 页面内容 -->
      <main class="flex-1 overflow-auto">
        <div class="p-6">
          <!-- 页面标题区域 -->
          <div v-if="$route.meta.title" class="mb-6">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-2xl font-bold text-gray-900">
                  {{ $route.meta.title }}
                </h1>
                <p v-if="$route.meta.description" class="mt-1 text-sm text-gray-600">
                  {{ $route.meta.description }}
                </p>
              </div>
              
              <!-- 页面操作按钮区域 -->
              <div v-if="$route.meta.actions" class="flex items-center space-x-3">
                <slot name="page-actions" />
              </div>
            </div>
          </div>

          <!-- 主要内容插槽 -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <slot />
          </div>
        </div>
      </main>

      <!-- 页脚 -->
      <footer class="bg-white border-t border-gray-200 px-6 py-4">
        <div class="flex items-center justify-between text-sm text-gray-600">
          <div>
            © 2024 PowerX. {{ $t('home.footer') }}
          </div>
          <div class="flex items-center space-x-4">
            <a href="#" class="hover:text-gray-900">{{ $t('intro.footer.aboutUs') }}</a>
            <a href="#" class="hover:text-gray-900">{{ $t('intro.footer.contactUs') }}</a>
            <a href="#" class="hover:text-gray-900">{{ $t('privacyPolicy') }}</a>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped>
/* 确保布局在不同屏幕尺寸下正常工作 */
@media (max-width: 767px) {
  .sidebar-collapsed {
    transform: translateX(-100%);
  }
}
</style>