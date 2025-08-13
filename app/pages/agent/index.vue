<script setup lang="ts">
import type { AgentConfig } from '~/composables/useAgentManager'

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
    console.error('聊天错误:', error)
    // 这里可以显示错误提示
  },
  onConnectionChange: (connected) => {
    console.log('连接状态变化:', connected)
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
  // 获取 Agent 列表
  await agentManager.fetchAgents(API_URL)
  
  // 连接聊天
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
      
      // 如果删除的是当前 Agent，切换到第一个可用的 Agent
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
      // 更新现有 Agent
      await agentManager.updateAgent(API_URL, editingAgent.value.id, config)
    } else {
      // 创建新 Agent
      const newAgent = await agentManager.createAgent(API_URL, {
        ...config,
        id: `agent_${Date.now()}`,
        isActive: true,
        capabilities: config.capabilities || [],
        temperature: config.temperature || 0.7,
        maxTokens: config.maxTokens || 2000
      })
      
      // 自动切换到新创建的 Agent
      await handleAgentSelect(newAgent.id)
    }
    
    showConfigPanel.value = false
    editingAgent.value = null
  } catch (error) {
    console.error('保存 Agent 失败:', error)
  }
}

// 关闭配置面板
const handleCloseConfig = () => {
  showConfigPanel.value = false
  editingAgent.value = null
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
    </div>

    <!-- 配置面板 -->
    <ConfigPanel
      :agent="editingAgent"
      :is-visible="showConfigPanel"
      @close="handleCloseConfig"
      @save="handleSaveAgent"
    />

    <!-- 错误提示 -->
    <UAlert />
  </div>
</template>

<style scoped>
/* 确保页面占满全高 */
.h-full {
  height: calc(100vh - 64px); /* 减去头部高度 */
}
</style>