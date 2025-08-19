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
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  agree: false,
});

// 表单验证状态
const loading = ref(false);
const error = ref("");
const success = ref(false);

// 密码强度检查
const passwordStrength = computed(() => {
  const password = form.password;
  if (!password) return { level: 0, text: "", color: "gray" };

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2)
    return {
      level: score,
      text: t("auth.passwordStrength.weak"),
      color: "red",
    };
  if (score <= 3)
    return {
      level: score,
      text: t("auth.passwordStrength.medium"),
      color: "yellow",
    };
  return {
    level: score,
    text: t("auth.passwordStrength.strong"),
    color: "green",
  };
});

// 表单验证
const validateForm = () => {
  if (!form.username.trim()) {
    error.value = t("auth.required");
    return false;
  }
  if (!form.email.trim()) {
    error.value = t("auth.required");
    return false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    error.value = t("auth.invalidEmail");
    return false;
  }
  if (!form.password) {
    error.value = t("auth.required");
    return false;
  }
  if (form.password.length < 6) {
    error.value = t("auth.passwordTooShort");
    return false;
  }
  if (form.password !== form.confirmPassword) {
    error.value = t("auth.passwordMismatch");
    return false;
  }
  if (!form.agree) {
    error.value = t("auth.mustAgreeTerms");
    return false;
  }
  return true;
};

// 注册处理
const handleRegister = async () => {
  if (!validateForm()) return;

  loading.value = true;
  error.value = "";

  try {
    // 这里添加实际的注册逻辑
    await new Promise((resolve) => setTimeout(resolve, 1500)); // 模拟API调用

    success.value = true;

    // 注册成功后延迟跳转到登录页面
    const localePath = useLocalePath();
    setTimeout(() => {
      navigateTo(localePath("/users/login"));
    }, 2000);
  } catch (err) {
    error.value = t("auth.registerFailed");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4"
  >
    <div class="max-w-md w-full">
      <!-- 返回首页链接和语言切换器 -->
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
          {{ $t("auth.backToHome") }}
        </NuxtLink>
      </div>

      <!-- 注册卡片 -->
      <UCard class="shadow-xl border-0">
        <template #header>
          <div class="text-center py-6">
            <!-- Logo -->
            <h1
              class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3"
            >
              PowerX
            </h1>
            <h2 class="text-xl font-semibold text-gray-900 mb-2">
              {{ $t("auth.createAccount") }}
            </h2>
            <p class="text-gray-600 text-sm">
              {{ $t("auth.registerSubtitle") }}
            </p>
          </div>
        </template>

        <div class="px-6 pb-6">
          <!-- 成功提示 -->
          <UAlert
            v-if="success"
            color="success"
            variant="soft"
            :title="$t('auth.registerSuccess')"
            :description="$t('auth.redirectingToLogin')"
            class="mb-6"
          />

          <form v-else @submit.prevent="handleRegister" class="space-y-5">
            <!-- 错误提示 -->
            <UAlert
              v-if="error"
              color="error"
              variant="soft"
              :title="error"
              :close-button="{
                icon: 'i-heroicons-x-mark-20-solid',
                color: 'gray',
                variant: 'link',
                padded: false,
              }"
              @close="error = ''"
              class="mb-1"
            />

            <!-- 用户名输入 -->
            <div class="mb-6">
              <label
                for="username"
                class="block text-sm font-medium text-gray-700 mb-3"
              >
                {{ $t("auth.username") }} <span class="text-red-500">*</span>
              </label>
              <UInput
                id="username"
                name="username"
                v-model="form.username"
                :placeholder="$t('auth.username')"
                size="lg"
                :disabled="loading"
                class="w-full"
              />
            </div>

            <!-- 邮箱输入 -->
            <div class="mb-6">
              <label
                for="email"
                class="block text-sm font-medium text-gray-700 mb-3"
              >
                {{ $t("auth.email") }} <span class="text-red-500">*</span>
              </label>
              <UInput
                id="email"
                name="email"
                v-model="form.email"
                type="email"
                :placeholder="$t('auth.email')"
                size="lg"
                :disabled="loading"
                class="w-full"
              />
            </div>

            <!-- 密码输入 -->
            <div class="mb-6">
              <label
                for="password"
                class="block text-sm font-medium text-gray-700 mb-3"
              >
                {{ $t("auth.password") }} <span class="text-red-500">*</span>
              </label>
              <UInput
                id="password"
                name="password"
                v-model="form.password"
                type="password"
                :placeholder="$t('auth.password')"
                size="lg"
                :disabled="loading"
                class="w-full"
              />
              <!-- 密码强度指示器 -->
              <div v-if="form.password" class="mt-3">
                <div class="flex items-center space-x-2">
                  <div class="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      class="h-2 rounded-full transition-all duration-300"
                      :class="{
                        'bg-red-500': passwordStrength.color === 'red',
                        'bg-yellow-500': passwordStrength.color === 'yellow',
                        'bg-green-500': passwordStrength.color === 'green',
                      }"
                      :style="{
                        width: `${(passwordStrength.level / 5) * 100}%`,
                      }"
                    ></div>
                  </div>
                  <span
                    class="text-xs font-medium"
                    :class="{
                      'text-red-600': passwordStrength.color === 'red',
                      'text-yellow-600': passwordStrength.color === 'yellow',
                      'text-green-600': passwordStrength.color === 'green',
                    }"
                  >
                    {{ passwordStrength.text }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 确认密码输入 -->
            <div class="mb-6">
              <label
                for="confirmPassword"
                class="block text-sm font-medium text-gray-700 mb-3"
              >
                {{ $t("auth.confirmPassword") }}
                <span class="text-red-500">*</span>
              </label>
              <UInput
                id="confirmPassword"
                name="confirmPassword"
                v-model="form.confirmPassword"
                type="password"
                :placeholder="$t('auth.confirmPassword')"
                size="lg"
                :disabled="loading"
                class="w-full"
              />
            </div>

            <!-- 同意条款 -->
            <div class="flex items-start space-x-3 pt-1">
              <UCheckbox
                v-model="form.agree"
                :disabled="loading"
                class="mt-0.5"
              />
              <p class="text-sm text-gray-600 leading-relaxed">
                {{ $t("auth.agreeTerms") }}
                <a href="#" class="text-blue-600 hover:text-blue-700">{{
                  $t("termsOfService")
                }}</a>
                {{ $t("auth.and") }}
                <a href="#" class="text-blue-600 hover:text-blue-700">{{
                  $t("privacyPolicy")
                }}</a>
              </p>
            </div>

            <!-- 注册按钮 -->
            <div class="pt-2">
              <UButton
                type="submit"
                block
                size="lg"
                :loading="loading"
                :disabled="!form.agree"
                class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {{
                  loading
                    ? $t("auth.creatingAccount")
                    : $t("auth.createAccount")
                }}
              </UButton>
            </div>
          </form>

          <!-- 登录链接 -->
          <div class="text-center mt-6 pt-4 border-t border-gray-200">
            <p class="text-gray-600 text-sm">
              {{ $t("auth.hasAccount") }}
              <NuxtLink
                :to="$localePath('/users/login')"
                class="text-blue-600 hover:text-blue-700 font-medium"
              >
                {{ $t("auth.signInNow") }}
              </NuxtLink>
            </p>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
