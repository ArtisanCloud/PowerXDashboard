<script lang="ts" setup>
  import { onMounted, reactive, toRaw } from 'vue';
  import { listUsersPage } from '@/api/scrm/wecom/user';

  import useContactWayStore from '@/store/modules/qrcode/contact-way';
  import EditContactWay from './components/edit-contact-way/index.vue';
  import ListContactWayQRCode from './components/list-contact-way-qr-code/index.vue';
  import ListContactWayWorkCard from './components/list-contact-way-work-card/index.vue';
  import styles from './index.module.less';

  const contactWayStore = useContactWayStore();

  const usersList = reactive<any>({
    list: [],
  });

  const handleSubmit = () => {
    contactWayStore.fetchContactWayList();
  };
  const formData = toRaw({
    ...contactWayStore.contactWayParams,
  });
  const handleReset = () => {
    contactWayStore.contactWayParams = { ...formData };
    contactWayStore.fetchContactWayList();
  };
  const handleSendSuccess = () => {
    contactWayStore.visible = false;
    contactWayStore.fetchContactWayList();
  };
  const handleAddContactWay = () => {
    contactWayStore.title = '新增活码';
    contactWayStore.recordObj = {
      qId: '',
      status: 1,
    };
    contactWayStore.visible = true;
  };

  async function fetchUsers() {
    const res = await listUsersPage({});
    try {
      usersList.list = res.data?.list;
    } catch (err) {
      usersList.list = [];
    }
  }

  onMounted(() => {
    contactWayStore.fetchContactWayList();
    fetchUsers();
  });
</script>

<template>
  <div :class="styles.container">
    <div :class="styles.mainBox">
      <div :class="styles.titleBox"
        ><span :class="styles.title">「联系我」</span>
        <span :class="styles.desc"
          >客户通过扫描二维码、工卡或点击小程序上的按钮，即可获取成员联系方式，主动联系到成员。</span
        ></div
      >
      <div :class="styles.actionBox">
        <a-button type="primary" @click="handleAddContactWay"
          >新建联系方式</a-button
        >
        <a-button @click="handleAddContactWay"
          ><icon-sync /> 从企微同步</a-button
        >
      </div>
      <a-divider />
      <a-tabs default-active-key="1">
        <a-tab-pane key="1">
          <template #title>「联系我」二维码</template>
          <ListContactWayQRCode />
        </a-tab-pane>
        <a-tab-pane key="2">
          <template #title>「联系我」工卡</template>
          <ListContactWayWorkCard />
        </a-tab-pane>
      </a-tabs>
    </div>
    <a-drawer
      v-model:visible="contactWayStore.visible"
      width="500px"
      ok-text="关闭抽屉"
      :title="contactWayStore.title"
      :hide-cancel="true"
    >
      <EditContactWay
        :users-list="usersList.list"
        :edit-data="contactWayStore.recordObj"
        @submit-success="handleSendSuccess"
      ></EditContactWay>
    </a-drawer>
    <a-drawer
      v-model:visible="contactWayStore.preViewVisible"
      width="375px"
      ok-text="关闭抽屉"
      :hide-cancel="true"
    >
      <iframe
        v-if="contactWayStore.preViewVisible"
        id="iframeid"
        height="600"
        :src="
          'https://scrm.superman.net.cn/h5/#/pages/index/index?qid=' +
          contactWayStore.recordObj.qId
        "
        frameborder="0"
      ></iframe>
    </a-drawer>
  </div>
</template>
