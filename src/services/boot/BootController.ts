import { request } from '@umijs/max';

export async function CheckSystemInstalled() {
  return request<API.ResponseSystemInstalledStatus>(
    'root/api/system/install/check',
  );
}
