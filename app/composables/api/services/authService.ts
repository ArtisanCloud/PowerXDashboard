import { useApiClient } from "../index";
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
} from "../types";

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
export interface UserFilters extends PaginationParams {
  department?: string;
  role?: string;
  status?: "active" | "inactive" | "suspended";
  search?: string;
}

export interface RoleFilters extends PaginationParams {
  search?: string;
}

export interface DepartmentFilters extends PaginationParams {
  parentId?: string;
  search?: string;
}

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

    // ========== 用户管理 API ==========
    /**
     * 获取用户列表（分页）
     */
    getUsers: (filters?: UserFilters) => {
      return apiClient.get<ApiResponse<PaginatedResponse<User>>>(
        `${baseUrl}/users`,
        { params: filters }
      );
    },

    /**
     * 获取指定用户
     */
    getUser: (id: string) => {
      return apiClient.get<ApiResponse<User>>(`${baseUrl}/users/${id}`);
    },

    /**
     * 创建用户
     */
    createUser: (data: RegisterParams) => {
      return apiClient.post<ApiResponse<User>>(`${baseUrl}/users`, data);
    },

    /**
     * 更新用户
     */
    updateUser: (id: string, data: Partial<User>) => {
      return apiClient.put<ApiResponse<User>>(`${baseUrl}/users/${id}`, data);
    },

    /**
     * 删除用户
     */
    deleteUser: (id: string) => {
      return apiClient.delete<ApiResponse<null>>(`${baseUrl}/users/${id}`);
    },

    /**
     * 批量删除用户
     */
    batchDeleteUsers: (ids: string[]) => {
      return apiClient.post<ApiResponse<null>>(
        `${baseUrl}/users/batch-delete`,
        {
          ids,
        }
      );
    },

    /**
     * 启用/禁用用户
     */
    toggleUserStatus: (id: string, status: "active" | "inactive") => {
      return apiClient.patch<ApiResponse<User>>(
        `${baseUrl}/users/${id}/status`,
        {
          status,
        }
      );
    },

    // ========== 角色管理 API ==========
    /**
     * 获取角色列表（分页）
     */
    getRoles: (filters?: RoleFilters) => {
      return apiClient.get<ApiResponse<PaginatedResponse<Role>>>(
        `${baseUrl}/roles`,
        { params: filters }
      );
    },

    /**
     * 获取指定角色
     */
    getRole: (id: string) => {
      return apiClient.get<ApiResponse<Role>>(`${baseUrl}/roles/${id}`);
    },

    /**
     * 创建角色
     */
    createRole: (data: Omit<Role, "id" | "createdAt" | "updatedAt">) => {
      return apiClient.post<ApiResponse<Role>>(`${baseUrl}/roles`, data);
    },

    /**
     * 更新角色
     */
    updateRole: (id: string, data: Partial<Role>) => {
      return apiClient.put<ApiResponse<Role>>(`${baseUrl}/roles/${id}`, data);
    },

    /**
     * 删除角色
     */
    deleteRole: (id: string) => {
      return apiClient.delete<ApiResponse<null>>(`${baseUrl}/roles/${id}`);
    },

    /**
     * 分配角色权限
     */
    assignRolePermissions: (roleId: string, permissionIds: string[]) => {
      return apiClient.post<ApiResponse<Role>>(
        `${baseUrl}/roles/${roleId}/permissions`,
        { permissionIds }
      );
    },

    // ========== 部门管理 API ==========
    /**
     * 获取部门列表（分页）
     */
    getDepartments: (filters?: DepartmentFilters) => {
      return apiClient.get<ApiResponse<PaginatedResponse<Department>>>(
        `${baseUrl}/departments`,
        { params: filters }
      );
    },

    /**
     * 获取部门树形结构
     */
    getDepartmentTree: () => {
      return apiClient.get<ApiResponse<Department[]>>(
        `${baseUrl}/departments/tree`
      );
    },

    /**
     * 获取指定部门
     */
    getDepartment: (id: string) => {
      return apiClient.get<ApiResponse<Department>>(
        `${baseUrl}/departments/${id}`
      );
    },

    /**
     * 创建部门
     */
    createDepartment: (
      data: Omit<Department, "id" | "createdAt" | "updatedAt" | "children">
    ) => {
      return apiClient.post<ApiResponse<Department>>(
        `${baseUrl}/departments`,
        data
      );
    },

    /**
     * 更新部门
     */
    updateDepartment: (id: string, data: Partial<Department>) => {
      return apiClient.put<ApiResponse<Department>>(
        `${baseUrl}/departments/${id}`,
        data
      );
    },

    /**
     * 删除部门
     */
    deleteDepartment: (id: string) => {
      return apiClient.delete<ApiResponse<null>>(
        `${baseUrl}/departments/${id}`
      );
    },

    // ========== 权限管理 API ==========
    /**
     * 获取所有权限
     */
    getAllPermissions: () => {
      return apiClient.get<ApiResponse<Permission[]>>(`${baseUrl}/permissions`);
    },

    /**
     * 获取权限分组
     */
    getPermissionGroups: () => {
      return apiClient.get<ApiResponse<Record<string, Permission[]>>>(
        `${baseUrl}/permissions/groups`
      );
    },
  };
};
