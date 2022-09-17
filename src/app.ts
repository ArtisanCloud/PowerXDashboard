// 运行时配置

import LogoSVG from '@/assets/logo.svg';
import LogoAvatar from '@/assets/logo.png';

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://next.umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{
  name: string;
  avatar?: string;
}> {
  return {
    name: '@ArtisanCloud/PowerX',
    avatar: LogoAvatar,
  };
}

export const layout = () => {
  return {
    logo: LogoSVG,
    menu: {
      locale: false,
    },
  };
};
