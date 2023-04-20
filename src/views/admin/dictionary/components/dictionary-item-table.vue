<template>
  <a-card>

    <a-table :data="dictionaryType.items"
             :loading="state.loading"
             row-key="key"
             :columns="columns"
             column-resizable
             :bordered="{cell:true}">

      <template #optional="{ record }">
        <a-space align="center">

          <!--编辑字典按钮-->
          <a-button @click="openEditDictionaryType(record)">
            <template #icon>
              <icon-edit :style="{fontSize:'16px', color:'green'}"/>
            </template>
          </a-button>

          <!--删除字典按钮-->
          <a-popconfirm
              content="该操作会删除相关子字典,确定要删除此字典吗？"
              @ok="deleteDictionaryTypeByType(record.type)"
          >
            <a-button v-if="!record.isStandard">
              <template #icon>
                <icon-delete :style="{fontSize:'16px', color:'red'}"/>
              </template>
            </a-button>
          </a-popconfirm>

        </a-space>
      </template>

    </a-table>

        <a-drawer v-model:visible="state.createDictionaryItem.visible" width="500px">
          <CreateDictionaryType
              @submitSuccess="fetchDictionaryTypeList"
              v-if="state.createDictionaryType.visible"
          />
        </a-drawer>
        <a-drawer v-model:visible="state.editDictionaryItem.visible" width="500px">
          <EditDictionaryType
              @submitSuccess="fetchDictionaryTypeList"
              v-if="state.editDictionaryType.visible"
              :node="state.editDictionaryType.node"
          />
        </a-drawer>
  </a-card>
</template>


<script lang="ts" setup>


import {onMounted, PropType, reactive, ref} from "vue";
import {
  listDictionaryTypes,
  deleteDictionaryType,
  DictionaryType,
  ListDictionaryTypesRequest,
  DictionaryItem
} from "@/api/dictionary";

// import CreateDictionaryType from '@/views/admin/dictionary/components/create-dictionary-type.vue'
// import EditDictionaryType from '@/views/admin/dictionary/components/edit-dictionary-type.vue'
import {Message} from "@arco-design/web-vue";

const prop = defineProps({
  dictionaryType: {
    type: Object as PropType<DictionaryType>,
    default() {
      return {};
    },
  }
});
const emits = defineEmits(['submitSuccess', 'submitFailed', 'update:id']);



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
    slotName: 'name'
  },
  {
    title: '描述',
    dataIndex: 'description',
    width: 300,
  },
  {
    title: '操作',
    slotName: 'optional'
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
    node: {},
  },
});





const openCreateDictionaryItem = (cat: DictionaryType) => {
  // console.log(cat)
  state.createDictionaryItem.visible = true;
};

const openEditDictionaryItem = (cat: DictionaryType) => {
  // console.log(cat)
  state.editDictionaryItem.node = cat;
  state.editDictionaryItem.visible = true;
};

const deleteDictionaryTypeByType = async (type: string) => {
  try {
    const rep = await deleteDictionaryType({type});
    // if (rep.data.type !== "") {
    //   Message.success('删除成功');
    //   await fetchDictionaryTypeList({pageIndex: pagination.currentPage, pageSize: pagination.pageSize});
    // }

  } catch (error) {
    console.error(error);
  }
};



onMounted(() => {
  console.log(123)
});

</script>


<style scoped></style>
