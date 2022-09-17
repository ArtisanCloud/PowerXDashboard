<template>
  <a-modal
    :modal-style="{ padding: '0 36px' }"
    :visible="visible"
    @cancel="close"
    @ok="onOk"
  >
    <a-form ref="formRef" :model="formModel" auto-label-width>
      <a-form-item
        label="部门名称"
        :rules="[{ required: true, message: '部门名称是必填项' }]"
        field="depName"
      >
        <a-input v-model="formModel.depName" />
      </a-form-item>
      <a-form-item
        label="部门负责人"
        field="leaderIds"
        :rules="[{ required: true, message: '部门负责人是必选项' }]"
      >
        <a-select
          :options="options.employeePage.list"
          :field-names="{ label: 'name', value: 'id' }"
          allow-search
          allow-clear
          @search="search"
          @change="
            (v) => {
              formModel.leaderIds = [v];
            }
          "
        >
        </a-select>
      </a-form-item>
      <a-form-item
        label="手机号"
        :rules="{
          match: RegExp(
            '^1(3\\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\\d|9[0-35-9])\\d{8}$'
          ),
          message: '违规手机号格式',
        }"
        field="phoneNumber"
      >
        <a-input v-model="formModel.phoneNumber" />
      </a-form-item>
      <a-form-item
        label="邮箱"
        :rules="{
          match: RegExp(
            '^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([a-z]{2,6}(?:\\.[a-z]{2})?)$'
          ),
          message: '违规邮箱格式',
        }"
        field="email"
      >
        <a-input v-model="formModel.email" />
      </a-form-item>
      <a-form-item label="备注" field="remark">
        <a-input v-model="formModel.remark" />
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
  const formRef = ref();

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

  const onOk = async () => {
    if (await formRef.value.validate()) {
      Message.warning('请检查输入');
      return;
    }
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
