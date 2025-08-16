<script setup lang="ts">
import type { AgentConfig } from '~/composables/useAgentManager'
import ChatInterface from '@/components/agent/ChatInterface.vue'
import ConfigPanel from '@/components/agent/ConfigPanel.vue'

definePageMeta({
  title: 'Agent 对话',
  icon: 'i-heroicons-chat-bubble-left-right',
  order: 1
})

const { t } = useI18n()

// 配置
const API_URL = '/api/v1'
const WS_URL = 'ws://localhost:3001/ws'

// 状态管理
const currentAgentId = ref('default-agent')
const connectionType = ref<'sse' | 'websocket'>('sse')
const showConfigPanel = ref(false)
const editingAgent = ref<AgentConfig | null>(null)

// 一次性提醒（UAlert）
const { visible: alertVisible, title: alertTitle, description: alertDesc, notifyOnce, hide, reset } = useOneShotAlert()

// Agent 管理
const agentManager = useAgentManager()
const { agents, loading: agentsLoading, error: agentsError } = agentManager

// 聊天连接
const chatConnection = useAgentChat({
  connectionType: connectionType.value,
  apiUrl: API_URL,
  wsUrl: WS_URL,
  agentId: currentAgentId.value,
  headers: {
    'Authorization': 'Bearer your-token-here' // 这里应该从认证状态获取
  },
  onMessageReceived: (message) => {
    console.log('收到消息:', message)
  },
  onError: (error) => {
    // 降噪：不再用 console.error 刷屏
    // console.debug('聊天错误:', error)

    // 只提醒一次（SSE/WS 任一失败都会走这里）
    notifyOnce(
      t('agent.chat.realtimeFailed') || '实时连接失败',
      // 兼容你当前的浏览器报错：MIME 不是 text/event-stream
      // 这里给出更友好的描述
      (typeof error === 'string' ? error : (error?.message || 'SSE/WebSocket 连接建立失败，稍后将自动重试'))
    )
  },
  onConnectionChange: (connected) => {
    console.log('连接状态变化:', connected)
    // 一旦恢复连接，自动关闭提醒（但不重置“只提醒一次”的标记）
    if (connected && alertVisible.value) {
      hide()
    }
  }
})

// 解构聊天连接状态
const {
  messages,
  isConnected,
  isStreaming,
  isTyping,
  error: chatError,
  currentAgent,
  sendMessage,
  connect,
  disconnect,
  switchConnection,
  switchAgent,
  clearMessages,
  retryLastMessage
} = chatConnection

// 初始化
onMounted(async () => {
  await agentManager.fetchAgents(API_URL)
  connect()
})

// 组件卸载时断开连接
onUnmounted(() => {
  disconnect()
})

const agentsList = computed(() => Array.isArray(agents.value) ? agents.value : [])

// 处理 Agent 选择
const handleAgentSelect = async (agentId: string) => {
  if (agentId === currentAgentId.value) return
  currentAgentId.value = agentId
  await switchAgent(agentId)
}

// 处理连接方式切换
const handleConnectionSwitch = (type: 'sse' | 'websocket') => {
  connectionType.value = type
  switchConnection(type)
  // 切换连接方式时，重置一次性提醒标记，让用户在新方式失败时仍能看到一次提示
  reset()
}

// 处理发送消息
const handleSendMessage = async (content: string) => {
  await sendMessage(content)
}

// 处理重试消息
const handleRetryMessage = async () => {
  await retryLastMessage()
}

// 处理清空消息
const handleClearMessages = () => {
  clearMessages()
}

const handleCloseConfig = () => {
  showConfigPanel.value = false
  editingAgent.value = null
}

// 创建新 Agent
const handleCreateAgent = () => {
  editingAgent.value = null
  showConfigPanel.value = true
}

// 编辑 Agent
const handleEditAgent = (agentId: string) => {
  const agent = agents.value.find(a => a.id === agentId)
  if (agent) {
    editingAgent.value = agent
    showConfigPanel.value = true
  }
}

// 删除 Agent
const handleDeleteAgent = async (agentId: string) => {
  if (confirm(t('agent.confirmDelete'))) {
    try {
      await agentManager.deleteAgent(API_URL, agentId)
      if (agentId === currentAgentId.value && agents.value.length > 0) {
        const firstAgent = agents.value[0]
        await handleAgentSelect(firstAgent.id)
      }
    } catch (error) {
      console.error('删除 Agent 失败:', error)
    }
  }
}

// 保存 Agent 配置
const handleSaveAgent = async (config: Partial<AgentConfig>) => {
  try {
    if (editingAgent.value) {
      await agentManager.updateAgent(API_URL, editingAgent.value.id, config)
    } else {
      const newAgent = await agentManager.createAgent(API_URL, {
        ...config,
        id: `agent_${Date.now()}`,
        isActive: true,
        capabilities: config.capabilities || [],
        temperature: config.temperature || 0.7,
        maxTokens: config.maxTokens || 2000
      })
      await handleAgentSelect(newAgent.id)
    }
    showConfigPanel.value = false
    editingAgent.value = null
  } catch (error) {
    console.error('保存 Agent 失败:', error)
  }
}

// 计算当前 Agent
const selectedAgent = computed(() => {
  return agents.value.find(agent => agent.id === currentAgentId.value) || null
})
</script>

<template>
  <div class="flex h-full bg-gray-50">
    <!-- 左侧 Agent 选择器 -->
    <div class="w-80 flex-shrink-0">
      <AgentSelector
        :agents="Array.isArray(agents) ? agentsList : []"
        :current-agent-id="currentAgentId"
        :loading="agentsLoading"
        @select="handleAgentSelect"
        @create="handleCreateAgent"
        @edit="handleEditAgent"
        @delete="handleDeleteAgent"
      />
    </div>

    <!-- 中间聊天界面 -->
    <div class="flex-1 flex flex-col min-w-0">
      <ClientOnly>
        <ChatInterface
          :messages="Array.isArray(messages) ? messages : []"
          :is-connected="!!isConnected"
          :is-streaming="!!isStreaming"
          :is-typing="!!isTyping"
          :current-agent="selectedAgent || null"
          :connection-type="connectionType"
          @send-message="handleSendMessage"
          @retry-message="handleRetryMessage"
          @clear-messages="handleClearMessages"
          @switch-connection="handleConnectionSwitch"
        />
      </ClientOnly>
    </div>

    <!-- 配置面板 -->
    <ConfigPanel
      :agent="editingAgent"
      :is-visible="showConfigPanel"
      @close="handleCloseConfig"
      @save="handleSaveAgent"
    />

    <!-- 错误提示（只显示一次） -->
    <UAlert
      v-if="alertVisible" 
      :title="alertTitle || '实时连接失败'"
      :description="alertDesc || 'SSE/WebSocket 连接建立失败，请稍后再试。'"
      :color="'error'"
      :variant="'solid'"
      :icon="'i-heroicons-signal-slash-20-solid'"
      close
      @update:open="(val) => { hide()}"
      class="fixed bottom-4 right-4 max-w-sm"
    />
  </div>
</template>

<style scoped>
/* 确保页面占满全高 */
.h-full {
  height: calc(100vh - 64px); /* 减去头部高度 */
}
</style>
