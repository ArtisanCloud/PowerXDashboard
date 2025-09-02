// server/routes/api/agents/stream/ws.ts
import WebSocket from "ws";

const upstreamHTTP = process.env.UPSTREAM || "http://127.0.0.1:8077";
const upstreamURL = new URL(upstreamHTTP);
const upstreamWS = upstreamURL.protocol === "https:" ? "wss:" : "ws:";
const upstreamHost = upstreamURL.host;

const toBase64Url = (s: string) =>
  Buffer.from(s, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

function pickProtocols(val?: string | string[]) {
  if (!val) return undefined;
  const arr = (Array.isArray(val) ? val : String(val).split(","))
    .map((s) => s.trim())
    .filter(Boolean);
  return arr.length ? arr : undefined;
}

function extractAuthFromQuery(rawUrl: string) {
  try {
    const u = new URL(rawUrl, "http://_");
    return u.searchParams.get("authorization") || null; // 期望 "Bearer xxx"
  } catch {
    return null;
  }
}

export default defineWebSocketHandler({
  async open(peer) {
    const req: any = (peer as any).request || {};
    const rawUrl: string = req.url || "/api/agents/stream/ws";
    const q = rawUrl.includes("?") ? rawUrl.slice(rawUrl.indexOf("?")) : "";
    const hdrs = (req.headers || {}) as Record<string, string>;
    const offered = hdrs["sec-websocket-protocol"];
    const clientOrigin = hdrs["origin"] || "http://localhost:3030";
    const authFromQuery = extractAuthFromQuery(rawUrl); // 仅作为开发兜底

    console.log("🔄 [WS OPEN] 到达:", {
      url: rawUrl,
      subproto: offered || "(none)",
      authFromQuery: authFromQuery
        ? authFromQuery.slice(0, 16) + "…"
        : "(none)",
    });

    // === 需要尝试的后端路径（按顺序回退）===
    const candidates = [
      `/api/agents/stream/ws${q}`,
      `/agents/stream/ws${q}`,
      // 若你后端还有其它候选路径，继续加：
      // `/ws${q}`,
      // `/api/ws${q}`,
    ];

    const headers: Record<string, string> = {
      Origin: clientOrigin,
      Host: upstreamHost,
    };
    if (authFromQuery) headers["Authorization"] = authFromQuery;

    // 解析 token：如果浏览器没传子协议，但 URL 带了 authorization，就帮你补一条 subproto
    let token: string | null = null;
    if (authFromQuery?.startsWith("Bearer ")) token = authFromQuery.slice(7);

    const baseProtocols =
      pickProtocols(offered) ||
      (token ? [`bearer.${toBase64Url(token)}`] : undefined);

    // 尝试依次连接候选路径
    let connected = false;
    for (const path of candidates) {
      const target = `${upstreamWS}//${upstreamHost}${path}`;
      console.log(
        "➡️  [TRY UPSTREAM]",
        target,
        "subproto=",
        baseProtocols?.[0] || "(none)"
      );

      const ws = new WebSocket(target, baseProtocols, { headers });

      // 记录到 peer，方便后续 message/close 使用
      (peer as any).__upstream = ws;

      // 监听“非预期响应”（如 404/401）以拿到状态码
      ws.on("unexpected-response", (_req, res) => {
        console.error(
          "❌ [UPSTREAM UNEXPECTED]",
          res.statusCode,
          res.statusMessage,
          "for",
          target
        );
      });

      const ok = await new Promise<boolean>((resolve) => {
        let settled = false;
        const finish = (b: boolean) => {
          if (settled) return;
          settled = true;
          resolve(b);
        };

        ws.once("open", () => {
          console.log("🟢 [UPSTREAM OPEN]", target);
          finish(true);
        });
        ws.once("error", (err) => {
          console.error("❌ [UPSTREAM ERROR]", err?.message, "for", target);
          finish(false);
        });
        // 如果 1.5 秒内没有 open/err，就当失败尝试下一个
        setTimeout(() => finish(false), 1500);
      });

      if (ok) {
        connected = true;
        break;
      } else {
        try {
          ws.terminate();
        } catch {}
        (peer as any).__upstream = undefined;
      }
    }

    if (!connected) {
      console.error("⛔  所有候选路径均未握手成功，请确认后端 WS 路径");
      try {
        peer.close(1011, "no upstream ws path");
      } catch {}
      return;
    }

    // 透传消息：后端 -> 浏览器
    const up: WebSocket = (peer as any).__upstream;
    up.on("message", (data) => {
      try {
        peer.send(data);
      } catch {}
    });
    up.on("close", (code, reason) => {
      console.log("ℹ️ [UPSTREAM CLOSE]", code, reason?.toString?.());
      try {
        peer.close(code, reason?.toString?.());
      } catch {}
      (peer as any).__upstream = undefined;
    });
    up.on("error", (err) => {
      console.error("❌ [UPSTREAM ERROR after open]", err?.message);
      try {
        peer.close(1011, "upstream error");
      } catch {}
      (peer as any).__upstream = undefined;
    });
  },

  message(peer, message) {
    const up: WebSocket | undefined = (peer as any).__upstream;
    if (up && up.readyState === WebSocket.OPEN) {
      try {
        up.send(message);
      } catch {}
    }
  },

  close(peer, event) {
    console.log("🔚 [CLIENT CLOSE]", event?.code, event?.reason);
    const up: WebSocket | undefined = (peer as any).__upstream;
    try {
      up?.close();
    } catch {}
    (peer as any).__upstream = undefined;
  },

  error(peer, error) {
    console.error("❌ [CLIENT ERROR]", (error as any)?.message || error);
    const up: WebSocket | undefined = (peer as any).__upstream;
    try {
      up?.terminate?.();
    } catch {}
    (peer as any).__upstream = undefined;
  },
});
