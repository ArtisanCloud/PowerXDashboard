<!--
 * @Description:应用管理 
 * @Author: George
 * @Date: 2023-06-13 23:39:18
 * @LastEditors: George
 * @LastEditTime: 2023-07-05 11:24:01
-->
<template>
  <div class="container">
    <a-card>
      <div clsss="right" style="display: flex; justify-content: flex-end">
        <a-button
          style="margin: 0 10px"
          type="primary"
          @click="openAddWechatGroup"
          >创建群聊</a-button
        >
        <a-button type="primary" @click="handleSendMsgAll"
          >批量发送群消息</a-button
        >
      </div>
    </a-card>
    <br />
    <a-card>
      <a-row :gutter="{ xs: 24, sm: 24, md: 24, lg: 24 }">
        <a-col :xs="24" :sm="24" :md="24" :lg="24">
          <a-card>
            <a-table
              v-model:selectedKeys="chatIds"
              :data="wechatGroupList.list"
              :loading="state.loading"
              column-resizable
              scrollbar
              :bordered="{ cell: true }"
              :pagination="false"
              row-key="chatid"
              :row-selection="rowSelection"
              @select="handleSelect"
            >
              <template #columns>
                <a-table-column
                  title="chatid"
                  data-index="chatid"
                ></a-table-column>
                <a-table-column title="群名称" :ellipsis="true" :tooltip="true">
                  <template #cell="{ record }">
                    {{ record.name }}
                  </template>
                </a-table-column>
                <a-table-column title="群主" :ellipsis="true" :tooltip="true">
                  <template #cell="{ record }">
                    {{ record.owner }}
                  </template>
                </a-table-column>
                <a-table-column
                  title="群成员"
                  :width="250"
                  :ellipsis="true"
                  :tooltip="true"
                >
                  <template #cell="{ record }">
                    <span
                      v-if="
                        record && record.userlist && record.userlist.length > 0
                      "
                      >{{ record.userlist.join(',') }}</span
                    >
                  </template>
                </a-table-column>
                <a-table-column
                  title="操作"
                  :width="250"
                  :ellipsis="true"
                  :tooltip="true"
                >
                  <template #cell="{ record }">
                    <a-button
                      type="text"
                      status="success"
                      @click="fetchWechatSync"
                      >同步群信息</a-button
                    >
                    <a-button type="text" @click="handleSendMsg(record)"
                      >发送群消息</a-button
                    >
                  </template>
                </a-table-column>
              </template>
            </a-table>
          </a-card>
        </a-col>
      </a-row>
    </a-card>
    <a-drawer
      v-model:visible="state.visible"
      width="500px"
      ok-text="关闭抽屉"
      :hide-cancel="true"
    >
      <SendMessage
        :chat-ids="chatIds"
        @submit-success="handleSendSuccess"
      ></SendMessage>
    </a-drawer>
    <a-drawer
      v-model:visible="state.addGroudvisible"
      width="500px"
      ok-text="关闭抽屉"
      :hide-cancel="true"
    >
      <AddGroup @submit-success="handleAddGroupSuccess"></AddGroup>
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';
  import {
    wechatGroup,
    GetWechatGroupReReply,
    getWechatSync,
  } from '@/api/scrm/customer';
  import { Message } from '@arco-design/web-vue';
  import AddGroup from '@/views/scrm/wechat/components/add-group.vue';
  import SendMessage from '@/views/scrm/wechat/components/send-message.vue';

  const chatIds = ref([] as string[]);
  const state = reactive({
    loading: false,
    visible: false,
    addGroudvisible: false,
  });
  const wechatGroupList = reactive({
    list: [],
  } as GetWechatGroupReReply);
  const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: true,
  } as any);
  async function fetchWechatAppList() {
    state.loading = true;
    const res = await wechatGroup({});
    try {
      const data = res.data as GetWechatGroupReReply;
      wechatGroupList.list = data.list;
    } finally {
      state.loading = false;
    }
  }
  async function fetchWechatSync() {
    state.loading = true;
    const res = await getWechatSync({
      sync: 1,
    });
    try {
      if (res) {
        Message.success('同步成功');
        fetchWechatAppList();
      }
    } finally {
      state.loading = false;
    }
  }

  const openAddWechatGroup = () => {
    state.addGroudvisible = true;
  };

  const handleSendMsgAll = () => {
    if (chatIds.value.length === 0) {
      Message.error('请选择要发送的群信息');
    } else {
      state.visible = true;
    }
  };
  const handleSelect = (rowKey: any) => {
    chatIds.value = rowKey;
  };

  const handleSendMsg = (item: any) => {
    state.visible = true;
    chatIds.value = [item.chatid];
  };
  const handleSendSuccess = () => {
    state.visible = false;
  };
  const handleAddGroupSuccess = () => {
    state.addGroudvisible = false;
    fetchWechatSync();
  };
  onMounted(() => {
    fetchWechatAppList();
  });
</script>

<style lang="less" scoped>
  .container {
    .header {
      width: 30px;
      height: 30px;
      border-radius: 50%;
    }
    .right {
      display: flex;
      justify-content: end;
      margin-bottom: 12px;
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
  }
</style>
