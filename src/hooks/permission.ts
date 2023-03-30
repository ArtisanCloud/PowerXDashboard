import { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import { useUserStore } from '@/store';
import { WHITE_LIST } from '@/router/constants';

export default function usePermission() {
  const userStore = useUserStore();
  return {
    accessRouter(route: RouteLocationNormalized | RouteRecordRaw) {
      console.log(JSON.stringify(userStore.userInfo));
      return (
        // root 特殊放行
        userStore.account === 'root' ||
        !route.meta?.requiresAuth ||
        !route.meta?.roles ||
        route.meta?.roles?.includes('*') ||
        route.meta?.roles?.filter((v) => {
          return userStore.roles?.includes(v);
        }).length > 0
      );
    },
    findFirstPermissionRoute(_routers: any, userRoles: string[] = []) {
      const cloneRouters = [..._routers];
      while (cloneRouters.length) {
        const firstElement = cloneRouters.shift();
        if (
          firstElement?.meta?.roles?.find((el: string[]) => {
            return (
              el.includes('*') ||
              el.filter((v) => {
                return userRoles.includes(v);
              }).length > 0
            );
          })
        )
          return { name: firstElement.name };
        if (firstElement?.children) {
          cloneRouters.push(...firstElement.children);
        }
      }
      return null;
    },
    // You can add any rules you want
  };
}
