<template>
  <div>
    <a-form
      ref="formRef"
      auto-label-width
      :model="formModel"
      :rules="rules"
      @submit="onSubmit"
    >
      <a-form-item label="交易价格" field="unitPrice">
        <a-input-number v-model="formModel.unitPrice" />
      </a-form-item>
      <a-form-item label="标识价格" field="listPrice">
        <a-input-number v-model="formModel.listPrice" />
      </a-form-item>
      <a-form-item label="描述" field="状态">
        <a-checkbox v-model="formModel.isActive">激活</a-checkbox>
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
  import { PropType, reactive, ref } from 'vue';
  import { FieldRule, Message } from '@arco-design/web-vue';
  import {
    PriceBookEntry,
    updatePriceBookEntry,
  } from '@/api/crm/product-service/price-book-entry';

  const prop = defineProps({
    node: {
      type: Object as PropType<PriceBookEntry>,
      default() {
        return {};
      },
    },
  });
  const emits = defineEmits(['submitSuccess', 'submitFailed', 'update:id']);

  const formRef = ref();
  const formModel = ref({
    id: prop.node.id,
    priceBookId: prop.node.priceBookId,
    productId: prop.node.productId,
    skuId: prop.node?.skuId,
    unitPrice: prop.node?.unitPrice,
    listPrice: prop.node?.listPrice,
    isActive: prop.node?.isActive,
  } as PriceBookEntry);

  const rules = {
    name: [
      { required: true, message: '请输入价格手册名称' },
      { max: 10, message: '价格手册名称长度不能超过 10 个字符' },
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
    updatePriceBookEntry(formModel.value)
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
</script>
