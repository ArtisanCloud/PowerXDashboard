<template>
  <div class="workflow-workspace h-full">
    <TestWorkflowEditor />
  </div>
</template>

<script setup lang="ts">
import TestWorkflowEditor from '~/components/workflow/test/SimpleWorkflowTest.vue'

// 使用工作流布局
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
  width:800px;
  height: 800px;
  background: #1a1a1a;
}
</style>