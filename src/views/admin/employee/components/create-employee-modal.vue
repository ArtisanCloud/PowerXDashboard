<template>
  <a-modal
    title="创建新员工"
    :visible="visible"
    :modal-style="{ padding: '0 36px' }"
    @cancel="close"
    @ok="submit"
  >
    <a-form :model="formModel">
      <a-form-item
        label="账户"
        field="account"
        :rules="{ required: true, message: '账户是必填项' }"
      >
        <a-input v-model="formModel.account" />
      </a-form-item>
      <a-form :model="extraModel">
        <a-form-item
          label="角色"
          field="roleCodes"
          :rules="{ required: true, message: '角色是必填项' }"
        >
          <a-select
            v-model="extraModel.roleCodes"
            multiple
            :options="options.roles"
            :field-names="{ label: 'name', value: 'roleCode' }"
          >
          </a-select>
        </a-form-item>
      </a-form>
      <a-form-item
        label="姓名"
        field="name"
        :rules="[
          { required: true, message: '姓名是必填项' },
          {
            minLength: 2,
            maxLength: 64,
            message: '姓名最少2个字符, 最长64个字符',
          },
        ]"
      >
        <a-input v-model="formModel.name" />
      </a-form-item>
      <a-form-item
        label="昵称"
        field="nickName"
        :rules="[
          {
            minLength: 2,
            maxLength: 64,
            message: '昵称最少2个字符, 最长64个字符',
          },
        ]"
      >
        <a-input v-model="formModel.nickName" />
      </a-form-item>
      <a-form-item
        label="邮箱"
        field="email"
        :rules="[
          { required: true, message: '邮箱是必填项' },
          {
            match: RegExp(
              '^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([a-z]{2,6}(?:\\.[a-z]{2})?)$'
            ),
            message: '违规邮箱格式',
          },
        ]"
      >
        <a-input v-model="formModel.email" />
      </a-form-item>
      <a-form-item
        label="手机号"
        field="mobilePhone"
        :rules="{
          match: RegExp(
            '^1(3\\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\\d|9[0-35-9])\\d{8}$'
          ),
          message: '违规手机号格式',
        }"
      >
        <a-input v-model="formModel.mobilePhone" />
      </a-form-item>
      <a-form-item label="性别" field="gender">
        <a-select v-model="formModel.gender">
          <a-option :value="0">未知</a-option>
          <a-option :value="1">男</a-option>
          <a-option :value="2">女</a-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="所属部门"
        field="depIds"
        :rules="{ required: '所属部门必须设置' }"
      >
        <a-tree-select
          v-model="formModel.depIds"
          multiple
          :field-names="{ title: 'depName', key: 'id', children: 'children' }"
          :data="options.depTree"
        />
      </a-form-item>
      <a-form-item label="职位" field="position">
        <a-input v-model="formModel.position" />
      </a-form-item>
      <a-form-item label="头衔" field="jobTitle">
        <a-input v-model="formModel.jobTitle" />
      </a-form-item>
      <a-form-item label="描述" field="desc">
        <a-textarea v-model="formModel.desc" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
  import { onUpdated, reactive, ref } from 'vue';
  import { createEmployee, CreateEmployeeRequest } from '@/api/employee';
  import { Message } from '@arco-design/web-vue';
  import { getDepartmentTree } from '@/api/department';
  import { assignAuth, AuthRole, listRoles } from '@/api/permission';

  defineProps({
    visible: Boolean,
  });

  const emit = defineEmits(['update:visible', 'refresh']);

  const options = reactive({
    depTree: [] as any[],
    roles: [] as Array<AuthRole>,
  });
  const formModel = ref({} as CreateEmployeeRequest);
  const extraModel = ref(
    {} as {
      roleCodes: string[];
    }
  );

  const close = () => {
    emit('update:visible', false);
  };
  const submit = () => {
    createEmployee(formModel.value).then((res) => {
      formModel.value = {} as CreateEmployeeRequest;
      const uid = res.data.id;

      assignAuth({
        userAssignRes: {
          userIds: [uid],
          roleCodes: extraModel.value.roleCodes,
          isReplace: true,
        },
      })
        .then(() => {
          Message.success('创建成功');
        })
        .catch(() => {
          Message.success('用户创建成功, 角色分配失败, 请稍后手动分配角色');
        })
        .finally(() => {
          close();
          emit('refresh', {});
        });
    });
  };

  onUpdated(async () => {
    getDepartmentTree(1).then((res) => {
      options.depTree = [res.data.depTree];
    });
    listRoles().then((res) => {
      options.roles = res.data.list;
    });
  });
</script>

<style scoped></style>
