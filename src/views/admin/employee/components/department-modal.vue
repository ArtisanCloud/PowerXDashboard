<template>
  <a-modal
    :modal-style="{ padding: '0 36px' }"
    :visible="visible"
    @cancel="close"
    @ok="onOk"
  >
    <a-form :model="formModel">
      <a-form-item label="部门名称">
        <a-input v-model="formModel.depName" />
      </a-form-item>
      <a-form-item label="部门描述">
        <a-input v-model="formModel.desc"></a-input>
      </a-form-item>
      <a-form-item label="部门主管">
        <a-select
          v-model="formModel.leaderIds"
          multiple
          :options="options.employeePage.list"
          :field-names="{ label: 'name', value: 'id' }"
          @search="search"
        >
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
  import { onUpdated, reactive, ref } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import {
    listEmployees,
    ListEmployeesReply,
    ListEmployeesRequest,
  } from '@/api/employee';
  import { createDepartment, CreateDepartmentRequest } from '@/api/department';

  const props = defineProps({
    visible: Boolean,
    parentId: Number,
  });

  const emit = defineEmits(['update:visible', 'refresh']);

  const formModel = ref({} as CreateDepartmentRequest);

  const options = reactive({
    employeePage: {} as ListEmployeesReply,
  });

  function fetchEmployees(req: ListEmployeesRequest) {
    listEmployees(req).then((res) => {
      options.employeePage = res.data;
    });
  }

  const close = () => {
    formModel.value = {} as CreateDepartmentRequest;
    emit('refresh', {});
    emit('update:visible', false);
  };

  function createDep(req: CreateDepartmentRequest) {
    formModel.value.pId = props.parentId as number;
    createDepartment(req).then(() => {
      Message.success('创建成功');
      close();
    });
  }

  const onOk = () => {
    createDep(formModel.value);
  };

  const search = (input: string) => {
    fetchEmployees({
      likeName: input,
    });
  };

  onUpdated(() => {
    fetchEmployees({});
  });
</script>

<style scoped></style>
