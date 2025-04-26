import axios from 'axios';
import { PrefixUriAdmin } from '@/api';
import { WeComUser } from '@/api/scrm/wecom/user';
import { UriWeComApp } from '../base';

export interface AllowUserInfos {
  user: WeComUser[];
}

export interface AllowParties {
  partyId: number[];
}
export interface AllowTags {
  tagId: number[];
}

export interface WeComApp {
  agentId: number;
  name: string;
  squareLogoUrl: string;
  description: string;
  allowUserInfos: AllowUserInfos;
  allowParties: AllowParties;
  allowTags: AllowTags;
  close: string;
  redirectDomain: string;
  reportLocationFlag: string;
  isReportEnter: string;
  homeUrl: string;
  customizedPublishStatus: string;
}

/**
 * App
 * @description scrm App管理
 */

export interface GetWechatAppListRequest {
  name?: string;
}

export interface GetWechatAppListReply {
  list: WeComApp[];
}

export function getWeComAppList(request: GetWechatAppListRequest) {
  return axios.post<GetWechatAppListReply>(
    `${PrefixUriAdmin + UriWeComApp}/list`,
    request,
  );
}

/**
 * customer
 * @description 应用详情
 */
export interface GetWechatAppDetailRequest {
  agentId: number;
}

export function wechatAppDetail(request: GetWechatAppDetailRequest) {
  return axios.get<any>('/api/v1/admin/scrm/wechat/wecom/app/detail', {
    params: request,
  });
}
