export interface SSEOptions {
  url: string
  headers?: Record<string, string>
  withCredentials?: boolean
  onOpen?: () => void
  onMessage?: (data: any) => void
  onError?: (error: Event) => void
  onClose?: () => void
  reconnect?: boolean
  reconnectInterval?: number
  maxReconnectAttempts?: number
}

export interface SSEConnection {
  connect: () => void
  disconnect: () => void
  isConnected: Ref<boolean>
  isConnecting: Ref<boolean>
  error: Ref<string | null>
  reconnectCount: Ref<number>
}

export function useSSE(options: SSEOptions): SSEConnection {
  const isConnected = ref(false)
  const isConnecting = ref(false)
  const error = ref<string | null>(null)
  const reconnectCount = ref(0)
  
  let eventSource: EventSource | null = null
  let reconnectTimer: NodeJS.Timeout | null = null
  
  const {
    url,
    headers = {},
    withCredentials = false,
    onOpen,
    onMessage,
    onError,
    onClose,
    reconnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5
  } = options

  const connect = () => {
    if (isConnected.value || isConnecting.value) {
      return
    }

    isConnecting.value = true
    error.value = null

    try {
      const sseUrl = new URL(url, window.location.origin)
      if (headers.Authorization) {
        sseUrl.searchParams.set('token', headers.Authorization.replace('Bearer ', ''))
      }

      eventSource = new EventSource(sseUrl.toString(), { withCredentials })

      eventSource.onopen = () => {
        isConnected.value = true
        isConnecting.value = false
        reconnectCount.value = 0
        onOpen?.()
      }

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          onMessage?.(data)
        } catch (err) {
          onMessage?.(event.data)
        }
      }

      eventSource.onerror = (event) => {
        error.value = 'SSE 连接错误'
        isConnected.value = false
        isConnecting.value = false
        onError?.(event)

        if (reconnect && reconnectCount.value < maxReconnectAttempts) {
          scheduleReconnect()
        }
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

    if (eventSource) {
      eventSource.close()
      eventSource = null
    }

    isConnected.value = false
    isConnecting.value = false
    onClose?.()
  }

  const scheduleReconnect = () => {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
    }

    reconnectTimer = setTimeout(() => {
      reconnectCount.value++
      connect()
    }, reconnectInterval)
  }

  onUnmounted(() => {
    disconnect()
  })

  return {
    connect,
    disconnect,
    isConnected: readonly(isConnected),
    isConnecting: readonly(isConnecting),
    error: readonly(error),
    reconnectCount: readonly(reconnectCount)
  }
}