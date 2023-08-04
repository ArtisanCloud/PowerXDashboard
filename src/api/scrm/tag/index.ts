/*
 * @Description: 标签
 * @Author: George
 * @Date: 2023-06-30 14:00:31
 * @LastEditors: George
 * @LastEditTime: 2023-07-25 22:22:41
 */
import axios from 'axios';

/**
 * @description 客户群活码列表
 */

export interface ReplyList {
  list: any[];
  total: number;
  pageIndex?: number;
  pageSize?: number;
}

export interface GetTagRequest {
  tagIds?: string[];
  groupIds?: string[];
  groupName?: string;
  name?: string;
  Sync?: number | string;
  pageIndex?: number;
  pageSize?: number;
}

export type GetTagReply = ReplyList;

export function getTagList(request: GetTagRequest) {
  return axios.post<GetTagReply>(
    `/api/v1/admin/scrm/tag/wechat/corp/page`,
    request
  );
}

export function getGroupTagList(request: GetTagRequest) {
  return axios.post<GetTagReply>(
    `/api/v1/admin/scrm/tag/wechat/group/page`,
    request
  );
}

/**
 * @description 新增标签
 */
export interface TagList {
  name: string;
  sort: number;
}
export interface AddTagRequest {
  groupId: string;
  groupName: string;
  sort: number;
  agentId?: number;
  tag: TagList[];
}
export interface CreateTagReply {
  status: number | string;
}
export function addTag(request: AddTagRequest) {
  return axios.post<CreateTagReply>(
    `/api/v1/admin/scrm/tag/wechat/crop/create`,
    request
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
    `/api/v1/admin/scrm/tag/wechat/group/action`,
    request
  );
}

interface DeleteTagRequest {
  tagIds?: string[];
  groupIds?: string[];
}
export function deleteTag(request: DeleteTagRequest) {
  return axios.delete<any>(`/api/v1/admin/scrm/tag/wechat/crop/delete`, {
    data: request,
  });
}

export function wechatTagSync() {
  return axios.put<any>(`/api/v1/admin/scrm/tag/wechat/sync`);
}

export function corpOption() {
  return axios.get<any>(`/api/v1/admin/scrm/tag/wechat/corp/option`);
}

export function groupOption() {
  return axios.get<any>(`/api/v1/admin/scrm/tag/wechat/group/option`);
}
export interface CustomerTagList {
  userId: string;
  externalUserId: string;
  addTag?: string[];
  removeTag?: string[];
}
export function customerTag(request: CustomerTagList) {
  return axios.post<any>(
    `/api/v1/admin/scrm/tag/wechat/customer/action`,
    request
  );
}
