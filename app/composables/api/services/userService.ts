import { useApiClient } from "../index";
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
} from "../types/types";

// 用户相关接口类型定义
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserLoginParams {
  email: string;
  password: string;
  remember?: boolean;
}

export interface UserRegisterParams {
  username: string;
  email: string;
  password: string;
}

export interface UserUpdateParams {
  username?: string;
  email?: string;
  avatar?: string;
}

/**
 * 用户服务 API
 */
export const useUserService = () => {
  const apiClient = useApiClient();
  const baseUrl = "/users";

  return {
    /**
     * 用户登录
     */
    login: (params: UserLoginParams) => {
      return apiClient.post<ApiResponse<{ token: string; user: User }>>(
        "/auth/login",
        params
      );
    },

    /**
     * 用户注册
     */
    register: (params: UserRegisterParams) => {
      return apiClient.post<ApiResponse<User>>("/auth/register", params);
    },

    /**
     * 获取当前用户信息
     */
    getCurrentUser: () => {
      return apiClient.get<ApiResponse<User>>("/auth/me");
    },

    /**
     * 退出登录
     */
    logout: () => {
      return apiClient.post<ApiResponse<null>>("/auth/logout");
    },

    /**
     * 获取用户列表
     */
    getUsers: (params?: PaginationParams) => {
      return apiClient.get<ApiResponse<PaginatedResponse<User>>>(baseUrl, {
        params,
      });
    },

    /**
     * 获取指定用户信息
     */
    getUser: (id: string) => {
      return apiClient.get<ApiResponse<User>>(`${baseUrl}/${id}`);
    },

    /**
     * 更新用户信息
     */
    updateUser: (id: string, data: UserUpdateParams) => {
      return apiClient.put<ApiResponse<User>>(`${baseUrl}/${id}`, data);
    },

    /**
     * 删除用户
     */
    deleteUser: (id: string) => {
      return apiClient.delete<ApiResponse<null>>(`${baseUrl}/${id}`);
    },
  };
};
