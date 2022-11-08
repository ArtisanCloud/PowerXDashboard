import { MenuSelection } from '@/pages/Setting/Menu/typing';

export const GetAllPermissionModulesInSameLayer = (
  data: API.Menu[],
): API.Menu[] => {
  if (!data || data.length === 0) {
    return [];
  }

  let menus: API.Menu[] = [];
  for (const menu of data) {
    menus.push(menu);
    if (menu.children) {
      const newChildren = GetAllPermissionModulesInSameLayer(menu.children);
      // console.log("newChildren",newChildren)
      menus = [...menus, ...newChildren];
    }
  }
  return menus;
};

export const GetParentPermissionModule = (
  data: API.Menu[],
  parentID: string,
): API.Menu | undefined => {
  const allMenus: API.Menu[] = GetAllPermissionModulesInSameLayer(data);
  for (const menu of allMenus) {
    if (menu.permissionModuleID === parentID) {
      return menu;
    }
  }

  return undefined;
};

export const GetMenuSelections = (data: API.Menu[]): MenuSelection[] => {
  let menus: MenuSelection[] = [];
  for (const menu of data) {
    const selection: MenuSelection = {
      title: menu.name,
      value: menu.permissionModuleID,
      children: GetMenuSelections(menu.children),
    };
    menus.push(selection);
  }
  return menus;
};
