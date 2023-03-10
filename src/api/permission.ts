import axios from 'axios';

export interface AuthRole {
  roleCode: string;
  name: string;
  desc: string;
  isReserved: boolean;
  actIds: number[];
  menuNames: string[];
}

export interface ListRolesReply {
  list: Array<AuthRole>;
}

export interface AuthResAct {
  id: number;
  resCode: string;
  version: string;
  restPath: string;
  action: string;
  desc?: string;
}

export interface AuthRes {
  resCode: string;
  resName: string;
  type: string;
  desc: string;
  acts: Array<AuthResAct>;
}

export interface ListRecoursesReply {
  list: Array<AuthRes>;
}

export interface SetAuthConsumerStatusRequest {
  enable: boolean;
}

export interface SetAuthConsumerStatusReply {
  status: boolean;
}

/**
 * @description "查询角色"
 */
export function listRoles() {
  return axios.get<ListRolesReply>(`/api/permission/v1/roles`);
}

/**
 * @description "查询资源"
 */
export function listRecourses() {
  return axios.get<ListRecoursesReply>(`/api/permission/v1/recourses`);
}

export interface AssignResAct {
  resCode: string;
  action: string;
}

export interface RoleAssignRes {
  roleCodes: Array<string>;
  actIds: number[];
  isReplace?: boolean;
}

export interface UsersAssignRole {
  userIds: Array<number>;
  roleCodes: Array<string>;
  isReplace?: boolean;
}

export interface RoleAssignUsers {
  roleCode: string;
  userIds: number[];
  isReplace?: boolean;
}

export interface AssignAuthRequest {
  userAssignRole?: UsersAssignRole;
  roleAssignRes?: RoleAssignRes;
  roleAssignUsers?: RoleAssignUsers;
}

/**
 * @description "授权操作"
 * @param req
 */
export function assignAuth(req: AssignAuthRequest) {
  return axios.post<null>(`/api/permission/v1/op/assign-auth`, req);
}

export interface GetRoleEmployeeIdsReply {
  employeeIds: number[];
}

export function GetRoleEmployeeIds(roleCode: string) {
  return axios.get<GetRoleEmployeeIdsReply>(
    `/api/permission/v1/role-employee-ids/${roleCode}`
  );
}

export type GetRoleDetailReply = AuthRole;

export function getRoleDetail(roleCode: string) {
  return axios.get<GetRoleDetailReply>(`/api/permission/v1/roles/${roleCode}`);
}

export interface PutRoleDetailRequest {
  name: string;
  desc: string;
  actIds: number[];
  menuNames: string[];
}

export function putRoleDetail(roleCode: string, req: PutRoleDetailRequest) {
  return axios.put<GetRoleDetailReply>(
    `/api/permission/v1/roles/${roleCode}`,
    req
  );
}
