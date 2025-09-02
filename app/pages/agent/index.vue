<script setup lang="ts">
import type { Agent } from "~/types/agent";
import ChatInterface from "@/components/agent/ChatInterface.vue";
import ConfigPanel from "@/components/agent/ConfigPanel.vue";
import ConnectionIndicators from "@/components/agent/ConnectionIndicators.vue";
import { useDualChannelConnection } from "~/composables/agent/useDualChannelConnection";
import { useAgentManager } from "~/composables/agent/useAgentManager";
import { useOneShotAlert } from "~/composables/useOneShotAlert";

definePageMeta({
  title: "Agent 对话",
  icon: "i-heroicons-chat-bubble-left-right",
  order: 1,
});

const { t } = useI18n();

// 状态管理
const currentAgentId = ref<number>(1);
// 双通道聊天流管理
const chat = useDualChannelConnection({
  baseURL: "/api/v1",
  defaultFlowId: "chat",
  onMessage: (message) => {
    console.log("收到消息:", message);
  },
  onError: (error) => {
    console.error("聊天错误:", error);
  },
  onComplete: () => {
    console.log("对话完成");
  },
});
const showConfigPanel = ref(false);
const editingAgent = ref<Agent | null>(null);

// 左侧面板收缩状态
const isLeftPanelCollapsed = ref(false);
const toggleLeftPanel = () => {
  isLeftPanelCollapsed.value = !isLeftPanelCollapsed.value;
};

// 一次性提醒（UAlert）
const {
  visible: alertVisible,
  title: alertTitle,
  description: alertDesc,
  notifyOnce,
  hide,
  reset,
} = useOneShotAlert();

// Agent 管理
const agentManager = useAgentManager();
const { agents, loading: agentsLoading, error: agentsError } = agentManager;

// 使用双通道聊天的状态
const messages = computed(() => chat.messages.value);
const isConnected = computed(() => chat.sseActive.value || chat.wsActive.value);
const chatError = ref(null);
const isStreaming = computed(() => chat.isGenerating.value);
const isTyping = ref(false);

const sendMessage = async (content: string) => {
  await chat.send(content);
};

const clearMessages = () => {
  chat.clearMessages();
};

const switchAgent = async (agentId: string) => {
  // 可以在这里添加切换 agent 的逻辑
};

const retryLastMessage = async () => {
  // 重试最后一条消息的逻辑
  console.log("重试最后一条消息");
};

// 初始化
onMounted(async () => {
  try {
    await agentManager.fetchAgents();
    // 如果有 agents，选择第一个作为默认
    if (agents.value && agents.value.length > 0) {
      currentAgentId.value = agents.value[0].id;
    }
  } catch (e: any) {
    // 404 当作"空列表"处理，其它错误提示一下
    if (e?.status === 404 || e?.statusCode === 404) {
      console.warn("[agent] /agents 404，当作空数据处理");
    } else {
      notifyOnce(
        t("agent.list.loadFailed") || "加载 Agent 列表失败",
        e?.message || ""
      );
    }
  } finally {
    // 不管拉取是否成功，都去尝试建立聊天连接
    // connect(); // 暂时注释掉，等待聊天功能实现
  }
});

// 组件卸载时断开连接
onUnmounted(() => {
  chat.disconnect();
});

const agentsList = computed(() =>
  Array.isArray(agents.value) ? agents.value : []
);

// 处理 Agent 选择
const handleAgentSelect = async (agentId: number) => {
  if (agentId === currentAgentId.value) return;
  currentAgentId.value = agentId;
  await switchAgent(agentId.toString());
};

// 处理发送消息
const handleSendMessage = async (content: string) => {
  // 检查是否允许发送消息
  if (!canSendMessage.value) {
    console.warn("无法发送消息：agent列表为空或连接失败");
    return;
  }
  await sendMessage(content);
};

// 处理重试消息
const handleRetryMessage = async () => {
  await retryLastMessage();
};

// 处理清空消息
const handleClearMessages = () => {
  clearMessages();
};

// 创建新 Agent
const handleCreateAgent = () => {
  console.log("点击了创建 Agent 按钮");
  editingAgent.value = null;
  showConfigPanel.value = true;
};

// 编辑 Agent
const handleEditAgent = (agentId: number) => {
  // console.log("[父组件] 收到编辑事件，agentId:", agentId);
  // console.log("[父组件] agents.value:", agents.value);
  const agent = agents.value.find((a) => a.id === agentId);
  // console.log("[父组件] 找到的 agent:", agent);
  if (agent) {
    // ✅ 深拷贝解决 readonly 属性问题
    editingAgent.value = JSON.parse(JSON.stringify(agent));
    // console.log("[父组件] 设置 editingAgent:", editingAgent.value);
    showConfigPanel.value = true;
    // console.log("[父组件] 打开配置面板");
  } else {
    console.error("[父组件] 未找到对应的 agent，agentId:", agentId);
  }
};

// 关闭配置面板
const handleCloseConfig = () => {
  showConfigPanel.value = false;
  editingAgent.value = null;
};

