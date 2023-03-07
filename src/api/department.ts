import axios from 'axios';
import { SimpleEmployee } from '@/api/base';

export interface DepartmentNode {
  id: number;
  depName: string;
  leaders: Array<SimpleEmployee>;
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
  desc: string;
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
