<template>
  <div class="container">
    <a-card>
      <!--      <a-space size="large">-->
      <!--        <a-button type="primary" @click="openAddPayment()">新增支付单 </a-button>-->
      <!--      </a-space>-->
    </a-card>
    <br />
    <a-card>
      <PaymentTable ref="RefPaymentTable" />
    </a-card>
    <a-drawer
      v-model:visible="state.createPayment.visible"
      width="500px"
      ok-text="关闭抽屉"
      :hide-cancel="true"
    >
      <CreatePayment
        v-if="state.createPayment.visible"
        @submitSuccess="refreshPaymentList"
      />
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import PaymentTable from '@/views/crm/trade/payment/components/payment-table.vue';
  import CreatePayment from '@/views/crm/trade/payment/components/create-payment.vue';
  import { DefaultPageSize } from '@/api/common';

  const RefPaymentTable = ref<any>();

  const openAddPayment = () => {
    state.createPayment.visible = true;
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
    createPayment: {
      visible: false,
      parentNode: {},
    },
  });

  const refreshPaymentList = () => {
    RefPaymentTable.value.fetchPaymentList({
      pageIndex: pagination.currentPage,
      pageSize: pagination.pageSize,
    });
  };
</script>

<script lang="ts">
  export default {
    name: '支付单管理',
  };
</script>

<style scoped></style>
