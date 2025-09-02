import { ref, computed, onMounted, onUnmounted, shallowRef } from "vue";
import type { Ref } from "vue";
import type { ChatMessage } from "~/types/message";

export interface DualChannelOptions {
  baseURL?: string;
  sseUrl?: string;
  wsUrl?: string;
  defaultFlowId?: string;
  autoConnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  onMessage?: (message: ChatMessage) => void;
  onError?: (error: Error) => void;
  onComplete?: () => void;
}

export interface ConnectionStatus {
  sse: {
    connected: boolean;
    connecting: boolean;
    error: string | null;
    lastConnected: Date | null;
  };
  ws: {
    connected: boolean;
    connecting: boolean;
    error: string | null;
    lastConnected: Date | null;
  };
}

export interface DualChannelConnection {
  // 状态
  status: Ref<ConnectionStatus>;
  messages: Ref<ChatMessage[]>;
  isConnected: Ref<boolean>;
  isConnecting: Ref<boolean>;
  isGenerating: Ref<boolean>;
  hasErrors: Ref<boolean>;
  currentRequestId: Ref<string>;
  sseActive: Ref<boolean>;
  wsActive: Ref<boolean>;

  // 连接控制
  connect: () => Promise<void>;
  disconnect: () => void;
  reconnectSSE: () => Promise<void>;
  reconnectWS: () => Promise<void>;

  // 聊天功能
  send: (content: string, flowId?: string) => Promise<void>;
  cancel: () => void;
  clearMessages: () => void;

  // 事件监听
  onMessage: (callback: (data: any, channel: "sse" | "ws") => void) => void;
  onError: (callback: (error: Error, channel: "sse" | "ws") => void) => void;
  onStatusChange: (callback: (status: ConnectionStatus) => void) => void;
}

