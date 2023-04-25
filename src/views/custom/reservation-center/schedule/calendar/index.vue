<template>
  <div class="container">
    <a-card>
      <a-space size="large">
        <a-button type="primary" @click="openAddPriceBook()"
        >配置日程表
        </a-button>
        <a-button type="primary" @click="openAddPriceBook()"
        >新增客户线索
        </a-button>
        <a-select @options="options.stores" />
      </a-space>
    </a-card>
  </div>
</template>

<script type="ts" setup>

// Calendar Component
// https://github.com/fullcalendar/fullcalendar-vue


import {onMounted, reactive} from "vue";
import {listStores, ListStoresRequest} from "@/api/crm/product-service/priceBook";


const state = reactive({
  loading: false,
});

const options = reactive({
  stores: [],
});


const fetchStoreList = async () => {
  state.loading = true;
  try {
    const res = await listStores({});

  } finally {
    state.loading = false;
  }
};

onMounted(() => {
  fetchStoreList({});
});

</script>

<style scoped>

</style>