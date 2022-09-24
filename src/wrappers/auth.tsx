import { Navigate, Outlet } from 'umi';

import UseAuthUser from '@/models/auth';

export default () => {
  const { AuthUser } = UseAuthUser();

  if (!AuthUser) {
    return <Navigate to="/user/login" />;
  } else {
    return <Outlet />;
  }
};
