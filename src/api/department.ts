import axios from 'axios';

/**
 * Department
 * @description 部门管理
 * @path /api/admin/department/v1
 */

export interface DepartmentLeader {
  id: number;
  name: string;
  nickName: string;
  avatar: string;
}

export interface DepartmentNode {
  id: number;
  depName: string;
  leader: DepartmentLeader;
  phoneNumber: string;
  email: string;
  remark: string;
  children: DepartmentNode[];
}

export interface GetDepartmentTreeRequest {
  depId: number;
}

export interface GetDepartmentTreeReply {
  depTree: DepartmentNode;
}

export function getDepartmentTree(request: GetDepartmentTreeRequest) {
  return axios.get<GetDepartmentTreeReply>(
    `/api/admin/department/v1/department-tree/${request.depId}`
  );
}

export interface CreateDepartmentRequest {
  depName: string;
  leaderId: number;
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
    '/api/admin/department/v1/departments',
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
    `/api/admin/department/v1/departments/${request.id}`
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
    `/api/admin/department/v1/departments/${request.id}`
  );
}
