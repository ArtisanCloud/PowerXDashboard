<script setup lang="ts">
import FooterBar from "~/components/layout/FooterBar.vue";

definePageMeta({
  layout: false, // 禁用layout
});

const { t } = useI18n();

// 使用全局主题状态
const theme = useState("theme", () => "auto");

// 主题色到科技绿的渐变配置（与首页保持一致）
const primaryToTechGreen = [
  "from-blue-600 via-teal-500 to-emerald-400",
  "from-indigo-600 via-cyan-500 to-green-400",
  "from-purple-600 via-blue-500 to-teal-400",
  "from-violet-600 via-indigo-500 to-cyan-400",
  "from-blue-500 via-emerald-500 to-green-400",
  "from-cyan-600 via-teal-500 to-lime-400",
];

const darkPrimaryToTechGreen = [
  "from-blue-800 via-teal-700 to-emerald-600",
  "from-indigo-800 via-cyan-700 to-green-600",
  "from-purple-800 via-blue-700 to-teal-600",
  "from-violet-800 via-indigo-700 to-cyan-600",
  "from-blue-700 via-emerald-700 to-green-600",
  "from-cyan-800 via-teal-700 to-lime-600",
];

// 动态渐变状态
const currentGradient = ref<string>(
  "from-blue-600 via-teal-500 to-emerald-400"
);
const currentDarkGradient = ref<string>(
  "from-blue-800 via-teal-700 to-emerald-600"
);
const particlesVisible = ref(false);
const floatingElements = ref<any[]>([]);

// 生成浮动元素
const generateFloatingElements = () => {
  const elements = [];
  for (let i = 0; i < 12; i++) {
    elements.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 15 + 8,
      delay: Math.random() * 5,
      duration: Math.random() * 8 + 12,
      opacity: Math.random() * 0.2 + 0.1,
    });
  }
  return elements;
};

// 在客户端初始化主题和动效
onMounted(() => {
  if (process.client) {
    // 随机选择渐变
    const randomIndex = Math.floor(Math.random() * primaryToTechGreen.length);
    currentGradient.value = primaryToTechGreen[randomIndex];
    currentDarkGradient.value = darkPrimaryToTechGreen[randomIndex];

    // 生成浮动元素
    floatingElements.value = generateFloatingElements();

    // 延迟显示粒子效果
    setTimeout(() => {
      particlesVisible.value = true;
    }, 300);

    // 监听主题变化事件
    window.addEventListener("theme-changed", (e: any) => {
      theme.value = e.detail;
    });

    // 初始化主题
    const savedTheme = localStorage.getItem("theme") || "auto";
    theme.value = savedTheme;
  }
});

// 产品特性数据
const features = computed(() => [
  {
    icon: "🚀",
    title: t("intro.features.performance.title"),
    description: t("intro.features.performance.description"),
  },
  {
    icon: "🎨",
    title: t("intro.features.design.title"),
    description: t("intro.features.design.description"),
  },
  {
    icon: "🔧",
    title: t("intro.features.usability.title"),
    description: t("intro.features.usability.description"),
  },
  {
    icon: "🛡️",
    title: t("intro.features.security.title"),
    description: t("intro.features.security.description"),
  },
]);

// 产品信息
const products = computed(() => [
  {
    name: "PowerX Admin",
    description: t("intro.products.admin.description"),
    image: "/api/placeholder/300/200",
    features: [
      t("intro.products.admin.features.userManagement"),
      t("intro.products.admin.features.permissionControl"),
      t("intro.products.admin.features.dataAnalysis"),
      t("intro.products.admin.features.systemMonitoring"),
    ],
  },
  {
    name: "PowerX Analytics",
    description: t("intro.products.analytics.description"),
    image: "/api/placeholder/300/200",
    features: [
      t("intro.products.analytics.features.realTimeAnalysis"),
      t("intro.products.analytics.features.visualReports"),
      t("intro.products.analytics.features.predictiveModels"),
      t("intro.products.analytics.features.customDashboard"),
    ],
  },
  {
    name: "PowerX Cloud",
    description: t("intro.products.cloud.description"),
    image: "/api/placeholder/300/200",
    features: [
      t("intro.products.cloud.features.cloudStorage"),
      t("intro.products.cloud.features.multiDeviceSync"),
      t("intro.products.cloud.features.elasticScaling"),
      t("intro.products.cloud.features.support247"),
    ],
  },
]);
</script>

