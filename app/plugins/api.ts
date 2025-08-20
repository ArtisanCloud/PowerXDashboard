import { defineNuxtPlugin } from '#app';
import { setApiConfig } from '~/composables/api';

export default defineNuxtPlugin((nuxtApp) => {
  // 获取运行时配置
  const config = useRuntimeConfig();
  
  // 设置 API 配置
  setApiConfig({
    baseURL: config.public.apiBase || '/api', // 使用运行时配置的 API 基础路径
    timeout: 10000, // 请求超时时间
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    // 请求拦截器
    requestInterceptors: [
      {
        onRequest: (config) => {
          // 从 cookie 或 localStorage 获取 token
          const token = useCookie('auth_token').value;
          
          // 如果有 token 且不是跳过认证的请求，则添加到请求头
          if (token && !config.skipAuth) {
            config.headers = {
              ...config.headers,
              Authorization: `Bearer ${token}`
            };
          }
          
          return config;
        },
        onRequestError: (error) => {
          console.error('Request error:', error);
          return Promise.reject(error);
        }
      }
    ],
    // 响应拦截器
    responseInterceptors: [
      {
        onResponse: (response) => {
          // 可以在这里统一处理响应数据
          return response;
        },
        onResponseError: (error) => {
          // 处理响应错误，例如 401 未授权、403 禁止访问等
          const statusCode = error?.response?.status;
          
          if (statusCode === 401) {
            // 未授权，清除 token 并重定向到登录页
            const authToken = useCookie('auth_token');
            authToken.value = null;
            
            // 使用 Nuxt 的导航
            const router = useRouter();
            router.push('/users/login');
          }
          
          // 显示错误消息
          if (error?.response?.data?.message) {
            // 这里可以集成您的消息通知系统
            console.error('API Error:', error.response.data.message);
          }
          
          return Promise.reject(error);
        }
      }
    ]
  });
});