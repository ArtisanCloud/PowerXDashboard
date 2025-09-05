<script setup lang="ts">
import type { ChatMessage } from "~/types/message";
import type { EnhancedChatMessage, MessageContent } from "~/types/message";
import type { DeepReadonly } from "vue";
import { computed, watch, onBeforeUnmount } from "vue";
import { useI18n } from "#imports";
import { useThinkParser } from "~/composables/agent/useThinkParser";
import { useMessageTypewriter } from "~/composables/agent/useTypewriter";
import ThinkBlock from "~/components/agent/ThinkBlock.vue";

declare global {
  interface Window {
    open(url?: string | URL, target?: string, features?: string): Window | null;
  }
}

const props = defineProps<{
  message: ChatMessage | EnhancedChatMessage | DeepReadonly<ChatMessage>;
  isStreaming?: boolean;
  agentName?: string;
}>();

const emit = defineEmits<{
  (e: "retry"): void;
  (e: "copy", content: string): void;
  (e: "delete"): void;
}>();

const { t } = useI18n();

const isEnhancedMessage = (msg: any): msg is EnhancedChatMessage =>
  Array.isArray(msg?.content);

// 原始完整文本
const fullContentRef = computed(() =>
  typeof props.message.content === "string"
    ? (props.message.content as string)
    : ""
);

// 完整内容解析（静态）
const { parsedMessage } = useThinkParser(fullContentRef);

watch(
  () => ({
    id: (props.message as any)?.id,
    role: props.message.role,
    len:
      typeof props.message.content === "string"
        ? (props.message.content as string).length
        : -1,
    isStreaming: (props.message as any)?.isStreaming,
    isThinking: (props.message as any)?.isThinking,
    done: (props.message as any)?.done,
  }),
  (v) => {
    console.log("[MessageItem]", v);
  },
  { deep: false, immediate: true }
);

// 打字是否启用：兼容父 prop 和消息自身
const shouldUseTypewriter = computed(
  () =>
    props.message.role === "assistant" &&
    !(props.message as any).isError &&
    !(props.message as any).isThinking &&
    ((props.isStreaming ?? false) || (props.message as any).isStreaming)
);

const typewriter = useMessageTypewriter({
  speed: 25,
  onComplete: () => {},
});

// “正在打字的可见文本”解析（稳定 computed）
const displayedParsed = useThinkParser(
  computed(() => typewriter?.displayedText?.value ?? "")
);

// 强制去除 <think>…</think> 兜底
const stripThink = (s: string) =>
  (s ?? "").replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

// 只在“明确完成”才 complete，避免过早掐断
watch(
  [
    () => props.message.content,
    () => (props.message as any).isStreaming,
    () => (props.message as any).isThinking,
    () => (props.message as any).done,
  ],
  ([newContent, isStreaming, isThinking, done]) => {
    if (typeof newContent !== "string") return;

    if (
      (isStreaming || props.isStreaming) &&
      !isThinking &&
      props.message.role === "assistant" &&
      !(props.message as any).isError
    ) {
      typewriter.updateMessage(newContent, true);
    } else {
      typewriter.setText(newContent, false);
      if (done === true) typewriter.complete();
    }
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  typewriter?.cleanup?.();
});

// 最终渲染内容（稳定 computed + 兜底）
const processedContent = computed<MessageContent[]>(() => {
  if (isEnhancedMessage(props.message)) {
    return props.message.content as MessageContent[];
  }

  const usingTyping =
    props.message.role === "assistant" &&
    !(props.message as any).isError &&
    !(props.message as any).isThinking &&
    ((props.isStreaming ?? false) || (props.message as any).isStreaming);

  const parsedText = usingTyping
    ? displayedParsed.parsedMessage.value.mainContent
    : parsedMessage.value.mainContent;

  const raw = usingTyping
    ? (typewriter?.displayedText?.value ?? "")
    : (fullContentRef.value ?? "");

  const text = parsedText && parsedText.trim() ? parsedText : stripThink(raw);

  if (!text) return [];
  return [{ type: "text", data: { text } }];
});

// 工具函数 & 展示辅助
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    emit("copy", text);
  } catch (err) {
    console.error("复制失败:", err);
  }
};
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024,
    sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};
