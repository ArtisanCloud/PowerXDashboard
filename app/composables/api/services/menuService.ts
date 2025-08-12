import { useApiClient } from '../index';
import type { ApiResponse } from '../types';

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
  const baseUrl = '/menus';

  return {
    /**
     * 获取用户菜单（根据权限过滤）
     */
    getUserMenus: () => {
      // 模拟菜单数据，用于前端开发测试
      const mockMenuData: MenuItem[] = [
        {
          id: 'dashboard',
          title: '仪表盘',
          icon: 'i-heroicons-home',
          path: '/dashboard',
          order: 1,
          visible: true
        },
        {
          id: 'customers',
          title: '客户管理',
          icon: 'i-heroicons-users',
          order: 2,
          visible: true,
          children: [
            {
              id: 'customer-list',
              title: '客户列表',
              icon: 'i-heroicons-list-bullet',
              path: '/customers',
              order: 1,
              visible: true,
              parentId: 'customers'
            },
            {
              id: 'customer-groups',
              title: '客户分组',
              icon: 'i-heroicons-user-group',
              path: '/customer-groups',
              order: 2,
              visible: true,
              parentId: 'customers'
            }
          ]
        },
        {
          id: 'products',
          title: '产品管理',
          icon: 'i-heroicons-cube',
          order: 3,
          visible: true,
          children: [
            {
              id: 'product-list',
              title: '产品列表',
              icon: 'i-heroicons-squares-2x2',
              path: '/products',
              order: 1,
              visible: true,
              parentId: 'products'
            },
            {
              id: 'product-categories',
              title: '产品分类',
              icon: 'i-heroicons-tag',
              path: '/product-categories',
              order: 2,
              visible: true,
              parentId: 'products'
            }
          ]
        },
        {
          id: 'orders',
          title: '订单管理',
          icon: 'i-heroicons-shopping-cart',
          path: '/orders',
          order: 4,
          visible: true,
          badge: '新'
        },
        {
          id: 'settings',
          title: '系统设置',
          icon: 'i-heroicons-cog-6-tooth',
          order: 5,
          visible: true,
          children: [
            {
              id: 'user-management',
              title: '用户管理',
              icon: 'i-heroicons-user',
              path: '/settings/users',
              order: 1,
              visible: true,
              parentId: 'settings'
            },
            {
              id: 'role-management',
              title: '角色管理',
              icon: 'i-heroicons-shield-check',
              path: '/settings/roles',
              order: 2,
              visible: true,
              parentId: 'settings'
            },
            {
              id: 'system-config',
              title: '系统配置',
              icon: 'i-heroicons-wrench-screwdriver',
              path: '/settings/config',
              order: 3,
              visible: true,
              parentId: 'settings'
            }
          ]
        }
      ];

      // 返回模拟数据
      return Promise.resolve({
        code: 0,
        message: 'success',
        data: mockMenuData
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
      return apiClient.post<ApiResponse<null>>(`${baseUrl}/order`, { menuOrders });
    }
  };
};