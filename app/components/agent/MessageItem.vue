<script setup lang="ts">
import type { ChatMessage } from "~/types/message";
import type {
  EnhancedChatMessage,
  MessageContent,
  MESSAGE_TYPES,
} from "~/types/message";
import { useThinkParser } from "~/composables/agent/useThinkParser";
import ThinkBlock from "~/components/agent/ThinkBlock.vue";
import { ref, computed } from "vue";

const props = defineProps<{
  message: ChatMessage | EnhancedChatMessage;
  isStreaming?: boolean;
  agentName?: string;
}>();

const emit = defineEmits<{
  (e: "retry"): void;
  (e: "copy", content: string): void;
  (e: "delete"): void;
}>();

const { t } = useI18n();

// 判断是否为增强消息类型
const isEnhancedMessage = (msg: any): msg is EnhancedChatMessage => {
  return Array.isArray(msg.content);
};

// 获取消息内容
const getMessageContent = () => {
  if (isEnhancedMessage(props.message)) {
    return props.message.content;
  }
  // 兼容原有的简单文本消息
  return [
    {
      type: "text",
      data: { text: props.message.content },
    },
  ] as MessageContent[];
};

// Think 标签解析
const messageContentRef = computed(() => props.message.content || "");
const { parsedMessage } = useThinkParser(messageContentRef);

// 获取处理后的消息内容（移除 think 标签）
const getProcessedMessageContent = () => {
  if (isEnhancedMessage(props.message)) {
    return props.message.content;
  }

  // 对于简单文本消息，使用解析后的主要内容
  const mainContent = parsedMessage.value.mainContent;
  if (!mainContent) return [];

  return [
    {
      type: "text",
      data: { text: mainContent },
    },
  ] as MessageContent[];
};

// 复制文本到剪贴板
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    emit("copy", text);
  } catch (err) {
    console.error("复制失败:", err);
  }
};

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// 格式化时间
const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// 获取代码语言显示名称
const getLanguageDisplayName = (lang: string) => {
  const langMap: Record<string, string> = {
    javascript: "JavaScript",
    typescript: "TypeScript",
    python: "Python",
    java: "Java",
    cpp: "C++",
    csharp: "C#",
    php: "PHP",
    go: "Go",
    rust: "Rust",
    sql: "SQL",
    html: "HTML",
    css: "CSS",
    json: "JSON",
    yaml: "YAML",
    xml: "XML",
    bash: "Bash",
    shell: "Shell",
  };
  return langMap[lang.toLowerCase()] || lang.toUpperCase();
};

// 简单的 Markdown 渲染函数
const renderMarkdown = (markdown: string) => {
  let html = markdown;

  // 转义 HTML 特殊字符
  const escapeHtml = (text: string) => {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  };

  // 标题
  html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
  html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");

  // 粗体
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // 斜体
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // 行内代码
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // 链接
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" class="text-blue-600 hover:underline">$1</a>'
  );

  // 无序列表
  html = html.replace(/^\- (.*$)/gim, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>");

  // 有序列表
  html = html.replace(/^\d+\. (.*$)/gim, "<li>$1</li>");

  // 引用
  html = html.replace(/^> (.*$)/gim, "<blockquote>$1</blockquote>");

  // 表格（简单处理）
  const tableRegex = /\|(.+)\|\n\|[-\s|]+\|\n((?:\|.+\|\n?)*)/g;
  html = html.replace(tableRegex, (match, header, rows) => {
    const headerCells = header
      .split("|")
      .map((cell: string) => cell.trim())
      .filter((cell: string) => cell);
    const headerRow =
      "<tr>" +
      headerCells.map((cell: string) => `<th>${cell}</th>`).join("") +
      "</tr>";

    const bodyRows = rows
      .trim()
      .split("\n")
      .map((row: string) => {
        const cells = row
          .split("|")
          .map((cell: string) => cell.trim())
          .filter((cell: string) => cell);
        return (
          "<tr>" +
          cells.map((cell: string) => `<td>${cell}</td>`).join("") +
          "</tr>"
        );
      })
      .join("");

    return `<table class="border-collapse border border-gray-300"><thead>${headerRow}</thead><tbody>${bodyRows}</tbody></table>`;
  });

  // 换行
  html = html.replace(/\n/g, "<br>");

  return html;
};
</script>