const formatTime = (date: Date | string | number) => {
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "无效时间";
    return new Intl.DateTimeFormat("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return "无效时间";
  }
};
const getLanguageDisplayName = (lang: string) => {
  const map: Record<string, string> = {
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
  return map[lang.toLowerCase()] || lang.toUpperCase();
};
const openExternalLink = (url: string) => {
  if (typeof window !== "undefined") window.open(url, "_blank");
};
const downloadFile = (url: string, downloadUrl?: string) => {
  if (typeof window !== "undefined") window.open(downloadUrl || url, "_blank");
};

// 简单 Markdown 渲染（保持你的原逻辑）
const renderMarkdown = (markdown: string) => {
  let html = markdown;
  html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
  html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" class="text-blue-600 hover:underline">$1</a>'
  );
  html = html.replace(/^\- (.*$)/gim, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>");
  html = html.replace(/^\d+\. (.*$)/gim, "<li>$1</li>");
  html = html.replace(/^> (.*$)/gim, "<blockquote>$1</blockquote>");
  const tableRegex = /\|(.+)\|\n\|[-\s|]+\|\n((?:\|.+\|\n?)*)/g;
  html = html.replace(tableRegex, (match, header, rows) => {
    const headerCells = header
      .split("|")
      .map((c) => c.trim())
      .filter(Boolean);
    const headerRow =
      "<tr>" + headerCells.map((c) => `<th>${c}</th>`).join("") + "</tr>";
    const bodyRows = rows
      .trim()
      .split("\n")
      .map((row) => {
        const cells = row
          .split("|")
          .map((c) => c.trim())
          .filter(Boolean);
        return "<tr>" + cells.map((c) => `<td>${c}</td>`).join("") + "</tr>";
      })
      .join("");
    return `<table class="border-collapse border border-gray-300"><thead>${headerRow}</thead><tbody>${bodyRows}</tbody></table>`;
  });
  html = html.replace(/\n/g, "<br>");
  return html;
};
</script>

<template>
  <div class="p-4 hover:bg-gray-50 transition-colors group">
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

      <!-- 内容 -->
      <div class="flex-1 min-w-0">
        <!-- 头部 -->
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
          <span class="text-xs text-gray-500">{{
            formatTime(message.timestamp)
          }}</span>
          <div
            v-if="(message as any).isStreaming || isStreaming"
            class="flex items-center space-x-1"
          >
            <div class="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
            <span class="text-xs text-blue-500">{{
              t("agent.chat.generating")
            }}</span>
          </div>
        </div>

        <!-- 思考中 -->
        <div
          v-if="(message as any).isThinking"
          class="flex items-center space-x-3 py-3"
        >
          <div class="flex space-x-1 items-center">
            <div class="w-2 h-2 bg-gray-400 rounded-full thinking-dot"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full thinking-dot"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full thinking-dot"></div>
          </div>
          <span class="text-sm text-gray-500 italic">
            {{ agentName || t("agent.chat.assistant") }} 正在思考...
          </span>
        </div>

        <!-- Think 区块 -->
        <div
          v-if="parsedMessage.hasThink && !(message as any).isThinking"
          class="space-y-2 mb-4"
        >
          <ThinkBlock
            v-for="(thinkBlock, index) in parsedMessage.thinkBlocks"
            :key="`think-${index}`"
            :content="thinkBlock.content"
            :index="thinkBlock.index"
            :is-streaming="(message as any).isStreaming || isStreaming"
          />
        </div>

        <!-- 主体 -->
        <div v-if="!(message as any).isThinking" class="space-y-3">
          <template v-for="(content, index) in processedContent" :key="index">
            <!-- 文本 -->
            <div
              v-if="content.type === 'text'"
              class="prose prose-sm max-w-none"
            >
              <p class="text-gray-800 whitespace-pre-wrap">
                {{ content.data.text }}
                <span
                  v-if="
                    (message as any).role === 'assistant' &&
                    ((message as any).isStreaming || isStreaming)
                  "
                  class="inline-block w-0.5 h-4 bg-blue-500 ml-0.5 animate-pulse"
                  style="animation: blink 1s infinite"
                />
              </p>
            </div>

            <!-- Markdown -->
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

            <!-- 代码 -->
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

            <!-- 图片 -->
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
                    @click="() => openExternalLink(content.data.url)"
                  />
                </div>
              </div>
              <p v-if="content.data.caption" class="text-sm text-gray-600">
                {{ content.data.caption }}
              </p>
            </div>

            <!-- 视频 -->
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

            <!-- 卡片 -->
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

            <!-- 文件 -->
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
                      () =>
                        downloadFile(content.data.url, content.data.downloadUrl)
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
                    (
                      {
                        info: 'i-heroicons-information-circle',
                        warning: 'i-heroicons-exclamation-triangle',
                        error: 'i-heroicons-x-circle',
                        success: 'i-heroicons-check-circle',
                      } as Record<string, string>
                    )[content.data.level] || 'i-heroicons-information-circle'
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

        <!-- 操作区 -->
        <div
          class="flex items-center space-x-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <UButton
            v-if="message.role === 'assistant'"
            size="xs"
            variant="ghost"
            icon="i-heroicons-arrow-path"
            @click="emit('retry')"
            >重试</UButton
          >
          <UButton
            size="xs"
            variant="ghost"
            icon="i-heroicons-clipboard"
            @click="
              copyToClipboard(
                typeof message.content === 'string'
                  ? message.content
                  : JSON.stringify(message.content)
              )
            "
            >复制</UButton
          >
          <UButton
            size="xs"
            variant="ghost"
            icon="i-heroicons-trash"
            @click="emit('delete')"
            >删除</UButton
          >
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

/* 思考动画 */
@keyframes thinking-bounce {
  0%,
  60%,
  100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-8px);
  }
}
.thinking-dot {
  animation: thinking-bounce 1.4s infinite ease-in-out;
}
.thinking-dot:nth-child(1) {
  animation-delay: 0ms;
}
.thinking-dot:nth-child(2) {
  animation-delay: 200ms;
}
.thinking-dot:nth-child(3) {
  animation-delay: 400ms;
}

/* 打字机光标动画 */
@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}
</style>
