<template>
  <a-card>
    <a-table
      :data="productList"
      :loading="state.loading"
      row-key="id"
      :columns="columns"
      column-resizable
      :pagination="pagination"
      :bordered="{ cell: true }"
      @page-change="pageChanged"
      @page-size-change="pageSizeChanged"
    >
      <template #coverURL="{ record }">
        <a-image width="72" :src="record.coverImages[0]?.url"></a-image>
      </template>

      <template #type="{ record }">
        <a-typography-text
          >{{ options.GetOptionById(options.productTypes, record.type)?.name }}
        </a-typography-text>
      </template>

      <template #optional="{ record }">
        <a-space align="center">
          <!--编辑品类按钮-->
          <a-button @click="openEditTokenProduct(record)">
            <template #icon>
              <icon-edit :style="{ fontSize: '16px', color: 'green' }" />
            </template>
          </a-button>

          <!--配置SKU-->
          <a-button
            @click="
              $router.push(`product-management/sku?productId=${record.id}`)
            "
          >
            <template #icon>
              <icon-list :style="{ fontSize: '16px', color: '#d7ee8f' }" />
            </template>
          </a-button>

          <!--配置价格按钮-->
          <a-button @click="openPriceBookEntry(record)">
            <template #icon>
              <icon-book :style="{ fontSize: '16px', color: '#d7ee8f' }" />
            </template>
          </a-button>

          <!--删除产品按钮-->
          <a-popconfirm
            content="确定要删除此产品吗？"
            @ok="deleteTokenProductById(record.id)"
          >
            <a-button>
              <template #icon>
                <icon-delete :style="{ fontSize: '16px', color: 'red' }" />
              </template>
            </a-button>
          </a-popconfirm>
        </a-space>
      </template>
    </a-table>

    <a-drawer
      v-model:visible="state.editTokenProduct.visible"
      width="800px"
      ok-text="关闭抽屉"
      :hide-cancel="true"
    >
      <EditTokenProduct
        v-if="state.editTokenProduct.visible"
        :node="state.editTokenProduct.node"
        @submit-success="fetchTokenProductList"
      />
    </a-drawer>

    <a-modal
      v-model:visible="state.createPriceBookEntry.visible"
      :title="`配置 - ${state.productToConfigPrice.name} - 价格条目`"
      ok-text="关闭"
      fullscreen
    >
      <CreatePriceBookEntry
        v-if="state.createPriceBookEntry.visible"
        :product="state.productToConfigPrice"
      />
    </a-modal>
  </a-card>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';

  import EditTokenProduct from '@/views/crm/trade/token/components/token-product/edit-token-product.vue';
  import { Message } from '@arco-design/web-vue';

  import useOptionsStore from '@/store/modules/data-dictionary';
  import { DefaultPageSize } from '@/api/common';
  import CreatePriceBookEntry from '@/views/crm/product-service/price-book-entry/components/create-price-book-entry.vue';
  import {
    listTokenProducts,
    deleteTokenProduct,
    TokenProduct,
    ListTokenProductPageRequest,
  } from '@/api/crm/trade/token';
  import { Product } from '@/api/crm/product-service/product';

  const options = useOptionsStore();

  const productList = ref<TokenProduct[]>([]);

  const columns = reactive([
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60,
    },
    {
      title: '产品名称',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: '头图',
      dataIndex: 'coverURL',
      width: 150,
      slotName: 'coverURL',
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 120,
      slotName: 'type',
    },
    {
      title: '描述',
      dataIndex: 'description',
      width: 200,
    },

    {
      title: '操作',
      slotName: 'optional',
    },
  ]);

  const pagination = reactive({
    'total': 0,
    'currentPage': 0,
    'pageSize': DefaultPageSize,
    'show-more': true,
    'show-total': true,
    'show-jumper': true,
    'show-page-size': true,
  });

  const state = reactive({
    loading: false,
    createTokenProduct: {
      visible: false,
      parentNode: {} as TokenProduct,
    },
    editTokenProduct: {
      visible: false,
      node: {} as TokenProduct,
    },
    createPriceBookEntry: {
      visible: false,
    },
    productToConfigPrice: {} as Product,
    submitLoading: false,
  });

  const openPriceBookEntry = (product: Product) => {
    state.createPriceBookEntry.visible = true;
    state.productToConfigPrice = product;
  };
  const fetchTokenProductList = async (req: ListTokenProductPageRequest) => {
    state.loading = true;
    try {
      const res = await listTokenProducts(req);
      productList.value = res.data.list;
      pagination.currentPage = res.data.pageIndex!;
      pagination.pageSize = res.data.pageSize!;
      pagination.total = res.data.total!;
      // console.log(productList);
    } finally {
      state.loading = false;
    }
  };

  const openEditTokenProduct = (product: Product) => {
    // console.log(cat)
    state.editTokenProduct.node = product;
    state.editTokenProduct.visible = true;
  };

  const deleteTokenProductById = async (bookId: number) => {
    try {
      const rep = await deleteTokenProduct({ id: bookId });
      if (rep.data.id && rep.data.id > 0) {
        Message.success('删除成功');
        await fetchTokenProductList({
          pageIndex: pagination.currentPage,
          pageSize: pagination.pageSize,
        });
      }
    } catch (error) {
      // console.error(error);
    }
  };

  const pageChanged = (page: number) => {
    // console.log("page", page)
    fetchTokenProductList({ pageIndex: page, pageSize: pagination.pageSize });
  };

  const pageSizeChanged = (pageSize: number) => {
    // console.log("pagesize", pageSize)
    fetchTokenProductList({ pageIndex: pagination.currentPage, pageSize });
  };

  defineExpose({ fetchTokenProductList });

  onMounted(() => {
    options.fetchProductTypeOptions();

    fetchTokenProductList({});
  });
</script>

<style scoped></style>
