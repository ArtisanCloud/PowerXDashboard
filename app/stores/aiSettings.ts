import { defineStore } from "pinia";
import {
  AISettingService,
  type AgentProfile,
  type AgentCredential,
  type SaveSettingsPayload,
} from "~/composables/api/services/AISettingService";

export interface AISettingsState {
  providers: string[];
  models: string[];
  profiles: AgentProfile[];
  credentials: AgentCredential[];
  currentEnv: string;
  loading: boolean;
  saving: boolean;
  testing: boolean;
  lastTestMessage: string;
}

export const useAISettingsStore = defineStore("aiSettings", {
  state: (): AISettingsState => ({
    providers: [],
    models: [],
    profiles: [],
    credentials: [],
    currentEnv: "default",
    loading: false,
    saving: false,
    testing: false,
    lastTestMessage: "",
  }),

  getters: {
    /**
     * 根据模态获取配置文件
     */
    getProfileByModality: (state) => (modality: string) => {
      return (
        (state.profiles ?? []).find?.(
          (profile) => profile.modality === modality
        ) ?? null
      );
    },

    /**
     * 根据供应商获取凭证
     */
    getCredentialByProvider: (state) => (provider: string) => {
      return (
        (state.credentials ?? []).find?.(
          (credential) =>
            credential.provider.toLowerCase() === provider.toLowerCase()
        ) ?? null
      );
    },

    /**
     * 检查是否有配置
     */
    hasConfiguration: (state) => (modality: string) => {
      const profile = (state.profiles ?? []).find?.(
        (p) => p.modality === modality
      );
      const credential = profile
        ? (state.credentials ?? []).find?.(
            (c) => c.provider.toLowerCase() === profile.provider.toLowerCase()
          )
        : null;
      return !!(profile && credential);
    },
  },

  actions: {
    /**
     * 初始化数据
     */
    async initialize() {
      this.loading = true;
      try {
        const [providers, profiles, credentials] = await Promise.all([
          AISettingService.getProviders(),
          AISettingService.getProfiles(),
          AISettingService.getCredentials(),
        ]);

        // 确保数据结构正确，添加兜底
        this.providers = providers ?? [];
        this.profiles = profiles?.profiles ?? [];
        this.credentials = credentials?.credentials ?? [];
        this.currentEnv = profiles?.env || credentials?.env || "default";
      } catch (error) {
        console.error("初始化AI设置失败:", error);
        // 保底：保证是数组，避免后续 .find/.length 崩掉
        this.providers = this.providers ?? [];
        this.profiles = this.profiles ?? [];
        this.credentials = this.credentials ?? [];
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * 获取供应商列表
     */
    async fetchProviders() {
      try {
        this.providers = await AISettingService.getProviders();
      } catch (error) {
        console.error("获取供应商列表失败:", error);
        throw error;
      }
    },

    /**
     * 获取模型列表
     */
    async fetchModels(provider?: string, modality?: string, env?: string) {
      // 关键：参数不全就短路
      if (!provider || !modality) {
        this.models = [];
        return;
      }

      try {
        const res = await AISettingService.getModels(
          provider,
          modality,
          env ?? this.currentEnv
        );
        this.models = res ?? [];
      } catch (error) {
        console.error("获取模型列表失败:", error);
        this.models = [];
        throw error;
      }
    },

    /**
     * 获取配置文件
     */
    async fetchProfiles() {
      try {
        const response = await AISettingService.getProfiles();
        this.profiles = response.profiles;
        this.currentEnv = response.env;
      } catch (error) {
        console.error("获取配置文件失败:", error);
        throw error;
      }
    },

    /**
     * 获取凭证
     */
    async fetchCredentials() {
      try {
        const response = await AISettingService.getCredentials();
        this.credentials = response.credentials;
        if (response.env) {
          this.currentEnv = response.env;
        }
      } catch (error) {
        console.error("获取凭证失败:", error);
        throw error;
      }
    },

    /**
     * 保存设置
     */
    async saveSettings(payload: SaveSettingsPayload) {
      this.saving = true;
      try {
        const result = await AISettingService.saveSettings(payload);
        if (result.ok) {
          // 重新获取配置文件和凭证
          await Promise.all([this.fetchProfiles(), this.fetchCredentials()]);
          this.lastTestMessage = "设置保存成功";
        }
        return result;
      } catch (error) {
        console.error("保存设置失败:", error);
        this.lastTestMessage = `保存失败: ${error instanceof Error ? error.message : "未知错误"}`;
        throw error;
      } finally {
        this.saving = false;
      }
    },

    /**
     * 测试连接
     */
    async testConnection(provider: string, credentials: any) {
      this.testing = true;
      try {
        const result = await AISettingService.testConnection({
          provider,
          credentials,
        });
        this.lastTestMessage = `连接测试成功 - Provider: ${provider}`;
        return result;
      } catch (error) {
        console.error("连接测试失败:", error);
        this.lastTestMessage = `连接测试失败: ${error instanceof Error ? error.message : "未知错误"}`;
        throw error;
      } finally {
        this.testing = false;
      }
    },

    /**
     * 测试快速调用
     */
    async testQuickCall(
      provider: string,
      model: string,
      credentials: any,
      message = "Hello, this is a test message."
    ) {
      this.testing = true;
      try {
        const result = await AISettingService.testQuickCall({
          provider,
          model,
          credentials,
          message,
        });
        this.lastTestMessage = `快速调用测试成功 - Model: ${model}`;
        return result;
      } catch (error) {
        console.error("快速调用测试失败:", error);
        this.lastTestMessage = `快速调用测试失败: ${error instanceof Error ? error.message : "未知错误"}`;
        throw error;
      } finally {
        this.testing = false;
      }
    },

    /**
     * 清除测试消息
     */
    clearTestMessage() {
      this.lastTestMessage = "";
    },
  },
});
