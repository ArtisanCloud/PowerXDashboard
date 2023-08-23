<template>
  <a-card>
    <a-table
      :data="departmentTree"
      :loading="state.loading"
      default-expand-all-rows
      row-key="id"
      :tree-props="{ children: 'children' }"
    >
      <template #columns>
        <a-table-column title="部门名称" data-index="depName" />
        <a-table-column title="负责人" data-index="leader.name" />
        <a-table-column title="电话" data-index="phoneNumber" />
        <a-table-column title="邮箱" data-index="email" />
        <a-table-column title="备注" data-index="remark" />
        <a-table-column title="操作">
          <template #cell="{ record }">
            <a-space>
              <!-- 添加子部门按钮 -->
              <a-button @click="openAddSubDepartment(record.id)">
                <template #icon>
                  <icon-plus :style="{ fontSize: '16px', color: 'green' }" />
                </template>
              </a-button>
              <!-- 编辑部门按钮 -->
              <a-button @click="openEditDepartment(record.id)">
                <template #icon>
                  <icon-edit :style="{ fontSize: '16px', color: 'green' }" />
                </template>
              </a-button>
              <!-- 删除部门按钮 -->
              <a-popconfirm
                content="确定要删除此部门吗？"
                @ok="deleteDepartmentById(record.id)"
              >
                <a-button>
                  <template #icon>
                    <icon-delete :style="{ fontSize: '16px', color: 'red' }" />
                  </template>
                </a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </a-table-column>
      </template>
    </a-table>
    <a-drawer
      v-model:visible="state.createSubDepartment.visible"
      width="500px"
      :footer="false"
    >
      <CreateDepartment
        v-if="state.createSubDepartment.visible"
        :id="state.createSubDepartment.parentId"
        @submit-success="fetchDepartmentTree()"
      />
    </a-drawer>
    <a-drawer
      v-model:visible="state.editDepartment.visible"
      width="500px"
      :footer="false"
    >
      <EditDepartment
        v-if="state.editDepartment.visible"
        :id="state.editDepartment.departmentId"
      />
    </a-drawer>
  </a-card>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';
  import {
    deleteDepartment,
    DepartmentNode,
    getDepartmentTree,
  } from '@/api/department';
  import CreateDepartment from '@/views/admin/organization/department/components/create-department.vue';
  import EditDepartment from '@/views/admin/organization/department/components/edit-department.vue';

  const departmentTree = ref<DepartmentNode[]>([]);

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

  const fetchDepartmentTree = async () => {
    state.loading = true;
    try {
      const res = await getDepartmentTree({ depId: 1 });
      departmentTree.value = [res.data.depTree];
    } finally {
      state.loading = false;
    }
    state.createDepartment.visible = false;
    state.createSubDepartment.visible = false;
    state.editDepartment.visible = false;
  };

  const openAddSubDepartment = (depId: number) => {
    state.createSubDepartment.parentId = depId;
    state.createSubDepartment.visible = true;
  };

  const openEditDepartment = (depId: number) => {
    state.editDepartment.departmentId = depId;
    state.editDepartment.visible = true;
  };

  const deleteDepartmentById = async (depId: number) => {
    try {
      await deleteDepartment({ id: depId });
      await fetchDepartmentTree();
    } catch (error) {
      // console.error(error);
    }
  };

  onMounted(() => {
    fetchDepartmentTree();
  });
</script>

<style scoped></style>
