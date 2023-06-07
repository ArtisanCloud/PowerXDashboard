<template>
  <div>
    <a-form
      ref="formRef"
      auto-label-width
      :model="formModel"
      :rules="rules"
      @submit="onSubmit"
    >
      <a-form-item label="数据类型标识" field="type">
        <a-input v-model="formModel.type" disabled />
      </a-form-item>
      <a-form-item label="数据项唯一标识key" field="key">
        <a-input v-model="formModel.key" />
      </a-form-item>
      <a-form-item label="数据显示名字" field="name">
        <a-input v-model="formModel.name" />
      </a-form-item>

      <a-form-item label="数据计算值" field="value">
        <a-input v-model="formModel.value" />
      </a-form-item>
      <a-form-item label="排序" field="sort">
        <a-input-number v-model="formModel.sort" />
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
  import { FieldRule, Message } from '@arco-design/web-vue';
  import {
    CreateDictionaryItemRequest,
    createDictionaryItem,
    DictionaryType,
  } from '@/api/dictionary';

  const prop = defineProps({
    parentNode: {
      type: Object as PropType<DictionaryType>,
      default() {
        return {};
      },
    },
  });

  const emits = defineEmits(['submitSuccess', 'submitFailed', 'update:id']);

  const formRef = ref();
  const formModel = ref({
    type: prop.parentNode?.type,
    key: '',
    name: '',
    value: '',
    sort: 0,
    description: '',
  } as CreateDictionaryItemRequest);

  const rules = {
    key: [
      { required: true, message: '请输入数据项唯一标识key' },
      { max: 20, message: '数据项唯一标识key长度不能超过 10 个字符' },
    ],
    name: [
      { required: true, message: '请输入数据显示名字' },
      { max: 10, message: '数据显示名字长度不能超过 10 个字符' },
    ],
    value: [
      { required: true, message: '请输入数据计算值' },
      { max: 20, message: '数据计算值长度不能超过 20 个字符' },
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
    createDictionaryItem(formModel.value)
      .then(() => {
        Message.success('创建成功');
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
