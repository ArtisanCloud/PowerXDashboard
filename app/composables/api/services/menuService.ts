import { useApiClient } from "../index";
import type { ApiResponse } from "../types/types";

type MenusPayload = { menus: MenuItem[] };

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

/** 安全取深路径：默认取 resp.data.menus */
function getMenusArray(resp: any): any[] {
  const data = resp?.data ?? resp;
  const arr = data?.menus;
  return Array.isArray(arr) ? arr : [];
}

/** 保证 children 是数组并递归规范化，顺便排序（order->title->id） */
function normalizeTree(list: any[]): MenuItem[] {
  const asArray = (v: any) => (Array.isArray(v) ? v : []);
  const walk = (nodes: any[]): MenuItem[] =>
    nodes
      .filter((n) => n && typeof n === "object")
      .map((n) => {
        const children = walk(asArray(n.children));
        const item: MenuItem = {
          id: String(n.id ?? ""),
          title: String(n.title ?? ""),
          icon: String(n.icon ?? ""),
          path: typeof n.path === "string" ? n.path : undefined,
          order: Number.isFinite(n.order) ? Number(n.order) : 0,
          visible: typeof n.visible === "boolean" ? n.visible : true,
          permissions: Array.isArray(n.permissions) ? n.permissions : undefined,
          parentId: typeof n.parentId === "string" ? n.parentId : undefined,
          children,
          // 透传其它字段（如 origin、badge 等）
          ...n,
        };
        return item;
      })
      .sort((a, b) => {
        const ao = a.order ?? 0;
        const bo = b.order ?? 0;
        if (ao !== bo) return ao - bo;
        if (a.title !== b.title) return a.title.localeCompare(b.title);
        return a.id.localeCompare(b.id);
      });

  return walk(list);
}

/** 从任意响应结构中解析出 MenuItem[]；取不到就返回 []，保证上层永远拿到数组 */
function parseMenusFromResponse(resp: any): MenuItem[] {
  const raw = getMenusArray(resp);
  return normalizeTree(raw);
}

// ===================== Service =====================

export const useMenuService = () => {
  const apiClient = useApiClient();
  const baseUrl = "/admin/menus";

  return {
    /**
     * 获取用户菜单（根据权限过滤）
     * 统一返回 ApiResponse<MenuItem[]>
     */
    getUserMenus: async () => {
      // 如果你现在是“纯前端/本地 JSON”，这里也可以换成 Promise.resolve(本地对象)
      const res = await apiClient.get<ApiResponse<MenusPayload>>(baseUrl);

      // 注意：很多 http 客户端（如 axios）把服务端响应包在 res.data 里
      // 这里先取“外层 data”，再取“内层 data.menus”
      const serverResp = res?.data ?? res; // 兼容不同 http 包
      const menus = parseMenusFromResponse(serverResp);

      const normalized: ApiResponse<MenuItem[]> = {
        code: serverResp.code ?? 200,
        message: serverResp.message ?? "success",
        data: menus,
      };
      return normalized;
    },

    /**
     * 获取所有菜单（管理员用）
     * 统一返回 ApiResponse<MenuItem[]>
     */
    getAllMenus: async () => {
      const res = await apiClient.get<ApiResponse<MenusPayload>>(baseUrl);
      const serverResp = res?.data ?? res;
      const menus = parseMenusFromResponse(serverResp);

      const normalized: ApiResponse<MenuItem[]> = {
        code: serverResp.code ?? 200,
        message: serverResp.message ?? "success",
        data: menus,
      };
      return normalized;
    },

    /**
     * 获取指定菜单信息（保持直通）
     */
    getMenu: (id: string) => {
      return apiClient.get<ApiResponse<MenuItem>>(`${baseUrl}/${id}`);
    },

    /**
     * 创建菜单（直通）
     */
    createMenu: (data: MenuCreateParams) => {
      return apiClient.post<ApiResponse<MenuItem>>(baseUrl, data);
    },

    /**
     * 更新菜单（直通）
     */
    updateMenu: (id: string, data: MenuUpdateParams) => {
      return apiClient.put<ApiResponse<MenuItem>>(`${baseUrl}/${id}`, data);
    },

    /**
     * 删除菜单（直通）
     */
    deleteMenu: (id: string) => {
      return apiClient.delete<ApiResponse<null>>(`${baseUrl}/${id}`);
    },

    /**
     * 更新菜单排序（直通）
     */
    updateMenuOrder: (menuOrders: { id: string; order: number }[]) => {
      return apiClient.post<ApiResponse<null>>(`${baseUrl}/order`, {
        menuOrders,
      });
    },
  };
};

// 模拟菜单数据，使用翻译键而不是直接的中文文本
// const mockMenuData: MenuItem[] = [
//   {
//     id: "agent",
//     title: "menu.agent",
//     icon: "i-heroicons-chat-bubble-left-right",
//     path: "/agent",
//     order: 1,
//     visible: true,
//   },
//   {
//     id: "workflow",
//     title: "menu.workflow",
//     icon: "i-heroicons-squares-2x2",
//     path: "/workflow",
//     order: 2,
//     visible: true,
//   },
//   {
//     id: "plugins",
//     title: "menu.pluginMarketplace",
//     icon: "i-heroicons-puzzle-piece",
//     path: "/plugins",
//     order: 4,
//     visible: true,
//   },
//   {
//     id: "dashboard",
//     title: "menu.dashboard",
//     icon: "i-heroicons-home",
//     path: "/dashboard",
//     order: 3,
//     visible: true,
//   },
//   {
//     id: "settings",
//     title: "menu.settings",
//     icon: "i-heroicons-cog-6-tooth",
//     order: 6,
//     visible: true,
//     children: [
//       {
//         id: "user-management",
//         title: "menu.userManagement",
//         icon: "i-heroicons-user",
//         path: "/settings/users",
//         order: 1,
//         visible: true,
//         parentId: "settings",
//       },
//       {
//         id: "role-management",
//         title: "menu.roleManagement",
//         icon: "i-heroicons-shield-check",
//         path: "/settings/roles",
//         order: 2,
//         visible: true,
//         parentId: "settings",
//       },
//       {
//         id: "system-config",
//         title: "menu.systemConfig",
//         icon: "i-heroicons-wrench-screwdriver",
//         path: "/settings/config",
//         order: 3,
//         visible: true,
//         parentId: "settings",
//       },
//       {
//         id: "ai-settings",
//         title: "menu.aiSettings",
//         icon: "i-heroicons-cpu-chip",
//         path: "/settings/ai",
//         order: 4,
//         visible: true,
//         parentId: "settings",
//       },
//     ],
//   },
// ];

// 返回模拟数据
// return Promise.resolve({
//   code: 0,
//   message: "success",
//   data: mockMenuData,
// });
