// server/middleware/proxy-plugin-api.ts
import {
  defineEventHandler,
  getRequestURL,
  getMethod,
  getRequestHeaders,
  readRawBody,
  setResponseStatus,
  setResponseHeaders,
  send,
} from "h3";

const UPSTREAM = "http://127.0.0.1:8077"; // 你的后端

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);
  const path = url.pathname;

  // 仅匹配：/_p/:pluginId/api/**
  if (!/^\/_p\/[^/]+\/api\/.+/.test(path)) {
    return;
  }

  // 目标地址（带上查询串）
  const target = UPSTREAM + path + (url.search || "");

  // 透传请求方法/头
  const method = getMethod(event);
  const headers = { ...getRequestHeaders(event) };
  // 不要把 host 转给上游
  delete (headers as any).host;
  // 如果上游需要识别代理链，可加：
  headers["x-forwarded-host"] = headers["x-forwarded-host"] || url.host;
  headers["x-forwarded-proto"] =
    headers["x-forwarded-proto"] || url.protocol.replace(":", "");

  // 读取请求体（仅非 GET/HEAD）
  const body =
    method === "GET" || method === "HEAD"
      ? undefined
      : await readRawBody(event);

  // 发起到后端
  const resp = await fetch(target, {
    method,
    headers,
    body, // Buffer | string | Uint8Array 都可
    // credentials: 'include' // 如需显式带 Cookie（一般不需要，这里已透传 headers）
  });

  // 回写状态码/响应头
  setResponseStatus(event, resp.status, resp.statusText);
  // 透传除少数 hop-by-hop 头（这里简单起见全透传）
  const respHeaders: Record<string, string> = {};
  resp.headers.forEach((v, k) => {
    respHeaders[k] = v;
  });
  setResponseHeaders(event, respHeaders);

  // 回写响应体
  const buf = new Uint8Array(await resp.arrayBuffer());
  return send(event, buf);
});
