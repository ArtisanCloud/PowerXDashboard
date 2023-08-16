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

// export function uploadMediaImagesInOrder(
//   imageOptions: RequestOption[],
//   onSuccess: (results: any[]) => void,
//   onError: (error: any) => void
// ): UploadRequest {
//   let currentIndex = 0;
//   const results = [];
//
//   const uploadNextImage = () => {
//     if (currentIndex >= imageOptions.length) {
//       // 所有图片上传完成，调用成功回调
//       onSuccess(results);
//       return;
//     }
//
//     const option = imageOptions[currentIndex];
//     const { promise, abort } = uploadMediaImages(option);
//
//     promise
//       .then((result) => {
//         results.push(result);
//         currentIndex++;
//         uploadNextImage(); // 继续上传下一张图片
//       })
//       .catch((error) => {
//         onError(error);
//       });
//
//     option.onAbort = abort; // 将中止上传的函数传递给 RequestOption
//   };
//
//   // 开始上传第一张图片
//   uploadNextImage();
// }
