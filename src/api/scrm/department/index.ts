/*
 * @Description:
 * @Author: George
 * @Date: 2023-06-13 23:39:18
 * @LastEditors: George
 * @LastEditTime: 2023-08-24 00:40:33
 */
import axios from 'axios';

/**
 * Department
 * @description 部门管理
 */

export interface DepartmentLeader {
  id: number;
  name: string;
  nickName: string;
  avatar: string;
}

export interface DepartmentNode {
  weWorkParentId?: number;
  weWorkDepId?: number;
  refDepartmentId?: number;
  order?: number;
  name?: string;
  // leader: DepartmentLeader;
  phoneNumber?: string;
  email?: string;
  remark?: string;
  children?: DepartmentNode[];
}

export interface GetDepartmentTreeRequest {
  depId?: number;
}

export interface GetDepartmentTreeReply {
  pageIndex: number;
  pageSize: number;
  total: number;
  list?: DepartmentNode[];
}

export interface GetDepartmentTreeReplyList {
  list: DepartmentNode[];
}

export function getDepartmentTree() {
  return axios.post<GetDepartmentTreeReply>(
    `/api/v1/admin/scrm/organization/wechat/partment/page`
  );
}

export interface CreateDepartmentRequest {
  depName: string;
  leaderId: number;
  leaderIds: number[];
  pId: number;
  desc?: string;
  phoneNumber?: string;
  email?: string;
  remark?: string;
}

export interface CreateDepartmentReply {
  id: number;
}

export function createDepartment(request: CreateDepartmentRequest) {
  return axios.post<CreateDepartmentReply>(
    '/api/v1/admin/department/departments',
    request
  );
}

export interface DeleteDepartmentRequest {
  id: number;
}

export interface DeleteDepartmentReply {
  id: number;
}

export function deleteDepartment(request: DeleteDepartmentRequest) {
  return axios.delete<DeleteDepartmentReply>(
    `/api/v1/admin/department/departments/${request.id}`
  );
}

export interface Department {
  id: number;
  depName: string;
  leader: DepartmentLeader;
  phoneNumber: string;
  email: string;
  remark: string;
}

export interface GetDepartmentRequest {
  id: number;
}

export interface GetDepartmentReply {
  department: Department;
}

export function getDepartment(request: GetDepartmentRequest) {
  return axios.get<GetDepartmentReply>(
    `/api/v1/admin/department/departments/${request.id}`
  );
}
