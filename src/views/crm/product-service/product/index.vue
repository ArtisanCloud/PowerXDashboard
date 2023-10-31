<template>
  <div class="container">
    <a-card>
      <filter-product
        ref="RefFilerProduct"
        @on-submit="onSearch"
        @on-reset="onResetSearch"
      ></filter-product>
    </a-card>
    <br />
    <a-card>
      <a-space size="large">
        <a-button type="primary" @click="openAddProduct()">新增商品 </a-button>
      </a-space>
    </a-card>
    <br />
    <a-card>
      <ProductTable ref="RefProductTable" @on-sort-by="onSortBy" />
    </a-card>
    <a-drawer
      v-model:visible="state.createProduct.visible"
      :mask-closable="false"
      width="800px"
      ok-text="关闭抽屉"
      :hide-cancel="true"
    >
      <CreateProduct
        v-if="state.createProduct.visible"
        @submit-success="refreshProductList"
      />
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import ProductTable from '@/views/crm/product-service/product/components/product-table.vue';
  import CreateProduct from '@/views/crm/product-service/product/components/create-product.vue';
  import FilterProduct from '@/views/crm/product-service/product/components/filter-product.vue';
  import { DefaultPageSize } from '@/api';
  import { ListProductPageRequest } from '@/api/crm/product-service/product';

  type ProductSortType = {
    // id: string;
    name: string;
    saleStartDate: string;
    [key: string]: string; // 添加索引签名
  };
  const productsSortBy = ref<ProductSortType>({
    // id: '',
    name: '',
    saleStartDate: '',
  });
  const formSearch = ref<ListProductPageRequest>({});

  const RefFilerProduct = ref<any>();
  const RefProductTable = ref<any>();

  const state = ref({
    createProduct: {
      visible: false,
      parentNode: {},
    },
  });

  const openAddProduct = () => {
    state.value.createProduct.visible = true;
  };

  const pagination = reactive({
    'total': 0,
    'currentPage': 0,
    'pageSize': DefaultPageSize,
    'show-more': true,
    'show-total': true,
    'show-jumper': true,
    'show-page-size': true,
  });

  const refreshProductList = () => {
    RefProductTable.value.fetchProductList({
      pageIndex: pagination.currentPage,
      pageSize: pagination.pageSize,
    });
  };

  const onResetSearch = () => {
    refreshProductList();
  };

  const getSearchRequestParams = () => {
    let strSortBy = '';
    let isFirst = true;
    let separate = '';
    Object.keys(productsSortBy.value).forEach((key) => {
      let sortValue = productsSortBy.value[key as keyof ProductSortType];
      if (sortValue !== '') {
        sortValue = sortValue === 'ascend' ? 'asc' : 'desc';

        if (isFirst) {
          isFirst = false;
        } else {
          separate = ', ';
        }
        strSortBy += `${separate}${key} ${sortValue}`;
      }
    });

    if (strSortBy !== '') {
      formSearch.value.orderBy = strSortBy;
    }
    // console.log(formSearch.value.orderBy);

    return formSearch;
  };

  const onSortBy = (dataIndex: string, direction: string) => {
    // console.log(dataIndex, direction);
    productsSortBy.value[dataIndex] = direction;
    const params = getSearchRequestParams();
    // console.log(params.value);
    RefProductTable.value.fetchProductList(params.value);
  };

  const onSearch = (data: ListProductPageRequest) => {
    formSearch.value = data;
    const params = getSearchRequestParams();
    // console.log(params.value);
    RefProductTable.value.fetchProductList(params.value);
  };
</script>

<style scoped></style>
