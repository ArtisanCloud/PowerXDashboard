<template>
  <div>
    <a-form ref="formRef" :model="formModel" :rules="rules" @submit="onSubmit">
      <a-form-item label="品类名称" field="name">
        <a-input v-model="formModel.name" />
      </a-form-item>
      <a-form-item label="上级品类" field="pId">
        <a-select
          v-model="formModel.pId"
          :options="options.parentCategoryOptions"
          :field-names="{ label: 'name', value: 'id' }"
        />
      </a-form-item>
      <a-form-item label="副标题" field="viceName">
        <a-input v-model="formModel.viceName" />
      </a-form-item>
      <a-form-item label="描述" field="desc">
        <a-textarea v-model="formModel.description" />
      </a-form-item>
      <a-form-item label="排序" field="sort">
        <a-input-number v-model="formModel.sort" />
      </a-form-item>
      <a-form-item label="图标" field="icon">
        <a-input v-model="formModel.icon" />
      </a-form-item>
      <a-form-item label="背景颜色" field="backgroundColor">
        <a-input v-model="formModel.backgroundColor" />
      </a-form-item>
      <a-form-item label="头图上传" field="imageUrl">
        <a-upload
          :limit="1"
          :multiple="false"
          list-type="picture-card"
          :custom-request="uploadCoverImage"
          :file-list="state.coverUrlList"
          image-preview
        />
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
  import { computed, onMounted, PropType, reactive, ref } from 'vue';
  import {
    FieldRule,
    Message,
    RequestOption,
    UploadRequest,
  } from '@arco-design/web-vue';
  import {
    createCategory,
    CreateCategoryRequest,
    ProductCategory,
  } from '@/api/crm/product-service/category';
  import { ParentOption } from '@/api/common';
  import { uploadMediaResource } from '@/api/mediaresource';

  const prop = defineProps({
    parentNode: {
      type: Object as PropType<ProductCategory>,
      default() {
        return {};
      },
    },
    node: {
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

  const formRef = ref();
  const formModel = ref({
    name: '',
    pId: parentId.value,
    sort: 0,
    viceName: '',
    description: '',
    icon: '',
    backgroundColor: '',
    coverImageId: 0,
  } as CreateCategoryRequest);

  const rules = {
    name: [
      { required: true, message: '请输入品类名称' },
      { max: 10, message: '品类名称长度不能超过 10 个字符' },
    ],
    pId: [{ required: true, message: '请选择上级品类' }],
    description: [{ max: 100, message: '描述长度不能超过 100 个字符' }],
  } as Record<string, FieldRule[]>;

  const state = reactive({
    coverUrlList: [] as Array<any>,
    submitLoading: false,
  });

  const options = reactive({
    parentCategoryOptions: [] as Array<ParentOption>,
  });

  const fetchParentOptions = () => {
    options.parentCategoryOptions = [
      {
        id: Number(prop.parentNode.id ? prop.parentNode.id : 0),
        name: prop.parentNode.name ? prop.parentNode.name : '无',
      },
    ];

    // console.log(option.parentCategoryOptions[0].name)
  };

  const uploadCoverImage: (option: RequestOption) => UploadRequest = (
    option: RequestOption
  ) => {
    return {
      abort() {
        return uploadMediaResource(option)
          .then((result: any) => {
            if (result.data) {
              formModel.value.coverImageId = result.data.id!;
              option.onSuccess(result.data);
            } else {
              option.onError(result);
            }
          })
          .catch((error: any) => {
            option.onError(error);
          });
      },
    };
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
    if (prop.node?.coverImage) {
      state.coverUrlList = [
        {
          uid: prop.node?.coverImage?.id,
          url: prop.node?.coverImage?.url,
          name: prop.node?.coverImage?.filename,
        },
      ];
      // console.log(prop.node);
    }
    fetchParentOptions();
  });
</script>
