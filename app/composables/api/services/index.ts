/**
 * API 服务模块统一导出
 */

// 认证服务
export { useAuthService } from "./authService";
export type {
  LoginParams,
  RegisterParams,
  User,
  Role,
  Permission,
  Department,
  LoginResponse,
  RefreshTokenParams,
  ChangePasswordParams,
  ResetPasswordParams,
  ResetPasswordConfirmParams,
  UserFilters,
  RoleFilters,
  DepartmentFilters,
} from "./authService";

// 仪表板服务
export { useDashboardService } from "./dashboardService";
export type {
  DashboardStats,
  ChartData,
  RecentActivity,
  TopProduct,
  TopCustomer,
  DashboardData,
  DashboardFilters,
} from "./dashboardService";

// 插件服务
export { usePluginService } from "./pluginService";
export type {
  Plugin,
  PluginCategory,
  PluginInstallParams,
  PluginUpdateParams,
  PluginConfigParams,
  PluginFilters,
  PluginMarketplaceItem,
} from "./pluginService";

// 设置服务
export { useSettingsService } from "./settingsService";
export type {
  SystemSettings,
  EmailSettings,
  BackupSettings,
  SecuritySettings,
  AISettings,
  AIProvider,
  AIModel,
  LogSettings,
  CacheSettings,
} from "./settingsService";

// 工作流服务
export { useWorkflowService } from "./workflowService";
export type {
  WorkflowCreateParams,
  WorkflowUpdateParams,
  WorkflowFilters,
  WorkflowExecutionParams,
  WorkflowExecution,
  NodeExecution,
  WorkflowTemplate,
  WorkflowListResponse,
  KindsResponse,
  PaletteResponse,
  WorkflowValidationResult,
  WorkflowStats,
} from "./workflowService";

// 其他现有服务（保持兼容性）
export { useUserService } from "./userService";
export { useProductService } from "./productService";
export { useMenuService } from "./menuService";
