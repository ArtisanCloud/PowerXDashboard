<template>
  <div class="content">
    <a-table
      :data="mgmList"
      :loading="state.loading"
      row-key="id"
      :columns="columns"
      column-resizable
      :pagination="pagination"
      :bordered="{ cell: true }"
      @page-change="pageChanged"
      @page-size-change="pageSizeChanged"
    >
      <template #mgmRuleType="{ record }">
        <a-typography-text>{{
          options.GetOptionById(options.mgmScenes, record.scene)?.name
        }}</a-typography-text>
      </template>
      <template #coverURL="{ record }">
        <a-image width="72" :src="record.coverImage?.url"></a-image>
      </template>
      <template #optional="{ record }">
        <a-space align="center">
          <!--编辑MGM规则按钮-->
          <a-button title="编辑" @click="openEditMGMRule(record)">
            <template #icon>
              <icon-edit :style="{ fontSize: '16px', color: 'green' }" />
            </template>
          </a-button>

          <!--删除MGM规则按钮-->
          <a-popconfirm
            content="该操作会删除相关子MGM规则,确定要删除此MGM规则吗？"
            @ok="deleteMGMRuleById(record.id)"
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
      v-model:visible="state.editMGMRule.visible"
      width="500px"
      ok-text="关闭抽屉"
      :hide-cancel="true"
    >
      <EditMGMRule
        v-if="state.editMGMRule.visible"
        :node="state.editMGMRule.node"
        @submit-success="fetchMGMRuleList"
      />
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';
  import {
    deleteMGMRule,
    ListMGMRulePageRequest,
    listMGMRules,
    MGMRule,
  } from '@/api/crm/market/mgm';

  import { Message } from '@arco-design/web-vue';
  import { DefaultPageSize } from '@/api';
  import EditMGMRule from '@/views/crm/market/mgm/components/edit-mgm.vue';
  import useOptionsStore from '@/store/modules/data-dictionary';

  const options = useOptionsStore();

  const mgmList = ref<MGMRule[]>([]);

  const columns = reactive([
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60,
    },
    {
      title: '名字',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: '一级反佣率',
      dataIndex: 'commissionRate1',
      width: 150,
    },
    {
      title: '二级反佣率',
      dataIndex: 'commissionRate2',
      width: 150,
    },
    {
      title: '类型',
      dataIndex: 'scene',
      width: 250,
      slotName: 'mgmRuleType',
    },
    {
      title: '描述',
      dataIndex: 'description',
      width: 250,
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
    createMGMRule: {
      visible: false,
      parentNode: {},
    },
    editMGMRule: {
      visible: false,
      node: {} as MGMRule,
    },
    submitLoading: false,
  });

  const fetchMGMRuleList = async (req: ListMGMRulePageRequest) => {
    state.loading = true;
    try {
      const res = await listMGMRules(req);
      mgmList.value = res.data.list;
      pagination.currentPage = res.data.pageIndex!;
      pagination.pageSize = res.data.pageSize!;
      pagination.total = res.data.total!;
      // console.log(categoryTree)
    } finally {
      state.loading = false;
    }
  };

  const openEditMGMRule = (cat: MGMRule) => {
    // console.log(cat)
    state.editMGMRule.node = cat;
    state.editMGMRule.visible = true;
  };

  const deleteMGMRuleById = async (bookId: number) => {
    try {
      const rep = await deleteMGMRule({ id: bookId });
      if (rep.data.id && rep.data.id > 0) {
        Message.success('删除成功');
        await fetchMGMRuleList({
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
    fetchMGMRuleList({ pageIndex: page, pageSize: pagination.pageSize });
  };

  const pageSizeChanged = (pageSize: number) => {
    // console.log("pagesize", pageSize)
    fetchMGMRuleList({ pageIndex: pagination.currentPage, pageSize });
  };

  defineExpose({ fetchMGMRuleList });

  onMounted(() => {
    fetchMGMRuleList({});
  });
</script>

<style scoped></style>
