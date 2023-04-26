<template>
  <a-card>

    <a-table :data="priceBookList"
             :loading="state.loading"
             row-key="id" :columns="columns"
             column-resizable
             :pagination="pagination"
             @page-change="pageChanged"
             @page-size-change="pageSizeChanged"
             :bordered="{cell:true}">

      <template #isStandard="{ record }">
        <a-typography-text>{{ record.isStandard ? "标准" : "普通" }}</a-typography-text>
      </template>

      <template #optional="{ record }">
        <a-space align="center">

          <!--编辑品类按钮-->
          <a-button @click="openEditPriceBook(record)">
            <template #icon>
              <icon-edit :style="{fontSize:'16px', color:'green'}"/>
            </template>
          </a-button>

          <!--配置价格按钮-->
          <a-button @click="openEditPriceBook(record)">
            <template #icon>
              <icon-book :style="{fontSize:'16px', color:'#d7ee8f'}"/>
            </template>
          </a-button>

          <!--删除品类按钮-->
          <a-popconfirm
              content="该操作会删除相关子品类,确定要删除此品类吗？"
              @ok="deletePriceBookById(record.id)"
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

    <a-drawer v-model:visible="state.createPriceBook.visible" width="500px">
      <CreatePriceBook
          @submitSuccess="fetchPriceBookList"
          v-if="state.createPriceBook.visible"
      />
    </a-drawer>
    <a-drawer v-model:visible="state.editPriceBook.visible" width="500px">
      <EditPriceBook
          @submitSuccess="fetchPriceBookList"
          v-if="state.editPriceBook.visible"
          :node="state.editPriceBook.node"
      />
    </a-drawer>
  </a-card>
</template>


<script lang="ts" setup>


import {onMounted, reactive, ref} from "vue";
import {listPriceBooks, deletePriceBook, PriceBook, ListPriceBooksRequest} from "@/api/crm/product-service/priceBook";

import CreatePriceBook from '@/views/crm/product-service/price-book/components/create-price-book.vue'
import EditPriceBook from '@/views/crm/product-service/price-book/components/edit-price-book.vue'
import {Message} from "@arco-design/web-vue";

const priceBookList = ref<PriceBook[]>([]);

const columns = reactive([
  {
    title: '品类名称',
    dataIndex: 'name',
    width: 150,
  },
  {
    title: '类型',
    dataIndex: 'isStandard',
    width: 120,
    slotName: 'isStandard'
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
  "pageSize": 10,
  "show-more": true,
  "show-total": true,
  "show-jumper": true,
  "show-page-size": true,

})

const state = reactive({
  loading: false,
  createPriceBook: {
    visible: false,
    parentNode: {},
  },
  editPriceBook: {
    visible: false,
    node: {},
  },
});


const fetchPriceBookList = async (req: ListPriceBooksRequest) => {
  state.loading = true;
  try {
    const res = await listPriceBooks(req);
    priceBookList.value = res.data.list;
    pagination.currentPage = res.data.pageIndex
    pagination.pageSize = res.data.pageSize
    pagination.total = res.data.total
    // console.log(categoryTree)

  } finally {
    state.loading = false;
  }
};


const openEditPriceBook = (cat: PriceBook) => {
  // console.log(cat)
  state.editPriceBook.node = cat;
  state.editPriceBook.visible = true;
};

const deletePriceBookById = async (bookId: number) => {
  try {
    const rep = await deletePriceBook({id: bookId});
    if (rep.data.id && rep.data.id > 0) {
      Message.success('删除成功');
      await fetchPriceBookList({pageIndex: pagination.currentPage, pageSize: pagination.pageSize});
    }

  } catch (error) {
    console.error(error);
  }
};

const pageChanged = (page: number) => {
  // console.log("page",page)
  fetchPriceBookList({pageIndex: page, pageSize: pagination.pageSize})
}

const pageSizeChanged = (pageSize: number) => {
  // console.log("pagesize",pageSize)
  fetchPriceBookList({pageIndex: pagination.currentPage, pageSize})
}


defineExpose({fetchPriceBookList})

onMounted(() => {
  fetchPriceBookList({});
});

</script>


<style scoped></style>