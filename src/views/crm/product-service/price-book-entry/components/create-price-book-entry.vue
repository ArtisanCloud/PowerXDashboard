<template>
  <div style="display: grid; place-items: center">
    <a-steps
      style="width: 600px; padding-top: 40px"
      changeable
      :current="state.currentStep"
      @change="setCurrent"
    >
      <!--选择产品-->
      <a-step description="选择你要添加配置的产品，可以搜素">选配产品</a-step>

      <!-- 配置价格 -->
      <a-step description="为选中的产品，进行价格配置">配置价格</a-step>
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
      <div :style="divStyle(1)">
        <product-search-select></product-search-select>
      </div>
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
  import { Message } from '@arco-design/web-vue';
  import {
    createPriceBookEntry,
    PriceBookEntry,
  } from '@/api/crm/product-service/priceBookEntry';
  import ProductSearchSelect from '@/views/crm/product-service/product/components/product-search-select.vue';

  const emits = defineEmits(['submitSuccess', 'submitFailed', 'update:id']);

  const state = reactive({
    currentStep: 1,
    listedPriceBooks: [] as PriceBookEntry[],
    selectedPriceBooks: [] as PriceBookEntry[],
    submitLoading: false,
  });

  const divStyle = (index: number) => {
    return {
      display: index === state.currentStep ? 'block' : 'none',
      paddingTop: '20px',
      // border: '1px dashed red',
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

    state.submitLoading = true;
    createPriceBookEntry(state.selectedPriceBooks)
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
