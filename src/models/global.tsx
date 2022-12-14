// 全局共享数据示例
import { DEFAULT_NAME } from '@/constants';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { message } from 'antd';
import {
  CheckRootInitialized,
  CheckSystemInstalled,
} from '@/services/boot/BootController';
import { CheckSystemWXAPIConfig } from '@/services/system/SystemController';
import { API_RETURN_CODE_INIT } from '@/constants/api';

let globalSysInstalled: boolean = false;
let globalRootInitialized: boolean = false;
let globalWXAPIConfig: API.WXAPIConfig | undefined = undefined;
let globalName: string = DEFAULT_NAME;

export const UseApp = () => {
  const [sysInstalled, setSystemInstalled] =
    useState<boolean>(globalSysInstalled);
  const [rootInitialized, setRootInitialized] = useState<boolean>(
    globalRootInitialized,
  );
  const [wxAPIConfig, setWXAPIConfig] = useState<API.WXAPIConfig | undefined>(
    globalWXAPIConfig,
  );
  const [name, setName] = useState<string>(globalName);

  // console.log("use app")

  const updateGlobalSystemInstalled = (val: boolean) => {
    globalSysInstalled = val;
    setSystemInstalled(val);
  };

  const updateGlobalRootInitialized = (val: boolean) => {
    globalRootInitialized = val;
    setRootInitialized(val);
  };

  const updateGlobalWXAPIConfig = (val: API.WXAPIConfig) => {
    globalWXAPIConfig = val;
    setWXAPIConfig(val);
  };

  const updateGlobalName = (val: string) => {
    globalName = val;
    setName(val);
  };

  useEffect(() => {
    const HandleCheckSysInstalled = async () => {
      // 读取localstorage的installStatus
      const jsonSysInstalled = localStorage.getItem('sysInstalled');
      if (jsonSysInstalled !== null) {
        const isSysInstalled: boolean = JSON.parse(jsonSysInstalled!);
        // 如果系统已经安装过，则直接进入系统
        if (isSysInstalled) {
          // console.log('updateGlobalSystemInstalled is true')
          updateGlobalSystemInstalled(true);
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
        localStorage.setItem('sysInstalled', '' + sysInstalled);
        // set status
        updateGlobalSystemInstalled(sysInstalled);
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
          // console.log('updateGlobalRootInitialized is true')
          updateGlobalRootInitialized(true);
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
          updateGlobalRootInitialized(true);
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
    const HandleCheckSystemWXConfig = async () => {
      // 读取localstorage的wxAPIConfig
      const jsonWXAPIConfig = localStorage.getItem('wxAPIConfig');
      if (jsonWXAPIConfig !== null) {
        const config: API.WXAPIConfig = JSON.parse(jsonWXAPIConfig!);
        // 如果系统已经初始化过Root，则直接进入系统
        if (config) {
          updateGlobalWXAPIConfig(config);
          return;
        }
      }

      // 检查远程的微信API配置信息
      const rs: API.ResponseSystemWXAPIConfig = await CheckSystemWXAPIConfig();
      if (rs.meta.return_code === API_RETURN_CODE_INIT) {
        // check system status
        if (rs.data !== null) {
          // console.log(sysInstalled)
          const jsonConfig = JSON.stringify(rs.data);
          localStorage.setItem('wxAPIConfig', jsonConfig);
          // set status
          updateGlobalWXAPIConfig(rs.data);
        }
      } else {
        message.error(rs.meta.result_message);
        return;
      }
    };

    // 检查root是否被初始化
    HandleCheckSystemWXConfig().catch((e) => {
      console.error('HandleCheckSystemWXConfig', e);
    });

    // 返回值
    return () => {};
  }, [sysInstalled]);

  // console.log("use app sysInstalled",sysInstalled,rootInitialized)

  return {
    sysInstalled,
    updateGlobalSystemInstalled,
    rootInitialized,
    updateGlobalRootInitialized,
    wxAPIConfig,
    updateGlobalWXAPIConfig,
    name,
    updateGlobalName,
  };
};

export const UseAuthUserInfo = () => {
  const { AuthUser, AuthToken, updateGlobalAuthUser, updateGlobalAuthToken } =
    useModel('auth');
  return {
    AuthUser,
    updateGlobalAuthUser,
    AuthToken,
    updateGlobalAuthToken,
  };
};
