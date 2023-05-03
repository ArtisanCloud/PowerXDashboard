<template>
  <div class="container">
    <a-card>
      <a-space size="large">
        <!--        <a-button type="primary" @click="openAddStore()"-->
        <!--        >配置日程表-->
        <!--        </a-button>-->

        <a-select
            ref="RefCurrentStore"
            v-model="state.currentStoreId"
            :options="storeList"
            :field-names="{ label: 'name', value: 'id'  }"
            @change="changeSelectedStore"
        />

        <a-button @click="openAddCustomer()"
        >新增客户
        </a-button>
        <a-button type="primary" @click="openAddReservation()"
        >新增预约
        </a-button>


      </a-space>
    </a-card>
    <a-card>
      <ScheduleCalendarTable
          :currentStore="state.currentStore"
          ref="RefScheduleCalendarTable"/>
    </a-card>
        <a-drawer v-model:visible="state.createCustomer.visible" width="500px">
          <CreateCustomer
              v-if="state.createCustomer.visible"
          />
        </a-drawer>
    <a-drawer v-model:visible="state.createReservation.visible" width="500px">
      <CreateReservation
          @submitSuccess="refreshScheduleList"
          v-if="state.createReservation.visible"
          :current-store="state.currentStore"
          :currentSchedule="state.createReservation.node"
      />
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>

import {onMounted, reactive, ref} from "vue";
import {ListStoreRequest, listStores, Store} from "@/api/crm/product-service/store";
import ScheduleCalendarTable
  from "@/views/custom/reservation-center/schedule/calendar/components/schedule-calendar-table.vue";
import {Schedule} from "@/api/custom/reservation-center/schedule";

import CreateCustomer from "@/views/crm/customer-domain/customer/components/create-customer.vue"
import CreateReservation from "@/views/custom/reservation-center/reservation/compoments/create-reservation.vue"
import {Message} from "@arco-design/web-vue";

const storeList = ref<Store[]>([]);
const RefCurrentStore = ref();
const RefScheduleCalendarTable = ref();


const state = reactive({
  currentStore: {} as Store,
  currentStoreId: 1,
  loading: false,
  createCustomer: {
    visible: false,
  },
  createReservation: {
    visible: false,
    node: {} as Schedule
  },

});

const openAddCustomer = () => {
  state.createCustomer.visible = true;
};


const openAddReservation = () => {
  const currentSelectSchedule = RefScheduleCalendarTable.value.getCurrentSchedule()
  if (!currentSelectSchedule.startTime) {
    Message.warning('请先在日历中选择一个时间段格');
    return
  }

  state.createReservation.visible = true;
  state.createReservation.node = currentSelectSchedule
};

const refreshScheduleList = () => {
  // 刷新日程表
  console.log(123,RefScheduleCalendarTable.value.currentDate)
  RefScheduleCalendarTable.value.clearCalendar()
  RefScheduleCalendarTable.value.fetchScheduleList({
    storeId: state.currentStoreId,
    currentDate: RefScheduleCalendarTable.value.getCurrentDate().toLocaleDateString()
  });
}


const fetchStoreList = async (req: ListStoreRequest) => {
  state.loading = true;
  try {
    const res = await listStores(req);
    storeList.value = res.data.list

    // 设置当前选中的店铺
    const defaultStore = storeList.value[0]
    state.currentStore = defaultStore
    state.currentStoreId = defaultStore.id

    // 刷新日程表
    refreshScheduleList()

  } finally {
    state.loading = false;
  }
};




const getStoreById = (stores: Store[], id: number): Store | undefined => {
  for (let i = 0; i < stores.length; i += 1) {
    if (stores[i].id === id) {
      return stores[i]
    }
  }

  return undefined
}


const changeSelectedStore = (storeId: number) => {

  const store = getStoreById(storeList.value, storeId)
  if (store) {

    state.currentStore = store

    refreshScheduleList()
  }

}


onMounted(() => {

  fetchStoreList({});

});

</script>

<style scoped>

</style>