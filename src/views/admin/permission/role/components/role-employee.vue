<template>
  <div>
    <a-transfer
      :data="transferData"
      :default-value="selected"
      show-search
      @change="onChange"
    >
    </a-transfer>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, reactive, computed } from 'vue';
  import {
    getRoleEmployees,
    GetRoleEmployeesRequest,
    RoleEmployee,
  } from '@/api/permission';
  import { EmployeeOption } from '@/api/common';
  import { TransferItem } from '@arco-design/web-vue/es/transfer/interface';

  const prop = defineProps({
    roleCode: {
      type: String,
      required: true,
      default: '',
    },
  });

  const data = ref([] as RoleEmployee[]);

  const option = reactive({
    employeeList: [] as EmployeeOption[],
  });

  const transferData = computed(() =>
    data.value.map(
      (employee) =>
        ({
          value: employee.id.toString(),
          label: `${employee.name}(${employee.email})`,
        } as TransferItem)
    )
  );

  const selected = computed(() =>
    option.employeeList.map((employee) => employee.id.toString())
  );

  const fetchRoleEmployees = async (roleCode: string) => {
    const request: GetRoleEmployeesRequest = {
      roleCode,
      pageIndex: 1,
      pageSize: 99999,
    };

    const response = await getRoleEmployees(request);
    data.value = response.data.list.map((employee) => ({
      ...employee,
      value: employee.id.toString(),
      label: employee.name,
    }));
  };

  onMounted(() => {
    fetchRoleEmployees(prop.roleCode);
  });
</script>
