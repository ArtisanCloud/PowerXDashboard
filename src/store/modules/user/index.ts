import { defineStore } from 'pinia';
import { clearToken, setToken } from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import { getUserInfo } from '@/api/userinfo';
import { login, LoginRequest } from '@/api/auth';
import { clearSessionStorage } from '@/utils/storage';
import { UserState } from './types';
import useAppStore from '../app';

const sessionPrefix = 'user';

function formatSessionKey(key: string) {
  return `${sessionPrefix}:${key}`;
}

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    id: undefined,
    account: undefined,
    name: undefined,
    email: undefined,
    mobilePhone: undefined,
    gender: undefined,
    nickName: undefined,
    desc: undefined,
    avatar: undefined,
    externalEmail: undefined,
    depIds: undefined,
    roles: [],
    position: undefined,
    jobTitle: undefined,
    isEnabled: undefined,
    createdAt: undefined,
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    },
  },

  actions: {
    setInfo(partial: Partial<UserState>) {
      this.$patch(partial);
    },

    resetInfo() {
      this.$reset();
    },

    async info() {
      // 首先查询 session storage 中是否有缓存
      const cachedData = sessionStorage.getItem(formatSessionKey('user-info'));
      if (cachedData) {
        this.setInfo(JSON.parse(cachedData));
        return;
      }
      const res = await getUserInfo();
      this.setInfo(res.data);
      // 缓存到 session storage 中
      sessionStorage.setItem(
        formatSessionKey('user-info'),
        JSON.stringify(res.data)
      );
    },

    async login(loginForm: LoginRequest) {
      try {
        const res = await login(loginForm);
        setToken(res.data.token);
      } catch (err) {
        clearToken();
        throw err;
      }
    },

    logoutCallBack() {
      const appStore = useAppStore();
      removeRouteListener();
      this.resetInfo();
      appStore.clearServerMenu();
      clearSessionStorage();
      clearToken();
    },

    async logout() {
      try {
        // 在这里添加登出 API 调用
        // const res = await logout();
      } finally {
        this.logoutCallBack();
      }
    },
  },
});

export default useUserStore;
