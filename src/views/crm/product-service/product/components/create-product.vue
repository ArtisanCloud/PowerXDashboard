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
            <a-textarea v-model="formModel.name" style="height: 80px" />
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
            <a-checkbox
              v-model="formModel.isActivated"
              default-value="false"
              disabled
            />
            <span style="margin-left: 6px; font-size: 12px; color: #6b1111"
              >(*配置该产品的价格，才能激活)</span
            >
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
        <a-col :span="12">
          <a-form-item label="产品前端展示排序" field="sort">
            <a-input-number v-model="formModel.sort" />
            <span style="margin-left: 6px; font-size: 12px; color: #6b1111"
              >(数值越大，排列越靠前)</span
            >
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
              :value="formModel.categoryIds"
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
              :limit="8"
              :multiple="true"
              :draggable="true"
              list-type="picture-card"
              :custom-request="uploadCoverImages"
              :default-file-list="state.coverUrlList"
              image-preview
              :on-before-remove="onBeforeRemoveCoverImages"
              @change="onChangeCoverImages"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="32">
        <a-col :span="12">
          <a-form-item label="上传详细图片" field="detailUrls">
            <a-upload
              :limit="15"
              :multiple="true"
              :draggable="true"
              list-type="picture-card"
              :custom-request="uploadDetailImages"
              :file-list="state.detailUrlList"
              image-preview
              :on-before-remove="onBeforeRemoveDetailImages"
              @change="onChangeDetailImages"
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
  import { reactive, ref } from 'vue';
  import { createProduct, Product } from '@/api/crm/product-service/product';
  import {
    FieldRule,
    FileItem,
    Message,
    Modal,
    RequestOption,
    UploadRequest,
  } from '@arco-design/web-vue';

  import useOptionsStore from '@/store/modules/data-dictionary';
  import CategorySelector from '@/views/crm/product-service/product-category/components/category-selector.vue';
  import uploadMediaImages from '@/utils/media-resource';
  import {
    rebuildSortIndex,
    removeSortItemById,
    SortIdItem,
  } from '@/utils/sort-id-item';
  import { MediaResource } from '@/api/media-resource';

  const emits = defineEmits(['submitSuccess', 'submitFailed', 'update:id']);

  const options = useOptionsStore();

  const formRef = ref();
  const formModel = ref({
    name: '',
    spu: '',
    accountingCategory: '',
    canSellOnline: true,
    canUseForDeduct: false,
    isActivated: false,
    description: '',
    allowedSellQuantity: -1,
    validityPeriodDays: 0,
    saleStartDate: new Date(),
    saleEndDate: new Date(),
    sort: 0,
    coverImageIds: [] as number[],
    detailImageIds: [] as number[],
    coverImageIdSortIndexes: [] as SortIdItem[],
    detailImageIdSortIndexes: [] as SortIdItem[],
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
    coverUrlList: [],
    detailUrlList: [],
    submitLoading: false,
  });

  const onBeforeRemoveCoverImages = async (fileItem: FileItem) => {
    // console.log(fileItem);
    // console.log(fileItem.uid);
    // 获取当前uid和搜索的index
    let index = -1;
    let uid: any = -1;
    if (fileItem.response) {
      uid = fileItem.response.id;
      index = formModel.value.coverImageIds?.indexOf(uid) ?? -1;
    } else {
      uid = fileItem.uid;
      index = formModel.value.coverImageIds?.indexOf(uid) ?? -1;
    }

    // 如果搜到了当前index，删除id和排序对象
    if (index !== -1) {
      // console.log(index, formModel.value.coverImageIds);
      formModel.value.coverImageIds?.splice(index ?? 0, 1);
      // console.log(uid, formModel.value.coverImageIdSortIndexes);
      formModel.value.coverImageIdSortIndexes = removeSortItemById(
        formModel.value.coverImageIdSortIndexes!,
        uid,
      );

      // 重新编排Sort
      rebuildSortIndex(formModel.value.coverImageIdSortIndexes!);
      // console.log(formModel.value.coverImageIdSortIndexes);
    }
    return true;
  };

  const onChangeCoverImages = async (
    fileList: FileItem[],
    fileItem: FileItem,
  ) => {
    // console.log(
    //   'onChangeDetailImages',
    //   fileItems,
    //   formModel.value.detailImageIdSortIndexes
    // );
  };

  const onChangeDetailImages = async (
    fileList: FileItem[],
    fileItem: FileItem,
  ) => {
    // console.log(
    //   'onChangeDetailImages',
    //   fileItems,
    //   formModel.value.detailImageIdSortIndexes
    // );
  };

  const onBeforeRemoveDetailImages = async (fileItem: FileItem) => {
    // console.log(fileItem);
    // console.log(fileItem.uid);
    // 获取当前uid和搜索的index
    let index = -1;
    let uid: any = -1;
    if (fileItem.response) {
      uid = fileItem.response.id;
      index = formModel.value.detailImageIds?.indexOf(uid) ?? -1;
    } else {
      uid = fileItem.uid;
      index = formModel.value.detailImageIds?.indexOf(uid) ?? -1;
    }

    // 如果搜到了当前index，删除id和排序对象
    if (index !== -1) {
      // console.log(index, formModel.value.detailImageIds);
      formModel.value.detailImageIds?.splice(index ?? 0, 1);
      // console.log(uid, formModel.value.detailImageIdSortIndexes);
      formModel.value.detailImageIdSortIndexes = removeSortItemById(
        formModel.value.detailImageIdSortIndexes!,
        uid,
      );

      // 重新编排Sort
      rebuildSortIndex(formModel.value.detailImageIdSortIndexes!);
      // console.log(formModel.value.detailImageIdSortIndexes);
    }

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
    createProduct(formModel.value)
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

  const uploadCoverImages: (option: RequestOption) => UploadRequest = (
    option: RequestOption,
  ) => {
    const { uid } = option.fileItem;
    // console.log(uid);
    let sortIndex = parseInt(uid.split('-')[1], 10);

    // 重新建立索引
    const imageCount = formModel.value.coverImageIdSortIndexes?.length ?? 0;
    if (imageCount > 0) {
      sortIndex += imageCount;
    }
    // console.log(sortIndex);

    return uploadMediaImages(option, sortIndex, (data: MediaResource) => {
      formModel.value.coverImageIdSortIndexes?.push({
        id: data.id,
        sortIndex: data.sortIndex,
      } as SortIdItem);
      formModel.value.coverImageIds?.push(data.id!);
      // console.log(
      //   data.id!,
      //   formModel.value.coverImageIdSortIndexes,
      //   formModel.value.coverImageIds
      // );
    });
  };

  const uploadDetailImages: (option: RequestOption) => UploadRequest = (
    option: RequestOption,
  ) => {
    const { uid } = option.fileItem;
    // console.log(uid);
    let sortIndex = parseInt(uid.split('-')[1], 10);

    // 重新建立索引
    const imageCount = formModel.value.detailImageIdSortIndexes?.length ?? 0;
    if (imageCount > 0) {
      sortIndex += imageCount;
    }
    // console.log(sortIndex);

    return uploadMediaImages(option, sortIndex, (data: MediaResource) => {
      formModel.value.detailImageIdSortIndexes?.push({
        id: data.id,
        sortIndex: data.sortIndex,
      } as SortIdItem);
      formModel.value.detailImageIds?.push(data.id!);
      // console.log(
      //   data.id!,
      //   formModel.value.detailImageIdSortIndexes,
      //   formModel.value.detailImageIds
      // );
    });
  };

  const updateCategoryIds = (categoryIds: number[]) => {
    // console.log('update:categoryIds', categoryIds);
    formModel.value.categoryIds = categoryIds;
  };

  // onMounted(() => {});
</script>
