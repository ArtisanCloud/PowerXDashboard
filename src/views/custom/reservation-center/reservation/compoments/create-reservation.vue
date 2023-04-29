<template>
  <div>
    <a-form ref="formRef" auto-label-width :model="formModel" :rules="rules" @submit="onSubmit">

      <a-form-item label="预约日程段" field="scheduleId">
        <a-typography-text>{{ formattedSchedule }}</a-typography-text>
      </a-form-item>
<!--      <a-form-item label="客户" field="customerId">-->
<!--        <a-select :style="{width:'320px'}" :loading="loading" placeholder="Please select ..." multiple-->
<!--                  @search="handleSearch" :filter-option="false">-->
<!--          &lt;!&ndash;          <a-option v-for="item of options" :value="item">{{ item }}</a-option>&ndash;&gt;-->
<!--        </a-select>-->
<!--      </a-form-item>-->
      <a-form-item label="发型师" field="reservedArtisanId">
        <a-select
            :options="props.currentStore.artisans"
            :field-names="{ label: 'name', value: 'id' }"
            placeholder="请选择发型师"/>
      </a-form-item>
      <a-form-item label="服务项目" field="serviceId">
        <a-select
            v-model="formModel.serviceId"
            :options="serviceList"
            placeholder="请选择服务项目"/>
      </a-form-item>
      <a-form-item label="预约类型" field="type">
        <a-select
            v-model="formModel.type"
            :options="options.reservationTypes"
            :field-names="{ label: 'name', value: 'id' }"
            placeholder="请选择约单类型"/>
      </a-form-item>
      <a-form-item label="相关描述" field="description">
        <a-textarea v-model="formModel.description"/>
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


import {computed, onMounted, PropType, reactive, ref} from "vue";
import {createReservation, Reservation,} from "@/api/custom/reservation-center/reservation";
import {FieldRule, Message} from "@arco-design/web-vue";

import useOptionsStore from "@/store/modules/data-dictionary";
import {Schedule} from "@/api/custom/reservation-center/schedule";
import {ListStoreRequest, listStores, Store} from "@/api/crm/product-service/store";
import {ChannelDirect} from "@/api/dictionary";
import {ServiceSpecific} from "@/api/custom/product-service/serviceSpecific";

const props = defineProps({
  currentStore: Object as PropType<Store>,
  currentSchedule: Object as PropType<Schedule>,
});

const formattedSchedule = computed(() => {

  if (!props.currentSchedule) {
    return "---"
  }

  const startDate = new Date(props.currentSchedule.startTime);
  const endDate = new Date(props.currentSchedule.endTime);

  const formattedStartDate = `${startDate.getMonth() + 1}月${startDate.getDate()}号-${startDate.getHours()}点`;
  const formattedEndDate = `${endDate.getHours()}点`;

  return `${formattedStartDate}-${formattedEndDate}`;
});

const serviceList = ref<ServiceSpecific[]>([]);

const emits = defineEmits(['submitSuccess', 'submitFailed', 'update:id']);

const options = useOptionsStore()

const fileList = []

const formRef = ref();
const formModel = ref({
  scheduleId: props.currentSchedule?.id,
  // reservedArtisanId: 0,
  // serviceId: 0,
  sourceChannelId: options.GetOptionByKey(options.sourceTypes, ChannelDirect)?.id,
  type: 0,
  description: '',

} as Reservation);

const rules = {

  // customerId: [
  //   {required: true, message: '请选择选中客户'},
  // ],
  reservedArtisanId: [
    {required: true, message: '请选择发型师'},
  ],
  // serviceId: [
  //   {required: true, message: '请选择服务项目'},
  // ],
  type: [
    {required: true, message: '请选择约单类型'},
  ],


} as Record<string, FieldRule[]>;


const state = reactive({submitLoading: false});


const onSubmit = async () => {
  if (state.submitLoading) {
    return;
  }
  const err = await formRef.value.validate();
  if (err) {
    return;
  }
  state.submitLoading = true;
  createReservation(formModel.value)
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


// const fetchServiceList = async (req: ListServiceRequest) => {
//   state.loading = true;
//   try {
//     const res = await listServiceSpecific(req);
//     serviceList.value = res.data.list
//
//   } finally {
//     state.loading = false;
//   }
// };

onMounted(() => {


});

</script>