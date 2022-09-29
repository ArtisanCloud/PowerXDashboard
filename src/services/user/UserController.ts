import { request } from '@umijs/max';

export async function LoginByCode(
  params: API.QueryOAuthCallback,
  options?: { [key: string]: any },
) {
  return request<API.RSToken>(
    '/wechat/api/weCom/callback/authorized/qr/employee',
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    },
  );
}

export async function MeDetail() {
  return request<API.RSAuthUser>('/admin/api/me/detail');
}
