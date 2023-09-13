import type { Router, RouteRecordNormalized } from 'vue-router';
import NProgress from 'nprogress'; // 进度条

import usePermission from '@/hooks/permission';
import { useUserStore, useAppStore } from '@/store';
import { appRoutes } from '../routes';
import { WHITE_LIST, NOT_FOUND } from '../constants';

export default function setupPermissionGuard(router: Router) {
  // 在路由跳转之前执行的钩子函数
  router.beforeEach(async (to, from, next) => {
    const appStore = useAppStore();
    const userStore = useUserStore();
    const Permission = usePermission();
    const permissionsAllow = Permission.accessRouter(to);

    // 服务器菜单跳转逻辑
    const serverMenuNext = () => {
      // 合并服务器菜单和白名单
      const serverMenuConfig = [...appStore.appAsyncMenus, ...WHITE_LIST];

      let exist = false;
      // 检查目标路由是否存在于服务器菜单中
      while (serverMenuConfig.length && !exist) {
        const element = serverMenuConfig.shift();
        if (element?.name === to.name) exist = true;

        if (element?.children) {
          serverMenuConfig.push(
            ...(element.children as unknown as RouteRecordNormalized[])
          );
        }
      }
      // 如果目标路由存在且有权限访问，则跳转
      if (exist && permissionsAllow) {
        next();
      } else next(NOT_FOUND);
    };

    // 从服务器获取菜单配置
    if (appStore.menuFromServer) {
      if (
        !appStore.appAsyncMenus.length &&
        !WHITE_LIST.find((el) => el.name === to.name)
      ) {
        await appStore.fetchServerMenuConfig();
      }
      serverMenuNext();
    } else if (permissionsAllow) {
      // 如果有权限访问，则跳转
      next();
    } else {
      // 如果没有权限访问，则跳转到第一个有权限的路由或者 NOT_FOUND
      const destination =
        Permission.findFirstPermissionRoute(appRoutes, userStore.roles) ||
        NOT_FOUND;
      next(destination);
    }
    // 结束进度条
    NProgress.done();
  });
}
