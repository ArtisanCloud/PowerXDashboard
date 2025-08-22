import { useApiClient } from "../index";
import type { ApiResponse } from "../types/types";

// 部门接口定义
export interface Department {
  id: number;
  name: string;
  parent_id?: number;
  children?: Department[];
}

// 部门创建参数
export interface DepartmentCreateParams {
  name: string;
  parent_id?: number;
}

// 部门更新参数
export interface DepartmentUpdateParams {
  name?: string;
  parent_id?: number;
}

/**
 * 从任意响应结构中解析出部门树形结构；取不到就返回 []，保证上层永远拿到数组
 */
function parseDepartmentsFromResponse(resp: any): Department[] {
  const data = resp?.data ?? resp;
  const departments = Array.isArray(data) ? data : [];
  return normalizeDepartmentTree(departments);
}

/**
 * 规范化部门树结构，确保数据格式一致
 */
function normalizeDepartmentTree(departments: any[]): Department[] {
  return departments
    .filter((dept) => dept && typeof dept === "object")
    .map((dept) => {
      const children = Array.isArray(dept.children)
        ? normalizeDepartmentTree(dept.children)
        : undefined;

      const item: Department = {
        id: Number(dept.id),
        name: String(dept.name || ""),
        parent_id:
          typeof dept.parent_id === "number" ? dept.parent_id : undefined,
        children,
        ...dept,
      };

      return item;
    });
}

/**
 * 部门服务 API
 */
export function useDepartmentService() {
  const apiClient = useApiClient();
  const baseUrl = "/admin/organization/departments";

  return {
    /**
     * 获取部门树形结构
     * 统一返回 Department[]
     */
    getDepartmentTree: async (): Promise<Department[]> => {
      try {
        const res = await apiClient.get<ApiResponse<Department[]>>(
          `${baseUrl}/tree`
        );
        const serverResp = res?.data ?? res;
        // console.log("获取部门树形结构成功:", serverResp);
        return parseDepartmentsFromResponse(serverResp);
      } catch (error) {
        console.error("获取部门树形结构失败:", error);
        return [];
      }
    },

    /**
     * 创建部门
     */
    createDepartment: async (
      data: DepartmentCreateParams
    ): Promise<Department | null> => {
      try {
        const res = await apiClient.post<ApiResponse<Department>>(
          baseUrl,
          data
        );
        const serverResp = res?.data ?? res;
        return serverResp.data;
      } catch (error) {
        console.error("创建部门失败:", error);
        return null;
      }
    },

    /**
     * 更新部门
     */
    updateDepartment: async (
      id: number,
      data: DepartmentUpdateParams
    ): Promise<Department | null> => {
      try {
        const res = await apiClient.put<ApiResponse<Department>>(
          `${baseUrl}/${id}`,
          data
        );
        const serverResp = res?.data ?? res;
        return serverResp.data;
      } catch (error) {
        console.error("更新部门失败:", error);
        return null;
      }
    },

    /**
     * 删除部门
     */
    deleteDepartment: async (id: number): Promise<boolean> => {
      try {
        await apiClient.delete<ApiResponse<null>>(`${baseUrl}/${id}`);
        return true;
      } catch (error) {
        console.error("删除部门失败:", error);
        return false;
      }
    },

    /**
     * 获取指定部门信息
     */
    getDepartment: async (id: number): Promise<Department | null> => {
      try {
        const res = await apiClient.get<ApiResponse<Department>>(
          `${baseUrl}/${id}`
        );
        const serverResp = res?.data ?? res;
        return serverResp.data;
      } catch (error) {
        console.error("获取部门信息失败:", error);
        return null;
      }
    },
  };
}
