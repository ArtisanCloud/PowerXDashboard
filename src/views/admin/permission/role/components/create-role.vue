<template>
  <a-form ref="formRef" :model="formModel" :rules="rules" @submit="onSubmit">
    <a-form-item label="角色编码" field="roleCode">
      <a-input v-model="formModel.roleCode" />
    </a-form-item>
    <a-form-item label="角色名称" field="name">
      <a-input v-model="formModel.name" />
    </a-form-item>
    <a-form-item label="描述" field="desc">
      <a-input v-model="formModel.desc" />
    </a-form-item>
    <a-form-item label="API 权限" field="apiIds">
      <a-scrollbar style="width: 100%; height: 300px; overflow: auto">
        <ApiTreeSelect v-model="formModel.apiIds" />
      </a-scrollbar>
    </a-form-item>
    <a-form-item label="菜单权限" field="menuNames">
      <a-scrollbar style="width: 100%; height: 300px; overflow: auto">
        <MenuTreeSelect v-model="formModel.menuNames" />
      </a-scrollbar>
    </a-form-item>
    <a-form-item>
      <a-space size="large">
        <a-button type="primary" html-type="submit">提交</a-button>
        <a-button @click="$refs.formRef.resetFields()">重置</a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { FieldRule, Message } from '@arco-design/web-vue';
  import { createRole, CreateRoleRequest } from '@/api/permission';
  import ApiTreeSelect from '@/views/admin/permission/role/components/api-tree-select.vue';
  import MenuTreeSelect from '@/views/admin/permission/role/components/menu-tree-select.vue';

  const formRef = ref();
  const formModel = ref({
    roleCode: '',
    name: '',
    desc: '',
    apiIds: [],
    menuNames: [],
  } as CreateRoleRequest);

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
    createRole(formModel.value).then(() => {
      Message.success('创建成功');
    });
  };
</script>
