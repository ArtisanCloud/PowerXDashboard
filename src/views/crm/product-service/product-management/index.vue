<template>
  <div class="container">
    <a-card>
      <a-space size="large">
        <a-button type="primary" @click="openAddProduct()"
        >新增商品
        </a-button>
      </a-space>
    </a-card>
    <br/>
    <a-card>
      <ProductTable ref="RefProductTable"/>
    </a-card>
    <a-drawer
        v-model:visible="state.createProduct.visible" width="800px">
      <CreateProduct
          @submitSuccess="refreshProductList"
          v-if="state.createProduct.visible"/>
    </a-drawer>
  </div>
</template>



<script lang="ts" setup>


import {reactive, ref} from 'vue';
import ProductTable from '@/views/crm/product-service/product-management/components/product-table.vue';
import CreateProduct from '@/views/crm/product-service/product-management/components/create-product.vue';

const RefProductTable = ref<any>();

const openAddProduct = () => {
  state.createProduct.visible = true;
};

const pagination = reactive({
  total:0,
  currentPage: 0,
  "pageSize": 10,
  "show-more": true,
  "show-total": true,
  "show-jumper": true,
  "show-page-size": true,

})

const state = reactive({
  createProduct: {
    visible: false,
    parentNode: {}
  },
});

const refreshProductList = () =>{
  RefProductTable.value.fetchProductList({
    pageIndex: pagination.currentPage,
    pageSize: pagination.pageSize
  })
}


</script>



<script lang="ts">
export default {
  name: '商品管理',
};
</script>

<style scoped></style>
