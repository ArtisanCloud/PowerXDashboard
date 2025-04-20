<script setup lang="ts">
  import { onMounted, reactive, ref } from 'vue';
  import { listUsers, ListUsersReply, ListUsersRequest } from '@/api/scrm/user';
  import styles from './index.module.less';

  const queryForm = reactive({
    WeComMainDepartmentId: null,
  } as ListUsersRequest);
  const state = reactive({
    tableLoading: false,
    deleteUserLoading: false,
    editUser: {
      visible: false,
      loading: false,
      userId: 0,
    },
  });

  const pageData = ref({} as ListUsersReply);

  const queryChange = () => {
    if (state.tableLoading) {
      return;
    }
    state.tableLoading = true;
    listUsers(queryForm)
      .then((res) => {
        pageData.value = res.data;
      })
      .finally(() => {
        state.tableLoading = false;
      });
  };

  onMounted(() => {
    queryChange();
  });
</script>

<template>
  <div :class="styles.container">
    <a-table
      :data="pageData.list"
      :loading="state.tableLoading"
      column-resizable
      scrollbar
      :class="styles.userTable"
    >
      <template #columns>
        <a-table-column title="用户id" data-index="Mobile" :width="150" />
        <a-table-column title="姓名" :width="100">
          <template #cell="{ record }">
            {{ record.name }}
          </template>
        </a-table-column>
        <!-- <a-table-column title="性别" :width="75">
          <template #cell="{ record }">
            <span>{{ getGenderLabel(record.gender) }}</span>
          </template>
        </a-table-column> -->
        <a-table-column title="邮箱" data-index="Email" :width="175" ellipsis />
      </template>
    </a-table>
  </div>
</template>

<style scoped></style>
