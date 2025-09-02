// 消息类型常量定义
export const MESSAGE_TYPES = {
  TEXT: "text",
  MARKDOWN: "markdown",
  CODE: "code",
  IMAGE: "image",
  VIDEO: "video",
  CARD: "card",
  FILE: "file",
  SYSTEM: "system",
} as const;

export type MessageType = (typeof MESSAGE_TYPES)[keyof typeof MESSAGE_TYPES];

// 统一的消息角色
export type ChatRole = "user" | "assistant" | "system";

// 消息内容接口
export interface MessageContent {
  type: MessageType;
  data: any;
}

// 不同类型消息的数据结构
export interface TextContent {
  text: string;
}

export interface MarkdownContent {
  markdown: string;
}

export interface CodeContent {
  code: string;
  language: string;
  filename?: string;
}

export interface ImageContent {
  url: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
}

export interface VideoContent {
  url: string;
  poster?: string;
  caption?: string;
  duration?: number;
}

export interface CardContent {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  actions?: Array<{
    label: string;
    action: string;
    variant?: "primary" | "secondary" | "outline";
  }>;
  metadata?: Record<string, any>;
}

export interface FileContent {
  name: string;
  size: number;
  type: string;
  url: string;
  downloadUrl?: string;
}

export interface SystemContent {
  message: string;
  level: "info" | "warning" | "error" | "success";
}

// 扩展的聊天消息接口
export interface EnhancedChatMessage {
  id: string;
  role: ChatRole;
  content: MessageContent[];
  timestamp: Date;
  status?: "sending" | "sent" | "error";
  metadata?: Record<string, any>;
}

// ✅ 统一的基础聊天消息（兼容历史：content 可为 string 或结构化内容数组）
export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string | MessageContent[];
  timestamp: Date;
  metadata?: Record<string, any>;
}
