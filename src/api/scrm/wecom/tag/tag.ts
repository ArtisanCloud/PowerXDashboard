/*
 * @Description: 企微标签
 * @Author: Matrix-X
 * @Date: 2025-04-24 15:00:00
 * @LastEditors: Matrix-X
 * @LastEditTime: 2025-04-24 15:00:00
 */
import axios from 'axios';
import { PrefixUriAdmin } from '@/api';
import { UriWeComTag } from '@/api/scrm/wecom/base';
import { GetCustomersReply } from '@/api/scrm/wecom/customer';

export type WeComTagType = number;
export const WeComTagTypeTag: WeComTagType = 0;
export const WeComTagTypeCorpTag: WeComTagType = 1;
export const WeComTagTypeStrategy: WeComTagType = 2;

export interface WeComCorpTagGroup {
  agentId: number;
  groupId: string;
  name: string;
  sort: number;
  isDelete: string;
}

export interface WeComTag {
  type: number;
  isSelf: number;
  tagId: number;
  groupId: string;
  groupName: string;
  name: string;
  sort: number;
  CorpTagGroup: WeComCorpTagGroup;
}

export function pullSyncWeComTagsAndUsers(request: any) {
  return axios.post<GetCustomersReply>(
    `${PrefixUriAdmin + UriWeComTag}/sync`,
    request,
  );
}

export interface GetWeComTagPageListRequest {
  tagIds?: string[];
  groupIds?: string[];
  groupName?: string;
  name?: string;
  sync?: number | string;
  tagType?: number;
  pageIndex?: number;
  pageSize?: number;
}

export interface GetWeComTagPageListReply {
  list: WeComTag[];
}

export function getWeComTagPageList(request: GetWeComTagPageListRequest) {
  return axios.post<GetWeComTagPageListReply>(
    `${PrefixUriAdmin + UriWeComTag}/page`,
    request,
  );
}

export interface GetTagGroupRequest {
  groupId: string;
}
export interface GetTagGroupReply {
  list: WeComTag[];
}

export function getTagGroupList(request: GetTagGroupRequest) {
  return axios.post<GetTagGroupReply>(
    `${PrefixUriAdmin + UriWeComTag}/groups`,
    request,
  );
}

/**
 * @description 新增标签
 */

export interface AddTagRequest {
  groupId: string;
  groupName: string;
  sort: number;
  agentId?: number;
  tag: WeComTag[];
}
export interface CreateTagReply {
  status: number | string;
}
export function addTag(request: AddTagRequest) {
  return axios.post<CreateTagReply>(
    `/api/v1/admin/scrm/wechat/wecom/tags/crop/create`,
    request,
  );
}
/**
 * @description 编辑标签
 */
export interface ActionTagGroup {
  tagId?: string;
  tagName?: string;
}
export interface EditTagRequest {
  groupId: string;
  tags: ActionTagGroup[];
}

export function editTag(request: EditTagRequest) {
  return axios.post<CreateTagReply>(
    `/api/v1/admin/scrm/wechat/wecom/tags/group/action`,
    request,
  );
}

interface DeleteTagRequest {
  tagIds?: string[];
  groupIds?: string[];
}
export function deleteTag(request: DeleteTagRequest) {
  return axios.delete<any>(`/api/v1/admin/scrm/wechat/wecom/tags/crop/delete`, {
    data: request,
  });
}

export function wechatTagSync() {
  return axios.put<any>(`/api/v1/admin/scrm/wechat/wecom/tags/sync`);
}

export function corpOption() {
  return axios.get<any>(`/api/v1/admin/scrm/wechat/wecom/tags/corp/option`);
}

export function groupOption() {
  return axios.get<any>(`/api/v1/admin/scrm/wechat/wecom/tags/group/option`);
}

export interface CustomerTagList {
  userId: string;
  externalUserId: string;
  addTag?: string[];
  removeTag?: string[];
}
export function customerTag(request: CustomerTagList) {
  return axios.post<any>(
    `/api/v1/admin/scrm/wechat/wecom/tags/customer/action`,
    request,
  );
}
