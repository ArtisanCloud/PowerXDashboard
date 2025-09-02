<script setup lang="ts">
import type { Agent } from "~/types/agent";
import type { ChatSession } from "~/components/agent/AgentSidebar.vue";
import ChatInterface from "@/components/agent/ChatInterface.vue";
import ConfigPanel from "@/components/agent/ConfigPanel.vue";
import ConnectionIndicators from "@/components/agent/ConnectionIndicators.vue";
import AgentSidebar from "@/components/agent/AgentSidebar.vue";
import { useDualChannelConnection } from "~/composables/agent/useDualChannelConnection";
import { useAgentManager } from "~/composables/agent/useAgentManager";
import { useChatSessions } from "~/composables/agent/useChatSessions";
import { useOneShotAlert } from "~/composables/useOneShotAlert";

definePageMeta({
  title: "Agent 对话",
  icon: "i-heroicons-chat-bubble-left-right",
  order: 1,
});

const { t } = useI18n();

// 状态管理
const currentAgentId = ref<number>(1);

// ===== 会话状态（按 Agent 维度）=====
const currentSessionId = ref<number | string | null>(null);
const sessionsByAgent = reactive<Record<number, ChatSession[]>>({});
const sessionsLoadingByAgent = reactive<Record<number, boolean>>({});
const hasMoreByAgent = reactive<Record<number, boolean>>({});

// 工具：拿到某 agent 的数组（始终给个安全数组）
const getSessions = (agentId: number) => sessionsByAgent[agentId] || [];

// 双通道聊天流管理
const chat = useDualChannelConnection();

// 设置消息回调
chat.onMessage = (message) => {
  console.log("收到消息:", message);
};

chat.onError = (error) => {
  console.error("聊天错误:", error);
};
const showConfigPanel = ref(false);
const editingAgent = ref<Agent | null>(null);

// 左侧面板收缩状态
const isLeftPanelCollapsed = ref(false);
const toggleLeftPanel = () => {
  isLeftPanelCollapsed.value = !isLeftPanelCollapsed.value;
};

// 一次性提醒（UAlert）
const { notifyOnce } = useOneShotAlert();

// Agent 管理
const agentManager = useAgentManager();
const { agents } = agentManager;

// 使用双通道聊天的状态
const messagesList = computed(() =>
  Array.isArray(chat.messages.value) ? chat.messages.value : []
);
const isConnected = computed(() => chat.sseActive.value || chat.wsActive.value);
const isStreaming = computed(() => chat.isGenerating.value);
const isTyping = ref(false);

// 会话管理 composable
useChatSessions();

const retryLastMessage = async () => {
  console.log("重试最后一条消息");
};

// 初始化
onMounted(async () => {
  try {
    await agentManager.fetchAgents();
    if (agents.value && agents.value.length > 0) {
      await handleAgentSelect(agents.value[0].id);
    }
  } catch (e: any) {
    if (!(e?.status === 404 || e?.statusCode === 404)) {
      notifyOnce(
        t("agent.list.loadFailed") || "加载 Agent 列表失败",
        e?.message || ""
      );
    }
  }
});

// 组件卸载时断开连接
onUnmounted(() => {
  chat.disconnect();
});

const agentsList = computed(() =>
  Array.isArray(agents.value) ? agents.value : []
);

// ===== 会话事件处理 =====
const handleSelectSession = async (payload: {
  agentId: number;
  sessionId: string | number;
}) => {
  const { agentId, sessionId } = payload;
  if (currentAgentId.value !== agentId) currentAgentId.value = agentId;
  currentSessionId.value = sessionId;
  chat.clearMessages();
};

const handleNewSession = async () => {
  if (!currentAgentId.value) return;
  const session: ChatSession = {
    id: `session-${currentAgentId.value}-${Date.now()}`,
    title: t("agent.sessions.untitledSession") || "新会话",
    lastMessage: "新会话已创建",
    updatedAt: new Date(),
    unread: 0,
    pinned: false,
  };
  const agentId = currentAgentId.value;
  if (!sessionsByAgent[agentId]) sessionsByAgent[agentId] = [];
  sessionsByAgent[agentId].unshift(session);
  currentSessionId.value = session.id;
  chat.clearMessages();
};

