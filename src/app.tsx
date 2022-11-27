// 运行时配置

// import asset
import logo from '@/assets/logo.svg';
import iconAvatar from '@/assets/logo.png';

// import from umi
import type { RequestConfig } from 'umi';
import { history } from 'umi';
import { message } from 'antd';

// import from models
import { UseAuthUserInfo, UseApp } from '@/models/global';

// import from constant
import * as URIConstant from '@/constants/uri';
import { API_RETURN_CODE_INIT } from '@/constants/api';

import { MenuDataItem } from '@ant-design/pro-layout';
// import { QueryMenuList } from '@/services/boot/BootController';
import { UseMenuData } from '@/models/menu';

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://next.umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{
  name: string;
  avatar?: string;
  menuData?: MenuDataItem[];
}> {
  // const rsMenuList: API.ResponseMenuList = await QueryMenuList();
  // const menuData: MenuDataItem[] = ParseRoutes(menuData);
  // console.log('getInitialState', menuData);
  return {
    name: '@ArtisanCloud/PowerX',
    avatar: iconAvatar,
    // menuData: menuData,
  };
}

// 布局设置
// https://umijs.org/docs/max/layout-menu
export const layout = ({
  initialState,
}: {
  initialState: {
    name: string;
    avatar: string;
    menuData: MenuDataItem[];
  };
}) => {
  const { sysInstalled, rootInitialized } = UseApp();
  // console.log('app layout check system status', initialState.name, sysInstalled, rootInitialized);

  let isLogin: boolean = false;
  if (sysInstalled && rootInitialized) {
    const { AuthUser } = UseAuthUserInfo();
    // console.log('page layout authUser ', AuthUser)
    if (AuthUser) {
      isLogin = true;
    }
  }
  // console.log('page layout login status is', isLogin)
  // console.log(initialState.menuData)

  const { menuData } = UseMenuData();

  return {
    logo: logo,
    menu: {
      locale: false,
      // defaultOpenKeys: ['key'],
      // defaultOpenAll: true,
    },
    menuDataRender: () => initialState.menuData || menuData,
    // menuDataRender: (menuData: MenuDataItem[]) => initialState.menuData || menuData,
    onPageChange: () => {
      // 判断是否系统安装成功
      if (!sysInstalled) {
        history.push(URIConstant.URI_INSTALL);
        return;
      }
      // 判断是否Root被初始化
      else if (!rootInitialized) {
        history.push(URIConstant.URI_ROOT_INIT);
        return;
      }

      // 如果当前页面是首页，但是用户同时用户未登录，则显示当前页
      else if (!isLogin && location.pathname === URIConstant.URI_HOME) {
        return;
      }
      // 如果当前页面不是登陆页面，同时用户未登录，则跳转到登陆页面
      else if (!isLogin && location.pathname !== URIConstant.URI_LOGIN) {
        history.push(URIConstant.URI_LOGIN);
        return;
      }
    },
  };
};

// 请求设置
// https://umijs.org/docs/max/request
export const request: RequestConfig = {
  // 统一的请求设定
  baseURL: BASE_URL,
  timeout: 1000,
  headers: { 'X-Requested-With': 'XMLHttpRequest' },

  // other axios options you want
  errorConfig: {
    // 错误抛出
    errorThrower: (res: API.APIResponse) => {
      const { meta, data } = res;
      const { result_code, result_message, return_code } = res.meta;
      if (meta.return_code !== API_RETURN_CODE_INIT) {
        const error: any = new Error(meta.return_message);
        error.name = meta.return_code;
        error.info = { result_code, result_message, return_code, data };
        throw error; // 抛出自制的错误
      }
    },
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      if (error.response) {
        // console.log('response err', error);
        const rs: API.APIResponse = error.response.data;

        // 后台服务器未启动
        if (error.code === 'ERR_NETWORK') {
          message.error('后端服务端无法响应，请确保后台服务器运行正常');
        }
        // 显示后台的接口错误
        if (rs && rs.meta) {
          message.error(rs.meta.result_message);
          console.error(rs);
        }
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        console.log('request err');
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        message.error('None response! Please retry.');
      } else {
        console.log('other err', error);
      }
    },
  },
  requestInterceptors: [
    (config: any) => {
      const jsonAuthUser = localStorage.getItem('auth');
      if (jsonAuthUser !== null) {
        const authToken: API.APIResponse = JSON.parse(jsonAuthUser!);
        // console.log(authToken)
        // 拦截请求配置，进行个性化处理。
        config.headers = {
          Authorization: `Bearer ${authToken.data?.access_token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        };
      }
      return { ...config };
    },
  ],
  responseInterceptors: [
    (response) => {
      // console.log(222, response)
      // 拦截响应数据，进行个性化处理
      // const {data} = response;
      // if (!data.success) {
      // 	message.error('请求失败！');
      // }
      return response;
    },
  ],
};
