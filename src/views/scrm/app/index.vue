<!--
 * @Description:应用管理 
 * @Author: George
 * @Date: 2023-06-13 23:39:18
 * @LastEditors: George
 * @LastEditTime: 2023-07-10 11:09:04
-->
<template>
  <a-card>
    <a-table
      :data="customersList.list"
      :loading="state.loading"
      column-resizable
      scrollbar
      :bordered="{ cell: true }"
    >
      <template #columns>
        <a-table-column title="agentId" :width="200">
          <template #cell="{ record }">
            {{ record.agentId }}
          </template>
        </a-table-column>
        <a-table-column
          title="logo"
          :width="250"
          :ellipsis="true"
          :tooltip="true"
        >
          <template #cell="{ record }">
            <img class="header" :src="record.squareLogoUrl" />
          </template>
        </a-table-column>
        <a-table-column
          title="名称"
          :width="250"
          :ellipsis="true"
          :tooltip="true"
        >
          <template #cell="{ record }">
            {{ record.name }}
          </template>
        </a-table-column>
        <a-table-column
          title="操作"
          :width="250"
          :ellipsis="true"
          :tooltip="true"
        >
          <template #cell="{ record }">
            <a-button type="text" @click="handleSendMsg(record)"
              >发送应用消息</a-button
            >
          </template>
        </a-table-column>
      </template>
    </a-table>
    <a-drawer
      v-model:visible="state.visible"
      width="500px"
      ok-text="关闭抽屉"
      :hide-cancel="true"
    >
      <send-message
        :agentid="agentid"
        @submit-success="handleSendSuccess"
      ></send-message>
    </a-drawer>
  </a-card>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';
  import { wechatAppList } from '@/api/scrm/customer';
  import SendMessage from '@/views/scrm/app/components/send-message.vue';

  const state = reactive({
    loading: false,
    visible: false,
  });
  const agentid = ref(0 as number);
  const customersList = reactive<any>({
    list: [],
  });

  async function fetchWechatAppList() {
    state.loading = true;
    const res = await wechatAppList({});
    try {
      customersList.list = res.data?.list;
    } finally {
      state.loading = false;
    }
  }
  const handleSendMsg = (item: any) => {
    state.visible = true;
    agentid.value =Number(item.agentid);
  };

  const handleSendSuccess = () => {
    state.visible = false;
  };
  onMounted(() => {
    fetchWechatAppList();
  });
</script>

<style lang="less" scoped>
  .header {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
  :deep(.arco-table-cell) {
    display: block;
    width: 100%;
    text-align: center;
  }
  :deep(.arco-table-td-content) {
    display: block;
    width: 100%;
    text-align: center;
  }
  .arco-table-cell .arco-table-th-title {
    display: inline-block;
    width: 100%;
    text-align: center;
  }
</style>
