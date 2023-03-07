import axios from 'axios';

export interface AuthRole {
  roleCode: string;
  name: string;
  desc: string;
  isReserved: boolean;
}

export interface ListRolesReply {
  list: Array<AuthRole>;
}

export interface AuthResAct {
  resCode: string;
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
  acts: Array<AssignResAct>;
  isReplace?: boolean;
}

export interface UsersAssignRes {
  userIds: Array<number>;
  roleCodes: Array<string>;
  isReplace?: boolean;
}

export interface AssignAuthRequest {
  userAssignRes?: UsersAssignRes;
  roleAssignRes?: RoleAssignRes;
}

/**
 * @description "授权操作"
 * @param req
 */
export function assignAuth(req: AssignAuthRequest) {
  return axios.post<null>(`/api/permission/v1/op/assign-auth`, req);
}