const handleDeleteSession = async (payload: {
  agentId: number;
  sessionId: string | number;
}) => {
  const { agentId, sessionId } = payload;
  if (!confirm(t("agent.confirmDelete") || "确定删除该会话？")) return;
  const sessions = sessionsByAgent[agentId] || [];
  const index = sessions.findIndex((s) => s.id === sessionId);
  if (index > -1) sessions.splice(index, 1);
  if (currentSessionId.value === sessionId) {
    const remaining = sessionsByAgent[agentId] || [];
    currentSessionId.value = remaining.length > 0 ? remaining[0].id : null;
    if (!remaining.length) chat.clearMessages();
  }
};

const handlePinSession = async (payload: {
  agentId: number;
  sessionId: string | number;
  pinned: boolean;
}) => {
  const { agentId, sessionId, pinned } = payload;
  const sessions = sessionsByAgent[agentId] || [];
  const session = sessions.find((s) => s.id === sessionId);
  if (session) session.pinned = pinned;
};

const handleLoadMoreSessions = async () => {
  if (!currentAgentId.value || sessionsLoadingByAgent[currentAgentId.value])
    return;
  try {
    sessionsLoadingByAgent[currentAgentId.value] = true;
    const more: ChatSession[] = [
      {
        id: `session-${currentAgentId.value}-more-${Date.now()}`,
        title: "更多历史会话",
        lastMessage: "这是加载的更多会话内容...",
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
        unread: 0,
        pinned: false,
      },
    ];
    const agentId = currentAgentId.value;
    if (!sessionsByAgent[agentId]) sessionsByAgent[agentId] = [];
    sessionsByAgent[agentId].push(...more);
    hasMoreByAgent[agentId] = false;
  } finally {
    if (currentAgentId.value)
      sessionsLoadingByAgent[currentAgentId.value] = false;
  }
};

const handleRenameSession = async (payload: {
  agentId: number;
  sessionId: string | number;
  title: string;
}) => {
  const { agentId, sessionId, title } = payload;
  const sessions = sessionsByAgent[agentId] || [];
  const session = sessions.find((s) => s.id === sessionId);
  if (session) session.title = title;
};

const handleAgentSelect = async (agentId: number) => {
  if (agentId === currentAgentId.value) return;
  currentAgentId.value = agentId;
  chat.clearMessages();

  if (!sessionsByAgent[agentId]) {
    try {
      sessionsLoadingByAgent[agentId] = true;
      await new Promise((r) => setTimeout(r, 500));
      const sessions: ChatSession[] = [
        {
          id: `session-${agentId}-1`,
          title: "测试会话 1",
          lastMessage: "这是一个测试会话",
          updatedAt: new Date(),
          unread: 0,
          pinned: false,
        },
        {
          id: `session-${agentId}-2`,
          title: "测试会话 2",
          lastMessage: "另一个测试会话",
          updatedAt: new Date(Date.now() - 1000 * 60 * 30),
          unread: 2,
          pinned: true,
        },
      ];
      sessionsByAgent[agentId] = sessions;
      hasMoreByAgent[agentId] = true;
      currentSessionId.value = sessions.length ? sessions[0].id : null;
    } catch {
      sessionsByAgent[agentId] = [];
      hasMoreByAgent[agentId] = false;
      currentSessionId.value = null;
    } finally {
      sessionsLoadingByAgent[agentId] = false;
    }
  } else {
    const sessions = sessionsByAgent[agentId] || [];
    currentSessionId.value = sessions.length ? sessions[0].id : null;
  }
};

const handleSendMessage = async (content: string) => {
  if (!canSendMessage.value) return;
  const meta: any = {};
  if (currentSessionId.value) meta.sessionId = currentSessionId.value;
  if (currentAgentId.value) meta.agentId = currentAgentId.value;
  await chat.send(content, meta);
};

const handleRetryMessage = async () => {
  await retryLastMessage();
};

const handleClearMessages = () => {
  chat.clearMessages();
};

// 创建/编辑/保存/删除 Agent
const handleCreateAgent = () => {
  editingAgent.value = null;
  showConfigPanel.value = true;
};

const handleEditAgent = (agentId: number) => {
  const agent = agents.value.find((a) => a.id === agentId);
  if (agent) {
    editingAgent.value = JSON.parse(JSON.stringify(agent)) as Agent;
    showConfigPanel.value = true;
  } else {
    console.error("[父组件] 未找到对应的 agent，agentId:", agentId);
  }
};

const handleCloseConfig = () => {
  showConfigPanel.value = false;
  editingAgent.value = null;
};

