<script setup lang="ts">
  import { onMounted, reactive, ref, watch } from 'vue';
  import {
    listUsersPage,
    listUsersPageReply,
    listUsersPageRequest,
  } from '@/api/scrm/wecom/user';
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
      departmentIds: useWeComUser.selectedDepartmentIds,
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
    } as listUsersPageRequest)
      .then((res) => {
        pageData.value = res.data;
        pagination.pageIndex = res.data.pageIndex;
        pagination.total = res.data.total;
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

  watch(
    () => useWeComUser.selectedDepartmentIds,
    () => {
      // consola.log('changed:', useWeComUser.selectedDepartmentIds);
      queryChange();
    },
  );

  const onAddUser = () => {
    console.log('add user');
  };
  const onBatchExportOrImport = () => {
    console.log('batch export or import');
  };
  const onBatchUpdateUser = () => {
    console.log('update user');
  };
  const onDeleteUser = () => {
    console.log('delete');
  };
  const onWechatInvite = () => {
    console.log('wechat_invite');
  };

  const handlePageChange = (page: number) => {
    pagination.pageIndex = page;
    queryChange();
  };

  // onMounted(async () => {
  //   await useWeComUser.setSelectedDepartment(1);
  //   queryChange();
  // });
</script>

<template>
  <div :class="styles.container">
    <div :class="styles.title">
      <span>组织名称（0人）</span>
    </div>
    <div :class="styles.action">
      <a-button :class="styles.actionBtn" @click="onAddUser">添加成员</a-button>
      <a-button :class="styles.actionBtn" @click="onBatchExportOrImport"
        >批量导入/导出</a-button
      >
      <a-button :class="styles.actionBtn" @click="onBatchUpdateUser"
        >批量设置成员信息</a-button
      >
      <a-button :class="styles.actionBtn" @click="onDeleteUser">删除</a-button>
      <a-divider direction="vertical" :class="styles.divider" />
      <a-button
        class="flex gap-1"
        :class="styles.actionBtn"
        @click="onWechatInvite"
        ><icon-qrcode />微信邀请</a-button
      >
    </div>
    <a-table
      :data="pageData.list"
      :loading="state.tableLoading"
      :row-selection="rowSelection"
      column-resizable
      scrollbar
      :class="styles.userTable"
      :pagination="pagination"
      @page-change="(page: number) => handlePageChange(page)"
    >
      <template #columns>
        <a-table-column title="用户ID" data-index="userId" :width="100" />
        <a-table-column title="姓名" :width="100">
          <template #cell="{ record }">
            {{ record.name }}
          </template>
        </a-table-column>
        <a-table-column
          title="职务"
          data-index="position"
          :width="100"
          ellipsis
        />
        <a-table-column title="部门" data-index="departments" ellipsis />
        <a-table-column
          title="手机"
          data-index="mobile"
          :width="150"
          ellipsis
        />
        <a-table-column title="企业邮箱" data-index="email" ellipsis />
      </template>
    </a-table>
  </div>
</template>

<style scoped></style>
