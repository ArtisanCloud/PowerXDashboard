<template>
  <div class="container">
    <a-card>
      <a-space size="large">
        <a-button type="primary" @click="openAddStore()">新增门店</a-button>
      </a-space>
    </a-card>
    <br />
    <a-card>
      <StoreTable ref="RefStoreTable" />
    </a-card>
    <a-drawer v-model:visible="state.createStore.visible" width="500px">
      <CreateStore
        v-if="state.createStore.visible"
        @submitSuccess="refreshStoreList"
      />
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import StoreTable from '@/views/crm/market/store/components/store-table.vue';
  import CreateStore from '@/views/crm/market/store/components/create-store.vue';
  import { DefaultPageSize } from '@/api/common';

  const RefStoreTable = ref<any>();

  const openAddStore = () => {
    state.createStore.visible = true;
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
    createStore: {
      visible: false,
      parentNode: {},
    },
  });

  const refreshStoreList = () => {
    RefStoreTable.value.fetchStoreList({
      pageIndex: pagination.currentPage,
      pageSize: pagination.pageSize,
    });
  };
</script>

<script lang="ts">
  export default {
    name: '门店',
  };
</script>

<style scoped></style>