// 删除 Agent
const handleDeleteAgent = async (agentId: number) => {
  if (confirm(t("agent.confirmDelete"))) {
    try {
      await agentManager.deleteAgent(agentId);
      if (agentId === currentAgentId.value && agents.value.length > 0) {
        const firstAgent = agents.value[0];
        if (firstAgent) {
          await handleAgentSelect(firstAgent.id);
        }
      }
    } catch (error) {
      console.error("删除 Agent 失败:", error);
    }
  }
};

// 保存 Agent 配置
const handleSaveAgent = async (config: any) => {
  try {
    // 如果有 id，说明是编辑现有 Agent
    if (config.id) {
      await agentManager.updateAgent(parseInt(config.id), config);
      await agentManager.fetchAgents(); // ✅ 刷新列表
    } else {
      // 否则是创建新 Agent
      const newAgent = await agentManager.createAgent({
        key: config.key || `agent_${Date.now()}`,
        name: config.name || "新建 Agent",
        description: config.description || "",
        status: config.isActive ? "active" : "inactive",
        meta: config.meta || {},
      });
      await handleAgentSelect(newAgent.id);
    }
    handleCloseConfig(); // ✅ 关抽屉并清理 editingAgent
  } catch (error) {
    console.error("保存 Agent 失败:", error);
  }
};

// 计算当前 Agent
const selectedAgent = computed(() => {
  return (
    agents.value.find((agent) => agent.id === currentAgentId.value) || null
  );
});

// 将 Agent 转换为 ChatInterface 需要的格式
const currentAgentForChat = computed(() => {
  const agent = selectedAgent.value;
  if (!agent) return null;

  return {
    id: agent.id.toString(),
    name: agent.name,
    description: agent.description,
    avatar: "", // Agent 类型没有 avatar 字段
    model: "gpt-3.5-turbo", // 默认模型
    systemPrompt: "", // 默认系统提示
    temperature: 0.7,
    maxTokens: 2000,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    isActive: agent.status === "active",
    capabilities: [], // 默认空能力列表
  };
});

// 计算是否允许发送消息
const canSendMessage = computed(() => {
  // 检查agent列表是否为空
  if (!agents.value || agents.value.length === 0) {
    return false;
  }

  // 检查连接状态
  if (!isConnected.value) {
    return false;
  }

  // 检查是否有选中的agent
  if (!selectedAgent.value) {
    return false;
  }

  return true;
});

// Agent 图标获取方法（与 AgentSelector 中的方法保持一致）
const getAgentIcon = (agent: Agent) => {
  // 如果有自定义图标，使用自定义图标
  if (agent.meta?.icon) {
    return agent.meta.icon;
  }

  // 根据 source 或 tags 返回默认图标
  if (agent.source === "core") return "i-heroicons-cog-6-tooth";
  if (agent.meta?.tags?.includes("support"))
    return "i-heroicons-chat-bubble-left-right";
  if (agent.meta?.tags?.includes("enterprise"))
    return "i-heroicons-building-office";

  return "i-heroicons-cpu-chip";
};
</script>

<template>
  <div class="flex h-full bg-gray-50">
    <!-- 左侧 Agent 选择器 -->
    <div
      class="flex-shrink-0 transition-all duration-300 ease-in-out relative"
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
      <div class="h-full overflow-hidden">
        <AgentSelector
          v-show="!isLeftPanelCollapsed"
          :agents="agentsList"
          :current-agent-id="currentAgentId"
          :loading="agentsLoading"
          @select="handleAgentSelect"
          @create="handleCreateAgent"
          @edit="handleEditAgent"
          @delete="handleDeleteAgent"
        />

        <!-- 收缩状态下的简化显示 -->
        <div
          v-show="isLeftPanelCollapsed"
          class="h-full bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-3"
        >
          <!-- 当前选中的 Agent 头像 -->
          <div
            v-if="selectedAgent"
            class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs cursor-pointer"
            :title="selectedAgent.name"
            @click="toggleLeftPanel"
          >
            <UIcon :name="getAgentIcon(selectedAgent)" class="w-4 h-4" />
          </div>

          <!-- 新建按钮 -->
          <UButton
            icon="i-heroicons-plus"
            size="xs"
            variant="ghost"
            class="w-8 h-8 p-0"
            :title="'新建 Agent'"
            @click="handleCreateAgent"
          />
        </div>
      </div>
    </div>

    <!-- 中间聊天界面 -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- 连接状态指示器 -->
      <div class="p-4 border-b border-gray-200 bg-white">
        <ConnectionIndicators :connection="chat" />
      </div>

      <ClientOnly>
        <ChatInterface
          :messages="Array.isArray(messages) ? messages : []"
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

    <!-- 配置面板 -->
    <ConfigPanel
      :key="editingAgent ? editingAgent.id : 'new'"
      :agent="editingAgent"
      :is-visible="showConfigPanel"
      @close="handleCloseConfig"
      @save="handleSaveAgent"
    />
  </div>
</template>

<style scoped>
/* 确保页面占满全高 */
.h-full {
  height: calc(100vh - 64px); /* 减去头部高度 */
}
</style>
