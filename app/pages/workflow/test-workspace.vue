<template>
  <div class="workflow-workspace h-full">
    <div class="p-4 space-y-6">
      <h1 class="text-2xl font-bold text-white mb-4">工作流测试空间</h1>
      
      <!-- 简单工作流测试 -->
      <div class="bg-white rounded-lg p-4">
        <h2 class="text-lg font-semibold mb-4">简单工作流测试</h2>
        <SimpleWorkflowTest />
      </div>
      
      <!-- 原有的测试编辑器 -->
      <div class="bg-white rounded-lg p-4">
        <h2 class="text-lg font-semibold mb-4">基础工作流编辑器</h2>
        <TestWorkflowEditor />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TestWorkflowEditor from '~/components/workflow/test/base/index.vue'
import SimpleWorkflowTest from '~/components/workflow/test/SimpleWorkflowTest.vue'

// 禁用布局，避免样式冲突
definePageMeta({
  layout: false
})

// 设置页面标题
useHead({
  title: '工作流编辑器测试 - PowerX'
})
</script>

<style scoped>
.workflow-workspace {
  width:100%;
  height: 100%;
  background: #1a1a1a;
}
</style>