<template>
  <a-card>
    <a-table
      :data="categoryTree"
      :loading="state.loading"
      default-expand-all-rows
      row-key="id"
      :tree-props="{ children: 'children' }"
    >
      <template #columns>
        <a-table-column title="部门名称" data-index="depName" />
        <a-table-column title="负责人" data-index="leader.name" />
        <a-table-column title="电话" data-index="phoneNumber" />
        <a-table-column title="邮箱" data-index="email" />
        <a-table-column title="备注" data-index="remark" />
        <a-table-column title="操作">
          <template #cell="{ record }">
            <a-space>
              <a-button
                type="primary"
                size="small"
                @click="openAddSubCategory(record.id)"
              >
                添加子部门
              </a-button>
              <a-button
                type="primary"
                size="small"
                @click="openEditCategory(record.id)"
              >
                详情
              </a-button>
              <a-popconfirm
                content="确定要删除此部门吗？"
                @ok="deleteCategoryById(record.id)"
              >
                <a-button type="primary" size="small" status="danger">
                  删除
                </a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </a-table-column>
      </template>
    </a-table>
    <a-drawer v-model:visible="state.createSubCategory.visible" width="500px">
      <CreateCategory
        v-if="state.createSubCategory.visible"
        :id="state.createSubCategory.parentId"
      />
    </a-drawer>
    <a-drawer v-model:visible="state.editCategory.visible" width="500px">
      <EditCategory
        v-if="state.editCategory.visible"
        :id="state.editCategory.categoryId"
      />
    </a-drawer>
  </a-card>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';
  import {
    deleteCategory,
    CategoryNode,
    getCategoryTree,
  } from '@/api/category';
  import CreateCategory from '@/views/admin/organization/category/components/create-category.vue';
  import EditCategory from '@/views/admin/organization/category/components/edit-category.vue';

  const categoryTree = ref<CategoryNode[]>([]);

  const state = reactive({
    loading: false,
    createCategory: {
      visible: false,
    },
    createSubCategory: {
      visible: false,
      parentId: 0,
    },
    editCategory: {
      visible: false,
      categoryId: 0,
    },
  });

  const fetchCategoryTree = async () => {
    state.loading = true;
    try {
      const res = await getCategoryTree({ depId: 1 });
      categoryTree.value = [res.data.depTree];
    } finally {
      state.loading = false;
    }
  };

  const openAddSubCategory = (depId: number) => {
    state.createSubCategory.parentId = depId;
    state.createSubCategory.visible = true;
  };

  const openEditCategory = (depId: number) => {
    state.editCategory.categoryId = depId;
    state.editCategory.visible = true;
  };

  const deleteCategoryById = async (depId: number) => {
    try {
      await deleteCategory({ id: depId });
      await fetchCategoryTree();
    } catch (error) {
      console.error(error);
    }
  };

  onMounted(() => {
    fetchCategoryTree();
  });
</script>

<style scoped></style>
