<template>
  <a-card>
    <a-table
      :data="artisanList"
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
        <a-image width="72" :src="record.coverImage?.url"></a-image>
      </template>
      <template #optional="{ record }">
        <a-space align="center">
          <!--编辑元匠按钮-->
          <a-button title="编辑" @click="openEditArtisan(record)">
            <template #icon>
              <icon-edit :style="{ fontSize: '16px', color: 'green' }" />
            </template>
          </a-button>

          <!--配置价格按钮-->
          <a-button @click="openEditArtisan(record)">
            <template #icon>
              <icon-book :style="{ fontSize: '16px', color: '#d7ee8f' }" />
            </template>
          </a-button>

          <!--删除元匠按钮-->
          <a-popconfirm
            content="该操作会删除相关子元匠,确定要删除此元匠吗？"
            @ok="deleteArtisanById(record.id)"
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
      v-model:visible="state.editArtisan.visible"
      width="500px"
      ok-text="关闭抽屉"
      :hide-cancel="true"
    >
      <EditArtisan
        v-if="state.editArtisan.visible"
        :node="state.editArtisan.node"
        @submit-success="fetchArtisanList"
      />
    </a-drawer>
  </a-card>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';
  import {
    listArtisans,
    deleteArtisan,
    Artisan,
    ListArtisanPageRequest,
  } from '@/api/crm/product-service/artisan';

  import CreateArtisan from '@/views/crm/product-service/artisan/components/create-artisan.vue';
  import EditArtisan from '@/views/crm/product-service/artisan/components/edit-artisan.vue';
  import { Message } from '@arco-design/web-vue';

  import { DefaultPageSize } from '@/api/common';
  import { Store } from '@/api/crm/market/store';

  const artisanList = ref<Artisan[]>([]);

  const columns = reactive([
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60,
    },
    {
      title: '元匠名称',
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
      title: '工号',
      dataIndex: 'workNo',
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
    createArtisan: {
      visible: false,
      parentNode: {},
    },
    editArtisan: {
      visible: false,
      node: {} as Artisan,
    },
    submitLoading: false,
  });

  const fetchArtisanList = async (req: ListArtisanPageRequest) => {
    state.loading = true;
    try {
      const res = await listArtisans(req);
      artisanList.value = res.data.list;
      pagination.currentPage = res.data.pageIndex!;
      pagination.pageSize = res.data.pageSize!;
      pagination.total = res.data.total!;
      // console.log(categoryTree)
    } finally {
      state.loading = false;
    }
  };

  const openEditArtisan = (cat: Artisan) => {
    // console.log(cat)
    state.editArtisan.node = cat;
    state.editArtisan.visible = true;
  };

  const deleteArtisanById = async (bookId: number) => {
    try {
      const rep = await deleteArtisan({ id: bookId });
      if (rep.data.id && rep.data.id > 0) {
        Message.success('删除成功');
        await fetchArtisanList({
          pageIndex: pagination.currentPage,
          pageSize: pagination.pageSize,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const pageChanged = (page: number) => {
    // console.log("page", page)
    fetchArtisanList({ pageIndex: page, pageSize: pagination.pageSize });
  };

  const pageSizeChanged = (pageSize: number) => {
    // console.log("pagesize", pageSize)
    fetchArtisanList({ pageIndex: pagination.currentPage, pageSize });
  };

  defineExpose({ fetchArtisanList });

  onMounted(() => {
    fetchArtisanList({});
  });
</script>

<style scoped></style>
