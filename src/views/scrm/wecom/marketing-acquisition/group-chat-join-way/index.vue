<script lang="ts" setup>
  import { onMounted, reactive, ref, toRaw } from 'vue';
  import { listWeComUsersPage } from '@/api/scrm/wecom/user';

  import useGroupChatJoinWayStore from '@/store/modules/qrcode/group-chat-join-way';
  import ListGroupChatJoinWay from './components/list-group-chat-join-way/index.vue';
  import EditGroupChatJoinWay from './components/edit-group-chat-join-way/index.vue';
  import styles from './index.module.less';

  const groupChatJoinWayStore = useGroupChatJoinWayStore();

  const usersList = reactive<any>({
    list: [],
  });

  const handleSubmit = () => {
    groupChatJoinWayStore.fetchGroupChatJoinWayList();
  };
  const formData = toRaw({
    ...groupChatJoinWayStore.groupChatJoinWayParams,
  });
  const handleReset = () => {
    groupChatJoinWayStore.groupChatJoinWayParams = { ...formData };
    groupChatJoinWayStore.fetchGroupChatJoinWayList();
  };
  const handleSendSuccess = () => {
    groupChatJoinWayStore.visible = false;
    groupChatJoinWayStore.fetchGroupChatJoinWayList();
  };
  const handleAddGroupChatJoinWay = () => {
    groupChatJoinWayStore.title = '新增活码';
    groupChatJoinWayStore.recordObj = {
      qId: '',
      status: 1,
    };
    groupChatJoinWayStore.visible = true;
  };

  const handleSyncGroupChatJoinWay = () => {
    console.log('handleSyncGroupChatJoinWay');
  };

  async function fetchUsers() {
    const res = await listWeComUsersPage({});
    try {
      usersList.list = res.data?.list;
    } catch (err) {
      usersList.list = [];
    }
  }

  onMounted(() => {
    groupChatJoinWayStore.fetchGroupChatJoinWayList();
    fetchUsers();
  });
</script>

<template>
  <div :class="styles.container">
    <div :class="styles.mainBox">
      <div :class="styles.titleBox"
        ><span :class="styles.title">加入群聊</span>
        <span :class="styles.desc"
          >客户通过扫描群二维码、立牌或点击小程序上的按钮，即可获取入群方式，进入企业的客户群。</span
        ></div
      >
      <div :class="styles.actionBox">
        <a-button type="primary" @click="handleAddGroupChatJoinWay"
          >新建加入群聊</a-button
        >
        <a-button @click="handleSyncGroupChatJoinWay"
          ><icon-sync /> 从企微同步</a-button
        >
      </div>
      <a-divider />
      <a-tabs default-active-key="1">
        <a-tab-pane key="1">
          <template #title>「加入群聊」二维码</template>
          <ListGroupChatJoinWay />
        </a-tab-pane>
      </a-tabs>
    </div>
    <a-drawer
      v-model:visible="groupChatJoinWayStore.visible"
      width="500px"
      ok-text="关闭抽屉"
      :title="groupChatJoinWayStore.title"
      :hide-cancel="true"
    >
      <EditGroupChatJoinWay
        :users-list="usersList.list"
        :edit-data="groupChatJoinWayStore.recordObj"
        @submit-success="handleSendSuccess"
      ></EditGroupChatJoinWay>
    </a-drawer>
    <a-drawer
      v-model:visible="groupChatJoinWayStore.preViewVisible"
      width="375px"
      ok-text="关闭抽屉"
      :hide-cancel="true"
    >
      <iframe
        v-if="groupChatJoinWayStore.preViewVisible"
        id="iframeid"
        height="600"
        :src="
          'https://scrm.superman.net.cn/h5/#/pages/index/index?qid=' +
          groupChatJoinWayStore.recordObj.qId
        "
        frameborder="0"
      ></iframe>
    </a-drawer>
  </div>
</template>
