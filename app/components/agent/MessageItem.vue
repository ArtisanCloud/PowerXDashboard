<script setup lang="ts">
import type { ChatMessage } from '~/types/agent'

interface Props {
  message: ChatMessage
  isStreaming?: boolean
  showAvatar?: boolean
  agentName?: string
}

interface Emits {
  (e: 'retry'): void
  (e: 'copy', content: string): void
  (e: 'delete'): void
}

const props = withDefaults(defineProps<Props>(), {
  isStreaming: false,
  showAvatar: true
})

const emit = defineEmits<Emits>()

const { t } = useI18n()

// 格式化时间
const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  if (diff < 60000) { // 1分钟内
    return t('agent.message.justNow')
  } else if (diff < 3600000) { // 1小时内
    const minutes = Math.floor(diff / 60000)
    return t('agent.message.minutesAgo', { minutes })
  } else if (diff < 86400000) { // 24小时内
    const hours = Math.floor(diff / 3600000)
    return t('agent.message.hoursAgo', { hours })
  } else {
    return date.toLocaleDateString()
  }
}

// 复制内容
const copyContent = async () => {
  try {
    await navigator.clipboard.writeText(props.message.content)
    // 这里可以添加成功提示
    emit('copy', props.message.content)
  } catch (err) {
    console.error('复制失败:', err)
  }
}

// 获取状态图标
const getStatusIcon = () => {
  switch (props.message.status) {
    case 'sending':
      return 'i-heroicons-clock'
    case 'sent':
      return 'i-heroicons-check'
    case 'error':
      return 'i-heroicons-exclamation-triangle'
    default:
      return null
  }
}

// 获取状态颜色
const getStatusColor = () => {
  switch (props.message.status) {
    case 'sending':
      return 'text-yellow-500'
    case 'sent':
      return 'text-green-500'
    case 'error':
      return 'text-red-500'
    default:
      return 'text-gray-400'
  }
}

// 检测是否包含代码块
const hasCodeBlock = computed(() => {
  return props.message.content.includes('```')
})

// 解析消息内容（支持 Markdown）
const parsedContent = computed(() => {
  let content = props.message.content
  
  // 简单的 Markdown 解析
  // 代码块
  content = content.replace(/```(\w+)?\n([\s\S]*?)```/g, (match: string, lang: string, code: string) => {
    return `<pre class="code-block" data-lang="${lang || 'text'}"><code>${escapeHtml(code.trim())}</code></pre>`
  })
  
  // 行内代码
  content = content.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
  
  // 粗体
  content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  
  // 斜体
  content = content.replace(/\*(.*?)\*/g, '<em>$1</em>')
  
  // 链接
  content = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-blue-600 hover:underline">$1</a>')
  
  // 换行
  content = content.replace(/\n/g, '<br>')
  
  return content
})

// HTML 转义
const escapeHtml = (text: string) => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}
</script>

