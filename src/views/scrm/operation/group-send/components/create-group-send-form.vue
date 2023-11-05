<template>
  <div>
    <a-form ref="formRef" :model="formModel" :rules="rules" @submit="onSubmit">
      <a-form-item label="群发类型" field="chatType">
        <a-select v-model="formModel.chatType">
          <a-option value="single">客户</a-option>
          <a-option value="group" disabled>客户群</a-option>
        </a-select>
      </a-form-item>
      <a-form-item v-if="isSingle" label="客户" field="externalUserIds">
        <a-select v-model="formModel.externalUserIds" />
      </a-form-item>
      <a-form-item v-if="isGroup" label="客户群" field="customerGroup">
        <a-select v-model="formModel.customerGroup" disabled />
      </a-form-item>
      <a-form-item label="群发文本内容" field="text">
        <a-textarea v-model="formModel.text.content" />
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
  import { ref, computed } from 'vue';
  import { FieldRule, Message } from '@arco-design/web-vue';
  import { groupSend } from '@/api/scrm/operation/group-send';

  const formRef = ref();
  const formModel = ref({
    chatType: '',
    externalUserIds: [] as any[],
    customerGroup: '',
    text: {
      content: '',
    },
  });

  const emit = defineEmits(['submitSuccess', 'submitFailed']);

  const rules = {
    chatType: [{ required: true, message: '请输入群发类型' }],
    externalUserIds: [{ required: true, message: '请输入外部用户ID' }],
    text: [{ required: true, message: '请输入群发文本内容' }],
  } as Record<string, FieldRule[]>;

  const isSingle = computed(() => formModel.value.chatType === 'single');
  const isGroup = computed(() => formModel.value.chatType === 'group');

  const onSubmit = async () => {
    const err = await formRef.value.validate();
    if (err !== undefined) {
      Message.warning({ content: '请检查表单输入', duration: 5000 });
      return;
    }
    groupSend(formModel.value)
      .then((res) => {
        Message.success({ content: '提交成功', duration: 5000 });
        emit('submitSuccess');
      })
      .catch((error) => {
        Message.error({
          content: `提交失败: ${error.message}`,
          duration: 5000,
        });
        emit('submitFailed', error);
      });
  };
</script>
