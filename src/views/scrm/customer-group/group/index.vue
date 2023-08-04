<!--
 * @Description:客户群管理 
 * @Author: George
 * @Date: 2023-06-13 23:39:18
 * @LastEditors: George
 * @LastEditTime: 2023-07-10 22:23:50
-->
<template>
  <a-card>
    <a-form
      :model="customersParams"
      layout="vertical"
      auto-label-width
      @submit="handleSubmit"
    >
      <a-space>
        <a-form-item field="name" label-width="0">
          <a-input
            v-model="customersParams.name"
            allow-clear
            placeholder="请输入群名称"
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit">搜索</a-button>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleReset">重置</a-button>
        </a-form-item>
      </a-space>
    </a-form>
    <a-row :gutter="{ xs: 24, sm: 24, md: 24, lg: 24 }">
      <a-col :xs="24" :sm="24" :md="24" :lg="24">
        <a-card>
          <div class="right">
            <a-button
              style="margin: 0 10px"
              type="primary"
              @click="fetchWechatSync"
              >同步群信息</a-button
            >
            <a-button type="primary" @click="handleSendMsgAll"
              >批量发送群消息</a-button
            >
          </div>
          <a-table
            :pagination="true"
            :data="customersList.list"
            :loading="state.loading"
            column-resizable
            scrollbar
            :bordered="{ cell: true }"
            @select="handleSelect"
          >
            <template #columns>
              <!-- <a-table-column title="chatId" :width="200">
                <template #cell="{ record }">
                  {{ record.chatId}}
                </template>
              </a-table-column> -->
              <a-table-column
                title="群名称"
                :width="200"
                :ellipsis="true"
                :tooltip="true"
              >
                <template #cell="{ record }">
                  {{ record.name }}
                </template>
              </a-table-column>
              <a-table-column
                title="群主"
                :width="200"
                data-index="owner"
                :ellipsis="true"
                :tooltip="true"
              ></a-table-column>
              <a-table-column
                title="群成员"
                :width="200"
                :ellipsis="true"
                :tooltip="true"
              >
                <template #cell="{ record }">
                  <p
                    v-for="(item, index) in record.memberList"
                    :key="index"
                    style="display: inline-block"
                    >{{ item.name }}
                    <span v-if="index < record.memberList.length - 1">、</span>
                  </p>
                </template>
              </a-table-column>
              <a-table-column title="创建时间" data-index="Mobile" :width="180">
                <template #cell="{ record }">
                  <span>{{ getTime(record.createTime) }}</span>
                </template>
              </a-table-column>
              <!-- <a-table-column  title="操作"  :width="100" :ellipsis="true" :tooltip="true">
                <template #cell="{ record }">
                  <a-button type="text" @click="handleSendMsg(record)">发送群消息</a-button>
                  </template>
              </a-table-column> -->
            </template>
          </a-table>
        </a-card>
      </a-col>
    </a-row>
    <a-drawer
      v-model:visible="state.visible"
      width="500px"
      ok-text="关闭抽屉"
      :hide-cancel="true"
    >
      <SendMessage
        :sender="sender"
        @submit-success="handleSendSuccess"
      ></SendMessage>
    </a-drawer>
  </a-card>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref, toRaw } from 'vue';
  import SendMessage from '@/views/scrm/customer-group/group/components/send-message.vue';
  import { Message } from '@arco-design/web-vue';
  import {
    getCustomersGroups,
    GetCustomersGroupsRequest,
    getWechatSync,
  } from '@/api/scrm/customer';

  const sender = ref('');
  const chatIds = ref([] as string[]);

  const state = reactive({
    loading: false,
    visible: false,
  });
  const customersParams = ref({
    status_filter: 0,
    limit: 100,
    name: '',
    cursor: '',
  } as GetCustomersGroupsRequest);

  const customersList = reactive<any>({
    list: [],
  });

  const form = toRaw({
    ...customersParams.value,
  });
  async function fetchCustomers() {
    state.loading = true;
    const res = await getCustomersGroups({
      ...customersParams.value,
    });
    try {
      customersList.list = res.data?.list;
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
        fetchCustomers();
      }
    } catch (err) {
      state.loading = false;
    } finally {
      state.loading = false;
    }
  }
  const handleSubmit = () => {
    fetchCustomers();
  };
  const handleReset = () => {
    customersParams.value = { ...form };
    fetchCustomers();
  };
  const handleSendSuccess = () => {
    state.visible = false;
  };

  const handleSendMsgAll = () => {
    if (customersList.list.length === 0) {
      Message.error('暂无客户群信息');
    } else {
      sender.value = customersList.list[0].owner;
      state.visible = true;
    }
  };
  const handleSelect = (rowKey: any) => {
    chatIds.value = rowKey;
  };
  function getTime(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    const Y = date.getFullYear();
    const M =
      date.getMonth() + 1 < 10
        ? `0${date.getMonth() + 1}`
        : date.getMonth() + 1;
    const D = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const h = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const m =
      date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    const s =
      date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
    return `${Y} - ${M}-${D} ${h}:${m}:${s}`;
  }
  onMounted(() => {
    fetchCustomers();
  });
</script>

<style lang="less" scoped>
  .header {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
  .right {
    display: flex;
    justify-content: flex-end;
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
</style>
