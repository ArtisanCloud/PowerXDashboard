<template>
  <a-form ref="formRef" :model="formModel" :rules="rules" @submit="onSubmit">
    <a-form-item label="职位名称" field="name">
      <a-input v-model="formModel.name" />
    </a-form-item>
    <a-form-item label="描述" field="desc">
      <a-input v-model="formModel.desc" />
    </a-form-item>
    <a-form-item label="级别" field="level">
      <a-select v-model="formModel.level">
        <template #prefix>
          <span>LEVEL</span>
        </template>
        <a-option v-for="option in 9" :key="option" :value="option.toString()">
          {{ option }}
        </a-option>
      </a-select>
    </a-form-item>
    <a-form-item label="权限角色" field="roleCodes">
      <a-select
        v-model="formModel.roleCodes"
        multiple
        placeholder="请选择权限角色"
      >
        <a-option
          v-for="option in roleOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </a-option>
      </a-select>
    </a-form-item>
    <a-form-item>
      <a-space size="large">
        <a-button type="primary" html-type="submit">提交</a-button>
        <a-button @click="formRef.resetFields()">重置</a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import {
    getPosition,
    patchPosition,
    PatchPositionRequest,
  } from '@/api/position';
  import { FieldRule, Message } from '@arco-design/web-vue';
  import { AdminRole, listRoles } from '@/api/permission';
  import { getOptions } from '@/api/common';

  const prop = defineProps({
    positionId: {
      type: Number,
      required: true,
    },
  });

  const emit = defineEmits(['submitSuccess']);

  const formRef = ref();
  const formModel = ref({ id: prop.positionId } as PatchPositionRequest);

  const roleOptions = ref([] as any[]);

  function fetchRolesOptions() {
    getOptions({ type: 'role' }).then((res) => {
      roleOptions.value = res.data.options;
    });
  }

  const rules = {
    name: [
      { required: true, message: '请输入职位名称' },
      { max: 50, message: '职位名称长度不能超过 50 个字符' },
    ],
    desc: [{ max: 100, message: '描述长度不能超过 100 个字符' }],
    level: [{ required: true, message: '请输入职位级别' }],
  } as Record<string, FieldRule[]>;

  function fetch() {
    getPosition({ id: prop.positionId }).then((res) => {
      formModel.value = res.data;
    });
  }

  const onSubmit = async () => {
    const err = await formRef.value.validate();
    if (err) {
      return;
    }
    patchPosition(formModel.value).then(() => {
      Message.success('修改成功');
      emit('submitSuccess');
    });
  };

  onMounted(() => {
    fetch();
    fetchRolesOptions();
  });
</script>
