import axios from 'axios';
import { SimpleEmployee } from '@/api/base';

export interface DepartmentNode {
  id: number;
  depName: string;
  pId: number;
  leaderIds: number[];
  phoneNumber: string;
  email: string;
  remark: string;
  children: Array<DepartmentNode>;
}

export interface GetDepartmentTreeReply {
  depTree: DepartmentNode;
}

export function getDepartmentTree(depId: number) {
  return axios.get<GetDepartmentTreeReply>(
    `/api/department/v1/department-tree/${depId}`
  );
}

export interface CreateDepartmentRequest {
  depName: string;
  leaderIds: Array<number>;
  pId: number;
  phoneNumber?: string;
  email?: string;
  remark?: string;
}

export interface CreateDepartmentReply {
  id: number;
}

/**
 * @description "创建新部门"
 * @param req
 */
export function createDepartment(req: CreateDepartmentRequest) {
  return axios.post<CreateDepartmentReply>(
    `/api/department/v1/departments`,
    req
  );
}

export interface DeleteDepartmentReply {
  id: number;
}

export function deleteDepartment(id: number) {
  return axios.delete<DeleteDepartmentReply>(
    `/api/department/v1/departments/${id}`
  );
}

export interface UpdateDepartmentRequest {
  id: number;
  depName: string;
  leaderIds: Array<number>;
  pId: number;
  phoneNumber?: string;
  email?: string;
  remark?: string;
}
