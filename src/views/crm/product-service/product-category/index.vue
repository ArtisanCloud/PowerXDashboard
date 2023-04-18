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
      <CategoryTree/>
    </a-card>
    <a-drawer v-model:visible="state.createCategory.visible" width="500px">
      <CreateCategory v-if="state.createCategory.visible"/>
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
import {reactive} from 'vue';
import CategoryTree from '@/views/crm/product-service/product-category/components/category-tree.vue';
import CreateCategory from '@/views/crm/product-service/product-category/components/create-category.vue';

const openAddCategory = () => {

  // state.createCategory.parentNode = {name: '无', id: 0}
  state.createCategory.visible = true;
};

const state = reactive({
  createCategory: {
    visible: false,
    parentNode: {}
  },
});
</script>

<script lang="ts">
export default {
  name: '商品品类',
};
</script>

<style scoped></style>
