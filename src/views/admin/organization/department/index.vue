<template>
  <div class="container">
    <!--    <a-card>-->
    <!--      <a-space size="large">-->
    <!--        <a-button type="primary" @click="state.createDepartment.visible = true"-->
    <!--          >新增部门</a-button-->
    <!--        >-->
    <!--      </a-space>-->
    <!--    </a-card>-->
    <br />
    <a-card>
      <DepartmentTable />
    </a-card>
    <!--    <a-drawer-->
    <!--      v-model:visible="state.createDepartment.visible"-->
    <!--      width="500px"-->
    <!--      :footer="false"-->
    <!--    >-->
    <!--      <CreateDepartment v-if="state.createDepartment.visible"/>-->
    <!--    </a-drawer>-->
  </div>
</template>

<script lang="ts" setup>
  import DepartmentTable from '@/views/admin/organization/department/components/department-table.vue';
  import { reactive } from 'vue';
  import CreateDepartment from '@/views/admin/organization/department/components/create-department.vue';

  const state = reactive({
    createDepartment: {
      visible: false,
    },
  });
</script>

<script lang="ts">
  export default {
    name: 'DepartmentList',
  };
</script>

<style scoped></style>
