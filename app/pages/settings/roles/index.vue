<script setup lang="ts">
definePageMeta({
  title: '角色管理',
  icon: 'i-heroicons-shield-check',
  order: 9
})

const { t } = useI18n()
</script>

<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">{{ t('menu.roleManagement') }}</h1>
      <p class="text-gray-600 mt-2">管理系统角色和权限配置</p>
    </div>
    
    <div class="bg-white rounded-lg shadow p-6">
      <div class="text-center py-12">
        <UIcon name="i-heroicons-shield-check" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">角色管理</h3>
        <p class="text-gray-500">角色管理功能正在开发中...</p>
      </div>
    </div>
  </div>
</template>