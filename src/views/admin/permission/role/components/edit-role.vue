<template>
  <a-form ref="formRef" :model="formModel" :rules="rules">
    <a-form-item label="角色编码" field="roleCode">
      <a-input v-model="formModel.roleCode" />
    </a-form-item>
    <a-form-item label="角色名称" field="name">
      <a-input v-model="formModel.name" />
    </a-form-item>
    <a-form-item label="描述" field="desc">
      <a-input v-model="formModel.desc" />
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { putRole, PutRoleRequest } from '@/api/permission';
  import { FieldRule } from '@arco-design/web-vue';

  const prop = defineProps({
    roleData: {
      type: Object,
      required: true,
    },
  });

  const formRef = ref();
  const formModel = ref({ ...prop.roleData } as PutRoleRequest);

  const rules = {
    roleCode: [
      { required: true, message: '请输入角色编码' },
      { max: 50, message: '角色编码长度不能超过 50 个字符' },
    ],
    name: [
      { required: true, message: '请输入角色名称' },
      { max: 50, message: '角色名称长度不能超过 50 个字符' },
    ],
    desc: [{ max: 100, message: '描述长度不能超过 100 个字符' }],
  } as Record<string, FieldRule[]>;

  const onSubmit = async () => {
    const err = await formRef.value.validate();
    if (err) {
      return;
    }
    putRole(formModel.value)
      .then(() => {
        // Handle success, e.g. emit an event or show a message
      })
  };
</script>
