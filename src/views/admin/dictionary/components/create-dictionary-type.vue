<template>
  <div>
    <a-form ref="formRef" auto-label-width :model="formModel" :rules="rules" @submit="onSubmit">
      <a-form-item  label="字典类型" field="type">
        <a-input v-model="formModel.type"/>
      </a-form-item>
      <a-form-item label="显示名称" field="name">
        <a-input v-model="formModel.name"/>
      </a-form-item>
      <a-form-item label="描述" field="description">
        <a-textarea v-model="formModel.description"/>
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


import {onMounted, reactive, ref} from "vue";
import {CreatePriceBookRequest,createPriceBook} from "@/api/crm/product-service/priceBook";
import {FieldRule, Message} from "@arco-design/web-vue";

const emits = defineEmits(['submitSuccess', 'submitFailed', 'update:id']);

const formRef = ref();
const formModel = ref({
  isStandard: false,
  name: '',
  description: '',
  storeId: 0

} as CreatePriceBookRequest);

const rules = {
  type: [
    {required: true, message: '请输入数据字典的type值'},
    {max: 20, message: '数据字典的type长度不能超过 20 个字符'},
  ],
  name: [
    {required: true, message: '请输入数据字典类型名称'},
    {max: 10, message: '数据字典类型名称长度不能超过 10 个字符'},
  ],
  description: [{max: 100, message: '描述长度不能超过 100 个字符'}],


} as Record<string, FieldRule[]>;

const state = reactive({submitLoading: false});


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

});

</script>