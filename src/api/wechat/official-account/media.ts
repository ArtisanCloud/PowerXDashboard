import axios from 'axios';
import { PrefixUriAdmin } from '@/api';

const UriOAMedia = '/wechat/official-account/medias';

export interface GetMediaRequest {
  mediaId: string;
}

export interface GetMediaReply {
  success: boolean;
  data: any;
}

export function GetMedia(request: GetMediaRequest) {
  return axios.get<GetMediaReply>(
    `${PrefixUriAdmin + UriOAMedia}/${request.mediaId}`,
  );
}

export interface GetMediaOtherListRequest {
  type: string;
  offset?: number;
  count?: number;
}

export interface GetMediaOtherListReply {
  total_count: number;
  item_count?: number;
  item: any;
}

export function GetMediaOtherList(request: GetMediaOtherListRequest) {
  return axios.post<GetMediaOtherListReply>(
    `${PrefixUriAdmin + UriOAMedia}/page-list`,
    request,
  );
}
