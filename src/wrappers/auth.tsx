import { Navigate } from 'umi';

import { useModel } from 'umi';

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
