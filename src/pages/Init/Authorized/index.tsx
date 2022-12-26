import { useSearchParams, useLocation, history } from 'umi';
import { useEffect, useState } from 'react';
import * as APIConstant from '@/constants/api';
import * as WXConstant from '@/constants/web';
import { InitRootByCode } from '@/services/boot/BootController';
import {LS_AUTH} from "@/constants";

const AuthorizedRoot: React.FC = () => {
  const [rs, setResponse] = useState<API.ResponseToken>();
  let location = useLocation();

  // 获取回调url的get参数
  const [searchParams] = useSearchParams();
  const queries: API.QueryOAuthCallback = {
    code: '' + searchParams.get('code'),
    state: '' + searchParams.get('state'),
  };

  // hook函数来处理当前页面的请求后端逻辑
  useEffect(() => {
    const HandleRootInit = async () => {
      // console.log(queries!)

      // 若用户禁止授权，则重定向后不会带上code参数，仅会带上state参数
      // https://developer.work.weixin.qq.com/document/path/91019
      if (queries?.code === '') {
        setResponse({
          meta: {
            return_code: APIConstant.API_RETURN_CODE_ERROR,
            result_code: WXConstant.WX_AUTH_CODE_EMPTY,
          },
          data: null,
        });
        // console.error("error code")
        return;
      }

      // 调用后台api，code换token
      try {
        const rs = await InitRootByCode(queries!);
        setResponse(rs);
      } catch (e: any) {
        console.log(e);

        // 后台系统错误信息
        if (e.response.status === APIConstant.API_RETURN_CODE_ERROR) {
          setResponse(e.response.data);
        } else {
          // 前台系统错误
          setResponse({
            meta: {
              return_code: APIConstant.API_RETURN_CODE_ERROR,
              result_code: WXConstant.SYS_ERR,
            },
            data: null,
          });
          // console.error(e)
        }
      }
    };

    // 调用后台code换取用户登陆信息
    HandleRootInit().catch((e) => {
      console.error('HandleRootInit', e);
    });

    // 返回值
    return () => {};
  }, []);

  if (rs?.meta.return_code === APIConstant.API_RETURN_CODE_INIT) {
    localStorage.setItem(LS_AUTH, JSON.stringify(rs));

    // 跳转首页
    location.pathname = '/';
    history.push(location.pathname);
    return <div>{location.pathname}</div>;
  } else {
    return (
      <div>
        <div>{rs?.meta.return_code}</div>
        <div>{rs?.meta.result_code}</div>
        <div>{rs?.meta.result_message}</div>
      </div>
    );
  }
};

export default AuthorizedRoot;
