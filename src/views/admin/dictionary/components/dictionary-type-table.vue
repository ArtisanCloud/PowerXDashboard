<template>
  <a-card>
    <a-table
      :data="dictionaryTypeList"
      :loading="state.loading"
      row-key="type"
      :expandable="expandable"
      :columns="columns"
      column-resizable
      :pagination="pagination"
      :bordered="{ cell: true }"
      @page-change="pageChanged"
      @page-size-change="pageSizeChanged"
    >
      <template #optional="{ record }">
        <a-space align="center">
          <!--编辑字典按钮-->
          <a-button @click="openEditDictionaryType(record)">
            <template #icon>
              <icon-edit :style="{ fontSize: '16px', color: 'green' }" />
            </template>
          </a-button>

          <!--添加字典数据项按钮-->
          <a-button @click="openCreateDictionaryItem(record)">
            <template #icon>
              <icon-plus :style="{ fontSize: '16px' }" />
            </template>
          </a-button>

          <!--删除字典按钮-->
          <a-popconfirm
            content="该操作会删除相关子字典,确定要删除此字典吗？"
            @ok="deleteDictionaryTypeByType(record.type)"
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
      v-model:visible="state.createDictionaryItem.visible"
      width="500px"
      ok-text="关闭抽屉"
      :hide-cancel="true"
    >
      <CreateDictionaryItem
        v-if="state.createDictionaryItem.visible"
        :parent-node="state.createDictionaryItem.parentNode"
        @submit-Success="fetchDictionaryTypeList"
      />
    </a-drawer>

    <a-drawer
      v-model:visible="state.editDictionaryType.visible"
      width="500px"
      ok-text="关闭抽屉"
      :hide-cancel="true"
    >
      <EditDictionaryType
        v-if="state.editDictionaryType.visible"
        :node="state.editDictionaryType.node"
        @submit-Success="fetchDictionaryTypeList"
      />
    </a-drawer>
  </a-card>
</template>

<script lang="tsx" setup>
  import { onMounted, reactive, ref, h } from 'vue';

  import {
    listDictionaryTypes,
    deleteDictionaryType,
    DictionaryType,
    ListDictionaryTypesRequest,
  } from '@/api/dictionary';

  import EditDictionaryType from '@/views/admin/dictionary/components/edit-dictionary-type.vue';
  import DictionaryItemTable from '@/views/admin/dictionary/components/dictionary-item-table.vue';
  import { Message } from '@arco-design/web-vue';
  import CreateDictionaryItem from '@/views/admin/dictionary/components/create-dictionary-item.vue';

  const dictionaryTypeList = ref<DictionaryType[]>([]);

  const columns = reactive([
    {
      title: '类型值',
      dataIndex: 'type',
      width: 150,
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 120,
      slotName: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      width: 300,
    },
    {
      title: '操作',
      slotName: 'optional',
    },
  ]);

  const expandable = reactive({
    title: '展开数据项',
    width: 100,
    expandedRowRender: (record: any) => {
      if (record.items && record.items.length > 0) {
        const tbItems = <DictionaryItemTable dictionaryType={record} />;

        return tbItems;
      }
      return null;
    },
  });

  const pagination = reactive({
    'total': 0,
    'currentPage': 0,
    'pageSize': 10,
    'show-more': true,
    'show-total': true,
    'show-jumper': true,
    'show-page-size': true,
  });

  const state = reactive({
    loading: false,
    createDictionaryType: {
      visible: false,
      parentNode: {},
    },
    editDictionaryType: {
      visible: false,
      node: {} as DictionaryType,
    },
    createDictionaryItem: {
      visible: false,
      parentNode: {} as DictionaryType,
    },
    editDictionaryItem: {
      visible: false,
      node: {},
    },
  });

  const fetchDictionaryTypeList = async (req: ListDictionaryTypesRequest) => {
    state.loading = true;
    try {
      const res = await listDictionaryTypes(req);
      dictionaryTypeList.value = res.data.list;
      pagination.currentPage = res.data.pageIndex;
      pagination.pageSize = res.data.pageSize;
      pagination.total = res.data.total;
      // console.log(dictionaryTypeList)
    } finally {
      state.loading = false;
    }
  };

  const openCreateDictionaryItem = (cat: DictionaryType) => {
    // console.log(cat)
    state.createDictionaryItem.parentNode = cat;
    state.createDictionaryItem.visible = true;
  };

  const openEditDictionaryType = (cat: DictionaryType) => {
    // console.log(cat)
    state.editDictionaryType.node = cat;
    state.editDictionaryType.visible = true;
  };

  const deleteDictionaryTypeByType = async (type: string) => {
    try {
      const rep = await deleteDictionaryType({ type });
      if (rep.data.type !== '') {
        Message.success('删除成功');
        await fetchDictionaryTypeList({
          pageIndex: pagination.currentPage,
          pageSize: pagination.pageSize,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const pageChanged = (page: number) => {
    console.log('page', page);
    fetchDictionaryTypeList({ pageIndex: page, pageSize: pagination.pageSize });
  };

  const pageSizeChanged = (pageSize: number) => {
    console.log('pagesize', pageSize);
    fetchDictionaryTypeList({ pageIndex: pagination.currentPage, pageSize });
  };

  defineExpose({ fetchDictionaryTypeList });

  onMounted(() => {
    fetchDictionaryTypeList({});
  });
</script>

<style scoped></style>
