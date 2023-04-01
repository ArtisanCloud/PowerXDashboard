<template>
  <div>
    <a-form ref="formRef" :model="formModel" :rules="rules" @submit="onSubmit">
      <a-form-item label="部门名称" field="depName">
        <a-input v-model="formModel.depName" />
      </a-form-item>
      <a-form-item label="部门负责人" field="leaderId">
        <a-select v-model="formModel.leaderId" />
      </a-form-item>
      <a-form-item label="父部门" field="pId">
        <a-select v-model="formModel.pId" />
      </a-form-item>
      <a-form-item label="描述" field="desc">
        <a-input v-model="formModel.desc" />
      </a-form-item>
      <a-form-item label="电话号码" field="phoneNumber">
        <a-input v-model="formModel.phoneNumber" />
      </a-form-item>
      <a-form-item label="邮箱" field="email">
        <a-input v-model="formModel.email" />
      </a-form-item>
      <a-form-item label="备注" field="remark">
        <a-input v-model="formModel.remark" />
      </a-form-item>
      <a-form-item>
        <a-space size="large">
          <a-button type="primary" html-type="submit">提交</a-button>
          <a-button @click="$refs.formRef.resetFields()">重置</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { computed, reactive, ref } from 'vue';
  import { FieldRule, Message } from '@arco-design/web-vue';
  import { createDepartment, CreateDepartmentRequest } from '@/api/department';

  const prop = defineProps({
    id: {
      type: Number,
      default: 1,
    },
  });

  const emit = defineEmits(['submitSuccess', 'submitFailed', 'update:id']);

  const parentId = computed({
    get() {
      return prop.id;
    },
    set(val) {
      emit('update:id', val);
    },
  });

  const formRef = ref();
  const formModel = ref({
    depName: '',
    leaderId: 0,
    pId: parentId.value,
    desc: '',
    phoneNumber: '',
    email: '',
    remark: '',
  } as CreateDepartmentRequest);

  const rules = {
    depName: [
      { required: true, message: '请输入部门名称' },
      { max: 50, message: '部门名称长度不能超过 50 个字符' },
    ],
    leaderId: [{ required: true, message: '请选择部门负责人' }],
    pId: [{ required: true, message: '请选择父部门' }],
    desc: [{ max: 100, message: '描述长度不能超过 100 个字符' }],
    phoneNumber: [
      {
        match: /^1[3-9]\d{9}$/,
        message: '请输入正确的手机号',
      },
    ],
    email: [{ type: 'email', message: '请输入正确的邮箱格式' }],
    remark: [{ max: 100, message: '备注长度不能超过 100 个字符' }],
  } as Record<string, FieldRule[]>;

  const state = reactive({ submitLoading: false });

  const onSubmit = async () => {
    if (state.submitLoading) {
      return;
    }
    const err = await formRef.value.validate();
    if (err) {
      return;
    }
    state.submitLoading = true;
    createDepartment(formModel.value)
      .then(() => {
        Message.success('创建成功');
        emit('submitSuccess');
      })
      .catch(() => {
        emit('submitFailed');
      })
      .finally(() => {
        state.submitLoading = false;
      });
  };
</script>
