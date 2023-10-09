<template>
  <div>
    <a-form
      ref="formRef"
      auto-label-width
      :model="formModel"
      :rules="rules"
      @submit="onSubmit"
    >
      <a-form-item label="产品名称" field="soldAmount">
        <a-typography-text>{{ prop.node.name }}</a-typography-text>
      </a-form-item>

      <a-form-item label="实际销售订单量" field="soldAmount">
        <a-input-number v-model="formModel.soldAmount" disabled />
      </a-form-item>
      <a-form-item label="实际库存量" field="inventoryQuantity">
        <a-input-number v-model="formModel.inventoryQuantity" disabled />
      </a-form-item>
      <a-form-item label="实际浏览量" field="viewCount">
        <a-input-number v-model="formModel.viewCount" disabled />
      </a-form-item>

      <a-form-item label="基础销售订单量" field="baseSoldAmount">
        <a-input-number v-model="formModel.baseSoldAmount" />
      </a-form-item>

      <a-form-item label="基础库存量" field="baseInventoryQuantity">
        <a-input-number v-model="formModel.baseInventoryQuantity" />
      </a-form-item>

      <a-form-item label="基础浏览量" field="baseViewCount">
        <a-input-number v-model="formModel.baseViewCount" />
      </a-form-item>

      <a-divider />
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
  import useOptionsStore from '@/store/modules/data-dictionary';

  import { Product } from '@/api/crm/product-service/product';
  import {
    configProductStatistics,
    getProductStatisticsByProductId,
    ProductStatistics,
  } from '@/api/crm/product-service/product-statistics';

  const prop = defineProps({
    node: {
      type: Object as PropType<Product>,
      default() {
        return {};
      },
    },
  });

  const emits = defineEmits(['submitSuccess', 'submitFailed', 'update:id']);

  const options = useOptionsStore();

  const formRef = ref();
  const formModel = ref({
    productId: 0,
    soldAmount: 0,
    inventoryQuantity: 0,
    viewCount: 0,
    baseSoldAmount: 0,
    baseInventoryQuantity: 0,
    baseViewCount: 0,
  } as ProductStatistics);

  const rules = {} as Record<string, FieldRule[]>;

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
    configProductStatistics(formModel.value)
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

  onMounted(async () => {
    const res = await getProductStatisticsByProductId({
      productId: prop.node.id!,
    });
    formModel.value = res.data;
  });
</script>
