import { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import { useUserStore } from '@/store';

export default function usePermission() {
  const userStore = useUserStore();

  // 检查用户是否具有访问特定路由的权限
  function hasAccess(
    userRoles: string[] | undefined,
    routeRoles: string[],
  ): boolean {
    return (
      routeRoles.includes('*') ||
      routeRoles.some((role) => userRoles?.includes(role))
    );
  }

  // 在给定的路由列表中查找用户可以访问的第一个路由
  function findAccessibleRoute(
    routes: RouteRecordRaw[],
    userRoles: string[],
  ): RouteRecordRaw | null {
    return routes.reduce((route) => {
      if (route.children) {
        const foundRoute = findAccessibleRoute(route.children, userRoles);
        if (foundRoute) return foundRoute;
      }

      if (route.meta?.roles && hasAccess(userRoles, route.meta.roles)) {
        return route;
      }

      return null;
    }, null as any);
  }

  // 返回一个对象，包含两个方法：accessRouter 和 findFirstPermissionRoute
  return {
    // 检查用户是否具有访问特定路由的权限
    accessRouter(route: RouteLocationNormalized | RouteRecordRaw): boolean {
      const { account, roles } = userStore;

      return (
        account === 'root' ||
        !route.meta?.requiresAuth ||
        !route.meta?.roles ||
        hasAccess(roles, route.meta.roles)
      );
    },

    // 在给定的路由列表中查找用户可以访问的第一个路由
    findFirstPermissionRoute(
      routers: RouteRecordRaw[],
      userRoles: string[] = [],
    ): RouteRecordRaw | null {
      return findAccessibleRoute(routers, userRoles || userStore.roles);
    },
  };
}
