<script lang="ts" setup>
  import { onMounted, reactive, ref, toRaw } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import { listUsersPage } from '@/api/scrm/wecom/user';
  import useLoadingStore from '@/store/modules/loading';
  import VueQR from 'vue-qr/src/packages/vue-qr.vue';
  import {
    getQrcodeList,
    GetQrcodeRequest,
    deleteQrcode,
    enableQrcode,
    disableQrcode,
  } from '@/api/scrm/wecom/marketing-acquisition/contact-way';
  import EditQR from './components/edit-qr.vue';
  import styles from './index.module.less';

  const loadingStore = useLoadingStore();

  const qrcodeUrl = import.meta.env.VITE_BASE_QRCODE_URL;
  const state = reactive({
    visible: false,
    preViewVisible: false,
    title: '新增活码',
    recordObj: {
      qid: '',
      state: 1,
    },
  });
  const qrCodeParams = ref({
    userId: '',
    name: '',
    cursor: '',
    qid: '',
    state: '',
    pageIndex: 1,
    expiryState: '',
    pageSize: 10,
  } as GetQrcodeRequest);
  const usersList = reactive<any>({
    list: [],
  });
  const pagination = reactive({
    'total': 0,
    'currentPage': qrCodeParams.value.pageSize,
    'pageSize': qrCodeParams.value.pageSize,
    'show-total': true,
    'show-jumper': true,
    'show-page-size': true,
  });

  const customersList = reactive<any>({
    list: [],
  });
  async function fetchQRCodeList() {
    const data = qrCodeParams.value;
    if (!qrCodeParams.value.state) {
      data.state = undefined;
    }
    loadingStore.setLoading(true);
    try {
      const res = await getQrcodeList({
        ...data,
      });
      customersList.list = res.data?.list;
      pagination.total = res.data?.total;
    } finally {
      loadingStore.setLoading(false);
    }
  }
  async function fetchDeleteQrcode() {
    const recordQid = state.recordObj.qid;
    const res = await deleteQrcode(recordQid);
    loadingStore.setLoading(true);
    try {
      if (res.status) {
        Message.success('删除成功');
        fetchQRCodeList();
      }
    } finally {
      loadingStore.setLoading(false);
    }
  }
  const handleSubmit = () => {
    fetchQRCodeList();
  };
  const formData = toRaw({
    ...qrCodeParams.value,
  });
  const handleReset = () => {
    qrCodeParams.value = { ...formData };
    fetchQRCodeList();
  };
  const handleSendSuccess = () => {
    state.visible = false;
    fetchQRCodeList();
  };
  const handleAddQrcode = () => {
    state.title = '新增活码';
    state.recordObj = {
      qid: '',
      state: 1,
    };
    state.visible = true;
  };
  const handleEdit = (record: any) => {
    state.title = '编辑活码';
    state.recordObj = record;
    state.visible = true;
  };
  const handlePreview = (record: any) => {
    state.recordObj = record;
    state.preViewVisible = true;
  };
  const handleDelete = (record: any) => {
    state.recordObj = record;
    fetchDeleteQrcode();
  };
  async function getQrcodeState() {
    const qrcodeQid = state.recordObj.qid;
    if (state.recordObj.state === 1) {
      const res = await disableQrcode(qrcodeQid);
      try {
        if (res.status) {
          Message.success('禁用成功');
          fetchQRCodeList();
        }
      } finally {
        Message.error('禁用失败');
      }
    } else if (state.recordObj.state === 2) {
      const res = await enableQrcode(qrcodeQid);
      try {
        if (res.status) {
          Message.success('启用成功');
          fetchQRCodeList();
        }
      } finally {
        loadingStore.setLoading(false);
      }
    }
  }
  const handleEnableQrcode = (record: any) => {
    state.recordObj = record;
    getQrcodeState();
  };

  function saveImage(data: string, filename: string) {
    const saveLink: any = document.createElement('a');
    saveLink.style = 'display: none';
    saveLink.href = data;
    saveLink.download = filename;
    const event = document.createEvent('MouseEvents');
    event.initMouseEvent(
      'click',
      true,
      false,
      window,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null,
    );
    saveLink.dispatchEvent(event);
    setTimeout(() => {
      document.body.removeChild(saveLink);
    }, 500);
  }
  const handleDownload = (record: any) => {
    const picData: any = document.getElementById(`qrcode${record.qid}`);
    const a = document.createElement('a');
    a.href = picData.src;
    saveImage(picData.src, 'qrcode.png');
  };
  const pageChanged = (page: number) => {
    pagination.currentPage = page;
    qrCodeParams.value.pageIndex = page;
    fetchQRCodeList();
  };
  const pageSizeChanged = (pageSize: number) => {
    qrCodeParams.value.pageSize = pageSize;
    pagination.pageSize = pageSize;
    fetchQRCodeList();
  };
  async function fetchUsers() {
    const res = await listUsersPage({});
    try {
      usersList.list = res.data?.list;
    } catch (err) {
      usersList.list = [];
    }
  }
  function getTime(timestamp: number): string {
    const date = new Date(timestamp);
    const Y = date.getFullYear();
    const M =
      date.getMonth() + 1 < 10
        ? `0${date.getMonth() + 1}`
        : date.getMonth() + 1;
    const D = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    return `${Y} - ${M} - ${D}`;
  }
  onMounted(() => {
    fetchQRCodeList();
    fetchUsers();
  });
