import type { 
  ApiRequestConfig, 
  HttpMethod, 
  RequestInterceptor, 
  ResponseInterceptor 
} from './types';

// API 客户端配置
interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  requestInterceptors?: RequestInterceptor[];
  responseInterceptors?: ResponseInterceptor[];
}

// 全局 API 配置
let globalConfig: ApiClientConfig = {
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  requestInterceptors: [],
  responseInterceptors: []
};

/**
 * 设置全局 API 配置
 * @param config API 客户端配置
 */
export const setApiConfig = (config: Partial<ApiClientConfig>) => {
  globalConfig = {
    ...globalConfig,
    ...config,
    headers: {
      ...globalConfig.headers,
      ...config.headers
    }
  };
};

/**
 * 处理请求参数，将查询参数添加到 URL
 * @param url 请求 URL
 * @param params 查询参数
 * @returns 处理后的 URL
 */
const handleUrl = (url: string, params?: Record<string, any>): string => {
  if (!params) return url;
  
  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map(v => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`).join('&');
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .join('&');
  
  return queryString ? `${url}${url.includes('?') ? '&' : '?'}${queryString}` : url;
};

/**
 * 处理请求配置
 * @param method HTTP 方法
 * @param url 请求 URL
 * @param data 请求数据
 * @param config 请求配置
 * @returns 处理后的请求配置
 */
const handleRequestConfig = async (
  method: HttpMethod,
  url: string,
  data?: any,
  config: ApiRequestConfig = {}
): Promise<{ url: string; options: RequestInit }> => {
  // 合并全局配置和请求配置
  const mergedConfig: ApiRequestConfig = {
    ...config,
    method,
    headers: {
      ...globalConfig.headers,
      ...config.headers
    }
  };
  
  // 处理 URL
  let fullUrl = url.startsWith('http') ? url : `${globalConfig.baseURL}${url}`;
  fullUrl = handleUrl(fullUrl, config.params);
  
  // 处理请求体
  if (data !== undefined) {
    if (method === 'GET' || method === 'DELETE') {
      // GET 和 DELETE 请求通常不带请求体，将数据作为查询参数
      fullUrl = handleUrl(fullUrl, data);
    } else {
      // POST, PUT, PATCH 请求将数据作为请求体
      mergedConfig.body = JSON.stringify(data);
    }
  }
  
  // 应用请求拦截器
  let finalConfig = mergedConfig;
  for (const interceptor of globalConfig.requestInterceptors || []) {
    if (interceptor.onRequest) {
      finalConfig = await interceptor.onRequest(finalConfig);
    }
  }
  
  // 提取 fetch 选项
  const { params, useGlobalError, useGlobalLoading, skipAuth, ...fetchOptions } = finalConfig;
  
  return {
    url: fullUrl,
    options: fetchOptions as RequestInit
  };
};

/**
 * 处理响应
 * @param response 响应对象
 * @returns 处理后的响应数据
 */
const handleResponse = async (response: Response): Promise<any> => {
  // 检查响应状态
  if (!response.ok) {
    const error: any = new Error(`HTTP error! Status: ${response.status}`);
    error.response = response;
    
    try {
      error.data = await response.json();
    } catch (e) {
      // 如果响应不是 JSON 格式，则使用文本内容
      error.data = await response.text();
    }
    
    throw error;
  }
  
  // 检查内容类型
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  
  return response.text();
};

/**
 * 处理响应拦截器
 * @param response 响应数据
 * @returns 处理后的响应数据
 */
const applyResponseInterceptors = async (response: any): Promise<any> => {
  let result = response;
  
  // 应用响应拦截器
  for (const interceptor of globalConfig.responseInterceptors || []) {
    if (interceptor.onResponse) {
      result = await interceptor.onResponse(result);
    }
  }
  
  return result;
};

/**
 * 处理错误拦截器
 * @param error 错误对象
 * @throws 处理后的错误
 */
const applyErrorInterceptors = async (error: any): Promise<any> => {
  let result = error;
  
  // 应用错误拦截器
  for (const interceptor of globalConfig.responseInterceptors || []) {
    if (interceptor.onResponseError) {
      try {
        result = await interceptor.onResponseError(result);
        // 如果拦截器返回了非错误值，则中断错误链
        if (result !== error) {
          return result;
        }
      } catch (e) {
        result = e;
      }
    }
  }
  
  throw result;
};

/**
 * API 客户端
 * 提供基础的 HTTP 请求方法
 */
export const useApiClient = () => {
  /**
   * 发送 HTTP 请求
   * @param method HTTP 方法
   * @param url 请求 URL
   * @param data 请求数据
   * @param config 请求配置
   * @returns 响应数据
   */
  const request = async <T = any>(
    method: HttpMethod,
    url: string,
    data?: any,
    config: ApiRequestConfig = {}
  ) => {
    try {
      // 处理请求配置
      const { url: fullUrl, options } = await handleRequestConfig(method, url, data, config);
      
      // 使用 useFetch 发送请求，确保 SSR 兼容性
      const { data: responseData, error } = await useFetch(fullUrl, {
        method: method as any,
        body: options.body,
        headers: options.headers,
        // 使用 key 确保请求缓存和去重
        key: `${method}-${fullUrl}-${JSON.stringify(data || {})}`,
        // 转换响应数据
        transform: (response) => response
      });
      
      // 处理错误
      if (error.value) {
        throw error.value;
      }
      
      // 应用响应拦截器
      const result = await applyResponseInterceptors(responseData.value);
      
      return result as T;
    } catch (error) {
      // 应用错误拦截器
      return applyErrorInterceptors(error);
    }
  };
  
  /**
   * 发送 GET 请求
   * @param url 请求 URL
   * @param config 请求配置
   * @returns 响应数据
   */
  const get = <T = any>(url: string, config?: ApiRequestConfig) => {
    return request<T>('GET', url, undefined, config);
  };
  
  /**
   * 发送 POST 请求
   * @param url 请求 URL
   * @param data 请求数据
   * @param config 请求配置
   * @returns 响应数据
   */
  const post = <T = any>(url: string, data?: any, config?: ApiRequestConfig) => {
    return request<T>('POST', url, data, config);
  };
  
  /**
   * 发送 PUT 请求
   * @param url 请求 URL
   * @param data 请求数据
   * @param config 请求配置
   * @returns 响应数据
   */
  const put = <T = any>(url: string, data?: any, config?: ApiRequestConfig) => {
    return request<T>('PUT', url, data, config);
  };
  
  /**
   * 发送 DELETE 请求
   * @param url 请求 URL
   * @param config 请求配置
   * @returns 响应数据
   */
  const del = <T = any>(url: string, config?: ApiRequestConfig) => {
    return request<T>('DELETE', url, undefined, config);
  };
  
  /**
   * 发送 PATCH 请求
   * @param url 请求 URL
   * @param data 请求数据
   * @param config 请求配置
   * @returns 响应数据
   */
  const patch = <T = any>(url: string, data?: any, config?: ApiRequestConfig) => {
    return request<T>('PATCH', url, data, config);
  };
  
  /**
   * 上传文件
   * @param url 请求 URL
   * @param formData 表单数据
   * @param config 请求配置
   * @returns 响应数据
   */
  const upload = <T = any>(url: string, formData: FormData, config?: ApiRequestConfig) => {
    // 上传文件时不设置 Content-Type，让浏览器自动设置
    const uploadConfig: ApiRequestConfig = {
      ...config,
      headers: {
        ...config?.headers
      }
    };
    
    // 删除 Content-Type 让浏览器自动设置
    if (uploadConfig.headers && 'Content-Type' in uploadConfig.headers) {
      delete uploadConfig.headers['Content-Type'];
    }
    
    return request<T>('POST', url, formData, uploadConfig);
  };
  
  return {
    request,
    get,
    post,
    put,
    delete: del, // 'delete' 是 JavaScript 关键字，使用 'del' 作为方法名
    patch,
    upload
  };
};