<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
  nextTick,
} from "vue";
import type { DeepReadonly } from "vue";
import type { ChatMessage } from "~/types/agent";
import type { AgentConfig } from "~/composables/useAgentManager";
import MessageItem from "~/components/agent/MessageItem.vue";

type ConnectionType = "sse" | "websocket";
type ViewAgent = AgentConfig | DeepReadonly<AgentConfig>;
type ViewMessage = ChatMessage | DeepReadonly<ChatMessage>;

const props = withDefaults(
  defineProps<{
    messages?: ReadonlyArray<ViewMessage>;
    isConnected?: boolean;
    isStreaming?: boolean;
    isTyping?: boolean;
    currentAgent?: ViewAgent | null;
    connectionType?: ConnectionType;
  }>(),
  {
    messages: () => [],
    isConnected: false,
    isStreaming: false,
    isTyping: false,
    currentAgent: null,
    connectionType: "sse",
  }
);

const emit = defineEmits<{
  (e: "send-message", content: string): void;
  (e: "retry-message"): void;
  (e: "clear-messages"): void;
  (e: "switch-connection", type: ConnectionType): void;
}>();

/* ----------------- 基础状态 ----------------- */
const { t } = useI18n();
const messageInput = ref("");
const inputRef = ref<HTMLTextAreaElement>();
const isComposing = ref(false);

const messagesContainer = ref<HTMLElement>();
const bottomSentinel = ref<HTMLDivElement>();

/* ----------------- 滚动 & 可见性 ----------------- */
const isAtBottom = ref(true); // 是否在底部（由 IO/滚动计算）
const unreadCount = ref(0); // 非底部时新增消息数
const DISTANCE_TOLERANCE = 10; // 允许的距离误差(px)

function calcIsAtBottom(): boolean {
  const el = messagesContainer.value;
  if (!el) return true;
  const { scrollTop, scrollHeight, clientHeight } = el;
  return scrollTop + clientHeight >= scrollHeight - DISTANCE_TOLERANCE;
}

function scrollToBottom(opts: { force?: boolean; smooth?: boolean } = {}) {
  // 不在底部且未强制时，尊重用户，不打断
  if (!opts.force && !isAtBottom.value) return;
  bottomSentinel.value?.scrollIntoView({
    block: "end",
    behavior: opts.smooth ? "smooth" : "auto",
  });
}

defineExpose({ scrollToBottom });

// 监听滚动（备用判定 & 手动清零未读）
function handleScroll() {
  isAtBottom.value = calcIsAtBottom();
  if (isAtBottom.value) unreadCount.value = 0;
}

// IO 优先判定“是否在底部”
let io: IntersectionObserver | null = null;
function setupIO() {
  const root = messagesContainer.value;
  const target = bottomSentinel.value;
  if (!root || !target || !("IntersectionObserver" in window)) return;

  io = new IntersectionObserver(
    (entries) => {
      const e = entries[0];
      // 只要底部哨兵进入可视区域（>=1 像素），就认为在底
      isAtBottom.value = !!e?.isIntersecting;
      if (isAtBottom.value) unreadCount.value = 0;
    },
    { root, threshold: 0 } // 阈值 0：更灵敏
  );
  io.observe(target);
}

/* ----------------- 媒体加载补偿 ----------------- */
function bindMediaLoadScroll() {
  const root = messagesContainer.value;
  if (!root) return;
  const once = (el: HTMLElement, evt: string, cb: () => void) => {
    const handler = () => {
      el.removeEventListener(evt, handler as any);
      cb();
    };
    el.addEventListener(evt, handler as any, { once: true });
  };

  const imgs = Array.from(root.querySelectorAll("img"));
  imgs.forEach((img) => {
    const im = img as HTMLImageElement;
    if (im.complete) return;
    once(im, "load", () => scrollToBottom());
  });

  const videos = Array.from(root.querySelectorAll("video"));
  videos.forEach((video) => {
    once(video as HTMLElement, "loadedmetadata", () => scrollToBottom());
    once(video as HTMLElement, "canplay", () => scrollToBottom());
  });
}

/* ----------------- 生命周期 & 监听 ----------------- */
onMounted(async () => {
  await nextTick();
  setupIO();
  scrollToBottom({ force: true }); // 首屏强制到底
  bindMediaLoadScroll();
});

onBeforeUnmount(() => {
  io?.disconnect();
  io = null;
  ro?.disconnect();
  ro = null;
});

// 新消息（长度变化）
watch(
  () => props.messages.length,
  async (newLen, oldLen) => {
    await nextTick();
    if (isAtBottom.value) {
      scrollToBottom();
    } else if (newLen > (oldLen ?? 0)) {
      unreadCount.value++;
    }
    bindMediaLoadScroll();
  }
);

