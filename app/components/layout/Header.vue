<script setup lang="ts">
import ThemeSwitcher from "../ThemeSwitcher.vue";
const { t } = useI18n();

// 用户信息
const user = ref({
  name: "管理员",
  email: "admin@powerx.com",
  avatar: null,
});

// 使用通知系统
const { getStats, notifications, fetchNotifications } = useNotifications();

// 获取通知统计信息
const notificationStats = computed(() => getStats());
const unreadCount = computed(() => notificationStats.value.unread);

// 初始化通知数据
onMounted(() => {
  fetchNotifications();
});

// 用户菜单项
const userMenuItems = computed(() => [
  [
    {
      label: t("header.profile"),
      icon: "i-heroicons-user",
      to: "/profile",
    },
    {
      label: t("header.settings"),
      icon: "i-heroicons-cog-6-tooth",
      to: "/settings",
    },
  ],
  [
    {
      label: t("header.logout"),
      icon: "i-heroicons-arrow-right-on-rectangle",
      onSelect: handleLogout,
    },
  ],
]);

// 通知菜单项
const notificationItems = computed(() => {
  const recentNotifications = notifications.value.slice(0, 5); // 只显示最近5条

  const notificationMenuItems = recentNotifications.map((notification) => ({
    label: notification.title,
    description:
      notification.content.length > 50
        ? notification.content.substring(0, 50) + "..."
        : notification.content,
    icon: getNotificationIcon(notification.type),
    badge: !notification.isRead ? "new" : undefined,
    to: { path: "/notifications", query: { id: notification.id } },
  }));

  // 添加分隔符和查看全部按钮
  const menuItems = [notificationMenuItems];

  if (recentNotifications.length > 0) {
    menuItems.push([
      {
        label: "查看所有通知",
        icon: "i-heroicons-eye",
        to: "/notifications",
      },
    ]);
  } else {
    menuItems.push([
      {
        label: "暂无通知",
        icon: "i-heroicons-bell-slash",
        disabled: true,
      },
    ]);
  }

  return menuItems;
});

// 获取通知图标
const getNotificationIcon = (type: string) => {
  switch (type) {
    case "success":
      return "i-heroicons-check-circle";
    case "warning":
      return "i-heroicons-exclamation-triangle";
    case "error":
      return "i-heroicons-x-circle";
    case "info":
      return "i-heroicons-information-circle";
    case "system":
      return "i-heroicons-cog-6-tooth";
    default:
      return "i-heroicons-bell";
  }
};

// 退出登录
const handleLogout = async () => {
  // 这里添加退出登录逻辑
  const localePath = useLocalePath();
  await navigateTo(localePath("/users/login"));
};

// 搜索功能
const searchQuery = ref("");
const isSearchFocused = ref(false);

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // 执行搜索逻辑
    console.log("搜索:", searchQuery.value);
  }
};
</script>

<template>
  <header
    class="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200/60 dark:border-gray-700/60 shadow-sm h-16 flex items-center justify-between px-6 sticky top-0 z-40"
  >
    <!-- 左侧：面包屑导航 -->
    <div class="flex items-center space-x-4">
      <nav class="flex" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-2">
          <li>
            <NuxtLink
              :to="$localePath('/dashboard')"
              class="text-gray-500 hover:text-gray-700"
            >
              <UIcon class="w-4 h-4 inline-block" name="i-heroicons-home" />
            </NuxtLink>
          </li>
          <li class="flex items-center">
            <UIcon
              class="w-4 h-4 text-gray-400 mx-2 inline-block"
              name="i-heroicons-chevron-right"
            />
            <span class="text-sm font-medium text-gray-900">{{
              $route.meta.title || t("dashboard.title")
            }}</span>
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
          class="absolute top-full left-0 right-0 mt-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 rounded-lg shadow-xl z-50"
        >
          <div class="p-2">
            <div class="text-xs text-gray-500 mb-2">
              {{ t("header.searchSuggestions") }}
            </div>
            <div class="space-y-1">
              <button
                class="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded"
              >
                搜索用户 "{{ searchQuery }}"
              </button>
              <button
                class="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded"
              >
                搜索内容 "{{ searchQuery }}"
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧：操作按钮 -->
    <div class="flex items-center space-x-4">
      <!-- 通知 -->
      <UDropdownMenu :items="notificationItems">
        <UButton variant="ghost" size="sm" class="relative">
          <span class="w-5 h-5 inline-block">
            <UIcon class="w-5 h-5 inline-block" name="i-heroicons-bell" />
          </span>
          <UBadge
            v-if="unreadCount > 0"
            :label="unreadCount.toString()"
            size="xs"
            color="error"
            class="absolute -top-1 -right-1"
          />
        </UButton>
      </UDropdownMenu>

      <!-- 用户菜单 -->
      <UDropdownMenu :items="userMenuItems">
        <UButton variant="ghost" class="flex items-center space-x-2">
          <div
            class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center"
          >
            <span class="w-5 h-5 text-gray-600 inline-block">
              <UIcon
                class="w-5 h-5 text-gray-600 inline-block"
                name="i-heroicons-user"
              />
            </span>
          </div>
          <div class="hidden md:block text-left">
            <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
            <div class="text-xs text-gray-500">{{ user.email }}</div>
          </div>
          <span class="w-4 h-4 text-gray-400 inline-block">
            <UIcon
              class="w-4 h-4 text-gray-400 inline-block"
              name="i-heroicons-chevron-down"
            />
          </span>
        </UButton>
      </UDropdownMenu>
    </div>
  </header>
</template>
