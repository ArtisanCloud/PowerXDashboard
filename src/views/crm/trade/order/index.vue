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
      <import-export
        ref="RefImportExport"
        @on-import-finish="onImportFinish"
      ></import-export>
      <a-divider />
      <a-space size="large" direction="vertical" fill>
        <OrderTable ref="RefOrderTable" />
      </a-space>
    </a-card>
    <a-modal v-model:visible="state.importOrders.visible">
      <template #title> 处理结果 </template>
      <div>{{
        `总共处理订单：${state.importOrders.res.total}，处理了${state.importOrders.res.success}条记录，失败了${state.importOrders.res.failed}条记录,
        忽略了${state.importOrders.res.ignored}条记录`
      }}</div>
    </a-modal>
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
  import { DefaultPageSize } from '@/api';
  import FilterOrder from '@/views/crm/trade/order/components/filter-order.vue';
  import ImportExport from '@/views/crm/trade/order/components/import-export/index.vue';
  import {
    ListOrderPageRequest,
    UploadOrdersReply,
  } from '@/api/crm/trade/order';
  import { Message } from '@arco-design/web-vue';

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
    importOrders: {
      visible: false,
      res: {} as UploadOrdersReply,
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

  const onImportFinish = (res: UploadOrdersReply) => {
    state.importOrders.res = res;
    state.importOrders.visible = true;
    RefOrderTable.value.fetchOrderList({});
  };
</script>

<script lang="ts">
  export default {
    name: '订单管理',
  };
</script>

<style scoped></style>
