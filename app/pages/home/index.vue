<script setup lang="ts">
definePageMeta({
  alias: ['/'],   // 让 /home 这个页面同时匹配 "/"
  layout: false   // 禁用layout
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
    <!-- 顶部Logo区域 -->
    <div class="flex justify-between items-center p-6">
      <!-- Logo -->
      <div class="flex items-center">
        <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          PowerX
        </h1>
      </div>
      
      <!-- 登录注册按钮 -->
      <div class="flex items-center space-x-4">
        <UButton 
          variant="ghost" 
          to="/users/login"
          class="text-gray-700 hover:text-blue-600"
        >
          登录
        </UButton>
        <UButton 
          to="/users/register"
          class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          注册
        </UButton>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="flex-1 flex items-center justify-center px-6">
      <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- 左侧信息区域 -->
        <div class="text-center lg:text-left">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            欢迎来到
            <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
              PowerX
            </span>
          </h1>
          <p class="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            新一代企业级管理平台<br>
            让您的业务管理更加高效、智能、安全
          </p>
          
          <!-- CTA 按钮 -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <UButton 
              size="xl" 
              to="/users/register"
              class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 text-lg"
            >
              立即开始
            </UButton>
            <UButton 
              variant="outline" 
              size="xl"
              to="/home/intro"
              class="px-8 py-4 text-lg border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600"
            >
              了解更多
            </UButton>
          </div>
        </div>
        
        <!-- 右侧大图区域 -->
        <div class="relative">
          <div class="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
            <div class="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl h-80 md:h-96 flex items-center justify-center relative overflow-hidden">
              <!-- 主要图标 -->
              <div class="text-center z-10">
                <div class="text-8xl mb-6">🚀</div>
                <h3 class="text-2xl md:text-3xl font-bold text-gray-800 mb-3">PowerX Dashboard</h3>
                <p class="text-gray-600 text-lg">现代化的管理界面</p>
              </div>
              
              <!-- 装饰性图形元素 -->
              <div class="absolute top-4 left-4 w-16 h-16 bg-blue-200 rounded-full opacity-60"></div>
              <div class="absolute top-8 right-8 w-12 h-12 bg-purple-200 rounded-full opacity-60"></div>
              <div class="absolute bottom-6 left-8 w-20 h-20 bg-indigo-200 rounded-full opacity-40"></div>
              <div class="absolute bottom-4 right-4 w-14 h-14 bg-pink-200 rounded-full opacity-50"></div>
              
              <!-- 网格背景 -->
              <div class="absolute inset-0 opacity-10">
                <div class="grid grid-cols-8 grid-rows-6 h-full w-full">
                  <div v-for="i in 48" :key="i" class="border border-gray-400"></div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 外部装饰元素 -->
          <div class="absolute -top-6 -left-6 w-32 h-32 bg-blue-200 rounded-full opacity-30 animate-pulse"></div>
          <div class="absolute -bottom-6 -right-6 w-40 h-40 bg-purple-200 rounded-full opacity-30 animate-pulse delay-1000"></div>
        </div>
      </div>
    </div>

    <!-- 底部简单信息 -->
    <div class="text-center py-8 px-6">
      <p class="text-gray-500 text-sm">
        &copy; 2024 PowerX. 让管理更简单，让业务更高效
      </p>
    </div>
  </div>
</template>

<style scoped>
/* 自定义动画 */
@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
}

.animate-pulse {
  animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.delay-1000 {
  animation-delay: 1.5s;
}
</style>
