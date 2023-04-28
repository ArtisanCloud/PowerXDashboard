<template>
  <a-card>

    <a-table :data="leadList"
             :loading="state.loading"
             row-key="id" :columns="columns"
             column-resizable
             :pagination="pagination"
             @page-change="pageChanged"
             @page-size-change="pageSizeChanged"
             :bordered="{cell:true}">

      <template #optional="{ record }">
        <a-space align="center">

          <!--编辑品类按钮-->
          <a-button @click="openEditLead(record)">
            <template #icon>
              <icon-edit :style="{fontSize:'16px', color:'green'}"/>
            </template>
          </a-button>

          <!--配置价格按钮-->
          <a-button @click="openEditLead(record)">
            <template #icon>
              <icon-book :style="{fontSize:'16px', color:'#d7ee8f'}"/>
            </template>
          </a-button>

          <!--删除品类按钮-->
          <a-popconfirm
              content="该操作会删除相关子品类,确定要删除此品类吗？"
              @ok="deleteLeadById(record.id)"
          >
            <a-button v-if="!record.isStandard">
              <template #icon>
                <icon-delete :style="{fontSize:'16px', color:'red'}"/>
              </template>
            </a-button>
          </a-popconfirm>

        </a-space>
      </template>

    </a-table>

    <a-drawer v-model:visible="state.editLead.visible" width="800px">
      <EditLead
          @submitSuccess="fetchLeadList"
          v-if="state.editLead.visible"
          :node="state.editLead.node"
      />
    </a-drawer>
  </a-card>
</template>


<script lang="ts" setup>


import {onMounted, reactive, ref} from "vue";
import {listLeads, deleteLead, Lead, ListLeadPageRequest} from "@/api/crm/customer-domain/lead";

// import CreateLead from '@/views/crm/lead-service/lead-management/components/create-lead.vue'
// import EditLead from '@/views/crm/lead-service/lead-management/components/edit-lead.vue'
import {Message} from "@arco-design/web-vue";

import useOptionsStore from "@/store/modules/data-dictionary";

const options = useOptionsStore()

const leadList = ref<Lead[]>([]);

const columns = reactive([
  {
    title: 'ID',
    dataIndex: 'id',
    width: 60,
  },
    {
    title: '品类名称',
    dataIndex: 'name',
    width: 150,
  },
  {
    title: '类型',
    dataIndex: 'type',
    width: 120,
    slotName: 'type'
  },
  {
    title: '描述',
    dataIndex: 'description',
    width: 200,
  },
  {
    title: '操作',
    slotName: 'optional'
  },
]);

const pagination = reactive({
  total: 0,
  currentPage: 0,
  "pageSize": 10,
  "show-more": true,
  "show-total": true,
  "show-jumper": true,
  "show-page-size": true,

})

const state = reactive({
  loading: false,
  createLead: {
    visible: false,
    parentNode: {},
  },
  editLead: {
    visible: false,
    node: {},
  },
  submitLoading: false
});


const fetchLeadList = async (req: ListLeadPageRequest) => {
  state.loading = true;
  try {
    const res = await listLeads(req);
    leadList.value = res.data.list;
    pagination.currentPage = res.data.pageIndex
    pagination.pageSize = res.data.pageSize
    pagination.total = res.data.total
    // console.log(categoryTree)

  } finally {
    state.loading = false;
  }
};


const openEditLead = (cat: Lead) => {
  // console.log(cat)
  state.editLead.node = cat;
  state.editLead.visible = true;
};

const deleteLeadById = async (bookId: number) => {
  try {
    const rep = await deleteLead({id: bookId});
    if (rep.data.id && rep.data.id > 0) {
      Message.success('删除成功');
      await fetchLeadList({pageIndex: pagination.currentPage, pageSize: pagination.pageSize});
    }

  } catch (error) {
    console.error(error);
  }
};

const pageChanged = (page: number) => {
  console.log("page", page)
  fetchLeadList({pageIndex: page, pageSize: pagination.pageSize})
}

const pageSizeChanged = (pageSize: number) => {
  console.log("pagesize", pageSize)
  fetchLeadList({pageIndex: pagination.currentPage, pageSize})
}


defineExpose({fetchLeadList})

onMounted(() => {

  options.fetchCustomerTypesOptions()

  fetchLeadList({});

});

</script>


<style scoped></style>
