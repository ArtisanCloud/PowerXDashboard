<template>
  <div>
    <a-form
      ref="formRef"
      auto-label-width
      :model="formModel"
      :rules="rules"
      @submit="onSubmit"
    >
      <a-form-item label="字典类型" field="type">
        <text>{{ formModel.type }}</text>
      </a-form-item>
      <a-form-item label="显示名称" field="name">
        <a-input v-model="formModel.name" />
      </a-form-item>
      <a-form-item label="描述" field="description">
        <a-textarea v-model="formModel.description" />
      </a-form-item>
      <a-form-item>
        <a-space size="large">
          <a-button type="primary" html-type="submit">提交</a-button>
          <a-button @click="formRef.resetFields()">重置</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, PropType, reactive, ref } from 'vue';
  import {
    updateDictionaryType,
    DictionaryType,
    UpdateDictionaryTypeRequest,
  } from '@/api/dictionary';
  import { FieldRule, Message } from '@arco-design/web-vue';

  const prop = defineProps({
    node: {
      type: Object as PropType<DictionaryType>,
      default() {
        return {};
      },
    },
  });
  const emits = defineEmits(['submitSuccess', 'submitFailed', 'update:id']);

  const formRef = ref();
  const formModel = ref({
    type: prop.node.type,
    name: prop.node.name,
    description: prop.node?.description,
  } as UpdateDictionaryTypeRequest);

  const rules = {
    name: [
      { required: true, message: '请输入数据字典类型名称' },
      { max: 10, message: '数据字典类型名称长度不能超过 10 个字符' },
    ],
    description: [{ max: 100, message: '描述长度不能超过 100 个字符' }],
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
    updateDictionaryType(formModel.value)
      .then(() => {
        Message.success('更新成功');
        emits('submitSuccess');
      })
      .catch(() => {
        emits('submitFailed');
      })
      .finally(() => {
        state.submitLoading = false;
      });
  };

  onMounted(() => {});
</script>
