<script setup lang="ts">
  import { onMounted, reactive, ref } from 'vue';
  import {
    listUsersPage,
    listUsersPageReply,
    listUsersPageRequest,
  } from '@/api/scrm/wecom/user';
  import styles from './index.module.less';

  const queryForm = reactive({
    WeComMainDepartmentId: null,
  } as listUsersPageRequest);
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

  const queryChange = () => {
    if (state.tableLoading) {
      return;
    }
    state.tableLoading = true;
    listUsersPage(queryForm)
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

  onMounted(() => {
    queryChange();
  });
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
    >
      <template #columns>
        <a-table-column title="用户ID" data-index="userid" :width="100" />
        <a-table-column title="姓名">
          <template #cell="{ record }">
            {{ record.name }}
          </template>
        </a-table-column>
        <a-table-column title="职务" data-index="position" ellipsis />
        <a-table-column title="部门" data-index="department" ellipsis />
        <a-table-column title="手机" data-index="mobile" ellipsis />
        <a-table-column title="企业邮箱" data-index="Email" ellipsis />
      </template>
    </a-table>
  </div>
</template>

<style scoped></style>
