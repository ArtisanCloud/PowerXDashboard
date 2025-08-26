import { useApiClient } from "../index";
import type { ApiResponse } from "../types/types";

/** ===== Types ===== */
export interface MenuCategory {
  id: string;
  title: string;
  order: number;
  origin: string;
  children: MenuItem[];
}

export interface MenuItem {
  id: string;
  title: string;
  icon?: string;
  path?: string;
  children?: MenuItem[];
  badge?: string | number;
  order: number;
  visible: boolean;
  origin: string;
  permissions?: string[];
  parentId?: string;
  slot?: string;
}

type MenusResponse = {
  /** 后端将来若提供“已排好序的扁平顶层菜单” */
  menus?: unknown[];
  categories?: unknown[];
};

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

/** ===== Utils ===== */

const SLOT_ROOT = "group.root" as const;

/** DEV 下冻结，帮助发现谁在改顺序 */
function deepFreezeDev<T>(obj: T): T {
  if (process.dev && obj && typeof obj === "object") {
    Object.freeze(obj as any);
    for (const k of Object.keys(obj as any)) {
      const v = (obj as any)[k];
      if (v && typeof v === "object" && !Object.isFrozen(v)) deepFreezeDev(v);
    }
  }
  return obj;
}

/** 将 unknown 规范化为 MenuItem（递归处理 children；不排序） */
function normalizeMenuItem(raw: unknown): MenuItem {
  const n = (raw ?? {}) as Record<string, unknown>;
  const childrenRaw = Array.isArray(n.children) ? n.children : undefined;

  return {
    id: String(n.id ?? ""),
    title: String(n.title ?? ""),
    icon: typeof n.icon === "string" ? n.icon : undefined,
    path: typeof n.path === "string" ? n.path : undefined,
    // 默认 Infinity，避免其他地方“按 order 排”时把无序项顶到前面
    order: Number.isFinite(n.order as number)
      ? Number(n.order)
      : Number.POSITIVE_INFINITY,
    visible: typeof n.visible === "boolean" ? (n.visible as boolean) : true,
    origin: String(n.origin ?? ""),
    permissions: Array.isArray(n.permissions)
      ? (n.permissions as string[])
      : undefined,
    parentId:
      typeof n.parentId === "string" ? (n.parentId as string) : undefined,
    slot: typeof n.slot === "string" ? (n.slot as string) : undefined,
    children: childrenRaw?.map(normalizeMenuItem),
    // badge 保留到页面层处理（翻译等），这里不处理
    badge: ((): MenuItem["badge"] => {
      const b = n.badge;
      if (typeof b === "string" || typeof b === "number") return b;
      return undefined;
    })(),
  };
}

/** 后端顶层排序规则的稳定比较器（仅用于顶层） */
function compareTopLevel(
  a: MenuItem & { _i: number },
  b: MenuItem & { _i: number }
): number {
  const pa = a.slot === SLOT_ROOT ? 0 : 1;
  const pb = b.slot === SLOT_ROOT ? 0 : 1;
  if (pa !== pb) return pa - pb;

  if (a.order !== b.order) return a.order - b.order;

  // title、id 都可能为空字符串；localeCompare 保持一致性
  const ta = a.title ?? "";
  const tb = b.title ?? "";
  if (ta !== tb) return ta.localeCompare(tb);

  const ia = a.id ?? "";
  const ib = b.id ?? "";
  if (ia !== ib) return ia.localeCompare(ib);

  return a._i - b._i; // 兜底：保持稳定
}

/** 优先使用 data.menus（若存在），否则从 categories 恢复顶层 */
function parseMenusFromResponse(resp: unknown): MenuItem[] {
  const data = (resp as any)?.data ?? resp ?? {};
  const menusRaw = Array.isArray((data as any).menus)
    ? ((data as any).menus as unknown[])
    : null;
  if (menusRaw) {
    // 后端已拍好序：仅 normalize，不再排序
    return menusRaw.map(normalizeMenuItem);
  }

  const catsRaw = Array.isArray((data as any).categories)
    ? ((data as any).categories as unknown[])
    : [];

  return toTopLevelMenusFromCategories(catsRaw);
}

/** 从 categories 恢复顶层菜单并按后端规则稳定排序（子级不排序） */
function toTopLevelMenusFromCategories(categories: unknown[]): MenuItem[] {
  if (!Array.isArray(categories)) return [];

  // 扁平化顶层：保持“分类内的相对顺序”，再统一按规则排序
  let seq = 0;
  const flat: (MenuItem & { _i: number })[] = [];

  for (let ci = 0; ci < categories.length; ci++) {
    const cat = (categories[ci] ?? {}) as Record<string, unknown>;
    const children = Array.isArray(cat.children)
      ? (cat.children as unknown[])
      : [];
    for (let j = 0; j < children.length; j++) {
      const item = normalizeMenuItem(children[j]);
      (item as any)._i = seq++;
      flat.push(item as MenuItem & { _i: number });
    }
  }

  flat.sort(compareTopLevel);
  // 移除 _i
  return flat.map(({ _i, ...rest }) => rest);
}

/** ===== Service ===== */

export const useMenuService = () => {
  const apiClient = useApiClient();
  const baseUrl = "/admin/menus";

  return {
    /** 获取用户菜单（根据权限过滤）——只返回顶层扁平 MenuItem[]，顺序符合后端规则 */
    getUserMenus: async () => {
      const res = await apiClient.get<ApiResponse<MenusResponse>>(baseUrl);
      const serverResp = (res?.data ?? res) as ApiResponse<MenusResponse>;
      const menus = parseMenusFromResponse(serverResp);

      deepFreezeDev(menus);

      const normalized: ApiResponse<MenuItem[]> = {
        code: serverResp.code ?? 200,
        message: serverResp.message ?? "success",
        data: menus,
        timestamp: serverResp.timestamp,
      };
      return normalized;
    },

    /** 获取所有菜单（管理员） */
    getAllMenus: async () => {
      const res = await apiClient.get<ApiResponse<MenusResponse>>(baseUrl);
      const serverResp = (res?.data ?? res) as ApiResponse<MenusResponse>;
      const menus = parseMenusFromResponse(serverResp);

      const normalized: ApiResponse<MenuItem[]> = {
        code: serverResp.code ?? 200,
        message: serverResp.message ?? "success",
        data: menus,
        timestamp: serverResp.timestamp,
      };
      return normalized;
    },

    /** 其余 CRUD 直通 */
    getMenu: (id: string) =>
      apiClient.get<ApiResponse<MenuItem>>(`${baseUrl}/${id}`),
    createMenu: (data: MenuCreateParams) =>
      apiClient.post<ApiResponse<MenuItem>>(baseUrl, data),
    updateMenu: (id: string, data: MenuUpdateParams) =>
      apiClient.put<ApiResponse<MenuItem>>(`${baseUrl}/${id}`, data),
    deleteMenu: (id: string) =>
      apiClient.delete<ApiResponse<null>>(`${baseUrl}/${id}`),
    updateMenuOrder: (menuOrders: { id: string; order: number }[]) =>
      apiClient.post<ApiResponse<null>>(`${baseUrl}/order`, { menuOrders }),
  };
};
