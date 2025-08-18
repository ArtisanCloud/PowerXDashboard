<script setup lang="ts">
import type { EnhancedChatMessage } from "~/types/message";
import { MESSAGE_TYPES } from "~/types/message";
import ChatInterface from "~/components/agent/ChatInterface.vue";

// 模拟 Agent 配置
const mockAgent = {
  id: "demo-agent",
  name: "PowerX Assistant",
  description: "智能助手演示",
  model: "gpt-4",
  temperature: 0.7,
  avatar: null,
};

// 模拟各种类型的消息数据
const mockMessages = ref<EnhancedChatMessage[]>([
  // 用户文本消息
  {
    id: "1",
    role: "user",
    content: [
      {
        type: MESSAGE_TYPES.TEXT,
        data: { text: "你好！请帮我展示一下各种消息类型的样式效果。" },
      },
    ],
    timestamp: new Date(Date.now() - 300000),
    status: "sent",
  },

  // 助手文本回复
  {
    id: "2",
    role: "assistant",
    content: [
      {
        type: MESSAGE_TYPES.TEXT,
        data: {
          text: "你好！我很乐意为你展示各种消息类型的样式效果。让我为你演示不同类型的消息格式。",
        },
      },
    ],
    timestamp: new Date(Date.now() - 280000),
    status: "sent",
  },

  // Markdown 消息
  {
    id: "3",
    role: "assistant",
    content: [
      {
        type: MESSAGE_TYPES.MARKDOWN,
        data: {
          markdown: `# Markdown 消息示例

这是一个 **Markdown** 格式的消息，支持：

- **粗体文本**
- *斜体文本*
- \`行内代码\`
- [链接](https://example.com)

## 列表示例

1. 有序列表项 1
2. 有序列表项 2
3. 有序列表项 3

> 这是一个引用块，用于突出显示重要信息。

### 表格示例

| 功能 | 状态 | 描述 |
|------|------|------|
| 文本消息 | ✅ | 支持基础文本 |
| Markdown | ✅ | 支持富文本格式 |
| 代码块 | ✅ | 支持语法高亮 |`,
        },
      },
    ],
    timestamp: new Date(Date.now() - 260000),
    status: "sent",
  },

  // 代码消息
  {
    id: "4",
    role: "assistant",
    content: [
      {
        type: MESSAGE_TYPES.CODE,
        data: {
          code: `// TypeScript 代码示例
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

class UserManager {
  private users: User[] = [];

  addUser(user: User): void {
    this.users.push(user);
    console.log(\`用户 \${user.name} 已添加\`);
  }

  findUser(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  async fetchUserData(id: string): Promise<User | null> {
    try {
      const response = await fetch(\`/api/users/\${id}\`);
      return await response.json();
    } catch (error) {
      console.error('获取用户数据失败:', error);
      return null;
    }
  }
}

export default UserManager;`,
          language: "typescript",
          filename: "UserManager.ts",
        },
      },
    ],
    timestamp: new Date(Date.now() - 240000),
    status: "sent",
  },

  // 图片消息
  {
    id: "5",
    role: "assistant",
    content: [
      {
        type: MESSAGE_TYPES.IMAGE,
        data: {
          url: "https://picsum.photos/400/300?random=1",
          alt: "示例图片",
          caption: "这是一张随机生成的示例图片，展示图片消息的样式效果。",
          width: 400,
          height: 300,
        },
      },
    ],
    timestamp: new Date(Date.now() - 220000),
    status: "sent",
  },

  // 视频消息
  {
    id: "6",
    role: "assistant",
    content: [
      {
        type: MESSAGE_TYPES.VIDEO,
        data: {
          url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
          poster: "https://picsum.photos/400/225?random=2",
          caption: "示例视频 - 展示视频消息的播放效果",
          duration: 30,
        },
      },
    ],
    timestamp: new Date(Date.now() - 200000),
    status: "sent",
  },

  // 卡片消息
  {
    id: "7",
    role: "assistant",
    content: [
      {
        type: MESSAGE_TYPES.CARD,
        data: {
          title: "PowerX 管理系统",
          description:
            "一个现代化的企业级管理系统，提供用户管理、权限控制、工作流程等功能。",
          image: "https://picsum.photos/400/200?random=3",
          url: "https://powerx.example.com",
          actions: [
            {
              label: "查看详情",
              action: "view_details",
              variant: "primary",
            },
            {
              label: "立即体验",
              action: "try_now",
              variant: "outline",
            },
          ],
          metadata: {
            版本: "v2.1.0",
            更新时间: "2024-01-15",
            开发者: "PowerX Team",
            许可证: "MIT",
          },
        },
      },
    ],
    timestamp: new Date(Date.now() - 180000),
    status: "sent",
  },

  // 文件消息
  {
    id: "8",
    role: "assistant",
    content: [
      {
        type: MESSAGE_TYPES.FILE,
        data: {
          name: "系统架构设计文档.pdf",
          size: 2048576, // 2MB
          type: "application/pdf",
          url: "https://example.com/files/architecture.pdf",
          downloadUrl: "https://example.com/download/architecture.pdf",
        },
      },
    ],
    timestamp: new Date(Date.now() - 160000),
    status: "sent",
  },

  // 系统消息 - 信息
  {
    id: "9",
    role: "system",
    content: [
      {
        type: MESSAGE_TYPES.SYSTEM,
        data: {
          message: "系统已成功连接到服务器，所有功能正常运行。",
          level: "info",
        },
      },
    ],
    timestamp: new Date(Date.now() - 140000),
    status: "sent",
  },

  // 系统消息 - 警告
  {
    id: "10",
    role: "system",
    content: [
      {
        type: MESSAGE_TYPES.SYSTEM,
        data: {
          message: "检测到网络连接不稳定，可能影响消息发送速度。",
          level: "warning",
        },
      },
    ],
    timestamp: new Date(Date.now() - 120000),
    status: "sent",
  },

  // 系统消息 - 错误
  {
    id: "11",
    role: "system",
    content: [
      {
        type: MESSAGE_TYPES.SYSTEM,
        data: {
          message: "文件上传失败，请检查文件格式和大小限制。",
          level: "error",
        },
      },
    ],
    timestamp: new Date(Date.now() - 100000),
    status: "sent",
  },

  // 系统消息 - 成功
  {
    id: "12",
    role: "system",
    content: [
      {
        type: MESSAGE_TYPES.SYSTEM,
        data: {
          message: "配置更新已成功保存并生效。",
          level: "success",
        },
      },
    ],
    timestamp: new Date(Date.now() - 80000),
    status: "sent",
  },

  // 混合内容消息
  {
    id: "13",
    role: "assistant",
    content: [
      {
        type: MESSAGE_TYPES.TEXT,
        data: {
          text: "以下是一个包含多种内容类型的复合消息示例：",
        },
      },
      {
        type: MESSAGE_TYPES.CODE,
        data: {
          code: `// 快速排序算法
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);
  
  return [...quickSort(left), ...middle, ...quickSort(right)];
}

console.log(quickSort([3, 6, 8, 10, 1, 2, 1]));`,
          language: "javascript",
          filename: "quickSort.js",
        },
      },
      {
        type: MESSAGE_TYPES.TEXT,
        data: {
          text: "这个算法的时间复杂度是 O(n log n)，是一种高效的排序方法。",
        },
      },
    ],
    timestamp: new Date(Date.now() - 60000),
    status: "sent",
  },

  // 用户回复
  {
    id: "14",
    role: "user",
    content: [
      {
        type: MESSAGE_TYPES.TEXT,
        data: {
          text: "太棒了！这些样式效果看起来很不错。能否再展示一下流式输入的效果？",
        },
      },
    ],
    timestamp: new Date(Date.now() - 40000),
    status: "sent",
  },

  // 正在输入的消息（模拟流式输入）
  {
    id: "15",
    role: "assistant",
    content: [
      {
        type: MESSAGE_TYPES.TEXT,
        data: {
          text: "当然可以！流式输入效果可以让用户实时看到AI的回复过程，提供更好的交互体验...",
        },
      },
    ],
    timestamp: new Date(Date.now() - 20000),
    status: "sent",
  },
]);

