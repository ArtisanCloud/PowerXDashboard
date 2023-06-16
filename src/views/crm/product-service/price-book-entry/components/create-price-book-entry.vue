<template>
  <div style="display: grid; place-items: center">
    <a-steps
      style="width: 600px; padding-top: 40px"
      changeable
      :current="state.currentStep"
      @change="setCurrent"
    >
      <a-step description="This is a description">选配产品</a-step>
      <a-step description="This is a description">配置价格</a-step>
    </a-steps>
    <div
      :style="{
        width: '100%',
        height: '800px',
        textAlign: 'center',
        background: 'var(--color-bg-2)',
        color: '#C2C7CC',
      }"
    >
      <div :style="divStyle(1)">选配价格</div>
      <div :style="divStyle(2)">配置价格</div>
      <a-space size="large">
        <a-button
          type="secondary"
          :disabled="state.currentStep <= 1"
          @click="onPrev"
        >
          <IconLeft /> 上一步
        </a-button>
        <a-button
          type="primary"
          :disabled="state.currentStep >= 2"
          @click="onNext"
        >
          下一步 <IconRight />
        </a-button>
      </a-space>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';
  import {
    createPriceBook,
    PriceBook,
  } from '@/api/crm/product-service/priceBook';
  import { FieldRule, Message } from '@arco-design/web-vue';

  const emits = defineEmits(['submitSuccess', 'submitFailed', 'update:id']);

  const formRef = ref();
  const formModel = ref({
    isStandard: false,
    name: '',
    description: '',
    storeId: 0,
  } as PriceBook);

  const rules = {
    name: [
      { required: true, message: '请输入价格手册名称' },
      { max: 10, message: '价格手册名称长度不能超过 10 个字符' },
    ],
    description: [{ max: 100, message: '描述长度不能超过 100 个字符' }],
  } as Record<string, FieldRule[]>;

  const state = reactive({
    currentStep: 1,
    submitLoading: false,
  });

  const divStyle = (index: number) => {
    return {
      display: index === state.currentStep ? 'block' : 'none',
      lineHeight: '600px',
    };
  };

  const onPrev = () => {
    state.currentStep = Math.max(1, state.currentStep - 1);
  };

  const onNext = () => {
    state.currentStep = Math.min(2, state.currentStep + 1);
  };

  const setCurrent = (current: number) => {
    state.currentStep = current;
  };

  const onSubmit = async () => {
    if (state.submitLoading) {
      return;
    }
    const err = await formRef.value.validate();
    if (err) {
      return;
    }
    state.submitLoading = true;
    createPriceBook(formModel.value)
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

  onMounted(() => {
    // create price book mounted
  });
</script>
