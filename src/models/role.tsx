import { useEffect, useState } from 'react';
import { API_RETURN_CODE_INIT } from '@/constants/api';
import { message } from 'antd';
import { QueryRoleList } from '@/services/user/UserController';
import { DEFAULT_PAGE, MAX_PAGE_SIZE } from '@/constants';

export let globalRoles: API.Role[] = [];

export const UseRoles = () => {
  const [roles, setRoles] = useState<API.Role[]>(globalRoles);
  const updateGlobalRoles = (val: API.Role[]) => {
    setRoles(val);
  };

  useEffect(() => {
    const HandleLoadRoles = async () => {
      // 检查加载后台的角色数据
      const rs: API.ResponseGetRoleList = await QueryRoleList({
        withEmployees: true,
        page: DEFAULT_PAGE,
        pageSize: MAX_PAGE_SIZE,
      });
      if (rs.meta.return_code === API_RETURN_CODE_INIT) {
        // console.log(rs.data)
        // set status
        updateGlobalRoles(rs.data);
      } else {
        message.error(rs.meta.result_message);
        return;
      }
    };

    // 加载后台的角色数据
    HandleLoadRoles().catch((e) => {
      console.error('HandleLoadRoles', e);
    });

    // 返回值
    return () => {};
  }, []);

  return {
    roles,
    updateGlobalRoles,
  };
};