// 模拟连接状态
const isConnected = ref(true);
const isStreaming = ref(false);
const isTyping = ref(false);
const connectionType = ref<"sse" | "websocket">("sse");

// 模拟发送消息
const handleSendMessage = (content: string) => {
  const newMessage: EnhancedChatMessage = {
    id: Date.now().toString(),
    role: "user",
    content: [
      {
        type: MESSAGE_TYPES.TEXT,
        data: { text: content },
      },
    ],
    timestamp: new Date(),
    status: "sent",
  };

  mockMessages.value.push(newMessage);

  // 模拟AI回复
  setTimeout(() => {
    isTyping.value = true;
    setTimeout(() => {
      isTyping.value = false;
      isStreaming.value = true;

      const aiResponse: EnhancedChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: [
          {
            type: MESSAGE_TYPES.TEXT,
            data: {
              text: `收到你的消息："${content}"。这是一个模拟的AI回复，展示了消息发送和接收的完整流程。`,
            },
          },
        ],
        timestamp: new Date(),
        status: "sent",
      };

      mockMessages.value.push(aiResponse);

      setTimeout(() => {
        isStreaming.value = false;
      }, 2000);
    }, 1000);
  }, 500);
};

// 其他事件处理
const handleRetryMessage = () => {
  console.log("重试消息");
};