</script>

<template>
  <div :class="styles.container">
    <div :class="styles.titleBox"
      ><span :class="styles.title">联系我</span></div
    >
    <div :class="styles.mainBox">
      <div :class="styles.filter">
        <a-form
          :model="qrCodeParams"
          layout="vertical"
          auto-label-width
          @submit="handleSubmit"
        >
          <a-space>
            <a-form-item label-width="0">
              <a-input
                v-model="qrCodeParams.name"
                allow-clear
                placeholder="请输入场景码标题"
              />
            </a-form-item>
            <a-form-item label-width="0">
              <a-select
                v-model="qrCodeParams.state"
                :style="{ width: '200px' }"
                placeholder="请选择场景码状态"
                allow-clear
              >
                <a-option :value="1">启用</a-option>
                <a-option :value="2">禁用</a-option>
              </a-select>
            </a-form-item>
            <a-form-item label-width="0">
              <a-select
                v-model="qrCodeParams.userId"
                allow-search
                :style="{ width: '200px' }"
                placeholder="请选择员工"
                allow-clear
              >
                <a-option
                  v-for="(item, index) in usersList.list"
                  :key="index"
                  :value="item.WeComUserId"
                  >{{ item.name }}</a-option
                >
              </a-select>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" html-type="submit">搜索</a-button>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="handleReset">重置</a-button>
            </a-form-item>
          </a-space>
        </a-form>
      </div>
      <div :class="styles.actionBox">
        <a-button type="primary" @click="handleAddQrcode">新增活码</a-button>
      </div>

      <div :class="styles.resultBox">
        <a-table
          :pagination="pagination"
          :data="customersList.list"
          :loading="loadingStore.loading"
          column-resizable
          scrollbar
          :bordered="{ cell: true }"
          @page-change="pageChanged"
          @page-size-change="pageSizeChanged"
        >
          <template #columns>
            <a-table-column title="序号" :width="70">
              <template #cell="{ rowIndex }">
                {{ rowIndex + 1 }}
              </template>
            </a-table-column>
            <a-table-column
              title="场景码标题"
              data-index="name"
              :width="200"
              :ellipsis="true"
              :tooltip="true"
            ></a-table-column>
            <a-table-column
              title="场景码"
              :width="200"
              data-index="RealQrcodeLink"
              :ellipsis="true"
              :tooltip="true"
            >
              <template #cell="{ record }">
                <a-popover>
                  <VueQR
                    :id="'qrcode' + record.qid"
                    class="qrcode"
                    logo-src="/logo.png"
                    :text="qrcodeUrl + '?qid=' + record.qid"
                    :size="300"
                  ></VueQR>
                  <template #content>
                    <vue-qr
                      class="qrcode1"
                      logo-src="/logo.png"
                      :text="qrcodeUrl + '?qid=' + record.qid"
                      :size="300"
                    ></vue-qr>
                  </template>
                </a-popover>
              </template>
            </a-table-column>
            <a-table-column
              title="使用员工"
              :width="200"
              :ellipsis="true"
              :tooltip="true"
            >
              <template #cell="{ record }">
                <template v-if="record && record.owner.length > 0">
                  {{ record.owner.join(',') }}
                </template>
              </template>
            </a-table-column>
            <a-table-column
              title="累计访问次数"
              :width="120"
              data-index="cpa"
              :ellipsis="true"
              :tooltip="true"
            ></a-table-column>
            <a-table-column title="二维码到期时间" :width="150">
              <template #cell="{ record }">
                <span>{{ getTime(record.expiryDate) }}</span>
              </template>
            </a-table-column>
            <a-table-column title="场景码状态" :width="120">
              <template #cell="{ record }">
                <a-tag v-if="record.state === 1" color="#7bc616">启用</a-tag>
                <a-tag v-if="record.state === 2" color="#f53f3f">禁用</a-tag>
              </template>
            </a-table-column>
            <a-table-column title="二维码状态" :width="120">
              <template #cell="{ record }">
                <a-tag v-if="record.expiryState > 0" color="#7bc616"
                  >正常</a-tag
                >
                <a-tag v-if="record.expiryState === 0" color="#f53f3f"
                  >过期</a-tag
                >
              </template>
            </a-table-column>
            <a-table-column
              title="描述信息"
              data-index="desc"
              :width="200"
              :ellipsis="true"
              :tooltip="true"
            ></a-table-column>
            <a-table-column
              fixed="right"
              title="操作"
              data-index="Mobile"
              :width="320"
            >
              <template #cell="{ record }">
                <a-link @click="handleEdit(record)"> 编辑 </a-link>
                <a-divider direction="vertical" />
                <a-link @click="handleDownload(record)"> 下载 </a-link>
                <a-divider v-if="record.state === 1" direction="vertical" />
                <a-link
                  v-if="record.state === 1"
                  @click="handlePreview(record)"
                >
                  预览
                </a-link>
                <a-divider direction="vertical" />
                <a-link>
                  <a-popconfirm
                    content="确定要删除当前活码？"
                    type="warning"
                    @ok="handleDelete(record)"
                  >
                    <span>删除</span>
                  </a-popconfirm>
                </a-link>
                <a-divider
                  v-if="record.state === 1 || record.state === 2"
                  direction="vertical"
                />
                <a-link
                  v-if="record.state === 1 || record.state === 2"
                  @click="handleEnableQrcode(record)"
                >
                  <span v-if="record.state === 1">禁用</span>
                  <span v-if="record.state === 2">启用</span>
                </a-link>
              </template>
            </a-table-column>
          </template>
        </a-table>
      </div>
    </div>
    <a-drawer
      v-model:visible="state.visible"
      width="500px"
      ok-text="关闭抽屉"
      :title="state.title"
      :hide-cancel="true"
    >
      <EditQR
        :users-list="usersList.list"
        :edit-data="state.recordObj"
        @submit-success="handleSendSuccess"
      ></EditQR>
    </a-drawer>
    <a-drawer
      v-model:visible="state.preViewVisible"
      width="375px"
      ok-text="关闭抽屉"
      :hide-cancel="true"
    >
      <iframe
        v-if="state.preViewVisible"
        id="iframeid"
        height="600"
        :src="
          'https://scrm.superman.net.cn/h5/#/pages/index/index?qid=' +
          state.recordObj.qid
        "
        frameborder="0"
      ></iframe>
    </a-drawer>
  </div>
</template>
