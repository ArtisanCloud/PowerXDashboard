<template>
  <div class="content">
    <a-table
      :data="paymentList"
      :loading="state.loading"
      row-key="id"
      :columns="columns"
      column-resizable
      :pagination="pagination"
      :bordered="{ cell: true }"
      @page-change="pageChanged"
      @page-size-change="pageSizeChanged"
    >
      <template #paymentType="{ record }">
        <a-typography-text>{{
          options.GetOptionById(options.paymentTypes, record.paymentType)?.name
        }}</a-typography-text>
      </template>
      <template #status="{ record }">
        <a-typography-text>
          {{
            options.GetOptionById(options.paymentStatus, record.status)?.name
          }}
        </a-typography-text>
      </template>
      <template #optional="{ record }">
        <a-space align="center">
          <!--编辑支付单按钮-->
          <a-button @click="openEditPayment(record)">
            <template #icon>
              <icon-edit :style="{ fontSize: '16px', color: 'green' }" />
            </template>
          </a-button>

          <!--配置价格按钮-->
          <a-button @click="openEditPayment(record)">
            <template #icon>
              <icon-book :style="{ fontSize: '16px', color: '#d7ee8f' }" />
            </template>
          </a-button>

          <!--删除支付单按钮-->
          <a-popconfirm
            content="该操作会删除相关子支付单,确定要删除此支付单吗？"
            @ok="deletePaymentById(record.id)"
          >
            <a-button>
              <template #icon>
                <icon-delete :style="{ fontSize: '16px', color: 'red' }" />
              </template>
            </a-button>
          </a-popconfirm>
        </a-space>
      </template>
    </a-table>
    <a-drawer
      v-model:visible="state.editPayment.visible"
      width="500px"
      ok-text="关闭抽屉"
      :hide-cancel="true"
    >
      <EditPayment
        v-if="state.editPayment.visible"
        :node="state.editPayment.node"
        @submit-success="fetchPaymentList"
      />
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import { DefaultPageSize } from '@/api';
  import {
    listPayments,
    deletePayment,
    Payment,
    ListPaymentPageRequest,
  } from '@/api/crm/trade/payment';

  import EditPayment from '@/views/crm/trade/payment/components/edit-payment.vue';
  import { useOptionsStore } from '@/store';

  const options = useOptionsStore();

  const paymentList = ref<Payment[]>([]);

  const columns = reactive([
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60,
    },
    {
      title: '支付单号',
      dataIndex: 'paymentNumber',
      width: 250,
    },
    {
      title: '交易金额',
      dataIndex: 'paidAmount',
      width: 100,
    },
    {
      title: '支付方式',
      dataIndex: 'paymentType',
      width: 150,
      slotName: 'paymentType',
    },
    {
      title: '支付订单状态',
      dataIndex: 'status',
      width: 150,
      slotName: 'status',
    },
    {
      title: '交易时间',
      dataIndex: 'paymentDate',
      width: 100,
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
    createPayment: {
      visible: false,
      parentNode: {},
    },
    editPayment: {
      visible: false,
      node: {},
    },
    submitLoading: false,
  });

  const fetchPaymentList = async (req: ListPaymentPageRequest) => {
    state.loading = true;
    try {
      const res = await listPayments(req);
      paymentList.value = res.data.list;
      pagination.currentPage = res.data.pageIndex!;
      pagination.pageSize = res.data.pageSize!;
      pagination.total = res.data.total!;
      // console.log(categoryTree)
    } finally {
      state.loading = false;
    }
  };

  const openEditPayment = (cat: Payment) => {
    // console.log(cat)
    state.editPayment.node = cat;
    state.editPayment.visible = true;
  };

  const deletePaymentById = async (bookId: number) => {
    try {
      const rep = await deletePayment({ id: bookId });
      if (rep.data.id && rep.data.id > 0) {
        Message.success('删除成功');
        await fetchPaymentList({
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
    fetchPaymentList({ pageIndex: page, pageSize: pagination.pageSize });
  };

  const pageSizeChanged = (pageSize: number) => {
    // console.log("pagesize", pageSize)
    fetchPaymentList({ pageIndex: pagination.currentPage, pageSize });
  };

  defineExpose({ fetchPaymentList });

  onMounted(() => {
    fetchPaymentList({});
  });
</script>

<style scoped></style>
