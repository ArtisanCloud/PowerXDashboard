<template>
  <div class="container">
    <a-card>
      <a-space>
        <a-button type="primary" @click="state.createEmployeeVisible = true"
          >新增员工</a-button
        >
      </a-space>
    </a-card>
    <br />
    <a-card>
      <a-row :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
        <a-col
          :xs="24"
          :sm="24"
          :md="12"
          :lg="8"
          :style="{ minWidth: '300px', maxWidth: '20%' }"
        >
          <a-card>
            <a-scrollbar style="width: 100%; height: 100%; overflow: auto">
              <DepartmentSide style="min-height: 60vh" />
            </a-scrollbar>
          </a-card>
        </a-col>
        <a-col :xs="24" :sm="24" :md="12" :lg="16">
          <SearchEmployeeTable />
        </a-col>
      </a-row>
    </a-card>

    <a-drawer
      v-model:visible="state.createEmployeeVisible"
      title="新增员工"
      width="500px"
    >
      <CreateEmployee @submit-success="state.createEmployeeVisible = false" />
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
  import CreateEmployee from '@/views/admin/employee/components/create-employee.vue';
  import { reactive } from 'vue';
  import SearchEmployeeTable from '@/views/admin/employee/components/search-employee-table.vue';
  import DepartmentSide from '@/views/admin/employee/components/department-side.vue';

  const state = reactive({
    createEmployeeVisible: false,
  });
</script>

<script lang="ts">
  export default {
    name: 'EmployeeList',
  };
</script>

<style lang="less" scoped></style>
