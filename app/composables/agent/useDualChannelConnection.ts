// app/composables/agent/useDualChannelConnection.ts
import { ref, computed, watchEffect, type Ref, type ComputedRef } from "vue";

export interface DualChannelConnection {
  sseActive: Ref<boolean>;
  wsActive: Ref<boolean>;
  currentRequestId: Ref<string | null>;
  reconnectSSE: () => Promise<void>;
  reconnectWS: () => Promise<void>;
  cancel: () => void;
  sendMessage: (
    message: string,
    flowId?: string,
    meta?: Record<string, any>
  ) => Promise<void>;
  sendCommand: (command: any) => boolean;
  messages: Ref<any[]>;
  isGenerating: ComputedRef<boolean>;
  clearMessages: () => void;
  disconnect: () => void;
  onMessage?: (data: any) => void;
  onError?: (error: any) => void;
}

// 事件类型（与你后端保持一致）
export const SSE_EVENT_TYPES = {
  START: "start",
  INTENT: "intent",
  PLAN: "plan",
  TOKEN: "token",
  DATA: "data",
  ACTION: "action",
  FINAL: "final",
  END: "end",
  ERROR: "error",
  HEARTBEAT: "heartbeat",
  ACK: "ack",
  META: "meta",
  CHUNK: "chunk",
} as const;

