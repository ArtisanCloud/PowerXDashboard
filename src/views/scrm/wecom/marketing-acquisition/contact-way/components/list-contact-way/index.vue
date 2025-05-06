<script setup lang="ts">
  import VueQR from 'vue-qr/src/packages/vue-qr.vue';
  import {
    ContactWayUrl,
    disableContactWay,
    enableContactWay,
  } from '@/api/scrm/wecom/marketing-acquisition/contact-way';
  import { Message } from '@arco-design/web-vue';
  import useContactWayStore from '@/store/modules/qrcode/contact-way';
  import useLoadingStore from '@/store/modules/loading';
  import { getTime } from '@/utils/dayjs';
  import styles from './index.module.less';

  const contactWayStore = useContactWayStore();
  const loadingStore = useLoadingStore();

  const handleEdit = (record: any) => {
    contactWayStore.title = '编辑活码';
    contactWayStore.recordObj = record;
    contactWayStore.visible = true;
  };
  const handlePreview = (record: any) => {
    contactWayStore.recordObj = record;
    contactWayStore.preViewVisible = true;
  };
  const handleDelete = (record: any) => {
    contactWayStore.recordObj = record;
    contactWayStore.fetchDeleteContactWay();
  };
  async function getContactWayState() {
    const ContactWayQid = contactWayStore.recordObj.qId;
    if (contactWayStore.recordObj.status === 1) {
      const res = await disableContactWay(ContactWayQid!);
      try {
        if (res.status) {
          Message.success('禁用成功');
          contactWayStore.fetchContactWayList();
        }
      } finally {
        Message.error('禁用失败');
      }
    } else if (contactWayStore.recordObj.status === 2) {
      const res = await enableContactWay(ContactWayQid!);
      try {
        if (res.status) {
          Message.success('启用成功');
          contactWayStore.fetchContactWayList();
        }
      } finally {
        loadingStore.setLoading(false);
      }
    }
  }
  const handleEnableContactWay = (record: any) => {
    contactWayStore.recordObj = record;
    getContactWayState();
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
    const picData: any = document.getElementById(`ContactWay${record.qid}`);
    const a = document.createElement('a');
    a.href = picData.src;
    saveImage(picData.src, 'ContactWay.png');
  };
  const pageChanged = (page: number) => {
    contactWayStore.pagination.currentPage = page;
    contactWayStore.contactWayParams.pageIndex = page;
    contactWayStore.fetchContactWayList();
  };
  const pageSizeChanged = (pageSize: number) => {
    contactWayStore.contactWayParams.pageSize = pageSize;
    contactWayStore.pagination.pageSize = pageSize;
    contactWayStore.fetchContactWayList();
  };
</script>

<template>
  <div :class="styles.container">
    <a-input-search
      :style="{ width: '320px', marginBottom: '20px' }"
      placeholder="搜索"
    />
    <div :class="styles.resultBox">
      <a-table
        :pagination="contactWayStore.pagination"
        :data="contactWayStore.contactWayList"
        :loading="loadingStore.loading"
        column-resizable
        scrollbar
        :bordered="{ cell: true }"
        @page-change="pageChanged"
        @page-size-change="pageSizeChanged"
      >
        <template #columns>
          <a-table-column
            title="活码名称"
            :width="80"
            data-index="RealContactWayLink"
            :ellipsis="true"
            :tooltip="true"
          >
            <template #cell="{ record }">
              <a-popover>
                <VueQR
                  :id="'ContactWay' + record.qid"
                  class="ContactWay"
                  logo-src="/logo.png"
                  :text="ContactWayUrl + '?qid=' + record.qid"
                  :size="300"
                ></VueQR>
                <template #content>
                  <VueQR
                    class="ContactWay1"
                    logo-src="/logo.png"
                    :text="ContactWayUrl + '?qid=' + record.qid"
                    :size="300"
                  ></VueQR>
                </template>
              </a-popover>
            </template>
          </a-table-column>
          <a-table-column
            title="可联系成员"
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
            title="类型"
            :width="100"
            data-index="cpa"
            :ellipsis="true"
            :tooltip="true"
          ></a-table-column>
          <a-table-column title="备注" :width="120">
            <template #cell="{ record }">
              <a-tag v-if="record.state === 1" color="#7bc616">启用</a-tag>
              <a-tag v-if="record.state === 2" color="#f53f3f">禁用</a-tag>
            </template>
          </a-table-column>
          <a-table-column
            fixed="right"
            title="操作"
            data-index="Mobile"
            :width="220"
          >
            <template #cell="{ record }">
              <a-link @click="handleEdit(record)"> 编辑 </a-link>
              <a-divider direction="vertical" />
              <a-link @click="handleDownload(record)"> 下载 </a-link>
              <a-divider v-if="record.state === 1" direction="vertical" />
              <a-link v-if="record.state === 1" @click="handlePreview(record)">
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
                @click="handleEnableContactWay(record)"
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
</template>

<style scoped></style>
