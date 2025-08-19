<template>
  <div class="container mx-auto p-6 space-y-6">
    <div class="bg-white rounded-lg shadow p-6">
      <h1 class="text-2xl font-bold mb-6">全局 Loading 系统测试</h1>

      <!-- 状态显示 -->
      <div class="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 class="font-semibold mb-2">当前状态：</h3>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            可见状态: <span class="font-mono">{{ gl.visible.value }}</span>
          </div>
          <div>
            当前消息: <span class="font-mono">{{ gl.message.value }}</span>
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
        </div>
      </div>

      <!-- 基础控制 -->
      <div class="space-y-4">
        <h3 class="font-semibold">基础控制：</h3>
        <div class="flex flex-wrap gap-3">
          <button
            @click="showBasic"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            显示 Loading
          </button>
          <button
            @click="showWithLock"
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            显示 + 锁屏
          </button>
          <button
            @click="hide"
            class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            隐藏
          </button>
          <button
            @click="lock"
            class="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            锁屏
          </button>
          <button
            @click="unlock"
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            解锁
          </button>
        </div>
      </div>

      <!-- 模拟请求 -->
      <div class="space-y-4">
        <h3 class="font-semibold">模拟请求：</h3>
        <div class="flex flex-wrap gap-3">
          <button
            @click="simulateQuickRequest"
            class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            快速请求 (500ms)
          </button>
          <button
            @click="simulateSlowRequest"
            class="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            慢速请求 (3s)
          </button>
          <button
            @click="simulateFormSubmit"
            class="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
          >
            表单提交
          </button>
          <button
            @click="simulateMultipleRequests"
            class="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
          >
            并发请求
          </button>
        </div>
      </div>

      <!-- 特殊场景 -->
      <div class="space-y-4">
        <h3 class="font-semibold">特殊场景：</h3>
        <div class="flex flex-wrap gap-3">
          <button
            @click="testMinDisplayTime"
            class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            最小显示时长测试
          </button>
          <button
            @click="testErrorHandling"
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            错误处理测试
          </button>
          <button
            @click="resetAll"
            class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            重置所有状态
          </button>
          <button
            @click="testCountdown"
            class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            倒计时测试 (10秒)
          </button>
        </div>
      </div>

      <!-- 路由测试 -->
      <div class="space-y-4">
        <h3 class="font-semibold">路由测试：</h3>
        <div class="flex flex-wrap gap-3">
          <NuxtLink
            to="/dashboard"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block"
          >
            跳转到仪表板
          </NuxtLink>
          <NuxtLink
            to="/settings"
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 inline-block"
          >
            跳转到设置
          </NuxtLink>
        </div>
      </div>

      <!-- 日志 -->
      <div class="mt-6">
        <h3 class="font-semibold mb-2">操作日志：</h3>
        <div
          class="bg-black text-green-400 p-4 rounded font-mono text-sm h-40 overflow-y-auto"
        >
          <div v-for="(log, index) in logs" :key="index" class="mb-1">
            [{{ log.time }}] {{ log.message }}
          </div>
        </div>
        <button
          @click="clearLogs"
          class="mt-2 px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
        >
          清空日志
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const gl = useGlobalLoading();

// 获取状态用于显示
const autoVisible = useGL_AutoVisible();
const manualVisible = useGL_ManualVisible();
const lockCount = useGL_LockCount();
const reqPending = useGL_ReqPending();

// 日志系统
const logs = ref<Array<{ time: string; message: string }>>([]);

function addLog(message: string) {
  const time = new Date().toLocaleTimeString();
  logs.value.push({ time, message });
  // 保持最新的 20 条日志
  if (logs.value.length > 20) {
    logs.value.shift();
  }
}

function clearLogs() {
  logs.value = [];
}

// 基础控制方法
function showBasic() {
  gl.show({ message: "基础 Loading 显示" });
  addLog("显示基础 Loading");

  // 3秒后自动关闭
  setTimeout(() => {
    gl.hide();
    addLog("基础 Loading 自动关闭");
  }, 3000);
}

function showWithLock() {
  gl.show({ lock: true, message: "锁屏 Loading 显示" });
  addLog("显示锁屏 Loading");

  // 3秒后自动关闭
  setTimeout(() => {
    gl.hide();
    gl.unlock();
    addLog("锁屏 Loading 自动关闭");
  }, 3000);
}

