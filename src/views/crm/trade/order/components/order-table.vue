<template>
  <div class="content">
    <a-table
      :data="orderList"
      :loading="state.loading"
      row-key="id"
      :columns="columns"
      column-resizable
      :pagination="pagination"
      :bordered="{ cell: true }"
      @page-change="pageChanged"
      @page-size-change="pageSizeChanged"
    >
      <template #ID="{ rowIndex }">
        <a-typography-text>{{ rowIndex + 1 }}</a-typography-text>
      </template>
      <template #customerName="{ record }">
        <a-typography-text>{{ record.customer?.name }} </a-typography-text>
      </template>
      <template #status="{ record }">
        <a-typography-text
          >{{ options.GetOptionById(options.orderStatus, record.status)?.name }}
        </a-typography-text>
      </template>
      <template #optional="{ record }">
        <a-space align="center">
          <!--编辑元匠按钮-->
          <a-button title="编辑" @click="openEditOrder(record)">
            <template #icon>
              <icon-edit :style="{ fontSize: '16px', color: 'green' }" />
            </template>
          </a-button>

          <!--查看支付和物流按钮-->
          <a-button title="查看支付和物流" @click="openOrderProfile(record)">
            <template #icon>
              <icon-book :style="{ fontSize: '16px', color: '#d7ee8f' }" />
            </template>
          </a-button>

          <!--删除元匠按钮-->
          <a-popconfirm
            content="该操作会删除相关子元匠,确定要删除此元匠吗？"
            @ok="deleteOrderById(record.id)"
          >
            <a-button title="编辑">
              <template #icon>
                <icon-delete :style="{ fontSize: '16px', color: 'red' }" />
              </template>
            </a-button>
          </a-popconfirm>
        </a-space>
      </template>
    </a-table>
    <a-drawer
      v-model:visible="state.editOrder.visible"
      width="500px"
      ok-text="关闭抽屉"
      :hide-cancel="true"
    >
      <EditOrder
        v-if="state.editOrder.visible"
        :node="state.editOrder.node"
        @submit-success="fetchOrderList"
      />
    </a-drawer>
    <a-drawer
      v-model:visible="state.profile.visible"
      width="500px"
      ok-text="关闭抽屉"
      :hide-cancel="true"
    >
      <OrderProfile
        v-if="state.profile.visible"
        :node="state.profile.node"
        @submit-success="fetchOrderList"
      />
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';

  import { Message } from '@arco-design/web-vue';

  import { DefaultPageSize } from '@/api';
  import {
    listOrders,
    deleteOrder,
    Order,
    ListOrderPageRequest,
  } from '@/api/crm/trade/order';
  import { useOptionsStore } from '@/store';
  import EditOrder from '@/views/crm/trade/order/components/edit-order.vue';
  import OrderProfile from '@/views/crm/trade/order/components/order-profile.vue';

  const options = useOptionsStore();

  const orderList = ref<Order[]>([]);

  const columns = reactive([
    {
      title: 'ID',
      width: 60,
      slotName: 'ID',
    },
    {
      title: '订单号',
      dataIndex: 'orderNumber',
      width: 250,
    },
    {
      title: '交易金额',
      dataIndex: 'unitPrice',
      width: 100,
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      width: 150,
      slotName: 'customerName',
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      width: 150,
      slotName: 'status',
    },

    {
      title: '物流单号',
      dataIndex: 'logistics.trackingCode',
      width: 150,
    },

    {
      title: '操作',
      slotName: 'optional',
    },
  ]);

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
    loading: false,
    createOrder: {
      visible: false,
      parentNode: {},
    },
    editOrder: {
      visible: false,
      node: {} as Order,
    },
    profile: {
      visible: false,
      node: {} as Order,
    },

    submitLoading: false,
  });

  const fetchOrderList = async (req: ListOrderPageRequest) => {
    state.loading = true;
    try {
      const res = await listOrders(req);
      orderList.value = res.data.list;
      pagination.currentPage = res.data.pageIndex!;
      pagination.pageSize = res.data.pageSize!;
      pagination.total = res.data.total!;
      // console.log(categoryTree)
    } finally {
      state.loading = false;
    }
  };

  const openEditOrder = (order: Order) => {
    // console.log(cat)
    state.editOrder.node = order;
    state.editOrder.visible = true;
  };

  const openOrderProfile = (order: Order) => {
    state.profile.node = order;
    state.profile.visible = true;
  };

  const deleteOrderById = async (bookId: number) => {
    try {
      const rep = await deleteOrder({ id: bookId });
      if (rep.data.id && rep.data.id > 0) {
        Message.success('删除成功');
        await fetchOrderList({
          pageIndex: pagination.currentPage,
          pageSize: pagination.pageSize,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const pageChanged = (page: number) => {
    // console.log("page", page)
    fetchOrderList({ pageIndex: page, pageSize: pagination.pageSize });
  };

  const pageSizeChanged = (pageSize: number) => {
    // console.log("pagesize", pageSize)
    fetchOrderList({ pageIndex: pagination.currentPage, pageSize });
  };

  defineExpose({ fetchOrderList });

  onMounted(() => {
    fetchOrderList({});
  });
</script>

<style scoped></style>
