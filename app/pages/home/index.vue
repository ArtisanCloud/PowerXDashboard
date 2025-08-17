<script setup lang="ts">
import FooterBar from "~/components/layout/FooterBar.vue";

definePageMeta({
  alias: ["/"], // 让 /home 这个页面同时匹配 "/"
  layout: false, // 禁用layout
});

const { t } = useI18n();

// 使用全局主题状态
const theme = useState("theme", () => "auto");

// 科技感渐变背景配置
const techGradients = [
  "from-blue-600 via-purple-600 to-cyan-500",
  "from-indigo-600 via-blue-600 to-teal-500",
  "from-purple-600 via-pink-600 to-red-500",
  "from-cyan-500 via-blue-500 to-indigo-600",
  "from-emerald-500 via-teal-500 to-cyan-600",
  "from-violet-600 via-purple-600 to-blue-600",
  "from-fuchsia-600 via-purple-600 to-indigo-600",
  "from-blue-500 via-indigo-500 to-purple-600",
];

const darkTechGradients = [
  "from-blue-900 via-purple-900 to-cyan-800",
  "from-indigo-900 via-blue-900 to-teal-800",
  "from-purple-900 via-pink-900 to-red-800",
  "from-cyan-800 via-blue-800 to-indigo-900",
  "from-emerald-800 via-teal-800 to-cyan-900",
  "from-violet-900 via-purple-900 to-blue-900",
  "from-fuchsia-900 via-purple-900 to-indigo-900",
  "from-blue-800 via-indigo-800 to-purple-900",
];

// 随机选择渐变
const currentGradient = ref("");
const currentDarkGradient = ref("");

// 在客户端初始化主题和渐变
onMounted(() => {
  if (process.client) {
    // 随机选择渐变
    const randomIndex = Math.floor(Math.random() * techGradients.length);
    currentGradient.value = techGradients[randomIndex];
    currentDarkGradient.value = darkTechGradients[randomIndex];

    // 监听主题变化事件
    window.addEventListener("theme-changed", (e: any) => {
      theme.value = e.detail;
    });

    // 初始化主题
    const savedTheme = localStorage.getItem("theme") || "auto";
    theme.value = savedTheme;
  }
});
</script>

<template>
  <div class="min-h-screen relative flex flex-col overflow-hidden">
    <!-- 动态科技感背景 -->
    <div
      class="absolute inset-0 opacity-60 dark:opacity-70"
      :class="`bg-gradient-to-br ${currentGradient}`"
    ></div>
    <div
      class="absolute inset-0 opacity-30 dark:opacity-40"
      :class="`bg-gradient-to-tl ${currentDarkGradient}`"
    ></div>

    <!-- 科技网格背景 -->
    <div class="absolute inset-0 opacity-5 dark:opacity-10">
      <div
        class="absolute inset-0"
        style="
          background-image: radial-gradient(
            circle at 1px 1px,
            rgba(59, 130, 246, 0.3) 1px,
            transparent 0
          );
          background-size: 50px 50px;
        "
      ></div>
    </div>

    <!-- 动态光效 -->
    <div
      class="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-400/20 rounded-full blur-3xl animate-pulse"
    ></div>
    <div
      class="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/10 dark:bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"
    ></div>
    <div
      class="absolute top-1/2 right-0 w-64 h-64 bg-cyan-500/10 dark:bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-2000"
    ></div>

    <!-- 主要内容区域 -->
    <div
      class="relative z-10 bg-white/20 dark:bg-gray-900/30 backdrop-blur-sm min-h-screen flex flex-col"
    >
      <!-- 顶部Logo区域 -->
      <div class="flex justify-between items-center p-6">
        <!-- Logo -->
        <div class="flex items-center">
          <h1
            class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            PowerX
          </h1>
        </div>

        <!-- 右侧区域：语言切换器、登录注册按钮 -->
        <div class="flex items-center space-x-4">
          <NuxtLink
            :to="$localePath('/users/login')"
            class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors"
          >
            {{ $t("login") }}
          </NuxtLink>
          <NuxtLink
            :to="$localePath('/users/register')"
            class="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all"
          >
            {{ $t("register") }}
          </NuxtLink>
        </div>
      </div>

      <!-- 主要内容区域 -->
      <div class="flex-1 flex items-center justify-center px-6">
        <div
          class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <!-- 左侧信息区域 -->
          <div class="text-center lg:text-left">
            <h1
              class="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
            >
              {{ $t("welcome") }}
              <span
                class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block"
              >
                PowerX
              </span>
            </h1>
            <p class="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              {{ $t("home.subtitle") }}
            </p>

            <!-- CTA 按钮 -->
            <div
              class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <NuxtLink
                :to="$localePath('/dashboard')"
                class="px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all text-center"
              >
                {{ $t("home.getStarted") }}
              </NuxtLink>
              <NuxtLink
                :to="$localePath('/home/intro')"
                class="px-8 py-4 text-lg border border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600 rounded-lg transition-all text-center"
              >
                {{ $t("home.learnMore") }}
              </NuxtLink>
            </div>
          </div>

          <!-- 右侧大图区域 -->
          <div class="relative">
            <div
              class="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200"
            >
              <div
                class="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl h-80 md:h-96 flex items-center justify-center relative overflow-hidden"
              >
                <!-- 主要图标 -->
                <div class="text-center z-10">
                  <div class="text-8xl mb-6">🚀</div>
                  <h3 class="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                    PowerX Dashboard
                  </h3>
                  <p class="text-gray-600 text-lg">
                    {{ $t("home.dashboardDesc") }}
                  </p>
                </div>

                <!-- 装饰性图形元素 -->
                <div
                  class="absolute top-4 left-4 w-16 h-16 bg-blue-200 rounded-full opacity-60"
                ></div>
                <div
                  class="absolute top-8 right-8 w-12 h-12 bg-purple-200 rounded-full opacity-60"
                ></div>
                <div
                  class="absolute bottom-6 left-8 w-20 h-20 bg-indigo-200 rounded-full opacity-40"
                ></div>
                <div
                  class="absolute bottom-4 right-4 w-14 h-14 bg-pink-200 rounded-full opacity-50"
                ></div>

                <!-- 网格背景 -->
                <div class="absolute inset-0 opacity-10">
                  <div class="grid grid-cols-8 grid-rows-6 h-full w-full">
                    <div
                      v-for="i in 48"
                      :key="i"
                      class="border border-gray-400"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 外部装饰元素 -->
            <div
              class="absolute -top-6 -left-6 w-32 h-32 bg-blue-200 rounded-full opacity-30 animate-pulse"
            ></div>
            <div
              class="absolute -bottom-6 -right-6 w-40 h-40 bg-purple-200 rounded-full opacity-30 animate-pulse delay-1000"
            ></div>
          </div>
        </div>
      </div>

      <!-- 底部简单信息 -->
      <FooterBar />
    </div>
  </div>
</template>

<style scoped>
/* 自定义动画 */
@keyframes pulse {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
}

.animate-pulse {
  animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.delay-1000 {
  animation-delay: 1.5s;
}
</style>