function hide() {
  gl.hide();
  addLog("隐藏 Loading");
}

function lock() {
  gl.lock();
  addLog("增加锁计数");
}

function unlock() {
  gl.unlock();
  addLog("减少锁计数");
}

// 模拟请求方法
async function simulateQuickRequest() {
  addLog("开始快速请求");
  try {
    const result = await $fetch("/api/test", {
      method: "POST",
      body: { delay: 500 },
    });
    addLog("快速请求完成");
  } catch (error) {
    // 模拟请求，实际会失败
    await new Promise((resolve) => setTimeout(resolve, 500));
    addLog("快速请求完成（模拟）");
  }
}

async function simulateSlowRequest() {
  addLog("开始慢速请求");
  try {
    const result = await $fetch("/api/test", {
      method: "POST",
      body: { delay: 3000 },
    });
    addLog("慢速请求完成");
  } catch (error) {
    // 模拟请求，实际会失败
    await new Promise((resolve) => setTimeout(resolve, 3000));
    addLog("慢速请求完成（模拟）");
  }
}

async function simulateFormSubmit() {
  addLog("开始表单提交");
  gl.show({ lock: true, minMs: 300, message: "正在提交表单..." });

  try {
    // 模拟表单提交
    await new Promise((resolve) => setTimeout(resolve, 1500));
    gl.setMessage("提交成功！");
    addLog("表单提交成功");

    setTimeout(() => {
      gl.hide();
      addLog("表单提交流程结束");
    }, 1000);
  } catch (error) {
    gl.setMessage("提交失败");
    addLog("表单提交失败");
    setTimeout(() => {
      gl.hide();
    }, 2000);
  }
}

async function simulateMultipleRequests() {
  addLog("开始并发请求测试");

  const requests = [
    new Promise((resolve) => setTimeout(resolve, 1000)),
    new Promise((resolve) => setTimeout(resolve, 1500)),
    new Promise((resolve) => setTimeout(resolve, 800)),
  ];

  // 模拟多个 $fetch 请求
  requests.forEach(async (req, index) => {
    try {
      await $fetch(`/api/test${index}`, {
        method: "GET",
      });
    } catch (error) {
      await req; // 使用模拟延迟
      addLog(`并发请求 ${index + 1} 完成（模拟）`);
    }
  });

  await Promise.all(requests);
  addLog("所有并发请求完成");
}

function testMinDisplayTime() {
  addLog("测试最小显示时长（2秒）");
  gl.show({ minMs: 2000, message: "最小显示时长测试..." });

  // 100ms 后就尝试隐藏，但实际会等到 2 秒
  setTimeout(() => {
    addLog("尝试隐藏（但会等到最小时长）");
    gl.hide();
  }, 100);
}

async function testErrorHandling() {
  addLog("测试错误处理");
  gl.show({ lock: true, message: "测试错误处理..." });

  try {
    // 模拟会出错的操作
    await new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error("模拟错误")), 1000);
    });
  } catch (error: any) {
    addLog("捕获到错误: " + error.message);
    gl.setMessage("操作失败");
    setTimeout(() => {
      gl.hide();
      addLog("错误处理完成");
    }, 1500);
  }
}

function resetAll() {
  // 重置所有状态
  gl.hide();
  // 清除所有锁
  const currentLockCount = lockCount.value;
  for (let i = 0; i < currentLockCount; i++) {
    gl.unlock();
  }
  gl.setMessage("加载中…");
  addLog("重置所有状态");
}

function testCountdown() {
  addLog("开始倒计时测试 (10秒)");
  let countdown = 10;

  gl.show({
    lock: true,
    message: `🕐 倒计时自动关闭 ${countdown} 秒...`,
  });

  const timer = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      const emoji = countdown <= 3 ? "⚠️" : countdown <= 5 ? "⏰" : "🕐";
      gl.setMessage(`${emoji} 倒计时自动关闭 ${countdown} 秒...`);
      addLog(`倒计时剩余 ${countdown} 秒`);
    } else {
      clearInterval(timer);
      gl.setMessage("✅ 倒计时结束，正在关闭...");
      addLog("倒计时结束");
      setTimeout(() => {
        gl.hide();
        gl.unlock();
        addLog("倒计时测试完成");
      }, 800);
    }
  }, 1000);
}

// 页面加载时添加欢迎日志
onMounted(() => {
  addLog("Loading 测试页面已加载");
});
</script>
