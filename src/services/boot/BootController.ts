import { request } from '@umijs/max';

export async function CheckSystemInstalled() {
  return request<API.RSSystemInstalledStatus>('root/api/system/install/check');
}
