<template>
  <div class="container">
    <a-card>
      <a-space size="large">
        <a-button type="primary" @click="openAddDictionaryType()"
          >新增数据字典
        </a-button>
      </a-space>
    </a-card>
    <br />
    <a-card>
      <DictionaryTypeTable ref="RefDictionaryTypeTable" />
    </a-card>
    <a-drawer
      v-model:visible="state.createDictionaryType.visible"
      width="500px"
      ok-text="关闭抽屉"
      :hide-cancel="true"
    >
      <CreateDictionaryType
        v-if="state.createDictionaryType.visible"
        @submit-Success="refreshDictionaryTypeList"
      />
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';

  import DictionaryTypeTable from '@/views/admin/dictionary/components/dictionary-type-table.vue';
  import CreateDictionaryType from '@/views/admin/dictionary/components/create-dictionary-type.vue';
  import { DefaultPageSize } from '@/api/common';

  const RefDictionaryTypeTable = ref<any>();

  const state = reactive({
    createDictionaryType: {
      visible: false,
      parentNode: {},
    },
  });

  const openAddDictionaryType = () => {
    state.createDictionaryType.visible = true;
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

  const refreshDictionaryTypeList = () => {
    RefDictionaryTypeTable.value.fetchDictionaryTypeList({
      pageIndex: pagination.currentPage,
      pageSize: pagination.pageSize,
    });
  };
</script>

<style scoped></style>
