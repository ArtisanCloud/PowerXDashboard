<script setup lang="ts">
import ThemeSwitcher from '../ThemeSwitcher.vue'
const { t } = useI18n()

// 用户信息
const user = ref({
  name: '管理员',
  email: 'admin@powerx.com',
  avatar: null
})

// 通知数据
const notifications = ref([
  {
    id: 1,
    title: '新用户注册',
    message: '用户 john@example.com 刚刚注册了账户',
    time: '2分钟前',
    read: false,
    type: 'user'
  },
  {
    id: 2,
    title: '系统更新',
    message: '系统将在今晚 23:00 进行维护更新',
    time: '1小时前',
    read: false,
    type: 'system'
  },
  {
    id: 3,
    title: '数据备份完成',
    message: '今日数据备份已成功完成',
    time: '3小时前',
    read: true,
    type: 'success'
  }
])

// 未读通知数量
const unreadCount = computed(() => 
  notifications.value.filter(n => !n.read).length
)

// 用户菜单项
const userMenuItems = computed(() => [
  [
    {
      label: t('header.profile'),
      icon: 'i-heroicons-user',
      click: () => navigateTo('/profile')
    },
    {
      label: t('header.settings'),
      icon: 'i-heroicons-cog-6-tooth',
      click: () => navigateTo('/settings')
    }
  ],
  [
    {
      label: t('header.logout'),
      icon: 'i-heroicons-arrow-right-on-rectangle',
      click: handleLogout
    }
  ]
])

// 通知菜单项
const notificationItems = computed(() => [
  notifications.value.map(notification => ({
    label: notification.title,
    description: notification.message,
    icon: getNotificationIcon(notification.type),
    badge: !notification.read ? 'new' : undefined,
    click: () => markAsRead(notification.id)
  }))
])

// 获取通知图标
const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'user': return 'i-heroicons-user-plus'
    case 'system': return 'i-heroicons-cog-6-tooth'
    case 'success': return 'i-heroicons-check-circle'
    default: return 'i-heroicons-bell'
  }
}

// 标记通知为已读
const markAsRead = (id: number) => {
  const notification = notifications.value.find(n => n.id === id)
  if (notification) {
    notification.read = true
  }
}

// 退出登录
const handleLogout = async () => {
  // 这里添加退出登录逻辑
  const localePath = useLocalePath()
  await navigateTo(localePath('/users/login'))
}

// 搜索功能
const searchQuery = ref('')
const isSearchFocused = ref(false)

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // 执行搜索逻辑
    console.log('搜索:', searchQuery.value)
  }
}
</script>

<template>
  <header class="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
    <!-- 左侧：面包屑导航 -->
    <div class="flex items-center space-x-4">
      <nav class="flex" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-2">
          <li>
            <NuxtLink :to="$localePath('/dashboard')" class="text-gray-500 hover:text-gray-700">
              <UIcon name="i-heroicons-home" class="w-4 h-4" />
            </NuxtLink>
          </li>
          <li class="flex items-center">
            <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 text-gray-400 mx-2" />
            <span class="text-sm font-medium text-gray-900">{{ $route.meta.title || t('header.dashboard') }}</span>
          </li>
        </ol>
      </nav>
    </div>

    <!-- 中间：搜索框 -->
    <div class="flex-1 max-w-lg mx-8">
      <div class="relative">
        <UInput
          v-model="searchQuery"
          :placeholder="t('header.searchPlaceholder')"
          icon="i-heroicons-magnifying-glass"
          size="md"
          class="w-full"
          @keyup.enter="handleSearch"
          @focus="isSearchFocused = true"
          @blur="isSearchFocused = false"
        />
        
        <!-- 搜索建议下拉框 -->
        <div 
          v-if="isSearchFocused && searchQuery"
          class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
        >
          <div class="p-2">
            <div class="text-xs text-gray-500 mb-2">{{ t('header.searchSuggestions') }}</div>
            <div class="space-y-1">
              <button class="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded">
                搜索用户 "{{ searchQuery }}"
              </button>
              <button class="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded">
                搜索内容 "{{ searchQuery }}"
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧：操作按钮 -->
    <div class="flex items-center space-x-4">
      <!-- 语言切换器 -->
      <LanguageSwitcher />

      <!-- 通知 -->
      <UDropdownMenu :items="notificationItems">
        <UButton variant="ghost" size="sm" class="relative">
          <UIcon name="i-heroicons-bell" class="w-5 h-5" />
          <UBadge 
            v-if="unreadCount > 0" 
            :label="unreadCount.toString()" 
            size="xs" 
            color="error"
            class="absolute -top-1 -right-1"
          />
        </UButton>
      </UDropdownMenu>

      <!-- 主题切换 -->
      <ThemeSwitcher />

      <!-- 用户菜单 -->
      <UDropdownMenu :items="userMenuItems">
        <UButton variant="ghost" class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <UIcon name="i-heroicons-user" class="w-5 h-5 text-gray-600" />
          </div>
          <div class="hidden md:block text-left">
            <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
            <div class="text-xs text-gray-500">{{ user.email }}</div>
          </div>
          <UIcon name="i-heroicons-chevron-down" class="w-4 h-4 text-gray-400" />
        </UButton>
      </UDropdownMenu>
    </div>
  </header>
</template>