const handleClearMessages = () => {
  mockMessages.value = [];
};

const handleSwitchConnection = (type: "sse" | "websocket") => {
  connectionType.value = type;
  console.log("切换连接类型:", type);
};

// 页面标题
useHead({
  title: "智能体对话演示 - PowerX Admin",
});

// 页面标题
</script>

<template>
  <div class="h-screen flex flex-col">
    <!-- 页面头部 -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">智能体对话演示</h1>
          <p class="text-gray-600 mt-1">
            展示各种消息类型的样式效果，包括文本、Markdown、代码、图片、视频、卡片等
          </p>
        </div>
        <div class="flex items-center space-x-4">
          <UBadge color="green" variant="soft">
            {{ mockMessages.length }} 条消息
          </UBadge>
          <UButton
            variant="outline"
            icon="i-heroicons-arrow-left"
            @click="$router.push('/agent')"
          >
            返回
          </UButton>
        </div>
      </div>
    </div>

    <!-- 对话界面 -->
    <div class="flex-1 min-h-0 bg-gray-50">
      <ChatInterface
        :messages="mockMessages"
        :is-connected="isConnected"
        :is-streaming="isStreaming"
        :is-typing="isTyping"
        :current-agent="mockAgent"
        :connection-type="connectionType"
        @send-message="handleSendMessage"
        @retry-message="handleRetryMessage"
        @clear-messages="handleClearMessages"
        @switch-connection="handleSwitchConnection"
      />
    </div>

    <!-- 底部说明 -->
    <div class="bg-white border-t border-gray-200 px-6 py-3">
      <div class="flex items-center justify-between text-sm text-gray-600">
        <div class="flex items-center space-x-4">
          <span>💬 支持多种消息类型</span>
          <span>🎨 美观的UI设计</span>
          <span>⚡ 流式输入效果</span>
          <span>📱 响应式布局</span>
        </div>
        <div class="text-xs text-gray-500">PowerX Admin v2.1.0</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 自定义样式 */
.h-screen {
  height: 100vh;
}
</style>
