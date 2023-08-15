<template>
  <a-card>
    <a-table
      :data="dictionaryItemList"
      :loading="state.loading"
      row-key="key"
      :columns="columns"
      column-resizable
      :pagination="false"
      :bordered="{ cell: true }"
    >
      <template #optional="{ record }">
        <a-space align="center">
          <!--编辑字典按钮-->
          <a-button title="编辑" @click="openEditDictionaryItem(record)">
            <template #icon>
              <icon-edit :style="{ fontSize: '16px', color: 'green' }" />
            </template>
          </a-button>

          <!--删除字典按钮-->
          <a-popconfirm
            content="该操作会删除相关子字典,确定要删除此字典吗？"
            @ok="deleteDictionaryItemBy(record.type, record.key)"
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
      v-model:visible="state.editDictionaryItem.visible"
      width="500px"
      ok-text="关闭抽屉"
      :hide-cancel="true"
    >
      <EditDictionaryItem
        v-if="state.editDictionaryItem.visible"
        :node="state.editDictionaryItem.node"
        @submit-success="refreshDictionaryItemList"
      />
    </a-drawer>
  </a-card>
</template>

<script lang="tsx" setup>
  import { onMounted, PropType, reactive, ref } from 'vue';
  import {
    listDictionaryTypes,
    deleteDictionaryType,
    DictionaryType,
    ListDictionaryTypesRequest,
    DictionaryItem,
    ListDictionaryItemsRequest,
    listDictionaryItems,
    deleteDictionaryItem,
  } from '@/api/dictionary';

  import CreateDictionaryItem from '@/views/admin/dictionary/components/create-dictionary-item.vue';
  import EditDictionaryItem from '@/views/admin/dictionary/components/edit-dictionary-item.vue';
  import { Message } from '@arco-design/web-vue';

  const prop = defineProps({
    dictionaryType: {
      type: Object as PropType<DictionaryType>,
      default() {
        return {};
      },
    },
  });
  const emits = defineEmits([
    'submitUpdateSuccess',
    'submitFailed',
    'update:id',
  ]);

  const dictionaryItemList = ref<DictionaryItem[]>([]);

  const columns = reactive([
    {
      title: '标识符',
      dataIndex: 'key',
      width: 150,
    },
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

  const state = reactive({
    loading: false,
    createDictionaryItem: {
      visible: false,
      parentNode: {},
    },
    editDictionaryItem: {
      visible: false,
      node: {} as DictionaryItem,
    },
  });

  const fetchDictionaryItemList = async (req: ListDictionaryItemsRequest) => {
    state.loading = true;
    try {
      const res = await listDictionaryItems(req);
      dictionaryItemList.value = res.data.list;
      // console.log(dictionaryTypeList)
    } finally {
      state.loading = false;
    }
  };

  const refreshDictionaryItemList = () => {
    fetchDictionaryItemList({ type: prop.dictionaryType?.type });
  };

  const openCreateDictionaryItem = (cat: DictionaryType) => {
    // console.log(cat)
    state.createDictionaryItem.visible = true;
  };

  const openEditDictionaryItem = (cat: DictionaryItem) => {
    // console.log(cat)
    state.editDictionaryItem.node = cat;
    state.editDictionaryItem.visible = true;
  };

  const deleteDictionaryItemBy = async (type: string, key: string) => {
    try {
      const rep = await deleteDictionaryItem({ type, key });
      if (rep.data.type !== '') {
        Message.success('删除成功');
        refreshDictionaryItemList();
      }
    } catch (error) {
      console.error(error);
    }
  };

  onMounted(() => {
    dictionaryItemList.value = prop.dictionaryType?.items;
  });
</script>

<style scoped></style>
