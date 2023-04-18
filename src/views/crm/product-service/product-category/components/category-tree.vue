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
        <a-table-column title="品类名称" data-index="name"/>
        <a-table-column title="副标题" data-index="viceName"/>
        <a-table-column title="描述" data-index="description"/>
        <a-table-column title="操作">
          <template #cell="{ record }">
            <a-space>

              <!--新建子品类按钮-->
              <a-button @click="openAddSubCategory(record)">
                <template #icon>
                  <icon-plus :style="{fontSize:'16px'}"/>
                </template>
              </a-button>
              <!--编辑品类按钮-->
              <a-button @click="openEditCategory(record)">
                <template #icon>
                  <icon-edit :style="{fontSize:'16px', color:'green'}"/>
                </template>
              </a-button>

              <!--删除品类按钮-->
              <a-popconfirm
                  content="该操作会删除相关子品类,确定要删除此品类吗？"
                  @ok="deleteCategoryById(record.id)"
              >
                <a-button>
                  <template #icon>
                    <icon-delete :style="{fontSize:'16px', color:'red'}"/>
                  </template>
                </a-button>
              </a-popconfirm>

              <!--排序靠前品类-->
              <a-button>
                <template #icon>
                  <icon-caret-up :style="{fontSize:'16px'}"/>
                </template>
              </a-button>

              <!--排序靠后品类-->
              <a-button>
                <template #icon>
                  <icon-caret-down :style="{fontSize:'16px'}"/>
                </template>
              </a-button>

            </a-space>
          </template>
        </a-table-column>
      </template>
    </a-table>
    <a-drawer v-model:visible="state.createSubCategory.visible" width="500px">
      <CreateCategory
          v-if="state.createSubCategory.visible"
          :parentNode="state.createSubCategory.parentNode"
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
import {onMounted, reactive, ref} from 'vue';
import {
  ProductCategory,
  getCategoryTree, deleteCategory
} from '@/api/crm/product-service/category';
import CreateCategory from '@/views/crm/product-service/product-category/components/create-category.vue';
import EditCategory from '@/views/crm/product-service/product-category/components/edit-category.vue';
import {ParentOption} from "@/api/common";

const categoryTree = ref<ProductCategory[]>([]);

const state = reactive({
  loading: false,
  createCategory: {
    visible: false,
    parentNode: {},
  },
  createSubCategory: {
    visible: false,
    parentNode: {},
  },
  editCategory: {
    visible: false,
    categoryId: 0,
  },
});

const fetchCategoryTree = async () => {
  state.loading = true;
  try {
    const res = await getCategoryTree({Id: 0});
    categoryTree.value = res.data.Tree;
    // console.log(categoryTree)

  } finally {
    state.loading = false;
  }
};


const FindCategoryFromTreeById = (tree: ProductCategory[], id: bigint): ProductCategory | undefined => {
  if (!tree) {
    return undefined;
  }

  for (let i = 0; i < tree.length; i += 1) {
    // console.log(id, tree[i].id)
    if (id === tree[i].id) {
      return tree[i]
    }
    if (tree[i].children && tree[i].children.length > 0) {
      const foundNode = FindCategoryFromTreeById(tree[i].children, id)
      if (foundNode !== undefined) {
        return foundNode
      }
    }
  }

  return undefined
}


const openAddSubCategory = (cat: ProductCategory) => {
  const pCategory = FindCategoryFromTreeById(categoryTree.value, cat.pId)!;
  let parentNode: ParentOption = {name: '无', id: 0}
  if (pCategory) {
    parentNode = {name: pCategory.name, id: Number(pCategory.id)}
  }
  state.createSubCategory.parentNode = parentNode
  state.createSubCategory.visible = true;
};

const openEditCategory = (catId: number) => {
  state.editCategory.categoryId = catId;
  state.editCategory.visible = true;
};

const deleteCategoryById = async (catId: number) => {
  try {
    await deleteCategory({id: catId});
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
