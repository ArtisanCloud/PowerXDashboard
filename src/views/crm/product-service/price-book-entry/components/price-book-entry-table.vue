<template>
  <a-card>
    <a-table
      :data="priceBookEntryList"
      :loading="state.loading"
      row-key="id"
      :columns="columns"
      column-resizable
      :pagination="pagination"
      :bordered="{ cell: true }"
      @page-change="pageChanged"
      @page-size-change="pageSizeChanged"
    >
      <template #optional="{ record }">
        <a-space align="center">
          <!--编辑价格条目按钮-->
          <a-button @click="openEditPriceBookEntry(record)">
            <template #icon>
              <icon-edit :style="{ fontSize: '16px', color: 'green' }" />
            </template>
          </a-button>

          <!--删除价格条目按钮-->
          <a-popconfirm
            content="该操作会删除价格条目,确定要删除此价格条目吗？"
            @ok="deletePriceBookEntryById(record.id)"
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
      v-model:visible="state.createPriceBookEntry.visible"
      width="500px"
      ok-text="关闭抽屉"
      :hide-cancel="true"
    >
      <CreatePriceBookEntry
        v-if="state.createPriceBookEntry.visible"
        @submit-success="fetchPriceBookEntryList"
      />
    </a-drawer>
    <a-drawer
      v-model:visible="state.editPriceBookEntry.visible"
      width="500px"
      ok-text="关闭抽屉"
      :hide-cancel="true"
    >
      <EditPriceBookEntry
        v-if="state.editPriceBookEntry.visible"
        :node="state.editPriceBookEntry.node"
        @submit-success="fetchPriceBookEntryList"
      />
    </a-drawer>
  </a-card>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';
  import {
    listPriceBookEntries,
    deletePriceBookEntry,
    PriceBookEntry,
    ListPriceBookEntriesRequest,
  } from '@/api/crm/product-service/priceBookEntry';

  import CreatePriceBookEntry from '@/views/crm/product-service/price-book-entry/components/create-price-book-entry.vue';
  import EditPriceBookEntry from '@/views/crm/product-service/price-book-entry/components/edit-price-book-entry.vue';
  import { Message } from '@arco-design/web-vue';
  import { DefaultPageSize } from '@/api/common';
  import { useRouter } from 'vue-router';

  const route = useRouter();

  const priceBookEntryList = ref<PriceBookEntry[]>([]);

  const columns = reactive([
    {
      title: '产品名称',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: 'SKU',
      dataIndex: 'isStandard',
      width: 120,
      slotName: 'isStandard',
    },
    {
      title: '单价',
      dataIndex: 'unitPrice',
      width: 300,
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
    priceBookId: 0,
    loading: false,
    createPriceBookEntry: {
      visible: false,
      parentNode: {},
    },
    editPriceBookEntry: {
      visible: false,
      node: {} as PriceBookEntry,
    },
  });

  const fetchPriceBookEntryList = async (req: ListPriceBookEntriesRequest) => {
    state.loading = true;
    try {
      const res = await listPriceBookEntries(req);
      priceBookEntryList.value = res.data.list;
      pagination.currentPage = res.data.pageIndex;
      pagination.pageSize = res.data.pageSize;
      pagination.total = res.data.total;
      // console.log(categoryTree)
    } finally {
      state.loading = false;
    }
  };

  const openEditPriceBookEntry = (cat: PriceBookEntry) => {
    // console.log(cat)
    state.editPriceBookEntry.node = cat;
    state.editPriceBookEntry.visible = true;
  };

  const deletePriceBookEntryById = async (bookId: number) => {
    try {
      const rep = await deletePriceBookEntry({ id: bookId });
      if (rep.data.id && rep.data.id > 0) {
        Message.success('删除成功');
        await fetchPriceBookEntryList({
          priceBookId: state.priceBookId,
          pageIndex: pagination.currentPage,
          pageSize: pagination.pageSize,
        });
      }
    } catch (error) {
      // console.error(error);
    }
  };

  const refreshPriceBookList = () => {
    fetchPriceBookEntryList({
      priceBookId: state.priceBookId,
      pageIndex: pagination.currentPage,
      pageSize: pagination.pageSize,
    });
  };

  const pageChanged = (page: number) => {
    // console.log("page",page)
    pagination.currentPage = page;
    refreshPriceBookList();
  };

  const pageSizeChanged = (pageSize: number) => {
    // console.log("pagesize",pageSize)
    pagination.pageSize = pageSize;
    refreshPriceBookList();
  };

  defineExpose({ fetchPriceBookEntryList });

  onMounted(() => {
    const { query } = route.currentRoute.value;
    state.priceBookId = Number(query.priceBookId);
    // console.log(priceBookEntryId);
  });
</script>

<style scoped></style>
