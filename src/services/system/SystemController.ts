import { request } from '@umijs/max';

export async function Ping() {
  return request<API.ResponsePing>('root/api/ping');
}

export async function CheckSystemWXAPIConfig() {
  return request<API.ResponseSystemWXAPIConfig>('root/api/system/wx/config');
}
