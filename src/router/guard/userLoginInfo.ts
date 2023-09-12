import type { Router, LocationQueryRaw } from 'vue-router';
import NProgress from 'nprogress'; // progress bar

import { useOptionsStore, useUserStore } from '@/store';
import { isLogin } from '@/utils/auth';

export default function setupUserLoginInfoGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start();
    const userStore = useUserStore();
    const optionsStore = useOptionsStore();
    if (isLogin()) {
      const checkInfo = async () => {
        if (userStore.id !== undefined) {
          return true;
        }
        try {
          await userStore.info();
          return true;
        } catch (error) {
          await userStore.logout();
          return false;
        }
      };

      if (!(await checkInfo())) {
        next({
          name: 'Login',
          query: {
            redirect: to.name,
            ...to.query,
          } as LocationQueryRaw,
        });
        return;
      }

      // 登陆后获取全局选项
      if (!optionsStore.isSetup()) {
        await optionsStore.fetchAllOptions();
      }

      next();
    } else {
      if (to.name === 'Login') {
        next();
        return;
      }
      next({
        name: 'Login',
        query: {
          redirect: to.name,
          ...to.query,
        } as LocationQueryRaw,
      });
    }
  });
}
