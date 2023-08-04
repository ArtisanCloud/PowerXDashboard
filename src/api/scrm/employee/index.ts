import axios from 'axios';

/**
 * Employee
 * @description 员工管理
 */

export interface EmployeeDepartment {
  depId: number;
  depName: string;
}

export interface Employee {
  id: number;
  account: string;
  name: string;
  email: string;
  mobilePhone: string;
  gender: string;
  nickName?: string;
  desc?: string;
  avatar?: string;
  externalEmail?: string;
  roles: string[];
  department?: EmployeeDepartment;
  position: string;
  jobTitle: string;
  isEnabled: boolean;
  createdAt: string;
}

export interface GetEmployeeRequest {
  id: string;
}

export type GetEmployeeReply = Employee;
export function getEmployee(request: GetEmployeeRequest) {
  return axios.get<GetEmployeeReply>(
    `/api/v1/admin/employee/employees/${request.id}`
  );
}

export interface ListEmployeesRequest {
  id?: any;
  name?: string;
  email?: string;
  alias?: number[];
  status?: string[];
  weWorkUserId?: string | number | null;
  weWorkMainDepartmentId?: any;
  roleCodes?: string[];
  isEnable?: any;
  pageIndex?: number;
  pageSize?: number;
  likeName?: string;
}

export interface ListEmployeesReply {
  list: Employee[];
  pageIndex: number;
  pageSize: number;
  total: number;
  children?: any[];
}

export function listEmployees(request: ListEmployeesRequest) {
  return axios.post<ListEmployeesReply>(
    '/api/v1/admin/scrm/organization/wechat/employee/page',
    request
  );
}

export interface SyncEmployeesRequest {
  source: string;
  target: string;
}

export interface SyncEmployeesReply {
  status: boolean;
}

export function syncEmployees(request: SyncEmployeesRequest) {
  return axios.post<SyncEmployeesReply>(
    '/api/v1/admin/employee/employees/actions/sync',
    request
  );
}
