<template>
  <div class="content">
    <a-form
      ref="formRef"
      :model="formSearch"
      :style="{ width: '600px' }"
      @submit="handleSubmit"
    >
      <a-form-item field="name" tooltip="搜索订单号" label="订单号关键词">
        <a-input v-model="formSearch.name" placeholder="订单号关键词" />
      </a-form-item>
      <a-form-item
        field="name"
        tooltip="选择订单创建时间，最多一个月时间段"
        label="创建时间"
      >
        <a-range-picker
          style="width: 300px"
          :disabled-date="disabledDate"
          @select="onSelect"
          @popup-visible-change="onPopupVisibleChange"
        />
      </a-form-item>
      <a-form-item field="name" tooltip="按照订单类型" label="订单类型">
        <a-select
          v-model="formSearch.typeIds"
          :options="options.orderTypes"
          :field-names="{ label: 'name', value: 'id' }"
          placeholder="请选择订单类型"
          multiple
        />
      </a-form-item>
      <a-form-item field="name" tooltip="按照订单状态" label="订单状态">
        <a-select
          v-model="formSearch.statusIds"
          :options="options.orderStatus"
          :field-names="{ label: 'name', value: 'id' }"
          placeholder="请选择订单状态"
          multiple
        />
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
  import {
    ListOrderPageRequest,
    MaxOrderPageSize,
  } from '@/api/crm/trade/order';
  import { formatDateToYMD } from '@/utils/dayjs';

  const options = useOptionsStore();

  const emits = defineEmits(['onSubmit', 'onReset']);

  const formRef = ref();
  const formSearch = ref({
    name: '' as string,
    dates: [] as Date[],
    startAt: '' as string,
    endAt: '' as string,
    typeIds: [] as number[],
    statusIds: [] as number[],
    pageSize: MaxOrderPageSize,
  } as ListOrderPageRequest);

  const onSelect = (dateString: any, value: any) => {
    // console.log('onSelect', dateString, value);
    formSearch.value.dates = value;
    // console.log('onSelect', formSearch.value.dates);
  };

  const onPopupVisibleChange = (visible: boolean) => {
    // if (!visible) {
    //   formSearch.value.dates = [];
    // }
    // console.log(visible, formSearch.value.dates);
  };
  const disabledDate = (current: any): boolean => {
    const { dates } = formSearch.value;
    const divide = 24 * 60 * 60 * 1000;
    const rangeDays = 30;

    if (dates && dates.length) {
      const tooLate =
        dates[0] &&
        Math.abs((new Date(current).getTime() - dates[0].getTime()) / divide) >
          rangeDays;
      const tooEarly =
        dates[1] &&
        Math.abs((new Date(current).getTime() - dates[1].getTime()) / divide) >
          rangeDays;
      return tooEarly || tooLate;
    }
    return false;
  };

  const resetForm = () => {
    formRef.value.resetFields();
    emits('onReset');
  };

  const handleSubmit = async (data: any) => {
    // console.log(formSearch.value.dates);
    if (formSearch.value.dates && formSearch.value.dates?.length > 0) {
      formSearch.value.startAt = formatDateToYMD(formSearch.value.dates[0]);
      // console.log(formSearch.value.startDate);
      formSearch.value.endAt = formatDateToYMD(formSearch.value.dates[1]);
    }
    // console.log(formSearch.value);

    emits('onSubmit', formSearch.value);
  };
</script>

<style scoped></style>
