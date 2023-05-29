import axios from 'axios';

/**
 * 通用接口
 * @author Northseadl
 * @email northseadl@outlook.com
 * @version v1
 */

export const PrefixUriAdmin = '/api/v1/admin';
export const DefaultPageSize = 10;
export const MaxPageSize = 9999;

export interface EmployeeOption {
  id: number;
  avatar: string;
  account: string;
  name: string;
  email: string;
  phoneNumber: string;
}

export interface GetEmployeeOptionsRequest {
  likeName?: string;
  likeEmail?: string;
  likePhoneNumber?: string;
  pageIndex?: number;
  pageSize?: number;
}

export interface GetEmployeeOptionsReply {
  list: EmployeeOption[];
  pageIndex: number;
  pageSize: number;
  total: number;
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
  positions: string[];
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

export interface GetDepartmentOptionsRequest {
  ids?: number[];
  likeName?: string;
  pageIndex?: number;
  pageSize?: number;
}

export interface GetDepartmentOptionsReply {
  list: DepartmentOption[];
  pageIndex: number;
  pageSize: number;
  total: number;
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
