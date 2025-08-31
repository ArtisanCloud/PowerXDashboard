import type { Agent } from "~/types/agent";
import { useApiClient } from "~/composables/api";

export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  model: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  isActive: boolean;
  capabilities: Array<{
    id: string;
    name: string;
    description: string;
    enabled: boolean;
    config?: Record<string, any>;
  }>;
}

export function useAgentManager() {
  const agents = ref<Agent[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const apiClient = useApiClient();

  // 获取 Agent 列表
  async function fetchAgents(apiUrl?: string) {
    loading.value = true;
    error.value = null;

    // 1) 为本次请求创建 AbortController，并在路由离开/作用域销毁时取消
    const ctl =
      typeof AbortController !== "undefined" ? new AbortController() : null;
    tryOnScopeDispose(() => ctl?.abort());
    if (import.meta.client) {
      // 页面隐藏（切页/后台）也取消，避免"挂后台卡网络"
      const onVis = () => {
        if (document.hidden) ctl?.abort();
      };
      document.addEventListener("visibilitychange", onVis, { once: true });
      tryOnScopeDispose(() =>
        document.removeEventListener("visibilitychange", onVis)
      );
    }

    try {
      // 2) 快失败：5s 超时 + 不重试
      const response = await apiClient.get<{ data: Agent[] }>(
        `${apiUrl || "/api/v1"}/agents`,
        {
          timeout: 5000,
          retry: 0,
          signal: ctl?.signal,
        }
      );

      const list = Array.isArray(response) ? response : (response?.data ?? []);
      agents.value = list;
      return agents.value;
    } catch (e: any) {
      // 3) 404 视为空态；其它错误只记状态，不要阻断页面
      if (e?.status === 404 || e?.statusCode === 404) {
        agents.value = [];
        error.value = "404";
        return agents.value;
      }
      error.value = e?.message || "获取 Agent 列表失败";
      throw e;
    } finally {
      loading.value = false;
    }
  }

  // 创建 Agent
  async function createAgent(apiUrl: string, agentData: Partial<AgentConfig>) {
    loading.value = true;
    error.value = null;

    try {
      const response = await apiClient.post<{ data: Agent }>(
        `${apiUrl}/agents`,
        {
          ...agentData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      );

      const newAgent = response.data;
      agents.value.push(newAgent);
      return newAgent;
    } catch (err) {
      console.error("创建 Agent 失败:", err);
      error.value = "创建 Agent 失败";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // 更新 Agent
  async function updateAgent(
    apiUrl: string,
    agentId: string,
    agentData: Partial<AgentConfig>
  ) {
    loading.value = true;
    error.value = null;

    try {
      const response = await apiClient.put<{ data: Agent }>(
        `${apiUrl}/agents/${agentId}`,
        {
          ...agentData,
          updatedAt: new Date().toISOString(),
        }
      );

      const updatedAgent = response.data;
      const index = agents.value.findIndex((a) => a.id === agentId);
      if (index >= 0) {
        agents.value[index] = updatedAgent;
      }

      return updatedAgent;
    } catch (err) {
      console.error("更新 Agent 失败:", err);
      error.value = "更新 Agent 失败";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // 删除 Agent
  async function deleteAgent(apiUrl: string, agentId: string) {
    loading.value = true;
    error.value = null;

    try {
      await apiClient.delete(`${apiUrl}/agents/${agentId}`);
      agents.value = agents.value.filter((a) => a.id !== agentId);
    } catch (err) {
      console.error("删除 Agent 失败:", err);
      error.value = "删除 Agent 失败";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // 获取单个 Agent
  async function getAgent(apiUrl: string, agentId: string) {
    loading.value = true;
    error.value = null;

    try {
      const response = await apiClient.get<{ data: Agent }>(
        `${apiUrl}/agents/${agentId}`
      );
      return response.data;
    } catch (err) {
      console.error("获取 Agent 失败:", err);
      error.value = "获取 Agent 失败";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // 切换 Agent 状态
  async function toggleAgentStatus(apiUrl: string, agentId: string) {
    const agent = agents.value.find((a) => a.id === agentId);
    if (!agent) {
      throw new Error("Agent 不存在");
    }

    return await updateAgent(apiUrl, agentId, {
      isActive: !agent.isActive,
    });
  }

  // 复制 Agent
  async function duplicateAgent(apiUrl: string, agentId: string) {
    const agent = agents.value.find((a) => a.id === agentId);
    if (!agent) {
      throw new Error("Agent 不存在");
    }

    const duplicatedAgent = {
      ...agent,
      id: `${agent.id}_copy_${Date.now()}`,
      name: `${agent.name} (副本)`,
      createdAt: undefined,
      updatedAt: undefined,
    };

    return await createAgent(apiUrl, duplicatedAgent);
  }

  return {
    // 状态
    agents: readonly(agents),
    loading: readonly(loading),
    error: readonly(error),

    // 方法
    fetchAgents,
    createAgent,
    updateAgent,
    deleteAgent,
    getAgent,
    toggleAgentStatus,
    duplicateAgent,
  };
}
