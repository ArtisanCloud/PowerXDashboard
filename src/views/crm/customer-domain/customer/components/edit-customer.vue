<template>
  <div>
    <a-form
      ref="formRef"
      auto-label-width
      :model="formModel"
      :rules="rules"
      @submit="onSubmit"
    >
      <a-form-item label="客户名称" field="name">
        <a-input v-model="formModel.name" />
      </a-form-item>
      <a-form-item label="手机号码" field="mobile">
        <a-input v-model="formModel.mobile" />
      </a-form-item>
      <a-form-item label="邮箱地址" field="email">
        <a-input v-model="formModel.email" />
      </a-form-item>
      <a-form-item label="唯一识别号" field="uuid">
        <a-typography-text>{{
          prop.node.uuid !== ''
            ? prop.node.uuid
            : '提交保存后会自动生成唯一识别号'
        }}</a-typography-text>
      </a-form-item>
      <a-form-item label="客源" field="source">
        <a-select
          v-model="formModel.source"
          :options="options.sourceTypes"
          :field-names="{ label: 'name', value: 'id' }"
          placeholder="请选择客户来源"
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

      <a-divider dashed />
      <a-space direction="vertical" fill>
        <a-space size="medium">
          <a-typography-text>小程序OpenId:</a-typography-text>
          <a-typography-text
            >{{ prop.node.openIdInMiniProgram }}
          </a-typography-text>
        </a-space>
        <a-space size="medium">
          <a-typography-text>公众号OpenId:</a-typography-text>
          <a-typography-text
            >{{ prop.node.openIdInWeChatOfficialAccount }}
          </a-typography-text>
        </a-space>
        <a-space size="medium">
          <a-typography-text>企微联系人OpenId:</a-typography-text>
          <a-typography-text>{{ prop.node.openIdInWeCom }}</a-typography-text>
        </a-space>
      </a-space>
      <a-divider dashed />

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
  import { updateCustomer, Customer } from '@/api/crm/customer-domain/customer';
  import { FieldRule, Message } from '@arco-design/web-vue';

  import useOptionsStore from '@/store/modules/data-dictionary';

  const prop = defineProps({
    node: {
      type: Object as PropType<Customer>,
      default() {
        return {};
      },
    },
  });

  const emits = defineEmits(['submitSuccess', 'submitFailed', 'update:id']);

  const options = useOptionsStore();

  const formRef = ref();
  const formModel = ref({
    id: prop.node.id,
    name: prop.node.name,
    mobile: prop.node.mobile,
    email: prop.node.email,
    // uuid: prop.node.uuid,
    // inviter: prop.node.inviter,
    // inviterId: prop.node.inviterId,
    source: prop.node.source,
    type: prop.node.type,
    isActivated: prop.node.isActivated,
  } as Customer);

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
    updateCustomer(formModel.value)
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
