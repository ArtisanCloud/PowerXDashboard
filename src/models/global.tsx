// 全局共享数据示例
import { DEFAULT_NAME } from '@/constants';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { message } from 'antd';
import { CheckSystemInstalled } from '@/services/boot/BootController';
import { API_RETURN_CODE_INIT } from '@/constants/api';

export const UseApp = () => {
  const [sysInstalled, setSystemInstall] = useState<boolean>(false);
  const [rootInitialized, setRootInitialized] = useState<boolean>(false);
  const [name, setName] = useState<string>(DEFAULT_NAME);

  useEffect(() => {
    const HandleCheckSysInstalled = async () => {
      // console.log(queries!)
      const rs: API.RSSystemInstalledStatus = await CheckSystemInstalled();
      if (rs.meta.return_code === API_RETURN_CODE_INIT) {
        let sysInstalled = false;
        // check system status
        rs.data.forEach(function (value) {
          if (value.name === 'system' && value.status === 'installed') {
            sysInstalled = true;
          }
        });
        // console.log(sysInstalled)
        // set status
        setSystemInstall(sysInstalled);
      } else {
        message.error(rs.meta.result_message);
        return;
      }
    };

    // 检查后台系统是否被安装
    HandleCheckSysInstalled().catch((e) => {
      console.error('HandleCheckSysInstalled', e);
    });

    // 返回值
    return () => {};
  }, [sysInstalled]);

  useEffect(() => {
    const HandleCheckRootInitialized = async () => {
      // console.log(queries!)
    };

    // 检查root是否被初始化
    HandleCheckRootInitialized().catch((e) => {
      console.error('HandleCheckRootInitialized', e);
    });

    // 返回值
    return () => {};
  }, [rootInitialized]);

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
