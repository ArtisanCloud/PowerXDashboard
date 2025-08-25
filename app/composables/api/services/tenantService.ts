// 租户相关API服务
import type { ApiResponse, PaginatedResponse } from "../types";
import { useApiClient } from "../index";

// 租户数据类型
export interface Tenant {
  id: number;
  uuid: string;
  createdAt: string;
  updatedAt: string;
  DeletedAt: string | null;
  key: string;
  name: string;
  status: number;
  plan: string;
  domain: string;
  description: string;
  user_count: number;
}

// 创建/更新租户的请求数据
export interface TenantUpsertRequest {
  key: string;
  name: string;
  plan: string;
  domain: string;
  description: string;
  status: number;
}

// 租户列表查询参数
export interface TenantListParams {
  page?: number;
  page_size?: number;
  status?: number;
  plan?: string;
  search?: string;
}

export class TenantService {
  private api = useApiClient();
  private baseUrl = "/admin/tenants";

  /**
   * 获取租户列表
   */
  async getTenants(
    params: TenantListParams = {}
  ): Promise<ApiResponse<PaginatedResponse<Tenant>>> {
    try {
      return await this.api.get<ApiResponse<PaginatedResponse<Tenant>>>(
        this.baseUrl,
        {
          params,
          loadingMessage: "正在加载租户列表...",
        }
      );
    } catch (error) {
      const { notifyOnce } = useOneShotAlert();
      notifyOnce("获取租户列表失败", "请检查网络连接或稍后重试", "error");
      throw error;
    }
  }

  /**
   * 创建租户
   */
  async createTenant(
    data: TenantUpsertRequest
  ): Promise<ApiResponse<{ id: number }>> {
    try {
      const result = await this.api.post<ApiResponse<{ id: number }>>(
        this.baseUrl,
        data,
        {
          loadingMessage: "正在创建租户...",
        }
      );

      if (result.code === 200) {
        const { notifyOnce } = useOneShotAlert();
        notifyOnce("创建成功", `租户 "${data.name}" 已成功创建`, "success");
      }

      return result;
    } catch (error) {
      const { notifyOnce } = useOneShotAlert();
      notifyOnce("创建租户失败", "请检查输入信息或稍后重试", "error");
      throw error;
    }
  }

  /**
   * 更新或创建租户（Upsert）
   */
  async upsertTenant(
    data: TenantUpsertRequest
  ): Promise<ApiResponse<{ id: number }>> {
    try {
      const result = await this.api.post<ApiResponse<{ id: number }>>(
        `${this.baseUrl}/upsert`,
        data,
        {
          loadingMessage: "正在更新租户...",
        }
      );

      if (result.code === 200) {
        const { notifyOnce } = useOneShotAlert();
        notifyOnce("操作成功", `租户 "${data.name}" 已成功更新`, "success");
      }

      return result;
    } catch (error) {
      const { notifyOnce } = useOneShotAlert();
      notifyOnce("更新租户失败", "请检查输入信息或稍后重试", "error");
      throw error;
    }
  }

  /**
   * 删除租户
   */
  async deleteTenant(id: number): Promise<ApiResponse<{ ok: boolean }>> {
    try {
      const result = await this.api.delete<ApiResponse<{ ok: boolean }>>(
        `${this.baseUrl}/${id}`,
        {
          loadingMessage: "正在删除租户...",
        }
      );

      if (result.code === 200 && result.data.ok) {
        const { notifyOnce } = useOneShotAlert();
        notifyOnce("删除成功", "租户已成功删除", "success");
      }

      return result;
    } catch (error) {
      const { notifyOnce } = useOneShotAlert();
      notifyOnce("删除租户失败", "请稍后重试或联系管理员", "error");
      throw error;
    }
  }

  /**
   * 获取单个租户详情
   */
  async getTenant(id: number): Promise<ApiResponse<Tenant>> {
    try {
      return await this.api.get<ApiResponse<Tenant>>(`${this.baseUrl}/${id}`, {
        loadingMessage: "正在获取租户详情...",
      });
    } catch (error) {
      const { notifyOnce } = useOneShotAlert();
      notifyOnce("获取租户详情失败", "请检查网络连接或稍后重试", "error");
      throw error;
    }
  }
}

// 导出单例实例
export const tenantService = new TenantService();
