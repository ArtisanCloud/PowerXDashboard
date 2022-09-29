// 全局共享数据示例
import { DEFAULT_NAME } from '@/constants';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

export const UseApp = () => {
  const [sysInstalled, setSystemInstall] = useState<boolean>(false);
  const [rootInitialized, setRootInitialized] = useState<boolean>(false);
  const [name, setName] = useState<string>(DEFAULT_NAME);

  useEffect(() => {
    const HandleCheckSysInstalled = async () => {
      // console.log(queries!)
    };

    HandleCheckSysInstalled();

    // 调用后台code换取用户登陆信息
    HandleCheckSysInstalled().catch((e) => {
      console.error('HandleCheckSysInstalled', e);
    });

    // 返回值
    return () => {};
  }, []);

  return {
    name,
    setName,
    sysInstalled,
    setSystemInstall,
    rootInitialized,
    setRootInitialized,
  };
};

export const UseAuthUser = () => {
  const { AuthUser } = useModel('auth');
  return AuthUser;
};
