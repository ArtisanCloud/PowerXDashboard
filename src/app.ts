// 运行时配置

import { Settings as LayoutSettings } from '@ant-design/pro-layout';
// import logo from '@/assets/logo.svg';
import iconAvatar from '@/assets/logo.png';

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

// export const layout = () => {
//   return {
//     logo: logo,
//     menu: {
//       locale: false,
//     },
//   };
// };

export const layout = ({
  initialState,
}: {
  initialState: { settings?: LayoutSettings; currentUser?: API.UserInfoVO };
}): any => {
  return {
    onPageChange: () => {
      console.log('change paged');
      // if (!currentUser && location.pathname !== '/user/login') {
      //   history.push('/user/login');
      // }
    },
    menuHeaderRender: undefined,
    ...initialState?.settings,
  };
};
