import type { ChatMessage, Agent } from "~/types/agent";
import { useSSEChat } from "@/composables/sse/useSSEChat";
import { useWebSocketChat } from "@/composables/websocket/useWebSocketChat";
import { useApiClient } from "~/composables/api";

export type ConnectionType = "sse" | "websocket";

export interface AgentChatOptions {
  connectionType?: ConnectionType;
  sseUrl?: string;
  wsUrl?: string;
  onMessage?: (message: ChatMessage) => void;
  onError?: (error: string) => void;
  onConnectionChange?: (connected: boolean) => void;
}

export function useAgentChat(options: AgentChatOptions = {}) {
  const {
    connectionType = "sse",
    sseUrl = "/api/chat/stream",
    wsUrl = "ws://localhost:3001/ws",
    onMessage,
    onError,
    onConnectionChange,
  } = options;

  const currentConnectionType = ref<ConnectionType>(connectionType);
  const agents = ref<Agent[]>([]);
  const currentAgent = ref<Agent | null>(null);
  const isLoading = ref(false);

  // SSE 聊天实例
  const sseChat = useSSEChat({
    apiUrl: sseUrl,
    onMessage,
    onError,
    onConnectionChange,
  });

  // WebSocket 聊天实例
  const wsChat = useWebSocketChat({
    wsUrl,
    onMessage,
    onError,
    onConnectionChange,
  });

  // 当前活跃的聊天实例
  const activeChat = computed(() => {
    return currentConnectionType.value === "sse" ? sseChat : wsChat;
  });

  // 统一的状态
  const messages = computed(() => activeChat.value.messages);
  const isConnected = computed(() => activeChat.value.isConnected);
  const isConnecting = computed(() => activeChat.value.isConnecting);
  const error = computed(() => activeChat.value.error);

  const apiClient = useApiClient();

  // Agent 管理
  async function loadAgents() {
    isLoading.value = true;
    try {
      const response = await apiClient.get<{ data: Agent[] }>("/api/agents");
      agents.value = response.data || [];

      // 如果没有当前 Agent，选择第一个
      if (!currentAgent.value && agents.value.length > 0) {
        const firstAgent = agents.value[0];
        if (firstAgent) {
          currentAgent.value = firstAgent;
          activeChat.value.setAgent(firstAgent);
        }
      }
    } catch (err) {
      console.error("加载 Agent 列表失败:", err);
      onError?.("加载 Agent 列表失败");
    } finally {
      isLoading.value = false;
    }
  }

  async function createAgent(agentData: Partial<Agent>) {
    isLoading.value = true;
    try {
      const response = await apiClient.post<{ data: Agent }>(
        "/api/agents",
        agentData
      );
      agents.value.push(response.data);
      return response.data;
    } catch (err) {
      console.error("创建 Agent 失败:", err);
      onError?.("创建 Agent 失败");
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateAgent(id: string, agentData: Partial<Agent>) {
    isLoading.value = true;
    try {
      const response = await apiClient.put<{ data: Agent }>(
        `/api/agents/${id}`,
        agentData
      );
      const data = response.data;

      const index = agents.value.findIndex((a) => a.id === id);
      if (index >= 0) {
        agents.value[index] = data;
      }

      // 如果更新的是当前 Agent，也更新当前 Agent
      if (currentAgent.value?.id === id) {
        currentAgent.value = data;
        activeChat.value.setAgent(data);
      }

      return data;
    } catch (err) {
      console.error("更新 Agent 失败:", err);
      onError?.("更新 Agent 失败");
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteAgent(id: string) {
    isLoading.value = true;
    try {
      await apiClient.delete(`/api/agents/${id}`);
      agents.value = agents.value.filter((a) => a.id !== id);

      // 如果删除的是当前 Agent，切换到第一个可用的 Agent
      if (currentAgent.value?.id === id) {
        const firstAvailable = agents.value.length > 0 ? agents.value[0] : null;
        currentAgent.value = firstAvailable;
        activeChat.value.setAgent(firstAvailable);
      }
    } catch (err) {
      console.error("删除 Agent 失败:", err);
      onError?.("删除 Agent 失败");
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  function selectAgent(agent: Agent | null) {
    currentAgent.value = agent;
    activeChat.value.setAgent(agent);
  }

  // 连接类型切换
  async function switchConnectionType(type: ConnectionType) {
    if (currentConnectionType.value === type) {
      return;
    }

    // 断开当前连接
    if (currentConnectionType.value === "sse") {
      sseChat.disconnectChat();
    } else {
      wsChat.disconnectChat();
    }

    // 切换连接类型
    currentConnectionType.value = type;

    // 设置当前 Agent
    activeChat.value.setAgent(currentAgent.value);

    // 建立新连接
    if (type === "sse") {
      sseChat.connectChat();
    } else {
      wsChat.connectChat();
    }
  }

  // 聊天操作
  async function sendMessage(content: string) {
    if (!currentAgent.value) {
      throw new Error("请先选择一个 Agent");
    }

    return await activeChat.value.sendMessage(content, currentAgent.value);
  }

  async function retryMessage(messageId: string) {
    return await activeChat.value.retryMessage(messageId);
  }

  function deleteMessage(messageId: string) {
    activeChat.value.deleteMessage(messageId);
  }

  function clearMessages() {
    activeChat.value.clearMessages();
  }

  // 连接管理 - 带超时看门狗
  async function connectWithTimeout(kind: "sse" | "websocket", ms = 3000) {
    const isConnecting = ref(true);
    let done = false;
    const timer = setTimeout(() => {
      if (done) return;
      done = true;
      isConnecting.value = false;
      onError?.(`${kind.toUpperCase()} 连接超时 (${ms}ms)`);
      // 可选：自动切到另一种协议
      if (kind === "sse") {
        currentConnectionType.value = "websocket";
        connectWithTimeout("websocket");
      }
    }, ms);

    try {
      // 执行实际连接
      if (kind === "sse") {
        sseChat.connectChat();
      } else {
        wsChat.connectChat();
      }

      if (done) return;
      done = true;
      clearTimeout(timer);
      isConnecting.value = false;
      onConnectionChange?.(true);
    } catch (e: any) {
      if (done) return;
      done = true;
      clearTimeout(timer);
      isConnecting.value = false;
      onError?.(e?.message || `${kind} 连接失败`);
      // 可选：失败后自动降级
      if (kind === "sse") {
        currentConnectionType.value = "websocket";
        connectWithTimeout("websocket");
      }
    }
  }

  function connect() {
    connectWithTimeout(currentConnectionType.value);
  }

  function disconnect() {
    if (currentConnectionType.value === "sse") {
      sseChat.disconnectChat();
    } else {
      wsChat.disconnectChat();
    }
  }

  // 初始化
  onMounted(() => {
    loadAgents();
    connect();
  });

  // 组件卸载时清理
  onUnmounted(() => {
    disconnect();
  });

  return {
    // 状态
    messages,
    isConnected,
    isConnecting,
    error,
    isLoading: readonly(isLoading),

    // Agent 相关
    agents: readonly(agents),
    currentAgent: readonly(currentAgent),

    // 连接相关
    currentConnectionType: readonly(currentConnectionType),

    // Agent 管理方法
    loadAgents,
    createAgent,
    updateAgent,
    deleteAgent,
    selectAgent,

    // 连接管理方法
    switchConnectionType,
    connect,
    disconnect,

    // 聊天方法
    sendMessage,
    retryMessage,
    deleteMessage,
    clearMessages,
  };
}
