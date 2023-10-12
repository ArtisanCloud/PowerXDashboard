import type { AxiosRequestConfig } from 'axios';
import axios from 'axios';
import { Message } from '@arco-design/web-vue';
import { getToken } from '@/utils/auth';
import qs from 'query-string';

export interface HttpResponse<T = unknown> {
  status: number;
  msg: string;
  code: number;
  data: T;
}

interface ErrorResponse {
  reason: string;
  msg: string;
}

// array
function deepFormatArray(obj: any): any {
  if (typeof obj === 'object') {
    if (Array.isArray(obj)) {
      return JSON.stringify(obj);
    }
    const newObj = {} as any;
    Object.keys(obj).forEach((key) => {
      newObj[key] = deepFormatArray(obj[key]);
    });
    return newObj;
  }
  return obj;
}

// go-zero 接受的array类型为 key=[1,2,3], 特殊处理
axios.defaults.paramsSerializer = (params: any) => {
  return qs.stringify(deepFormatArray(params));
};

if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}

axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    Message.error({
      content: '网络错误, 无法连接到远程服务器',
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  },
);
// add response interceptors
axios.interceptors.response.use(
  (res) => {
    // 如果返回 2xx, 则直接返回数据
    if (res.status >= 200 && res.status < 300) {
      return res;
    }
    // 如果返回 4xx, 则提示错误
    if (res.status >= 400 && res.status < 500) {
      Message.error({
        content: (res.data as ErrorResponse).msg || '违规请求',
        duration: 5 * 1000,
      });
      return Promise.reject(
        new Error((res.data as ErrorResponse).msg || '违规请求'),
      );
    }
    // 如果返回 5xx, 则提示错误
    if (res.status >= 500 && res.status < 600) {
      Message.error({
        content:
          (res.data as ErrorResponse).msg ||
          '服务器错误, 请稍后重试或联系技术支持',
        duration: 5 * 1000,
      });
      return Promise.reject(
        new Error(
          (res.data as ErrorResponse).msg ||
            '服务器错误, 请稍后重试或联系技术支持',
        ),
      );
    }
    return res;
  },
  (error) => {
    Message.error({
      content: error.response.data.msg || '请求错误',
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  },
);
