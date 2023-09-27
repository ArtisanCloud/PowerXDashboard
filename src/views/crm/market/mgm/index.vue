<template>
  <div class="container">
    <a-form
      ref="formRef"
      auto-label-width
      :model="formModel"
      @submit="onSubmit"
    >
      <a-form-item label="首级介绍人分佣比例" field="title">
        <a-input-number v-model="formModel.commissionRate1" />
      </a-form-item>
      <a-form-item label="一级介绍人分佣比例" field="title">
        <a-input-number v-model="formModel.commissionRate2" />
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';
  import { Media } from '@/api/crm/market/media';
  import { configMGM, fetchMGMConfig, MGMConfig } from '@/api/crm/market/mgm';
  import { Message } from '@arco-design/web-vue';

  const formRef = ref();
  const formModel = ref({
    id: 0,
    commissionRate1: 0,
    commissionRate2: 0,
  } as MGMConfig);

  const state = reactive({
    config: {} as MGMConfig,
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
    configMGM(formModel.value)
      .then(() => {
        Message.success('创建成功');
      })
      .catch(() => {})
      .finally(() => {
        state.submitLoading = false;
      });
  };

  onMounted(() => {
    fetchMGMConfig();
  });
</script>

<style scoped>
  .content {
    width: 600px;
    margin: 20px 60px;
  }
</style>