<template>
  <div class="min-h-screen relative overflow-hidden">
    <!-- 主题色到科技绿的动态渐变背景 -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-blue-600 via-teal-500 to-emerald-400 dark:from-blue-800 dark:via-teal-700 dark:to-emerald-600 transition-all duration-1000"
    ></div>
    <div
      class="absolute inset-0 bg-gradient-to-tl from-emerald-400 via-cyan-500 to-blue-600 dark:from-emerald-600 dark:via-cyan-700 dark:to-blue-800 opacity-60 dark:opacity-70 transition-all duration-1000"
    ></div>

    <!-- 科技网格背景 -->
    <div class="absolute inset-0 opacity-10 dark:opacity-15">
      <div
        class="absolute inset-0 animate-grid-move"
        style="
          background-image:
            radial-gradient(
              circle at 1px 1px,
              rgba(16, 185, 129, 0.4) 1px,
              transparent 0
            ),
            linear-gradient(
              90deg,
              rgba(16, 185, 129, 0.1) 1px,
              transparent 1px
            ),
            linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px);
          background-size:
            50px 50px,
            50px 50px,
            50px 50px;
        "
      ></div>
    </div>

    <!-- 浮动科技元素 -->
    <div v-if="particlesVisible" class="absolute inset-0 pointer-events-none">
      <div
        v-for="element in floatingElements"
        :key="element.id"
        class="absolute rounded-full bg-gradient-to-r from-emerald-400/20 to-teal-400/20 animate-float"
        :style="{
          left: element.x + '%',
          top: element.y + '%',
          width: element.size + 'px',
          height: element.size + 'px',
          animationDelay: element.delay + 's',
          animationDuration: element.duration + 's',
          opacity: element.opacity,
        }"
      ></div>
    </div>

    <!-- 动态光效 - 科技绿主题 -->
    <div
      class="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-400/20 dark:to-teal-400/20 rounded-full blur-3xl animate-pulse-slow"
    ></div>
    <div
      class="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 dark:from-teal-400/20 dark:to-cyan-400/20 rounded-full blur-3xl animate-pulse-slow delay-1000"
    ></div>
    <div
      class="absolute top-1/2 right-0 w-64 h-64 bg-gradient-to-r from-cyan-500/10 to-green-500/10 dark:from-cyan-400/20 dark:to-green-400/20 rounded-full blur-3xl animate-pulse-slow delay-2000"
    ></div>

    <!-- 主要内容区域 -->
    <div
      class="relative z-10 bg-white/10 dark:bg-gray-900/20 backdrop-blur-md min-h-screen transition-all duration-500"
    >
      <!-- 导航栏 -->
      <nav
        class="bg-white/20 dark:bg-gray-900/30 backdrop-blur-md border-b border-gray-300/30 dark:border-white/10 sticky top-0 z-50 transition-all duration-500"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <!-- Logo -->
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <NuxtLink :to="$localePath('/')">
                  <div class="flex items-center space-x-3">
                    <img
                      src="/images/logo-m.png"
                      alt="PowerX Logo"
                      class="w-10 h-10"
                    />
                    <h1
                      class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                    >
                      PowerX
                    </h1>
                  </div>
                </NuxtLink>
              </div>
            </div>

            <!-- 导航链接 -->
            <div class="hidden md:block">
              <div class="ml-10 flex items-baseline space-x-4">
                <a
                  href="#features"
                  class="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                >
                  {{ $t("intro.nav.features") }}
                </a>
                <a
                  href="#products"
                  class="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                >
                  {{ $t("intro.nav.products") }}
                </a>
                <a
                  href="#about"
                  class="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                >
                  {{ $t("intro.nav.about") }}
                </a>
              </div>
            </div>

            <!-- 语言切换器和登录注册按钮 -->
            <div class="flex items-center space-x-4">
              <NuxtLink
                :to="$localePath('/users/login')"
                class="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 px-4 py-2 transition-colors duration-300"
              >
                {{ $t("login") }}
              </NuxtLink>
              <NuxtLink
                :to="$localePath('/users/register')"
                class="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all shadow-lg shadow-blue-500/25"
              >
                {{ $t("register") }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </nav>

      <!-- 英雄区域 -->
      <section class="relative overflow-hidden animate-fade-in">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div class="text-center">
            <!-- 欢迎语 -->
            <h1
              class="text-4xl md:text-6xl font-bold text-gray-800 dark:text-white mb-6 transition-colors duration-500 animate-slide-in-up"
            >
              {{ $t("intro.hero.welcomeTo") }}
              <span
                class="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent animate-gradient-x"
              >
                PowerX
              </span>
            </h1>
            <p
              class="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto transition-colors duration-500 animate-slide-in-up delay-200"
            >
              {{ $t("home.subtitle") }}
            </p>

            <!-- CTA 按钮 -->
            <div
              class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-slide-in-up delay-400"
            >
              <NuxtLink
                :to="$localePath('/dashboard')"
                class="group relative px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg transition-all text-center overflow-hidden shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105"
              >
                <span class="relative z-10 flex items-center justify-center">
                  <span class="mr-2">▶</span>
                  {{ $t("home.getStarted") }}
                </span>
                <div
                  class="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                ></div>
              </NuxtLink>
              <a
                href="#products"
                class="group px-8 py-4 text-lg border border-emerald-400/30 dark:border-emerald-400/40 text-emerald-600 dark:text-emerald-400 hover:border-emerald-400/60 hover:bg-emerald-400/10 rounded-lg transition-all text-center backdrop-blur-sm hover:scale-105"
              >
                <span class="flex items-center justify-center">
                  <span class="mr-2">ℹ</span>
                  {{ $t("home.learnMore") }}
                </span>
              </a>
            </div>

            <!-- 科技感头图 -->
            <div
              class="relative max-w-5xl mx-auto animate-slide-in-up delay-600"
            >
              <div
                class="bg-white/20 dark:bg-gray-900/40 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20 dark:border-white/10 transition-all duration-500"
              >
                <div
                  class="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-emerald-500/10 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-emerald-500/20 rounded-xl h-96 flex items-center justify-center relative overflow-hidden transition-all duration-500"
                >
                  <!-- 科技网格 -->
                  <div class="absolute inset-0 opacity-20">
                    <div
                      class="absolute inset-0"
                      style="
                        background-image:
                          linear-gradient(
                            90deg,
                            rgba(16, 185, 129, 0.1) 1px,
                            transparent 1px
                          ),
                          linear-gradient(
                            rgba(16, 185, 129, 0.1) 1px,
                            transparent 1px
                          );
                        background-size: 20px 20px;
                      "
                    ></div>
                  </div>

                  <!-- 中心内容 -->
                  <div class="text-center relative z-10">
                    <div class="text-6xl mb-4 animate-float-gentle">🚀</div>
                    <h3
                      class="text-2xl font-bold text-gray-800 dark:text-white mb-2 transition-colors duration-500"
                    >
                      PowerX Dashboard
                    </h3>
                    <p
                      class="text-gray-600 dark:text-gray-300 transition-colors duration-500"
                    >
                      {{ $t("intro.hero.dashboardPreview") }}
                    </p>
                  </div>

                  <!-- 动态装饰线条 -->
                  <div class="absolute inset-0">
                    <div
                      class="absolute top-1/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent animate-data-flow"
                    ></div>
                    <div
                      class="absolute top-3/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400/60 to-transparent animate-data-flow delay-1000"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- 科技感装饰元素 -->
              <div
                class="absolute -top-4 -left-4 w-24 h-24 border-2 border-emerald-400/30 rounded-full animate-pulse"
              ></div>
              <div
                class="absolute -bottom-4 -right-4 w-32 h-32 border-2 border-blue-400/30 rounded-full animate-pulse delay-1000"
              ></div>
              <div
                class="absolute top-1/2 -right-8 w-16 h-0.5 bg-gradient-to-r from-emerald-400/50 to-transparent animate-pulse delay-500"
              ></div>
              <div
                class="absolute top-1/3 -left-8 w-12 h-0.5 bg-gradient-to-l from-blue-400/50 to-transparent animate-pulse delay-1500"
              ></div>
            </div>
          </div>
        </div>
      </section>

      <!-- 特性区域 -->
      <section
        id="features"
        class="py-24 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm transition-all duration-500"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16 animate-fade-in">
            <h2
              class="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4 transition-colors duration-500"
            >
              {{ $t("intro.features.title") }}
            </h2>
            <p
              class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-500"
            >
              {{ $t("intro.features.subtitle") }}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div
              v-for="(feature, index) in features"
              :key="feature.title"
              class="text-center p-6 rounded-xl bg-white/40 dark:bg-gray-800/40 hover:bg-white/60 dark:hover:bg-gray-800/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-white/10 hover:border-emerald-400/30 dark:hover:border-emerald-400/40 hover:scale-105 animate-slide-in-up"
              :style="{ animationDelay: `${index * 100}ms` }"
            >
              <div class="text-4xl mb-4 animate-bounce-gentle">
                {{ feature.icon }}
              </div>
              <h3
                class="text-xl font-semibold text-gray-800 dark:text-white mb-2 transition-colors duration-500"
              >
                {{ feature.title }}
              </h3>
              <p
                class="text-gray-600 dark:text-gray-300 transition-colors duration-500"
              >
                {{ feature.description }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- 产品区域 -->
      <section
        id="products"
        class="py-24 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm transition-all duration-500"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16 animate-fade-in">
            <h2
              class="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4 transition-colors duration-500"
            >
              {{ $t("intro.products.title") }}
            </h2>
            <p
              class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-500"
            >
              {{ $t("intro.products.subtitle") }}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              v-for="(product, index) in products"
              :key="product.name"
              class="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-white/10 hover:border-emerald-400/30 dark:hover:border-emerald-400/40 hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-105 animate-slide-in-up"
              :style="{ animationDelay: `${index * 150}ms` }"
            >
              <!-- 头部 -->
              <div
                class="bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-emerald-500/20 dark:from-blue-500/30 dark:via-purple-500/30 dark:to-emerald-500/30 h-48 flex items-center justify-center relative overflow-hidden transition-all duration-500"
              >
                <!-- 科技网格背景 -->
                <div class="absolute inset-0 opacity-20">
                  <div
                    class="absolute inset-0"
                    style="
                      background-image:
                        linear-gradient(
                          90deg,
                          rgba(16, 185, 129, 0.1) 1px,
                          transparent 1px
                        ),
                        linear-gradient(
                          rgba(16, 185, 129, 0.1) 1px,
                          transparent 1px
                        );
                      background-size: 15px 15px;
                    "
                  ></div>
                </div>

                <div class="text-center relative z-10">
                  <div class="text-4xl mb-2 animate-float-gentle">📊</div>
                  <h4
                    class="font-semibold text-gray-800 dark:text-white transition-colors duration-500"
                  >
                    {{ product.name }}
                  </h4>
                </div>

                <!-- 装饰线条 -->
                <div
                  class="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent animate-data-flow"
                ></div>
                <div
                  class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400/60 to-transparent animate-data-flow delay-1000"
                ></div>
              </div>

              <!-- 内容 -->
              <div class="p-6">
                <h3
                  class="text-xl font-semibold text-gray-800 dark:text-white mb-2 transition-colors duration-500"
                >
                  {{ product.name }}
                </h3>
                <p
                  class="text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-500"
                >
                  {{ product.description }}
                </p>

                <div class="space-y-2">
                  <div
                    v-for="feature in product.features"
                    :key="feature"
                    class="flex items-center text-sm text-gray-600 dark:text-gray-300 transition-colors duration-500"
                  >
                    <div
                      class="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"
                    ></div>
                    {{ feature }}
                  </div>
                </div>
              </div>

              <!-- 底部按钮 -->
              <div class="p-6 pt-0">
                <button
                  class="w-full py-3 px-4 border border-emerald-400/30 dark:border-emerald-400/40 text-emerald-600 dark:text-emerald-400 hover:border-emerald-400/60 hover:bg-emerald-400/10 rounded-lg transition-all duration-300 backdrop-blur-sm hover:scale-105"
                >
                  {{ $t("intro.products.learnMore") }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 关于区域 -->
      <section
        id="about"
        class="py-24 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm transition-all duration-500"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16 animate-fade-in">
            <h2
              class="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4 transition-colors duration-500"
            >
              {{ $t("intro.about.title") }}
            </h2>
            <p
              class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors duration-500"
            >
              {{ $t("intro.about.subtitle") }}
            </p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <!-- 左侧内容 -->
            <div class="animate-slide-in-left">
              <h3
                class="text-2xl font-bold text-gray-800 dark:text-white mb-6 transition-colors duration-500"
              >
                {{ $t("intro.about.mission.title") }}
              </h3>
              <div
                class="space-y-4 text-gray-600 dark:text-gray-300 transition-colors duration-500"
              >
                <p>
                  {{ $t("intro.about.mission.paragraph1") }}
                </p>
                <p>
                  {{ $t("intro.about.mission.paragraph2") }}
                </p>
                <p>
                  {{ $t("intro.about.mission.paragraph3") }}
                </p>
              </div>

              <!-- 统计数据 -->
              <div class="grid grid-cols-3 gap-6 mt-8">
                <div
                  class="text-center p-4 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-xl border border-white/20 dark:border-white/10 hover:border-cyan-400/30 dark:hover:border-cyan-400/40 transition-all duration-300 hover:scale-105"
                >
                  <div
                    class="text-3xl font-bold text-cyan-600 dark:text-cyan-400 mb-2 transition-colors duration-500"
                  >
                    1000+
                  </div>
                  <div
                    class="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-500"
                  >
                    {{ $t("intro.about.stats.companies") }}
                  </div>
                </div>
                <div
                  class="text-center p-4 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-xl border border-white/20 dark:border-white/10 hover:border-teal-400/30 dark:hover:border-teal-400/40 transition-all duration-300 hover:scale-105"
                >
                  <div
                    class="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-2 transition-colors duration-500"
                  >
                    50万+
                  </div>
                  <div
                    class="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-500"
                  >
                    {{ $t("intro.about.stats.users") }}
                  </div>
                </div>
                <div
                  class="text-center p-4 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-xl border border-white/20 dark:border-white/10 hover:border-emerald-400/30 dark:hover:border-emerald-400/40 transition-all duration-300 hover:scale-105"
                >
                  <div
                    class="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2 transition-colors duration-500"
                  >
                    99.9%
                  </div>
                  <div
                    class="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-500"
                  >
                    {{ $t("intro.about.stats.uptime") }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 右侧图片 -->
            <div class="relative animate-slide-in-right">
              <div
                class="bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-emerald-500/20 dark:from-blue-500/30 dark:via-purple-500/30 dark:to-emerald-500/30 rounded-2xl p-8 h-96 flex items-center justify-center relative overflow-hidden backdrop-blur-sm border border-white/20 dark:border-white/10 transition-all duration-500"
              >
                <!-- 科技网格背景 -->
                <div class="absolute inset-0 opacity-20">
                  <div
                    class="absolute inset-0"
                    style="
                      background-image:
                        linear-gradient(
                          90deg,
                          rgba(16, 185, 129, 0.1) 1px,
                          transparent 1px
                        ),
                        linear-gradient(
                          rgba(16, 185, 129, 0.1) 1px,
                          transparent 1px
                        );
                      background-size: 20px 20px;
                    "
                  ></div>
                </div>

                <div class="text-center relative z-10">
                  <div class="text-6xl mb-4 animate-float-gentle">🏢</div>
                  <h4
                    class="text-xl font-bold text-gray-800 dark:text-white mb-2 transition-colors duration-500"
                  >
                    {{ $t("intro.about.enterprise.title") }}
                  </h4>
                  <p
                    class="text-gray-600 dark:text-gray-300 transition-colors duration-500"
                  >
                    {{ $t("intro.about.enterprise.description") }}
                  </p>
                </div>

                <!-- 动态装饰线条 -->
                <div
                  class="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent animate-data-flow"
                ></div>
                <div
                  class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400/60 to-transparent animate-data-flow delay-1000"
                ></div>
              </div>

              <!-- 科技感装饰元素 -->
              <div
                class="absolute -top-4 -right-4 w-20 h-20 border-2 border-emerald-400/30 dark:border-emerald-400/40 rounded-full animate-pulse transition-colors duration-500"
              ></div>
              <div
                class="absolute -bottom-4 -left-4 w-16 h-16 border-2 border-blue-400/30 dark:border-blue-400/40 rounded-full animate-pulse delay-1000 transition-colors duration-500"
              ></div>
            </div>
          </div>

          <!-- 团队价值观 -->
          <div class="mt-20">
            <h3
              class="text-2xl font-bold text-gray-800 dark:text-white text-center mb-12 transition-colors duration-500 animate-fade-in"
            >
              {{ $t("intro.about.values.title") }}
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div
                class="text-center p-6 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-xl border border-white/20 dark:border-white/10 hover:border-cyan-400/30 dark:hover:border-cyan-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105 animate-slide-in-up"
              >
                <div
                  class="w-16 h-16 bg-cyan-500/20 dark:bg-cyan-500/30 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-500"
                >
                  <span class="text-2xl animate-bounce-gentle">💡</span>
                </div>
                <h4
                  class="text-lg font-semibold text-gray-800 dark:text-white mb-2 transition-colors duration-500"
                >
                  {{ $t("intro.about.values.innovation.title") }}
                </h4>
                <p
                  class="text-gray-600 dark:text-gray-300 transition-colors duration-500"
                >
                  {{ $t("intro.about.values.innovation.description") }}
                </p>
              </div>
              <div
                class="text-center p-6 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-xl border border-white/20 dark:border-white/10 hover:border-teal-400/30 dark:hover:border-teal-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105 animate-slide-in-up delay-200"
              >
                <div
                  class="w-16 h-16 bg-teal-500/20 dark:bg-teal-500/30 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-500"
                >
                  <span class="text-2xl animate-bounce-gentle delay-200"
                    >🤝</span
                  >
                </div>
                <h4
                  class="text-lg font-semibold text-gray-800 dark:text-white mb-2 transition-colors duration-500"
                >
                  {{ $t("intro.about.values.userFirst.title") }}
                </h4>
                <p
                  class="text-gray-600 dark:text-gray-300 transition-colors duration-500"
                >
                  {{ $t("intro.about.values.userFirst.description") }}
                </p>
              </div>
              <div
                class="text-center p-6 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-xl border border-white/20 dark:border-white/10 hover:border-emerald-400/30 dark:hover:border-emerald-400/40 hover:shadow-xl transition-all duration-300 hover:scale-105 animate-slide-in-up delay-400"
              >
                <div
                  class="w-16 h-16 bg-emerald-500/20 dark:bg-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-500"
                >
                  <span class="text-2xl animate-bounce-gentle delay-400"
                    >🎯</span
                  >
                </div>
                <h4
                  class="text-lg font-semibold text-gray-800 dark:text-white mb-2 transition-colors duration-500"
                >
                  {{ $t("intro.about.values.excellence.title") }}
                </h4>
                <p
                  class="text-gray-600 dark:text-gray-300 transition-colors duration-500"
                >
                  {{ $t("intro.about.values.excellence.description") }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA区域 -->
      <section
        class="py-24 bg-gradient-to-r from-blue-600/80 via-purple-600/80 to-emerald-600/80 dark:from-blue-700/90 dark:via-purple-700/90 dark:to-emerald-700/90 backdrop-blur-sm transition-all duration-500 relative overflow-hidden"
      >
        <!-- 科技背景效果 -->
        <div class="absolute inset-0 opacity-10">
          <div
            class="absolute inset-0"
            style="
              background-image:
                radial-gradient(
                  circle at 25% 25%,
                  rgba(16, 185, 129, 0.3) 2px,
                  transparent 2px
                ),
                radial-gradient(
                  circle at 75% 75%,
                  rgba(59, 130, 246, 0.3) 2px,
                  transparent 2px
                );
              background-size: 60px 60px;
            "
          ></div>
        </div>

        <!-- 动态光效 -->
        <div
          class="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"
        ></div>
        <div
          class="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"
        ></div>

        <div
          class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10"
        >
          <h2
            class="text-3xl md:text-4xl font-bold text-white mb-6 animate-fade-in"
          >
            {{ $t("intro.cta.title") }}
          </h2>
          <p
            class="text-xl text-blue-100 dark:text-emerald-100 mb-8 max-w-2xl mx-auto transition-colors duration-500 animate-fade-in delay-200"
          >
            {{ $t("intro.cta.subtitle") }}
          </p>

          <div
            class="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-400"
          >
            <button
              class="px-8 py-4 bg-white/90 dark:bg-white/95 text-blue-600 dark:text-blue-700 hover:bg-white hover:scale-105 rounded-xl font-semibold text-lg transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl"
              @click="navigateTo('/users/register')"
            >
              {{ $t("intro.cta.getStarted") }}
            </button>
            <button
              class="px-8 py-4 border-2 border-white/60 dark:border-emerald-400/40 text-emerald-600 dark:text-emerald-400 hover:border-emerald-400/60 hover:bg-emerald-400/10 rounded-xl font-semibold text-lg transition-all duration-300 backdrop-blur-sm"
              @click="navigateTo('/users/login')"
            >
              {{ $t("intro.cta.signIn") }}
            </button>
          </div>
        </div>
      </section>

      <!-- 页脚 -->
      <footer
        class="bg-gray-900/80 dark:bg-gray-950/80 backdrop-blur-sm text-white py-12 transition-all duration-500"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center">
            <div
              class="mt-8 pt-8 border-t border-gray-800 dark:border-gray-700 transition-colors duration-500"
            >
              <FooterBar />
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped>
/* 科技感动画效果 */
@keyframes pulse-slow {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.05);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-10px) rotate(1deg);
  }
  66% {
    transform: translateY(5px) rotate(-1deg);
  }
}

@keyframes float-gentle {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes bounce-gentle {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-4px);
  }
}

@keyframes data-flow {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
}

@keyframes grid-move {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(50px, 50px);
  }
}

