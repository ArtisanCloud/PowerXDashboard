<template>
  <a-space
    direction="vertical"
    fill
    style="display: flex; justify-content: center"
  >
    <div
      style="
        margin-top: 20px;
        margin-bottom: 40px;
        width: 100%; /*border: #6b1111 1px dashed*/
      "
    >
      <a-select
        v-model="state.productIds"
        allow-search
        allow-clear
        :loading="state.loading"
        placeholder="请选择需要选配的产品"
        :filter-option="true"
        multiple
        @search="handleSearchProduct"
        @change="onSelectedChanged"
      >
        <a-option
          v-for="(item, index) of options.searchedProducts"
          :key="index"
          :value="item.id"
        >
          {{ item.name }}
        </a-option>
      </a-select>
    </div>
    <div
      style="
        display: flex;
        justify-content: center;
        width: 100%;
        /*border: #753939 1px dashed;*/
        margin-bottom: 20px;
      "
    >
      <a-table
        v-model:selectedKeys="state.productIds"
        style="width: 100%"
        row-key="id"
        :columns="columns"
        :data="options.searchedProducts"
        :row-selection="rowSelection"
        @select="onSelectedChanged"
      >
        <template #activePriceBookEntry="{ record }">
          <a-typography-text>
            {{
              record.activePriceBookEntry === null
                ? '未配置价格'
                : record.activePriceBookEntry?.unitPrice
            }}
          </a-typography-text>
        </template>
        <template #skus="{ record }">
          <a-typography-text v-for="sku in record.skus" :key="sku.id">
            {{ sku.skuNo }} ~ {{ sku.listPrice }} <br />
          </a-typography-text>
        </template>
        <template #status="{ record }">
          <a-typography-text>{{
            record.isActivated ? '激活' : '未激活'
          }}</a-typography-text>
        </template>
      </a-table>
    </div>
  </a-space>
</template>

<script lang="ts" setup>
  import { onMounted, reactive } from 'vue';
  import { Product, listProducts } from '@/api/crm/product-service/product';
  import { getObjectsByIds, mergeObjectArrays } from '@/utils/array';

  const emits = defineEmits(['onSelectedItems']);
  const options = reactive({
    searchedProducts: [] as Product[],
  });

  const columns = [
    {
      title: '产品名称',
      dataIndex: 'name',
    },
    {
      title: 'SPU',
      dataIndex: 'spu',
    },
    {
      title: '手册价格条目',
      dataIndex: 'activePriceBookEntry',
      width: 150,
      slotName: 'activePriceBookEntry',
    },
    {
      title: 'SKUs',
      dataIndex: 'skus',
      width: 250,
      slotName: 'skus',
    },
    {
      title: '状态',
      dataIndex: 'isActivated',
      slotName: 'status',
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
  ];

  const state = reactive({
    productIds: [] as number[],
    loading: false,
  });

  const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: false,
  } as any);

  const fetchProducts = async ({ likeName = '' }) => {
    state.loading = true;
    try {
      // console.log(likeName);
      const res = await listProducts({
        likeName,
        pageIndex: 1,
        pageSize: 10,
      });
      options.searchedProducts = mergeObjectArrays(
        options.searchedProducts,
        res.data.list,
      );
    } finally {
      state.loading = false;
    }
  };

  const handleSearchProduct = (key: string) => {
    if (key) {
      fetchProducts({ likeName: key });
    }
  };

  const onSelectedChanged = (value: any) => {
    state.productIds = value;
    // console.log(state.productIds);
    const selectedProducts = getObjectsByIds(
      options.searchedProducts,
      state.productIds,
    );

    emits('onSelectedItems', selectedProducts);
  };

  onMounted(() => {
    fetchProducts({ likeName: '' });
  });
</script>

<style scoped></style>
