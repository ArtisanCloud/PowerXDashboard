<template>
  <div class="content">
    <a-space>
      <a-input v-model="searchModel.name" placeholder="产品关键词" />

      <a-range-picker
        style="width: 300px"
        :disabled-date="disabledDate"
        @select="onSelect"
        @popup-visible-change="onPopupVisibleChange"
      />
      <a-select
        v-model="searchModel.orderTypes"
        :options="options.orderTypes"
        :field-names="{ label: 'name', value: 'id' }"
        placeholder="请选择订单类型"
        multiple
      />
      <a-select
        v-model="searchModel.orderStatus"
        :options="options.orderStatus"
        :field-names="{ label: 'name', value: 'id' }"
        placeholder="请选择订单状态"
        multiple
      />
    </a-space>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import useOptionsStore from '../../../../../store/modules/data-dictionary';

  const options = useOptionsStore();

  const searchModel = ref({
    dates: [] as Date[],
    name: '' as string,
    orderTypes: [] as number[],
    orderStatus: [] as number[],
  });

  const onSelect = (dateString: any, value: any) => {
    // console.log('onSelect', dateString, date);
    searchModel.value.dates = value;
  };
  const onPopupVisibleChange = (visible: boolean) => {
    if (!visible) {
      searchModel.value.dates = [];
    }
  };
  const disabledDate = (current: any): boolean => {
    const { dates } = searchModel.value;
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
</script>

<style scoped></style>
