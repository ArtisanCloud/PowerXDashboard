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
