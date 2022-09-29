// 全局共享数据示例
import { DEFAULT_NAME } from '@/constants';
import { useState } from 'react';
import { useModel } from 'umi';

export const useApp = () => {
  const [name, setName] = useState<string>(DEFAULT_NAME);
  return {
    name,
    setName,
  };
};

export const UseAuthUser = () => {
  const { AuthUser } = useModel('auth');
  return AuthUser;
};
