import { useApiClient } from "../index";
import { ApiEndpoints } from "../config";

const { get, post } = useApiClient();

export interface Provider {
  name: string;
  displayName: string;
}

export interface Model {
  name: string;
  provider: string;
}

export interface AgentProfile {
  id: number;
  createdAt: string;
  updatedAt: string;
  DeletedAt?: string;
  modality: string;
  provider: string;
  model: string;
  label: string;
  defaults: {
    maxTokens: number;
    stream: boolean;
    temperature: number;
    topP: number;
  };
  capCache: Record<string, any>;
  tags: string[];
}

export interface AgentCredential {
  id: number;
  createdAt: string;
  updatedAt: string;
  DeletedAt?: string;
  name: string;
  provider: string;
  authScheme: string;
  data: {
    api_key: string;
    azure_deployment: string;
    base_url: string;
    organization: string;
    region: string;
  };
}

export interface SaveSettingsPayload {
  modality: string;
  provider: string;
  model: string;
  label?: string;
  defaults: {
    maxTokens: number;
    stream: boolean;
    temperature: number;
    topP: number;
  };
  credentials: {
    name: string;
    provider: string;
    authScheme: string;
    data: {
      api_key: string;
      azure_deployment?: string;
      base_url: string;
      organization?: string;
      region?: string;
    };
  };
}

export interface TestConnectionPayload {
  provider: string;
  credentials: {
    api_key: string;
    base_url: string;
    organization?: string;
    region?: string;
  };
}

export interface TestQuickCallPayload {
  provider: string;
  model: string;
  credentials: {
    api_key: string;
    base_url: string;
    organization?: string;
    region?: string;
  };
  message?: string;
}

export class AISettingService {
  /**
   * 获取可用的供应商列表
   */
  static async getProviders(): Promise<string[]> {
    const response = await get<{ providers: string[] }>(
      ApiEndpoints.ADMIN_AGENTS.PROVIDERS
    );
    return response.providers;
  }

  /**
   * 获取可用的模型列表
   */
  static async getModels(
    provider?: string,
    modality?: string
  ): Promise<string[]> {
    const params = new URLSearchParams();
    if (provider) params.append("provider", provider);
    if (modality) params.append("modality", modality);

    const url = params.toString()
      ? `${ApiEndpoints.ADMIN_AGENTS.MODELS}?${params.toString()}`
      : ApiEndpoints.ADMIN_AGENTS.MODELS;

    const response = await get<{ models: string[] }>(url);
    return response.models;
  }

  /**
   * 保存AI设置
   */
  static async saveSettings(
    payload: SaveSettingsPayload
  ): Promise<{ ok: boolean }> {
    return await post<{ ok: boolean }>(
      ApiEndpoints.ADMIN_AGENTS.SETTINGS_SAVE,
      payload
    );
  }

  /**
   * 测试连接
   */
  static async testConnection(payload: TestConnectionPayload): Promise<any> {
    return await post(ApiEndpoints.ADMIN_AGENTS.TEST_CONNECTION, payload);
  }

  /**
   * 测试快速调用
   */
  static async testQuickCall(payload: TestQuickCallPayload): Promise<any> {
    return await post(ApiEndpoints.ADMIN_AGENTS.TEST_CALL, payload);
  }

  /**
   * 获取配置文件列表
   */
  static async getProfiles(): Promise<{
    env: string;
    profiles: AgentProfile[];
  }> {
    return await get<{ env: string; profiles: AgentProfile[] }>(
      ApiEndpoints.ADMIN_AGENTS.PROFILES
    );
  }

  /**
   * 获取凭证列表
   */
  static async getCredentials(): Promise<{
    env: string;
    credentials: AgentCredential[];
  }> {
    return await get<{ env: string; credentials: AgentCredential[] }>(
      ApiEndpoints.ADMIN_AGENTS.CREDENTIALS
    );
  }
}
