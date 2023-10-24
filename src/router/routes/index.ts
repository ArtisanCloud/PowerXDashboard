import type { RouteRecordNormalized } from 'vue-router';
import { EMPTY_LAYOUT_TAG } from '@/router/constants';
import { cloneDeep } from 'lodash';
import { getSeverPluginRoutes } from '@/api/plugin';
import { BuildPluginRoutes } from '@/utils/plugin';

const modules = import.meta.globEager('./modules/*.ts');
const externalModules = import.meta.globEager('./externalModules/*.ts');

// 嵌套EMPTY_LAYOUT路由处理, 该操作是为了适配用于缓存的顶层RouteView, 支持路由嵌套children
function filterEmptyRoute(moduleRoute: any) {
  // 如果一个路由的component是EMPTY_LAYOUT_TAG，那么这个路由是空路由, 从叶子向上递归提取children到EMPTY_LAYOUT路由同级别
  const upEmptyLayoutChildren = (route: any) => {
    const { children } = route;
    delete route.children;
    return [route, ...children];
  };

  const deepFilterChildren = (routes: any[]) => {
    const result: any[] = [];
    routes.forEach((route) => {
      if (route.children) {
        route.children = deepFilterChildren(route.children);
        if (route.component.name === EMPTY_LAYOUT_TAG) {
          result.push(...upEmptyLayoutChildren(route));
        } else {
          result.push(route);
        }
      } else {
        result.push(route);
      }
    });
    return result;
  };

  moduleRoute.children = deepFilterChildren(moduleRoute.children);
  return moduleRoute;
}

// 将ModuleRoutes转换为框架应用使用的Routes
function formatModules(_modules: any, result: RouteRecordNormalized[]) {
  Object.keys(_modules).forEach((key) => {
    let defaultModule = cloneDeep(_modules[key].default);
    if (!defaultModule) return;

    defaultModule = filterEmptyRoute(defaultModule);
    const moduleList = Array.isArray(defaultModule)
      ? [...defaultModule]
      : [defaultModule];
    result.push(...moduleList);
  });
  return result;
}

// 将ModuleRoutes转换为菜单使用的Routes
function formatModulesForMenu(_modules: any, result: RouteRecordNormalized[]) {
  Object.keys(_modules).forEach((key) => {
    const defaultModule = _modules[key].default;
    if (!defaultModule) return;

    const moduleList = Array.isArray(defaultModule)
      ? [...defaultModule]
      : [defaultModule];
    result.push(...moduleList);
  });
  return result;
}

// 框架应用使用的Routes
export const appRoutes: RouteRecordNormalized[] = formatModules(modules, []);

// 用于显示菜单的Route列表
export const menuRoutes: RouteRecordNormalized[] = formatModulesForMenu(
  modules,
  [],
);

export const appExternalRoutes: RouteRecordNormalized[] = formatModules(
  externalModules,
  [],
);

export async function loadPluginRoutes(router: any) {
  const insertPluginRoutes = (routes: any) => {
    const pluginRoute = cloneDeep(
      router.getRoutes().find((route: any) => route.name === 'Plugin'),
    );
    if (!pluginRoute) return;
    pluginRoute.children = BuildPluginRoutes(routes as any) as any[];

    menuRoutes.forEach((route) => {
      if (route.name === 'Plugin') {
        route.children = pluginRoute.children;
      }
    });

    // -tmp
    setTimeout(() => {
      router.removeRoute(pluginRoute.name as string);
      router.addRoute(pluginRoute);
    }, 2000);
  };
  // find from session storage
  const cacheRoutes = sessionStorage.getItem('plugin-routes');
  if (cacheRoutes) {
    insertPluginRoutes(JSON.parse(cacheRoutes));
  } else {
    getSeverPluginRoutes().then((res) => {
      const { routes } = res.data;
      if (routes) {
        sessionStorage.setItem('plugin-routes', JSON.stringify(routes));
        insertPluginRoutes(routes);
      }
    });
  }
}
