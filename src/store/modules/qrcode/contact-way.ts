// src/stores/qrcode.ts
import { defineStore } from 'pinia';
import {
  deleteContactWay,
  getContactWayList,
  GetContactWayListRequest,
} from '@/api/scrm/wecom/marketing-acquisition/contact-way';
import { Message } from '@arco-design/web-vue';
import useLoadingStore from '@/store/modules/loading';
import { SceneQRCode } from '@/api/scene';

const loadingStore = useLoadingStore();

export interface ContactWayState {
  visible: boolean;
  preViewVisible: boolean;
  title: string;
  contactWayList: SceneQRCode[];
  pagination: any;
  contactWayParams: GetContactWayListRequest;
  recordObj: SceneQRCode;
}

const useContactWayStore = defineStore('contactWay', {
  state: (): ContactWayState => ({
    visible: false,
    preViewVisible: false,
    title: '新增活码',
    contactWayParams: {
      userId: '',
      name: '',
      // cursor: '',
      qId: '',
      status: '',
      pageIndex: 1,
      pageSize: 10,
    },
    pagination: {
      'total': 0,
      'currentPage': 1,
      'pageSize': 10,
      'show-total': true,
      'show-jumper': true,
      'show-page-size': true,
    },
    contactWayList: [],
    recordObj: {},
  }),
  actions: {
    setVisible(val: boolean) {
      this.visible = val;
    },
    async fetchContactWayList() {
      const data = this.contactWayParams;
      if (!this.contactWayParams.status) {
        data.status = undefined;
      }
      loadingStore.setLoading(true);
      try {
        const res = await getContactWayList({
          ...data,
        });
        this.contactWayList = res.data?.list;
        this.pagination.total = res.data?.total;
      } finally {
        loadingStore.setLoading(false);
      }
    },
    async fetchDeleteContactWay() {
      const recordQId = this.recordObj.qId;
      const res = await deleteContactWay(recordQId!);
      loadingStore.setLoading(true);
      try {
        if (res.status) {
          Message.success('删除成功');
          this.fetchContactWayList();
        }
      } finally {
        loadingStore.setLoading(false);
      }
    },
    setPreViewVisible(val: boolean) {
      this.preViewVisible = val;
    },
    setTitle(val: string) {
      this.title = val;
    },
    setRecordObj(obj: SceneQRCode) {
      this.recordObj = { ...obj };
    },
    resetRecordObj() {
      this.recordObj = {
        qId: '',
        status: 1,
      };
    },
  },
});

export default useContactWayStore;
