<script setup lang="ts">
import type { DeepReadonly } from 'vue'
import type { ChatMessage } from '~/types/agent'
import type { AgentConfig } from '~/composables/useAgentManager'

// 如果你没全局声明过，就保留这行；若已有同名类型，删掉这行
type ConnectionType = 'sse' | 'websocket'

// 👇 接受“只读或可变”的 Agent/Message
type ViewAgent   = AgentConfig | DeepReadonly<AgentConfig>
type ViewMessage = ChatMessage | DeepReadonly<ChatMessage>

const props = withDefaults(defineProps<{
  messages?: ReadonlyArray<ViewMessage>
  isConnected?: boolean
  isStreaming?: boolean
  isTyping?: boolean
  currentAgent?: ViewAgent | null
  connectionType?: ConnectionType
}>(), {
  messages: () => [],       // 默认空数组，防止 undefined.length
  isConnected: false,
  isStreaming: false,
  isTyping: false,
  currentAgent: null,       // 明确 null，不传 undefined
  connectionType: 'sse'
})

const emit = defineEmits<{
  (e: 'send-message', content: string): void
  (e: 'retry-message'): void
  (e: 'clear-messages'): void
  (e: 'switch-connection', type: ConnectionType): void
}>()

const { t } = useI18n()

// ===== 工具 & UI 状态 =====
const messageInput = ref('')
const inputRef = ref<HTMLTextAreaElement>()
const isComposing = ref(false)

const messagesContainer = ref<HTMLElement>()
const shouldAutoScroll = ref(true)

const fileInput = ref<HTMLInputElement>()
const uploadedFiles = ref<File[]>([])

// 👇 安全拿头像首字母，避免 undefined.toUpperCase()
function safeInitial(name?: string, fallback = 'A') {
  const ch = name?.trim()?.[0]
  return ch ? ch.toUpperCase() : fallback
}
const connectionLabel = computed(() => props.connectionType.toUpperCase())

watch(() => props.messages, () => {
  if (shouldAutoScroll.value) nextTick(scrollToBottom)
}, { deep: true })

const sendMessage = () => {
  const content = messageInput.value.trim()
  if (!content || props.isStreaming || !props.isConnected) return
  emit('send-message', content)
  messageInput.value = ''
  if (inputRef.value) inputRef.value.style.height = 'auto'
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey && !isComposing.value) {
    e.preventDefault()
    sendMessage()
  }
}

const adjustTextareaHeight = () => {
  if (!inputRef.value) return
  inputRef.value.style.height = 'auto'
  inputRef.value.style.height = Math.min(inputRef.value.scrollHeight, 120) + 'px'
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const handleScroll = () => {
  if (!messagesContainer.value) return
  const { scrollTop, scrollHeight, clientHeight } = messagesContainer.value
  shouldAutoScroll.value = scrollTop + clientHeight >= scrollHeight - 10
}

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files) uploadedFiles.value = Array.from(target.files)
}
const removeFile = (i: number) => uploadedFiles.value.splice(i, 1)
const triggerFileUpload = () => fileInput.value?.click()

