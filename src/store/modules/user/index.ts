import { defineStore } from 'pinia';
import { clearToken, setToken } from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import { getUserInfo } from '@/api/userinfo';
import { login, LoginRequest } from '@/api/auth';
import { UserState } from './types';
import useAppStore from '../app';

const useUserStore = defineStore('user', {
  state: (): UserState =>
    ({
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
    } as UserState),

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    },
  },

  actions: {
    // Set user's information
    setInfo(partial: Partial<UserState>) {
      this.$patch(partial);
    },

    // Reset user's information
    resetInfo() {
      this.$reset();
    },

    // Get user's information
    async info() {
      const res = await getUserInfo();
      this.setInfo(res.data);
    },

    // Login
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
      this.resetInfo();
      clearToken();
      removeRouteListener();
      appStore.clearServerMenu();
    },
    // Logout
    async logout() {
      try {
        // todo logout
      } finally {
        this.logoutCallBack();
      }
    },
  },
});

export default useUserStore;
