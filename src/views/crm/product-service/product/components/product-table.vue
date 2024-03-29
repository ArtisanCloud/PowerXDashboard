<template>
  <div class="content">
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
      @sorter-change="sortProducts"
    >
      <template #ID="{ rowIndex }">
        <a-typography-text>{{ rowIndex + 1 }}</a-typography-text>
      </template>
      <template #coverURL="{ record }">
        <a-image
          width="72"
          :src="record.coverImages ? record.coverImages[0]?.url : ''"
        ></a-image>
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
          <a-button title="编辑" @click="openEditProduct(record)">
            <template #icon>
              <icon-edit :style="{ fontSize: '16px', color: 'green' }" />
            </template>
          </a-button>

          <!--配置SKU-->
          <a-button
            title="配置SKU"
            @click="
              $router.push(`product-management/sku?productId=${record.id}`)
            "
          >
            <template #icon>
              <icon-list :style="{ fontSize: '16px', color: 'green' }" />
            </template>
          </a-button>

          <!--配置价格按钮-->
          <a-button title="配置价格" @click="openPriceBookEntry(record)">
            <template #icon>
              <icon-book :style="{ fontSize: '16px', color: 'green' }" />
            </template>
          </a-button>
          <!--配置统计数量-->
          <a-button title="配置统计数量" @click="openStatistics(record)">
            <template #icon>
              <icon-archive :style="{ fontSize: '16px', color: 'green' }" />
            </template>
          </a-button>

          <!--下架产品按钮-->
          <a-popconfirm
            content="确定要下架此产品吗？"
            @ok="onDisableProductById(record.id)"
          >
            <a-button v-if="record.isActivated" title="下架">
              <template #icon>
                <icon-eye-invisible
                  :style="{ fontSize: '16px', color: 'red' }"
                />
              </template>
            </a-button>
          </a-popconfirm>
          <!--删除产品按钮-->
          <a-popconfirm
            content="确定要删除此产品吗？"
            @ok="deleteProductById(record.id)"
          >
            <a-button title="删除">
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
      :mask-closable="false"
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
    <a-drawer
      v-model:visible="state.editProductStatistics.visible"
      :mask-closable="false"
      width="500px"
      ok-text="关闭抽屉"
      :hide-cancel="true"
    >
      <EditProductStatistics
        v-if="state.editProductStatistics.visible"
        :node="state.editProductStatistics.node"
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
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';
  import {
    listProducts,
    deleteProduct,
    Product,
    ListProductPageRequest,
    disableProductById,
  } from '@/api/crm/product-service/product';

  import CreatePriceBookEntry from '@/views/crm/product-service/price-book-entry/components/create-price-book-entry.vue';
  import EditProduct from '@/views/crm/product-service/product/components/edit-product.vue';
  import EditProductStatistics from '@/views/crm/product-service/product/components/edit-product-statistics.vue';
  import { Message, TableColumnData } from '@arco-design/web-vue';

  import useOptionsStore from '@/store/modules/data-dictionary';
  import { dayjs } from '@arco-design/web-vue/es/_utils/date';
  import { DefaultPageSize } from '@/api';

  const options = useOptionsStore();
  const emits = defineEmits(['onSortBy']);

  const productList = ref([] as Product[]);

  const columns = reactive([
    {
      title: 'ID',
      width: 60,
      slotName: 'ID',
      dataIndex: 'id',
      // sortable: {
      //   sortDirections: ['ascend', 'descend'],
      // },
    },
    {
      title: '产品名称',
      width: 150,
      dataIndex: 'name',
      sortable: {
        sortDirections: ['ascend', 'descend'],
      },
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
      sortable: {
        sortDirections: ['ascend', 'descend'],
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
  ] as TableColumnData[]);

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
    editProductStatistics: {
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
      pagination.currentPage = res.data.pageIndex!;
      pagination.pageSize = res.data.pageSize!;
      pagination.total = res.data.total!;
      // console.log(productList);
    } finally {
      state.loading = false;
    }
  };

  const openEditProduct = (product: Product) => {
    // console.log(cat)
    state.editProduct.node = product;
    state.editProduct.visible = true;
  };

  const openStatistics = (product: Product) => {
    state.editProductStatistics.node = product;
    state.editProductStatistics.visible = true;
  };

  const onDisableProductById = async (productId: number) => {
    try {
      const rep = await disableProductById({ id: productId });
      if (rep.data.id && rep.data.id > 0) {
        Message.success('下架成功');
        await fetchProductList({
          pageIndex: pagination.currentPage,
          pageSize: pagination.pageSize,
        });
      }
    } catch (error) {
      // console.error(error);
    }
  };

  const deleteProductById = async (productId: number) => {
    try {
      const rep = await deleteProduct({ id: productId });
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

  const sortProducts = (dataIndex: string, direction: string) => {
    // console.log(dataIndex, direction);
    emits('onSortBy', dataIndex, direction);
  };

  defineExpose({ fetchProductList });

  onMounted(() => {
    fetchProductList({});
  });
</script>

<style scoped></style>
