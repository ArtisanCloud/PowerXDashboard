<template>
  <div>
    <a-form ref="formRef" auto-label-width :model="formModel" :rules="rules" @submit="onSubmit">

      <a-form-item label="预约日程段" field="scheduleId">
        <a-typography-text>{{ formattedSchedule }}</a-typography-text>
      </a-form-item>
      <a-form-item label="客户" field="customerId">
        <a-select
            v-model="formModel.customerId"
            allow-search allow-clear
            :style="{width:'320px'}" :loading="SearchCustomerLoading" placeholder="Please select ..."
                  @search="handleSearchCustomer" :filter-option="true">
          <a-option v-for="item of customerList" :key="item.id" :value="item.id">{{ item.name }}</a-option>
        </a-select>
      </a-form-item>

      <a-form-item label="发型师" field="reservedArtisanId">
        <a-select
            v-model="formModel.reservedArtisanId"
            :options="props.currentStore.artisans"
            :field-names="{ label: 'name', value: 'id' }"
            placeholder="请选择发型师"/>
      </a-form-item>
      <a-form-item label="服务项目" field="serviceId">
        <a-select
            v-model="formModel.serviceId"
            :options="serviceList"
            :field-names="{ label: 'name', value: 'id' }"
            placeholder="请选择服务项目"/>
      </a-form-item>
      <a-form-item label="预约类型" field="type">
        <a-select
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
import {
  ListServiceSpecificRequest,
  listServiceSpecifics,
  ServiceSpecific
} from "@/api/custom/product-service/serviceSpecific";
import dayjs from "dayjs";
import {MaxPageSize} from "@/api/common";
import {Customer, ListCustomerPageRequest, listCustomers} from "@/api/crm/customer-domain/customer";

const props = defineProps({
  currentStore: Object as PropType<Store>,
  currentSchedule: Object as PropType<Schedule>,
});

const formattedSchedule = computed(() => {

  if (!props.currentSchedule) {
    return "---"
  }

  const startDate = dayjs(props.currentSchedule.startTime, 'YYYY-MM-DD HH:mm:ss');
  const endDate = dayjs(props.currentSchedule.endTime, 'YYYY-MM-DD HH:mm:ss');

  const formattedStartDate = startDate.format('MM月DD日 A hh:mm').replace('AM', '上午').replace('PM', '下午');
  ;
  const formattedEndDate = endDate.format('A hh:mm').replace('AM', '上午').replace('PM', '下午');
  ;

  return `${formattedStartDate}～${formattedEndDate}`;

});

const customerList = ref<Customer[]>([]);
const serviceList = ref<ServiceSpecific[]>([]);
const SearchCustomerLoading = ref(false);

const emits = defineEmits(['submitSuccess', 'submitFailed', 'update:id']);

const options = useOptionsStore()

const formRef = ref();
const formModel = ref({
  scheduleId: props.currentSchedule?.id,
  // reservedArtisanId: 0,
  // serviceId: 0,,
  sourceChannelId: options.GetOptionByKey(options.sourceTypes, ChannelDirect)?.id,
  type: 0,
  description: '',

} as Reservation);

const rules = {

  customerId: [
    {required: true, message: '请选择选中客户'},
  ],
  reservedArtisanId: [
    {required: true, message: '请选择发型师'},
  ],
  serviceId: [
    {required: true, message: '请选择服务项目'},
  ],
  type: [
    {required: true, message: '请选择约单类型'},
  ],


} as Record<string, FieldRule[]>;


const state = reactive({
  loading: false,
});


const onSubmit = async () => {
  if (state.loading) {
    return;
  }
  const err = await formRef.value.validate();
  if (err) {
    return;
  }
  state.loading = true;
  createReservation(formModel.value)
      .then(() => {
        Message.success('创建成功');
        emits('submitSuccess');
      })
      .catch(() => {
        emits('submitFailed');
      })
      .finally(() => {
        state.loading = false;
      });
};


const fetchCustomerList = async (req: ListCustomerPageRequest) => {
  state.loading = true;
  try {
    const res = await listCustomers(req);
    customerList.value = res.data.list

  } finally {
    state.loading = false;
  }
};


const handleSearchCustomer = (value: any) => {
  console.log(value)
  if (value) {
    fetchCustomerList({likeName: value})
  }
}


const fetchServiceList = async (req: ListServiceSpecificRequest) => {
  SearchCustomerLoading.value = true;
  try {
    const res = await listServiceSpecifics(req);
    serviceList.value = res.data.list

  } finally {
    SearchCustomerLoading.value = false;
  }
};

onMounted(() => {

  fetchServiceList({pageSize: MaxPageSize})
  // console.log(props.currentStore)
});

</script>