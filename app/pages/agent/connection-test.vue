<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">连接测试页面</h1>

    <!-- 连接状态指示器 -->
    <div class="mb-6">
      <h2 class="text-lg font-semibold mb-3">连接状态</h2>
      <ConnectionIndicators :connection="connection" />
    </div>

    <!-- 测试消息发送 -->
    <div class="mb-6">
      <h2 class="text-lg font-semibold mb-3">消息测试</h2>
      <div class="flex gap-3 mb-3">
        <UInput
          v-model="testMessage"
          placeholder="输入测试消息..."
          class="flex-1"
        />
        <UButton @click="sendTestMessage" :disabled="!canSendMessage">
          发送消息
        </UButton>
      </div>
      <div class="text-sm text-gray-500">
        <p>• SSE测试: GET /api/agents/stream//sse?probe=1 (探活)</p>
        <p>• WebSocket测试: WS /api/agents/stream/ws?probe=1 (探活)</p>
        <p>• 真实消息会根据连接状态自动选择SSE或WebSocket通道</p>
      </div>
    </div>

    <!-- 消息日志 -->
    <div class="mb-6">
      <h2 class="text-lg font-semibold mb-3">消息日志</h2>
      <div class="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
        <div v-if="messages.length === 0" class="text-gray-500">暂无消息</div>
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="mb-2 text-sm"
        >
          <span class="text-gray-400">{{ message.timestamp }}</span>
          <span class="ml-2" :class="getMessageClass(message.type)">
            [{{ message.type }}]
          </span>
          <span class="ml-2">{{ message.content }}</span>
        </div>
      </div>
    </div>

    <!-- 当前请求信息 -->
    <div v-if="connection.currentRequestId.value" class="mb-6">
      <h2 class="text-lg font-semibold mb-3">当前请求</h2>
      <div class="bg-blue-50 p-4 rounded-lg">
        <p class="text-sm">
          <strong>请求ID:</strong> {{ connection.currentRequestId.value }}
        </p>
        <UButton size="xs" class="mt-2" @click="connection.cancel">
          取消请求
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useDualChannelConnection } from "~/composables/agent/useDualChannelConnection";
import ConnectionIndicators from "~/components/agent/ConnectionIndicators.vue";

// 页面元数据
definePageMeta({
  title: "连接测试",
  layout: "default",
});

// 连接管理
const connection = useDualChannelConnection();

// 测试消息
const testMessage = ref("今天天气如何？");

// 消息日志
interface LogMessage {
  timestamp: string;
  type: "info" | "success" | "error" | "warning";
  content: string;
}

const messages = ref<LogMessage[]>([]);

// 添加日志消息
const addLogMessage = (type: LogMessage["type"], content: string) => {
  messages.value.push({
    timestamp: new Date().toLocaleTimeString(),
    type,
    content,
  });

  // 保持最多100条消息
  if (messages.value.length > 100) {
    messages.value.shift();
  }
};

// 消息样式
const getMessageClass = (type: string) => {
  switch (type) {
    case "success":
      return "text-green-600";
    case "error":
      return "text-red-600";
    case "warning":
      return "text-yellow-600";
    default:
      return "text-blue-600";
  }
};

// 是否可以发送消息
const canSendMessage = computed(() => {
  return (
    (connection.sseActive.value || connection.wsActive.value) &&
    testMessage.value.trim().length > 0 &&
    !connection.currentRequestId.value
  );
});

// 发送测试消息
const sendTestMessage = async () => {
  if (!canSendMessage.value) return;

  const message = testMessage.value.trim();
  addLogMessage("info", `发送消息: ${message}`);

  try {
    await connection.sendMessage(message, "chat");
    addLogMessage("success", "消息发送成功");
  } catch (error) {
    addLogMessage("error", `消息发送失败: ${error}`);
  }
};

// 设置消息回调
connection.onMessage = (data: any) => {
  addLogMessage("success", `收到消息: ${JSON.stringify(data)}`);
};

connection.onError = (error: any) => {
  addLogMessage("error", `连接错误: ${error}`);
};

// 监听连接状态变化
watch(
  () => connection.sseActive.value,
  (active) => {
    addLogMessage(
      active ? "success" : "warning",
      `SSE连接${active ? "已建立" : "已断开"}`
    );
  }
);

watch(
  () => connection.wsActive.value,
  (active) => {
    addLogMessage(
      active ? "success" : "warning",
      `WebSocket连接${active ? "已建立" : "已断开"}`
    );
  }
);

// 页面加载时添加说明
onMounted(() => {
  addLogMessage("info", "页面已加载，正在测试连接状态...");
});
</script>
