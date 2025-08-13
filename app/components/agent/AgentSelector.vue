<script setup lang="ts">
import type { AgentConfig } from '~/composables/useAgentManager'

interface Props {
  agents?: AgentConfig[]          // ✅ 可选
  currentAgentId?: string
  loading?: boolean
}
interface Emits {
  (e: 'select', agentId: string): void
  (e: 'create'): void
  (e: 'edit', agentId: string): void
  (e: 'delete', agentId: string): void
}

const props = withDefaults(defineProps<Props>(), {
  agents: () => [],               // ✅ 默认空数组（SSR 安全）
  loading: false,
  currentAgentId: ''
})
const emit = defineEmits<Emits>()
const { t } = useI18n()

// ✅ 统一的“安全数组”，后续逻辑全部用它，不直接用 props.agents
const list = computed<AgentConfig[]>(() =>
  Array.isArray(props.agents) ? props.agents : []
)
const safeLen = computed(() => list.value.length)

// 搜索
const searchQuery = ref('')
const filteredAgents = computed<AgentConfig[]>(() => {
  const q = searchQuery.value?.trim().toLowerCase()
  if (!q) return list.value

  return list.value.filter(a => {
    const name = a.name?.toLowerCase() || ''
    const desc = a.description?.toLowerCase() || ''
    // ✅ capabilities 是对象数组，取 name/description 再匹配
    const caps = (a.capabilities || []).some(c =>
      (c.name?.toLowerCase() || '').includes(q) ||
      (c.description?.toLowerCase() || '').includes(q)
    )
    return name.includes(q) || desc.includes(q) || caps
  })
})

// 分组
const groupedAgents = computed(() => {
  const active = filteredAgents.value.filter(a => a.isActive)
  const inactive = filteredAgents.value.filter(a => !a.isActive)
  return { active, inactive }
})

const selectAgent = (id: string) => emit('select', id)

const getStatusColor = (agent: AgentConfig) => {
  if (!agent.isActive) return 'neutral'
  if (agent.id === props.currentAgentId) return 'primary'
  return 'success'
}

const getModelIcon = (model: string) => {
  const m = model?.toLowerCase() || ''
  if (m.includes('gpt')) return 'i-simple-icons-openai'
  if (m.includes('claude')) return 'i-simple-icons-anthropic'
  if (m.includes('gemini')) return 'i-simple-icons-google'
  return 'i-heroicons-cpu-chip'
}
</script>

