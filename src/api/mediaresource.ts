import axios from 'axios';
import { PowerModel, PrefixUriAdminApi } from '@/api/common';

export const UriMediaApi = '/media';

export interface MediaResource extends PowerModel {
  filename: string;
  size: number;
  url: string;
  bucketName: string;
  isLocalStored: boolean;
  contentType: string;
  resourceType: string;
}

export interface CreateMediaResourceReply extends MediaResource {
  isOSS: boolean;
}

export function uploadMediaResource(option: any) {
  // 处理上传事件的逻辑
  const { onSuccess, onError, file } = option;

  // 自定义上传逻辑
  const formData = new FormData();
  formData.append('resource', file);

  // 发送自定义请求
  return axios
    .post<CreateMediaResourceReply>(
      `${PrefixUriAdminApi + UriMediaApi}/media-resources`,
      formData
    )
    .then((response) => {
      // 上传成功
      console.log(response.data);
      onSuccess(response.data);
    })
    .catch((error) => {
      // 上传失败
      onError(error);
    });
}
