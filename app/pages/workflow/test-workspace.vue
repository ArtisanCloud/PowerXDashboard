<template>
  <div class="workflow-workspace h-full">
    <WorkflowEditor />
  </div>
</template>

<script setup lang="ts">
import WorkflowEditor from '~/components/workflow/WorkflowEditor.vue'

// 使用工作流布局
definePageMeta({
  layout: 'workflow'
})

// 设置页面标题
useHead({
  title: '工作流编辑器测试 - PowerX'
})
</script>

<style scoped>
.workflow-workspace {
  background: #1a1a1a;
}
</style>