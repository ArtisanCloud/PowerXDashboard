import { request } from '@umijs/max';

export async function Ping() {
  return request<API.RSPing>('root/api/ping');
}
