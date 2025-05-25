<script lang="ts" setup>
  import { onMounted, reactive, ref, toRaw } from 'vue';
  import SendMessage from '@/views/scrm/wecom/customer-operation/group/components/send-message.vue';
  import { Message } from '@arco-design/web-vue';
  import {
    getCustomersGroups,
    GetCustomersGroupsRequest,
  } from '@/api/scrm/wecom/customer';
  import { pullSyncWeComDepartmentsAndUsers } from '@/api/scrm/wecom/user';
  import useLoadingStore from '@/store/modules/loading';
  import styles from './index.module.less';

  const sender = ref('');
  const chatIds = ref([] as string[]);

  const state = reactive({
    visible: false,
    loading: false,
  });

  const loadingStore = useLoadingStore();
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
    loadingStore.setLoading(true);
    try {
      const res = await getCustomersGroups({
        ...customersParams.value,
      });
      customersList.list = res.data?.list;
    } finally {
      loadingStore.setLoading(false);
    }
  }
  async function fetchPullSyncWeComDepartmentsAndUsers() {
    loadingStore.setLoading(true);
    try {
      const res = await pullSyncWeComDepartmentsAndUsers({
        sync: 1,
      });
      if (res) {
        Message.success('同步成功');
        fetchCustomers();
      }
    } catch (err: any) {
      Message.error(err.message);
    } finally {
      loadingStore.setLoading(false);
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

  const onChangeFilterDateRange = () => {
    console.log('onChangeFilterDateRange');
  };
  const onSelectFilterDateRange = () => {
    console.log('onSelectFilterDateRange');
  };
  const onOkFilterDateRange = () => {
    console.log('onOkFilterDateRange');
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

<template>
  <div :class="styles.container">
    <div :class="styles.topBox">
      <span :class="styles.title">客户群</span>
      <span :class="styles.desc"
        >成员可创建包含微信用户的客户群，并可由企业统一管理
      </span>
    </div>
    <a-divider />
    <div :class="styles.mainBox">
      <div :class="styles.filter">
        <a-button-group>
          <span>群主：</span>
          <a-button :class="styles.btnFilter">不限</a-button>
          <a-button>
            <template #icon>
              <icon-down />
            </template>
          </a-button>
        </a-button-group>
        <a-button-group>
          <span>群名：</span>
          <a-button :class="styles.btnFilter">全部</a-button>
          <a-button>
            <template #icon>
              <icon-down />
            </template>
          </a-button>
        </a-button-group>
        <div>
          <span>时间：</span>
          <a-range-picker
            :class="styles.btnFilter"
            style="width: 360px"
            show-time
            :time-picker-props="{ defaultValue: ['00:00:00', '09:09:06'] }"
            format="YYYY-MM-DD HH:mm"
            @change="onChangeFilterDateRange"
            @select="onSelectFilterDateRange"
            @ok="onOkFilterDateRange"
          />
        </div>
      </div>
      <a-divider />
      <div :class="styles.resultBox">
        <div :class="styles.navBox">
          <span>共{{ customersList.list.length }}个群聊</span>
          <div class="mr-4">
            <a-tooltip content="导出">
              <a-button>
                <template #icon>
                  <icon-export />
                </template>
              </a-button>
            </a-tooltip>
          </div>
        </div>

        <div class="right">
          <a-button
            style="margin: 0 10px"
            type="primary"
            @click="fetchPullSyncWeComDepartmentsAndUsers"
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
      </div>
    </div>
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
  </div>
</template>
