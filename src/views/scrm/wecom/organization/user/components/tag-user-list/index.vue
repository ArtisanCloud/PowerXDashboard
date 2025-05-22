<script setup lang="ts">
  import { onMounted, reactive, ref } from 'vue';
  import { listUsersPage, listUsersPageReply } from '@/api/scrm/wecom/user';
  import useWeComUserStore from '@/store/modules/scrm/wecom/user';
  import { consola } from 'consola';
  import styles from './index.module.less';

  const useWeComUser = useWeComUserStore();

  const state = reactive({
    tableLoading: false,
    deleteUserLoading: false,
    editUser: {
      visible: false,
      loading: false,
      userId: 0,
    },
  });

  const pageData = ref({} as listUsersPageReply);
  const pagination = {
    pageIndex: 1,
    pageSize: 5,
    total: 0,
  };
  const queryChange = () => {
    if (state.tableLoading) {
      return;
    }
    state.tableLoading = true;
    listUsersPage({
      weComTagId: useWeComUser.selectedTag!,
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
    })
      .then((res) => {
        pageData.value = res.data;
      })
      .finally(() => {
        state.tableLoading = false;
      });
  };

  const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: false,
  });

  const onAddUser = () => {
    consola.log('add user');
  };
  const onBatchExportOrImport = () => {
    consola.log('batch export or import');
  };
  const onRemoveUser = () => {
    consola.log('remove');
  };

  onMounted(() => {
    queryChange();
  });
</script>

<template>
  <div :class="styles.container">
    <div :class="styles.title">
      <span>Tag名称（0人）</span>
    </div>
    <div :class="styles.action">
      <a-button :class="styles.actionBtn" @click="onAddUser"
        >添加部门/成员</a-button
      >
      <a-button :class="styles.actionBtn" @click="onBatchExportOrImport"
        >批量导入/导出</a-button
      >
      <a-button :class="styles.actionBtn" @click="onRemoveUser">移除</a-button>
    </div>
    <a-table
      :data="pageData.list"
      :loading="state.tableLoading"
      :row-selection="rowSelection"
      column-resizable
      scrollbar
      :class="styles.userTable"
    >
      <template #columns>
        <a-table-column title="名称" :width="170">
          <template #cell="{ record }">
            {{ record.name }}
          </template>
        </a-table-column>
        <a-table-column title="部门" data-index="department" ellipsis />
      </template>
    </a-table>
  </div>
</template>

<style scoped></style>