const getConnectionStatusText = () => {
  if (!props.isConnected) return t('agent.chat.disconnected')
  if (props.isStreaming)  return t('agent.chat.responding')
  if (props.isTyping)     return t('agent.chat.typing')
  return t('agent.chat.connected')
}
const getConnectionStatusColor = () => {
  if (!props.isConnected) return 'text-red-500'
  if (props.isStreaming || props.isTyping) return 'text-blue-500'
  return 'text-green-500'
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024, sizes = ['Bytes','KB','MB','GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}
</script>

<template>
  <div class="flex flex-col h-full bg-white">
    <!-- 头部 -->
    <div class="flex-shrink-0 p-4 border-b border-gray-200 bg-white">
      <div class="flex items-center justify-between">
        <!-- Agent 信息 -->
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
            {{ currentAgent?.name?.charAt(0)?.toUpperCase() || 'A' }}
          </div>
          
          <div>
            <h3 class="text-lg font-semibold text-gray-900">
              {{ currentAgent?.name || t('agent.chat.defaultAgent') }}
            </h3>
            <div class="flex items-center space-x-2 text-sm">
              <span :class="getConnectionStatusColor()">
                {{ getConnectionStatusText() }}
              </span>
              <span class="text-gray-300">•</span>
              <span class="text-gray-500">
                {{ connectionType.toUpperCase() }}
              </span>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex items-center space-x-2">
          <!-- 连接方式切换 -->
          <UDropdownMenu
            :items="[
              [{
                label: 'SSE',
                icon: 'i-heroicons-signal',
                click: () => emit('switch-connection', 'sse'),
                disabled: connectionType === 'sse'
              }],
              [{
                label: 'WebSocket',
                icon: 'i-heroicons-wifi',
                click: () => emit('switch-connection', 'websocket'),
                disabled: connectionType === 'websocket'
              }]
            ]"
          >
            <UButton
              variant="outline"
              size="sm"
              :icon="connectionType === 'sse' ? 'i-heroicons-signal' : 'i-heroicons-wifi'"
            >
              {{ connectionType.toUpperCase() }}
            </UButton>
          </UDropdownMenu>

          <!-- 清空对话 -->
          <UButton
            variant="outline"
            size="sm"
            icon="i-heroicons-trash"
            @click="emit('clear-messages')"
            :disabled="messages.length === 0"
          >
            {{ t('agent.chat.clear') }}
          </UButton>
        </div>
      </div>
    </div>

    <!-- 消息列表 -->
    <div
      ref="messagesContainer"
      class="flex-1 overflow-y-auto"
      @scroll="handleScroll"
    >
      <!-- 空状态 -->
      <div v-if="messages.length === 0" class="flex items-center justify-center h-full">
        <div class="text-center">
          <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <UIcon name="i-heroicons-chat-bubble-left-right" class="w-8 h-8 text-gray-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            {{ t('agent.chat.welcomeTitle') }}
          </h3>
          <p class="text-gray-500 max-w-sm">
            {{ t('agent.chat.welcomeMessage') }}
          </p>
        </div>
      </div>

      <!-- 消息列表 -->
      <div v-else class="divide-y divide-gray-100">
        <MessageItem
          v-for="message in messages"
          :key="message.id"
          :message="message"
          :is-streaming="isStreaming && message === messages[messages.length - 1]"
          :agent-name="currentAgent?.name"
          @retry="emit('retry-message')"
          @copy="(content) => {
            // 复制成功提示
            console.log('已复制:', content)
          }"
          @delete="() => {
            // 删除消息逻辑
            console.log('删除消息:', message.id)
          }"
        />
      </div>

      <!-- 正在输入指示器 -->
      <div v-if="isTyping && !isStreaming" class="p-4">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium text-sm">
            {{ currentAgent?.name?.charAt(0).toUpperCase() || 'A' }}
          </div>
          <div class="flex items-center space-x-2">
            <div class="flex space-x-1">
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
            </div>
            <span class="text-sm text-gray-500">{{ t('agent.chat.agentTyping') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="flex-shrink-0 border-t border-gray-200 bg-white">
      <!-- 文件上传预览 -->
      <div v-if="uploadedFiles.length > 0" class="p-4 border-b border-gray-100">
        <div class="flex flex-wrap gap-2">
          <div
            v-for="(file, index) in uploadedFiles"
            :key="index"
            class="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2"
          >
            <UIcon name="i-heroicons-document" class="w-4 h-4 text-gray-500" />
            <span class="text-sm text-gray-700">{{ file.name }}</span>
            <span class="text-xs text-gray-500">({{ formatFileSize(file.size) }})</span>
            <UButton
              size="xs"
              variant="ghost"
              icon="i-heroicons-x-mark"
              @click="removeFile(index)"
            />
          </div>
        </div>
      </div>

      <!-- 输入框 -->
      <div class="p-4">
        <div class="flex items-end space-x-3">
          <!-- 附件按钮 -->
          <UButton
            variant="ghost"
            size="sm"
            icon="i-heroicons-paper-clip"
            @click="triggerFileUpload"
            class="flex-shrink-0"
          />

          <!-- 输入框 -->
          <div class="flex-1 relative">
            <textarea
              ref="inputRef"
              v-model="messageInput"
              :placeholder="isConnected ? t('agent.chat.inputPlaceholder') : t('agent.chat.disconnectedPlaceholder')"
              :disabled="!isConnected || isStreaming"
              class="w-full resize-none border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              rows="1"
              style="min-height: 44px; max-height: 120px;"
              @input="adjustTextareaHeight"
              @keydown="handleKeydown"
              @compositionstart="isComposing = true"
              @compositionend="isComposing = false"
            />
            
            <!-- 发送按钮 -->
            <UButton
              :disabled="!messageInput.trim() || !isConnected || isStreaming"
              size="sm"
              icon="i-heroicons-paper-airplane"
              class="absolute right-2 bottom-2"
              @click="sendMessage"
            />
          </div>
        </div>

        <!-- 提示信息 -->
        <div class="flex items-center justify-between mt-2 text-xs text-gray-500">
          <div class="flex items-center space-x-4">
            <span>{{ t('agent.chat.enterToSend') }}</span>
            <span>{{ t('agent.chat.shiftEnterNewLine') }}</span>
          </div>
          <div v-if="currentAgent" class="flex items-center space-x-2">
            <span>{{ t('agent.chat.model') }}: {{ currentAgent.model }}</span>
            <span>•</span>
            <span>{{ t('agent.chat.temperature') }}: {{ currentAgent.temperature }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 隐藏的文件输入 -->
    <input
      ref="fileInput"
      type="file"
      multiple
      accept=".txt,.md,.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
      class="hidden"
      @change="handleFileSelect"
    />
  </div>
</template>

<style scoped>
/* 自定义滚动条 */
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

/* 文本框样式 */
textarea {
  font-family: inherit;
  line-height: 1.5;
}

textarea:focus {
  outline: none;
}
</style>