const handleDeleteAgent = async (agentId: number) => {
  if (confirm(t("agent.confirmDelete"))) {
    try {
      await agentManager.deleteAgent(agentId);
      if (agentId === currentAgentId.value && agents.value.length > 0) {
        const first = agents.value[0];
        if (first) await handleAgentSelect(first.id);
      }
    } catch (error) {
      console.error("删除 Agent 失败:", error);
    }
  }
};

const handleSaveAgent = async (config: any) => {
  try {
    if (config.id) {
      await agentManager.updateAgent(parseInt(config.id), config);
      await agentManager.fetchAgents();
    } else {
      const newAgent = await agentManager.createAgent({
        key: config.key || `agent_${Date.now()}`,
        name: config.name || "新建 Agent",
        description: config.description || "",
        status: config.isActive ? "active" : "inactive",
        meta: config.meta || {},
      });
      await handleAgentSelect(newAgent.id);
    }
    handleCloseConfig();
  } catch (error) {
    console.error("保存 Agent 失败:", error);
  }
};

// 当前 Agent
const selectedAgent = computed(() => {
  return (
    agents.value.find((agent) => agent.id === currentAgentId.value) || null
  );
});

// 转为 ChatInterface 需要的格式
const currentAgentForChat = computed(() => {
  const agent = selectedAgent.value;
  if (!agent) return null;
  return {
    id: agent.id.toString(),
    name: agent.name,
    description: agent.description,
    avatar: "",
    model: "gpt-3.5-turbo",
    systemPrompt: "",
    temperature: 0.7,
    maxTokens: 2000,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    isActive: agent.status === "active",
    capabilities: [],
  };
});

// 允许发送消息
const canSendMessage = computed(() => {
  if (!agents.value || agents.value.length === 0) return false;
  if (!isConnected.value) return false;
  if (!selectedAgent.value) return false;
  return true;
});

// Agent 图标
const getAgentIcon = (agent: Agent) => {
  if (agent.meta?.icon) return agent.meta.icon;
  if (agent.source === "core") return "i-heroicons-cog-6-tooth";
  if (agent.meta?.tags?.includes("support"))
    return "i-heroicons-chat-bubble-left-right";
  if (agent.meta?.tags?.includes("enterprise"))
    return "i-heroicons-building-office";
  return "i-heroicons-cpu-chip";
};

/* ========= 插件专属侧栏：显示条件 & 收缩状态 ========= */
// 这里先强制为 true 以便开发预览；接入真实判断后改回去

const isPluginAgent = computed(() => {
  const a = selectedAgent.value as Agent | null;
  if (!a) return false;
  return (
    a.source === "plugin" ||
    a.meta?.isPlugin === true ||
    !!a.meta?.pluginId ||
    a.meta?.tags?.includes?.("plugin")
  );
});

const isPluginPanelCollapsed = ref(false);
const togglePluginPanel = () => {
  isPluginPanelCollapsed.value = !isPluginPanelCollapsed.value;
};
watch(
  () => selectedAgent.value?.id,
  () => {
    isPluginPanelCollapsed.value = false;
  }
);
</script>

