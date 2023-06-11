<template>
  <a-card>
    <a-table
      :data="customerList"
      :loading="state.loading"
      row-key="id"
      :columns="columns"
      column-resizable
      :pagination="pagination"
      :bordered="{ cell: true }"
      @page-change="pageChanged"
      @page-size-change="pageSizeChanged"
    >
      <template #type="{ record }">
        <a-typography-text>{{
          options.GetOptionById(options.customerTypes, record.type)?.name
        }}</a-typography-text>
      </template>

      <template #isActivated="{ record }">
        <a-typography-text>{{
          record.isActivated ? '激活' : '禁用'
        }}</a-typography-text>
      </template>

      <template #optional="{ record }">
        <a-space align="center">
          <!--编辑客户按钮-->
          <a-button @click="openEditCustomer(record)">
            <template #icon>
              <icon-edit :style="{ fontSize: '16px', color: 'green' }" />
            </template>
          </a-button>

          <!--删除客户按钮-->
          <a-popconfirm
            content="该操作会删除相关子客户,确定要删除此客户吗？"
            @ok="deleteCustomerById(record.id)"
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
      v-model:visible="state.editCustomer.visible"
      width="500px"
      ok-text="关闭抽屉"
      :hide-cancel="true"
    >
      <EditCustomer
        v-if="state.editCustomer.visible"
        :node="state.editCustomer.node"
        @submit-Success="fetchCustomerList"
      />
    </a-drawer>
  </a-card>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';
  import {
    listCustomers,
    deleteCustomer,
    Customer,
    ListCustomerPageRequest,
  } from '@/api/crm/customer-domain/customer';

  import EditCustomer from '@/views/crm/customer-domain/customer/components/edit-customer.vue';
  import { Message } from '@arco-design/web-vue';

  import useOptionsStore from '@/store/modules/data-dictionary';
  import { DefaultPageSize } from '@/api/common';

  const options = useOptionsStore();

  const customerList = ref<Customer[]>([]);

  const columns = reactive([
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60,
    },
    {
      title: '客户名称',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 120,
      slotName: 'type',
    },
    {
      title: '手机号码',
      dataIndex: 'mobile',
      width: 120,
      slotName: 'mobile',
    },
    {
      title: '小程序OpenId',
      dataIndex: 'openIdInMiniProgram',
      width: 200,
      slotName: 'openIdInMiniProgram',
    },
    {
      title: '状态',
      dataIndex: 'isActivated',
      width: 120,
      slotName: 'isActivated',
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
    createCustomer: {
      visible: false,
      parentNode: {},
    },
    editCustomer: {
      visible: false,
      node: {} as Customer,
    },
    submitLoading: false,
  });

  const fetchCustomerList = async (req: ListCustomerPageRequest) => {
    state.loading = true;
    try {
      const res = await listCustomers(req);
      customerList.value = res.data.list;
      pagination.currentPage = res.data.pageIndex;
      pagination.pageSize = res.data.pageSize;
      pagination.total = res.data.total;
      // console.log(customerList)
    } finally {
      state.loading = false;
    }
  };

  const openEditCustomer = (customer: Customer) => {
    // console.log(customer)
    state.editCustomer.node = customer;
    state.editCustomer.visible = true;
  };

  const deleteCustomerById = async (bookId: number) => {
    try {
      const rep = await deleteCustomer({ id: bookId });
      if (rep.data.id && rep.data.id > 0) {
        Message.success('删除成功');
        await fetchCustomerList({
          pageIndex: pagination.currentPage,
          pageSize: pagination.pageSize,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const pageChanged = (page: number) => {
    // console.log('page', page);
    fetchCustomerList({ pageIndex: page, pageSize: pagination.pageSize });
  };

  const pageSizeChanged = (pageSize: number) => {
    // console.log('pagesize', pageSize);
    fetchCustomerList({ pageIndex: pagination.currentPage, pageSize });
  };

  defineExpose({ fetchCustomerList });

  onMounted(() => {
    fetchCustomerList({});
  });
</script>

<style scoped></style>
