// API响应基础类型
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  timestamp?: number;
}

// 分页响应类型
export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    page_size: number;
    pages: number;
  };
}

// 错误响应类型
export interface ApiError {
  code: number;
  message: string;
  details?: any;
  timestamp?: number;
}

// 导出租户相关类型
export type {
  Tenant,
  TenantUpsertRequest,
  TenantListParams,
} from "../services/tenantService";
