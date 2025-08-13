<script setup lang="ts">
definePageMeta({
  title: '系统配置',
  icon: 'i-heroicons-wrench-screwdriver',
  order: 10
})

const { t } = useI18n()
</script>

<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">{{ t('menu.systemConfig') }}</h1>
      <p class="text-gray-600 mt-2">系统参数和配置管理</p>
    </div>
    
    <div class="bg-white rounded-lg shadow p-6">
      <div class="text-center py-12">
        <UIcon name="i-heroicons-wrench-screwdriver" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">系统配置</h3>
        <p class="text-gray-500">系统配置功能正在开发中...</p>
      </div>
    </div>
  </div>
</template>