import { defineStore } from 'pinia';

type DepartmentTree = any;
type TagTree = any;
type UserList = any;

export type ViewType = 'department' | 'tag';

interface UserState {
  departmentTree: DepartmentTree | null;
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
    setDepartmentTree(tree: DepartmentTree) {
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
  },
});

export default useWeComUserStore;
