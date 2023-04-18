<template>
  <div class="container">
    <a-card>
      <a-space size="large">
        <a-button type="primary" @click="openAddCategory()"
        >新增品类
        </a-button>
      </a-space>
    </a-card>
    <br/>
    <a-card>
      <CategoryTree ref="treeRef"/>
    </a-card>
    <a-drawer
        v-model:visible="state.createCategory.visible" width="500px">
      <CreateCategory
          @submitSuccess="refreshTree"
          v-if="state.createCategory.visible"/>
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue';
import CategoryTree from '@/views/crm/product-service/product-category/components/category-tree.vue';
import CreateCategory from '@/views/crm/product-service/product-category/components/create-category.vue';

const treeRef = ref<any>();

const openAddCategory = () => {
  state.createCategory.visible = true;
};

const state = reactive({
  createCategory: {
    visible: false,
    parentNode: {}
  },
});

const refreshTree = () =>{
  treeRef.value.fetchCategoryTree()
}

</script>

<script lang="ts">
export default {
  name: '商品品类',
};
</script>

<style scoped></style>
