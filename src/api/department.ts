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
    `/api/v1/admin/department/department-tree/${request.depId}`
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
