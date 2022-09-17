import axios from 'axios';

/**
 * PowerX
 * @description 用户中心
 * @path /api/v1/admin/user-center
 */

export interface GetUserInfoReply {
  id: number;
  account: string;
  name: string;
  email: string;
  mobilePhone: string;
  gender: string;
  nickName: string;
  desc: string;
  avatar: string;
  externalEmail: string;
  depName: string;
  position: string;
  jobTitle: string;
  isEnabled: boolean;
  createdAt: string;
  roles: string[];
}

export function getUserInfo() {
  return axios.get<GetUserInfoReply>('/api/v1/admin/user-center/user-info');
}

export interface MenuRoles {
  menuName: string;
  allowRoleCodes: string[];
}

export interface GetMenuRolesReply {
  menuRoles: MenuRoles[];
}

export function getMenuRoles() {
  return axios.get<GetMenuRolesReply>('/api/v1/admin/user-center/menu-roles');
}

export function getMenuList() {
  return axios.get<any>('/api/v1/admin/user-center/menu-list');
}


export interface ModifyPasswordRequest {
  password: string;
}

export function modifyUserPassword(request: ModifyPasswordRequest) {
  return axios.post(
    '/api/v1/admin/user-center/users/actions/modify-password',
    request
  );
}
