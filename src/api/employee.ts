import axios, { AxiosResponse } from 'axios';
import { SimpleDepartment, SimpleRole } from '@/api/base';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GetEmployeeRequest {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GetEmployeeRequestParams {}

export interface GetEmployeeReply {
  id: number;
}

export interface ListEmployeesRequest {
  ids?: Array<number>;
  likeName?: string;
  likeEmail?: string;
  depIds?: Array<number>;
  positions?: Array<string>;
  likePhoneNumber?: string;
  roleCodes?: Array<string>;
  isEnable?: boolean;
  pageIndex?: number;
  pageSize?: number;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  mobilePhone: string;
  gender: number;
  nickName?: string;
  desc?: string;
  avatar?: string;
  externalEmail?: string;
  deps: Array<SimpleDepartment>;
  roles: Array<string>;
  position: string;
  isEnabled: boolean;
  createdAt: string;
}

export interface ListEmployeesReply {
  list: Array<Employee>;
  pageIndex: number;
  pageSize: number;
  total: number;
}

export interface SyncEmployeesReply {
  status: boolean;
}

/**
 * @description "同步员工"
 * @param source
 * @param target
 */
export function syncEmployees(source: string, target: string) {
  return axios.post<SyncEmployeesReply>(
    `/api/employee/v1/op/sync-employees/${source}/${target}`,
    {
      source,
      target,
    }
  );
}

/**
 * @description "查询员工"
 * @param params
 * @param id
 */
export function getEmployee(params: GetEmployeeRequestParams, id: number) {
  return axios.get<GetEmployeeReply>(`/api/employee/v1/employees/${id}`, {
    params: {
      id,
      ...params,
    },
  });
}

/**
 * @description "List员工"
 * @param req
 */
export function listEmployees(req: ListEmployeesRequest) {
  return axios.get<ListEmployeesReply>(`/api/employee/v1/employees`, {
    params: req,
  });
}

export interface CreateEmployeeRequest {
  account: string;
  name: string;
  nickName?: string;
  desc?: string;
  email: string;
  avatar?: string;
  externalEmail?: string;
  mobilePhone: string;
  gender?: number;
  depIds: Array<number>;
  position: string;
  jobTitle: string;
  password: string;
}

export interface CreateEmployeeReply {
  id: number;
}

/**
 * @description "创建员工"
 * @param req
 */
export function createEmployee(req: CreateEmployeeRequest) {
  return axios.post<CreateEmployeeReply>(`/api/employee/v1/employees`, req);
}

export interface GetEmployeeOptionsRequest {
  scopes?: Array<string>;
}

export interface GetEmployeeOptionsReply {
  positions: Array<string>;
  roles: Array<SimpleRole>;
  departments: Array<SimpleDepartment>;
}

/**
 * @description "员工Options"
 * @param params
 */
export function getEmployeeOptions(params: GetEmployeeOptionsRequest) {
  return axios.get<GetEmployeeOptionsReply>(`/api/employee/v1/options`, {
    params,
  });
}

export interface UpdateEmployeeRequest {
  name?: string;
  nickName?: string;
  desc?: string;
  email?: string;
  avatar?: string;
  externalEmail?: string;
  mobilePhone?: string;
  gender?: number;
  depIds: Array<number>;
  position?: string;
  jobTitle?: string;
  password?: string;
  status?: number;
}

export type UpdateEmployeeReply = Employee;

/**
 * @description "编辑员工信息"
 * @param req
 * @param id
 */
export function updateEmployee(req: UpdateEmployeeRequest, id: number) {
  return axios.patch<UpdateEmployeeReply>(
    `/api/employee/v1/employees/${id}`,
    req
  );
}

export interface DeleteEmployeeReply {
  Id: number;
}

export function deleteEmployee(id: number) {
  return axios.delete<DeleteEmployeeReply>(`/api/employee/v1/employees/${id}`);
}
