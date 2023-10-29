<template>
  <div class="container">
    <a-card>
      <filter-product
        ref="RefFilerProduct"
        @on-submit="onSearch"
        @on-reset="onResetSearch"
      ></filter-product>
    </a-card>
    <br />
    <a-card>
      <a-space size="large">
        <a-button type="primary" @click="openAddProduct()">新增商品 </a-button>
      </a-space>
    </a-card>
    <br />
    <a-card>
      <ProductTable ref="RefProductTable" />
    </a-card>
    <a-drawer
      v-model:visible="state.createProduct.visible"
      :mask-closable="false"
      width="800px"
      ok-text="关闭抽屉"
      :hide-cancel="true"
    >
      <CreateProduct
        v-if="state.createProduct.visible"
        @submit-success="refreshProductList"
      />
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import ProductTable from '@/views/crm/product-service/product/components/product-table.vue';
  import CreateProduct from '@/views/crm/product-service/product/components/create-product.vue';
  import FilterProduct from '@/views/crm/product-service/product/components/filter-product.vue';
  import { DefaultPageSize } from '@/api';
  import { ListProductPageRequest } from '@/api/crm/product-service/product';

  const RefFilerProduct = ref<any>();
  const RefProductTable = ref<any>();

  const state = ref({
    createProduct: {
      visible: false,
      parentNode: {},
    },
  });

  const openAddProduct = () => {
    state.value.createProduct.visible = true;
  };

  const pagination = reactive({
    'total': 0,
    'currentPage': 0,
    'pageSize': DefaultPageSize,
    'show-more': true,
    'show-total': true,
    'show-jumper': true,
    'show-page-size': true,
  });

  const refreshProductList = () => {
    RefProductTable.value.fetchProductList({
      pageIndex: pagination.currentPage,
      pageSize: pagination.pageSize,
    });
  };

  const onResetSearch = () => {
    refreshProductList();
  };

  const onSearch = (data: ListProductPageRequest) => {
    RefProductTable.value.fetchProductList(data);
  };
</script>

<style scoped></style>
