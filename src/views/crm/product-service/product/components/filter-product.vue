<template>
  <div class="content">
    <a-form
      ref="formRef"
      :model="formSearch"
      :style="{ width: '600px' }"
      @submit="handleSubmit"
    >
      <a-form-item field="name" tooltip="搜索产品" label="产品关键词">
        <a-input v-model="formSearch.likeName" placeholder="产品关键词" />
      </a-form-item>
      <a-form-item
        field="name"
        tooltip="选择产品销售时间，最多一个月时间段"
        label="销售时间"
      >
        <a-range-picker
          style="width: 300px"
          :disabled-date="disabledDate"
          @select="onSelect"
          @popup-visible-change="onPopupVisibleChange"
        />
      </a-form-item>
      <a-form-item field="name" tooltip="按照产品类型" label="产品类型">
        <a-select
          v-model="formSearch.typeIds"
          :options="options.productTypes"
          :field-names="{ label: 'name', value: 'id' }"
          placeholder="请选择产品类型"
          multiple
        />
      </a-form-item>
      <a-form-item
        label="设置品类"
        field="categoryIds"
        :value="formSearch.productCategoryIds"
      >
        <category-selector
          ref="RefCategorySelector"
          v-model="formSearch.productCategoryIds"
          :value="formSearch.productCategoryIds"
          @update:category-ids="updateCategoryIds"
        ></category-selector>
      </a-form-item>
      <a-form-item field="name" tooltip="按照产品状态" label="状态是否开启">
        <a-checkbox v-model="formSearch.needActivated" />
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button @click="resetForm">重置</a-button>
          <a-button type="primary" html-type="submit">查询</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import useOptionsStore from '@/store/modules/data-dictionary';
  import { formatDateToYMD } from '@/utils/dayjs';
  import { ListProductPageRequest } from '@/api/crm/product-service/product';
  import { MaxPageSize } from '@/api';
  import CategorySelector from '@/views/crm/product-service/product-category/components/category-selector.vue';

  const options = useOptionsStore();

  const emits = defineEmits(['onSubmit', 'onReset']);
  const formRef = ref();
  const formSearch = ref({
    likeName: '' as string,
    saleDatesIn: [] as Date[],
    salesStartAt: '' as string,
    salesEndAt: '' as string,
    typeIds: [] as number[],
    needActivated: false as boolean,
    pageSize: MaxPageSize,
  } as ListProductPageRequest);

  const onSelect = (dateString: any, value: any) => {
    // console.log('onSelect', dateString, value);
    formSearch.value.saleDatesIn = value;
    // console.log('onSelect', formSearch.value.dates);
  };

  const onPopupVisibleChange = (visible: boolean) => {
    // if (!visible) {
    //   formSearch.value.dates = [];
    // }
    // console.log(visible, formSearch.value.dates);
  };
  const disabledDate = (current: any): boolean => {
    const { saleDatesIn } = formSearch.value;
    const divide = 24 * 60 * 60 * 1000;
    const rangeDays = 30;

    if (saleDatesIn && saleDatesIn.length) {
      const tooLate =
        saleDatesIn[0] &&
        Math.abs(
          (new Date(current).getTime() - saleDatesIn[0].getTime()) / divide,
        ) > rangeDays;
      const tooEarly =
        saleDatesIn[1] &&
        Math.abs(
          (new Date(current).getTime() - saleDatesIn[1].getTime()) / divide,
        ) > rangeDays;
      return tooEarly || tooLate;
    }
    return false;
  };

  const updateCategoryIds = (categoryIds: number[]) => {
    // console.log('update:categoryIds', categoryIds);
    formSearch.value.productCategoryIds = categoryIds;
  };

  const resetForm = () => {
    formRef.value.resetFields();
    emits('onReset');
  };

  const handleSubmit = async (data: any) => {
    // console.log(formSearch.value.dates);
    if (
      formSearch.value.saleDatesIn &&
      formSearch.value.saleDatesIn?.length > 0
    ) {
      formSearch.value.salesStartAt = formatDateToYMD(
        formSearch.value.saleDatesIn[0],
      );
      // console.log(formSearch.value.startDate);
      formSearch.value.salesEndAt = formatDateToYMD(
        formSearch.value.saleDatesIn[1],
      );
    }
    // console.log(formSearch.value);

    emits('onSubmit', formSearch.value);
  };
</script>

<style scoped></style>
