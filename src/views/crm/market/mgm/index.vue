<template>
  <div class="container">
    <a-card>
      <a-space size="large">
        <a-button type="primary" @click="openAddMGMRule()"
          >新增MGM规则
        </a-button>
      </a-space>
    </a-card>
    <br />
    <a-card>
      <MGMRuleTable ref="RefMGMRuleTable" />
    </a-card>
    <a-drawer
      v-model:visible="state.createMGMRule.visible"
      width="500px"
      ok-text="关闭抽屉"
      :hide-cancel="true"
    >
      <CreateMGMRule
        v-if="state.createMGMRule.visible"
        @submit-success="refreshMGMRuleList"
      />
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { DefaultPageSize } from '@/api';
  import MGMRuleTable from '@/views/crm/market/mgm/components/mgm-table.vue';
  import CreateMGMRule from '@/views/crm/market/mgm/components/create-mgm.vue';

  const RefMGMRuleTable = ref<any>();

  const state = reactive({
    createMGMRule: {
      visible: false,
      parentNode: {},
    },
  });

  const openAddMGMRule = () => {
    state.createMGMRule.visible = true;
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

  const refreshMGMRuleList = () => {
    RefMGMRuleTable.value.fetchMGMRuleList({
      pageIndex: pagination.currentPage,
      pageSize: pagination.pageSize,
    });
  };
</script>

<style scoped></style>
