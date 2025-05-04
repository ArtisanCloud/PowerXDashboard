import axios from 'axios';
import { PrefixUriAdmin } from '@/api';
import { UriWeComContactWay } from '@/api/scrm/wecom/base';
import { Pagination } from '@/types/global';
import { SceneQRCode } from '@/api/scene';

/**
 * @description 联系我列表
 */

export const ContactWayUrl = import.meta.env.VITE_BASE_ContactWay_URL;

export interface GetContactWayListRequest {
  userId?: string;
  name?: string;
  qId?: string;
  status?: number | string;
  pageIndex?: number;
  pageSize?: number;
}

export interface GetContactWayListReply extends Pagination {
  list: SceneQRCode[];
}

export function getContactWayList(request: GetContactWayListRequest) {
  return axios.post<GetContactWayListReply>(
    `${PrefixUriAdmin + UriWeComContactWay}/page`,
    request,
  );
}

/**
 * @description 新增客户群活码
 */

export interface CreateContactWayRequest {
  qid?: string;
  name: string;
  desc: string;
  owner: string[];
  RealContactWayLink: string;
  sceneLink: string;
  expiryDate: number | string;
}
export interface CreateContactWayReply {
  status: number | string;
}
export function createContactWay(request: CreateContactWayRequest) {
  return axios.post<CreateContactWayReply>(
    `${PrefixUriAdmin + UriWeComContactWay}/create`,
    request,
  );
}

export function updateContactWay(
  request: CreateContactWayRequest,
  qid: string,
) {
  return axios.patch<CreateContactWayReply>(
    `${PrefixUriAdmin + UriWeComContactWay}/update`,
    request,
  );
}

export function deleteContactWay(qid: string) {
  return axios.delete<any>(`${PrefixUriAdmin + UriWeComContactWay}/${qid}`);
}

export function enableContactWay(qid: string) {
  return axios.patch<any>(
    `${PrefixUriAdmin + UriWeComContactWay}/enable/${qid}`,
  );
}
export function disableContactWay(qid: string) {
  return axios.patch<any>(
    `${PrefixUriAdmin + UriWeComContactWay}/disable/${qid}`,
  );
}

export function syncContactWay() {
  return axios.post<any>(`${PrefixUriAdmin + UriWeComContactWay}/sync`);
}
