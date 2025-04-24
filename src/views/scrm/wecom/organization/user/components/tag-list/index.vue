<script setup lang="ts">
  import { onMounted } from 'vue';
  import useWeComUserStore from '@/store/modules/scrm/wecom/user';
  import styles from './index.module.less';

  const useWeComUser = useWeComUserStore();

  onMounted(async () => {
    // 默认拉取根目录的部门树
    await useWeComUser.loadTagList();
    // 加载完部部树后，设置默认选中的部门
    await useWeComUser.setSelectedTag(1);
  });
</script>

<template>
  <div :class="styles.container"></div>
</template>

<style scoped></style>
