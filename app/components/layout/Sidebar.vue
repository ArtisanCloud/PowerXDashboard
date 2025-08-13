<script setup lang="ts">
import {
  useMenuService,
  type MenuItem,
} from "~/composables/api/services/menuService";

// 使用 i18n 进行菜单标题翻译
const { t } = useI18n();
const route = useRoute();
const menuService = useMenuService();

// 从 API 获取菜单数据
const {
  data: menuResponse,
  pending: menuLoading,
  error: menuError,
  refresh: refreshMenus,
} = await useAsyncData("user-menus", () => menuService.getUserMenus(), {
  default: () => ({ data: [] }),
  transform: (response) => response || { data: [] },
});

// 调试输出
// console.log('菜单响应数据:', menuResponse.value)

// 处理菜单数据，使用 i18n 翻译菜单标题
const menuItems = computed<MenuItem[]>(() => {
  // console.log("计算菜单项，原始数据:", menuResponse.value);

  if (!menuResponse.value?.data) {
    console.log("菜单数据为空");
    return [];
  }

  const processMenuItems = (items: MenuItem[]): MenuItem[] => {
    return items
      .filter((item) => item.visible !== false) // 确保即使 visible 未定义也会显示
      .sort((a, b) => (a.order || 0) - (b.order || 0)) // 防止 order 未定义
      .map((item) => {
        // console.log("处理菜单项:", item);
        // 处理菜单项，翻译标题和 badge
        const processedItem = {
          ...item,
          // 使用 i18n 翻译菜单标题
          title: item.title ? t(item.title) : "未命名菜单",
          // 如果 badge 是翻译键（以 menu. 开头），则翻译它
          badge:
            item.badge &&
            typeof item.badge === "string" &&
            item.badge.startsWith("menu.")
              ? t(item.badge)
              : item.badge,
          children:
            item.children && item.children.length > 0
              ? processMenuItems(item.children)
              : undefined,
        };

        // console.log("处理后的菜单项:", item.title, "→", processedItem.title);
        if (item.badge) {
          console.log("处理后的 badge:", item.badge, "→", processedItem.badge);
        }

        return processedItem;
      });
  };

  const result = processMenuItems(menuResponse.value.data);
  // console.log("处理后的菜单项:", result);
  return result;
});

// 展开状态管理
const expandedItems = ref<Set<string>>(new Set());

// 切换展开状态
const toggleExpanded = (itemId: string) => {
  if (expandedItems.value.has(itemId)) {
    expandedItems.value.delete(itemId);
  } else {
    expandedItems.value.add(itemId);
  }
};

// 检查是否为当前路由
const isActive = (path?: string) => {
  if (!path) return false;
  return route.path === path || route.path.startsWith(path + "/");
};

// 检查是否有子项处于激活状态
const hasActiveChild = (children?: MenuItem[]) => {
  if (!children) return false;
  return children.some((child) => isActive(child.path));
};

// 初始化展开状态（如果有子项处于激活状态，则展开父项）
onMounted(() => {
  menuItems.value.forEach((item) => {
    if (item.children && hasActiveChild(item.children)) {
      expandedItems.value.add(item.id);
    }
  });
});
</script>

