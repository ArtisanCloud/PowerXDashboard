export const GetAllPermissionModulesInSameLayer = (
  data: API.Menu[],
): API.Menu[] => {
  return data.map((item: API.Menu) => {
    if (item.children) {
      const newChildren = GetAllPermissionModulesInSameLayer(item.children);
      return {
        ...item,
        children: newChildren.length > 0 ? newChildren : undefined,
      };
    }
    return item;
  }) as API.Menu[];
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
