<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';
  import SendMessage from '@/views/scrm/wecom/app/components/send-message.vue';
  import { getWeComAppList } from '@/api/scrm/wecom/app';
  import styles from './index.module.less';

  const state = reactive({
    loading: false,
    visible: false,
  });
  const agentId = ref(0 as number);
  const customersList = reactive<any>({
    list: [],
  });

  async function fetchWechatAppList() {
    state.loading = true;
    const res = await getWeComAppList({});
    try {
      customersList.list = res.data?.list;
    } finally {
      state.loading = false;
    }
  }
  const handleSendMsg = (item: any) => {
    state.visible = true;
    agentId.value = Number(item.agentid);
  };

  const handleSendSuccess = () => {
    state.visible = false;
  };
  onMounted(() => {
    fetchWechatAppList();
  });
</script>

<template>
  <div class="container">
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
            <img :class="styles.header" :src="record.squareLogoUrl" />
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
  </div>
</template>