<template>
  <aside class="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
    <!-- Logo 区域 -->
    <div class="flex items-center justify-center h-16 border-b border-gray-200">
      <NuxtLink
        :to="$localePath('/dashboard')"
        class="flex items-center space-x-2"
      >
        <div
          class="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center"
        >
          <span class="text-white font-bold text-sm">P</span>
        </div>
        <span
          class="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          PowerX
        </span>
      </NuxtLink>
    </div>

    <!-- 菜单区域 -->
    <nav class="flex-1 overflow-y-auto py-4">
      <!-- 加载状态 -->
      <div v-if="menuLoading" class="px-3">
        <div class="space-y-2">
          <div v-for="i in 5" :key="i" class="animate-pulse">
            <div class="flex items-center space-x-3 px-3 py-2">
              <div class="w-5 h-5 bg-gray-200 rounded"></div>
              <div class="h-4 bg-gray-200 rounded flex-1"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="menuError" class="px-3">
        <div class="bg-red-50 border border-red-200 rounded-lg p-4">
          <div class="flex items-center space-x-2 text-red-700 mb-2">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5" />
            <span class="font-medium">{{ $t("menu.loadFailed") }}</span>
          </div>
          <p class="text-sm text-red-600 mb-3">
            {{ $t("menu.loadFailedDesc") }}
          </p>
          <UButton
            @click="() => refreshMenus()"
            size="xs"
            color="error"
            variant="soft"
          >
            {{ $t("common.reload") }}
          </UButton>
        </div>
      </div>

      <!-- 菜单列表 -->
      <ul v-else class="space-y-1 px-3">
        <!-- 调试信息 -->
        <li
          class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 p-2 mb-2 rounded text-xs"
        >
          <div class="text-yellow-800 dark:text-yellow-200">
            {{ $t("menu.itemCount") }}: {{ menuItems.length }}
          </div>
          <div
            v-if="menuItems.length === 0"
            class="text-red-600 dark:text-red-400"
          >
            {{ $t("menu.noItemsWarning") }}
          </div>
        </li>
        <li v-for="item in menuItems" :key="item.id">
          <!-- 有子菜单的项目 -->
          <div v-if="item.children">
            <button
              @click="toggleExpanded(item.id)"
              class="w-full flex items-center justify-between transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40 dark:focus-visible:ring-white/20 px-3 py-2 text-sm font-medium rounded-md"
              :class="
                hasActiveChild(item.children)
                  ? 'bg-blue-600/10 dark:bg-blue-400/10 text-blue-700 dark:text-blue-200 ring-1 ring-blue-500/20 dark:ring-blue-400/20'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-900/5 dark:hover:bg-white/5'
              "
            >
              <div class="flex items-center space-x-3">
                <UIcon :name="item.icon" class="w-5 h-5" />
                <span>{{ item.title }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <UBadge v-if="item.badge" size="xs" color="primary">{{
                  item.badge
                }}</UBadge>
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
              <ul
                v-show="expandedItems.has(item.id)"
                class="mt-1 ml-6 space-y-1 overflow-hidden"
              >
                <li v-for="child in item.children" :key="child.id">
                  <NuxtLink
                    v-if="child.path"
                    :to="$localePath(child.path)"
                    class="flex items-center space-x-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40 dark:focus-visible:ring-white/20 px-3 py-2 text-sm rounded-md"
                    :class="
                      isActive(child.path)
                        ? 'bg-blue-600/10 dark:bg-blue-400/10 text-blue-700 dark:text-blue-200 ring-1 ring-blue-500/20 dark:ring-blue-400/20'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-900/5 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                    "
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
            class="flex items-center justify-between transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40 dark:focus-visible:ring-white/20 px-3 py-2 text-sm font-medium rounded-md"
            :class="
              isActive(item.path)
                ? 'bg-blue-600/10 dark:bg-blue-400/10 text-blue-700 dark:text-blue-200 ring-1 ring-blue-500/20 dark:ring-blue-400/20'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-900/5 dark:hover:bg-white/5'
            "
          >
            <div class="flex items-center space-x-3">
              <UIcon :name="item.icon" class="w-5 h-5" />
              <span>{{ item.title }}</span>
            </div>
            <UBadge v-if="item.badge" size="xs" color="primary">{{
              item.badge
            }}</UBadge>
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <!-- 底部用户信息 -->
    <div class="border-t border-gray-200 p-4">
      <div class="flex items-center space-x-3">
        <div
          class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center"
        >
          <UIcon name="i-heroicons-user" class="w-5 h-5 text-gray-600" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate">
            {{ $t("user.admin") }}
          </p>
          <p class="text-xs text-gray-500 truncate">admin@powerx.com</p>
        </div>
      </div>
    </div>
  </aside>
</template>
