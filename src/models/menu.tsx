import { MenuDataItem } from '@ant-design/pro-layout';
import { useEffect, useState } from 'react';
import { QueryMenuList } from '@/services/boot/BootController';
import { API_RETURN_CODE_INIT } from '@/constants/api';
import { message } from 'antd';
import { SmileOutlined } from '@ant-design/icons';

export let globalMenuData: MenuDataItem[] = [];
export let globalMenus: API.Menu[] = [];

export function ParseRoutes(menus: API.Menu[]) {
  let authRoutes: MenuDataItem[] = [];
  if (menus) {
    globalMenus = menus;
    for (const routeModule of menus) {
      let firstMenu: MenuDataItem = {
        name: routeModule.name,
        path: routeModule.uri,
        icon: routeModule.icon,
        children: [],
      };
      for (const subRouteModule of routeModule.children) {
        let secondMenu: MenuDataItem = {
          name: subRouteModule.name,
          path: subRouteModule.uri,
          icon: subRouteModule.icon,
          children: [],
          disabled: true,
        };
        if (subRouteModule.children.length === 0) {
          secondMenu.disabled = false;
        }

        for (const route of subRouteModule.children) {
          const menu: MenuDataItem = {
            name: route.name,
            path: route.uri,
            // icon: route.icon,
            icon: <SmileOutlined />,
            component: '@/pages' + route.component,
            disabled: false,
          };
          // console.log(menu)
          secondMenu.children!.push(menu);
        }
        firstMenu.children!.push(secondMenu);
      }
      authRoutes.push(firstMenu);
    }
  }

  return authRoutes;
}

export const UseMenus = () => {
  const [menus, setMenus] = useState<API.Menu[]>(globalMenus);

  return {
    menus,
    setMenus,
  };
};

export const UseMenuData = () => {
  const [menuData, setMenuData] = useState<MenuDataItem[]>(globalMenuData);
  const { setMenus } = UseMenus();
  const updateGlobalMenuData = (val: MenuDataItem[]) => {
    globalMenuData = val;
    setMenuData(val);
  };

  useEffect(() => {
    const HandleLoadMenuData = async () => {
      // 检查加载后台的菜单数据
      const rs: API.ResponseMenuList = await QueryMenuList();
      if (rs.meta.return_code === API_RETURN_CODE_INIT) {
        // console.log(rs.data);
        setMenus(rs.data);

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
