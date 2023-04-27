<template>
  <div class="container">
    <a-card>
      <a-space size="large">
        <a-button type="primary" @click="openAddStore()"
        >配置日程表
        </a-button>
        <a-button type="primary" @click="openAddStore()"
        >新增客户线索
        </a-button>
        <a-select
            ref="RefCurrentStore"
            v-model="currentStoreId"
            :options="storeList"
            :field-names="{ label: 'name', value: 'id' }"
            @change="changeSelectedStore"
        />
      </a-space>
    </a-card>
    <a-card>
      <ScheduleCalendarTable
          :currentStoreId="currentStoreId"
          ref="RefScheduleCalendarTable"/>
    </a-card>
  </div>
</template>

<script lang="ts" setup>

import {onMounted, PropType, reactive, ref} from "vue";
import {ListStoreRequest, listStores, Store} from "@/api/crm/product-service/store";
import ScheduleCalendarTable
  from "@/views/custom/reservation-center/schedule/calendar/components/schedule-calendar-table.vue";
import {dayjs} from "@arco-design/web-vue/es/_utils/date";

const storeList = ref<Store[]>([]);

const currentStoreId = ref();
const RefCurrentStore = ref();
const RefScheduleCalendarTable = ref();


const state = reactive({
  loading: false,
});


const fetchStoreList = async (req: ListStoreRequest) => {
  state.loading = true;
  try {
    const res = await listStores(req);
    storeList.value = res.data.list

    // 设置当前选中的店铺
    const defaultStore = storeList.value[0]
    currentStoreId.value = defaultStore.id

    // 刷新日程表
    RefScheduleCalendarTable.value.fetchScheduleList({storeId: defaultStore.id});

  } finally {
    state.loading = false;
  }
};

const changeSelectedStore = (storeId: number) => {
  if (storeId > 0) {
    RefScheduleCalendarTable.value.fetchScheduleList({storeId});
  }
}

onMounted(() => {

  fetchStoreList({});

});

</script>

<style scoped>

</style>