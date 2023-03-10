import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';

export interface LoginData {
  userName: string;
  password: string;
}

export interface LoginRes {
  token: string;
}

export function login(data: LoginData) {
  return axios.post<LoginRes>('/api/auth/v1/op/login/basic', data);
}

export function logout() {
  return axios.post<LoginRes>('/api/auth/v1/op/logout');
}

export function getUserInfo() {
  return axios.get<UserState>('/api/auth/v1/user-info');
}

export interface MenuRoles {
  menuName: string;
  allowRoleCodes: string[];
}

export interface GetMenuRolesReply {
  menuRoles: MenuRoles[];
}

export function getMenuRoles() {
  return axios.get<GetMenuRolesReply>('/api/auth/v1/menu-roles');
}

export function getMenuList() {
  return axios.post<RouteRecordNormalized[]>('/api/auth/v1/server-menus');
}
