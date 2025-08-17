import { useApiClient } from "../index";
import type { ApiResponse } from "../types";

/**
 * 认证相关类型定义
 */
export interface LoginParams {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterParams {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  departmentId?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
  status: "active" | "inactive" | "suspended";
  roles: Role[];
  permissions: Permission[];
  departmentId?: string;
  department?: Department;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface Role {
  id: string;
  name: string;
  code: string;
  description?: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  name: string;
  code: string;
  resource: string;
  action: string;
  description?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  parentId?: string;
  parent?: Department;
  children?: Department[];
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenParams {
  refreshToken: string;
}

export interface ChangePasswordParams {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordParams {
  email: string;
}

export interface ResetPasswordConfirmParams {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * 认证服务 API
 */
export const useAuthService = () => {
  const apiClient = useApiClient();
  const baseUrl = "/auth";

  return {
    /**
     * 用户登录
     */
    login: (data: LoginParams) => {
      return apiClient.post<ApiResponse<LoginResponse>>(
        `${baseUrl}/login`,
        data
      );
    },

    /**
     * 用户注册
     */
    register: (data: RegisterParams) => {
      return apiClient.post<ApiResponse<User>>(`${baseUrl}/register`, data);
    },

    /**
     * 用户登出
     */
    logout: () => {
      return apiClient.post<ApiResponse<null>>(`${baseUrl}/logout`);
    },

    /**
     * 刷新访问令牌
     */
    refreshToken: (data: RefreshTokenParams) => {
      return apiClient.post<ApiResponse<LoginResponse>>(
        `${baseUrl}/refresh`,
        data
      );
    },

    /**
     * 获取当前用户信息
     */
    getCurrentUser: () => {
      return apiClient.get<ApiResponse<User>>(`${baseUrl}/me`);
    },

    /**
     * 更新用户资料
     */
    updateProfile: (data: Partial<User>) => {
      return apiClient.put<ApiResponse<User>>(`${baseUrl}/profile`, data);
    },

    /**
     * 修改密码
     */
    changePassword: (data: ChangePasswordParams) => {
      return apiClient.post<ApiResponse<null>>(
        `${baseUrl}/change-password`,
        data
      );
    },

    /**
     * 重置密码请求
     */
    resetPassword: (data: ResetPasswordParams) => {
      return apiClient.post<ApiResponse<null>>(
        `${baseUrl}/reset-password`,
        data
      );
    },

    /**
     * 确认重置密码
     */
    resetPasswordConfirm: (data: ResetPasswordConfirmParams) => {
      return apiClient.post<ApiResponse<null>>(
        `${baseUrl}/reset-password/confirm`,
        data
      );
    },

    /**
     * 验证令牌有效性
     */
    validateToken: () => {
      return apiClient.get<ApiResponse<{ valid: boolean }>>(
        `${baseUrl}/validate`
      );
    },

    /**
     * 获取用户权限
     */
    getUserPermissions: () => {
      return apiClient.get<ApiResponse<Permission[]>>(`${baseUrl}/permissions`);
    },
  };
};
