<script setup lang="ts">
  import { onMounted } from 'vue';
  import useWeComUserStore from '@/store/modules/scrm/wecom/user';

  import {
    listWeComUsersPage,
    listWeComUsersPageRequest,
  } from '@/api/scrm/wecom/user';
  import styles from './index.module.less';

  const useWeComUser = useWeComUserStore();

  const handleSelectTag = async (tagId: number) => {
    // 这里可以添加其他业务逻辑
    const res = await listWeComUsersPage({
      weComTagId: tagId,
    } as listWeComUsersPageRequest);
    if (res) {
      useWeComUser.tagUserList = res.data.list || [];
    }
  };

  onMounted(async () => {
    // 默认拉取根目录的部门树
    await useWeComUser.loadTagList();
    // 加载完部部树后，设置默认选中的部门

    await useWeComUser.setSelectedTag(1);
  });
</script>

<template>
  <div :class="styles.container">
    <div
      v-for="item in useWeComUser.tagList"
      :key="item.tagId"
      :class="[
        styles.row,
        { [styles.selected]: useWeComUser.selectedTag === item.tagId },
      ]"
      @click="handleSelectTag(item.id!)"
    >
      <div :class="styles.left">
        <icon-tag :class="styles.icon" />
        <span :class="styles.title">{{ item.name }}</span>
      </div>
      <div :class="styles.action"> <icon-more-vertical /> </div>
    </div>
  </div>
</template>