@keyframes gradient-x {
  0%,
  100% {
    background-size: 200% 200%;
    background-position: left center;
  }
  50% {
    background-size: 200% 200%;
    background-position: right center;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-in-left {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 应用动画类 */
.animate-pulse-slow {
  animation: pulse-slow 4s ease-in-out infinite;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-gentle {
  animation: float-gentle 3s ease-in-out infinite;
}

.animate-bounce-gentle {
  animation: bounce-gentle 2s ease-in-out infinite;
}

.animate-data-flow {
  animation: data-flow 3s linear infinite;
}

.animate-grid-move {
  animation: grid-move 20s linear infinite;
}

.animate-gradient-x {
  animation: gradient-x 3s ease infinite;
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out forwards;
}

.animate-slide-in-up {
  animation: slide-in-up 0.8s ease-out forwards;
}

.animate-slide-in-left {
  animation: slide-in-left 0.8s ease-out forwards;
}

.animate-slide-in-right {
  animation: slide-in-right 0.8s ease-out forwards;
}

/* 延迟动画 */
.delay-200 {
  animation-delay: 200ms;
}

.delay-400 {
  animation-delay: 400ms;
}

.delay-500 {
  animation-delay: 500ms;
}

.delay-600 {
  animation-delay: 600ms;
}

.delay-1000 {
  animation-delay: 1000ms;
}

.delay-1500 {
  animation-delay: 1500ms;
}

.delay-2000 {
  animation-delay: 2000ms;
}

/* 响应式动画优化 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* 深色模式下的特殊效果 */
@media (prefers-color-scheme: dark) {
  .animate-pulse-slow {
    animation: pulse-slow 3s ease-in-out infinite;
  }
}
</style>
