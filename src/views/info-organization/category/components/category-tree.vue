<template>
  <div class="content">
    <a-table
      :data="categoryTree"
      :loading="state.loading"
      default-expand-all-rows
      row-key="id"
      :tree-props="{ children: 'children' }"
    >
      <template #columns>
        <a-table-column title="类别名称" data-index="name" />
        <a-table-column title="副标题" data-index="viceName" />
        <a-table-column title="icon" data-index="icon" />
        <a-table-column title="preview" data-index="imageUrl">
          <template #cell="{ record }">
            <a-image width="72" :src="record.coverImage?.url"></a-image>
          </template>
        </a-table-column>
        <a-table-column title="背景颜色" data-index="backgroundColor" />
        <a-table-column title="操作">
          <template #cell="{ record }">
            <a-space>
              <!--新建子类别按钮-->
              <a-button title="添加" @click="openAddSubCategory(record)">
                <template #icon>
                  <icon-plus :style="{ fontSize: '16px' }" />
                </template>
              </a-button>
              <!--编辑类别按钮-->
              <a-button title="编辑" @click="openEditCategory(record)">
                <template #icon>
                  <icon-edit :style="{ fontSize: '16px', color: 'green' }" />
                </template>
              </a-button>

              <!--删除类别按钮-->
              <a-popconfirm
                content="该操作会删除相关子类别,确定要删除此类别吗？"
                @ok="deleteCategoryById(record.id)"
              >
                <a-button>
                  <template #icon>
                    <icon-delete :style="{ fontSize: '16px', color: 'red' }" />
                  </template>
                </a-button>
              </a-popconfirm>

              <!--              &lt;!&ndash;排序靠前类别&ndash;&gt;-->
              <!--              <a-button>-->
              <!--                <template #icon>-->
              <!--                  <icon-caret-up :style="{fontSize:'16px'}"/>-->
              <!--                </template>-->
              <!--              </a-button>-->

              <!--              &lt;!&ndash;排序靠后类别&ndash;&gt;-->
              <!--              <a-button>-->
              <!--                <template #icon>-->
              <!--                  <icon-caret-down :style="{fontSize:'16px'}"/>-->
              <!--                </template>-->
              <!--              </a-button>-->
            </a-space>
          </template>
        </a-table-column>
      </template>
    </a-table>
    <a-drawer
      v-model:visible="state.createSubCategory.visible"
      width="500px"
      ok-text="关闭抽屉"
      :hide-cancel="true"
    >
      <CreateCategory
        v-if="state.createSubCategory.visible"
        :parent-node="state.createSubCategory.parentNode"
        @submit-success="fetchCategoryTree"
      />
    </a-drawer>
    <a-drawer
      v-model:visible="state.editCategory.visible"
      width="500px"
      ok-text="关闭抽屉"
      :hide-cancel="true"
    >
      <EditCategory
        v-if="state.editCategory.visible"
        :node="state.editCategory.node"
        :parent-node="state.editCategory.parentNode"
        @submit-success="fetchCategoryTree"
      />
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, reactive, ref } from 'vue';
  import {
    Category,
    getCategoryTree,
    deleteCategory,
  } from '@/api/info-organization/category';
  import CreateCategory from '@/views/info-organization/category/components/create-category.vue';
  import EditCategory from '@/views/info-organization/category/components/edit-category.vue';
  import { ParentOption } from '@/api/common';

  const categoryTree = ref<Category[]>([]);

  const state = reactive({
    loading: false,
    createCategory: {
      visible: false,
      parentNode: {},
    },
    createSubCategory: {
      visible: false,
      parentNode: {} as Category,
    },
    editCategory: {
      visible: false,
      node: {} as Category,
      parentNode: {} as Category,
    },
  });

  const fetchCategoryTree = async () => {
    state.loading = true;
    try {
      const res = await getCategoryTree({ id: 0 });
      categoryTree.value = res.data.tree;
      // console.log(categoryTree)
    } finally {
      state.loading = false;
    }
  };

  const setStyle = (record: Category) => {
    return {
      backgroundColor: record.backgroundColor,
      width: '16px',
    };
  };

  const FindCategoryFromTreeById = (
    tree: Category[],
    id: number,
  ): Category | undefined => {
    if (!tree) {
      return undefined;
    }

    for (let i = 0; i < tree.length; i += 1) {
      // console.log(id, tree[i].id)
      if (id === tree[i].id) {
        return tree[i];
      }
      if (tree[i].children && tree[i].children!.length > 0) {
        const foundNode = FindCategoryFromTreeById(tree[i].children!, id);
        if (foundNode !== undefined) {
          return foundNode;
        }
      }
    }

    return undefined;
  };

  const openAddSubCategory = (cat: Category) => {
    const pCategory = FindCategoryFromTreeById(categoryTree.value, cat.id!);
    let parentNode: ParentOption = { name: '无', id: 0 };
    if (pCategory) {
      parentNode = { name: pCategory.name, id: Number(pCategory.id) };
    }
    state.createSubCategory.parentNode = parentNode;
    state.createSubCategory.visible = true;
  };

  const openEditCategory = (cat: Category) => {
    // console.log(cat);
    const pCategory = FindCategoryFromTreeById(categoryTree.value, cat.pId!);
    let parentNode: ParentOption = { name: '无', id: 0 };
    if (pCategory) {
      parentNode = { name: pCategory.name, id: Number(pCategory.id) };
    }
    // console.log(parentNode);
    state.editCategory.parentNode = parentNode;
    state.editCategory.node = cat;
    state.editCategory.visible = true;
  };

  const deleteCategoryById = async (catId: number) => {
    try {
      await deleteCategory({ id: catId });
      await fetchCategoryTree();
    } catch (error) {
      console.error(error);
    }
  };

  defineExpose({ fetchCategoryTree });

  onMounted(() => {
    fetchCategoryTree();
  });
</script>

<style scoped></style>
