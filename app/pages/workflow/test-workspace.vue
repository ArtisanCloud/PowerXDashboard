<template>
  <div class="workflow-workspace w-full h-full flex-grow">
    <TestWorkflowEditor />
    <TestDnDWorkflow />
  </div>
</template>

<script setup lang="ts">
import TestWorkflowEditor from "~/components/workflow/test/base/index.vue";
import TestDnDWorkflow from "~/components/workflow/test/drag-drop/index.vue";

// 禁用布局，避免样式冲突
definePageMeta({
  // layout: false
  layout: "workflow",
});

// 设置页面标题
useHead({
  title: "工作流编辑器测试 - PowerX",
});
</script>

<style scoped>
.workflow-workspace {
  width: 100%;
  height: 100%;
  background: #1a1a1a;
}
</style>
