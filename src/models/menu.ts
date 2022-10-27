import { MenuDataItem } from '@ant-design/pro-layout';
import { useEffect, useState } from 'react';
import { QueryMenuList } from '@/services/boot/BootController';
import { API_RETURN_CODE_INIT } from '@/constants/api';
import { message } from 'antd';

export let globalMenuData: MenuDataItem[] = [];

export function ParseRoutes(menus: API.Menu[]) {
  let authRoutes = [];
  if (menus) {
    for (const routeModule of menus) {
      for (const subRouteModule of routeModule.children) {
        for (const route of subRouteModule.children) {
          // console.log(route.uri);
          authRoutes.push({
            name: route.name,
            path: route.uri,
            component: '@/pages' + route.component,
            // disabled: true,
          });
        }
      }
    }
  }
  return authRoutes;
}

export const UseMenu = () => {
  const [menuData, setMenuData] = useState<MenuDataItem[]>(globalMenuData);

  const updateGlobalMenuData = (val: MenuDataItem[]) => {
    globalMenuData = val;
    setMenuData(val);
  };

  useEffect(() => {
    const HandleLoadMenuData = async () => {
      // 检查加载后台的菜单数据
      const rs: API.ResponseMenuList = await QueryMenuList();
      if (rs.meta.return_code === API_RETURN_CODE_INIT) {
        // console.log(rs.data)
        let localMenuData = ParseRoutes(rs.data);

        // set status
        updateGlobalMenuData(localMenuData);
      } else {
        message.error(rs.meta.result_message);
        return;
      }
    };

    // 加载后台的菜单数据
    HandleLoadMenuData().catch((e) => {
      console.error('HandleLoadMenuData', e);
    });

    // 返回值
    return () => {};
  }, []);

  return {
    menuData,
    updateGlobalMenuData,
  };
};
