export interface WebSocketOptions {
  url: string
  protocols?: string | string[]
  headers?: Record<string, string>
  onOpen?: () => void
  onMessage?: (data: any) => void
  onError?: (error: Event) => void
  onClose?: (event: CloseEvent) => void
  reconnect?: boolean
  reconnectInterval?: number
  maxReconnectAttempts?: number
  heartbeat?: boolean
  heartbeatInterval?: number
}

export interface WebSocketConnection {
  connect: () => void
  disconnect: () => void
  send: (data: any) => void
  isConnected: Ref<boolean>
  isConnecting: Ref<boolean>
  error: Ref<string | null>
  reconnectCount: Ref<number>
}

export function useWebSocket(options: WebSocketOptions): WebSocketConnection {
  const isConnected = ref(false)
  const isConnecting = ref(false)
  const error = ref<string | null>(null)
  const reconnectCount = ref(0)
  
  let ws: WebSocket | null = null
  let reconnectTimer: NodeJS.Timeout | null = null
  let heartbeatTimer: NodeJS.Timeout | null = null
  
  const {
    url,
    protocols,
    headers = {},
    onOpen,
    onMessage,
    onError,
    onClose,
    reconnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
    heartbeat = true,
    heartbeatInterval = 30000
  } = options

  const connect = () => {
    if (isConnected.value || isConnecting.value) {
      return
    }

    isConnecting.value = true
    error.value = null

    try {
      // 构建 WebSocket URL，添加认证参数
      const wsUrl = new URL(url)
      if (headers.Authorization) {
        wsUrl.searchParams.set('token', headers.Authorization.replace('Bearer ', ''))
      }

      ws = new WebSocket(wsUrl.toString(), protocols)

      ws.onopen = () => {
        isConnected.value = true
        isConnecting.value = false
        reconnectCount.value = 0
        
        // 启动心跳
        if (heartbeat) {
          startHeartbeat()
        }
        
        onOpen?.()
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          
          // 处理心跳响应
          if (data.type === 'pong') {
            return
          }
          
          onMessage?.(data)
        } catch (err) {
          console.error('解析 WebSocket 消息失败:', err)
          onMessage?.(event.data)
        }
      }

      ws.onclose = (event) => {
        isConnected.value = false
        isConnecting.value = false
        stopHeartbeat()
        
        onClose?.(event)

        // 自动重连（非主动关闭）
        if (reconnect && event.code !== 1000 && reconnectCount.value < maxReconnectAttempts) {
          scheduleReconnect()
        }
      }

      ws.onerror = (event) => {
        error.value = 'WebSocket 连接错误'
        isConnected.value = false
        isConnecting.value = false
        stopHeartbeat()
        
        onError?.(event)
      }

    } catch (err) {
      error.value = `连接失败: ${err}`
      isConnecting.value = false
    }
  }

  const disconnect = () => {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }

    stopHeartbeat()

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.close(1000, '主动断开连接')
    }

    ws = null
    isConnected.value = false
    isConnecting.value = false
  }

  const send = (data: any) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket 未连接')
    }

    try {
      const message = typeof data === 'string' ? data : JSON.stringify(data)
      ws.send(message)
    } catch (err) {
      console.error('发送 WebSocket 消息失败:', err)
      throw err
    }
  }

  const scheduleReconnect = () => {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
    }

    reconnectTimer = setTimeout(() => {
      reconnectCount.value++
      console.log(`尝试重连 WebSocket (${reconnectCount.value}/${maxReconnectAttempts})`)
      connect()
    }, reconnectInterval)
  }

  const startHeartbeat = () => {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer)
    }

    heartbeatTimer = setInterval(() => {
      if (isConnected.value) {
        try {
          send({ type: 'ping', timestamp: Date.now() })
        } catch (err) {
          console.error('发送心跳失败:', err)
        }
      }
    }, heartbeatInterval)
  }

  const stopHeartbeat = () => {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer)
      heartbeatTimer = null
    }
  }

  // 组件卸载时清理
  onUnmounted(() => {
    disconnect()
  })

  return {
    connect,
    disconnect,
    send,
    isConnected: readonly(isConnected),
    isConnecting: readonly(isConnecting),
    error: readonly(error),
    reconnectCount: readonly(reconnectCount)
  }
}