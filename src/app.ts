// 运行时配置

// import asset
import logo from '@/assets/logo.svg';
import iconAvatar from '@/assets/logo.png';

// import from umi
import type { RequestConfig } from 'umi';

// import from models

// import APIResponse = API.APIResponse;
// import { API_RETURN_CODE_INIT } from '@/constants';

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://next.umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{
  name: string;
  avatar?: string;
}> {
  return {
    name: '@ArtisanCloud/PowerX',
    avatar: iconAvatar,
  };
}

// 布局设置
// https://umijs.org/docs/max/layout-menu
export const layout = () => {
  return {
    logo: logo,
    menu: {
      locale: false,
    },
    onPageChange: () => {},
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
    // errorThrower: (res: APIResponse) => {
    //   const { meta, data } = res;
    //   const { result_code, result_message, return_code } = res.meta;
    //   if (meta.return_code !== API_RETURN_CODE_INIT) {
    //     const error: any = new Error(meta.return_message);
    //     error.name = meta.return_code;
    //     error.info = { result_code, result_message, return_code, data };
    //     throw error; // 抛出自制的错误
    //   }
    // },
    // 错误接收及处理
    // errorHandler: (error: any, opts: any) => {
    //   if (opts?.skipErrorHandler) throw error;
    //   // 我们的 errorThrower 抛出的错误。
    //   if (error.name === 'BizError') {
    //     const errorInfo: ResponseStructure | undefined = error.info;
    //     if (errorInfo) {
    //       const { errorMessage, errorCode } = errorInfo;
    //       switch (errorInfo.showType) {
    //         case ErrorShowType.SILENT:
    //           // do nothing
    //           break;
    //         case ErrorShowType.WARN_MESSAGE:
    //           message.warn(errorMessage);
    //           break;
    //         case ErrorShowType.ERROR_MESSAGE:
    //           message.error(errorMessage);
    //           break;
    //         case ErrorShowType.NOTIFICATION:
    //           notification.open({
    //             description: errorMessage,
    //             message: errorCode,
    //           });
    //           break;
    //         case ErrorShowType.REDIRECT:
    //           // TODO: redirect
    //           break;
    //         default:
    //           message.error(errorMessage);
    //       }
    //     }
    //   } else if (error.response) {
    //     // Axios 的错误
    //     // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
    //     message.error(`Response status:${error.response.status}`);
    //   } else if (error.request) {
    //     // 请求已经成功发起，但没有收到响应
    //     // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
    //     // 而在node.js中是 http.ClientRequest 的实例
    //     message.error('None response! Please retry.');
    //   } else {
    //     // 发送请求时出了点问题
    //     message.error('Request error, please retry.');
    //   }
    // },
  },
  requestInterceptors: [],
  responseInterceptors: [],
};
