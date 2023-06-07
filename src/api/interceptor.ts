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
    // let each request carry token
    // this example using the JWT token
    // Authorization is a custom headers key
    // please modify it according to the actual situation
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
    // do something
    return Promise.reject(error);
  }
);
// add response interceptors
axios.interceptors.response.use(
  (res) => {
    if (res.status !== 200) {
      Message.error({
        content: (res.data as ErrorResponse).msg || 'Error',
        duration: 5 * 1000,
      });
      return Promise.reject(
        new Error((res.data as ErrorResponse).msg || 'Error')
      );
    }
    return res;
  },
  (error) => {
    Message.error({
      content: error.response.data.msg || 'Request Error',
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);