<template>
  <!-- 外层：左右完全分离，中间有空隙 -->
  <div class="flex h-full gap-4 px-4 pt-4 pb-0 bg-gray-50">
    <!-- 🔌 左：插件面板（独立卡片） -->
    <div
      v-if="isPluginAgent"
      class="relative flex-shrink-0 transition-all duration-300 ease-in-out bg-white border border-gray-200 rounded-lg shadow-sm min-h-0"
      :class="isPluginPanelCollapsed ? 'w-12' : 'w-[36rem]'"
    >
      <!-- 收缩/展开按钮（浮在卡片右侧边缘） -->
      <button
        @click="togglePluginPanel"
        class="absolute top-4 -right-3 z-10 w-6 h-6 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-shadow flex items-center justify-center text-gray-500 hover:text-gray-700"
        :title="isPluginPanelCollapsed ? '展开插件面板' : '收缩插件面板'"
      >
        <UIcon
          :name="
            isPluginPanelCollapsed
              ? 'i-heroicons-chevron-right'
              : 'i-heroicons-chevron-left'
          "
          class="w-3 h-3"
        />
      </button>

      <!-- 插件内容区 -->
      <div v-show="!isPluginPanelCollapsed" class="h-full overflow-auto">
        <div class="p-4 space-y-3">
          <div class="text-xs text-gray-400 uppercase tracking-wide">
            插件面板
          </div>
          <div class="text-sm text-gray-700">
            当前 Agent：<span class="font-medium">{{
              selectedAgent?.name
            }}</span>
          </div>
          <div class="text-xs text-gray-500">
            可在此渲染插件自定义内容（表单/看板/指标/工具面板等）。
          </div>
          <!-- TODO: 真正的插件组件 -->
          <!-- <PluginAgentPanel :agent="selectedAgent!" :session-id="currentSessionId || undefined" /> -->
        </div>
      </div>
    </div>

    <!-- 🧱 右：主容器（独立卡片） -->
    <div
      class="flex flex-1 min-w-0 min-h-0 bg-white border border-gray-200 rounded-lg shadow-sm"
    >
      <!-- 左侧 Agent 选择器 -->
      <div
        class="relative flex-shrink-0 transition-all duration-300 ease-in-out border-r border-gray-200 min-h-0"
        :class="isLeftPanelCollapsed ? 'w-12' : 'w-80'"
      >
        <!-- 收缩/展开按钮 -->
        <button
          @click="toggleLeftPanel"
          class="absolute top-4 -right-3 z-10 w-6 h-6 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-shadow flex items-center justify-center text-gray-500 hover:text-gray-700"
          :title="isLeftPanelCollapsed ? '展开面板' : '收缩面板'"
        >
          <UIcon
            :name="
              isLeftPanelCollapsed
                ? 'i-heroicons-chevron-right'
                : 'i-heroicons-chevron-left'
            "
            class="w-3 h-3"
          />
        </button>

        <!-- Agent 选择器内容 -->
        <div class="h-full min-h-0 flex flex-col">
          <AgentSidebar
            class="flex-1 min-h-0"
            v-show="!isLeftPanelCollapsed"
            :agents="agentsList"
            :current-agent-id="currentAgentId"
            :current-session-id="currentSessionId || undefined"
            :sessions-by-agent="sessionsByAgent"
            :sessions-loading-by-agent="sessionsLoadingByAgent"
            :has-more-by-agent="hasMoreByAgent"
            @select="handleAgentSelect"
            @create-agent="handleCreateAgent"
            @edit-agent="handleEditAgent"
            @new-session="handleNewSession"
            @select-session="handleSelectSession"
            @delete-session="handleDeleteSession"
            @pin-session="handlePinSession"
            @unpin-session="
              (sessionId: string) =>
                handlePinSession({
                  agentId: currentAgentId!,
                  sessionId,
                  pinned: false,
                })
            "
            @load-more-sessions="handleLoadMoreSessions"
            @rename-session="handleRenameSession"
          />

          <!-- 收缩状态下的简化显示 -->
          <div
            v-show="isLeftPanelCollapsed"
            class="flex-1 min-h-0 bg-white flex flex-col items-center py-4 space-y-3"
          >
            <div
              v-if="selectedAgent"
              class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs cursor-pointer"
              :title="selectedAgent.name"
              @click="toggleLeftPanel"
            >
              <UIcon :name="getAgentIcon(selectedAgent)" class="w-4 h-4" />
            </div>
            <UButton
              icon="i-heroicons-plus"
              size="xs"
              variant="ghost"
              class="w-8 h-8 p-0 flex items-center justify-center"
              :title="'新建 Agent'"
              @click="handleCreateAgent"
            />
          </div>
        </div>
      </div>

      <!-- 中间聊天界面 -->
      <div class="flex-1 flex flex-col min-w-0 min-h-0">
        <div class="p-4 border-b border-gray-200 bg-white">
          <ConnectionIndicators :connection="chat" />
        </div>

        <ClientOnly>
          <ChatInterface
            :messages="messagesList"
            :is-connected="!!isConnected"
            :is-streaming="!!isStreaming"
            :is-typing="!!isTyping"
            :current-agent="currentAgentForChat"
            :connection-indicators="true"
            :can-send-message="canSendMessage"
            @send-message="handleSendMessage"
            @retry-message="handleRetryMessage"
            @clear-messages="handleClearMessages"
          />
        </ClientOnly>
      </div>

      <!-- 配置面板（保持挂载在主容器） -->
      <ConfigPanel
        :key="editingAgent ? editingAgent.id : 'new'"
        :agent="editingAgent"
        :is-visible="showConfigPanel"
        @close="handleCloseConfig"
        @save="handleSaveAgent"
      />
    </div>
  </div>
</template>

<style scoped>
/* 确保页面占满全高（你有顶栏时这里按需调整数值） */
.h-full {
  height: calc(100vh - 64px);
}
</style>
