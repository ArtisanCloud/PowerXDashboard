<template>
  <div class="container">
    <a-card>
      <filter-order @on-submit="onSearch"></filter-order>
      <a-divider />
      <a-space
        size="large"
        style="display: flex; justify-content: flex-end; padding-right: 80px"
      >
        <a-button type="primary" @click="downloadOrders()">下载订单 </a-button>
        <a-button type="primary" @click="importOrders()">导入订单 </a-button>
      </a-space>
    </a-card>
    <br />
    <a-card>
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
  import { ListOrderPageRequest } from '@/api/crm/trade/order';

  const RefOrderTable = ref<any>();

  const downloadOrders = () => {
    console.log('download orders');
  };
  const importOrders = () => {
    console.log('import orders');
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

  const onSearch = (data: ListOrderPageRequest) => {
    RefOrderTable.value.fetchOrderList(data);
  };
</script>

<script lang="ts">
  export default {
    name: '订单管理',
  };
</script>

<style scoped></style>
