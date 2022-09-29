import { Navigate, Outlet, useModel } from 'umi';

// wrapper for auth
export default () => {
  const { AuthUser } = useModel('auth');
  // console.log(AuthUser)

  if (!AuthUser) {
    return <Navigate to="/user/login" />;
  } else {
    return <Outlet />;
  }
};
