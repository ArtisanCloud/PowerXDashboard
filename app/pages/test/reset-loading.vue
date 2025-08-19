<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4 text-red-600">紧急重置 Loading</h1>

    <div class="bg-red-50 border border-red-200 p-4 rounded mb-6">
      <p class="text-red-800 mb-4">
        如果 Loading 画面卡住不消失，点击下面的按钮重置所有状态：
      </p>

      <button
        @click="emergencyReset"
        class="px-6 py-3 bg-red-600 text-white rounded font-bold hover:bg-red-700"
      >
        🚨 紧急重置所有 Loading 状态
      </button>
    </div>

    <div class="bg-gray-50 p-4 rounded mb-6">
      <h3 class="font-semibold mb-2">当前状态：</h3>
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          可见状态: <span class="font-mono">{{ visible }}</span>
        </div>
        <div>
          自动可见: <span class="font-mono">{{ autoVisible }}</span>
        </div>
        <div>
          手动可见: <span class="font-mono">{{ manualVisible }}</span>
        </div>
        <div>
          锁计数: <span class="font-mono">{{ lockCount }}</span>
        </div>
        <div>
          请求计数: <span class="font-mono">{{ reqPending }}</span>
        </div>
        <div>
          导航计数: <span class="font-mono">{{ navPending }}</span>
        </div>
      </div>
    </div>

    <div class="space-y-4">
      <h3 class="font-semibold">分步重置：</h3>
      <div class="space-x-4">
        <button
          @click="resetManual"
          class="px-4 py-2 bg-blue-500 text-white rounded"
        >
          重置手动状态
        </button>
        <button
          @click="resetLock"
          class="px-4 py-2 bg-orange-500 text-white rounded"
        >
          清零锁计数
        </button>
        <button
          @click="resetAuto"
          class="px-4 py-2 bg-green-500 text-white rounded"
        >
          重置自动状态
        </button>
      </div>
    </div>

    <div class="mt-8">
      <h3 class="font-semibold mb-2">操作日志：</h3>
      <div
        class="bg-black text-green-400 p-4 rounded font-mono text-sm h-32 overflow-y-auto"
      >
        <div v-for="(log, index) in logs" :key="index">
          [{{ log.time }}] {{ log.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const gl = useGlobalLoading();
const { visible } = gl;

// 获取所有状态
const autoVisible = useGL_AutoVisible();
const manualVisible = useGL_ManualVisible();
const lockCount = useGL_LockCount();
const reqPending = useGL_ReqPending();
const navPending = useGL_NavPending();

const logs = ref<Array<{ time: string; message: string }>>([]);

function addLog(message: string) {
  const time = new Date().toLocaleTimeString();
  logs.value.push({ time, message });
  if (logs.value.length > 10) {
    logs.value.shift();
  }
}

function emergencyReset() {
  addLog("🚨 执行紧急重置");

  // 强制重置所有状态
  autoVisible.value = false;
  manualVisible.value = false;
  lockCount.value = 0;
  reqPending.value = 0;
  navPending.value = false;

  // 重置消息
  const message = useGL_Message();
  message.value = "加载中…";

  addLog("✅ 所有状态已重置");
}

function resetManual() {
  manualVisible.value = false;
  addLog("重置手动可见状态");
}

function resetLock() {
  lockCount.value = 0;
  addLog("清零锁计数");
}

function resetAuto() {
  autoVisible.value = false;
  reqPending.value = 0;
  navPending.value = false;
  addLog("重置自动状态");
}

onMounted(() => {
  addLog("重置页面已加载");
});
</script>
