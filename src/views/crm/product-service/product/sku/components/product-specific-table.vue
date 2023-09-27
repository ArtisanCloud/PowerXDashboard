<template>
  <div class="content">
    <a-table
      :data="productSpecificList"
      :loading="state.loading"
      row-key="id"
      :columns="columns"
      column-resizable
      :pagination="pagination"
      :bordered="{ cell: true }"
      @page-change="pageChanged"
      @page-size-change="pageSizeChanged"
    >
      <template #status="{ record }">
        <a-checkbox v-model="record.isActive" disabled>激活</a-checkbox>
      </template>
      <template #optional="{ record }">
        <a-space align="center">
          <!--编辑价格条目按钮-->
          <a-button
            title="编辑价格条目"
            @click="openEditProductSpecific(record)"
          >
            <template #icon>
              <icon-edit :style="{ fontSize: '16px', color: 'green' }" />
            </template>
          </a-button>

          <!--删除价格条目按钮-->
          <!--          <a-popconfirm-->
          <!--            content="该操作会删除价格条目,确定要删除此价格条目吗？"-->
          <!--            @ok="deleteProductSpecificById(record.id)"-->
          <!--          >-->
          <!--            <a-button >-->
          <!--              <template #icon>-->
          <!--                <icon-delete :style="{ fontSize: '16px', color: 'red' }" />-->
          <!--              </template>-->
          <!--            </a-button>-->
          <!--          </a-popconfirm>-->
        </a-space>
      </template>
    </a-table>

    <!--    <a-drawer-->
    <!--      v-model:visible="state.createProductSpecific.visible"-->
    <!--      width="500px"-->
    <!--      ok-text="关闭抽屉"-->
    <!--      :hide-cancel="true"-->
    <!--    >-->
    <!--      <CreateProductSpecificEntries-->
    <!--        v-if="state.createProductSpecific.visible"-->
    <!--        @submit-success="refreshProductSpecificList"-->
    <!--      />-->
    <!--    </a-drawer>-->
    <!--    <a-drawer-->
    <!--      v-model:visible="state.editProductSpecific.visible"-->
    <!--      width="500px"-->
    <!--      ok-text="关闭抽屉"-->
    <!--      :hide-cancel="true"-->
    <!--    >-->
    <!--      <EditProductSpecific-->
    <!--        v-if="state.editProductSpecific.visible"-->
    <!--        :node="state.editProductSpecific.node"-->
    <!--        @submit-success="refreshProductSpecificList"-->
    <!--      />-->
    <!--    </a-drawer>-->
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';

  import { DefaultPageSize } from '@/api';
  import { useRouter } from 'vue-router';
  import {
    listProductSpecifics,
    ListProductSpecificsPageRequest,
    ProductSpecific,
  } from '@/api/crm/product-service/product-specific';

  const route = useRouter();

  const productSpecificList = ref<ProductSpecific[]>([]);

  const columns = reactive([
    {
      title: '产品名称',
      dataIndex: 'productName',
      width: 250,
    },
    {
      title: 'SPU',
      dataIndex: 'spu',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      slotName: 'status',
    },
    {
      title: '交易价格',
      dataIndex: 'unitPrice',
      width: 150,
    },
    {
      title: '标识价格',
      dataIndex: 'listPrice',
      width: 100,
    },
    {
      title: '折扣换算',
      dataIndex: 'discount',
      width: 100,
    },
    {
      title: '操作',
      width: 200,
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
    productId: 0,
    loading: false,
    createProductSpecific: {
      visible: false,
      parentNode: {},
    },
    editProductSpecific: {
      visible: false,
      node: {} as ProductSpecific,
    },
  });

  const fetchProductSpecificList = async (
    req: ListProductSpecificsPageRequest
  ) => {
    state.loading = true;
    try {
      const res = await listProductSpecifics(req);
      productSpecificList.value = res.data.list;
      pagination.currentPage = res.data.pageIndex!;
      pagination.pageSize = res.data.pageSize!;
      pagination.total = res.data.total!;
      // console.log(categoryTree)
    } finally {
      state.loading = false;
    }
  };

  const openEditProductSpecific = (cat: ProductSpecific) => {
    // console.log(cat)
    state.editProductSpecific.node = cat;
    state.editProductSpecific.visible = true;
  };

  // const deleteProductSpecificById = async (bookId: number) => {
  //   try {
  //     const rep = await deleteProductSpecific({ id: bookId });
  //     if (rep.data.id && rep.data.id > 0) {
  //       Message.success('删除成功');
  //       await fetchProductSpecificList({
  //         productId: state.productId,
  //         pageIndex: pagination.currentPage,
  //         pageSize: pagination.pageSize,
  //       });
  //     }
  //   } catch (error) {
  //     // console.error(error);
  //   }
  // };

  const refreshProductSpecificList = () => {
    fetchProductSpecificList({
      productId: state.productId,
      pageIndex: pagination.currentPage,
      pageSize: pagination.pageSize,
    });
  };

  const pageChanged = (page: number) => {
    // console.log("page",page)
    pagination.currentPage = page;
    refreshProductSpecificList();
  };

  const pageSizeChanged = (pageSize: number) => {
    // console.log("pagesize",pageSize)
    pagination.pageSize = pageSize;
    refreshProductSpecificList();
  };

  defineExpose({ refreshProductSpecificList });

  onMounted(() => {
    const { query } = route.currentRoute.value;
    state.productId = Number(query.productId);
    // console.log(productSpecificId);
    refreshProductSpecificList();
  });
</script>

<style scoped></style>
