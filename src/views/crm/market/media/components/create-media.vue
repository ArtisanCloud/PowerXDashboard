<template>
  <div>
    <a-form
      ref="formRef"
      auto-label-width
      :model="formModel"
      :rules="rules"
      @submit="onSubmit"
    >
      <a-form-item label="媒体标题" field="title">
        <a-input v-model="formModel.title" />
      </a-form-item>

      <a-form-item label="媒体副标题" field="subTitle">
        <a-input v-model="formModel.subTitle" />
      </a-form-item>
      <a-form-item label="类型" field="mediaType">
        <a-select
          v-model="formModel.mediaType"
          :options="options.mediaTypes"
          :field-names="{ label: 'name', value: 'id' }"
          placeholder="请选择类型"
        />
      </a-form-item>

      <a-form-item label="外部连接URL" field="resourceUrl">
        <a-input v-model="formModel.resourceUrl" />
      </a-form-item>

      <a-form-item label="内容" field="description">
        <a-textarea v-model="formModel.description" />
      </a-form-item>

      <a-form-item label="阅览次数" field="viewedCount">
        <a-input-number v-model="formModel.viewedCount" />
      </a-form-item>

      <a-divider />
      <a-row :gutter="32">
        <a-col :span="12">
          <a-form-item label="上传头图" field="coverUrl">
            <a-upload
              :limit="1"
              list-type="picture-card"
              :custom-request="uploadCoverImage"
              :default-file-list="state.coverUrlList"
              image-preview
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="32">
        <a-col :span="12">
          <a-form-item label="上传详细图片" field="detailUrls">
            <a-upload
              :limit="10"
              :multiple="true"
              :draggable="true"
              list-type="picture-card"
              :custom-request="uploadDetailImages"
              :file-list="state.detailUrlList"
              image-preview
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-divider />

      <a-space size="large">
        <a-button type="primary" html-type="submit">提交</a-button>
        <a-button @click="formRef.resetFields()">重置</a-button>
      </a-space>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';
  import {
    FieldRule,
    Message,
    RequestOption,
    UploadRequest,
  } from '@arco-design/web-vue';
  import useOptionsStore from '@/store/modules/data-dictionary';
  import { createMedia, Media } from '@/api/crm/market/media';
  import uploadMediaImages from '@/utils/media-resource';

  const emits = defineEmits(['submitSuccess', 'submitFailed', 'update:id']);

  const options = useOptionsStore();

  const formRef = ref();
  const formModel = ref({
    title: '',
    subTitle: '',
    resourceUrl: '',
    description: '',
    viewedCount: 0,
    coverImageId: 0,
    detailImageIds: [] as number[],
  } as Media);

  const rules = {
    name: [
      { required: true, message: '请输入商品手册名称' },
      { max: 10, message: '商品名称长度不能超过 10 个字符' },
    ],
    accountingCategory: [
      { required: true, message: '请输入财务类别名称' },
      { max: 10, message: '财务类别长度不能超过 10 个字符' },
    ],
    type: [{ required: true, message: '请输入商品类型名称' }],
    plan: [{ required: true, message: '请输入商品计划名称' }],
    approvalStatus: [{ required: true, message: '请输入审核状态名称' }],
    description: [{ max: 100, message: '描述长度不能超过 100 个字符' }],
  } as Record<string, FieldRule[]>;

  const state = reactive({
    coverUrlList: [] as Array<any>,
    detailUrlList: [] as Array<any>,
    submitLoading: false,
  });

  const uploadCoverImage: (option: RequestOption) => UploadRequest = (
    option: RequestOption
  ) => {
    return uploadMediaImages(option, (data: any) => {
      formModel.value.coverImageId = data.id!;
    });
  };

  const uploadDetailImages: (option: RequestOption) => UploadRequest = (
    option: RequestOption
  ) => {
    return uploadMediaImages(option, (data: any) => {
      formModel.value.detailImageIds?.push(data.id!);
    });
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
    createMedia(formModel.value)
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

  onMounted(() => {});
</script>
