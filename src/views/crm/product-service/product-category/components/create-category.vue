<template>
  <div>
    <a-form ref="formRef" :model="formModel" :rules="rules" @submit="onSubmit">
      <a-form-item label="品类名称" field="name">
        <a-input v-model="formModel.name"/>
      </a-form-item>
      <a-form-item label="上级品类" field="pId">
        <a-select
            v-model="formModel.pId"
            :options="option.parentCategoryOptions"
            :field-names="{ label: 'name', value: 'id' }"
        />
      </a-form-item>
      <a-form-item label="副标题" field="viceName">
        <a-input v-model="formModel.viceName"/>
      </a-form-item>
      <a-form-item label="描述" field="desc">
        <a-textarea v-model="formModel.description"/>
      </a-form-item>
      <a-form-item label="排序" field="sort">
        <a-input-number v-model="formModel.sort" default-value="0"/>
      </a-form-item>
      <a-form-item label="图标" field="icon">
        <a-input v-model="formModel.icon"/>
      </a-form-item>
      <a-form-item label="背景颜色" field="backgroundColor">
        <a-input v-model="formModel.backgroundColor"/>
      </a-form-item>
      <a-form-item label="头图上传" field="imageUrl">
        <a-upload
            list-type="picture-card"
            action="/"
            :default-file-list="fileList"
            image-preview
        />
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
import {computed, onMounted, PropType, reactive, ref} from 'vue';
import {FieldRule, Message} from '@arco-design/web-vue';
import {createCategory, CreateCategoryRequest, ProductCategory} from '@/api/crm/product-service/category';
import {ParentOption} from "@/api/common";


const prop = defineProps({
  parentNode: {
    type: Object as PropType<ProductCategory>,
    default() {
      return {};
    },
  },
});

const emits = defineEmits(['submitSuccess', 'submitFailed', 'update:id']);


const parentId = computed({
  get() {
    return prop.parentNode?.id;
  },
  set(val) {
    emits('update:id', val);
  },
});

const fileList = []

const formRef = ref();
const formModel = ref({

  name: '',
  pId: parentId.value,
  sort: 0,
  viceName: '',
  description: '',
  icon: '',
  backgroundColor: '',
  imageURL: '',

} as CreateCategoryRequest);

const rules = {
  name: [
    {required: true, message: '请输入品类名称'},
    {max: 10, message: '品类名称长度不能超过 10 个字符'},
  ],
  pId: [{required: true, message: '请选择上级品类'}],
  description: [{max: 100, message: '描述长度不能超过 100 个字符'}],


} as Record<string, FieldRule[]>;

const state = reactive({submitLoading: false});

const option = reactive({
  parentCategoryOptions: [] as Array<ParentOption>,
});

function fetchParentOptions() {

  option.parentCategoryOptions = [{
    id: Number(prop.parentNode.id ? prop.parentNode.id : 0),
    name: (prop.parentNode.name ? prop.parentNode.name : "无")
  }];

  // console.log(option.parentCategoryOptions[0].name)


}

const onSubmit = async () => {
  if (state.submitLoading) {
    return;
  }
  const err = await formRef.value.validate();
  if (err) {
    return;
  }
  state.submitLoading = true;
  createCategory(formModel.value)
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
  fetchParentOptions();
});
</script>
