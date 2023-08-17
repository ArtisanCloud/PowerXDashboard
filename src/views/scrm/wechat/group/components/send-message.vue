<template>
  <div>
    <a-form
      ref="formRef"
      auto-label-width
      :model="formModel"
      :rules="rules"
      @submit="onSubmit"
    >
      <a-form-item label="标题" field="title">
        <a-input v-model="formModel.title" placeholder="请输入标题" />
      </a-form-item>

      <a-form-item label="描述" field="description">
        <a-input v-model="formModel.description" placeholder="请输入描述" />
      </a-form-item>

      <a-form-item label="跳转连接" field="url">
        <a-input v-model="formModel.url" placeholder="请输入跳转连接" />
      </a-form-item>

      <a-divider />
      <a-row :gutter="32">
        <a-col :span="12">
          <a-form-item label="消息图片" field="picUrl">
            <a-upload
              :limit="1"
              list-type="picture-card"
              :custom-request="uploadCoverImage"
              :file-list="state.coverUrlList"
              image-preview
              :on-before-remove="changeCoverImage"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-divider />
      <a-form-item label="发送时间">
        <a-date-picker
          v-model="formModel.sendTime"
          style="width: 220px"
          show-time
          format="YYYY-MM-DD HH:mm"
        />
      </a-form-item>
      <a-divider />
      <a-form-item>
        <a-space size="large">
          <a-button type="primary" html-type="submit">提交</a-button>
          <a-button @click="handlereset">重置</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { watch, reactive, ref, PropType } from 'vue';
  import {
    FieldRule,
    Message,
    RequestOption,
    UploadRequest,
  } from '@arco-design/web-vue';
  import uploadMediaImages from '@/utils/media-resource';
  import {
    wechatGroupArticles,
    GetWechatGroupArticlesRequest,
  } from '@/api/scrm/customer';

  const prop = defineProps({
    chatIds: {
      type: Array as PropType<any>,
      default: () => {
        return [];
      },
    },
  });

  const emits = defineEmits(['submitSuccess', 'submitFailed', 'update:id']);

  const apiUrl = import.meta.env.VITE_API_API_URL;

  const formRef = ref();
  const formModel = ref({
    chatIds: prop.chatIds,
    title: '',
    description: '',
    url: '',
    picUrl: '',
    sendTime: null,
  } as GetWechatGroupArticlesRequest);

  const rules = {
    title: [
      { required: true, message: '请输入图文标题' },
      { max: 128, message: '图文标题称长度不能超过 128 个字符' },
    ],
    description: [
      { required: true, message: '请输入图文描述' },
      { max: 512, message: '图文图文描述长度不能超过 512 个字符' },
    ],
    url: [{ required: true, message: '请输入跳转链接' }],
    picUrl: [{ required: true, message: '请选择消息图片' }],
  } as Record<string, FieldRule[]>;

  const state = reactive({
    coverUrlList: [] as Array<any>,
    detailUrlList: [] as Array<any>,
    submitLoading: false,
  });

  const uploadCoverImage: (option: RequestOption) => UploadRequest = (
    option: RequestOption
  ) => {
    return uploadMediaImages(option, 0, (data: any) => {
      formModel.value.picUrl = apiUrl + data.url;
    });
  };
  const handlereset = () => {
    formModel.value.picUrl = '';
    formModel.value.sendTime = null;
    state.coverUrlList = [];
    formRef.value.resetFields();
  };

  const changeCoverImage = async () => {
    return true;
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
    if (formModel.value.sendTime) {
      const date: any = new Date(formModel.value.sendTime);
      formModel.value.sendTime = Date.parse(date);
    }
    wechatGroupArticles(formModel.value)
      .then(() => {
        handlereset();
        Message.success('图文消息发生成功');
        emits('submitSuccess');
      })
      .catch(() => {
        emits('submitFailed');
      })
      .finally(() => {
        state.submitLoading = false;
      });
  };
  watch(
    () => prop.chatIds,
    () => {
      formModel.value.chatIds = prop.chatIds;
    }
  );
</script>
