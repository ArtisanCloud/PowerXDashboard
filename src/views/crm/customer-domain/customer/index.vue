<template>
  <div class="container">
    <a-card>
      <a-space size="large">
        <a-button type="primary" @click="openAddCustomer()"
        >新增客户
        </a-button>
      </a-space>
    </a-card>
    <br/>
    <a-card>
      <CustomerTable ref="RefCustomerTable"/>
    </a-card>
    <a-drawer
        v-model:visible="state.createCustomer.visible" width="500px">
      <CreateCustomer
          @submitSuccess="refreshCustomerList"
          v-if="state.createCustomer.visible"/>
    </a-drawer>
  </div>
</template>



<script lang="ts" setup>


import {reactive, ref} from 'vue';
import CustomerTable from '@/views/crm/customer-domain/customer/components/customer-table.vue';
import CreateCustomer from '@/views/crm/customer-domain/customer/components/create-customer.vue';
import {DefaultPageSize} from "@/api/common";

const RefCustomerTable = ref<any>();

const openAddCustomer = () => {
  state.createCustomer.visible = true;
};

const pagination = reactive({
  total:0,
  currentPage: 0,
  "pageSize": DefaultPageSize,
  "show-more": true,
  "show-total": true,
  "show-jumper": true,
  "show-page-size": true,

})

const state = reactive({
  createCustomer: {
    visible: false,
    parentNode: {}
  },
});

const refreshCustomerList = () =>{
  RefCustomerTable.value.fetchCustomerList({
    pageIndex: pagination.currentPage,
    pageSize: pagination.pageSize
  })
}


</script>



<script lang="ts">
export default {
  name: '客户管理',
};
</script>

<style scoped></style>
