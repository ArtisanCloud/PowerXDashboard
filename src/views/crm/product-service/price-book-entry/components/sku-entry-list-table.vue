<template>
  <a-card>
    <a-table
      :data="formSKUEntryList"
      :loading="state.loading"
      row-key="key"
      :columns="columns"
      column-resizable
      :pagination="false"
      :bordered="{ cell: true }"
    >
      <template #status="{ rowIndex }">
        <a-checkbox v-model="formSKUEntryList[rowIndex].isActive"
          >激活</a-checkbox
        >
      </template>

      <template #unitPrice="{ rowIndex }">
        <a-input-number v-model="formSKUEntryList[rowIndex].unitPrice" />
      </template>

      <template #listPrice="{ rowIndex }">
        <a-input-number v-model="formSKUEntryList[rowIndex].listPrice" />
      </template>
    </a-table>
  </a-card>
</template>

<script lang="ts" setup>
  import { onMounted, PropType, reactive, ref } from 'vue';
  import { PriceBookEntry } from '@/api/crm/product-service/priceBookEntry';

  const formSKUEntryList = ref([] as PriceBookEntry[]);

  const prop = defineProps({
    skuEntryList: {
      type: Array as PropType<PriceBookEntry[]>,
      default() {
        return [];
      },
    },
  });

  const columns = reactive([
    {
      title: 'SKU',
      dataIndex: 'skuNo',
      width: 250,
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      slotName: 'status',
    },
    {
      title: '交易价格',
      dataIndex: 'unitPrice',
      slotName: 'unitPrice',
    },
    {
      title: '零售价格',
      dataIndex: 'listPrice',
      slotName: 'listPrice',
    },
  ]);

  const state = reactive({
    skuEntryList: [] as PriceBookEntry[],
    loading: false,
  });

  const refreshSKUEntryList = () => {
    for (let i = 0; i < prop.skuEntryList.length; i += 1) {
      const skuEntry = prop.skuEntryList[i];
      formSKUEntryList.value.push(skuEntry);
    }
    // console.log(formSKUEntryList);
  };

  onMounted(() => {
    refreshSKUEntryList();
  });
</script>

<style scoped></style>
