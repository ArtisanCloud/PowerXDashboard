<template>
  <div>
    <a-form
      ref="formRef"
      auto-label-width
      :model="formModel"
      :rules="rules"
      @submit="onSubmit"
    >
      <a-form-item label="线索名称" field="name">
        <a-input v-model="formModel.name" />
      </a-form-item>
      <a-form-item label="手机号码" field="mobile">
        <a-input v-model="formModel.mobile" />
      </a-form-item>
      <a-form-item label="邮箱地址" field="email">
        <a-input v-model="formModel.email" />
      </a-form-item>
      <a-form-item label="客源" field="source">
        <a-select
          v-model="formModel.source"
          :options="options.sourceTypes"
          :field-names="{ label: 'name', value: 'id' }"
          placeholder="请选择线索来源"
        />
      </a-form-item>
      <a-form-item label="类型" field="type">
        <a-select
          v-model="formModel.type"
          :options="options.customerTypes"
          :field-names="{ label: 'name', value: 'id' }"
          placeholder="请选择类型"
        />
      </a-form-item>
      <a-form-item label="是否激活" field="isActivated">
        <a-checkbox v-model="formModel.isActivated" />
      </a-form-item>

      <a-form-item>
        <a-space size="large">
          <a-button type="primary" html-type="submit">提交</a-button>
          <a-button @click="$refs.formRef.resetFields()">重置</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, PropType, reactive, ref } from 'vue';
  import { updateLead, Lead } from '@/api/crm/customer-domain/lead';
  import { FieldRule, Message } from '@arco-design/web-vue';

  import useOptionsStore from '@/store/modules/data-dictionary';
  import { Product } from '@/api/crm/product-service/product';

  const prop = defineProps({
    node: {
      type: Object as PropType<Lead>,
      default() {
        return {};
      },
    },
  });

  const emits = defineEmits(['submitSuccess', 'submitFailed', 'update:id']);

  const options = useOptionsStore();

  const fileList = [];

  const formRef = ref();
  const formModel = ref({
    id: prop.node.id,
    name: prop.node.name,
    mobile: prop.node.mobile,
    email: prop.node.email,
    inviter: prop.node.inviter,
    inviterId: prop.node.inviterId,
    source: prop.node.source,
    type: prop.node.type,
    isActivated: prop.node.isActivated,
  } as Lead);

  const rules = {
    name: [
      { required: true, message: '请输入商品手册名称' },
      { max: 10, message: '商品名称长度不能超过 10 个字符' },
    ],
    mobile: [
      { required: true, message: '请输入手机号码' },
      { max: 10, message: '手机号码长度不能超过 10 个字符' },
    ],
    type: [{ required: true, message: '请输入客户类型名称' }],
    source: [{ required: true, message: '请输入客户来源' }],
    isActivated: [{ required: true, message: '请输入客户状态' }],
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
    updateLead(formModel.value)
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
