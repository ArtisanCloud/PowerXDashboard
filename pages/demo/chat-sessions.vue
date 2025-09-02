<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">会话列表演示</h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- AgentSelector 演示 -->
      <div class="border rounded-lg p-4">
        <h2 class="text-lg font-semibold mb-4">AgentSelector 组件</h2>
        <AgentSidebar
          :agents="mockAgents"
          :current-agent-id="currentAgent?.id"
          :sessions-by-agent="sessionsByAgent"
          :sessions-loading-by-agent="sessionsLoadingByAgent"
          :has-more-by-agent="hasMoreByAgent"
          @select="handleSelectAgent"
          @select-session="handleSelectSession"
          @create-session="handleCreateSession"
          @delete-session="handleDeleteSession"
          @load-sessions="handleLoadSessions"
          @load-more-sessions="handleLoadMoreSessions"
        />
      </div>

      <!-- 事件日志 -->
      <div class="border rounded-lg p-4">
        <h2 class="text-lg font-semibold mb-4">事件日志</h2>
        <div class="bg-gray-50 p-3 rounded max-h-96 overflow-y-auto">
          <div
            v-for="(log, index) in eventLogs"
            :key="index"
            class="text-sm mb-2"
          >
            <span class="text-gray-500">{{ log.time }}</span>
            <span class="ml-2 font-medium">{{ log.event }}</span>
            <span class="ml-2 text-gray-600">{{ log.data }}</span>
          </div>
        </div>
        <button
          @click="eventLogs = []"
          class="mt-2 px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300"
        >
          清空日志
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import type { ChatSession } from "~/components/agent/AgentSidebar.vue";

// 模拟 Agent 数据
const mockAgents = ref([
  {
    id: 1,
    name: "GPT-4 助手",
    key: "gpt4-assistant",
    description: "通用AI助手，擅长各种任务",
    source: "openai",
    status: "active",
    meta: {
      icon: "i-heroicons-cpu-chip",
      tags: ["通用", "助手"],
    },
  },
  {
    id: 2,
    name: "代码专家",
    key: "code-expert",
    description: "专门用于编程和代码审查",
    source: "openai",
    status: "active",
    meta: {
      icon: "i-heroicons-code-bracket",
      tags: ["编程", "代码"],
    },
  },
  {
    id: 3,
    name: "创意写作",
    key: "creative-writer",
    description: "专门用于创意写作和内容创作",
    source: "openai",
    status: "inactive",
    meta: {
      icon: "i-heroicons-pencil-square",
      tags: ["写作", "创意"],
    },
  },
]);

const currentAgent = ref(mockAgents.value[0]);

// 模拟会话数据
const sessionsByAgent = reactive<Record<number, ChatSession[]>>({
  1: [
    {
      id: "session-1-1",
      title: "如何学习Vue.js",
      lastMessage: "建议从官方文档开始，然后做一些小项目练习...",
      updatedAt: new Date(Date.now() - 1000 * 60 * 30), // 30分钟前
      unread: 0,
      pinned: true,
    },
    {
      id: "session-1-2",
      title: "TypeScript 类型问题",
      lastMessage: "这个错误通常是因为类型定义不匹配...",
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2小时前
      unread: 2,
      pinned: false,
    },
    {
      id: "session-1-3",
      title: "项目架构设计",
      lastMessage: "对于中型项目，我建议使用模块化的架构...",
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1天前
      unread: 0,
      pinned: false,
    },
    {
      id: "session-1-4",
      title: "",
      lastMessage: "你好！有什么可以帮助你的吗？",
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3天前
      unread: 0,
      pinned: false,
    },
  ],
  2: [
    {
      id: "session-2-1",
      title: "React Hook 优化",
      lastMessage: "使用 useMemo 和 useCallback 可以避免不必要的重渲染...",
      updatedAt: new Date(Date.now() - 1000 * 60 * 15), // 15分钟前
      unread: 1,
      pinned: true,
    },
    {
      id: "session-2-2",
      title: "API 接口设计",
      lastMessage: "RESTful API 的设计原则包括...",
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4小时前
      unread: 0,
      pinned: false,
    },
    {
      id: "session-2-3",
      title: "数据库优化",
      lastMessage: "索引的创建需要考虑查询频率和数据更新频率...",
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2天前
      unread: 0,
      pinned: false,
    },
  ],
  3: [
    {
      id: "session-3-1",
      title: "科幻小说创作",
      lastMessage: "在未来世界的设定中，我们可以考虑这些元素...",
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6小时前
      unread: 0,
      pinned: false,
    },
    {
      id: "session-3-2",
      title: "产品文案优化",
      lastMessage: "这个标题可以更加吸引人，试试这样改...",
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5天前
      unread: 3,
      pinned: false,
    },
  ],
});

