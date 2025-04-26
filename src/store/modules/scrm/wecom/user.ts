import { defineStore } from 'pinia';
import {
  getWeComDepartment,
  WeComDepartment,
} from '@/api/scrm/wecom/department';
import { Message } from '@arco-design/web-vue';
import { listUsersPage, WeComUser } from '@/api/scrm/wecom/user';
import {
  getWeComTagPageList,
  WeComTag,
  WeComTagTypeTag,
} from '@/api/scrm/wecom/tag/tag';

export type ViewType = 'department' | 'tag';

interface UserState {
  departmentTree: WeComDepartment[];
  tagList: WeComTag[];
  userList: WeComUser[];
  selectedDepartmentId: number;
  selectedDepartmentIds: number[];
  selectedTag: number | null;
  selectedViewType: ViewType;
  showCreateDepartmentModal: boolean;
}

const useWeComUserStore = defineStore('weComUser', {
  state: (): UserState => ({
    departmentTree: [],
    tagList: [],
    userList: [],
    selectedDepartmentId: 1,
    selectedDepartmentIds: [],
    selectedTag: null,
    selectedViewType: 'department',
    // selectedViewType: 'tag',
    showCreateDepartmentModal: false,
  }),
  actions: {
    setDepartmentTree(tree: WeComDepartment) {
      this.departmentTree = [tree];
    },
    setTagList(list: WeComTag[]) {
      this.tagList = list;
    },
    setUserList(list: WeComUser[]) {
      this.userList = list;
    },
    setSelectedDepartment(departmentId: number) {
      this.selectedDepartmentId = departmentId;
      // 清空 selectedDepartmentIds 数组，只保留当前选中的部门 ID
      this.selectedDepartmentIds = [departmentId];

      // 遍历 departmentTree 中的所有部门
      const findDepartments = (departments: WeComDepartment[]) => {
        departments.forEach((department) => {
          // 检查当前部门的 weComParentId 是否与 selectedDepartmentId 匹配
          if (department.weComParentId === this.selectedDepartmentId) {
            // 如果匹配，将部门的 ID 添加到 selectedDepartmentIds 中
            this.selectedDepartmentIds.push(department.weComDepId);
          }

          // 如果有子部门，递归调用 findDepartments 处理子部门
          if (department.children && department.children.length > 0) {
            findDepartments(department.children);
          }
        });
      };

      // 启动查找
      findDepartments(this.departmentTree);
    },
    setSelectedTag(id: number) {
      this.selectedTag = id;
    },
    setSelectedViewType(type: ViewType) {
      // console.log('setSelectedViewType', type);
      this.selectedViewType = type;
    },
    async loadDepartmentTree(departmentId: number) {
      const res = await getWeComDepartment({ departmentId });
      if (res.data) {
        this.departmentTree = [res.data.department];
      } else {
        Message.error('获取部门信息失败');
      }
    },
    async loadTagList() {
      const res = await getWeComTagPageList({
        tagType: WeComTagTypeTag,
        pageIndex: 1,
        pageSize: 100,
      });
      if (res.data) {
        this.tagList = res.data.list;
      } else {
        Message.error('获取企微标签列表失败');
      }
    },
    async loadUsersByDepartmentId(departmentId: number) {
      const res = await listUsersPage({ departmentId });
      if (res.data) {
        this.userList = res.data.list;
      } else {
        Message.error('获取部门用户列表失败');
      }
    },
    async loadUsersByDepartmentIds(departmentIds: number[]) {
      const res = await listUsersPage({ departmentIds });
      if (res.data) {
        this.userList = res.data.list;
      } else {
        Message.error('获取部门用户列表失败');
      }
    },
  },
});

export default useWeComUserStore;
