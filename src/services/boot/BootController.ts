import { request } from '@umijs/max';

// system installation
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

export async function InitRoot(data: API.RequestInitRoot) {
  return request<API.ResponseToken>('root/api/system/root/initialize', {
    method: 'POST',
    data: data,
  });
}

// Menu APIs
export async function QueryMenuList() {
  return request<API.ResponseMenuList>('root/api/permission/module/list');
}