const sessionsLoadingByAgent = reactive<Record<number, boolean>>({});
const hasMoreByAgent = reactive<Record<number, boolean>>({
  1: true,
  2: false,
  3: true,
});

// 事件日志
const eventLogs = ref<Array<{ time: string; event: string; data: string }>>([]);

function addLog(event: string, data: any) {
  const time = new Date().toLocaleTimeString();
  eventLogs.value.unshift({
    time,
    event,
    data: JSON.stringify(data, null, 2),
  });
  if (eventLogs.value.length > 50) {
    eventLogs.value = eventLogs.value.slice(0, 50);
  }
}

// 事件处理函数
function handleSelectAgent(agentId: number) {
  const agent = mockAgents.value.find((a) => a.id === agentId);
  if (agent) {
    currentAgent.value = agent;
    addLog("选择 Agent", { id: agent.id, name: agent.name });
  }
}

function handleSelectSession(data: { agentId: number; session: ChatSession }) {
  addLog("选择会话", data);
}

function handleCreateSession(agentId: number) {
  const newSession: ChatSession = {
    id: `session-${agentId}-${Date.now()}`,
    title: "",
    lastMessage: "新会话已创建",
    updatedAt: new Date(),
    unread: 0,
    pinned: false,
  };

  if (!sessionsByAgent[agentId]) {
    sessionsByAgent[agentId] = [];
  }
  sessionsByAgent[agentId].unshift(newSession);

  addLog("创建会话", { agentId, sessionId: newSession.id });
}

function handleDeleteSession(data: {
  agentId: number;
  sessionId: string | number;
}) {
  const sessions = sessionsByAgent[data.agentId];
  if (sessions) {
    const index = sessions.findIndex((s) => s.id === data.sessionId);
    if (index > -1) {
      sessions.splice(index, 1);
    }
  }
  addLog("删除会话", data);
}

function handleLoadSessions(agentId: number) {
  sessionsLoadingByAgent[agentId] = true;
  addLog("加载会话", { agentId });

  // 模拟异步加载
  setTimeout(() => {
    sessionsLoadingByAgent[agentId] = false;
    addLog("会话加载完成", { agentId });
  }, 1000);
}

function handleLoadMoreSessions(agentId: number) {
  sessionsLoadingByAgent[agentId] = true;
  addLog("加载更多会话", { agentId });

  // 模拟加载更多数据
  setTimeout(() => {
    const moreSessions: ChatSession[] = [
      {
        id: `session-${agentId}-more-${Date.now()}`,
        title: "更多历史会话",
        lastMessage: "这是加载的更多会话内容...",
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7天前
        unread: 0,
        pinned: false,
      },
    ];

    if (sessionsByAgent[agentId]) {
      sessionsByAgent[agentId].push(...moreSessions);
    }

    // 模拟没有更多数据
    if (sessionsByAgent[agentId]?.length > 8) {
      hasMoreByAgent[agentId] = false;
    }

    sessionsLoadingByAgent[agentId] = false;
    addLog("更多会话加载完成", { agentId, count: moreSessions.length });
  }, 1500);
}
</script>
