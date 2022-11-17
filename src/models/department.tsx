import { useEffect, useState } from 'react';
import { API_RETURN_CODE_INIT } from '@/constants/api';
import { message } from 'antd';
import { QueryDepartmentList } from '@/services/user/UserController';

export let globalDepartments: API.Department[] = [];

export const UseDepartments = () => {
  const [departments, setDepartments] =
    useState<API.Department[]>(globalDepartments);
  const updateGlobalDepartments = (val: API.Department[]) => {
    globalDepartments = val;
    setDepartments(val);
  };

  useEffect(() => {
    const HandleLoadDepartments = async () => {
      // 检查加载后台的角色数据
      const rs: API.ResponseGetDepartmentList = await QueryDepartmentList({
        departmentID: 0,
      });
      if (rs.meta.return_code === API_RETURN_CODE_INIT) {
        // console.log(rs.data)
        // set status
        updateGlobalDepartments(rs.data);
      } else {
        message.error(rs.meta.result_message);
        return;
      }
    };

    // 加载后台的角色数据
    HandleLoadDepartments().catch((e) => {
      console.error('HandleLoadDepartments', e);
    });

    // 返回值
    return () => {};
  }, []);

  return {
    departments,
    updateGlobalDepartments,
  };
};
