import axios from 'axios';
import { PowerModel } from '@/api/common';
import { SortIdItem } from '@/utils/sort-id-item';
import { PrefixUriAdmin } from '@/api/index';

export const UriMediaApi = '/media';

export interface MediaResource extends PowerModel {
  filename: string;
  size: number;
  url: string;
  bucketName: string;
  isLocalStored: boolean;
  contentType: string;
  resourceType: string;
  sortIndex: number;
}

export interface MediaSet {
  coverImage?: MediaResource;
  coverImages?: MediaResource[];
  detailImages?: MediaResource[];
  coverImageId?: number;
  coverImageIds?: number[];
  coverImageIdSortIndexes?: SortIdItem[];
  detailImageIds?: number[];
  detailImageIdSortIndexes?: SortIdItem[];
}

export interface CreateMediaResourceReply extends MediaResource {
  isOSS: boolean;
}

export function uploadMediaResource(option: any, sortIndex: number) {
  // 处理上传事件的逻辑
  const { fileItem } = option;

  // 自定义上传逻辑
  const formData = new FormData();
  formData.append('resource', fileItem.file);

  // 发送自定义请求
  return axios.post<CreateMediaResourceReply>(
    `${PrefixUriAdmin + UriMediaApi}/resources?sortIndex=${sortIndex}`,
    formData
  );
}
