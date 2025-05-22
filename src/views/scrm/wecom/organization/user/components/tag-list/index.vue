<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import useWeComUserStore from '@/store/modules/scrm/wecom/user';
  import { consola } from 'consola';
  import styles from './index.module.less';

  const useWeComUser = useWeComUserStore();
  const selectedTag = ref<number | null>(null);

  const handleSelectTag = (tagId: number) => {
    consola.log(tagId);
    selectedTag.value = tagId;
    // 这里可以添加其他业务逻辑
  };

  onMounted(async () => {
    // 默认拉取根目录的部门树
    await useWeComUser.loadTagList();
    // 加载完部部树后，设置默认选中的部门
    selectedTag.value = 1; // 初始化选中状态

    await useWeComUser.setSelectedTag(selectedTag.value);
  });
</script>

<template>
  <div :class="styles.container">
    <div
      v-for="item in useWeComUser.tagList"
      :key="item.tagId"
      :class="[styles.row, { [styles.selected]: selectedTag === item.tagId }]"
      @click="handleSelectTag(item.tagId)"
    >
      <div :class="styles.left">
        <icon-tag :class="styles.icon" />
        <span :class="styles.title">{{ item.name }}</span>
      </div>
      <div :class="styles.action"> <icon-more-vertical /> </div>
    </div>
  </div>
</template>
