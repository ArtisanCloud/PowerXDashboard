import { useApiClient } from "../index";
import type { ApiResponse } from "../types";

// 菜单项接口定义
export interface MenuItem {
  id: string;
  title: string;
  icon: string;
  path?: string;
  children?: MenuItem[];
  badge?: string | number;
  order: number;
  visible: boolean;
  permissions?: string[];
  parentId?: string;
}

// 菜单创建参数
export interface MenuCreateParams {
  title: string;
  icon: string;
  path?: string;
  parentId?: string;
  order: number;
  visible: boolean;
  permissions?: string[];
  badge?: string | number;
}

// 菜单更新参数
export interface MenuUpdateParams {
  title?: string;
  icon?: string;
  path?: string;
  parentId?: string;
  order?: number;
  visible?: boolean;
  permissions?: string[];
  badge?: string | number;
}

/**
 * 菜单服务 API
 */
export const useMenuService = () => {
  const apiClient = useApiClient();
  const baseUrl = "/menus";

  return {
    /**
     * 获取用户菜单（根据权限过滤）
     */
    getUserMenus: () => {
      // 模拟菜单数据，使用翻译键而不是直接的中文文本
      const mockMenuData: MenuItem[] = [
        {
          id: "agent",
          title: "menu.agent",
          icon: "i-heroicons-chat-bubble-left-right",
          path: "/agent",
          order: 1,
          visible: true,
        },
        {
          id: "workflow",
          title: "menu.workflow",
          icon: "i-heroicons-squares-2x2",
          path: "/workflow",
          order: 2,
          visible: true,
        },
        {
          id: "plugins",
          title: "menu.pluginMarketplace",
          icon: "i-heroicons-puzzle-piece",
          path: "/plugins",
          order: 4,
          visible: true,
        },
        {
          id: "dashboard",
          title: "menu.dashboard",
          icon: "i-heroicons-home",
          path: "/dashboard",
          order: 3,
          visible: true,
        },
        {
          id: "customers",
          title: "menu.customers",
          icon: "i-heroicons-users",
          order: 2,
          visible: true,
          children: [
            {
              id: "customer-list",
              title: "menu.customerList",
              icon: "i-heroicons-list-bullet",
              path: "/customers",
              order: 1,
              visible: true,
              parentId: "customers",
            },
            {
              id: "customer-groups",
              title: "menu.customerGroups",
              icon: "i-heroicons-user-group",
              path: "/customer-groups",
              order: 2,
              visible: true,
              parentId: "customers",
            },
          ],
        },
        {
          id: "products",
          title: "menu.products",
          icon: "i-heroicons-cube",
          order: 4,
          visible: true,
          children: [
            {
              id: "product-list",
              title: "menu.productList",
              icon: "i-heroicons-squares-2x2",
              path: "/products",
              order: 1,
              visible: true,
              parentId: "products",
            },
            {
              id: "product-categories",
              title: "menu.productCategories",
              icon: "i-heroicons-tag",
              path: "/product-categories",
              order: 2,
              visible: true,
              parentId: "products",
            },
          ],
        },
        {
          id: "orders",
          title: "menu.orders",
          icon: "i-heroicons-shopping-cart",
          path: "/orders",
          order: 5,
          visible: true,
          badge: "menu.badge.new",
        },
        {
          id: "settings",
          title: "menu.settings",
          icon: "i-heroicons-cog-6-tooth",
          order: 6,
          visible: true,
          children: [
            {
              id: "user-management",
              title: "menu.userManagement",
              icon: "i-heroicons-user",
              path: "/settings/users",
              order: 1,
              visible: true,
              parentId: "settings",
            },
            {
              id: "role-management",
              title: "menu.roleManagement",
              icon: "i-heroicons-shield-check",
              path: "/settings/roles",
              order: 2,
              visible: true,
              parentId: "settings",
            },
            {
              id: "system-config",
              title: "menu.systemConfig",
              icon: "i-heroicons-wrench-screwdriver",
              path: "/settings/config",
              order: 3,
              visible: true,
              parentId: "settings",
            },
            {
              id: "ai-settings",
              title: "menu.aiSettings",
              icon: "i-heroicons-cpu-chip",
              path: "/settings/ai",
              order: 4,
              visible: true,
              parentId: "settings",
            },
          ],
        },
      ];

      // 返回模拟数据
      return Promise.resolve({
        code: 0,
        message: "success",
        data: mockMenuData,
      });

      // 实际 API 调用（注释掉，使用模拟数据）
      // return apiClient.get<ApiResponse<MenuItem[]>>(`${baseUrl}/user`);
    },

    /**
     * 获取所有菜单（管理员用）
     */
    getAllMenus: () => {
      return apiClient.get<ApiResponse<MenuItem[]>>(baseUrl);
    },

    /**
     * 获取指定菜单信息
     */
    getMenu: (id: string) => {
      return apiClient.get<ApiResponse<MenuItem>>(`${baseUrl}/${id}`);
    },

    /**
     * 创建菜单
     */
    createMenu: (data: MenuCreateParams) => {
      return apiClient.post<ApiResponse<MenuItem>>(baseUrl, data);
    },

    /**
     * 更新菜单
     */
    updateMenu: (id: string, data: MenuUpdateParams) => {
      return apiClient.put<ApiResponse<MenuItem>>(`${baseUrl}/${id}`, data);
    },

    /**
     * 删除菜单
     */
    deleteMenu: (id: string) => {
      return apiClient.delete<ApiResponse<null>>(`${baseUrl}/${id}`);
    },

    /**
     * 更新菜单排序
     */
    updateMenuOrder: (menuOrders: { id: string; order: number }[]) => {
      return apiClient.post<ApiResponse<null>>(`${baseUrl}/order`, {
        menuOrders,
      });
    },
  };
};
