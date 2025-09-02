import { ref, computed, watchEffect, type Ref, type ComputedRef } from "vue";
import { useApiClient } from "~/composables/api";
import { useRuntimeConfig } from "#imports";

export interface DualChannelConnection {
  // 连接状态
  sseActive: Ref<boolean>;
  wsActive: Ref<boolean>;

  // 当前请求ID
  currentRequestId: Ref<string | null>;

  // 连接方法
  reconnectSSE: () => Promise<void>;
  reconnectWS: () => Promise<void>;

  // 取消当前请求
  cancel: () => void;

  // 发送消息方法
  sendMessage: (message: string, flowId?: string) => Promise<void>;

  // 兼容层 - 页面期望的字段和方法
  messages: Ref<any[]>;
  isGenerating: ComputedRef<boolean>;
  clearMessages: () => void;
  disconnect: () => void;

  // 事件回调
  onMessage?: (data: any) => void;
  onError?: (error: any) => void;
}

export function useDualChannelConnection(): DualChannelConnection {
  // 状态管理
  const sseActive = ref(false);
  const wsActive = ref(false);
  const currentRequestId = ref<string | null>(null);

  // 兼容层 - 消息列表和生成状态
  const messages = ref<any[]>([]);
  const isGenerating = computed(() => !!currentRequestId.value);

  // 连接实例
  let sseConnection: EventSource | null = null;
  let wsConnection: WebSocket | null = null;

  // 回调函数
  let onMessageCallback: ((data: any) => void) | undefined;
  let onErrorCallback: ((error: any) => void) | undefined;

  // API 客户端
  const apiClient = useApiClient();

  // 获取认证token
  const getAuthToken = () => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("access_token") || "";
  };

  // 获取token类型
  const getTokenType = () => {
    if (typeof window === "undefined") return "Bearer";
    return localStorage.getItem("token_type") || "Bearer";
  };

  // Base64URL编码（符合HTTP token规范）
  const toBase64Url = (s: string) => {
    return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  };

  // 构建完整URL（参考API客户端逻辑）
  const buildFullUrl = (path: string, params?: Record<string, any>) => {
    const baseURL = "/api"; // 让 Nuxt 代理
    let fullUrl = path.startsWith("http") ? path : `${baseURL}${path}`;

    if (params) {
      const queryString = Object.entries(params)
        .filter(([, value]) => value !== undefined && value !== null)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join("&");

      if (queryString) {
        fullUrl = `${fullUrl}${fullUrl.includes("?") ? "&" : "?"}${queryString}`;
      }
    }
    return fullUrl;
  };

  // 构建WebSocket URL - 直接连接到后端，绕过代理
  const buildWSUrl = (path: string, params?: Record<string, any>) => {
    const config = useRuntimeConfig();
    // 优先用 public.wsUpstream，没配就退回到同域 /api 前缀
    const base =
      (config.public as any).wsUpstream ||
      `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}`;

    let fullUrl = `${base}/api${path}`; // 例如 ws://127.0.0.1:8077 + /api + /agents/stream/ws

    if (params) {
      const qs = Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== null)
        .map(
          ([k, v]) =>
            `${encodeURIComponent(k)}=${encodeURIComponent(v as string)}`
        )
        .join("&");
      if (qs) fullUrl += (fullUrl.includes("?") ? "&" : "?") + qs;
    }
    return fullUrl;
  };

  // SSE 探活测试 - 使用API客户端进行HTTP请求测试连通性
  const testSSE = async (): Promise<boolean> => {
    try {
      const token = getAuthToken();
      console.log(
        "SSE探活使用token:",
        token ? `${token.substring(0, 10)}...` : "无token"
      );

      const response = await apiClient.get("/agents/stream/flow", {
        params: { probe: 1 },
        useGlobalLoading: false,
        skipAuth: false,
      });
      console.log("SSE探活响应:", response);
      return true;
    } catch (error) {
      console.error("SSE探活测试失败:", error);
      return false;
    }
  };

  // WebSocket 探活测试
  const testWS = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      try {
        const token = getAuthToken();
        const params: Record<string, any> = { probe: 1 };
        if (token) params.authorization = `Bearer ${token}`;

        const wsUrl = buildWSUrl("/agents/stream/ws", params);
        const protocols = token ? [`bearer.${toBase64Url(token)}`] : undefined;

        const ws = new WebSocket(wsUrl, protocols);
        let resolved = false;

        ws.onopen = () => {
          resolved = true;
          ws.close();
          resolve(true);
        };
        ws.onmessage = () => {
          if (!resolved) {
            resolved = true;
            ws.close();
            resolve(true);
          }
        };
        ws.onerror = () => {
          if (!resolved) {
            resolved = true;
            try {
              ws.close();
            } catch {}
            resolve(false);
          }
        };
        ws.onclose = () => {
          if (!resolved) {
            resolved = true;
            resolve(false);
          }
        };

        setTimeout(() => {
          if (!resolved) {
            resolved = true;
            try {
              ws.close();
            } catch {}
            resolve(false);
          }
        }, 5000);
      } catch {
        resolve(false);
      }
    });
  };

  // SSE 真实连接 - 使用EventSource建立流连接（目前 sendSSEMessage 改为 fetch，不一定用得到）
  const createSSEConnection = (url: string) => {
    const token = getAuthToken();
    const tokenType = getTokenType();

    const params: Record<string, any> = {};
    if (token) params.authorization = `${tokenType} ${token}`;

    const fullUrl = buildFullUrl(url, params);
    console.log(
      "SSE连接URL:",
      fullUrl.replace(/authorization=[^&]+/, "authorization=***")
    );
    return new EventSource(fullUrl);
  };

  // WebSocket 真实连接
  const createWSConnection = (url: string) => {
    const token = getAuthToken();

    const fullUrl = buildWSUrl(
      url,
      token ? { authorization: `Bearer ${token}` } : undefined
    );

    const protocols = token ? [`bearer.${toBase64Url(token)}`] : undefined;

    console.log(
      "WebSocket真实连接URL:",
      fullUrl.replace(/authorization=[^&]+/, "authorization=***")
    );
    console.log("WebSocket子协议:", protocols);
    return new WebSocket(fullUrl, protocols);
  };

  // 重连SSE
  const reconnectSSE = async () => {
    sseActive.value = false;
    if (sseConnection) {
      sseConnection.close();
      sseConnection = null;
    }
    try {
      const isActive = await testSSE();
      sseActive.value = isActive;
    } catch (error) {
      console.error("SSE连接测试失败:", error);
      sseActive.value = false;
    }
  };

  // 重连WebSocket
  const reconnectWS = async () => {
    wsActive.value = false;
    if (wsConnection) {
      wsConnection.close();
      wsConnection = null;
    }
    try {
      const isActive = await testWS();
      wsActive.value = isActive;
    } catch (error) {
      console.error("WebSocket连接测试失败:", error);
      wsActive.value = false;
    }
  };

  // 发送SSE消息（真流）- 用 fetch 以便带 Authorization header
  const sendSSEMessage = async (message: string, flowId: string = "chat") => {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    currentRequestId.value = requestId;

    const url = `/agents/stream/flow?q=${encodeURIComponent(message)}&flow_id=${flowId}&request_id=${requestId}`;

    try {
      const response = await fetch(`/api${url}`, {
        method: "GET",
        headers: {
          Accept: "text/event-stream",
          "Cache-Control": "no-cache",
          Authorization: `${getTokenType()} ${getAuthToken()}`,
        },
      });

      if (!response.ok)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);

      console.log("SSE 连接已建立");
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("无法获取响应流");

      const readStream = async () => {
        let currentEvent: string | null = null;
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              console.log("SSE 流结束");
              currentRequestId.value = null;
              break;
            }
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split(/\r?\n/);

            for (const line of lines) {
              if (!line) continue;

              if (line.startsWith("event:")) {
                currentEvent = line.slice(6).trim();
                continue;
              }
              if (line.startsWith("data:")) {
                const raw = line.slice(5).trim();
                if (!raw) continue;
                if (raw === "[DONE]") {
                  currentRequestId.value = null;
                  continue;
                }

                let payload: any;
                try {
                  payload = JSON.parse(raw);
                } catch {
                  payload = { raw };
                }

                if (!payload.type && currentEvent) payload.type = currentEvent;

                if (onMessageCallback) onMessageCallback(payload);

                const text =
                  payload?.data?.text ??
                  payload?.data?.delta ??
                  payload?.text ??
                  "";

                const last = messages.value[messages.value.length - 1];
                const needNewAssistant =
                  !last || last.role !== "assistant" || last.done === true;

                if (payload.type === "token" || payload.type === "chunk") {
                  if (needNewAssistant) {
                    messages.value.push({
                      id: `a_${Date.now()}`,
                      role: "assistant",
                      content: "",
                    });
                  }
                  messages.value[messages.value.length - 1].content += text;
                } else if (payload.type === "end") {
                  if (last && last.role === "assistant") last.done = true;
                  currentRequestId.value = null;
                }
              }
            }
          }
        } catch (error) {
          console.error("读取 SSE 流错误:", error);
          if (onErrorCallback) onErrorCallback(error);
          currentRequestId.value = null;
        } finally {
          reader.releaseLock();
        }
      };

      readStream();
    } catch (error) {
      console.error("SSE连接错误:", error);
      if (onErrorCallback) onErrorCallback(error);
      currentRequestId.value = null;
    }
  };

  // 发送WebSocket消息（真流）
  const sendWSMessage = (message: string, flowId: string = "chat") => {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    currentRequestId.value = requestId;

    if (wsConnection) wsConnection.close();

    const url = `/agents/stream/ws?q=${encodeURIComponent(message)}&flow_id=${flowId}&request_id=${requestId}`;
    wsConnection = createWSConnection(url);

    wsConnection.onopen = () => {
      console.log("WebSocket连接已建立");
    };

    wsConnection.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "intent") {
          console.log("Intent:", data);
        } else if (data.type === "token" || data.type === "chunk") {
          if (onMessageCallback) onMessageCallback(data);
        } else if (data.type === "end") {
          wsConnection?.close();
          currentRequestId.value = null;
        }
      } catch (error) {
        console.error("WebSocket消息解析错误:", error);
      }
    };

    wsConnection.onerror = (error) => {
      console.error("WebSocket连接错误:", error);
      if (onErrorCallback) onErrorCallback(error);
      currentRequestId.value = null;
    };

    wsConnection.onclose = () => {
      currentRequestId.value = null;
    };
  };

  // 发送消息（自动选择通道）
  const sendMessage = async (message: string, flowId: string = "chat") => {
    messages.value.push({
      id: `u_${Date.now()}`,
      role: "user",
      content: message,
    });

    if (wsActive.value) {
      sendWSMessage(message, flowId);
    } else if (sseActive.value) {
      sendSSEMessage(message, flowId);
    } else {
      throw new Error("没有可用的连接通道");
    }
  };

  // 取消当前请求
  const cancel = () => {
    if (sseConnection) {
      sseConnection.close();
      sseConnection = null;
    }
    if (wsConnection) {
      wsConnection.close();
      wsConnection = null;
    }
    currentRequestId.value = null;
  };

  // 兼容层方法
  const clearMessages = () => {
    messages.value = [];
  };

  const disconnect = () => {
    cancel();
  };

  // 创建连接对象
  const connection: DualChannelConnection = {
    sseActive,
    wsActive,
    currentRequestId,
    reconnectSSE,
    reconnectWS,
    cancel,
    sendMessage,

    // 兼容层
    messages,
    isGenerating,
    clearMessages,
    disconnect,

    get onMessage() {
      return onMessageCallback;
    },
    set onMessage(callback) {
      onMessageCallback = callback;

      // 自动处理消息拼接到 messages 数组
      if (callback) {
        const originalCallback = callback;
        onMessageCallback = (packet: any) => {
          originalCallback(packet);

          const text =
            packet?.data?.text ?? packet?.data?.delta ?? packet?.text ?? "";
          const last = messages.value[messages.value.length - 1];
          const needNewAssistant =
            !last || last.role !== "assistant" || last.done === true;

          if (packet?.type === "token" || packet?.type === "chunk") {
            if (needNewAssistant) {
              messages.value.push({
                id: `a_${Date.now()}`,
                role: "assistant",
                content: "",
              });
            }
            messages.value[messages.value.length - 1].content += text;
          } else if (packet?.type === "end") {
            if (last && last.role === "assistant") last.done = true;
          }
        };
      }
    },
    get onError() {
      return onErrorCallback;
    },
    set onError(callback) {
      onErrorCallback = callback;
    },
  };

  // 初始化时进行连接测试（仅在客户端执行，避免 SSR 触发 window）
  if (typeof window !== "undefined") {
    reconnectSSE();
    reconnectWS();
  }

  // 监听 token 变化，重新连接（仅客户端）
  if (typeof window !== "undefined") {
    watchEffect(() => {
      const token = getAuthToken();
      if (token) {
        reconnectSSE();
        reconnectWS();
      }
    });
  }

  return connection;
}
