<script setup lang="ts">
const props = defineProps<{ message?: string }>();

// 检测当前主题模式
const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");
</script>

<template>
  <UModal
    :title="undefined"
    :close="false"
    :dismissible="false"
    :overlay="true"
    fullscreen
    :transition="false"
  >
    <template #body>
      <div
        class="h-svh w-svw grid place-items-center backdrop-blur-md"
        :class="[
          isDark
            ? 'bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95'
            : 'bg-gradient-to-br from-white/95 via-gray-50/95 to-white/95',
        ]"
      >
        <!-- 背景装饰 -->
        <div class="absolute inset-0 overflow-hidden">
          <div
            class="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl animate-pulse"
            :class="[isDark ? 'bg-primary-500/10' : 'bg-primary-500/5']"
          ></div>
          <div
            class="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl animate-pulse delay-1000"
            :class="[isDark ? 'bg-primary-600/10' : 'bg-primary-600/5']"
          ></div>
        </div>

        <!-- 主要内容 -->
        <div class="relative z-10 flex flex-col items-center space-y-6">
          <!-- Logo 或品牌区域 -->
          <div
            class="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-2xl"
          >
            <svg
              class="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              ></path>
            </svg>
          </div>

          <!-- 加载动画 -->
          <div class="relative">
            <!-- 外圈 -->
            <div
              class="w-16 h-16 border-4 rounded-full animate-spin-slow"
              :class="[isDark ? 'border-gray-600/30' : 'border-gray-300/50']"
            ></div>
            <!-- 内圈 -->
            <div
              class="absolute inset-2 w-12 h-12 border-4 border-transparent rounded-full animate-spin"
              :class="[
                isDark
                  ? 'border-t-primary-400 border-r-primary-500'
                  : 'border-t-primary-500 border-r-primary-600',
              ]"
            ></div>
            <!-- 中心点 -->
            <div
              class="absolute inset-6 w-4 h-4 bg-gradient-to-r from-primary-400 to-primary-500 rounded-full animate-pulse"
            ></div>
          </div>

          <!-- 消息文本 -->
          <div class="text-center space-y-2">
            <p
              class="text-xl font-medium"
              :class="[isDark ? 'text-white' : 'text-gray-900']"
            >
              {{ props.message ?? "加载中…" }}
            </p>
            <div class="flex space-x-1 justify-center">
              <div
                class="w-2 h-2 bg-primary-400 rounded-full animate-bounce"
              ></div>
              <div
                class="w-2 h-2 bg-primary-500 rounded-full animate-bounce delay-100"
              ></div>
              <div
                class="w-2 h-2 bg-primary-600 rounded-full animate-bounce delay-200"
              ></div>
            </div>
          </div>

          <!-- 进度条效果 -->
          <div
            class="w-64 h-1 rounded-full overflow-hidden"
            :class="[isDark ? 'bg-gray-600/30' : 'bg-gray-300/50']"
          >
            <div
              class="h-full bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 rounded-full animate-loading-bar"
            ></div>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes spin-slow {
  to {
    transform: rotate(360deg);
  }
}

@keyframes loading-bar {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}

.animate-loading-bar {
  animation: loading-bar 2s ease-in-out infinite;
}

.delay-100 {
  animation-delay: 0.1s;
}

.delay-200 {
  animation-delay: 0.2s;
}

.delay-1000 {
  animation-delay: 1s;
}
</style>
