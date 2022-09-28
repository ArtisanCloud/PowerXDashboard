// hook useAuthUser for handling current auth.js user
import { useEffect, useState } from 'react';
import { MeDetail } from '@/services/user/UserController';
import * as APIConstant from '@/constants/backend';
import { history } from 'umi';

export default () => {
  // const [Loading, SetLoading] = useState<boolean>(true);
  const [AuthUser, SetUser] = useState<API.Employee>();
  const [AuthToken, SetAuthToken] = useState<API.Token>();

  // 加载localstorage中的token，然后请求后台换取user的信息
  useEffect(() => {
    const LoadToken = async () => {
      // 读取localstorage的token
      const jsonAuthUser = localStorage.getItem('auth');

      // 解析token
      let authToken: API.RSToken;
      let authUser: API.Employee;
      if (jsonAuthUser !== null) {
        authToken = JSON.parse(jsonAuthUser!);

        // 如果AuthToken未定义，将本地的token设置到里面去
        if (authToken.data && AuthToken === undefined) {
          SetAuthToken(authToken.data!);
        }

        // 全局token设置好后，请求登陆用户的信息
        // console.log(authToken)
        const rsAuthUser = await MeDetail();
        if (rsAuthUser.meta.result_code === APIConstant.API_RETURN_CODE_INIT) {
          authUser = rsAuthUser.data!;
        } else {
          // token无效
          return history.push('/user/login');
        }
      } else {
        authUser = null!;
      }

      if (authUser! && AuthUser === undefined) {
        SetUser(authUser!);
      }
    };

    LoadToken();

    return () => {};
  }, [AuthToken]);

  return {
    AuthUser,
    AuthToken,
  };
};
