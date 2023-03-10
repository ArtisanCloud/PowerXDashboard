import { defineStore } from 'pinia';
import { Notification } from '@arco-design/web-vue';
import type { NotificationReturn } from '@arco-design/web-vue/es/notification/interface';
import type { RouteRecordNormalized } from 'vue-router';
import defaultSettings from '@/config/settings.json';
import { getMenuList, getMenuRoles } from '@/api/user';
import { menuRoutes } from '@/router/routes';
import { AppState } from './types';

const useAppStore = defineStore('app', {
  state: (): AppState => ({ ...defaultSettings }),

  getters: {
    appCurrentSetting(state: AppState): AppState {
      return { ...state };
    },
    appDevice(state: AppState) {
      return state.device;
    },
    appAsyncMenus(state: AppState): RouteRecordNormalized[] {
      return state.serverMenu as unknown as RouteRecordNormalized[];
    },
  },

  actions: {
    // Update app settings
    updateSettings(partial: Partial<AppState>) {
      // @ts-ignore-next-line
      this.$patch(partial);
    },

    // Change theme color
    toggleTheme(dark: boolean) {
      if (dark) {
        this.theme = 'dark';
        document.body.setAttribute('arco-theme', 'dark');
      } else {
        this.theme = 'light';
        document.body.removeAttribute('arco-theme');
      }
    },
    toggleDevice(device: string) {
      this.device = device;
    },
    toggleMenu(value: boolean) {
      this.hideMenu = value;
    },
    async fetchServerMenuConfig() {
      let notifyInstance: NotificationReturn | null = null;
      try {
        notifyInstance = Notification.info({
          id: 'menuNotice', // Keep the instance id the same
          content: 'loading',
          closable: true,
        });
        const { data } = await getMenuList();
        this.serverMenu = data;
        notifyInstance = Notification.success({
          id: 'menuNotice',
          content: 'success',
          closable: true,
        });
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        notifyInstance = Notification.error({
          id: 'menuNotice',
          content: 'error',
          closable: true,
        });
      }
    },
    clearServerMenu() {
      this.serverMenu = [];
    },
    async fetchServerMenuRoles() {
      let notifyInstance: NotificationReturn | null = null;
      try {
        const { data } = await getMenuRoles();
        const map = new Map(
          data.menuRoles.map((v) => {
            return [v.menuName, v.allowRoleCodes];
          })
        );
        const newMenus = menuRoutes;
        const setRoles = (menuRoute: RouteRecordNormalized) => {
          if (map.has(menuRoute.name as string)) {
            menuRoute.meta.roles = map.get(menuRoute.name as string);
          } else {
            menuRoute.meta.roles = undefined;
          }
          const rSet = new Set();
          if (
            menuRoute.children !== undefined &&
            menuRoute.children.length > 0
          ) {
            menuRoute.children.forEach((v: any) => {
              setRoles(v);
              v.meta?.roles?.forEach((r: string) => {
                rSet.add(r);
              });
            });
            menuRoute.meta?.roles?.forEach((r) => {
              rSet.add(r);
            });
            menuRoute.meta.roles = Array.from(rSet) as string[];
          }
        };
        newMenus.forEach((m) => {
          setRoles(m);
        });
        this.serverMenu = newMenus;
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        notifyInstance = Notification.error({
          id: 'menuNotice',
          content: 'error',
          closable: true,
        });
      }
    },
  },
});

export default useAppStore;
