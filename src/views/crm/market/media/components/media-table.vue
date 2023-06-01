<template>
  <a-card>
    <a-table
      :data="mediaList"
      :loading="state.loading"
      row-key="id"
      :columns="columns"
      column-resizable
      :pagination="pagination"
      :bordered="{ cell: true }"
      @page-change="pageChanged"
      @page-size-change="pageSizeChanged"
    >
      <template #mediaType="{ record }">
        <a-typography-text>{{
          options.GetOptionById(options.mediaTypes, record.mediaType)?.name
        }}</a-typography-text>
      </template>
      <template #coverURL="{ record }">
        <a-image width="72" :src="record.coverImage?.url"></a-image>
      </template>
      <template #optional="{ record }">
        <a-space align="center">
          <!--编辑媒体按钮-->
          <a-button @click="openEditMedia(record)">
            <template #icon>
              <icon-edit :style="{ fontSize: '16px', color: 'green' }" />
            </template>
          </a-button>

          <!--配置价格按钮-->
          <a-button @click="openEditMedia(record)">
            <template #icon>
              <icon-book :style="{ fontSize: '16px', color: '#d7ee8f' }" />
            </template>
          </a-button>

          <!--删除媒体按钮-->
          <a-popconfirm
            content="该操作会删除相关子媒体,确定要删除此媒体吗？"
            @ok="deleteMediaById(record.id)"
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
      v-model:visible="state.editMedia.visible"
      width="500px"
      ok-text="关闭抽屉"
      :hide-cancel="true"
    >
      <EditMedia
        v-if="state.editMedia.visible"
        :node="state.editMedia.node"
        @submitSuccess="fetchMediaList"
      />
    </a-drawer>
  </a-card>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';
  import {
    listMedias,
    deleteMedia,
    Media,
    ListMediaPageRequest,
  } from '@/api/crm/market/media';

  import { Message } from '@arco-design/web-vue';
  import { DefaultPageSize } from '@/api/common';
  import EditMedia from '@/views/crm/market/media/components/edit-media.vue';
  import useOptionsStore from '../../../../../store/modules/data-dictionary';

  const options = useOptionsStore();

  const mediaList = ref<Media[]>([]);

  const columns = reactive([
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60,
    },
    {
      title: '媒体标题',
      dataIndex: 'title',
      width: 200,
    },
    {
      title: '媒体副标题',
      dataIndex: 'subTitle',
      width: 250,
    },
    {
      title: '类型',
      dataIndex: 'mediaType',
      width: 150,
      slotName: 'mediaType',
    },
    {
      title: '头图',
      dataIndex: 'coverURL',
      width: 150,
      slotName: 'coverURL',
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
    createMedia: {
      visible: false,
      parentNode: {},
    },
    editMedia: {
      visible: false,
      node: {},
    },
    submitLoading: false,
  });

  const fetchMediaList = async (req: ListMediaPageRequest) => {
    state.loading = true;
    try {
      const res = await listMedias(req);
      mediaList.value = res.data.list;
      pagination.currentPage = res.data.pageIndex;
      pagination.pageSize = res.data.pageSize;
      pagination.total = res.data.total;
      // console.log(categoryTree)
    } finally {
      state.loading = false;
    }
  };

  const openEditMedia = (cat: Media) => {
    // console.log(cat)
    state.editMedia.node = cat;
    state.editMedia.visible = true;
  };

  const deleteMediaById = async (bookId: number) => {
    try {
      const rep = await deleteMedia({ id: bookId });
      if (rep.data.id && rep.data.id > 0) {
        Message.success('删除成功');
        await fetchMediaList({
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
    fetchMediaList({ pageIndex: page, pageSize: pagination.pageSize });
  };

  const pageSizeChanged = (pageSize: number) => {
    // console.log("pagesize", pageSize)
    fetchMediaList({ pageIndex: pagination.currentPage, pageSize });
  };

  defineExpose({ fetchMediaList });

  onMounted(() => {
    fetchMediaList({});
  });
</script>

<style scoped></style>
