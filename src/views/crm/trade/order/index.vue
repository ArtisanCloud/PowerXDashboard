<template>
  <div class="container">
    <a-card>
      <filter-order
        ref="RefFilerOrder"
        @on-submit="onSearch"
        @on-reset="onResetSearch"
      ></filter-order>
    </a-card>
    <br />
    <a-card>
      <import-export ref="RefImportExport"></import-export>
      <a-divider />
      <a-space size="large" direction="vertical" fill>
        <OrderTable ref="RefOrderTable" />
      </a-space>
    </a-card>
    <a-drawer
      v-model:visible="state.createOrder.visible"
      width="500px"
      ok-text="关闭抽屉"
      :hide-cancel="true"
    >
      <CreateOrder
        v-if="state.createOrder.visible"
        @submit-success="refreshOrderList"
      />
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import OrderTable from '@/views/crm/trade/order/components/order-table.vue';
  import CreateOrder from '@/views/crm/trade/order/components/create-order.vue';
  import { DefaultPageSize } from '@/api/common';
  import FilterOrder from '@/views/crm/trade/order/components/filter-order.vue';
  import ImportExport from '@/views/crm/trade/order/components/import-export/index.vue';
  import { ListOrderPageRequest } from '@/api/crm/trade/order';

  const RefFilerOrder = ref<any>();
  const RefImportExport = ref<any>();
  const RefOrderTable = ref<any>();

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
    createOrder: {
      visible: false,
      parentNode: {},
    },
  });

  const refreshOrderList = () => {
    RefOrderTable.value.fetchOrderList({
      pageIndex: pagination.currentPage,
      pageSize: pagination.pageSize,
    });
  };

  const onResetSearch = () => {
    refreshOrderList();
    RefImportExport.value.setFilters({});
  };

  const onSearch = (data: ListOrderPageRequest) => {
    RefOrderTable.value.fetchOrderList(data);

    RefImportExport.value.setFilters(data);
  };
</script>

<script lang="ts">
  export default {
    name: '订单管理',
  };
</script>

<style scoped></style>
