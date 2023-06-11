<template>
  <div class="container">
    <a-card>
      <a-space size="large">
        <a-button type="primary" @click="openAddMedia()">新增媒体 </a-button>
      </a-space>
    </a-card>
    <br />
    <a-card>
      <MediaTable ref="RefMediaTable" />
    </a-card>
    <a-drawer
      v-model:visible="state.createMedia.visible"
      width="500px"
      ok-text="关闭抽屉"
      :hide-cancel="true"
    >
      <CreateMedia
        v-if="state.createMedia.visible"
        @submit-Success="refreshMediaList"
      />
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { DefaultPageSize } from '@/api/common';
  import MediaTable from '@/views/crm/market/media/components/media-table.vue';
  import CreateMedia from '@/views/crm/market/media/components/create-media.vue';

  const RefMediaTable = ref<any>();

  const state = reactive({
    createMedia: {
      visible: false,
      parentNode: {},
    },
  });

  const openAddMedia = () => {
    state.createMedia.visible = true;
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

  const refreshMediaList = () => {
    RefMediaTable.value.fetchMediaList({
      pageIndex: pagination.currentPage,
      pageSize: pagination.pageSize,
    });
  };
</script>

<style scoped></style>