<template>
  <div class="flex flex-col h-full bg-white border-r border-gray-200">
    <!-- 头部 -->
    <div class="p-4 border-b border-gray-200">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-semibold text-gray-900">
          {{ t('agent.selector.title') }}
        </h2>
        <UButton icon="i-heroicons-plus" size="sm" variant="outline" @click="emit('create')">
          {{ t('agent.selector.create') }}
        </UButton>
      </div>

      <UInput
        v-model="searchQuery"
        :placeholder="t('agent.selector.searchPlaceholder')"
        icon="i-heroicons-magnifying-glass"
        size="sm"
        class="w-full"
      />
    </div>

    <!-- 列表 -->
    <div class="flex-1 overflow-y-auto">
      <div v-if="loading" class="p-4">
        <div class="space-y-3">
          <USkeleton class="h-16 w-full" v-for="i in 3" :key="i" />
        </div>
      </div>

      <div v-else-if="filteredAgents.length === 0" class="p-4 text-center">
        <div class="text-gray-400 mb-2">
          <UIcon name="i-heroicons-face-frown" class="w-12 h-12 mx-auto" />
        </div>
        <p class="text-sm text-gray-500">
          {{ searchQuery ? t('agent.selector.noResults') : t('agent.selector.noAgents') }}
        </p>
      </div>

      <div v-else class="p-2">
        <!-- 活跃 -->
        <div v-if="groupedAgents.active.length > 0" class="mb-4">
          <div class="px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
            {{ t('agent.selector.active') }}
          </div>
          <div class="space-y-1 mt-2">
            <div
              v-for="agent in groupedAgents.active"
              :key="agent.id"
              class="group relative p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50"
              :class="{
                'bg-blue-50 border border-blue-200': agent.id === currentAgentId,
                'hover:bg-gray-50': agent.id !== currentAgentId
              }"
              @click="selectAgent(agent.id)"
            >
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0">
                  <div
                    v-if="agent.avatar"
                    class="w-10 h-10 rounded-full bg-cover bg-center"
                    :style="{ backgroundImage: `url(${agent.avatar})` }"
                  />
                  <div
                    v-else
                    class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm"
                  >
                    {{ agent.name?.charAt(0)?.toUpperCase() || 'A' }}
                  </div>
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <h3 class="text-sm font-medium text-gray-900 truncate">
                      {{ agent.name }}
                    </h3>
                    <UBadge :color="getStatusColor(agent)" size="xs" class="ml-2">
                      {{ agent.id === currentAgentId ? t('agent.selector.current') : t('agent.selector.available') }}
                    </UBadge>
                  </div>
                  <p class="text-xs text-gray-500 mt-1 line-clamp-2">
                    {{ agent.description }}
                  </p>
                  <div class="flex items-center mt-2 space-x-2">
                    <div class="flex items-center text-xs text-gray-400">
                      <UIcon :name="getModelIcon(agent.model)" class="w-3 h-3 mr-1" />
                      {{ agent.model }}
                    </div>
                    <div class="text-xs text-gray-300">•</div>
                    <div class="text-xs text-gray-400">
                      {{ (agent.capabilities?.length || 0) }} {{ t('agent.selector.capabilities') }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <UDropdownMenu
                  :items="[
                    [{ label: t('agent.selector.edit'), icon: 'i-heroicons-pencil',   click: () => emit('edit', agent.id) }],
                    [{ label: t('agent.selector.delete'), icon: 'i-heroicons-trash', click: () => emit('delete', agent.id) }]
                  ]"
                >
                  <UButton icon="i-heroicons-ellipsis-vertical" size="xs" variant="ghost" class="text-gray-400 hover:text-gray-600" />
                </UDropdownMenu>
              </div>
            </div>
          </div>
        </div>

        <!-- 非活跃 -->
        <div v-if="groupedAgents.inactive.length > 0">
          <div class="px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
            {{ t('agent.selector.inactive') }}
          </div>
          <div class="space-y-1 mt-2">
            <div
              v-for="agent in groupedAgents.inactive"
              :key="agent.id"
              class="group relative p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 opacity-60"
              @click="selectAgent(agent.id)"
            >
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0">
                  <div
                    v-if="agent.avatar"
                    class="w-10 h-10 rounded-full bg-cover bg-center grayscale"
                    :style="{ backgroundImage: `url(${agent.avatar})` }"
                  />
                  <div
                    v-else
                    class="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-medium text-sm"
                  >
                    {{ agent.name?.charAt(0)?.toUpperCase() || 'A' }}
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <h3 class="text-sm font-medium text-gray-600 truncate">
                      {{ agent.name }}
                    </h3>
                    <UBadge color="neutral" size="xs" class="ml-2">
                      {{ t('agent.selector.inactive') }}
                    </UBadge>
                  </div>
                  <p class="text-xs text-gray-400 mt-1 line-clamp-2">
                    {{ agent.description }}
                  </p>
                </div>
              </div>

              <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <UDropdownMenu
                  :items="[
                    [{ label: t('agent.selector.edit'), icon: 'i-heroicons-pencil',   click: () => emit('edit', agent.id) }],
                    [{ label: t('agent.selector.delete'), icon: 'i-heroicons-trash', click: () => emit('delete', agent.id) }]
                  ]"
                >
                  <UButton icon="i-heroicons-ellipsis-vertical" size="xs" variant="ghost" class="text-gray-400 hover:text-gray-600" />
                </UDropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部 -->
    <div class="p-4 border-t border-gray-200 bg-gray-50">
      <div class="text-xs text-gray-500 text-center">
        {{ t('agent.selector.totalCount', { count: safeLen }) }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