<template>
  <div 
    class="group flex space-x-3 p-4 hover:bg-gray-50 transition-colors"
    :class="{
      'bg-blue-50': message.role === 'user',
      'bg-white': message.role === 'assistant',
      'bg-yellow-50': message.role === 'system'
    }"
  >
    <!-- 头像 -->
    <div v-if="showAvatar" class="flex-shrink-0">
      <div
        v-if="message.role === 'user'"
        class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium"
      >
        U
      </div>
      <div
        v-else-if="message.role === 'assistant'"
        class="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-medium"
      >
        {{ agentName?.charAt(0).toUpperCase() || 'A' }}
      </div>
      <div
        v-else
        class="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-sm font-medium"
      >
                <UIcon class="w-4 h-4 inline-block" name="i-heroicons-cog-6-tooth"  />
      </div>
    </div>

    <!-- 消息内容 -->
    <div class="flex-1 min-w-0">
      <!-- 消息头部 -->
      <div class="flex items-center space-x-2 mb-1">
        <span class="text-sm font-medium text-gray-900">
          {{ message.role === 'user' ? t('agent.message.you') : 
             message.role === 'assistant' ? (agentName || t('agent.message.assistant')) : 
             t('agent.message.system') }}
        </span>
        <span class="text-xs text-gray-500">
          {{ formatTime(message.timestamp) }}
        </span>
        
        <!-- 状态图标 -->
                <span class="w-3 h-3 inline-block">
                  <UIcon
                  v-if="getStatusIcon()"
                  :name="getStatusIcon()!"
                  :class="getStatusColor()"
                  class=" w-3 h-3 inline-block"
                  />
                </span>
        
        <!-- 流式输入指示器 -->
        <div v-if="isStreaming && message.role === 'assistant'" class="flex items-center space-x-1">
          <div class="flex space-x-1">
            <div class="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
            <div class="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
            <div class="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
          </div>
          <span class="text-xs text-blue-500">{{ t('agent.message.typing') }}</span>
        </div>
      </div>

      <!-- 消息内容 -->
      <div class="prose prose-sm max-w-none">
        <div
          v-if="message.content"
          class="text-gray-800 leading-relaxed"
          v-html="parsedContent"
        />
        <div
          v-else-if="isStreaming"
          class="text-gray-400 italic"
        >
          {{ t('agent.message.thinking') }}
        </div>
      </div>

      <!-- 元数据 -->
      <div v-if="message.metadata" class="mt-2 text-xs text-gray-500">
        <details class="cursor-pointer">
          <summary class="hover:text-gray-700">{{ t('agent.message.metadata') }}</summary>
          <pre class="mt-1 p-2 bg-gray-100 rounded text-xs overflow-x-auto">{{ JSON.stringify(message.metadata, null, 2) }}</pre>
        </details>
      </div>

      <!-- 错误状态 -->
      <div v-if="message.status === 'error'" class="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
        <div class="flex items-center space-x-2">
                    <span class="w-4 h-4 text-red-500 inline-block">
                      <UIcon class="w-4 h-4 text-red-500 inline-block" name="i-heroicons-exclamation-triangle"  />
                    </span>
          <span class="text-sm text-red-700">{{ t('agent.message.sendFailed') }}</span>
          <UButton
            size="xs"
            variant="outline"
            color="error"
            @click="emit('retry')"
          >
            {{ t('agent.message.retry') }}
          </UButton>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex items-center space-x-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <UButton
          size="xs"
          variant="ghost"
          icon="i-heroicons-clipboard-document"
          @click="copyContent"
        >
          {{ t('agent.message.copy') }}
        </UButton>
        
        <UButton
          v-if="message.role === 'user' && message.status === 'error'"
          size="xs"
          variant="ghost"
          icon="i-heroicons-arrow-path"
          @click="emit('retry')"
        >
          {{ t('agent.message.retry') }}
        </UButton>
        
        <UButton
          size="xs"
          variant="ghost"
          icon="i-heroicons-trash"
          color="error"
          @click="emit('delete')"
        >
          {{ t('agent.message.delete') }}
        </UButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

/* 代码块样式 */
:deep(.code-block) {
  background-color: #1f2937;
  color: #f3f4f6;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  font-size: 0.875rem;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

:deep(.code-block::before) {
  content: attr(data-lang);
  @apply absolute top-2 right-2 text-xs text-gray-400 uppercase;
}

:deep(.code-block) {
  @apply relative;
}

/* 行内代码样式 */
:deep(.inline-code) {
  @apply bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

/* 链接样式 */
:deep(a) {
  @apply text-blue-600 hover:text-blue-800 hover:underline;
}

/* 列表样式 */
:deep(ul), :deep(ol) {
  @apply ml-4;
}

:deep(li) {
  @apply mb-1;
}

/* 引用样式 */
:deep(blockquote) {
  @apply border-l-4 border-gray-300 pl-4 italic text-gray-600;
}
</style>