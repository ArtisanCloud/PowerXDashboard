export interface Agent {
  id: string
  name: string
  description: string
  avatar?: string
  model: string
  systemPrompt: string
  temperature: number
  maxTokens: number
  topP: number
  frequencyPenalty: number
  presencePenalty: number
  isActive: boolean
  capabilities: AgentCapability[]
  createdAt: string
  updatedAt: string
}

export interface AgentCapability {
  id: string
  name: string
  description: string
  enabled: boolean
  config?: Record<string, any>
}

export interface ChatMessage {
  id: string
  role: 'system' | 'user' | 'assistant'
  content: string
  timestamp: number
  agentId?: string
  status?: 'sending' | 'sent' | 'error'
  metadata?: {
    model?: string
    tokens?: number
    cost?: number
  }
}

export interface ChatSession {
  id: string
  agentId: string
  title: string
  messages: ChatMessage[]
  createdAt: string
  updatedAt: string
}