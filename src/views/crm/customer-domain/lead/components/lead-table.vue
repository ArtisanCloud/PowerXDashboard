<template>
  <a-card>
    <a-table
      :data="leadList"
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
        <a-typography-text
          >{{ options.GetOptionById(options.customerTypes, record.type)?.name }}
        </a-typography-text>
      </template>

      <template #isActivated="{ record }">
        <a-typography-text
          >{{ record.isActivated ? '激活' : '禁用' }}
        </a-typography-text>
      </template>

      <template #optional="{ record }">
        <a-space align="center">
          <!--编辑线索按钮-->
          <a-button title="编辑" @click="openEditLead(record)">
            <template #icon>
              <icon-edit :style="{ fontSize: '16px', color: 'green' }" />
            </template>
          </a-button>

          <!--转化客户按钮-->
          <!--          <a-button @click="openCovertToCustomer(record)">-->
          <!--            <template #icon>-->
          <!--              <icon-user :style="{ fontSize: '16px' }" />-->
          <!--            </template>-->
          <!--          </a-button>-->

          <!--删除线索按钮-->
          <a-popconfirm
            content="该操作会删除相关子线索,确定要删除此线索吗？"
            @ok="deleteLeadById(record.id)"
          >
            <a-button title="删除">
              <template #icon>
                <icon-delete :style="{ fontSize: '16px', color: 'red' }" />
              </template>
            </a-button>
          </a-popconfirm>
        </a-space>
      </template>
    </a-table>

    <a-drawer
      v-model:visible="state.editLead.visible"
      width="500px"
      ok-text="关闭抽屉"
      :hide-cancel="true"
    >
      <EditLead
        v-if="state.editLead.visible"
        :node="state.editLead.node"
        @submit-success="fetchLeadList"
      />
    </a-drawer>
  </a-card>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';
  import {
    listLeads,
    deleteLead,
    Lead,
    ListLeadPageRequest,
  } from '@/api/crm/customer-domain/lead';

  import EditLead from '@/views/crm/customer-domain/lead/components/edit-lead.vue';
  import { Message } from '@arco-design/web-vue';

  import useOptionsStore from '@/store/modules/data-dictionary';
  import { DefaultPageSize } from '@/api/common';

  const options = useOptionsStore();

  const leadList = ref<Lead[]>([]);

  const columns = reactive([
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60,
    },
    {
      title: '线索名称',
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
    createLead: {
      visible: false,
      parentNode: {},
    },
    editLead: {
      visible: false,
      node: {} as Lead,
    },
    submitLoading: false,
  });

  const fetchLeadList = async (req: ListLeadPageRequest) => {
    state.loading = true;
    try {
      const res = await listLeads(req);
      leadList.value = res.data.list;
      pagination.currentPage = res.data.pageIndex!;
      pagination.pageSize = res.data.pageSize!;
      pagination.total = res.data.total!;
      // console.log(leadList);
    } finally {
      state.loading = false;
    }
  };

  const openEditLead = (lead: Lead) => {
    // console.log(lead)
    state.editLead.node = lead;
    state.editLead.visible = true;
  };

  const deleteLeadById = async (bookId: number) => {
    try {
      const rep = await deleteLead({ id: bookId });
      if (rep.data.id && rep.data.id > 0) {
        Message.success('删除成功');
        await fetchLeadList({
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
    fetchLeadList({ pageIndex: page, pageSize: pagination.pageSize });
  };

  const pageSizeChanged = (pageSize: number) => {
    // console.log("pagesize", pageSize)
    fetchLeadList({ pageIndex: pagination.currentPage, pageSize });
  };

  defineExpose({ fetchLeadList });

  onMounted(() => {
    fetchLeadList({});
  });
</script>

<style scoped></style>
