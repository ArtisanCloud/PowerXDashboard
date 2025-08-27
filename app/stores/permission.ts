import { defineStore } from "pinia";
import { ref, computed } from "vue";

// 权限类型定义
export interface Permission {
  id: number;
  name: string;
  code: string;
  description?: string;
  customCategory?: string | null;
  category?: string | null;
  enabled?: boolean;
  created_at: string;
  updated_at: string;
}

// 租户权限关联类型
export interface TenantPermission {
  id: number;
  tenant_id: string;
  permission_id: number;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

// 权限创建/更新数据类型
export interface PermissionCreateData {
  name: string;
  code: string;
  description?: string;
  category?: string;
}

export const usePermissionStore = defineStore("permission", () => {
  // 状态
  const permissions = ref<Permission[]>([]);
  const tenantPermissions = ref<TenantPermission[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // 计算属性
  const permissionsByCategory = computed(() => {
    const grouped: Record<string, Permission[]> = {};
    permissions.value.forEach((permission) => {
      const category = permission.category || "其他";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(permission);
    });
    return grouped;
  });

  const enabledPermissionsCount = computed(() => {
    return tenantPermissions.value.filter((tp) => tp.enabled).length;
  });

  // 获取所有权限
  const fetchPermissions = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      // 模拟 API 调用
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 模拟权限数据
      permissions.value = [
        {
          id: 1,
          name: "查看用户",
          code: "user.view",
          description: "查看用户列表和详情",
          category: "用户管理",
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
        {
          id: 2,
          name: "创建用户",
          code: "user.create",
          description: "创建新用户",
          category: "用户管理",
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
        {
          id: 3,
          name: "编辑用户",
          code: "user.edit",
          description: "编辑用户信息",
          category: "用户管理",
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
        {
          id: 4,
          name: "删除用户",
          code: "user.delete",
          description: "删除用户",
          category: "用户管理",
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
        {
          id: 5,
          name: "查看角色",
          code: "role.view",
          description: "查看角色列表",
          category: "权限管理",
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
        {
          id: 6,
          name: "创建角色",
          code: "role.create",
          description: "创建新角色",
          category: "权限管理",
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
        {
          id: 7,
          name: "编辑角色",
          code: "role.edit",
          description: "编辑角色信息",
          category: "权限管理",
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
        {
          id: 8,
          name: "删除角色",
          code: "role.delete",
          description: "删除角色",
          category: "权限管理",
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
        {
          id: 9,
          name: "查看产品",
          code: "product.view",
          description: "查看产品列表",
          category: "产品管理",
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
        {
          id: 10,
          name: "创建产品",
          code: "product.create",
          description: "创建新产品",
          category: "产品管理",
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
        {
          id: 11,
          name: "编辑产品",
          code: "product.edit",
          description: "编辑产品信息",
          category: "产品管理",
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
        {
          id: 12,
          name: "删除产品",
          code: "product.delete",
          description: "删除产品",
          category: "产品管理",
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
        {
          id: 13,
          name: "查看订单",
          code: "order.view",
          description: "查看订单列表",
          category: "订单管理",
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
        {
          id: 14,
          name: "处理订单",
          code: "order.process",
          description: "处理订单状态",
          category: "订单管理",
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
        {
          id: 15,
          name: "系统设置",
          code: "system.settings",
          description: "管理系统设置",
          category: "系统管理",
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
      ];
    } catch (err) {
      error.value = err instanceof Error ? err.message : "获取权限列表失败";
    } finally {
      isLoading.value = false;
    }
  };

  // 获取租户权限配置
  const fetchTenantPermissions = async (tenantId: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      // 模拟 API 调用
      await new Promise((resolve) => setTimeout(resolve, 300));

      // 模拟租户权限数据（部分权限已启用）
      tenantPermissions.value = [
        {
          id: 1,
          tenant_id: tenantId,
          permission_id: 1,
          enabled: true,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
        {
          id: 2,
          tenant_id: tenantId,
          permission_id: 2,
          enabled: true,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
        {
          id: 3,
          tenant_id: tenantId,
          permission_id: 3,
          enabled: false,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
        {
          id: 4,
          tenant_id: tenantId,
          permission_id: 9,
          enabled: true,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
        {
          id: 5,
          tenant_id: tenantId,
          permission_id: 10,
          enabled: false,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
        {
          id: 6,
          tenant_id: tenantId,
          permission_id: 13,
          enabled: true,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
      ];
    } catch (err) {
      error.value = err instanceof Error ? err.message : "获取租户权限配置失败";
    } finally {
      isLoading.value = false;
    }
  };

  // 创建权限（仅 Root 用户）
  const createPermission = async (data: PermissionCreateData) => {
    isLoading.value = true;
    error.value = null;

    try {
      // 模拟 API 调用
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newPermission: Permission = {
        id: Math.max(...permissions.value.map((p) => p.id), 0) + 1,
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      permissions.value.push(newPermission);

      return newPermission;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "创建权限失败";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // 更新权限（仅 Root 用户）
  const updatePermission = async (
    id: number,
    data: Partial<PermissionCreateData>
  ) => {
    isLoading.value = true;
    error.value = null;

    try {
      // 模拟 API 调用
      await new Promise((resolve) => setTimeout(resolve, 500));

      const index = permissions.value.findIndex((p) => p.id === id);
      if (index === -1) {
        throw new Error("权限不存在");
      }

      permissions.value[index] = {
        ...permissions.value[index],
        ...data,
        updated_at: new Date().toISOString(),
      };

      return permissions.value[index];
    } catch (err) {
      error.value = err instanceof Error ? err.message : "更新权限失败";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // 删除权限（仅 Root 用户）
  const deletePermission = async (id: number) => {
    isLoading.value = true;
    error.value = null;

    try {
      // 模拟 API 调用
      await new Promise((resolve) => setTimeout(resolve, 500));

      const index = permissions.value.findIndex((p) => p.id === id);
      if (index === -1) {
        throw new Error("权限不存在");
      }

      permissions.value.splice(index, 1);

      // 同时删除相关的租户权限配置
      tenantPermissions.value = tenantPermissions.value.filter(
        (tp) => tp.permission_id !== id
      );
    } catch (err) {
      error.value = err instanceof Error ? err.message : "删除权限失败";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // 启用租户权限
  const enableTenantPermission = async (
    tenantId: string,
    permissionId: number
  ) => {
    try {
      // 模拟 API 调用
      await new Promise((resolve) => setTimeout(resolve, 200));

      const existingIndex = tenantPermissions.value.findIndex(
        (tp) => tp.tenant_id === tenantId && tp.permission_id === permissionId
      );

      if (existingIndex >= 0) {
        tenantPermissions.value[existingIndex].enabled = true;
        tenantPermissions.value[existingIndex].updated_at =
          new Date().toISOString();
      } else {
        // 创建新的租户权限记录
        const newTenantPermission: TenantPermission = {
          id: Math.max(...tenantPermissions.value.map((tp) => tp.id), 0) + 1,
          tenant_id: tenantId,
          permission_id: permissionId,
          enabled: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        tenantPermissions.value.push(newTenantPermission);
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : "启用权限失败";
      throw err;
    }
  };

  // 禁用租户权限
  const disableTenantPermission = async (
    tenantId: string,
    permissionId: number
  ) => {
    try {
      // 模拟 API 调用
      await new Promise((resolve) => setTimeout(resolve, 200));

      const existingIndex = tenantPermissions.value.findIndex(
        (tp) => tp.tenant_id === tenantId && tp.permission_id === permissionId
      );

      if (existingIndex >= 0) {
        tenantPermissions.value[existingIndex].enabled = false;
        tenantPermissions.value[existingIndex].updated_at =
          new Date().toISOString();
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : "禁用权限失败";
      throw err;
    }
  };

  // 批量启用租户权限
  const batchEnableTenantPermissions = async (
    tenantId: string,
    permissionIds: number[]
  ) => {
    try {
      // 模拟 API 调用
      await new Promise((resolve) => setTimeout(resolve, 500));

      for (const permissionId of permissionIds) {
        await enableTenantPermission(tenantId, permissionId);
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : "批量启用权限失败";
      throw err;
    }
  };

  // 批量禁用租户权限
  const batchDisableTenantPermissions = async (
    tenantId: string,
    permissionIds: number[]
  ) => {
    try {
      // 模拟 API 调用
      await new Promise((resolve) => setTimeout(resolve, 500));

      for (const permissionId of permissionIds) {
        await disableTenantPermission(tenantId, permissionId);
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : "批量禁用权限失败";
      throw err;
    }
  };

  // 检查权限是否存在
  const hasPermission = (code: string): boolean => {
    return permissions.value.some((p) => p.code === code);
  };

  // 检查租户是否有特定权限
  const tenantHasPermission = (
    tenantId: string,
    permissionCode: string
  ): boolean => {
    const permission = permissions.value.find((p) => p.code === permissionCode);
    if (!permission) return false;

    const tenantPermission = tenantPermissions.value.find(
      (tp) => tp.tenant_id === tenantId && tp.permission_id === permission.id
    );

    return tenantPermission?.enabled || false;
  };

  // 清除错误
  const clearError = () => {
    error.value = null;
  };

  // 重置状态
  const reset = () => {
    permissions.value = [];
    tenantPermissions.value = [];
    isLoading.value = false;
    error.value = null;
  };

  return {
    // 状态
    permissions,
    tenantPermissions,
    isLoading,
    error,

    // 计算属性
    permissionsByCategory,
    enabledPermissionsCount,

    // 权限管理方法（Root 用户）
    fetchPermissions,
    createPermission,
    updatePermission,
    deletePermission,

    // 租户权限配置方法
    fetchTenantPermissions,
    enableTenantPermission,
    disableTenantPermission,
    batchEnableTenantPermissions,
    batchDisableTenantPermissions,

    // 工具方法
    hasPermission,
    tenantHasPermission,
    clearError,
    reset,
  };
});
