<template>
  <div>
    <a-spin :loading="state.loading">
      <a-transfer
        v-if="state.loading === false"
        :data="transferData"
        :default-value="selected"
        show-search
        :title="['未分配', '已分配']"
        @change="onChange"
      >
      </a-transfer>
      <div style="width: 100%; margin-top: 24px; text-align: center">
        <a-button type="primary" @click="submit">更新</a-button>
      </div>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, reactive, computed } from 'vue';
  import {
    getRoleEmployees,
    GetRoleEmployeesRequest,
    RoleEmployee,
    setRoleEmployees,
  } from '@/api/permission';
  import { EmployeeOption, getEmployeeOptions } from '@/api/common';
  import { Message } from '@arco-design/web-vue';
  import { MaxPageSize } from '@/api';

  const prop = defineProps({
    roleCode: {
      type: String,
      required: true,
      default: '',
    },
  });

  const emit = defineEmits(['submitSuccess']);

  const data = ref([] as RoleEmployee[]);

  const option = reactive({
    employeeList: [] as EmployeeOption[],
  });

  const transferData = computed(() =>
    option.employeeList.map(
      (employee) =>
        ({
          value: employee.id.toString(),
          label:
            `${employee.name}(${employee.email})` !== ''
              ? `${employee.name}`
              : '',
        }) as any,
    ),
  );

  const selected = computed(() =>
    data.value.map((employee) => employee.id.toString()),
  );

  const selectValue = ref([] as number[]);

  const state = reactive({
    loading: true,
  });

  const onChange = (values: string[]) => {
    selectValue.value = values.map((value) => parseInt(value, 10));
  };

  const fetchRoleEmployees = async (roleCode: string) => {
    state.loading = true;
    const request: GetRoleEmployeesRequest = {
      roleCode,
      pageIndex: 1,
      pageSize: MaxPageSize,
    };

    getRoleEmployees(request)
      .then((res) => {
        data.value = res.data.list;
      })
      .finally(() => {
        state.loading = false;
      });
  };

  // todo pagination
  function fetchOption() {
    getEmployeeOptions({
      pageIndex: 1,
      pageSize: MaxPageSize,
    }).then((res) => {
      option.employeeList = res.data.list;
    });
  }

  const submit = () => {
    setRoleEmployees({
      roleCode: prop.roleCode,
      employeeIds: selectValue.value,
    }).then(() => {
      Message.success('更新成功');
      emit('submitSuccess');
    });
  };

  onMounted(() => {
    fetchOption();
    fetchRoleEmployees(prop.roleCode);
  });
</script>
