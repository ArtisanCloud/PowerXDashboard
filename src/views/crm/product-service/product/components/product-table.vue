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

      <template #productCategories="{ record }">
        <a-typography-text
          v-for="category in record.productCategories"
          :key="category.id"
        >
          {{ category.name }} |
        </a-typography-text>
      </template>

      <template #optional="{ record }">
        <a-space align="center">
          <!--编辑品类按钮-->
          <a-button @click="openEditProduct(record)">
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
            @ok="deleteProductById(record.id)"
          >
            <a-button v-if="!record.isStandard">
              <template #icon>
                <icon-delete :style="{ fontSize: '16px', color: 'red' }" />
              </template>
            </a-button>
          </a-popconfirm>
        </a-space>
      </template>
    </a-table>

    <a-drawer
      v-model:visible="state.editProduct.visible"
      width="800px"
      ok-text="关闭抽屉"
      :hide-cancel="true"
    >
      <EditProduct
        v-if="state.editProduct.visible"
        :node="state.editProduct.node"
        @submit-success="fetchProductList"
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
  import {
    listProducts,
    deleteProduct,
    Product,
    ListProductPageRequest,
  } from '@/api/crm/product-service/product';

  import EditProduct from '@/views/crm/product-service/product/components/edit-product.vue';
  import { Message } from '@arco-design/web-vue';

  import useOptionsStore from '@/store/modules/data-dictionary';
  import { dayjs } from '@arco-design/web-vue/es/_utils/date';
  import { DefaultPageSize } from '@/api/common';
  import CreatePriceBookEntry from '@/views/crm/product-service/price-book-entry/components/create-price-book-entry.vue';

  const options = useOptionsStore();

  const productList = ref<Product[]>([]);

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
      title: '品类名称',
      dataIndex: 'productCategories',
      width: 150,
      slotName: 'productCategories',
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
      title: '销售开始时间',
      dataIndex: 'saleStartDate',
      width: 100,
      slotName: 'saleStartDate',
      render: (object: any) => {
        const jsDate = dayjs(object.record.saleStartDate);
        if (jsDate.isValid()) {
          // console.log(jsDate)
          return jsDate.format('YY-MM-DD');
        }
        return '未设置';
      },
    },
    {
      title: '销售结束时间',
      dataIndex: 'saleEndDate',
      width: 100,
      slotName: 'saleEndDate',
      render: (object: any) => {
        const jsDate = dayjs(object.record.saleEndDate);
        if (jsDate.isValid()) {
          // console.log(jsDate)
          return jsDate.format('YY-MM-DD');
        }
        return '未设置';
      },
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
    createProduct: {
      visible: false,
      parentNode: {} as Product,
    },
    editProduct: {
      visible: false,
      node: {} as Product,
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
  const fetchProductList = async (req: ListProductPageRequest) => {
    state.loading = true;
    try {
      const res = await listProducts(req);
      productList.value = res.data.list;
      pagination.currentPage = res.data.pageIndex;
      pagination.pageSize = res.data.pageSize;
      pagination.total = res.data.total;
      // console.log(productList);
    } finally {
      state.loading = false;
    }
  };

  const openEditProduct = (cat: Product) => {
    // console.log(cat)
    state.editProduct.node = cat;
    state.editProduct.visible = true;
  };

  const deleteProductById = async (bookId: number) => {
    try {
      const rep = await deleteProduct({ id: bookId });
      if (rep.data.id && rep.data.id > 0) {
        Message.success('删除成功');
        await fetchProductList({
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
    fetchProductList({ pageIndex: page, pageSize: pagination.pageSize });
  };

  const pageSizeChanged = (pageSize: number) => {
    // console.log("pagesize", pageSize)
    fetchProductList({ pageIndex: pagination.currentPage, pageSize });
  };

  defineExpose({ fetchProductList });

  onMounted(() => {
    options.fetchProductTypeOptions();
    options.fetchProductPlanOptions();

    fetchProductList({});
  });
</script>

<style scoped></style>
