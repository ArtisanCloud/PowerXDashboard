import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  useRoleService,
  type Role,
  type RoleListParams,
  type RoleCreateParams,
  type RoleUpdateParams,
} from "~/composables/api/services/roleService";

export const useRoleStore = defineStore("role", () => {
  const roleService = useRoleService();

  // 状态
  const roles = ref<Role[]>([]);
  const currentRole = ref<Role | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // 分页信息
  const pagination = ref({
    total: 0,
    page: 1,
    page_size: 20,
    pages: 1,
  });

  // 计算属性
  const systemRoles = computed(() =>
    roles.value.filter((role) => role.scope === "system")
  );

  const tenantRoles = computed(() =>
    roles.value.filter((role) => role.scope === "tenant")
  );

  const builtinRoles = computed(() =>
    roles.value.filter((role) => role.builtin)
  );

  const customRoles = computed(() =>
    roles.value.filter((role) => !role.builtin)
  );

  // 操作方法
  const fetchRoles = async (params?: RoleListParams) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await roleService.getRoles(params);

      if (response.code === 200 && response.data) {
        roles.value = response.data.items;
        pagination.value = response.data.pagination;
      } else {
        throw new Error(response.message || "获取角色列表失败");
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : "获取角色列表失败";
      console.error("获取角色列表失败:", err);
    } finally {
      loading.value = false;
    }
  };

  const fetchRole = async (id: number) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await roleService.getRole(id);

      if (response.code === 200 && response.data) {
        currentRole.value = response.data;
        return response.data;
      } else {
        throw new Error(response.message || "获取角色信息失败");
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : "获取角色信息失败";
      console.error("获取角色信息失败:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createRole = async (data: RoleCreateParams) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await roleService.createRole(data);

      if (response.code === 200 && response.data) {
        // 添加到本地状态
        roles.value.push(response.data);
        return response.data;
      } else {
        throw new Error(response.message || "创建角色失败");
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : "创建角色失败";
      console.error("创建角色失败:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateRole = async (id: number, data: RoleUpdateParams) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await roleService.updateRole(id, data);

      if (response.code === 200) {
        // 更新本地状态
        const index = roles.value.findIndex((role) => role.id === id);
        if (index !== -1) {
          roles.value[index] = { ...roles.value[index], ...data };
        }

        // 如果当前角色是被更新的角色，也更新它
        if (currentRole.value?.id === id) {
          currentRole.value = { ...currentRole.value, ...data };
        }

        return true;
      } else {
        throw new Error(response.message || "更新角色失败");
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : "更新角色失败";

      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteRole = async (id: number) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await roleService.deleteRole(id);

      if (response.code === 200) {
        // 从本地状态中移除
        const index = roles.value.findIndex((role) => role.id === id);
        if (index !== -1) {
          roles.value.splice(index, 1);
        }

        // 如果删除的是当前角色，清空当前角色
        if (currentRole.value?.id === id) {
          currentRole.value = null;
        }

        // 更新分页信息
        pagination.value.total = Math.max(0, pagination.value.total - 1);

        return true;
      } else {
        throw new Error(response.message || "删除角色失败");
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : "删除角色失败";
      console.error("删除角色失败:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 重置状态
  const resetState = () => {
    roles.value = [];
    currentRole.value = null;
    loading.value = false;
    error.value = null;
    pagination.value = {
      total: 0,
      page: 1,
      page_size: 20,
      pages: 1,
    };
  };

  // 清除错误
  const clearError = () => {
    error.value = null;
  };

  return {
    // 状态
    roles,
    currentRole,
    loading,
    error,
    pagination,

    // 计算属性
    systemRoles,
    tenantRoles,
    builtinRoles,
    customRoles,

    // 方法
    fetchRoles,
    fetchRole,
    createRole,
    updateRole,
    deleteRole,
    resetState,
    clearError,
  };
});
