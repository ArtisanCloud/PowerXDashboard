import { RequestOption, UploadRequest } from '@arco-design/web-vue';
import { uploadMediaResource } from '@/api/mediaresource';

export default function uploadMediaImages(
  option: RequestOption,
  onSuccess: (data: any) => void
): UploadRequest {
  let isAborted = false; // 标记是否中止上传

  const abort = () => {
    isAborted = true; // 设置标记为中止状态
  };

  const uploadPromise = uploadMediaResource(option)
    .then((result: any) => {
      if (!isAborted) {
        if (result.data) {
          onSuccess(result.data);
          option.onSuccess(result.data);
        } else {
          option.onError(result);
        }
      }
    })
    .catch((error: any) => {
      if (!isAborted) {
        option.onError(error);
      }
    });

  return {
    abort,
    promise: uploadPromise, // 返回上传操作的Promise对象
  };
}
