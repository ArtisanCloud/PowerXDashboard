import axios from 'axios';

export interface GroupSendText {
  content: string;
}

export interface GroupSendRequest {
  chatType: string;
  externalUserIds: string[];
  text: GroupSendText;
}

export interface ListGroupSendLogRequest {
  limit: number;
  cursor: string;
  chatType: string;
  startTime: string;
  endTime: string;
  creator: string;
}

export interface WeWorkSendList {
  msgId: string;
  createTime: string;
  textContent: string;
  createType: string;
}

export interface ListGroupSendLogReply {
  nextCursor: string;
  sendList: WeWorkSendList[];
}

export function groupSend(request: GroupSendRequest) {
  return axios.post('/api/v1/admin/scrm/operation/group-send', request);
}

export function listGroupSendLog(request: ListGroupSendLogRequest) {
  return axios.get<ListGroupSendLogReply>(
    '/api/v1/admin/scrm/operation/group-send-log',
    { params: request },
  );
}
