import { request } from '@umijs/max';

export async function Ping() {
  return request<API.ResponsePing>('root/api/ping');
}
