<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
    <!-- 顶部导航栏 -->
    <nav class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-4">
            <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">P</span>
            </div>
            <h1 class="text-xl font-bold text-slate-900 dark:text-white">PowerX Admin</h1>
          </div>
          
          <div class="flex items-center space-x-4">
            <UButton variant="ghost" icon="i-heroicons-bell" size="sm" />
            <UButton variant="ghost" icon="i-heroicons-cog-6-tooth" size="sm" />
            <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" size="sm" />
          </div>
        </div>
      </div>
    </nav>

    <!-- 主要内容区域 -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 欢迎区域 -->
      <div class="mb-8">
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
          <div class="relative z-10">
            <h2 class="text-3xl font-bold mb-2">欢迎回来！</h2>
            <p class="text-blue-100 text-lg">今天是个美好的一天，让我们开始工作吧</p>
          </div>
          <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div class="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        </div>
      </div>

      <!-- 统计卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="card hover:shadow-lg transition-all duration-300 animate-fade-in p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-600 dark:text-slate-400">总用户数</p>
              <p class="text-3xl font-bold text-slate-900 dark:text-white">2,847</p>
              <p class="text-sm text-green-600 dark:text-green-400 flex items-center mt-1">
                <span class="mr-1">↗</span> +12.5%
              </p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <UIcon name="i-heroicons-users" class="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div class="card hover:shadow-lg transition-all duration-300 animate-fade-in p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-600 dark:text-slate-400">月收入</p>
              <p class="text-3xl font-bold text-slate-900 dark:text-white">¥89,432</p>
              <p class="text-sm text-green-600 dark:text-green-400 flex items-center mt-1">
                <span class="mr-1">↗</span> +8.2%
              </p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <UIcon name="i-heroicons-banknotes" class="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div class="card glass-effect animate-fade-in p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-600 dark:text-slate-400">订单数</p>
              <p class="text-3xl font-bold text-slate-900 dark:text-white">1,247</p>
              <p class="text-sm text-red-600 dark:text-red-400 flex items-center mt-1">
                <span class="mr-1">↘</span> -2.1%
              </p>
            </div>
            <div class="w-12 h-12 gradient-warning rounded-xl flex items-center justify-center">
              <UIcon name="i-heroicons-shopping-bag" class="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div class="card glass-effect animate-slide-in p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-600 dark:text-slate-400">转化率</p>
              <p class="text-3xl font-bold text-slate-900 dark:text-white">3.24%</p>
              <p class="text-sm text-green-600 dark:text-green-400 flex items-center mt-1">
                <span class="mr-1">↗</span> +0.3%
              </p>
            </div>
            <div class="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
              <UIcon name="i-heroicons-chart-bar-square" class="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <!-- 主要内容区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 快速操作 -->
        <div class="lg:col-span-2">
          <UCard class="border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-slate-900 dark:text-white">快速操作</h3>
                <UBadge color="blue" variant="soft">6 个功能</UBadge>
              </div>
            </template>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="group p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 cursor-pointer">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UIcon name="i-heroicons-user-plus" class="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 class="font-medium text-slate-900 dark:text-white">添加用户</h4>
                    <p class="text-sm text-slate-600 dark:text-slate-400">创建新的用户账户</p>
                  </div>
                </div>
              </div>

              <div class="group p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-green-300 dark:hover:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 cursor-pointer">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UIcon name="i-heroicons-document-plus" class="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 class="font-medium text-slate-900 dark:text-white">发布内容</h4>
                    <p class="text-sm text-slate-600 dark:text-slate-400">创建新的文章或页面</p>
                  </div>
                </div>
              </div>

              <div class="group p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 cursor-pointer">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 class="font-medium text-slate-900 dark:text-white">系统设置</h4>
                    <p class="text-sm text-slate-600 dark:text-slate-400">配置系统参数</p>
                  </div>
                </div>
              </div>

              <div class="group p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-200 cursor-pointer">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UIcon name="i-heroicons-chart-pie" class="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 class="font-medium text-slate-900 dark:text-white">数据分析</h4>
                    <p class="text-sm text-slate-600 dark:text-slate-400">查看详细报告</p>
                  </div>
                </div>
              </div>
            </div>
          </UCard>
        </div>

        <!-- 最近活动 -->
        <div>
          <UCard class="border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-slate-900 dark:text-white">最近活动</h3>
                <UButton variant="ghost" size="xs" icon="i-heroicons-ellipsis-horizontal" />
              </div>
            </template>

            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <UAvatar size="sm" src="https://avatars.githubusercontent.com/u/739984?v=4" />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-slate-900 dark:text-white">张三</p>
                  <p class="text-sm text-slate-600 dark:text-slate-400">创建了新的项目</p>
                  <p class="text-xs text-slate-500 dark:text-slate-500">2分钟前</p>
                </div>
                <UBadge color="green" variant="soft" size="xs">新建</UBadge>
              </div>

              <div class="flex items-start space-x-3">
                <UAvatar size="sm" src="https://avatars.githubusercontent.com/u/739985?v=4" />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-slate-900 dark:text-white">李四</p>
                  <p class="text-sm text-slate-600 dark:text-slate-400">完成了订单处理</p>
                  <p class="text-xs text-slate-500 dark:text-slate-500">5分钟前</p>
                </div>
                <UBadge color="blue" variant="soft" size="xs">完成</UBadge>
              </div>

              <div class="flex items-start space-x-3">
                <UAvatar size="sm" src="https://avatars.githubusercontent.com/u/739986?v=4" />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-slate-900 dark:text-white">王五</p>
                  <p class="text-sm text-slate-600 dark:text-slate-400">更新了用户信息</p>
                  <p class="text-xs text-slate-500 dark:text-slate-500">10分钟前</p>
                </div>
                <UBadge color="yellow" variant="soft" size="xs">更新</UBadge>
              </div>
            </div>

            <template #footer>
              <UButton variant="ghost" size="sm" block>查看全部活动</UButton>
            </template>
          </UCard>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
useHead({
  title: 'PowerX Admin - 首页',
  meta: [
    { name: 'description', content: 'PowerX Admin 现代化管理后台首页' }
  ]
})
</script>