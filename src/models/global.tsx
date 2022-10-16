// 全局共享数据示例
import { DEFAULT_NAME } from '@/constants';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { message } from 'antd';
import {
  CheckRootInitialized,
  CheckSystemInstalled,
} from '@/services/boot/BootController';
import { API_RETURN_CODE_INIT } from '@/constants/api';

export const UseApp = () => {
  const [sysInstalled, setSystemInstalled] = useState<boolean>(false);
  const [rootInitialized, setRootInitialized] = useState<boolean>(false);
  const [name, setName] = useState<string>(DEFAULT_NAME);

  useEffect(() => {
    const HandleCheckSysInstalled = async () => {
      // 读取localstorage的installStatus
      const jsonSysInstalled = localStorage.getItem('sysInstalled');
      if (jsonSysInstalled !== null) {
        const isSysInstalled: boolean = JSON.parse(jsonSysInstalled!);
        // 如果系统已经安装过，则直接进入系统
        if (isSysInstalled) {
          setSystemInstalled(true);
          return;
        }
      }

      // 检查远程是否安装成功
      const rs: API.ResponseSystemInstalledStatus =
        await CheckSystemInstalled();
      if (rs.meta.return_code === API_RETURN_CODE_INIT) {
        let sysInstalled = false;
        // check system status
        rs.data.forEach(function (value) {
          if (value.name === 'system' && value.status === 'installed') {
            sysInstalled = true;
          }
        });
        // console.log(sysInstalled)
        localStorage.setItem('sysInstalled', 'true');
        // set status
        setSystemInstalled(sysInstalled);
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
      // 读取localstorage的rootInitialized
      const jsonRootInitialized = localStorage.getItem('rootInitialized');
      if (jsonRootInitialized !== null) {
        const isRootInitialized: boolean = JSON.parse(jsonRootInitialized!);
        // 如果系统已经初始化过Root，则直接进入系统
        if (isRootInitialized) {
          setRootInitialized(true);
          return;
        }
      }

      // 检查远程是否初始化过Root
      const rs: API.ResponseRootInitStatus = await CheckRootInitialized();
      if (rs.meta.return_code === API_RETURN_CODE_INIT) {
        // check system status
        if (rs.data !== null) {
          // console.log(sysInstalled)
          localStorage.setItem('rootInitialized', 'true');
          // set status
          setSystemInstalled(sysInstalled);
        }
      } else {
        message.error(rs.meta.result_message);
        return;
      }
    };

    // 检查后台系统是否被安装
    HandleCheckRootInitialized().catch((e) => {
      console.error('HandleCheckRootInitialized', e);
    });

    // 返回值
    return () => {};
  }, [rootInitialized]);

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
    setSystemInstalled,
    rootInitialized,
    setRootInitialized,
  };
};

export const UseAuthUser = () => {
  const { AuthUser } = useModel('auth');
  return AuthUser;
};
