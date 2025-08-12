<script setup lang="ts">
definePageMeta({
  title: '仪表板',
  description: '系统概览和关键指标',
  layout: 'default'
})

const { t } = useI18n()

// 统计数据
const stats = ref([
  {
    title: '总用户数',
    value: '12,345',
    change: '+12%',
    changeType: 'positive',
    icon: 'i-heroicons-users'
  },
  {
    title: '今日访问',
    value: '2,847',
    change: '+5.2%',
    changeType: 'positive',
    icon: 'i-heroicons-eye'
  },
  {
    title: '总收入',
    value: '¥89,432',
    change: '-2.1%',
    changeType: 'negative',
    icon: 'i-heroicons-currency-yen'
  },
  {
    title: '活跃用户',
    value: '8,921',
    change: '+8.7%',
    changeType: 'positive',
    icon: 'i-heroicons-chart-bar-square'
  }
])

// 最近活动
const recentActivities = ref([
  {
    id: 1,
    user: '张三',
    action: '创建了新文章',
    target: '《Vue 3 最佳实践》',
    time: '2分钟前',
    type: 'create'
  },
  {
    id: 2,
    user: '李四',
    action: '更新了用户资料',
    target: '',
    time: '5分钟前',
    type: 'update'
  },
  {
    id: 3,
    user: '王五',
    action: '删除了评论',
    target: '在《技术分享》下',
    time: '10分钟前',
    type: 'delete'
  }
])
</script>

<template>
  <div class="space-y-6">
    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <UCard v-for="stat in stats" :key="stat.title" class="p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">{{ stat.title }}</p>
            <p class="text-2xl font-bold text-gray-900 mt-2">{{ stat.value }}</p>
            <div class="flex items-center mt-2">
              <span 
                class="text-sm font-medium"
                :class="{
                  'text-green-600': stat.changeType === 'positive',
                  'text-red-600': stat.changeType === 'negative'
                }"
              >
                {{ stat.change }}
              </span>
              <span class="text-sm text-gray-500 ml-1">vs 上月</span>
            </div>
          </div>
          <div class="p-3 bg-blue-50 rounded-lg">
            <UIcon :name="stat.icon" class="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </UCard>
    </div>

    <!-- 图表和活动 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 图表区域 -->
      <div class="lg:col-span-2">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">访问趋势</h3>
              <UButton variant="ghost" size="sm">
                查看详情
              </UButton>
            </div>
          </template>
          
          <div class="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div class="text-center">
              <UIcon name="i-heroicons-chart-bar" class="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p class="text-gray-500">图表区域</p>
              <p class="text-sm text-gray-400">这里可以集成 Chart.js 或其他图表库</p>
            </div>
          </div>
        </UCard>
      </div>

      <!-- 最近活动 -->
      <div>
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900">最近活动</h3>
          </template>
          
          <div class="space-y-4">
            <div 
              v-for="activity in recentActivities" 
              :key="activity.id"
              class="flex items-start space-x-3"
            >
              <div 
                class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white"
                :class="{
                  'bg-green-500': activity.type === 'create',
                  'bg-blue-500': activity.type === 'update',
                  'bg-red-500': activity.type === 'delete'
                }"
              >
                {{ activity.user.charAt(0) }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-gray-900">
                  <span class="font-medium">{{ activity.user }}</span>
                  {{ activity.action }}
                  <span v-if="activity.target" class="font-medium">{{ activity.target }}</span>
                </p>
                <p class="text-xs text-gray-500 mt-1">{{ activity.time }}</p>
              </div>
            </div>
          </div>
          
          <template #footer>
            <UButton variant="ghost" block>
              查看所有活动
            </UButton>
          </template>
        </UCard>
      </div>
    </div>

    <!-- 快速操作 -->
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900">快速操作</h3>
      </template>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <UButton 
          variant="outline" 
          class="h-20 flex flex-col items-center justify-center space-y-2"
          :to="$localePath('/users')"
        >
          <UIcon name="i-heroicons-user-plus" class="w-6 h-6" />
          <span class="text-sm">添加用户</span>
        </UButton>
        
        <UButton 
          variant="outline" 
          class="h-20 flex flex-col items-center justify-center space-y-2"
          :to="$localePath('/content/articles/create')"
        >
          <UIcon name="i-heroicons-document-plus" class="w-6 h-6" />
          <span class="text-sm">创建文章</span>
        </UButton>
        
        <UButton 
          variant="outline" 
          class="h-20 flex flex-col items-center justify-center space-y-2"
          :to="$localePath('/analytics')"
        >
          <UIcon name="i-heroicons-chart-bar" class="w-6 h-6" />
          <span class="text-sm">查看分析</span>
        </UButton>
        
        <UButton 
          variant="outline" 
          class="h-20 flex flex-col items-center justify-center space-y-2"
          :to="$localePath('/settings')"
        >
          <UIcon name="i-heroicons-cog-6-tooth" class="w-6 h-6" />
          <span class="text-sm">系统设置</span>
        </UButton>
      </div>
    </UCard>
  </div>
</template>