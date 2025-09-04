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
  messages: Ref<any[]>;
  isGenerating: ComputedRef<boolean>;
  clearMessages: () => void;
  disconnect: () => void;
  onMessage?: (data: any) => void;
  onError?: (error: any) => void;
}

export function useDualChannelConnection(): DualChannelConnection {
  const sseActive = ref(false);
  const wsActive = ref(false);
  const currentRequestId = ref<string | null>(null);
  const messages = ref<any[]>([]);
  const isGenerating = computed(() => !!currentRequestId.value);

  let wsConnection: WebSocket | null = null;
  let onMessageCallback: ((data: any) => void) | undefined;
  let onErrorCallback: ((error: any) => void) | undefined;

  // ---- helpers ----
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

  // 同源 + /api 前缀（HTTP/WS 统一）
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

  // ---- health check（可按需裁剪）----
  const reconnectSSE = async () => {
    try {
      const res = await fetch(
        buildHttpUrl("/agents/stream/sse", { probe: 1 }),
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
    } // 没 token 不探活，避免401风暴
    return new Promise<void>((resolve) => {
      try {
        const protocols = [`bearer.${toBase64Url(token)}`];
        const url = buildWSUrl("/agents/stream/ws", {
          probe: 1,
          authorization: `${getTokenType()} ${token}`, // ⛑️ 开发期兜底
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
        ws.onmessage = () => finish(true); // 有的后端会回 ack
        ws.onerror = () => finish(false);
        ws.onclose = () => finish(false);
        setTimeout(() => finish(false), 5000);
      } catch {
        wsActive.value = false;
        resolve();
      }
    });
  };

  // ---- streaming ----
  const sendSSEMessage = async (
    message: string,
    flowId = "chat",
    meta?: Record<string, any>
  ) => {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    currentRequestId.value = requestId;

    const url = buildHttpUrl("/agents/stream//sse", {
      q: message,
      flow_id: flowId,
      request_id: requestId,
      ...(meta ? { meta } : {}),
    });

    try {
      const resp = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "text/event-stream",
          "Cache-Control": "no-cache",
          Authorization: `${getTokenType()} ${getAuthToken()}`, // SSE 只能用 header
        },
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status} ${resp.statusText}`);

      const reader = resp.body?.getReader();
      if (!reader) throw new Error("无法读取 SSE 流");
      const decoder = new TextDecoder();

      const run = async () => {
        let currentEvent: string | null = null;
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
                if (needNewAssistant)
                  messages.value.push({
                    id: `a_${Date.now()}`,
                    role: "assistant",
                    content: "",
                  });
                messages.value[messages.value.length - 1].content += text;
              } else if (payload.type === "end") {
                if (last && last.role === "assistant") last.done = true;
                currentRequestId.value = null;
              }
            }
          }
        } catch (err) {
          onErrorCallback?.(err);
        } finally {
          currentRequestId.value = null;
          reader.releaseLock();
        }
      };
      run();
    } catch (err) {
      onErrorCallback?.(err);
      currentRequestId.value = null;
    }
  };

  const sendWSMessage = (
    message: string,
    flowId = "chat",
    meta?: Record<string, any>
  ) => {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    currentRequestId.value = requestId;

    if (wsConnection) {
      try {
        wsConnection.close();
      } catch {}
      wsConnection = null;
    }

    const token = getAuthToken();
    if (!token) throw new Error("未登录：缺少 access_token");
    const protocols = [`bearer.${toBase64Url(token)}`];
    const url = buildWSUrl("/agents/stream/ws", {
      q: message,
      flow_id: flowId,
      request_id: requestId,
      ...(meta ? { meta } : {}),
      authorization: `${getTokenType()} ${token}`, // ⛑️ 开发期兜底
    });

    wsConnection = new WebSocket(url, protocols);

    wsConnection.onopen = () => {
      console.log("WS 已连接, 协商子协议 =", wsConnection?.protocol);
    };

    wsConnection.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (onMessageCallback) onMessageCallback(data);

        const text = data?.data?.text ?? data?.data?.delta ?? data?.text ?? "";
        const last = messages.value[messages.value.length - 1];
        const needNewAssistant =
          !last || last.role !== "assistant" || last.done === true;

        if (data.type === "token" || data.type === "chunk") {
          if (needNewAssistant)
            messages.value.push({
              id: `a_${Date.now()}`,
              role: "assistant",
              content: "",
            });
          messages.value[messages.value.length - 1].content += text;
        } else if (data.type === "end") {
          if (last && last.role === "assistant") last.done = true;
          currentRequestId.value = null;
          try {
            wsConnection?.close();
          } catch {}
        }
      } catch (e) {
        console.warn("WS 消息解析失败:", e);
      }
    };

    wsConnection.onerror = (err) => {
      onErrorCallback?.(err);
      currentRequestId.value = null;
    };
    wsConnection.onclose = () => {
      currentRequestId.value = null;
    };
  };

  const sendMessage = async (
    message: string,
    flowId = "chat",
    meta?: Record<string, any>
  ) => {
    messages.value.push({
      id: `u_${Date.now()}`,
      role: "user",
      content: message,
    });
    if (wsActive.value) {
      sendWSMessage(message, flowId, meta);
    } else if (sseActive.value) {
      await sendSSEMessage(message, flowId, meta);
    } else {
      throw new Error("没有可用的连接通道");
    }
  };

  const cancel = () => {
    if (wsConnection) {
      try {
        wsConnection.close();
      } catch {}
      wsConnection = null;
    }
    currentRequestId.value = null;
  };

  const clearMessages = () => {
    messages.value = [];
  };
  const disconnect = () => {
    cancel();
  };

  const connection: DualChannelConnection = {
    sseActive,
    wsActive,
    currentRequestId,
    reconnectSSE,
    reconnectWS,
    cancel,
    sendMessage,
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
    // 初始化探活
    reconnectSSE();
    reconnectWS();

    // token 变化时重连
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
