<template>
  <!-- 使用 Arco Design Pro 的 Spin 组件 -->
  <a-spin v-if="loading" class="fullscreenSpin" dot>
    <template #tip>
      <span class="spinTip">加载中...</span>
    </template>
  </a-spin>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import useLoadingStore from '@/store/modules/loading';

  const loadingStore = useLoadingStore();

  // 从 Pinia 中获取全局 loading 状态
  const loading = computed(() => loadingStore.loading);
</script>

<style scoped lang="less">
  .fullscreenSpin {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.5);
    z-index: 9999;
  }
  .spinTip {
    margin: 12px 0 0 24px; /* 图标与文本的间距 */
    font-size: 14px;
    //color: #666;
  }
</style>
