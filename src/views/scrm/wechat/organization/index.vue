<!--
 * @Description: 
 * @Author: George
 * @Date: 2023-08-17 11:51:43
 * @LastEditors: George
 * @LastEditTime: 2023-08-17 14:18:06
-->
<template>
  <a-card>
    <a-table
      :data="departmentTree.list"
      :loading="state.loading"
      default-expand-all-rows
      row-key="id"
      :pagination="pagination"
      :tree-props="{ children: 'children' }"
    >
      <template #columns>
        <a-table-column title="部门名称" data-index="name" />
        <a-table-column title="负责人" data-index="leader.name">
          <template #cell="{ record }">
            <span
              v-if="
                record.departmentLeader && record.departmentLeader.length > 0
              "
              >{{ record.departmentLeader.join(',') }}</span
            >
          </template>
        </a-table-column>
        <a-table-column title="电话" data-index="phoneNumber" />
        <a-table-column title="邮箱" data-index="email" />
        <a-table-column title="备注" data-index="remark" />
      </template>
    </a-table>
  </a-card>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';
  import {
    DepartmentNode,
    GetDepartmentTreeReply,
    getDepartmentTree,
  } from '@/api/scrm/department';

  const departmentTree = ref<GetDepartmentTreeReply>({
    total: 0,
    pageIndex: 0,
    pageSize: 10,
    list: [],
  });

  const state = reactive({
    loading: false,
    createDepartment: {
      visible: false,
    },
    createSubDepartment: {
      visible: false,
      parentId: 0,
    },
    editDepartment: {
      visible: false,
      departmentId: 0,
    },
  });
  const pagination = reactive({
    total: 0,
    pageSize: 10,
    current: 1,
  });
  const departNodes = (data: DepartmentNode[], parentId = 0) => {
    const departNodesList: DepartmentNode[] = [];
    data.forEach((item) => {
      if (item.weWorkParentId === parentId) {
        const children = departNodes(data, item.weWorkDepId);
        if (children.length > 0) {
          item.children = children;
        }
        departNodesList.push(item);
      }
    });
    return departNodesList;
  };
  const fetchDepartmentTree = async () => {
    state.loading = true;
    try {
      const res = await getDepartmentTree();
      const list: DepartmentNode | any = res.data.list || [];
      const departNodesList = departNodes(list);
      res.data.list = departNodesList;
      departmentTree.value = res.data;
      pagination.total = res.data.total;
      pagination.current = res.data.pageIndex;
    } finally {
      state.loading = false;
    }
  };
  onMounted(() => {
    fetchDepartmentTree();
  });
</script>

<style scoped></style>
