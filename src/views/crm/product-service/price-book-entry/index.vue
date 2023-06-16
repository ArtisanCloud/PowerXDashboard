<template>
  <div class="container">
    <a-card>
      <a-space size="large">
        <a-button type="primary" @click="openAddProduct"
          >添加配置产品
        </a-button>
      </a-space>
    </a-card>
    <br />
    <a-card>
      <PriceBookEntryTable ref="RefPriceBookEntryTable" />
    </a-card>
    <a-modal
      v-model:visible="state.createPriceBookEntry.visible"
      title="配置价格条目"
      ok-text="关闭"
      fullscreen
    >
      <CreatePriceBookEntry
        v-if="state.createPriceBookEntry.visible"
        @submit-success="refreshPriceBookEntryList"
      /> </a-modal
  ></div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import PriceBookEntryTable from '@/views/crm/product-service/price-book-entry/components/price-book-entry-table.vue';
  import CreatePriceBookEntry from '@/views/crm/product-service/price-book/components/create-price-book.vue';
  import { DefaultPageSize } from '@/api/common';

  const RefPriceBookEntryTable = ref<any>();

  const openAddProduct = () => {
    state.createPriceBookEntry.visible = true;
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
    createPriceBookEntry: {
      visible: false,
      parentNode: {},
    },
  });

  const refreshPriceBookEntryList = () => {
    RefPriceBookEntryTable.value.fetchPriceBookEntryList({
      pageIndex: pagination.currentPage,
      pageSize: pagination.pageSize,
    });
  };
</script>

<script lang="ts">
  export default {
    name: '价格手册条目',
  };
</script>

<style scoped></style>
