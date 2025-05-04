import axios from 'axios';
import { SceneQRCode } from '@/api/scene';
import { Pagination } from '@/types/global';

/**
 * @description 加入群聊列表
 */

export interface GetGroupChatJoinWayListRequest {
  userId?: string;
  name?: string;
  qId?: string;
  status?: number | string;
  pageIndex?: number;
  pageSize?: number;
  GetGroupChatJoinWayRequest?: number | string;
}

export interface GetGroupChatJoinWayListReply extends Pagination {
  list: SceneQRCode[];
}

export function getGroupChatJoinWayList(
  request: GetGroupChatJoinWayListRequest,
) {
  return axios.post<GetGroupChatJoinWayListReply>(
    `/api/v1/admin/scrm/wechat/wecom/qrcodes/group/page`,
    request,
  );
}

/**
 * @description 新增客户群活码
 */

export interface CreateGroupChatJoinWayRequest {
  qid?: string;
  name: string;
  desc: string;
  owner: string[];
  RealGroupChatJoinWayLink: string;
  sceneLink: string;
  expiryDate: number | string;
}
export interface CreateGroupChatJoinWayReply {
  status: number | string;
}
export function createGroupChatJoinWay(request: CreateGroupChatJoinWayRequest) {
  return axios.post<CreateGroupChatJoinWayReply>(
    `/api/v1/admin/scrm/wechat/wecom/qrcodes/group/create`,
    request,
  );
}

export function editGroupChatJoinWay(
  request: CreateGroupChatJoinWayRequest,
  qid: string,
) {
  return axios.patch<CreateGroupChatJoinWayReply>(
    `/api/v1/admin/scrm/wechat/wecom/qrcodes/group/update/${qid}`,
    request,
  );
}

export function deleteGroupChatJoinWay(qid: string) {
  return axios.delete<any>(
    `/api/v1/admin/scrm/wechat/wecom/qrcodes/group/${qid}`,
  );
}

export function enableGroupChatJoinWay(qid: string) {
  return axios.patch<any>(
    `/api/v1/admin/scrm/wechat/wecom/qrcodes/group/enable/${qid}`,
  );
}
export function disableGroupChatJoinWay(qid: string) {
  return axios.patch<any>(
    `/api/v1/admin/scrm/wechat/wecom/qrcodes/group/disable/${qid}`,
  );
}
