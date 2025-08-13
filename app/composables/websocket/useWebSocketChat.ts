import type { ChatMessage, Agent } from '~/types/agent'
import { useWebSocket } from './useWebSocket'

export interface WebSocketChatOptions {
  wsUrl?: string
  onMessage?: (message: ChatMessage) => void
  onError?: (error: string) => void
  onConnectionChange?: (connected: boolean) => void
}

export function useWebSocketChat(options: WebSocketChatOptions = {}) {
  const { 
    wsUrl = 'ws://localhost:3001/ws',
    onMessage,
    onError,
    onConnectionChange
  } = options

  const messages = ref<ChatMessage[]>([])
  const isConnected = ref(false)
  const isConnecting = ref(false)
  const error = ref<string | null>(null)
  const currentAgent = ref<Agent | null>(null)

  // WebSocket 连接
  const { connect, disconnect, send, isConnected: wsConnected } = useWebSocket({
    url: wsUrl,
    headers: {
      Authorization: `Bearer ${useCookie('auth-token').value || ''}`
    },
    onOpen: () => {
      console.log('WebSocket 连接已建立')
      onConnectionChange?.(true)
    },
    onMessage: handleWebSocketMessage,
    onError: (event) => {
      const errorMsg = 'WebSocket 连接错误'
      error.value = errorMsg
      onError?.(errorMsg)
    },
    onClose: (event) => {
      console.log('WebSocket 连接已关闭', event.code, event.reason)
      onConnectionChange?.(false)
    }
  })

  // 监听连接状态
  watch(wsConnected, (connected) => {
    isConnected.value = connected
  })

  function handleWebSocketMessage(data: any) {
    try {
      if (data.type === 'chat_message') {
        const message: ChatMessage = {
          id: data.id || generateId(),
          role: data.role || 'assistant',
          content: data.content || '',
          timestamp: data.timestamp || Date.now(),
          agentId: data.agentId,
          status: 'sent'
        }
        
        // 查找是否是流式消息的更新
        const existingIndex = messages.value.findIndex(m => m.id === message.id)
        if (existingIndex >= 0) {
          messages.value[existingIndex] = message
        } else {
          messages.value.push(message)
        }
        
        onMessage?.(message)
      } else if (data.type === 'chat_stream') {
        // 处理流式消息
        handleStreamMessage(data)
      } else if (data.type === 'error') {
        error.value = data.message || '发生未知错误'
        onError?.(error.value)
      }
    } catch (err) {
      console.error('处理 WebSocket 消息失败:', err)
      error.value = '消息处理失败'
      onError?.(error.value)
    }
  }

  function handleStreamMessage(data: any) {
    const messageId = data.messageId
    const content = data.content || ''
    const isComplete = data.complete || false
    
    // 查找现有消息或创建新消息
    let existingIndex = messages.value.findIndex(m => m.id === messageId)
    
    if (existingIndex >= 0) {
      // 更新现有消息
      const existingMessage = messages.value[existingIndex]
      messages.value[existingIndex] = {
        ...existingMessage,
        content: existingMessage.content + content,
        status: isComplete ? 'sent' : 'sending'
      }
    } else {
      // 创建新消息
      const newMessage: ChatMessage = {
        id: messageId,
        role: 'assistant',
        content: content,
        timestamp: Date.now(),
        agentId: data.agentId,
        status: isComplete ? 'sent' : 'sending'
      }
      messages.value.push(newMessage)
    }
  }

  async function sendMessage(content: string, agent?: Agent) {
    if (!isConnected.value) {
      throw new Error('WebSocket 未连接')
    }

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: Date.now(),
      agentId: agent?.id,
      status: 'sending'
    }

    // 添加用户消息
    messages.value.push(userMessage)

    try {
      // 发送消息到 WebSocket
      await send({
        type: 'chat_send',
        message: {
          content,
          agentId: agent?.id,
          conversationId: generateConversationId()
        }
      })

      // 更新消息状态
      const messageIndex = messages.value.findIndex(m => m.id === userMessage.id)
      if (messageIndex >= 0) {
        messages.value[messageIndex].status = 'sent'
      }

    } catch (err) {
      // 更新消息状态为错误
      const messageIndex = messages.value.findIndex(m => m.id === userMessage.id)
      if (messageIndex >= 0) {
        messages.value[messageIndex].status = 'error'
      }
      throw err
    }
  }

  async function retryMessage(messageId: string) {
    const message = messages.value.find(m => m.id === messageId)
    if (!message || message.role !== 'user') {
      throw new Error('无法重试此消息')
    }

    // 移除原消息
    const index = messages.value.findIndex(m => m.id === messageId)
    if (index >= 0) {
      messages.value.splice(index, 1)
    }

    // 重新发送
    await sendMessage(message.content, currentAgent.value || undefined)
  }

  function deleteMessage(messageId: string) {
    const index = messages.value.findIndex(m => m.id === messageId)
    if (index >= 0) {
      messages.value.splice(index, 1)
    }
  }

  function clearMessages() {
    messages.value = []
  }

  function setAgent(agent: Agent | null) {
    currentAgent.value = agent
  }

  function generateId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  function generateConversationId(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // 连接管理
  function connectChat() {
    isConnecting.value = true
    error.value = null
    connect()
  }

  function disconnectChat() {
    disconnect()
  }

  // 组件卸载时清理
  onUnmounted(() => {
    disconnectChat()
  })

  return {
    // 状态
    messages: readonly(messages),
    isConnected: readonly(isConnected),
    isConnecting: readonly(isConnecting),
    error: readonly(error),
    currentAgent: readonly(currentAgent),

    // 方法
    connectChat,
    disconnectChat,
    sendMessage,
    retryMessage,
    deleteMessage,
    clearMessages,
    setAgent
  }
}