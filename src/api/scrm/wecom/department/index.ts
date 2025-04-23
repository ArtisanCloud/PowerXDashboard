/*
 * @Description:
 * @Author: George
 * @Date: 2023-06-13 23:39:18
 * @LastEditors: George
 * @LastEditTime: 2023-08-24 00:40:33
 */
import axios from 'axios';
import { PrefixUriAdmin } from '@/api';
import { UriWeComDepartment } from '@/api/scrm/wecom/base';

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
  WeComParentId?: number;
  WeComDepId?: number;
  refDepartmentId?: number;
  order?: number;
  name?: string;
  // leader: DepartmentLeader;
  phoneNumber?: string;
  email?: string;
  remark?: string;
  children?: DepartmentNode[];
}

export interface WeComDepartment {
  id: number;
  departmentLeader: null;
  name: string;
  nameEn: string;
  order: number;
  refDepartmentId: number;
  weComDepId: number;
  weComParentId: number;
  children: WeComDepartment[];
}

export interface GetDepartmentTreeRequest {
  depId?: number;
}

export interface GetDepartmentTreeReply {
  pageIndex: number;
  pageSize: number;
  total: number;
  list?: DepartmentNode[];
}

export interface GetDepartmentTreeReplyList {
  list: DepartmentNode[];
}

export function getDepartmentTree() {
  return axios.post<GetDepartmentTreeReply>(
    `/api/v1/admin/scrm/wechat/wecom/organization/department/page`,
  );
}

export type CreateWeComDepartmentRequest = WeComDepartment;

export interface CreateWeComDepartmentReply {
  success: boolean;
}

export function createWeComDepartment(request: CreateWeComDepartmentRequest) {
  return axios.post<CreateWeComDepartmentReply>(
    `${PrefixUriAdmin + UriWeComDepartment}`,
    request,
  );
}

export type PatchWeComDepartmentRequest = WeComDepartment;

export interface PatchWeComDepartmentReply {
  id: number;
}

export function patchWeComDepartment(request: PatchWeComDepartmentRequest) {
  return axios.patch<PatchWeComDepartmentReply>(
    `${PrefixUriAdmin + UriWeComDepartment}`,
    request,
  );
}

export interface DeleteWeComDepartmentRequest {
  id: number;
}

export interface DeleteWeComDepartmentReply {
  id: number;
}

export function deleteWeComDepartment(request: DeleteWeComDepartmentRequest) {
  return axios.delete<DeleteWeComDepartmentReply>(
    `${PrefixUriAdmin + UriWeComDepartment}/${request.id}`,
  );
}

export interface GetWeComDepartmentRequest {
  departmentId: number;
}

export interface GetWeComDepartmentReply {
  department: WeComDepartment;
}

export function getWeComDepartment(request: GetWeComDepartmentRequest) {
  return axios.post<GetWeComDepartmentReply>(
    `${PrefixUriAdmin + UriWeComDepartment}/tree`,
    request,
  );
}
