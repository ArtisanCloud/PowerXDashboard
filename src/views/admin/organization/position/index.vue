<template>
  <div class="container">
    <a-card>
      <a-space size="large">
        <a-button type="primary" @click="openAddPosition()">新增职位</a-button>
      </a-space>
    </a-card>
    <br />
    <a-card>
      <PositionTable ref="RefPositionTable" />
    </a-card>
    <a-drawer
      v-model:visible="state.createPosition.visible"
      width="800px"
      ok-text="关闭抽屉"
      :hide-cancel="true"
    >
      <CreatePosition
        v-if="state.createPosition.visible"
        @submit-success="refreshPositionList"
      />
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { DefaultPageSize } from '@/api';
  import PositionTable from '@/views/admin/organization/position/components/position-table.vue';
  import CreatePosition from '@/views/admin/organization/position/components/create-position.vue';

  const RefPositionTable = ref<any>();

  const openAddPosition = () => {
    state.createPosition.visible = true;
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
    createPosition: {
      visible: false,
      parentNode: {},
    },
  });

  const refreshPositionList = () => {
    RefPositionTable.value.fetchPositionList({
      pageIndex: pagination.currentPage,
      pageSize: pagination.pageSize,
    });
  };
</script>

<script lang="ts">
  export default {
    name: 'OrganizationPositionList',
  };
</script>

<style scoped></style>
