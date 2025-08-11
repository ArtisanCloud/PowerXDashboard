<script setup lang="ts">
definePageMeta({
  layout: false   // 禁用layout
})

// 表单数据
const form = reactive({
  email: '',
  password: '',
  remember: false
})

// 表单验证状态
const loading = ref(false)
const error = ref('')

// 登录处理
const handleLogin = async () => {
  if (!form.email || !form.password) {
    error.value = '请填写完整的登录信息'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    // 这里添加实际的登录逻辑
    await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟API调用
    
    // 登录成功后跳转到仪表板
    await navigateTo('/dashboard')
  } catch (err) {
    error.value = '登录失败，请检查用户名和密码'
  } finally {
    loading.value = false
  }
}

// 忘记密码
const handleForgotPassword = () => {
  // 这里添加忘记密码逻辑
  console.log('忘记密码')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <!-- 返回首页链接 - 左对齐 -->
      <div class="mb-6">
        <NuxtLink 
          to="/" 
          class="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors text-sm"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          返回首页
        </NuxtLink>
      </div>

      <!-- 登录卡片 -->
      <UCard class="shadow-xl border-0">
        <template #header>
          <div class="text-center py-6">
            <!-- Logo -->
            <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              PowerX
            </h1>
            <h2 class="text-xl font-semibold text-gray-900 mb-2">欢迎回来</h2>
            <p class="text-gray-600 text-sm">登录您的账户继续使用</p>
          </div>
        </template>

        <div class="px-6 pb-6">
          <form @submit.prevent="handleLogin" class="space-y-8">
            <!-- 错误提示 -->
            <UAlert 
              v-if="error" 
              color="red" 
              variant="soft" 
              :title="error"
              :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'gray', variant: 'link', padded: false }"
              @close="error = ''"
              class="mb-1"
            />

            <!-- 邮箱输入 -->
            <div class="mb-8">
              <label for="email" class="block text-sm font-medium text-gray-700 mb-3">
                邮箱地址 <span class="text-red-500">*</span>
              </label>
              <UInput
                id="email"
                name="email"
                v-model="form.email"
                type="email"
                placeholder="请输入您的邮箱"
                size="lg"
                :disabled="loading"
                class="w-full"
              />
            </div>

            <!-- 密码输入 -->
            <div class="mb-8">
              <label for="password" class="block text-sm font-medium text-gray-700 mb-3">
                密码 <span class="text-red-500">*</span>
              </label>
              <UInput
                id="password"
                name="password"
                v-model="form.password"
                type="password"
                placeholder="请输入您的密码"
                size="lg"
                :disabled="loading"
                class="w-full"
              />
            </div>

            <!-- 记住我和忘记密码 -->
            <div class="flex items-center justify-between pt-1">
              <UCheckbox 
                v-model="form.remember" 
                label="记住我" 
                :disabled="loading"
              />
              <UButton 
                variant="link" 
                class="p-0 text-sm text-blue-600 hover:text-blue-700"
                @click="handleForgotPassword"
                :disabled="loading"
              >
                忘记密码？
              </UButton>
            </div>

            <!-- 登录按钮 -->
            <div class="pt-2">
              <UButton
                type="submit"
                block
                size="lg"
                :loading="loading"
                class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {{ loading ? '登录中...' : '登录' }}
              </UButton>
            </div>
          </form>

          <!-- 注册链接 -->
          <div class="text-center mt-6 pt-4 border-t border-gray-200">
            <p class="text-gray-600 text-sm">
              还没有账户？
              <NuxtLink 
                to="/users/register" 
                class="text-blue-600 hover:text-blue-700 font-medium"
              >
                立即注册
              </NuxtLink>
            </p>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>