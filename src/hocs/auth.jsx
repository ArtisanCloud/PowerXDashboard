import { Navigate, useModel } from 'umi';

// 高阶函数
const withAuth = (Component) => () => {
  const { AuthUser } = useModel('auth');
  // console.log(AuthUser)

  if (!AuthUser) {
    return <Navigate to="/user/login" />;
  } else {
    return <Component />;
  }
};

export default withAuth;
