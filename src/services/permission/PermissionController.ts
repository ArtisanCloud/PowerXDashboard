import { request } from '@umijs/max';

// permission module
export async function CreatePermissionModule(
  data: API.RequestCreatePermissionModule,
) {
  return request<API.ResponsePermissionModule>(
    'root/api/permission/module/create',
    {
      method: 'POST',
      data: data,
    },
  );
}

export async function UpdatePermissionModule(
  data: API.RequestUpdatePermissionModule,
) {
  return request<API.ResponsePermissionModule>(
    'root/api/permission/module/update',
    {
      method: 'PUT',
      data: data,
    },
  );
}

export async function DeletePermissionModule(
  data: API.RequestDeletePermissionModule,
) {
  return request<API.APIResponse>('root/api/permission/module/delete', {
    method: 'DELETE',
    data: data,
  });
}

export async function BindRoleToEmployees(
  data: API.RequestBindRoleToEmployees,
) {
  return request<API.APIResponse>('admin/api/role/bind/employee', {
    method: 'POST',
    data: data,
  });
}

export async function QueryGroupPolicyList(
  data: API.RequestQueryGroupPolicyList,
) {
  return request<API.APIResponse>('admin/api/permission/policy/group/list', {
    method: 'POST',
    data: data,
  });
}
