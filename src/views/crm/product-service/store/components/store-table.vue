<template>
  <a-card>

    <a-table :data="storeList"
             :loading="state.loading"
             row-key="id" :columns="columns"
             column-resizable
             :bordered="{cell:true}">
<!--             :pagination="pagination"-->
<!--             @page-change="pageChanged"-->
<!--             @page-size-change="pageSizeChanged"-->

      <template #optional="{ record }">
        <a-space align="center">

          <!--编辑店铺按钮-->
          <a-button @click="openEditStore(record)">
            <template #icon>
              <icon-edit :style="{fontSize:'16px', color:'green'}"/>
            </template>
          </a-button>

          <!--配置价格按钮-->
          <a-button @click="openEditStore(record)">
            <template #icon>
              <icon-book :style="{fontSize:'16px', color:'#d7ee8f'}"/>
            </template>
          </a-button>

          <!--删除店铺按钮-->
          <a-popconfirm
              content="该操作会删除相关子店铺,确定要删除此店铺吗？"
              @ok="deleteStoreById(record.id)"
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

    <a-drawer v-model:visible="state.createStore.visible" width="500px">
      <CreateStore
          @submitSuccess="fetchStoreList"
          v-if="state.createStore.visible"
      />
    </a-drawer>
    <a-drawer v-model:visible="state.editStore.visible" width="500px">
      <EditStore
          @submitSuccess="fetchStoreList"
          v-if="state.editStore.visible"
          :node="state.editStore.node"
      />
    </a-drawer>
  </a-card>
</template>


<script lang="ts" setup>


import {onMounted, reactive, ref} from "vue";
import {listStores, deleteStore, Store, ListStoreRequest} from "@/api/crm/product-service/store";

import CreateStore from '@/views/crm/product-service/price-book/components/create-price-book.vue'
import EditStore from '@/views/crm/product-service/price-book/components/edit-price-book.vue'
import {Message} from "@arco-design/web-vue";
import {DefaultPageSize} from "@/api/common";

const storeList = ref<Store[]>([]);

const columns = reactive([
  {
    title: '店铺名称',
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
    width: 300,
  },
  {
    title: '操作',
    slotName: 'optional'
  },
]);

const pagination = reactive({
  total: 0,
  currentPage: 0,
  "pageSize": DefaultPageSize,
  "show-more": true,
  "show-total": true,
  "show-jumper": true,
  "show-page-size": true,

})

const state = reactive({
  loading: false,
  createStore: {
    visible: false,
    parentNode: {},
  },
  editStore: {
    visible: false,
    node: {},
  },
});


const fetchStoreList = async (req: ListStoreRequest) => {
  state.loading = true;
  try {
    const res = await listStores(req);
    storeList.value = res.data.list;
    // pagination.currentPage = res.data.pageIndex
    // pagination.pageSize = res.data.pageSize
    // pagination.total = res.data.total
    // console.log(categoryTree)

  } finally {
    state.loading = false;
  }
};


const openEditStore = (cat: Store) => {
  // console.log(cat)
  state.editStore.node = cat;
  state.editStore.visible = true;
};

const deleteStoreById = async (bookId: number) => {
  try {
    const rep = await deleteStore({id: bookId});
    if (rep.data.id && rep.data.id > 0) {
      Message.success('删除成功');
      await fetchStoreList({pageIndex: pagination.currentPage, pageSize: pagination.pageSize});
    }

  } catch (error) {
    console.error(error);
  }
};

const pageChanged = (page: number) => {
  // console.log("page",page)
  fetchStoreList({pageIndex: page, pageSize: pagination.pageSize})
}

const pageSizeChanged = (pageSize: number) => {
  // console.log("pagesize",pageSize)
  fetchStoreList({pageIndex: pagination.currentPage, pageSize})
}


defineExpose({fetchStoreList})

onMounted(() => {
  fetchStoreList({});
});

</script>


<style scoped></style>
