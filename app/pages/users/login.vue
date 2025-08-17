<script setup lang="ts">
definePageMeta({
  layout: false, // 禁用layout
});

const { t } = useI18n();

// 使用全局主题状态
const theme = useState("theme", () => "auto");

// 在客户端初始化主题
onMounted(() => {
  if (process.client) {
    // 监听主题变化事件
    window.addEventListener("theme-changed", (e: any) => {
      theme.value = e.detail;
    });

    // 初始化主题
    const savedTheme = localStorage.getItem("theme") || "auto";
    theme.value = savedTheme;
  }
});

// 表单数据
const form = reactive({
  email: "",
  password: "",
  remember: false,
});

// 表单验证状态
const loading = ref(false);
const error = ref("");

// 登录处理
const handleLogin = async () => {
  if (!form.email || !form.password) {
    error.value = t("required");
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    // 这里添加实际的登录逻辑
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 模拟API调用

    // 登录成功后跳转到仪表板
    await navigateTo("/dashboard");
  } catch (err) {
    error.value = t("loginFailed");
  } finally {
    loading.value = false;
  }
};

// 忘记密码
const handleForgotPassword = () => {
  // 这里添加忘记密码逻辑
  console.log("忘记密码");
};
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4"
  >
    <div class="max-w-md w-full">
      <!-- 顶部区域：返回首页和语言切换器 -->
      <div class="mb-6 flex justify-between items-center">
        <NuxtLink
          :to="$localePath('/')"
          class="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors text-sm"
        >
          <svg
            class="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
          {{ $t("backToHome") }}
        </NuxtLink>
      </div>

      <!-- 登录卡片 -->
      <div class="bg-white rounded-lg shadow-xl border-0 overflow-hidden">
        <!-- 头部 -->
        <div class="text-center py-6 px-6">
          <!-- Logo -->
          <h1
            class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3"
          >
            PowerX
          </h1>
          <h2 class="text-xl font-semibold text-gray-900 mb-2">
            {{ $t("welcomeBack") }}
          </h2>
          <p class="text-gray-600 text-sm">{{ $t("loginSubtitle") }}</p>
        </div>

        <div class="px-6 pb-6">
          <form @submit.prevent="handleLogin" class="space-y-6">
            <!-- 错误提示 -->
            <div
              v-if="error"
              class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm"
            >
              {{ error }}
              <button
                @click="error = ''"
                class="float-right text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>

            <!-- 邮箱输入 -->
            <div>
              <label
                for="email"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                {{ $t("email") }} <span class="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                v-model="form.email"
                type="email"
                :placeholder="$t('email')"
                :disabled="loading"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <!-- 密码输入 -->
            <div>
              <label
                for="password"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                {{ $t("password") }} <span class="text-red-500">*</span>
              </label>
              <input
                id="password"
                name="password"
                v-model="form.password"
                type="password"
                :placeholder="$t('password')"
                :disabled="loading"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <!-- 记住我和忘记密码 -->
            <div class="flex items-center justify-between">
              <label class="flex items-center">
                <input
                  v-model="form.remember"
                  type="checkbox"
                  :disabled="loading"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-600">{{
                  $t("remember")
                }}</span>
              </label>
              <button
                type="button"
                class="text-sm text-blue-600 hover:text-blue-700"
                @click="handleForgotPassword"
                :disabled="loading"
              >
                {{ $t("forgot") }}
              </button>
            </div>

            <!-- 登录按钮 -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? $t("signingIn") : $t("login") }}
            </button>
          </form>

          <!-- 注册链接 -->
          <div class="text-center mt-6 pt-4 border-t border-gray-200">
            <p class="text-gray-600 text-sm">
              {{ $t("noAccount") }}
              <NuxtLink
                :to="$localePath('/users/register')"
                class="text-blue-600 hover:text-blue-700 font-medium"
              >
                {{ $t("signUpNow") }}
              </NuxtLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
