import { defineStore } from 'pinia';
import { getDepartment, WeComDepartment } from '@/api/scrm/wecom/department';
import { Message } from '@arco-design/web-vue';

type TagTree = any;
type UserList = any;

export type ViewType = 'department' | 'tag';

interface UserState {
  departmentTree: WeComDepartment | null;
  tagTree: TagTree | null;
  userList: UserList | null;
  selectedDepartment: number | null;
  selectedTag: number | null;
  selectedViewType: ViewType;
}

const useWeComUserStore = defineStore('weComUser', {
  state: (): UserState => ({
    departmentTree: null,
    tagTree: null,
    userList: null,
    selectedDepartment: null,
    selectedTag: null,
    selectedViewType: 'department',
  }),
  actions: {
    setDepartmentTree(tree: WeComDepartment) {
      this.departmentTree = tree;
    },
    setTagTree(tree: TagTree) {
      this.tagTree = tree;
    },
    setUserList(list: UserList) {
      this.userList = list;
    },
    setSelectedDepartment(id: number) {
      this.selectedDepartment = id;
    },
    setSelectedTag(id: number) {
      this.selectedTag = id;
    },
    setSelectedViewType(type: ViewType) {
      // console.log('setSelectedViewType', type);
      this.selectedViewType = type;
    },
    async loadDepartmentTree(departmentId: number) {
      const res = await getDepartment({ departmentId });
      if (res.data) {
        this.departmentTree = res.data.department;
      } else {
        Message.error('获取部门信息失败');
      }
    },
    async loadCurrentUserByDepartmentId(departmentId: number) {
      const res = await getDepartment({ departmentId });
    },
  },
});

export default useWeComUserStore;