export function useDualChannelConnection(
  agentId?: Ref<number | null>,
  sessionId?: Ref<string | null>
): DualChannelConnection {
  const sseActive = ref(false);
  const wsActive = ref(false);
  const currentRequestId = ref<string | null>(null);
  const messages = ref<any[]>([]);
  const isGenerating = computed(() => !!currentRequestId.value);

  let wsConnection: WebSocket | null = null;
  let onMessageCallback: ((data: any) => void) | undefined;
  let onErrorCallback: ((error: any) => void) | undefined;

  // ============ 工具函数 ============
  const getEnv = () => {
    if (typeof window === "undefined") return "dev";
    try {
      const envStore = localStorage.getItem("env-store");
      if (envStore) {
        const parsed = JSON.parse(envStore);
        return parsed.currentEnv || "dev";
      }
    } catch {}
    return "dev";
  };
  const getAuthToken = () =>
    typeof window === "undefined"
      ? ""
      : localStorage.getItem("access_token") || "";
  const getTokenType = () =>
    typeof window === "undefined"
      ? "Bearer"
      : localStorage.getItem("token_type") || "Bearer";
  const toBase64Url = (s: string) =>
    btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

  const buildWSUrl = (path: string, params?: Record<string, any>) => {
    const protocol = location.protocol === "https:" ? "wss:" : "ws:";
    const host = location.host;
    let url = `${protocol}//${host}/api${path}`;
    if (params) {
      const qs = Object.entries(params)
        .filter(([, v]) => v != null)
        .map(
          ([k, v]) =>
            `${encodeURIComponent(k)}=${encodeURIComponent(typeof v === "string" ? v : JSON.stringify(v))}`
        )
        .join("&");
      if (qs) url += (url.includes("?") ? "&" : "?") + qs;
    }
    return url;
  };

  const buildHttpUrl = (path: string, params?: Record<string, any>) => {
    let url = `/api${path}`;
    if (params) {
      const qs = Object.entries(params)
        .filter(([, v]) => v != null)
        .map(
          ([k, v]) =>
            `${encodeURIComponent(k)}=${encodeURIComponent(typeof v === "string" ? v : JSON.stringify(v))}`
        )
        .join("&");
      if (qs) url += (url.includes("?") ? "&" : "?") + qs;
    }
    return url;
  };

  // ============ 探活 ============
  const reconnectSSE = async () => {
    try {
      const res = await fetch(
        buildHttpUrl("/agents/stream/sse", { probe: 1 }),
        // buildHttpUrl("/agents/stream/mock", { probe: 1 }),
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `${getTokenType()} ${getAuthToken()}`,
          },
        }
      );
      sseActive.value = res.ok;
    } catch {
      sseActive.value = false;
    }
  };
  const reconnectWS = async () => {
    const token = getAuthToken();
    if (!token) {
      wsActive.value = false;
      return;
    }
    return new Promise<void>((resolve) => {
      try {
        const protocols = [`bearer.${toBase64Url(token)}`];
        const url = buildWSUrl("/agents/stream/ws", {
          probe: 1,
          authorization: `${getTokenType()} ${token}`,
        });
        const ws = new WebSocket(url, protocols);
        let done = false;
        const finish = (ok: boolean) => {
          if (done) return;
          done = true;
          wsActive.value = ok;
          try {
            ws.close();
          } catch {}
          resolve();
        };
        ws.onopen = () => finish(true);
        ws.onmessage = () => finish(true);
        ws.onerror = () => finish(false);
        ws.onclose = () => finish(false);
        setTimeout(() => finish(false), 5000);
      } catch {
        wsActive.value = false;
        resolve();
      }
    });
  };

  // ============ 统一文本提取 ============
  function pickText(payload: any, kind?: string): string {
    // 优先：token/chunk 增量
    if (kind === SSE_EVENT_TYPES.TOKEN || kind === SSE_EVENT_TYPES.CHUNK) {
      return (
        payload?.delta ??
        payload?.text ??
        payload?.data?.delta ??
        payload?.data?.text ??
        ""
      );
    }
    // data / final：整段或最终
    const c1 =
      payload?.data?.data?.result?.content ?? // 深嵌套
      payload?.data?.result?.content ?? // 常见
      payload?.data?.content ?? // 你这次后端就是这个
      payload?.text ?? // 有些后端放根上
      payload?.delta ?? // 兜底
      "";
    return typeof c1 === "string" ? c1 : JSON.stringify(c1);
  }

  //（可选）强制触发依赖 messages.value 的 computed/watch
  function bumpMessagesRef() {
    // 只有你真的依赖“数组引用变化”时再打开（比如外部有 computed(() => messages.value)）
    // 为了安全，这里默认启用，避免你外层只盯数组引用导致看不到内部对象变化
    messages.value = [...messages.value];
  }

  // ============ SSE 主流程 ============
  const sendSSEMessage = async (
    message: string,
    flowId = "chat",
    meta?: Record<string, any>
  ) => {
    const requestId = `req_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 9)}`;
    currentRequestId.value = requestId;

    const params: Record<string, any> = {
      q: message,
      env: getEnv(),
    };
    if (agentId?.value) params.agent_id = agentId.value;
    if (sessionId?.value) params.session_id = sessionId.value;
    if (meta) Object.assign(params, meta);

    const url = buildHttpUrl("/agents/stream/sse", params);
    // const url = buildHttpUrl("/agents/stream/mock", params);

    try {
      const resp = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "text/event-stream",
          "Cache-Control": "no-cache",
          Authorization: `${getTokenType()} ${getAuthToken()}`,
        },
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status} ${resp.statusText}`);

      const reader = resp.body?.getReader();
      if (!reader) throw new Error("无法读取 SSE 流");
      const decoder = new TextDecoder();

      const run = async () => {
        let currentEvent: string | null = null;
        let hasReceivedData = false;
        let timeoutId: any = null;

        // 10 秒确认包超时
        const connectionTimeout = () => {
          if (!hasReceivedData) {
            // 移除思考消息
            const thinkingIndex = messages.value.findIndex((m) => m.isThinking);
            if (thinkingIndex !== -1) messages.value.splice(thinkingIndex, 1);

            messages.value.push({
              id: `error_${Date.now()}`,
              role: "assistant",
              content: "连接超时：服务器未响应确认包。",
              timestamp: new Date(),
              isError: true,
            });
            bumpMessagesRef();

            currentRequestId.value = null;
          }
        };
        timeoutId = setTimeout(connectionTimeout, 10000);

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });

            for (const line of chunk.split(/\r?\n/)) {
              if (!line) continue;

              if (line.startsWith("event:")) {
                currentEvent = line.slice(6).trim();
                continue;
              }
              if (!line.startsWith("data:")) continue;

              const raw = line.slice(5).trim();
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

              // 第一次收到任何数据 -> 取消超时
              if (!hasReceivedData) {
                hasReceivedData = true;
                if (timeoutId) {
                  clearTimeout(timeoutId);
                  timeoutId = null;
                }
              }

              onMessageCallback?.(payload);

              const type = String(
                payload.type || currentEvent || ""
              ).toLowerCase();

              // 这些是“控制类”事件：去掉思考泡泡，不显示文本
              if (
                type === SSE_EVENT_TYPES.ACK ||
                type === SSE_EVENT_TYPES.START ||
                type === SSE_EVENT_TYPES.INTENT ||
                type === SSE_EVENT_TYPES.PLAN ||
                type === SSE_EVENT_TYPES.META ||
                type === SSE_EVENT_TYPES.HEARTBEAT ||
                type === SSE_EVENT_TYPES.ACTION
              ) {
                // 收到确认/控制类事件就把思考态移除
                const thinkingIndex = messages.value.findIndex(
                  (m) => m.isThinking
                );
                if (thinkingIndex !== -1) {
                  messages.value.splice(thinkingIndex, 1);
                  bumpMessagesRef();
                }
                continue;
              }

              // 获取最后一条
              let last = messages.value[messages.value.length - 1];
              const needNewAssistant =
                !last || last.role !== "assistant" || last.done === true;

              // token/chunk/data/final：都视为“内容事件”
              if (
                type === SSE_EVENT_TYPES.TOKEN ||
                type === SSE_EVENT_TYPES.CHUNK ||
                type === SSE_EVENT_TYPES.DATA ||
                type === SSE_EVENT_TYPES.FINAL
              ) {
                // 干掉思考消息
                const thinkingIndex = messages.value.findIndex(
                  (m) => m.isThinking
                );
                if (thinkingIndex !== -1) {
                  messages.value.splice(thinkingIndex, 1);
                }

                if (needNewAssistant) {
                  messages.value.push({
                    id: `a_${Date.now()}`,
                    role: "assistant",
                    content: "",
                    timestamp: new Date(),
                    isStreaming: true,
                    done: false,
                    isThinking: false,
                    isError: false,
                  });
                  bumpMessagesRef();
                }

                // 当前可写入消息
                const currentMessage =
                  messages.value[messages.value.length - 1];

                // 统一取文本
                const text = pickText(payload, type);

                if (
                  (type === SSE_EVENT_TYPES.TOKEN ||
                    type === SSE_EVENT_TYPES.CHUNK) &&
                  text
                ) {
                  // 增量拼接
                  currentMessage.content =
                    (currentMessage.content || "") + text;
                  currentMessage.isStreaming = true;
                  bumpMessagesRef(); // 保守触发，避免外层只依赖数组引用的 computed 不更新
                } else if (type === SSE_EVENT_TYPES.DATA && text) {
                  // 整段覆盖（保持流式状态，交给前端逐字机去渲染）
                  currentMessage.content = text;
                  currentMessage.isStreaming = true;
                  bumpMessagesRef();
                } else if (type === SSE_EVENT_TYPES.FINAL) {
                  // final 通常给全文
                  if (text) currentMessage.content = text;
                  currentMessage.isStreaming = false;
                  currentMessage.done = true;
                  bumpMessagesRef();
                }
                continue;
              }

              // end / error
              if (type === SSE_EVENT_TYPES.END) {
                const thinkingIndex = messages.value.findIndex(
                  (m) => m.isThinking
                );
                if (thinkingIndex !== -1)
                  messages.value.splice(thinkingIndex, 1);

                const lastMsg = messages.value[messages.value.length - 1];
                if (lastMsg && lastMsg.role === "assistant") {
                  lastMsg.done = true;
                  lastMsg.isStreaming = false;
                }
                bumpMessagesRef();
                currentRequestId.value = null;
                continue;
              }

              if (type === SSE_EVENT_TYPES.ERROR) {
                const thinkingIndex = messages.value.findIndex(
                  (m) => m.isThinking
                );
                if (thinkingIndex !== -1)
                  messages.value.splice(thinkingIndex, 1);

                messages.value.push({
                  id: `error_${Date.now()}`,
                  role: "assistant",
                  content:
                    payload?.message ||
                    payload?.error ||
                    "发生错误：未知的服务端错误。",
                  timestamp: new Date(),
                  isError: true,
                });
                bumpMessagesRef();
                currentRequestId.value = null;
                continue;
              }
            }
          }
        } catch (err) {
          const thinkingIndex = messages.value.findIndex((m) => m.isThinking);
          if (thinkingIndex !== -1) messages.value.splice(thinkingIndex, 1);

          onErrorCallback?.(err);
        } finally {
          if (timeoutId) clearTimeout(timeoutId);
          currentRequestId.value = null;
          try {
            reader.releaseLock();
          } catch {}
        }
      };

      run();
    } catch (err) {
      onErrorCallback?.(err);
      currentRequestId.value = null;
    }
  };

  // ============ WS（保持原样占位，便于你后续需要） ============
  const sendWSMessage = (
    _message: string,
    _flowId = "chat",
    _meta?: Record<string, any>
  ) => {
    // 如你暂不使用 WS，可不实现
    return;
  };

  const sendCommand = (_command: any) => {
    if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
      wsConnection.send(JSON.stringify(_command));
      return true;
    }
    return false;
  };

  // ============ 对外发送（先入列本地消息，再走 SSE） ============
  const sendMessage = async (
    message: string,
    flowId = "chat",
    meta?: Record<string, any>
  ) => {
    // 用户消息
    messages.value.push({
      id: `u_${Date.now()}`,
      role: "user",
      content: message,
      timestamp: new Date(),
    });
    // 思考占位
    messages.value.push({
      id: `thinking_${Date.now()}`,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isThinking: true,
    });
    bumpMessagesRef();

    try {
      await sendSSEMessage(message, flowId, meta);
    } catch (error) {
      const thinkingIndex = messages.value.findIndex((m) => m.isThinking);
      if (thinkingIndex !== -1) messages.value.splice(thinkingIndex, 1);

      messages.value.push({
        id: `error_${Date.now()}`,
        role: "assistant",
        content: `发送失败：${(error as any)?.message ?? "未知错误"}`,
        timestamp: new Date(),
        isError: true,
      });
      bumpMessagesRef();
      throw error;
    }
  };

  const cancel = () => {
    try {
      wsConnection?.close();
    } catch {}
    wsConnection = null;
    currentRequestId.value = null;
  };

  const clearMessages = () => {
    messages.value = [];
  };

  const disconnect = () => cancel();

  const connection: DualChannelConnection = {
    sseActive,
    wsActive,
    currentRequestId,
    reconnectSSE,
    reconnectWS,
    cancel,
    sendMessage,
    sendCommand,
    messages,
    isGenerating,
    clearMessages,
    disconnect,
    get onMessage() {
      return onMessageCallback;
    },
    set onMessage(cb) {
      onMessageCallback = cb;
    },
    get onError() {
      return onErrorCallback;
    },
    set onError(cb) {
      onErrorCallback = cb;
    },
  };

  if (typeof window !== "undefined") {
    reconnectSSE();
    reconnectWS();
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