<template>
  <div class="p-4 hover:bg-gray-50 transition-colors">
    <div class="flex space-x-3">
      <!-- 头像 -->
      <div class="flex-shrink-0">
        <div
          v-if="message.role === 'user'"
          class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-sm"
        >
          U
        </div>
        <div
          v-else-if="message.role === 'assistant'"
          class="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium text-sm"
        >
          {{ agentName?.charAt(0)?.toUpperCase() || "A" }}
        </div>
        <div
          v-else
          class="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white font-medium text-sm"
        >
          <UIcon name="i-heroicons-cog-6-tooth" class="w-4 h-4" />
        </div>
      </div>

      <!-- 消息内容 -->
      <div class="flex-1 min-w-0">
        <!-- 消息头部 -->
        <div class="flex items-center space-x-2 mb-2">
          <span class="font-medium text-gray-900">
            {{
              message.role === "user"
                ? t("agent.chat.you")
                : message.role === "assistant"
                  ? agentName || t("agent.chat.assistant")
                  : t("agent.chat.system")
            }}
          </span>
          <span class="text-xs text-gray-500">
            {{ formatTime(new Date(message.timestamp)) }}
          </span>
          <div v-if="isStreaming" class="flex items-center space-x-1">
            <div class="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
            <span class="text-xs text-blue-500">{{
              t("agent.chat.generating")
            }}</span>
          </div>
        </div>

        <!-- Think 块渲染 -->
        <div v-if="parsedMessage.hasThink" class="space-y-2 mb-4">
          <ThinkBlock
            v-for="(thinkBlock, index) in parsedMessage.thinkBlocks"
            :key="`think-${index}`"
            :content="thinkBlock.content"
            :index="thinkBlock.index"
            :is-streaming="isStreaming"
          />
        </div>

        <!-- 消息内容渲染 -->
        <div class="space-y-3">
          <template
            v-for="(content, index) in getProcessedMessageContent()"
            :key="index"
          >
            <!-- 文本消息 -->
            <div
              v-if="content.type === 'text'"
              class="prose prose-sm max-w-none"
            >
              <p class="text-gray-800 whitespace-pre-wrap">
                {{ content.data.text }}
              </p>
            </div>

            <!-- Markdown 消息 -->
            <div
              v-else-if="content.type === 'markdown'"
              class="prose prose-sm max-w-none"
            >
              <div class="bg-gray-50 rounded-lg p-4 border">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-medium text-gray-600 uppercase"
                    >Markdown</span
                  >
                  <UButton
                    size="xs"
                    variant="ghost"
                    icon="i-heroicons-clipboard"
                    @click="copyToClipboard(content.data.markdown)"
                  />
                </div>
                <div class="markdown-content">
                  <div v-html="renderMarkdown(content.data.markdown)"></div>
                </div>
              </div>
            </div>

            <!-- 代码消息 -->
            <div
              v-else-if="content.type === 'code'"
              class="bg-gray-900 rounded-lg overflow-hidden"
            >
              <div
                class="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700"
              >
                <div class="flex items-center space-x-2">
                  <UIcon
                    name="i-heroicons-code-bracket"
                    class="w-4 h-4 text-gray-400"
                  />
                  <span class="text-sm font-medium text-gray-300">
                    {{ getLanguageDisplayName(content.data.language) }}
                  </span>
                  <span
                    v-if="content.data.filename"
                    class="text-xs text-gray-500"
                  >
                    {{ content.data.filename }}
                  </span>
                </div>
                <UButton
                  size="xs"
                  variant="ghost"
                  icon="i-heroicons-clipboard"
                  class="text-gray-400 hover:text-white"
                  @click="copyToClipboard(content.data.code)"
                />
              </div>
              <pre
                class="p-4 text-sm text-gray-100 overflow-x-auto"
              ><code>{{ content.data.code }}</code></pre>
            </div>

            <!-- 图片消息 -->
            <div v-else-if="content.type === 'image'" class="space-y-2">
              <div
                class="relative inline-block rounded-lg overflow-hidden border border-gray-200"
              >
                <img
                  :src="content.data.url"
                  :alt="content.data.alt || '图片'"
                  :style="{
                    maxWidth: content.data.width
                      ? `${content.data.width}px`
                      : '400px',
                    maxHeight: content.data.height
                      ? `${content.data.height}px`
                      : '300px',
                  }"
                  class="object-cover"
                />
                <div class="absolute top-2 right-2">
                  <UButton
                    size="xs"
                    variant="solid"
                    color="neutral"
                    icon="i-heroicons-arrow-top-right-on-square"
                    @click="window.open(content.data.url, '_blank')"
                  />
                </div>
              </div>
              <p v-if="content.data.caption" class="text-sm text-gray-600">
                {{ content.data.caption }}
              </p>
            </div>

            <!-- 视频消息 -->
            <div v-else-if="content.type === 'video'" class="space-y-2">
              <div
                class="relative rounded-lg overflow-hidden border border-gray-200 bg-black"
              >
                <video
                  :src="content.data.url"
                  :poster="content.data.poster"
                  controls
                  class="w-full max-w-md"
                  style="max-height: 300px"
                >
                  您的浏览器不支持视频播放
                </video>
              </div>
              <div
                class="flex items-center justify-between text-sm text-gray-600"
              >
                <span v-if="content.data.caption">{{
                  content.data.caption
                }}</span>
                <span v-if="content.data.duration" class="text-xs">
                  {{ Math.floor(content.data.duration / 60) }}:{{
                    String(content.data.duration % 60).padStart(2, "0")
                  }}
                </span>
              </div>
            </div>

            <!-- 卡片消息 -->
            <div
              v-else-if="content.type === 'card'"
              class="max-w-sm border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
            >
              <div v-if="content.data.image" class="aspect-[4/3] bg-gray-100">
                <img
                  :src="content.data.image"
                  :alt="content.data.title"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="p-3">
                <h3 class="font-semibold text-gray-900 mb-1 text-sm">
                  {{ content.data.title }}
                </h3>
                <p
                  v-if="content.data.description"
                  class="text-gray-600 text-xs mb-2 line-clamp-2"
                >
                  {{ content.data.description }}
                </p>
                <div v-if="content.data.metadata" class="space-y-0.5 mb-2">
                  <div
                    v-for="(value, key) in content.data.metadata"
                    :key="key"
                    class="flex justify-between text-xs text-gray-500"
                  >
                    <span>{{ key }}:</span>
                    <span>{{ value }}</span>
                  </div>
                </div>
                <div v-if="content.data.actions" class="flex space-x-1">
                  <UButton
                    v-for="action in content.data.actions"
                    :key="action.label"
                    :variant="action.variant || 'outline'"
                    size="xs"
                    @click="console.log('Action:', action.action)"
                  >
                    {{ action.label }}
                  </UButton>
                </div>
              </div>
            </div>

            <!-- 文件消息 -->
            <div
              v-else-if="content.type === 'file'"
              class="border border-gray-200 rounded-lg p-4 bg-gray-50"
            >
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <UIcon
                    name="i-heroicons-document"
                    class="w-8 h-8 text-gray-500"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-gray-900 truncate">
                    {{ content.data.name }}
                  </p>
                  <p class="text-sm text-gray-500">
                    {{ content.data.type }} •
                    {{ formatFileSize(content.data.size) }}
                  </p>
                </div>
                <div class="flex-shrink-0">
                  <UButton
                    size="sm"
                    variant="outline"
                    icon="i-heroicons-arrow-down-tray"
                    @click="
                      window.open(
                        content.data.downloadUrl || content.data.url,
                        '_blank'
                      )
                    "
                  >
                    下载
                  </UButton>
                </div>
              </div>
            </div>

            <!-- 系统消息 -->
            <div
              v-else-if="content.type === 'system'"
              class="rounded-lg p-3"
              :class="{
                'bg-blue-50 border border-blue-200':
                  content.data.level === 'info',
                'bg-yellow-50 border border-yellow-200':
                  content.data.level === 'warning',
                'bg-red-50 border border-red-200':
                  content.data.level === 'error',
                'bg-green-50 border border-green-200':
                  content.data.level === 'success',
              }"
            >
              <div class="flex items-center space-x-2">
                <UIcon
                  :name="
                    {
                      info: 'i-heroicons-information-circle',
                      warning: 'i-heroicons-exclamation-triangle',
                      error: 'i-heroicons-x-circle',
                      success: 'i-heroicons-check-circle',
                    }[content.data.level]
                  "
                  :class="{
                    'text-blue-500': content.data.level === 'info',
                    'text-yellow-500': content.data.level === 'warning',
                    'text-red-500': content.data.level === 'error',
                    'text-green-500': content.data.level === 'success',
                  }"
                  class="w-5 h-5"
                />
                <span
                  class="text-sm font-medium"
                  :class="{
                    'text-blue-800': content.data.level === 'info',
                    'text-yellow-800': content.data.level === 'warning',
                    'text-red-800': content.data.level === 'error',
                    'text-green-800': content.data.level === 'success',
                  }"
                >
                  {{ content.data.message }}
                </span>
              </div>
            </div>
          </template>
        </div>

        <!-- 消息操作 -->
        <div
          class="flex items-center space-x-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <UButton
            v-if="message.role === 'assistant'"
            size="xs"
            variant="ghost"
            icon="i-heroicons-arrow-path"
            @click="emit('retry')"
          >
            重试
          </UButton>
          <UButton
            size="xs"
            variant="ghost"
            icon="i-heroicons-clipboard"
            @click="copyToClipboard(JSON.stringify(message.content))"
          >
            复制
          </UButton>
          <UButton
            size="xs"
            variant="ghost"
            icon="i-heroicons-trash"
            @click="emit('delete')"
          >
            删除
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

.markdown-content {
  color: #1f2937;
}

.markdown-content h1,
.markdown-content h2,
.markdown-content h3,
.markdown-content h4,
.markdown-content h5,
.markdown-content h6 {
  font-weight: 600;
  color: #111827;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.markdown-content p {
  margin-bottom: 0.75rem;
}

.markdown-content ul,
.markdown-content ol {
  margin-left: 1rem;
  margin-bottom: 0.75rem;
}

.markdown-content li {
  margin-bottom: 0.25rem;
}

.markdown-content code {
  background-color: #f3f4f6;
  color: #1f2937;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
}

.markdown-content pre {
  background-color: #f3f4f6;
  padding: 0.75rem;
  border-radius: 0.5rem;
  overflow-x: auto;
}

.markdown-content blockquote {
  border-left: 4px solid #d1d5db;
  padding-left: 1rem;
  font-style: italic;
  color: #4b5563;
}
</style>