// 流式追加：监听“最后一条消息内容”的深度变化
watch(
  () => props.messages.at(-1)?.content,
  async () => {
    await nextTick();
    if (isAtBottom.value) scrollToBottom();
  },
  { deep: true }
);

// 输入状态变化（打字/流式开始/结束）也试图对齐
watch(
  () => [props.isTyping, props.isStreaming],
  async () => {
    await nextTick();
    if (isAtBottom.value) scrollToBottom();
  }
);

/* ----------------- 容器 Resize 时补偿滚动 ----------------- */
let ro: ResizeObserver | null = null;
onMounted(() => {
  if ("ResizeObserver" in window) {
    ro = new ResizeObserver(() => {
      if (isAtBottom.value) scrollToBottom();
    });
    if (messagesContainer.value) ro.observe(messagesContainer.value);
  }
});

/* ----------------- 输入 & 发送 ----------------- */
function sendMessage() {
  const content = messageInput.value.trim();
  if (!content || props.isStreaming || !props.isConnected) return;
  emit("send-message", content);
  messageInput.value = "";
  if (inputRef.value) inputRef.value.style.height = "auto";
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === "Enter" && !e.shiftKey && !isComposing.value) {
    e.preventDefault();
    sendMessage();
  }
}

function adjustTextareaHeight() {
  if (!inputRef.value) return;
  inputRef.value.style.height = "auto";
  inputRef.value.style.height =
    Math.min(inputRef.value.scrollHeight, 120) + "px";
}

/* ----------------- UI 辅助 ----------------- */
const connectionLabel = computed(() => props.connectionType.toUpperCase());
function getConnectionStatusText() {
  if (!props.isConnected) return t("agent.chat.disconnected");
  if (props.isStreaming) return t("agent.chat.responding");
  if (props.isTyping) return t("agent.chat.typing");
  return t("agent.chat.connected");
}
function getConnectionStatusColor() {
  if (!props.isConnected) return "text-red-500";
  if (props.isStreaming || props.isTyping) return "text-blue-500";
  return "text-green-500";
}

/* ----------------- “回到底部”按钮显示逻辑 ----------------- */
const showScrollBtn = computed(() => !isAtBottom.value);
// 也可以根据距离增强判断：如果距底部超过一定像素再显示
// 此处有 IO + 滚动双保险，不再单独计算距离
</script>

