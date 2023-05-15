import { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import { useUserStore } from '@/store';

export default function usePermission() {
  const userStore = useUserStore();

  function hasAccess(
    userRoles: string[] | undefined,
    routeRoles: string[]
  ): boolean {
    return (
      routeRoles.includes('*') ||
      routeRoles.some((role) => userRoles?.includes(role))
    );
  }

  function findAccessibleRoute(
    routes: RouteRecordRaw[],
    userRoles: string[]
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

  return {
    accessRouter(route: RouteLocationNormalized | RouteRecordRaw): boolean {
      const { account, roles } = userStore;

      return (
        account === 'root' ||
        !route.meta?.requiresAuth ||
        !route.meta?.roles ||
        hasAccess(roles, route.meta.roles)
      );
    },

    findFirstPermissionRoute(
      routers: RouteRecordRaw[],
      userRoles: string[] = []
    ): RouteRecordRaw | null {
      return findAccessibleRoute(routers, userRoles || userStore.roles);
    },
  };
}
