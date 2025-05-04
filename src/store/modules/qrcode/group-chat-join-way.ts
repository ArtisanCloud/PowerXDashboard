// src/stores/qrcode.ts
import { defineStore } from 'pinia';
import { Message } from '@arco-design/web-vue';
import useLoadingStore from '@/store/modules/loading';
import { SceneQRCode } from '@/api/scene';
import {
  GetGroupChatJoinWayListRequest,
  deleteGroupChatJoinWay,
  getGroupChatJoinWayList,
} from '@/api/scrm/wecom/marketing-acquisition/group-chat-join-way';

const loadingStore = useLoadingStore();

export interface GroupChatJoinWayState {
  visible: boolean;
  preViewVisible: boolean;
  title: string;
  groupChatJoinWayList: SceneQRCode[];
  pagination: any;
  groupChatJoinWayParams: GetGroupChatJoinWayListRequest;
  recordObj: SceneQRCode;
}

const useGroupChatJoinWayStore = defineStore('groupChatJoinWay', {
  state: (): GroupChatJoinWayState => ({
    visible: false,
    preViewVisible: false,
    title: '新增活码',
    groupChatJoinWayParams: {
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
    groupChatJoinWayList: [],
    recordObj: {},
  }),
  actions: {
    setVisible(val: boolean) {
      this.visible = val;
    },
    async fetchGroupChatJoinWayList() {
      const data = this.groupChatJoinWayParams;
      if (!this.groupChatJoinWayParams.status) {
        data.status = undefined;
      }
      loadingStore.setLoading(true);
      try {
        const res = await getGroupChatJoinWayList({
          ...data,
        });
        this.groupChatJoinWayList = res.data?.list;
        this.pagination.total = res.data?.total;
      } finally {
        loadingStore.setLoading(false);
      }
    },
    async fetchDeleteGroupChatJoinWay() {
      const recordQId = this.recordObj.qId;
      const res = await deleteGroupChatJoinWay(recordQId!);
      loadingStore.setLoading(true);
      try {
        if (res.status) {
          Message.success('删除成功');
          this.fetchGroupChatJoinWayList();
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

export default useGroupChatJoinWayStore;
