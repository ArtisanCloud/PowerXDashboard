import type { RouteRecordNormalized } from 'vue-router';
import { EMPTY_LAYOUT_TAG } from '@/router/constants';
import { cloneDeep } from 'lodash';

const modules = import.meta.globEager('./modules/*.ts');
const externalModules = import.meta.globEager('./externalModules/*.ts');

function FilterEmptyRoute(moduleRoute: any): any {
  function deepFilterChildren(route: any): any[] {
    const newChildren = [] as any[];
    if (route.children !== undefined && route.children.length > 0) {
      route.children.forEach((c1: any) => {
        if (
          c1.component.name === EMPTY_LAYOUT_TAG &&
          c1.children !== undefined
        ) {
          // EmptyLayout 返回其 children
          c1.children.forEach((c2: any) => {
            if (c2.children !== undefined) {
              c2.children = deepFilterChildren(c2);
            }
            newChildren.push(c2);
          });
          c1.children = undefined;
          newChildren.push(c1);
        } else {
          // 非 EmptyLayout 返回其自身
          if (c1.children !== undefined) {
            c1.children = deepFilterChildren(c1);
          }
          newChildren.push(c1);
        }
      });
    }

    return newChildren;
  }

  return deepFilterChildren(moduleRoute);
}

function formatModules(_modules: any, result: RouteRecordNormalized[]) {
  Object.keys(_modules).forEach((key) => {
    const defaultModule = cloneDeep(_modules[key].default);
    if (!defaultModule) return;

    defaultModule.children = FilterEmptyRoute(defaultModule);

    const moduleList = Array.isArray(defaultModule)
      ? [...defaultModule]
      : [defaultModule];
    result.push(...moduleList);
  });
  return result;
}

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

export const appRoutes: RouteRecordNormalized[] = formatModules(modules, []);

export const menuRoutes: RouteRecordNormalized[] = formatModulesForMenu(
  modules,
  []
);

export const appExternalRoutes: RouteRecordNormalized[] = formatModules(
  externalModules,
  []
);
