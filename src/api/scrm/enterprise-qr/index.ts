/*
 * @Description: 企业活码
 * @Author: George
 * @Date: 2023-06-30 14:00:31
 * @LastEditors: George
 * @LastEditTime: 2023-08-02 15:53:46
 */
import axios from 'axios';

/**
 * @description 客户群活码列表
 */

export interface ReplyList {
  list: any[];
  total: number;
}

export interface GetQrcodeRequest {
  userId?: string;
  name?: string;
  qid?: string;
  state?: number | string;
  pageIndex?: number;
  pageSize?: number;
  GetQrcodeRequest?: number | string;
}

export type GetQrcodeReply = ReplyList;

export function getQrcodeList(request: GetQrcodeRequest) {
  return axios.post<GetQrcodeReply>(
    `/api/v1/admin/scrm/qrcode/wechat/group/page`,
    request
  );
}

/**
 * @description 新增客户群活码
 */

export interface CreateQrcodeRequest {
  qid?: string;
  name: string;
  desc: string;
  owner: string[];
  RealQrcodeLink: string;
  sceneLink: string;
  expiryDate: number | string;
}
export interface CreateQrcodeReply {
  status: number | string;
}
export function createQrcode(request: CreateQrcodeRequest) {
  return axios.post<CreateQrcodeReply>(
    `/api/v1/admin/scrm/qrcode/wechat/group/create`,
    request
  );
}

export function editQrcode(request: CreateQrcodeRequest, qid: string) {
  return axios.patch<CreateQrcodeReply>(
    `/api/v1/admin/scrm/qrcode/wechat/group/update/${qid}`,
    request
  );
}

export function deleteQrcode(qid: string) {
  return axios.delete<any>(`/api/v1/admin/scrm/qrcode/wechat/group/${qid}`);
}

export function enableQrcode(qid: string) {
  return axios.patch<any>(
    `/api/v1/admin/scrm/qrcode/wechat/group/enable/${qid}`
  );
}
export function disableQrcode(qid: string) {
  return axios.patch<any>(
    `/api/v1/admin/scrm/qrcode/wechat/group/disable/${qid}`
  );
}
