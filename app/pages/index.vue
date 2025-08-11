<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-4xl mx-auto">
      <!-- 标题 -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          PowerX Admin 管理后台
        </h1>
        <p class="text-lg text-gray-600">
          基于 Nuxt 4 构建的现代化管理系统
        </p>
      </div>

      <!-- 测试基础样式 -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">基础样式测试</h2>
        <p class="text-gray-600 mb-4">
          如果您能看到这个白色卡片有阴影和圆角，说明 Tailwind CSS 正常工作。
        </p>
        
        <!-- 按钮测试 -->
        <div class="flex gap-4 mb-6">
          <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors">
            蓝色按钮
          </button>
          <button class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors">
            绿色按钮
          </button>
          <button class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors">
            红色按钮
          </button>
        </div>
      </div>

      <!-- 测试 Nuxt UI 组件 -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">Nuxt UI 组件测试</h2>
        
        <!-- UCard 测试 -->
        <UCard class="mb-4">
          <template #header>
            <h3 class="text-lg font-semibold">UCard 组件</h3>
          </template>
          <p class="text-gray-600">如果这个卡片显示正常，说明 UCard 组件工作正常。</p>
        </UCard>

        <!-- UButton 测试 -->
        <div class="flex gap-4 mb-4">
          <UButton color="primary">UButton 主要</UButton>
          <UButton color="green">UButton 绿色</UButton>
          <UButton color="red" variant="outline">UButton 红色</UButton>
        </div>

        <!-- UBadge 测试 -->
        <div class="flex gap-2 mb-4">
          <UBadge color="blue">蓝色徽章</UBadge>
          <UBadge color="green">绿色徽章</UBadge>
          <UBadge color="yellow">黄色徽章</UBadge>
        </div>
      </div>

      <!-- 状态信息 -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-center">
          <div class="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
          <div>
            <h3 class="text-blue-800 font-semibold">测试状态</h3>
            <p class="text-blue-600">
              如果您能看到所有样式都正确显示，说明系统配置成功！
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'PowerX Admin - 首页'
})
</script>