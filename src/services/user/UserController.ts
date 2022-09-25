import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /api/v1/queryUserList */
export async function LoginByCode(
  params: {
    // query
    /** code */
    code: string;
    /** appid */
    appid?: string;
    /** state */
    state?: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.RSAuthUser>(
    '/wechat/api/weCom/oauth2/authorize/qr/employee',
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    },
  );
}

export async function Test() {
  return request<API.APIResponse>('/wechat/api/weCom/callback/test');
}
