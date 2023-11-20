import axios from 'axios';
import { PrefixUriAdmin } from '@/api';

export const UriOAMedia = '/wechat/official-account/medias';

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

export interface UploadMediaRequest {
  media: any;
}

export interface UploadMediaReply {
  success: boolean;
  data: any;
}

export function UploadMedia(request: UploadMediaRequest) {
  return axios.post<UploadMediaReply>(
    `${PrefixUriAdmin + UriOAMedia}`,
    request,
  );
}

export interface DeleteMediaRequest {
  mediaId: string;
}

export interface DeleteMediaReply {
  success: boolean;
  data: any;
}

export function DeleteMedia(request: DeleteMediaRequest) {
  return axios.delete<DeleteMediaReply>(
    `${PrefixUriAdmin + UriOAMedia}/${request.mediaId}`,
  );
}
