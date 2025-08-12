<script setup lang="ts">
interface MenuItem {
  id: string
  title: string
  icon: string
  path?: string
  children?: MenuItem[]
  badge?: string | number
}

const { t } = useI18n()
const route = useRoute()

// 菜单数据
const menuItems = computed<MenuItem[]>(() => [
  {
    id: 'dashboard',
    title: t('menu.dashboard'),
    icon: 'i-heroicons-home',
    path: '/dashboard'
  },
  {
    id: 'users',
    title: t('menu.users'),
    icon: 'i-heroicons-users',
    children: [
      {
        id: 'user-list',
        title: t('menu.userList'),
        icon: 'i-heroicons-list-bullet',
        path: '/users'
      },
      {
        id: 'user-roles',
        title: t('menu.userRoles'),
        icon: 'i-heroicons-shield-check',
        path: '/users/roles'
      }
    ]
  },
  {
    id: 'content',
    title: t('menu.content'),
    icon: 'i-heroicons-document-text',
    children: [
      {
        id: 'articles',
        title: t('menu.articles'),
        icon: 'i-heroicons-newspaper',
        path: '/content/articles'
      },
      {
        id: 'categories',
        title: t('menu.categories'),
        icon: 'i-heroicons-tag',
        path: '/content/categories'
      }
    ]
  },
  {
    id: 'analytics',
    title: t('menu.analytics'),
    icon: 'i-heroicons-chart-bar',
    path: '/analytics',
    badge: 'New'
  },
  {
    id: 'settings',
    title: t('menu.settings'),
    icon: 'i-heroicons-cog-6-tooth',
    children: [
      {
        id: 'system',
        title: t('menu.systemSettings'),
        icon: 'i-heroicons-server',
        path: '/settings/system'
      },
      {
        id: 'security',
        title: t('menu.security'),
        icon: 'i-heroicons-lock-closed',
        path: '/settings/security'
      }
    ]
  }
])

// 展开状态管理
const expandedItems = ref<Set<string>>(new Set())

// 切换展开状态
const toggleExpanded = (itemId: string) => {
  if (expandedItems.value.has(itemId)) {
    expandedItems.value.delete(itemId)
  } else {
    expandedItems.value.add(itemId)
  }
}

// 检查是否为当前路由
const isActive = (path?: string) => {
  if (!path) return false
  return route.path === path || route.path.startsWith(path + '/')
}

// 检查是否有子项处于激活状态
const hasActiveChild = (children?: MenuItem[]) => {
  if (!children) return false
  return children.some(child => isActive(child.path))
}

// 初始化展开状态（如果有子项处于激活状态，则展开父项）
onMounted(() => {
  menuItems.value.forEach(item => {
    if (item.children && hasActiveChild(item.children)) {
      expandedItems.value.add(item.id)
    }
  })
})
</script>

<template>
  <aside class="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
    <!-- Logo 区域 -->
    <div class="flex items-center justify-center h-16 border-b border-gray-200">
      <NuxtLink :to="$localePath('/dashboard')" class="flex items-center space-x-2">
        <div class="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-sm">P</span>
        </div>
        <span class="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          PowerX
        </span>
      </NuxtLink>
    </div>

    <!-- 菜单区域 -->
    <nav class="flex-1 overflow-y-auto py-4">
      <ul class="space-y-1 px-3">
        <li v-for="item in menuItems" :key="item.id">
          <!-- 有子菜单的项目 -->
          <div v-if="item.children">
            <button
              @click="toggleExpanded(item.id)"
              class="w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors"
              :class="[
                hasActiveChild(item.children) 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              ]"
            >
              <div class="flex items-center space-x-3">
                <UIcon :name="item.icon" class="w-5 h-5" />
                <span>{{ item.title }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <UBadge v-if="item.badge" size="xs" color="primary">{{ item.badge }}</UBadge>
                <UIcon 
                  name="i-heroicons-chevron-right" 
                  class="w-4 h-4 transition-transform"
                  :class="{ 'rotate-90': expandedItems.has(item.id) }"
                />
              </div>
            </button>
            
            <!-- 子菜单 -->
            <Transition
              enter-active-class="transition-all duration-200 ease-out"
              enter-from-class="opacity-0 max-h-0"
              enter-to-class="opacity-100 max-h-96"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100 max-h-96"
              leave-to-class="opacity-0 max-h-0"
            >
              <ul v-show="expandedItems.has(item.id)" class="mt-1 ml-6 space-y-1 overflow-hidden">
                <li v-for="child in item.children" :key="child.id">
                  <NuxtLink
                    v-if="child.path"
                    :to="$localePath(child.path)"
                    class="flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors"
                    :class="[
                      isActive(child.path)
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    ]"
                  >
                    <UIcon :name="child.icon" class="w-4 h-4" />
                    <span>{{ child.title }}</span>
                  </NuxtLink>
                </li>
              </ul>
            </Transition>
          </div>

          <!-- 无子菜单的项目 -->
          <NuxtLink
            v-else-if="item.path"
            :to="$localePath(item.path)"
            class="flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors"
            :class="[
              isActive(item.path)
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            ]"
          >
            <div class="flex items-center space-x-3">
              <UIcon :name="item.icon" class="w-5 h-5" />
              <span>{{ item.title }}</span>
            </div>
            <UBadge v-if="item.badge" size="xs" color="primary">{{ item.badge }}</UBadge>
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <!-- 底部用户信息 -->
    <div class="border-t border-gray-200 p-4">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <UIcon name="i-heroicons-user" class="w-5 h-5 text-gray-600" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate">管理员</p>
          <p class="text-xs text-gray-500 truncate">admin@powerx.com</p>
        </div>
      </div>
    </div>
  </aside>
</template>