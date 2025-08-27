import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useApiClient } from "~/composables/api";

// 权限类型定义
export interface Permission {
  id: number;
  plugin: string;
  resource: string;
  action: string;
  effect: string;
  description?: string;
  status: "active" | "deprecated";
  source?: string;
  introduced?: string;
  deprecated_at?: number | null;
  meta?: {
    label?: string;
    module?: string;
    type?: "menu" | "action" | "api" | "data" | string;
    api_endpoint?: string;
    http_method?: string;
  };
}

// Catalog 类型：module -> type -> Permission[]
export type PermissionCatalog = Record<string, Record<string, Permission[]>>;

// List 查询参数
export interface PermissionListQuery {
  plugin?: string;
  resource?: string;
  action?: string;
  module?: string;
  type?: string;
  status?: "active" | "deprecated";
  keyword?: string;
  page?: number;
  size?: number;
  sort?: string;
}

// List 响应
export interface PermissionListResponse {
  items: Permission[];
  pagination: {
    total: number;
    page: number;
    page_size: number;
    pages: number;
  };
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

export const usePermissionStore = defineStore("permission", () => {
  // 使用 API 客户端
  const { get, post, put, delete: del } = useApiClient();

  // API 基础路径
  const baseUrl = "/admin/iam";

  // 状态
  const catalog = ref<PermissionCatalog>({});
  const listData = ref<PermissionListResponse>({
    items: [],
    pagination: { total: 0, page: 1, page_size: 20, pages: 0 },
  });
  const tenantPermissions = ref<TenantPermission[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const lastSyncTime = ref<number | null>(null);

  // 计算属性
  const catalogTree = computed(() => {
    return Object.entries(catalog.value).map(([module, groups]) => ({
      id: module,
      label: module,
      children: Object.entries(groups).map(([type, items]) => ({
        id: `${module}:${type}`,
        label: type,
        children: items.map((p) => ({
          id: p.id,
          label: p.meta?.label || `${p.resource}:${p.action}`,
          raw: p,
        })),
      })),
    }));
  });

  const enabledPermissionsCount = computed(() => {
    return tenantPermissions.value.filter((tp) => tp.enabled).length;
  });

  const totalPermissionsCount = computed(() => {
    return Object.values(catalog.value)
      .flatMap((groups) => Object.values(groups))
      .flatMap((items) => items).length;
  });

  // 获取权限目录（用于角色授权树形结构）
  const fetchCatalog = async (forceRefresh = false) => {
    if (!forceRefresh && Object.keys(catalog.value).length > 0) {
      return catalog.value;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const response = await get<any>(`${baseUrl}/permissions/catalog`);
      // 处理后端返回的包装结构 { code, message, data, timestamp }
      catalog.value = response.data || response;
      lastSyncTime.value = Date.now();
      return catalog.value;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "获取权限目录失败";
      // 返回模拟数据作为后备
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // 获取权限列表（用于管理表格）
  const fetchList = async (query: PermissionListQuery = {}) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await get<any>(`${baseUrl}/permissions`, {
        params: query,
      });
      // 处理后端返回的包装结构 { code, message, data, timestamp }
      listData.value = response.data || response;
      return listData.value;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "获取权限列表失败";
      // 返回模拟数据作为后备
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // 创建权限（仅 Root 用户）
  const createPermission = async (data: Partial<Permission>) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await post<any>(`${baseUrl}/permissions`, data);
      // 处理后端返回的包装结构 { code, message, data, timestamp }
      const newPermission = response.data || response;
      // 刷新目录缓存
      await fetchCatalog(true);
      return newPermission;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "创建权限失败";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // 更新权限（仅 Root 用户）
  const updatePermission = async (id: number, data: Partial<Permission>) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await put<any>(`${baseUrl}/permissions/${id}`, data);
      // 处理后端返回的包装结构 { code, message, data, timestamp }
      const updatedPermission = response.data || response;
      // 刷新目录缓存
      await fetchCatalog(true);
      return updatedPermission;
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
      await del(`${baseUrl}/permissions/${id}`);
      // 刷新目录缓存
      await fetchCatalog(true);
    } catch (err) {
      error.value = err instanceof Error ? err.message : "删除权限失败";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // 获取租户权限配置
  const fetchTenantPermissions = async (tenantId?: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      const url = tenantId
        ? `${baseUrl}/tenant-permissions?tenant_id=${tenantId}`
        : `${baseUrl}/tenant-permissions`;

      const response = await get<any>(url);
      // 处理后端返回的包装结构 { code, message, data, timestamp }
      tenantPermissions.value = response.data || response;
      return tenantPermissions.value;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "获取租户权限失败";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // 更新租户权限配置
  const updateTenantPermission = async (
    tenantId: string,
    permissionId: number,
    enabled: boolean
  ) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await put<any>(`${baseUrl}/tenant-permissions`, {
        tenant_id: tenantId,
        permission_id: permissionId,
        enabled,
      });

      // 处理后端返回的包装结构 { code, message, data, timestamp }
      const tenantPermission = response.data || response;

      // 更新本地状态
      const index = tenantPermissions.value.findIndex(
        (tp) => tp.tenant_id === tenantId && tp.permission_id === permissionId
      );

      if (index >= 0) {
        tenantPermissions.value[index] = tenantPermission;
      } else {
        tenantPermissions.value.push(tenantPermission);
      }

      return tenantPermission;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "更新租户权限失败";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // 同步权限（刷新目录）
  const syncPermissions = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      await post(`${baseUrl}/permissions/sync`);
      await fetchCatalog(true);
      lastSyncTime.value = Date.now();
    } catch (err) {
      error.value = err instanceof Error ? err.message : "同步权限失败";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    // 状态
    catalog: readonly(catalog),
    listData: readonly(listData),
    tenantPermissions: readonly(tenantPermissions),
    isLoading: readonly(isLoading),
    error: readonly(error),
    lastSyncTime: readonly(lastSyncTime),

    // 计算属性
    catalogTree,
    enabledPermissionsCount,
    totalPermissionsCount,

    // 方法
    fetchCatalog,
    fetchList,
    createPermission,
    updatePermission,
    deletePermission,
    fetchTenantPermissions,
    updateTenantPermission,
    syncPermissions,
  };
});
