import { PowerModel, PrefixUriAdmin } from '@/api/common';
import axios from 'axios';
import { MediaSet } from '@/api/mediaresource';

export const UriMarket = '/market';
const UriMedia = '/medias';

export interface Media extends PowerModel, MediaSet {
  name: string;
  employeeId: number;
  contactNumber: string;
  coverURL: string;
  address: string;
  longitude: number;
  latitude: number;
  startWork: string;
  sndWork: string;
}

export interface ListMediaPageRequest {
  ids?: number[];
  likeName?: string;
  storeIds?: number[];
  pageIndex?: number;
  pageSize?: number;
}

export interface ListMediaPageReply {
  list: Media[];
  pageIndex: number;
  pageSize: number;
  total: number;
}

export function listMedias(request: ListMediaPageRequest) {
  return axios.get<ListMediaPageReply>(
    `${PrefixUriAdmin + UriMarket + UriMedia}+"page-list"`,
    {
      params: request,
    }
  );
}

export function createMedia(request: Media) {
  return axios.post<Media>(`${PrefixUriAdmin + UriMarket + UriMedia}`, request);
}

export function updateMedia(request: Media) {
  return axios.put<Media>(
    `${PrefixUriAdmin + UriMarket + UriMedia} + ${request.id}`,
    request
  );
}

export interface DeleteMediaRequest {
  id: number;
}

export interface DeleteMediaReply {
  id: number;
}

export function deleteMedia(request: DeleteMediaRequest) {
  return axios.delete<DeleteMediaReply>(
    `${PrefixUriAdmin + UriMarket + UriMedia} + ${request.id}`
  );
}
