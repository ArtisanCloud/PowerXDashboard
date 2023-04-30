<template>
  <div class="container">
    <a-card>
      <a-space size="large">
        <a-button type="primary" @click="openAddPriceBook()"
        >新增价格手册
        </a-button>
      </a-space>
    </a-card>
    <br/>
    <a-card>
      <PriceBookTable ref="RefPriceBookTable"/>
    </a-card>
    <a-drawer
        v-model:visible="state.createPriceBook.visible" width="500px">
      <CreatePriceBook
          @submitSuccess="refreshPriceBookList"
          v-if="state.createPriceBook.visible"/>
    </a-drawer></div>
</template>

<script lang="ts" setup>


import {reactive, ref} from 'vue';
import PriceBookTable from '@/views/crm/product-service/price-book/components/price-book-table.vue';
import CreatePriceBook from '@/views/crm/product-service/price-book/components/create-price-book.vue';
import {DefaultPageSize} from "@/api/common";

const RefPriceBookTable = ref<any>();

const openAddPriceBook = () => {
  state.createPriceBook.visible = true;
};

const pagination = reactive({
  total:0,
  currentPage: 0,
  "pageSize": DefaultPageSize,
  "show-more": true,
  "show-total": true,
  "show-jumper": true,
  "show-page-size": true,

})

const state = reactive({
  createPriceBook: {
    visible: false,
    parentNode: {}
  },
});

const refreshPriceBookList = () =>{
  RefPriceBookTable.value.fetchPriceBookList({
    pageIndex: pagination.currentPage,
    pageSize: pagination.pageSize
  })
}


</script>



<script lang="ts">
  export default {
    name: '价格手册',
  };
</script>

<style scoped></style>