<template>
  <div class="flex flex-col h-full min-h-0 bg-white">
    <!-- 头部 -->
    <div class="flex-shrink-0 p-4 border-b border-gray-200 bg-white">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div
            v-if="currentAgent?.avatar"
            class="w-10 h-10 rounded-full bg-cover bg-center"
            :style="{ backgroundImage: `url(${currentAgent.avatar})` }"
          />
          <div
            v-else
            class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium"
          >
            {{ currentAgent?.name?.charAt(0)?.toUpperCase() || "A" }}
          </div>

          <div>
            <h3 class="text-lg font-semibold text-gray-900">
              {{ currentAgent?.name || t("agent.chat.defaultAgent") }}
            </h3>
            <div class="flex items-center space-x-2 text-sm">
              <span :class="getConnectionStatusColor()">
                {{ getConnectionStatusText() }}
              </span>
              <span class="text-gray-300">•</span>
              <span class="text-gray-500">
                {{ connectionLabel }}
              </span>
            </div>
          </div>
        </div>

        <div class="flex items-center space-x-2">
          <!-- 切换连接 -->
          <UDropdownMenu
            :items="[
              [
                {
                  label: 'SSE',
                  icon: 'i-heroicons-signal',
                  click: () => $emit('switch-connection', 'sse'),
                  disabled: connectionLabel === 'SSE',
                },
              ],
              [
                {
                  label: 'WebSocket',
                  icon: 'i-heroicons-wifi',
                  click: () => $emit('switch-connection', 'websocket'),
                  disabled: connectionLabel === 'WEBSOCKET',
                },
              ],
            ]"
          >
            <UButton
              variant="outline"
              size="sm"
              :icon="
                connectionLabel === 'SSE'
                  ? 'i-heroicons-signal'
                  : 'i-heroicons-wifi'
              "
            >
              {{ connectionLabel }}
            </UButton>
          </UDropdownMenu>

          <UButton
            variant="outline"
            size="sm"
            icon="i-heroicons-trash"
            @click="$emit('clear-messages')"
            :disabled="messages.length === 0"
          >
            {{ t("agent.chat.clear") }}
          </UButton>
        </div>
      </div>
    </div>

    <!-- 消息列表（滚动容器） -->
    <div
      ref="messagesContainer"
      class="relative flex-1 min-h-0 overflow-y-auto"
      @scroll="handleScroll"
    >
      <!-- 空状态 -->
      <div
        v-if="messages.length === 0"
        class="flex items-center justify-center h-full"
      >
        <div class="text-center">
          <div
            class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <UIcon
              name="i-heroicons-chat-bubble-left-right"
              class="w-8 h-8 text-gray-400"
            />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            {{ t("agent.chat.welcomeTitle") }}
          </h3>
          <p class="text-gray-500 max-w-sm">
            {{ t("agent.chat.welcomeMessage") }}
          </p>
        </div>
      </div>

      <!-- 消息项 -->
      <div v-else class="divide-y divide-gray-100">
        <MessageItem
          v-for="message in messages"
          :key="message.id"
          :message="message"
          :is-streaming="
            isStreaming && message === messages[messages.length - 1]
          "
          :agent-name="currentAgent?.name"
          @retry="$emit('retry-message')"
          @copy="() => {}"
          @delete="() => {}"
        />
      </div>

      <!-- 正在输入指示器 -->
      <div v-if="isTyping && !isStreaming" class="p-4">
        <div class="flex items-center space-x-3">
          <div
            class="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium text-sm"
          >
            {{ currentAgent?.name?.charAt(0)?.toUpperCase() || "A" }}
          </div>
          <div class="flex items-center space-x-2">
            <div class="flex space-x-1">
              <div
                class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style="animation-delay: 0ms"
              ></div>
              <div
                class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style="animation-delay: 150ms"
              ></div>
              <div
                class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style="animation-delay: 300ms"
              ></div>
            </div>
            <span class="text-sm text-gray-500">{{
              t("agent.chat.agentTyping")
            }}</span>
          </div>
        </div>
      </div>

      <!-- 底部哨兵（锚点，最后一个） -->
      <div ref="bottomSentinel" aria-hidden="true" class="h-px"></div>

      <!-- 回到底部：粘在容器可视区的右下角（像 ChatGPT） -->
      <div class="sticky bottom-4 z-10">
        <transition name="fade">
          <button
            v-if="showScrollBtn"
            class="ml-auto mr-4 flex items-center gap-2 rounded-full shadow-lg px-3 py-2 bg-white border border-gray-200 hover:bg-gray-50 active:scale-95 transition pointer-events-auto"
            @click="
              () => {
                scrollToBottom({ force: true, smooth: true });
                unreadCount = 0;
              }
            "
          >
            <!-- 向下箭头 -->
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M6 9l6 6 6-6"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span class="text-sm text-gray-700">{{
              unreadCount > 0
                ? t("common.newMessages", { count: unreadCount })
                : t("common.scrollToBottom")
            }}</span>
          </button>
        </transition>
      </div>
    </div>

    <!-- 输入区 -->
    <div class="flex-shrink-0 border-t border-gray-200 bg-white">
      <div class="p-4">
        <div class="flex items-end space-x-3">
          <!-- 附件按钮 -->
          <div class="flex-shrink-0 pb-2">
            <UButton variant="ghost" size="sm" icon="i-heroicons-paper-clip" />
          </div>

          <!-- 输入框容器 -->
          <div class="flex-1 relative">
            <textarea
              ref="inputRef"
              v-model="messageInput"
              :placeholder="
                isConnected
                  ? t('agent.chat.inputPlaceholder')
                  : t('agent.chat.disconnectedPlaceholder')
              "
              :disabled="!isConnected || isStreaming"
              class="w-full resize-none border border-gray-300 rounded-lg px-4 py-3 pr-14 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              rows="1"
              style="min-height: 44px; max-height: 120px"
              @input="adjustTextareaHeight"
              @keydown="handleKeydown"
              @compositionstart="isComposing = true"
              @compositionend="isComposing = false"
            />
            <!-- 发送按钮 -->
            <div class="absolute right-2 bottom-2">
              <UButton
                :disabled="!messageInput.trim() || !isConnected || isStreaming"
                size="sm"
                icon="i-heroicons-paper-airplane"
                @click="sendMessage"
              />
            </div>
          </div>
        </div>

        <!-- 提示信息 -->
        <div
          class="flex items-center justify-between mt-3 text-xs text-gray-500"
        >
          <!-- 左侧：模型信息 -->
          <div v-if="currentAgent" class="flex items-center space-x-2">
            <span>{{ t("agent.chat.model") }}: {{ currentAgent.model }}</span>
            <span>•</span>
            <span
              >{{ t("agent.chat.temperature") }}:
              {{ currentAgent.temperature }}</span
            >
          </div>
          <div v-else></div>

          <!-- 右侧：操作提示 -->
          <div class="flex items-center space-x-4">
            <span>{{ t("agent.chat.enterToSend") }}</span>
            <span>{{ t("agent.chat.shiftEnterNewLine") }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 自定义滚动条（可选） */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}
.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 回到底部按钮过渡 */
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
