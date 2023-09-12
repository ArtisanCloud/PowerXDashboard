import { getMenuRoles } from '@/api/userinfo';
import { RouteRecordNormalized } from 'vue-router';
import { appRoutes } from '@/router/routes';
import router from '@/router';

const sessionPrefix = 'menu';

function formatSessionKey(key: string) {
  return `${sessionPrefix}:${key}`;
}

export default async function withRoleClientMenu(clientMenus: any[]) {
  let menuRoles: any[] = [];
  // 检查 sessionStorage 中是否存在菜单角色缓存
  const menuRolesCache = sessionStorage.getItem(formatSessionKey('menu-roles'));
  if (menuRolesCache) {
    menuRoles = JSON.parse(menuRolesCache);
  } else {
    const { data } = await getMenuRoles();
    menuRoles = data.menuRoles;
  }
  if (!menuRoles || menuRoles.length === 0) {
    return clientMenus;
  }

  const map = new Map(menuRoles.map((v) => [v.menuName, v.allowRoleCodes]));

  const setRoles = (menuRoute: RouteRecordNormalized) => {
    const menuName = menuRoute.name as string;
    if (map.has(menuName)) {
      menuRoute.meta.roles = map.get(menuName);
    } else {
      menuRoute.meta.roles = [];
    }
    const rSet = new Set();
    if (menuRoute.children && menuRoute.children.length > 0) {
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

  // 为客户端菜单添加角色
  const withRoleClientMenus = clientMenus.map((m) => {
    setRoles(m);
    return m;
  }, []);

  // 为已存在的路由添加角色
  appRoutes.forEach((m) => {
    setRoles(m);
    router.addRoute(m);
  });

  // 缓存菜单角色
  sessionStorage.setItem(
    formatSessionKey('menu-roles'),
    JSON.stringify(menuRoles)
  );

  return withRoleClientMenus;
}