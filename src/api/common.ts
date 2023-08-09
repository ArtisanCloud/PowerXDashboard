import axios from 'axios';
import { Pagination } from '@/types/global';

/**
 * 通用接口
 * @author Northseadl
 * @email northseadl@outlook.com
 * @version v1
 */

export const PrefixUriAdmin = '/api/v1/admin';
export const DefaultPageSize = 10;
export const MaxPageSize = 399;

export interface EmployeeOption {
  id: number;
  avatar: string;
  account: string;
  name: string;
  email: string;
  phoneNumber: string;
}

export interface GetEmployeeOptionsRequest extends Pagination {
  likeName?: string;
  likeEmail?: string;
  likePhoneNumber?: string;
}

export interface GetEmployeeOptionsReply extends Pagination {
  list: EmployeeOption[];
}

export function getEmployeeOptions(request: GetEmployeeOptionsRequest) {
  return axios.get<GetEmployeeOptionsReply>(
    '/api/v1/admin/common/options/employees',
    {
      params: request,
    }
  );
}

export interface EmployeeQueryRoleOption {
  roleCode: string;
  roleName: string;
}

export interface EmployeeQueryDepartmentOption {
  departmentId: number;
  departmentName: string;
}

export interface GetEmployeeQueryOptionsReply {
  roles: EmployeeQueryRoleOption[];
  departments: EmployeeQueryDepartmentOption[];
}

export function getEmployeeQueryOptions() {
  return axios.get<GetEmployeeQueryOptionsReply>(
    '/api/v1/admin/common/options/employee-query'
  );
}

export interface ParentOption {
  id: number;
  name: string;
}

export interface DepartmentOption {
  id: number;
  name: string;
}

export interface GetDepartmentOptionsRequest extends Pagination {
  ids?: number[];
  likeName?: string;
}

export interface GetDepartmentOptionsReply extends Pagination {
  list: DepartmentOption[];
}

export function getDepartmentOptions(request: GetDepartmentOptionsRequest) {
  return axios.get<GetDepartmentOptionsReply>(
    '/api/v1/admin/common/options/departments',
    {
      params: request,
    }
  );
}

export interface PowerModel {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface imageAbleInfo {
  icon?: string;
  backgroundColor?: string;
  imageURL?: string;
}

export interface GetOptionsRequest {
  type: string;
  search?: string;
}
export interface GetOptionsReply {
  options: { [key: string]: any }[];
}

export function getOptions(request: GetOptionsRequest) {
  return axios.get<GetOptionsReply>('/api/v1/admin/common/options', {
    params: request,
  });
}
