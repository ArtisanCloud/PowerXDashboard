// 运行时配置

import logo from '@/assets/logo.svg';
import iconAvatar from '@/assets/logo.png';

import { history } from 'umi';
import UseAuthUser from '@/models/auth';

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

export const layout = () => {
  // check current auth user
  const { AuthUser } = UseAuthUser();

  return {
    logo: logo,
    menu: {
      locale: false,
    },
    onPageChange: () => {
      // console.log('change paged');
      if (!AuthUser && location.pathname !== '/user/login') {
        history.push('/user/login');
      }
    },
  };
};
