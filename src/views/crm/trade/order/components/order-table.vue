<template>
  <a-card>
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
          <a-button @click="openEditOrder(record)">
            <template #icon>
              <icon-edit :style="{ fontSize: '16px', color: 'green' }" />
            </template>
          </a-button>

          <!--配置价格按钮-->
          <a-button @click="openEditOrder(record)">
            <template #icon>
              <icon-book :style="{ fontSize: '16px', color: '#d7ee8f' }" />
            </template>
          </a-button>

          <!--删除元匠按钮-->
          <a-popconfirm
            content="该操作会删除相关子元匠,确定要删除此元匠吗？"
            @ok="deleteOrderById(record.id)"
          >
            <a-button v-if="!record.isStandard">
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
        @submitSuccess="fetchOrderList"
      />
    </a-drawer>
  </a-card>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';

  import EditOrder from '@/views/crm/trade/order/components/edit-order.vue';
  import { Message } from '@arco-design/web-vue';

  import { DefaultPageSize } from '@/api/common';
  import {
    listOrders,
    deleteOrder,
    Order,
    ListOrderPageRequest,
  } from '@/api/crm/trade/order';
  import { useOptionsStore } from '@/store';

  const options = useOptionsStore();

  const orderList = ref<Order[]>([]);

  const columns = reactive([
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60,
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
      node: {},
    },
    submitLoading: false,
  });

  const fetchOrderList = async (req: ListOrderPageRequest) => {
    state.loading = true;
    try {
      const res = await listOrders(req);
      orderList.value = res.data.list;
      pagination.currentPage = res.data.pageIndex;
      pagination.pageSize = res.data.pageSize;
      pagination.total = res.data.total;
      // console.log(categoryTree)
    } finally {
      state.loading = false;
    }
  };

  const openEditOrder = (cat: Order) => {
    // console.log(cat)
    state.editOrder.node = cat;
    state.editOrder.visible = true;
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
