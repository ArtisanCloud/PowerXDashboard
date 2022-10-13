import { useEffect, useState } from 'react';
import { history } from 'umi';
// import { FakeUser } from '../../mock/user';
import * as APIConstant from '@/constants/api';
import * as URIConstant from '@/constants/uri';
import { MeDetail } from '@/services/user/UserController';
import { UseApp } from '@/models/global';

// hook UseAuthUser for handling current auth.js user
export default () => {
  const [AuthUser, SetUser] = useState<API.Employee>();
  const [AuthToken, SetAuthToken] = useState<API.Token>();
  const { sysInstalled, rootInitialized } = UseApp();

  // 加载localstorage中的token，然后请求后台换取user的信息
  useEffect(() => {
    const LoadToken = async () => {
      // 读取localstorage的token
      const jsonAuthUser = localStorage.getItem('auth');

      // 解析token
      let authToken: API.ResponseToken;
      let authUser: API.Employee;
      // console.log( jsonAuthUser)
      if (jsonAuthUser !== null) {
        authToken = JSON.parse(jsonAuthUser!);

        // 如果AuthToken未定义，将本地的token设置到里面去
        if (authToken.data && AuthToken === undefined) {
          SetAuthToken(authToken.data!);
        }

        // 全局token设置好后，请求登陆用户的信息
        // authUser = FakeUser;
        // console.log(authToken)
        const rsAuthUser = await MeDetail();
        if (rsAuthUser.meta.return_code === APIConstant.API_RETURN_CODE_INIT) {
          authUser = rsAuthUser.data!;
        } else {
          // token无效
          return history.push(URIConstant.URI_LOGIN);
        }
      } else {
        authUser = null!;
      }

      if (authUser! && AuthUser === undefined) {
        SetUser(authUser!);
      }
    };

    // 如果系统未初始化，则不用去考虑token
    if (sysInstalled && rootInitialized) {
      LoadToken().catch((e) => {
        console.error('LoadToken', e);
      });
    }

    return () => {};
  }, [AuthToken]);

  return {
    AuthUser,
    AuthToken,
  };
};
