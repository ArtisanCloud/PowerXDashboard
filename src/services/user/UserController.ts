import { request } from '@umijs/max';

export async function LoginByCode(
  params: API.QueryOAuthCallback,
  options?: { [key: string]: any },
) {
  return request<API.ResponseToken>(
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
  return request<API.ResponseAuthUser>('/admin/api/me/detail');
}

// role
export async function QueryRoleList() {
  return request<API.ResponseGetRoleList>('/admin/api/role/list');
}

// role
export async function QueryEmployeeList(params: API.RequestGetEmployeeList) {
  return request<API.ResponseGetEmployeeList>('/admin/api/employee/list', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
