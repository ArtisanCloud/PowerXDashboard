import { useEffect, useState } from 'react';
import { API_RETURN_CODE_INIT } from '@/constants/api';
import { message } from 'antd';
import { QueryGroupPolicyList } from '@/services/permission/PermissionController';

export let globalPolicies: PowerDictionary<any>[] = [];

export const UsePolicies = () => {
  const [policies, setPolicies] =
    useState<PowerDictionary<any>[]>(globalPolicies);
  const updateGlobalPolicies = (val: PowerDictionary<any>[]) => {
    globalPolicies = val;
    setPolicies(val);
  };

  useEffect(() => {
    const HandleLoadPolicies = async () => {
      // 检查加载后台的角色数据
      const rs: API.APIResponse = await QueryGroupPolicyList({
        roleID: '',
      });
      if (rs.meta.return_code === API_RETURN_CODE_INIT) {
        // console.log(rs.data)
        // set status
        updateGlobalPolicies(rs.data);
      } else {
        message.error(rs.meta.result_message);
        return;
      }
    };

    // 加载后台的角色数据
    HandleLoadPolicies().catch((e) => {
      console.error('HandleLoadPolicies', e);
    });

    // 返回值
    return () => {};
  }, []);

  return {
    policies,
    updateGlobalPolicies,
  };
};
