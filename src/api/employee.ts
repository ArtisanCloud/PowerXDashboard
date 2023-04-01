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
  id: number;
}

export type GetEmployeeReply = Employee;
export function getEmployee(request: GetEmployeeRequest) {
  return axios.get<GetEmployeeReply>(
    `/api/v1/admin/employee/employees/${request.id}`
  );
}

export interface ListEmployeesRequest {
  ids?: number[];
  likeName?: string;
  likeEmail?: string;
  depIds?: number[];
  positions?: string[];
  likePhoneNumber?: string;
  roleCodes?: string[];
  isEnable?: boolean;
  pageIndex?: number;
  pageSize?: number;
}

export interface ListEmployeesReply {
  list: Employee[];
  pageIndex: number;
  pageSize: number;
  total: number;
}

export function listEmployees(request: ListEmployeesRequest) {
  return axios.get<ListEmployeesReply>('/api/v1/admin/employee/employees', {
    params: request,
  });
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

export interface CreateEmployeeRequest {
  account: string;
  name: string;
  nickName?: string;
  desc?: string;
  email: string;
  avatar?: string;
  externalEmail?: string;
  mobilePhone?: string;
  gender: string;
  depId: number;
  position?: string;
  jobTitle?: string;
  password?: string;
}

export interface CreateEmployeeReply {
  id: number;
}

export function createEmployee(request: CreateEmployeeRequest) {
  return axios.post<CreateEmployeeReply>(
    '/api/v1/admin/employee/employees',
    request
  );
}

export interface GetEmployeeOptionsReply {
  positions: string[];
  roles: { roleCode: string; roleName: string }[];
  departments: { departmentId: number; departmentName: string }[];
}

export function getEmployeeOptions() {
  return axios.get<GetEmployeeOptionsReply>('/api/v1/admin/employee/options');
}

export interface UpdateEmployeeRequest {
  id: number;
  name?: string;
  nickName?: string;
  desc?: string;
  email?: string;
  avatar?: string;
  externalEmail?: string;
  mobilePhone?: string;
  gender?: string;
  depId?: number;
  position?: string;
  jobTitle?: string;
  password?: string;
  status?: string;
}

export type UpdateEmployeeReply = Employee;

export function updateEmployee(request: UpdateEmployeeRequest) {
  return axios.patch<UpdateEmployeeReply>(
    `/api/v1/admin/employee/employees/${request.id}`,
    request
  );
}

export interface DeleteEmployeeRequest {
  id: number;
}

export interface DeleteEmployeeReply {
  id: number;
}

export function deleteEmployee(request: DeleteEmployeeRequest) {
  return axios.delete<DeleteEmployeeReply>(
    `/api/v1/admin/employee/employees/${request.id}`
  );
}

export interface ResetPasswordReply {
  status: string;
}

export function resetPassword(userId: number) {
  return axios.post<ResetPasswordReply>(
    `/api/v1/admin/employee/employees/actions/reset-password`,
    {
      userId,
    }
  );
}
