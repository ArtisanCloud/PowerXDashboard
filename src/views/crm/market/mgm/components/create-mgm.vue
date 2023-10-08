<template>
  <div>
    <a-form
      ref="formRef"
      auto-label-width
      :model="formModel"
      :rules="rules"
      @submit="onSubmit"
    >
      <a-form-item label="规则名称" field="name">
        <a-input v-model="formModel.name" />
      </a-form-item>

      <a-form-item label="一级反佣率" field="commissionRate1">
        <a-input-number
          v-model="formModel.commissionRate1"
          :min="0"
          :max="1"
          :step="0.01"
        />
      </a-form-item>

      <a-form-item label="二级反佣率" field="commissionRate2">
        <a-input-number
          v-model="formModel.commissionRate2"
          :min="0"
          :max="1"
          :step="0.01"
        />
      </a-form-item>
      <a-form-item label="类型" field="scene">
        <a-select
          v-model="formModel.scene"
          :options="options.mgmScenes"
          :field-names="{ label: 'name', value: 'id' }"
          placeholder="请选择类型"
        />
      </a-form-item>

      <a-form-item label="内容" field="description">
        <a-textarea v-model="formModel.description" />
      </a-form-item>
      <a-divider />

      <a-space size="large">
        <a-button type="primary" html-type="submit">提交</a-button>
        <a-button @click="formRef.resetFields()">重置</a-button>
      </a-space>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';
  import { FieldRule, Message } from '@arco-design/web-vue';
  import useOptionsStore from '@/store/modules/data-dictionary';
  import { createMGMRule, MGMRule } from '@/api/crm/market/mgm';

  const emits = defineEmits(['submitSuccess', 'submitFailed', 'update:id']);

  const options = useOptionsStore();

  const formRef = ref();
  const formModel = ref({
    name: '',
    commissionRate1: 0,
    commissionRate2: 0,
    description: '',
  } as MGMRule);

  const rules = {
    name: [
      { required: true, message: '请输入MGM规则名称' },
      { max: 10, message: '商品名称长度不能超过 10 个字符' },
    ],
    commissionRate1: [
      { type: 'number', min: 0, max: 1, message: '不能超过100%' },
    ],
    commissionRate2: [
      { type: 'number', min: 0, max: 1, message: '不能超过100%' },
    ],
    scene: [{ required: true, message: '请输入规则类型名称' }],
    description: [{ max: 100, message: '描述长度不能超过 100 个字符' }],
  } as Record<string, FieldRule[]>;

  const state = reactive({
    submitLoading: false,
  });

  const onSubmit = async () => {
    if (state.submitLoading) {
      return;
    }
    const err = await formRef.value.validate();
    if (err) {
      return;
    }
    state.submitLoading = true;
    createMGMRule(formModel.value)
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
</script>
