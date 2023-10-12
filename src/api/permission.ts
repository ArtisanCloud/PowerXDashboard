import axios from 'axios';
import { Pagination } from '@/types/global';

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
  groupId: number;
  groupName: string;
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
  return axios.get<ListRolesReply>('/api/v1/admin/permission/roles');
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
  return axios.post<CreateRoleReply>('/api/v1/admin/permission/roles', request);
}

export interface GetRoleRequest {
  roleCode: string;
}

export function getRole(request: GetRoleRequest) {
  return axios.get<AdminRole>(
    `/api/v1/admin/permission/roles/${request.roleCode}`,
  );
}

export interface PutRoleRequest {
  roleCode: string;
  name?: string;
  desc?: string;
  apiIds?: number[];
  menuNames?: string[];
}

export function patchRole(request: PutRoleRequest) {
  return axios.patch<AdminRole>(
    `/api/v1/admin/permission/roles/${request.roleCode}`,
    request,
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
    `/api/v1/admin/permission/roles/${request.roleCode}/actions/set-permissions`,
    request,
  );
}

export interface ListAPIRequest {
  groupId?: number;
}

export interface ListAPIReply {
  list: AdminAPI[];
}

export function listAPI(request: ListAPIRequest) {
  return axios.get<ListAPIReply>('/api/v1/admin/permission/api-list', {
    params: request,
  });
}

export interface GetRoleEmployeesRequest extends Pagination {
  roleCode: string;
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

export interface GetRoleEmployeesReply extends Pagination {
  list: RoleEmployee[];
}

export function getRoleEmployees(request: GetRoleEmployeesRequest) {
  return axios.get<GetRoleEmployeesReply>(
    `/api/v1/admin/permission/roles/${request.roleCode}/users`,
    { params: request },
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
    `/api/v1/admin/permission/users/${request.userId}/actions/set-roles`,
    request,
  );
}

interface SetRoleEmployeesRequest {
  roleCode: string;
  employeeIds: number[];
}

interface SetRoleEmployeesReply {
  status: string;
}

export function setRoleEmployees(request: SetRoleEmployeesRequest) {
  return axios.post<SetRoleEmployeesReply>(
    `/api/v1/admin/permission/roles/${request.roleCode}/actions/set-employees`,
    request,
  );
}
