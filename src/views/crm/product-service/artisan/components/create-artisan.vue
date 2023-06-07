<template>
  <div>
    <a-form
      ref="formRef"
      auto-label-width
      :model="formModel"
      :rules="rules"
      @submit="onSubmit"
    >
      <a-form-item label="元匠名称" field="name">
        <a-input v-model="formModel.name" />
      </a-form-item>

      <a-form-item label="级别" field="level">
        <a-select
          v-model="formModel.level"
          :options="options.artisanLevels"
          :field-names="{ label: 'name', value: 'id' }"
          placeholder="请选择级别"
        />
      </a-form-item>

      <a-form-item label="性别" field="gender">
        <a-radio-group v-model="formModel.gender">
          <a-radio :value="true"> 男 </a-radio>
          <a-radio :value="false"> 女 </a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="生日" field="birthday">
        <a-date-picker v-model="formModel.birthday" />
      </a-form-item>

      <a-form-item label="电话号码" field="phoneNumber">
        <a-input v-model="formModel.phoneNumber" />
      </a-form-item>

      <a-form-item label="工牌号" field="workNo">
        <a-input v-model="formModel.workNo" />
      </a-form-item>

      <a-form-item label="邮箱地址" field="email">
        <a-input v-model="formModel.email" />
      </a-form-item>

      <a-form-item label="经验" field="experience">
        <a-textarea v-model="formModel.experience" />
      </a-form-item>

      <a-form-item label="专长" field="specialty">
        <a-textarea v-model="formModel.specialty" />
      </a-form-item>

      <a-form-item label="证书" field="certificate">
        <a-textarea v-model="formModel.certificate" />
      </a-form-item>

      <a-form-item label="工作地址" field="address">
        <a-textarea v-model="formModel.address" />
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
  import { createArtisan, Artisan } from '@/api/crm/product-service/artisan';
  import {
    FieldRule,
    Message,
    RequestOption,
    UploadRequest,
  } from '@arco-design/web-vue';
  import { uploadMediaResource } from '@/api/mediaresource';
  import useOptionsStore from '@/store/modules/data-dictionary';

  const emits = defineEmits(['submitSuccess', 'submitFailed', 'update:id']);

  const options = useOptionsStore();

  const formRef = ref();
  const formModel = ref({
    name: '',
    gender: true,
    birthday: new Date(),
    phoneNumber: '',
    coverURL: '',
    workNo: '',
    email: '',
    experience: '',
    specialty: '',
    certificate: '',
    address: '',
    coverImageId: 0,
    detailImageIds: [] as number[],
  } as Artisan);

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

  const uploadDetailImages: (option: RequestOption) => UploadRequest = (
    option: RequestOption
  ) => {
    return {
      abort() {
        return uploadMediaResource(option)
          .then((result: any) => {
            if (result.data) {
              formModel.value.detailImageIds?.push(result.data.id!);
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
    createArtisan(formModel.value)
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
