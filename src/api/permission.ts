import axios from 'axios';

/**
 * PowerX
 * @description 权限管理
 * @path /api/admin/permission/v1
 */

export interface AdminAPI {
  id: number;
  api: string;
  method: string;
  name: string;
  desc: string;
}

export interface AdminRole {
  roleCode: string;
  name: string;
  desc: string;
  isReserved: boolean;
  apiList: AdminAPI[];
  menuNames: string[];
}

export interface ListRolesReply {
  list: AdminRole[];
}

export function listRoles() {
  return axios.get<ListRolesReply>('/api/admin/permission/v1/roles');
}

export interface CreateRoleRequest {
  roleCode: string;
  name: string;
  desc: string;
  apiIds: number[];
  menuNames: string[];
}

export interface CreateRoleReply {
  roleCode: string;
}

export function createRole(request: CreateRoleRequest) {
  return axios.post<CreateRoleReply>('/api/admin/permission/v1/roles', request);
}

export interface GetRoleRequest {
  roleCode: string;
}

export function getRole(request: GetRoleRequest) {
  return axios.get<AdminRole>(
    `/api/admin/permission/v1/roles/${request.roleCode}`
  );
}

export interface PutRoleRequest {
  roleCode: string;
  name: string;
  desc: string;
  apiIds: number[];
  menuNames: string[];
}

export function putRole(request: PutRoleRequest) {
  return axios.put<AdminRole>(
    `/api/admin/permission/v1/roles/${request.roleCode}`,
    request
  );
}

export interface SetRolePermissionsRequest {
  roleCode: string;
  apiIds: number[];
}

export interface SetRolePermissionsReply {
  status: string;
}

export function setRolePermissions(request: SetRolePermissionsRequest) {
  return axios.post<SetRolePermissionsReply>(
    `/api/admin/permission/v1/roles/${request.roleCode}/actions/set-permissions`,
    request
  );
}

export interface ListAPIRequest {
  groupId: number;
}

export interface ListAPIReply {
  list: AdminAPI[];
}

export function listAPI(request: ListAPIRequest) {
  return axios.get<ListAPIReply>('/api/admin/permission/v1/api-list', {
    params: request,
  });
}

export interface GetRoleEmployeesRequest {
  roleCode: string;
  pageIndex: number;
  pageSize: number;
}

export interface RoleEmployeeDepartment {
  id: number;
  name: string;
}

export interface RoleEmployee {
  id: number;
  name: string;
  nickname: string;
  account: string;
  phoneNumber: string;
  department?: RoleEmployeeDepartment;
  email: string;
}

export interface GetRoleEmployeesReply {
  list: RoleEmployee[];
  pageIndex: number;
  pageSize: number;
  total: number;
}

export function getRoleEmployees(request: GetRoleEmployeesRequest) {
  return axios.get<GetRoleEmployeesReply>(
    `/api/admin/permission/v1/roles/${request.roleCode}/users`,
    { params: request }
  );
}

export interface SetUserRolesRequest {
  userId: number;
  roleCodes: string[];
}

export interface SetUserRolesReply {
  status: string;
}

export function setUserRoles(request: SetUserRolesRequest) {
  return axios.post<SetUserRolesReply>(
    `/api/admin/permission/v1/users/${request.userId}/actions/set-roles`,
    request
  );
}
