<template>
  <div>
    <a-form
      ref="formRef"
      auto-label-width
      :model="formModel"
      :rules="rules"
      @submit="onSubmit"
    >
      <a-row :gutter="32">
        <a-col :span="12">
          <a-form-item label="产品名称" field="name">
            <a-input v-model="formModel.name" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="财务类别" field="accountingCategory">
            <a-input v-model="formModel.accountingCategory" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="32">
        <a-col :span="12">
          <a-form-item label="类型" field="type">
            <a-select
              v-model="formModel.type"
              :options="options.productTypes"
              :field-names="{ label: 'name', value: 'id' }"
              placeholder="请选择产品类型"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="审核状态" field="approvalStatus">
            <a-select
              v-model="formModel.approvalStatus"
              :options="options.approvalStatus"
              :field-names="{ label: 'name', value: 'id' }"
              placeholder="请选择审核状态"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="32">
        <a-col :span="12">
          <a-form-item label="计划" field="plan">
            <a-select
              v-model="formModel.plan"
              :options="options.productPlans"
              :field-names="{ label: 'name', value: 'id' }"
              placeholder="请选择产品计划"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="SPU - 标准产品单位" field="spu">
            <a-input v-model="formModel.spu" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="32">
        <a-col :span="12">
          <a-form-item label="描述" field="description">
            <a-textarea v-model="formModel.description" style="height: 80px" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="是否激活" field="isActivated">
            <a-checkbox v-model="formModel.isActivated" default-value="false" />
          </a-form-item>
          <a-form-item label="是否线上销售" field="canSellOnline">
            <a-checkbox v-model="formModel.canSellOnline" />
          </a-form-item>
          <a-form-item label="是否可以抵扣购买" field="canUseForDeduct">
            <a-checkbox v-model="formModel.canUseForDeduct" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="32">
        <a-col :span="12">
          <a-form-item label="可销售渠道" field="salesChannelsItemIds">
            <a-select
              v-model="formModel.salesChannelsItemIds"
              multiple
              :options="options.salesChannels"
              :field-names="{ label: 'name', value: 'id' }"
              placeholder="请选择可销售渠道"
            />
          </a-form-item>
          <a-form-item label="可推广渠道" field="promoteChannelsItemIds">
            <a-select
              v-model="formModel.promoteChannelsItemIds"
              multiple
              :options="options.promoteChannels"
              :field-names="{ label: 'name', value: 'id' }"
              placeholder="请选择可推广渠道"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="销售开始时间" field="saleStartDate">
            <a-date-picker v-model="formModel.saleStartDate" />
          </a-form-item>
          <a-form-item label="销售结束时间" field="saleEndDate">
            <a-date-picker v-model="formModel.saleEndDate" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="32">
        <a-col :span="12">
          <a-form-item label="允许购买数量上限" field="allowedSellQuantity">
            <a-input-number v-model="formModel.allowedSellQuantity" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-divider />
      <a-row :gutter="32">
        <a-col :span="12">
          <a-form-item
            label="设置品类"
            field="categoryIds"
            :value="formModel.categoryIds"
          >
            <category-selector
              ref="RefCategorySelector"
              v-model="formModel.categoryIds"
              :default-value="
                convertCategoryIdsToStringArray(formModel.categoryIds)
              "
              @update:category-ids="updateCategoryIds"
            ></category-selector>
          </a-form-item>
        </a-col>
      </a-row>
      <a-divider />
      <a-row :gutter="32">
        <a-col :span="12">
          <a-form-item label="上传头图" field="coverUrl">
            <a-upload
              :limit="3"
              :multiple="true"
              :draggable="true"
              list-type="picture-card"
              :custom-request="uploadCoverImages"
              :file-list="state.coverUrlList"
              image-preview
              :on-before-remove="changeCoverImage"
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
              :on-before-remove="changeDetailImages"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-divider />
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
  import { updateProduct } from '@/api/crm/product-service/product';
  import {
    FieldRule,
    Message,
    RequestOption,
    UploadRequest,
  } from '@arco-design/web-vue';
  import type { Product } from '@/api/crm/product-service/product';

  import useOptionsStore from '@/store/modules/data-dictionary';
  import CategorySelector from '@/views/crm/product-service/product-category/components/category-selector.vue';

  import { convertIntArrayToStringArray } from '@/utils/array';
  import uploadMediaImages from '@/utils/media-resource';

  const prop = defineProps({
    node: {
      type: Object as PropType<Product>,
      default() {
        return {};
      },
    },
  });

  const emits = defineEmits(['submitSuccess', 'submitFailed', 'update:id']);

  const options = useOptionsStore();

  const formRef = ref();
  const formModel = ref({
    id: prop.node?.id,
    name: prop.node.name,
    spu: prop.node.spu,
    accountingCategory: prop.node.accountingCategory,
    type: prop.node.type,
    plan: prop.node.plan,
    salesChannelsItemIds: prop.node.salesChannelsItemIds,
    promoteChannelsItemIds: prop.node.promoteChannelsItemIds,
    approvalStatus: prop.node.approvalStatus,
    canSellOnline: prop.node.canSellOnline,
    canUseForDeduct: prop.node.canUseForDeduct,
    isActivated: prop.node.isActivated,
    description: prop.node.description,
    allowedSellQuantity: prop.node.allowedSellQuantity,
    validityPeriodDays: prop.node.validityPeriodDays,
    saleStartDate: prop.node.saleStartDate,
    saleEndDate: prop.node.saleEndDate,
    categoryIds: prop.node?.categoryIds,
    coverImageIds: prop.node?.coverImageIds ? prop.node?.coverImageIds : [],
    detailImageIds: prop.node?.detailImageIds ? prop.node?.detailImageIds : [],
  } as Product);

  const rules = {
    name: [
      { required: true, message: '请输入商品手册名称' },
      { max: 10, message: '商品名称长度不能超过 10 个字符' },
    ],
    spu: [
      { required: true, message: '请输入SPU' },
      { max: 20, message: 'SPU长度不能超过 20 个字符' },
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

  const onSubmit = async () => {
    if (state.submitLoading) {
      return;
    }
    const err = await formRef.value.validate();
    if (err) {
      return;
    }

    state.submitLoading = true;
    updateProduct(formModel.value)
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

  const updateCategoryIds = (categoryIds: number[]) => {
    // console.log('update:categoryIds', categoryIds);
    formModel.value.categoryIds = categoryIds;
  };

  const uploadCoverImages: (option: RequestOption) => UploadRequest = (
    option: RequestOption
  ) => {
    return uploadMediaImages(option, (data: any) => {
      formModel.value.coverImageIds?.push(data.id!);
    });
  };

  const uploadDetailImages: (option: RequestOption) => UploadRequest = (
    option: RequestOption
  ) => {
    return uploadMediaImages(option, (data: any) => {
      formModel.value.detailImageIds?.push(data.id!);
    });
  };

  const convertCategoryIdsToStringArray = (num: number[]) => {
    return convertIntArrayToStringArray(num);
  };

  const changeCoverImage = async (option: any) => {
    // console.log(option);
    const index = formModel.value.coverImageIds?.indexOf(option.uid);
    console.log(index);
    if (index !== -1) {
      formModel.value.coverImageIds?.splice(index!, 1);
      return true;
    }
    return false;
  };

  const changeDetailImages = async (option: any) => {
    // console.log(option);
    const index = formModel.value.detailImageIds?.indexOf(option.uid);
    if (index !== -1) {
      formModel.value.detailImageIds?.splice(index!, 1);
      return true;
    }

    return false;
  };

  onMounted(() => {
    state.coverUrlList =
      prop.node?.coverImages?.map((coverImage) => ({
        uid: coverImage?.id,
        url: coverImage?.url,
        name: coverImage?.filename,
      })) ?? [];

    state.detailUrlList =
      prop.node?.detailImages?.map((detailImage) => ({
        uid: detailImage?.id,
        url: detailImage?.url,
        name: detailImage?.filename,
      })) ?? [];
    // console.log(state.detailUrlList);

    // console.log(formModel.value.detailImageIds, formModel.value.coverImageId);
  });
</script>
