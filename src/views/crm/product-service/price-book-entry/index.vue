<template>
  <div class="container">
    <a-card>
      <a-space size="large">
        当前价格手册 -> {{ state.priceBook.name }} ->
        <a-button type="primary" @click="openAddProduct">
          添加配置产品
        </a-button>
      </a-space>
    </a-card>
    <br />
    <a-card>
      <PriceBookEntryTable ref="RefPriceBookEntryTable" />
    </a-card>
    <a-modal
      v-model:visible="state.createPriceBookEntry.visible"
      :title="`配置 - ${state.priceBook.name} - 价格条目`"
      ok-text="关闭"
      fullscreen
    >
      <CreatePriceBookEntries
        v-if="state.createPriceBookEntry.visible"
        :price-book="state.priceBook"
        @submit-success="refreshPriceBookEntryList"
      />
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';
  import PriceBookEntryTable from '@/views/crm/product-service/price-book-entry/components/price-book-entry-table.vue';
  import CreatePriceBookEntries from '@/views/crm/product-service/price-book-entry/components/create-price-book-entries.vue';
  import { useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import { getPriceBook, PriceBook } from '@/api/crm/product-service/priceBook';

  const router = useRouter();
  const RefPriceBookEntryTable = ref<any>();

  const openAddProduct = () => {
    state.createPriceBookEntry.visible = true;
  };

  const state = reactive({
    priceBook: {} as PriceBook,
    createPriceBookEntry: {
      visible: false,
      parentNode: {},
    },
  });

  const refreshPriceBookEntryList = () => {
    RefPriceBookEntryTable.value.refreshPriceBookList();
  };

  const fetchPriceBook = async (priceBookId: number) => {
    const res = await getPriceBook({
      priceBookId,
    });

    state.priceBook = res.data;
  };

  onMounted(() => {
    const { query } = useRouter().currentRoute.value;
    const priceBookId = Number(query.priceBookId);
    // console.log(priceBookId);
    if (!priceBookId || priceBookId <= 0) {
      Message.error('请先选择正确的价格手册');
      router.push({
        name: 'PriceBook',
      });
      return;
    }

    // console.log(priceBookEntryId);
    fetchPriceBook(priceBookId);
  });
</script>

<script lang="ts">
  export default {
    name: '价格手册条目',
  };
</script>

<style scoped></style>
