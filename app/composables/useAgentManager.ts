import type { Agent } from '~/types/agent'

export interface AgentConfig {
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
  capabilities: Array<{
    id: string
    name: string
    description: string
    enabled: boolean
    config?: Record<string, any>
  }>
}

export function useAgentManager() {
  const agents = ref<Agent[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 获取 Agent 列表
  async function fetchAgents(apiUrl: string) {
    loading.value = true
    error.value = null
    
    try {
      const response = await $fetch<{ data: Agent[] }>(`${apiUrl}/agents`, {
        headers: {
          'Authorization': `Bearer ${useCookie('auth-token').value || ''}`
        }
      })
      
      agents.value = response.data || []
      return agents.value
    } catch (err) {
      console.error('获取 Agent 列表失败:', err)
      error.value = '获取 Agent 列表失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 创建 Agent
  async function createAgent(apiUrl: string, agentData: Partial<AgentConfig>) {
    loading.value = true
    error.value = null
    
    try {
      const response = await $fetch<{ data: Agent }>(`${apiUrl}/agents`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${useCookie('auth-token').value || ''}`,
          'Content-Type': 'application/json'
        },
        body: {
          ...agentData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      })
      
      const newAgent = response.data
      agents.value.push(newAgent)
      return newAgent
    } catch (err) {
      console.error('创建 Agent 失败:', err)
      error.value = '创建 Agent 失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 更新 Agent
  async function updateAgent(apiUrl: string, agentId: string, agentData: Partial<AgentConfig>) {
    loading.value = true
    error.value = null
    
    try {
      const response = await $fetch<{ data: Agent }>(`${apiUrl}/agents/${agentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${useCookie('auth-token').value || ''}`,
          'Content-Type': 'application/json'
        },
        body: {
          ...agentData,
          updatedAt: new Date().toISOString()
        }
      })
      
      const updatedAgent = response.data
      const index = agents.value.findIndex(a => a.id === agentId)
      if (index >= 0) {
        agents.value[index] = updatedAgent
      }
      
      return updatedAgent
    } catch (err) {
      console.error('更新 Agent 失败:', err)
      error.value = '更新 Agent 失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 删除 Agent
  async function deleteAgent(apiUrl: string, agentId: string) {
    loading.value = true
    error.value = null
    
    try {
      await $fetch(`${apiUrl}/agents/${agentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${useCookie('auth-token').value || ''}`
        }
      })
      
      agents.value = agents.value.filter(a => a.id !== agentId)
    } catch (err) {
      console.error('删除 Agent 失败:', err)
      error.value = '删除 Agent 失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 获取单个 Agent
  async function getAgent(apiUrl: string, agentId: string) {
    loading.value = true
    error.value = null
    
    try {
      const response = await $fetch<{ data: Agent }>(`${apiUrl}/agents/${agentId}`, {
        headers: {
          'Authorization': `Bearer ${useCookie('auth-token').value || ''}`
        }
      })
      
      return response.data
    } catch (err) {
      console.error('获取 Agent 失败:', err)
      error.value = '获取 Agent 失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 切换 Agent 状态
  async function toggleAgentStatus(apiUrl: string, agentId: string) {
    const agent = agents.value.find(a => a.id === agentId)
    if (!agent) {
      throw new Error('Agent 不存在')
    }
    
    return await updateAgent(apiUrl, agentId, {
      isActive: !agent.isActive
    })
  }

  // 复制 Agent
  async function duplicateAgent(apiUrl: string, agentId: string) {
    const agent = agents.value.find(a => a.id === agentId)
    if (!agent) {
      throw new Error('Agent 不存在')
    }
    
    const duplicatedAgent = {
      ...agent,
      id: `${agent.id}_copy_${Date.now()}`,
      name: `${agent.name} (副本)`,
      createdAt: undefined,
      updatedAt: undefined
    }
    
    return await createAgent(apiUrl, duplicatedAgent)
  }

  return {
    // 状态
    agents: readonly(agents),
    loading: readonly(loading),
    error: readonly(error),
    
    // 方法
    fetchAgents,
    createAgent,
    updateAgent,
    deleteAgent,
    getAgent,
    toggleAgentStatus,
    duplicateAgent
  }
}