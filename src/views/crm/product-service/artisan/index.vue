<template>
  <div class="container">
    <a-card>
      <a-space size="large">
        <a-button type="primary" @click="openAddArtisan()">新增元匠 </a-button>
      </a-space>
    </a-card>
    <br />
    <a-card>
      <ArtisanTable ref="RefArtisanTable" />
    </a-card>
    <a-drawer
      v-model:visible="state.createArtisan.visible"
      width="500px"
      ok-text="关闭抽屉"
      :hide-cancel="true"
    >
      <CreateArtisan
        v-if="state.createArtisan.visible"
        @submit-Success="refreshArtisanList"
      />
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import ArtisanTable from '@/views/crm/product-service/artisan/components/artisan-table.vue';
  import CreateArtisan from '@/views/crm/product-service/artisan/components/create-artisan.vue';
  import { DefaultPageSize } from '@/api/common';

  const RefArtisanTable = ref<any>();

  const openAddArtisan = () => {
    state.createArtisan.visible = true;
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
    createArtisan: {
      visible: false,
      parentNode: {},
    },
  });

  const refreshArtisanList = () => {
    RefArtisanTable.value.fetchArtisanList({
      pageIndex: pagination.currentPage,
      pageSize: pagination.pageSize,
    });
  };
</script>

<script lang="ts">
  export default {
    name: '元匠管理',
  };
</script>

<style scoped></style>
