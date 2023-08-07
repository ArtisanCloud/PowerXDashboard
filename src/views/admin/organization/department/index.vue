<template>
  <div class="container">
    <a-card>
      <DepartmentTable />
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import DepartmentTable from '@/views/admin/organization/department/components/department-table.vue';
</script>

<script lang="ts">
  export default {
    name: 'OrganizationDepartmentList',
  };
</script>

<style scoped></style>
