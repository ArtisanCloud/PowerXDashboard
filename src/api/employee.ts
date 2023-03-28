import axios from 'axios';

interface ListEmployeesRequest {
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

interface SyncEmployeesRequest {
  source: string;
  target: string;
}

interface CreateEmployeeRequest {
  account: string;
  name: string;
  nickName?: string;
  desc?: string;
  email: string;
  avatar?: string;
  externalEmail?: string;
  mobilePhone?: string;
  gender?: 'male' | 'female' | 'un_know';
  depId: number;
  position?: string;
  jobTitle?: string;
  password?: string;
}

interface UpdateEmployeeRequest {
  id: number;
  name?: string;
  nickName?: string;
  desc?: string;
  email?: string;
  avatar?: string;
  externalEmail?: string;
  mobilePhone?: string;
  gender?: 'male' | 'female' | 'un_know';
  depId?: number;
  position?: string;
  jobTitle?: string;
  password?: string;
  status?: 'enabled' | 'disabled';
}

interface ResetPasswordRequest {
  userId: number;
}

// 响应参数类型
interface EmployeeDepartment {
  depId: number;
  depName: string;
}

interface Employee {
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

interface GetEmployeeReply {
  employee: Employee;
}

interface ListEmployeesReply {
  list: Employee[];
  pageIndex: number;
  pageSize: number;
  total: number;
}

interface SyncEmployeesReply {
  status: boolean;
}

interface CreateEmployeeReply {
  id: number;
}

interface UpdateEmployeeReply {
  employee: Employee;
}

interface RoleOption {
  roleCode: string;
  roleName: string;
}

interface DepartmentOption {
  departmentId: number;
  departmentName: string;
}

interface GetEmployeeOptionsReply {
  positions: string[];
  roles: RoleOption[];
  departments: DepartmentOption[];
}

interface DeleteEmployeeReply {
  id: number;
}

interface ResetPasswordReply {
  status: string;
}

// API 接口定义
const api = axios.create({
  baseURL: '/api/admin/employee/v1',
});

export function getEmployee(id: number) {
  return api.get<GetEmployeeReply>(`/employees/${id}`);
}

export function listEmployees(request: ListEmployeesRequest) {
  return api.get<ListEmployeesReply>('/employees', { params: request });
}

export function syncEmployees(request: SyncEmployeesRequest) {
  return api.post<SyncEmployeesReply>('/employees/actions/sync', request);
}

export function createEmployee(request: CreateEmployeeRequest) {
  return api.post<CreateEmployeeReply>('/employees', request);
}

export function getEmployeeOptions() {
  return api.get<GetEmployeeOptionsReply>('/options');
}

export function updateEmployee(id: number, request: UpdateEmployeeRequest) {
  return api.patch<UpdateEmployeeReply>(`/employees/${id}`, request);
}

export function deleteEmployee(id: number) {
  return api.delete<DeleteEmployeeReply>(`/employees/${id}`);
}

export function resetPassword(request: ResetPasswordRequest) {
  return api.post<ResetPasswordReply>(
    '/employees/actions/reset-password',
    request
  );
}
