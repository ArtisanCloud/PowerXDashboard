import { useEffect, useState } from 'react';
import { history } from 'umi';
import * as APIConstant from '@/constants/api';
import * as URIConstant from '@/constants/uri';
import { MeDetail } from '@/services/user/UserController';
import { UseApp } from '@/models/global';

let globalAuthUser: API.Employee | undefined = undefined;
let globalAuthToken: API.Token | undefined = undefined;

// hook UseAuthUser for handling current auth.js user
export default () => {
  const { sysInstalled, rootInitialized } = UseApp();
  const [AuthUser, SetUser] = useState<API.Employee | undefined>(
    globalAuthUser,
  );
  const [AuthToken, SetAuthToken] = useState<API.Token | undefined>(
    globalAuthToken,
  );

  // console.log("use auth")

  const updateGlobalAuthUser = (val: API.Employee) => {
    globalAuthUser = val;
    SetUser(val);
  };

  const updateGlobalAuthToken = (val: API.Token) => {
    globalAuthToken = val;
    SetAuthToken(val);
  };

  // 加载localstorage中的token，然后请求后台换取user的信息
  useEffect(() => {
    const LoadToken = async () => {
      // 读取localstorage的token
      const jsonAuthUser = localStorage.getItem('auth');

      // 解析token
      let authToken: API.ResponseToken;
      let authUser: API.Employee;
      // console.log('local auth:', jsonAuthUser)
      // 已经登陆过，有授权token
      if (jsonAuthUser !== null) {
        authToken = JSON.parse(jsonAuthUser!);

        // 如果AuthToken未定义，将本地的token设置到里面去
        if (authToken.data && AuthToken === undefined) {
          updateGlobalAuthToken(authToken.data!);
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
        updateGlobalAuthUser(authUser!);
      }
    };

    // 如果系统未初始化，则不用去考虑token
    // console.log("use auth", sysInstalled, rootInitialized)
    if (sysInstalled && rootInitialized) {
      LoadToken().catch((e) => {
        console.error('LoadToken', e);
      });
    }

    return () => {};
  }, [rootInitialized, AuthToken]);

  return {
    AuthUser,
    updateGlobalAuthUser,
    AuthToken,
    updateGlobalAuthToken,
  };
};
