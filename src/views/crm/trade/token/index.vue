<template>
  <div class="container">
    <a-card>
      <a-space size="large">
        <a-button type="primary" @click="openAddTokenProduct()"
          >新增代币产品
        </a-button>
      </a-space>
    </a-card>
    <br />
    <a-card>
      <TokenProductTable ref="RefTokenProductTable" />
    </a-card>
    <a-drawer
      v-model:visible="state.createTokenProduct.visible"
      width="500px"
      ok-text="关闭抽屉"
      :hide-cancel="true"
    >
      <CreateTokenProduct
        v-if="state.createTokenProduct.visible"
        @submit-success="refreshTokenProductList"
      />
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import TokenProductTable from '@/views/crm/trade/token/components/token-product/token-product-table.vue';
  import CreateTokenProduct from '@/views/crm/trade/token/components/token-product/create-token-product.vue';
  import { DefaultPageSize } from '@/api/common';

  const RefTokenProductTable = ref<any>();

  const openAddTokenProduct = () => {
    state.createTokenProduct.visible = true;
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

  const state = reactive({
    createTokenProduct: {
      visible: false,
      parentNode: {},
    },
  });

  const refreshTokenProductList = () => {
    RefTokenProductTable.value.fetchTokenProductList({
      pageIndex: pagination.currentPage,
      pageSize: pagination.pageSize,
    });
  };
</script>

<script lang="ts">
  export default {
    name: '代币产品管理',
  };
</script>

<style scoped></style>
