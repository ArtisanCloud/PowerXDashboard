<template>
  <div class="container">
    <a-card>
      <a-space size="large">
        <a-button type="primary" @click="state.createCategory.visible = true"
        >新增品类</a-button
        >
      </a-space>
    </a-card>
    <br />
    <a-card>
      <CategoryTable />
    </a-card>
    <a-drawer v-model:visible="state.createCategory.visible" width="500px">
      <CreateCategory v-if="state.createCategory.visible" />
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
import CategoryTable from '@/views/crm/product-service/product-category/components/category-table.vue';
import { reactive } from 'vue';
import CreateCategory from '@/views/crm/product-service/product-category/components/create-category.vue';

const state = reactive({
  createCategory: {
    visible: false,
  },
});
</script>

<script lang="ts">
export default {
  name: '商品品类',
};
</script>

<style scoped></style>
