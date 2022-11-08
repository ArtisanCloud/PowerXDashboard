import { request } from '@umijs/max';

export async function CheckSystemInstalled() {
  return request<API.ResponseSystemInstalledStatus>(
    'root/api/system/install/check',
  );
}

export async function InstallSystem(data: API.RequestInstallSystem) {
  return request<API.ResponseSystemInstalledStatus>('root/api/system/install', {
    method: 'POST',
    data: data,
  });
}

export async function CheckRootInitialized() {
  return request<API.ResponseRootInitStatus>('root/api/system/root/init/check');
}

export async function InitRootByCode(
  params: API.QueryOAuthCallback,
  options?: { [key: string]: any },
) {
  return request<API.ResponseToken>(
    'root/api/system/weCom/callback/authorized/root',
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    },
  );
}

// Menu APIs
export async function QueryMenuList() {
  return request<API.ResponseMenuList>('root/api/permission/module/list');
}

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
