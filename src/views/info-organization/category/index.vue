<template>
  <div class="container">
    <a-card>
      <a-space size="large">
        <a-button type="primary" @click="openAddCategory()">新增类别 </a-button>
      </a-space>
    </a-card>
    <br />
    <a-card>
      <CategoryTree ref="RefTree" />
    </a-card>
    <a-drawer
      v-model:visible="state.createCategory.visible"
      width="500px"
      ok-text="关闭抽屉"
      :hide-cancel="true"
    >
      <CreateCategory
        v-if="state.createCategory.visible"
        @submit-success="refreshTree"
      />
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import CategoryTree from '@/views/info-organization/category/components/category-tree.vue';
  import CreateCategory from '@/views/info-organization/category/components/create-category.vue';

  const RefTree = ref<any>();

  const state = reactive({
    createCategory: {
      visible: false,
      parentNode: {},
    },
  });

  const openAddCategory = () => {
    state.createCategory.visible = true;
  };

  const refreshTree = () => {
    RefTree.value.fetchCategoryTree();
  };
</script>

<style scoped></style>
