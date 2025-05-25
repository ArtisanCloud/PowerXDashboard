import axios from 'axios';
import { PrefixUriAdmin } from '@/api';
import { UriWeComUser } from '@/api/scrm/wecom/base';
import { GetCustomersReply } from '@/api/scrm/wecom/customer';

/**
 * User
 * @description 员工管理
 */

export interface UserDepartment {
  depId: number;
  depName: string;
}

export interface WeComUser {
  id: number;
  account: string;
  name: string;
  email: string;
  mobilePhone: string;
  gender: string;
  nickName?: string;
  desc?: string;
  avatar?: string;
  externalEmail?: string;
  roles: string[];
  departments?: string;
  position: string;
  jobTitle: string;
  isEnabled: boolean;
  createdAt: string;
}

export interface GetUserRequest {
  id: string;
}

export type GetUserReply = WeComUser;
export function getUser(request: GetUserRequest) {
  return axios.get<GetUserReply>(
    `${PrefixUriAdmin + UriWeComUser}/${request.id}`,
  );
}

export interface listWeComUsersPageRequest {
  id?: any;
  name?: string;
  email?: string;
  alias?: number[];
  status?: string[];
  weComUserId?: string | number | null;
  roleCodes?: string[];
  isEnable?: any;
  pageIndex?: number;
  pageSize?: number;
  likeName?: string;
  weComTagId?: number;
  departmentId?: number;
  departmentIds?: number[];
}

export interface listWeComUsersPageReply {
  list: WeComUser[];
  pageIndex: number;
  pageSize: number;
  total: number;
}

export function listWeComUsersPage(request: listWeComUsersPageRequest) {
  return axios.post<listWeComUsersPageReply>(
    `${PrefixUriAdmin + UriWeComUser}/page`,
    request,
  );
}

export interface SyncUsersRequest {
  source: string;
  target: string;
}

export interface SyncUsersReply {
  status: boolean;
}

export function syncUsers(request: SyncUsersRequest) {
  return axios.post<SyncUsersReply>(
    `${PrefixUriAdmin + UriWeComUser}/actions/sync`,
    request,
  );
}

export function pullSyncWeComDepartmentsAndUsers(request: any) {
  return axios.get<GetCustomersReply>(
    `${PrefixUriAdmin + UriWeComUser}/sync`,
    request,
  );
}