export function useDualChannelConnection(
  options: DualChannelOptions = {}
): DualChannelConnection {
  const {
    baseURL = "/api/agents",
    sseUrl,
    wsUrl,
    defaultFlowId = "chat",
    autoConnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
    onMessage: onMessageCallback,
    onError: onErrorCallback,
    onComplete: onCompleteCallback,
  } = options;

  // 构建完整的 URL
  const fullSSEUrl = sseUrl || `${baseURL}/stream/sse`;
  const fullWSUrl = wsUrl || `${baseURL}/stream/ws`;

  // 状态管理
  const messages = ref<ChatMessage[]>([]);
  const currentRequestId = ref<string>("");

  const status = ref<ConnectionStatus>({
    sse: {
      connected: false,
      connecting: false,
      error: null,
      lastConnected: null,
    },
    ws: {
      connected: false,
      connecting: false,
      error: null,
      lastConnected: null,
    },
  });

  // 连接实例
  const sse = shallowRef<EventSource | null>(null);
  const ws = shallowRef<WebSocket | null>(null);

  // 重连计数器
  let sseReconnectCount = 0;
  let wsReconnectCount = 0;
  let sseReconnectTimer: NodeJS.Timeout | null = null;
  let wsReconnectTimer: NodeJS.Timeout | null = null;

  // 事件回调
  const messageCallbacks: Array<(data: any, channel: "sse" | "ws") => void> =
    [];
  const errorCallbacks: Array<(error: Error, channel: "sse" | "ws") => void> =
    [];
  const statusCallbacks: Array<(status: ConnectionStatus) => void> = [];

  // 计算属性
  const isConnected = computed(
    () => status.value.sse.connected || status.value.ws.connected
  );

  const isConnecting = computed(
    () => status.value.sse.connecting || status.value.ws.connecting
  );

  const hasErrors = computed(
    () => !!status.value.sse.error || !!status.value.ws.error
  );

  const sseActive = computed(() => status.value.sse.connected);
  const wsActive = computed(() => status.value.ws.connected);
  const isGenerating = computed(() => status.value.sse.connected);

  // 触发状态变化回调
  const notifyStatusChange = () => {
    statusCallbacks.forEach((callback) => callback(status.value));
  };

  // 生成请求ID
  const generateRequestId = () => {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // WebSocket 连接管理
  const ensureWS = () => {
    if (ws.value && ws.value.readyState === WebSocket.OPEN) return;

    const protocol = location.protocol === "https:" ? "wss" : "ws";
    const url = `${protocol}://${location.host}${fullWSUrl}?q=_handshake&flow_id=${encodeURIComponent(defaultFlowId)}`;

    status.value.ws.connecting = true;
    notifyStatusChange();

    ws.value = new WebSocket(url);

    ws.value.onopen = () => {
      status.value.ws.connected = true;
      status.value.ws.connecting = false;
      status.value.ws.error = null;
      status.value.ws.lastConnected = new Date();
      wsReconnectCount = 0;
      notifyStatusChange();
      console.log("WebSocket 连接已建立");
    };

    ws.value.onclose = () => {
      status.value.ws.connected = false;
      status.value.ws.connecting = false;
      ws.value = null;
      notifyStatusChange();
      console.log("WebSocket 连接已关闭");

      // 自动重连
      if (wsReconnectCount < maxReconnectAttempts) {
        wsReconnectTimer = setTimeout(() => {
          wsReconnectCount++;
          ensureWS();
        }, reconnectInterval);
      }
    };

    ws.value.onerror = (error) => {
      const err = new Error("WebSocket 连接错误");
      status.value.ws.connected = false;
      status.value.ws.connecting = false;
      status.value.ws.error = err.message;
      notifyStatusChange();

      console.error("WebSocket 错误:", error);
      errorCallbacks.forEach((callback) => callback(err, "ws"));
      onErrorCallback?.(err);
    };

    ws.value.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleWSMessage(data);
        messageCallbacks.forEach((callback) => callback(data, "ws"));
      } catch (error) {
        console.error("WebSocket 消息解析错误:", error);
      }
    };
  };

  // 处理 WebSocket 消息
  const handleWSMessage = (data: any) => {
    switch (data.event) {
      case "progress":
        console.log("进度更新:", data);
        break;
      case "tool_call":
        console.log("工具调用:", data);
        break;
      case "notification":
        console.log("通知:", data);
        break;
      case "heartbeat":
        break;
      default:
        console.log("未知 WebSocket 事件:", data);
    }
  };

  // SSE 连接管理
  const startSSE = (query: string, flowId = defaultFlowId) => {
    stopSSE();

    const url = `${fullSSEUrl}?q=${encodeURIComponent(query)}&flow_id=${encodeURIComponent(flowId)}`;
    const eventSource = new EventSource(url);

    sse.value = eventSource;
    status.value.sse.connecting = true;
    status.value.sse.error = null;
    currentRequestId.value = generateRequestId();
    notifyStatusChange();

    let currentMessage: ChatMessage | null = null;

    eventSource.onopen = () => {
      status.value.sse.connected = true;
      status.value.sse.connecting = false;
      status.value.sse.lastConnected = new Date();
      sseReconnectCount = 0;
      notifyStatusChange();
    };

    eventSource.addEventListener("token", (event: any) => {
      try {
        const data = JSON.parse(event.data);

        if (!currentMessage) {
          currentMessage = {
            id: Date.now().toString(),
            role: "assistant",
            content: "",
            timestamp: new Date(),
          };
          messages.value.push(currentMessage);
        }

        currentMessage.content += data.token || data.content || "";
        onMessageCallback?.(currentMessage);
        messageCallbacks.forEach((callback) => callback(data, "sse"));
      } catch (error) {
        console.error("SSE token 解析错误:", error);
      }
    });

    eventSource.addEventListener("final", (event: any) => {
      try {
        const data = JSON.parse(event.data);
        if (currentMessage) {
          currentMessage.content = data.content || currentMessage.content;
          currentMessage.metadata = data.metadata;
        }
      } catch (error) {
        console.error("SSE final 解析错误:", error);
      }
    });

    eventSource.addEventListener("end", () => {
      stopSSE();
      onCompleteCallback?.();
    });

    eventSource.onerror = (event) => {
      const error = new Error("SSE 连接错误");
      status.value.sse.connected = false;
      status.value.sse.connecting = false;
      status.value.sse.error = error.message;
      notifyStatusChange();

      console.error("SSE 错误:", event);
      errorCallbacks.forEach((callback) => callback(error, "sse"));
      onErrorCallback?.(error);

      // 自动重连
      if (sseReconnectCount < maxReconnectAttempts) {
        sseReconnectTimer = setTimeout(() => {
          sseReconnectCount++;
          // 这里需要重新开始 SSE，但需要保存查询参数
        }, reconnectInterval);
      }
    };
  };

  const stopSSE = () => {
    if (sse.value) {
      sse.value.close();
      sse.value = null;
      status.value.sse.connected = false;
      status.value.sse.connecting = false;
      notifyStatusChange();
    }
  };

  // 连接两个通道
  const connect = async (): Promise<void> => {
    ensureWS();
    // SSE 会在发送消息时启动
  };

  // 断开连接
  const disconnect = (): void => {
    // 清理重连定时器
    if (sseReconnectTimer) {
      clearTimeout(sseReconnectTimer);
      sseReconnectTimer = null;
    }
    if (wsReconnectTimer) {
      clearTimeout(wsReconnectTimer);
      wsReconnectTimer = null;
    }

    stopSSE();

    if (ws.value) {
      ws.value.close();
      ws.value = null;
    }

    // 重置状态
    status.value.sse.connected = false;
    status.value.sse.connecting = false;
    status.value.ws.connected = false;
    status.value.ws.connecting = false;

    notifyStatusChange();
  };

  // 重连 SSE
  const reconnectSSE = async (): Promise<void> => {
    console.log("重连 SSE");
    stopSSE();
    if (sseReconnectTimer) {
      clearTimeout(sseReconnectTimer);
      sseReconnectTimer = null;
    }
    sseReconnectCount = 0;
  };

  // 重连 WebSocket
  const reconnectWS = async (): Promise<void> => {
    console.log("重连 WebSocket");
    if (ws.value) {
      ws.value.close();
      ws.value = null;
    }
    if (wsReconnectTimer) {
      clearTimeout(wsReconnectTimer);
      wsReconnectTimer = null;
    }
    wsReconnectCount = 0;
    setTimeout(() => {
      ensureWS();
    }, 100);
  };

  // 发送消息
  const send = async (content: string, flowId?: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    messages.value.push(userMessage);

    ensureWS();
    startSSE(content, flowId);
  };

  // 取消当前请求
  const cancel = () => {
    console.log("取消当前生成");

    if (ws.value && status.value.ws.connected && currentRequestId.value) {
      ws.value.send(
        JSON.stringify({
          event: "cancel",
          requestId: currentRequestId.value,
        })
      );
    }

    stopSSE();
  };

  // 清空消息
  const clearMessages = () => {
    messages.value = [];
  };

  // 事件监听器
  const onMessage = (
    callback: (data: any, channel: "sse" | "ws") => void
  ): void => {
    messageCallbacks.push(callback);
  };

  const onError = (
    callback: (error: Error, channel: "sse" | "ws") => void
  ): void => {
    errorCallbacks.push(callback);
  };

  const onStatusChange = (
    callback: (status: ConnectionStatus) => void
  ): void => {
    statusCallbacks.push(callback);
  };

  // 生命周期
  onMounted(() => {
    if (autoConnect) {
      connect();
    }
  });

  onUnmounted(() => {
    disconnect();
  });

  return {
    // 状态
    status,
    messages,
    isConnected,
    isConnecting,
    isGenerating,
    hasErrors,
    currentRequestId,
    sseActive,
    wsActive,

    // 连接控制
    connect,
    disconnect,
    reconnectSSE,
    reconnectWS,

    // 聊天功能
    send,
    cancel,
    clearMessages,

    // 事件监听
    onMessage,
    onError,
    onStatusChange,
  };
}
