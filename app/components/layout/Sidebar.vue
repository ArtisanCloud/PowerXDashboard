<!-- SidebarMenu.vue（修正版，不依赖 Tooltip，v-if 链相邻无歧义） -->
<script setup lang="ts">
import {
  useMenuService,
  type MenuItem,
} from "~/composables/api/services/menuService";
import { cloneWithFilteredChildren } from "~/composables/useCopy";
import { useUserStore } from "~/stores/user";

/* ---------- stores / utils ---------- */
const route = useRoute();
const menuService = useMenuService();
const userStore = useUserStore();
const { t } = useI18n();
const localePath = useLocalePath() as (p: string) => string;

/* ========== 折叠与密度 ========== */
const collapsed = useState<boolean>("sidebar-collapsed", () => false);
const density = useState<"comfortable" | "compact">(
  "menu-density",
  () => "comfortable"
);
const densityClass = computed(() =>
  density.value === "compact" ? "py-1.5 text-[13px]" : "py-2 text-sm"
);

/* ---------- helpers ---------- */
const isPluginPath = (p?: string) => !!p && p.startsWith("//_p/");
const linkFor = (p?: string) => {
  if (!p) return "";
  return isPluginPath(p) ? p : localePath(p);
};
const isActive = (path?: string) => {
  if (!path) return false;
  if (isPluginPath(path))
    return route.path === path || route.path.startsWith(path);
  const localized = localePath(path);
  return route.path === localized || route.path.startsWith(localized + "/");
};

const translateTitle = (title?: string) =>
  title?.startsWith?.("menu.")
    ? t(title)
    : title || t("menu.untitled", "未命名菜单");

const resolveIcon = (name?: string) => {
  if (!name) return "i-heroicons-puzzle-piece";
  if (name.startsWith("i-")) return name;
  const iconMap: Record<string, string> = {
    Smile: "i-heroicons-face-smile",
    Settings: "i-heroicons-cog-6-tooth",
    User: "i-heroicons-user",
    Home: "i-heroicons-home",
    Plugin: "i-heroicons-puzzle-piece",
  };
  return iconMap[name] || "i-heroicons-puzzle-piece";
};

const isVisible = (it: MenuItem) => it.visible !== false;

/* ---------- 拉取菜单 ---------- */
const {
  data: menuResponse,
  pending: menuLoading,
  error: menuError,
  refresh: refreshMenus,
} = await useAsyncData("user-menus", () => menuService.getUserMenus(), {
  default: () => ({ data: [] }),
  transform: (response) => {
    // service.getUserMenus() 返回的是 ApiResponse<MenuItem[]>
    if (response && Array.isArray(response.data)) {
      return { data: response.data };
    }
    return { data: [] };
  },
});

/* ---------- 子级排序（顶层不排序） ---------- */
const sortChildren = (a: MenuItem, b: MenuItem) => {
  const ao = Number.isFinite(a.order) ? a.order : Number.POSITIVE_INFINITY;
  const bo = Number.isFinite(b.order) ? b.order : Number.POSITIVE_INFINITY;
  if (ao !== bo) return ao - bo;
  const at = a.title ?? "";
  const bt = b.title ?? "";
  if (at !== bt) return at.localeCompare(bt);
  return (a.id ?? "").localeCompare(b.id ?? "");
};

/* ---------- 递归处理 ---------- */
const processMenuItems = (items: MenuItem[], level = 0): MenuItem[] => {
  const mapped = items.filter(isVisible).map((item) => ({
    ...item,
    title: translateTitle(item.title),
    badge:
      typeof item.badge === "string" && item.badge.startsWith("menu.")
        ? t(item.badge)
        : item.badge,
    children: item.children?.length
      ? processMenuItems(item.children, level + 1)
      : undefined,
  }));
  if (level === 0) return mapped; // 顶层不排序
  return mapped.sort(sortChildren);
};

/* ---------- 分组 ---------- */
type MenuGroup = { id: string; title: string; items: MenuItem[] };

const viewGroups = computed<MenuGroup[]>(() => {
  const flatMenus: MenuItem[] = menuResponse.value?.data || [];

  const top: MenuItem[] = [];
  const plugin: MenuItem[] = [];
  const system: MenuItem[] = [];

  for (const item of flatMenus) {
    // ① 置顶
    if (item.slot === "group.root") {
      top.push(item);
      continue;
    }

    // ② 系统“插件市场”容器：id === "plugins"
    if (
      item.origin === "system" &&
      item.id === "plugins" &&
      Array.isArray((item as any).children) &&
      (item as any).children.length > 0
    ) {
      const children = (item as any).children as MenuItem[];

      // 推到 plugin 分组（保持原对象，不拷贝也不裁剪字段）
      const pluginChildren = children.filter(
        (ch) => ch && ch.origin === "plugin"
      );
      if (pluginChildren.length > 0) {
        plugin.push(...pluginChildren);
      }

      // system 分组里放“克隆体”，仅 children 做过滤（不含 plugin 子项）
      const sysItem = cloneWithFilteredChildren(
        item,
        (ch) => !(ch && ch.origin === "plugin")
      );
      system.push(sysItem);
      continue;
    }

    // ③ 普通插件
    if (item.origin === "plugin") {
      plugin.push(item);
      continue;
    }

    // ④ 其余 → 系统
    system.push(item);
  }

  return [
    { title: "置顶", items: processMenuItems(top) },
    { title: "应用", items: processMenuItems(plugin) },
    { title: "系统", items: processMenuItems(system) },
  ];
});

/* ---------- 展开状态 ---------- */
const expandedItems = ref<Set<string>>(new Set());
const toggleExpanded = (id: string) => {
  const s = expandedItems.value;
  s.has(id) ? s.delete(id) : s.add(id);
};
const hasActiveChild = (children?: MenuItem[]) =>
  !!children?.some((child) => isActive(child.path));
const expandByRoute = () => {
  const set = new Set<string>();
  for (const group of viewGroups.value) {
    for (const item of group.items) {
      if (item.children && hasActiveChild(item.children)) set.add(item.id);
    }
  }
  expandedItems.value = set;
};

onMounted(async () => {
  expandByRoute();
  try {
    await userStore.fetchUserContext();
    // 调试菜单数据结构
    // console.log("菜单数据:", menuResponse.value);
  } catch (e) {
    console.error("初始化用户数据失败:", e);
  }
});
watch(
  () => route.path,
  () => expandByRoute()
);

/* ---------- a11y：简单键盘支持 ---------- */
function onTreeKeydown(e: KeyboardEvent) {
  const target = e.target as HTMLElement;
  if (!target) return;
  if (
    e.key === "ArrowRight" &&
    target.getAttribute("aria-expanded") === "false"
  ) {
    target.dispatchEvent(new Event("click", { bubbles: true }));
    e.preventDefault();
  } else if (
    e.key === "ArrowLeft" &&
    target.getAttribute("aria-expanded") === "true"
  ) {
    target.dispatchEvent(new Event("click", { bubbles: true }));
    e.preventDefault();
  }
}
</script>

<template>
  <aside
    :class="collapsed ? 'w-16' : 'w-64'"
    class="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-r border-gray-200/60 dark:border-gray-700/60 shadow-lg flex flex-col h-screen relative z-30 transition-[width] duration-200"
  >
    <!-- 顶部：Logo + 折叠按钮 -->
    <div
      class="flex items-center justify-between h-16 border-b border-gray-200/60 dark:border-gray-700/60 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 px-2"
    >
      <NuxtLink :to="$localePath('/')" class="flex items-center space-x-2 px-2">
        <img src="/images/logo-m.png" alt="Logo" class="w-8 h-8 rounded-lg" />
        <span
          v-if="!collapsed"
          class="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          PowerX
        </span>
      </NuxtLink>
      <button
        class="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 transition-colors"
        @click="collapsed = !collapsed"
        :aria-label="
          collapsed
            ? t('common.expand', '展开侧栏')
            : t('common.collapse', '折叠侧栏')
        "
      >
        <UIcon
          :name="
            collapsed
              ? 'i-heroicons-chevron-double-right'
              : 'i-heroicons-chevron-double-left'
          "
          class="w-4 h-4 text-gray-600 dark:text-gray-300"
        />
      </button>
    </div>

    <!-- 菜单 -->
    <nav class="flex-1 overflow-y-auto py-4" @keydown="onTreeKeydown">
      <!-- 加载 -->
      <div v-if="menuLoading" class="px-3">
        <div class="space-y-2">
          <div v-for="i in 5" :key="i" class="animate-pulse">
            <div class="flex items-center space-x-3 px-3 py-2">
              <div class="w-5 h-5 bg-gray-200 rounded"></div>
              <div class="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 错误 -->
      <div v-else-if="menuError" class="px-3">
        <div class="bg-red-50/70 border border-red-200 rounded-lg p-4">
          <div class="flex items-center space-x-2 text-red-700 mb-2">
            <UIcon class="w-5 h-5" name="i-heroicons-exclamation-triangle" />
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

      <!-- 列表（分组渲染） -->
      <ul v-else class="space-y-1 px-3" role="tree" aria-label="主菜单">
        <li
          v-if="viewGroups.length === 0"
          class="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-4 rounded-lg text-center"
        >
          <div class="text-gray-500 dark:text-gray-400 text-sm">
            {{ $t("menu.noItemsFound") }}
          </div>
        </li>

        <template v-for="group in viewGroups" :key="group.id">
          <!-- Sticky 分组 Header -->
          <li
            class="mt-4 first:mt-2 mb-1 px-2 sticky top-0 z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm"
          >
            <div
              class="text-xs font-semibold tracking-wide text-gray-500 dark:text-gray-400 flex items-center justify-between"
            >
              <span class="uppercase truncate">
                <template v-if="collapsed">{{
                  group.title?.[0] || ""
                }}</template>
                <template v-else>{{ group.title }}</template>
              </span>
            </div>
            <div class="mt-2 h-px bg-gray-200/70 dark:bg-gray-700/70"></div>
          </li>

          <!-- 组内顶层项 -->
          <li v-for="item in group.items" :key="group.id + ':' + item.id">
            <!-- 1) 有子菜单 -->
            <div
              v-if="item.children"
              class="menu-item group relative w-full"
              role="treeitem"
              :aria-expanded="expandedItems.has(item.id)"
              :aria-controls="`submenu-${item.id}`"
            >
              <button
                @click="toggleExpanded(item.id)"
                :class="[
                  'w-full flex items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40',
                  collapsed ? 'justify-center px-2' : 'justify-between px-3',
                  densityClass,
                  hasActiveChild(item.children)
                    ? 'text-blue-700 dark:text-blue-100 bg-blue-500/10 ring-1 ring-blue-500/10'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-900/5 dark:hover:bg-white/5',
                ]"
              >
                <div v-if="collapsed" class="flex items-center justify-center">
                  <span class="inline-block w-5 h-5">
                    <UIcon class="w-5 h-5" :name="resolveIcon(item.icon)" />
                  </span>
                </div>
                <div v-else class="flex items-center justify-between w-full">
                  <div class="flex items-center gap-3">
                    <span class="inline-block w-5 h-5 flex-shrink-0">
                      <UIcon class="w-5 h-5" :name="resolveIcon(item.icon)" />
                    </span>
                    <span class="truncate">{{ item.title }}</span>
                  </div>
                  <div class="flex items-center gap-2 flex-shrink-0">
                    <UBadge v-if="item.badge" size="xs" color="primary">{{
                      item.badge
                    }}</UBadge>
                    <UIcon
                      name="i-heroicons-chevron-right"
                      class="w-4 h-4 transition-transform"
                      :class="{ 'rotate-90': expandedItems.has(item.id) }"
                    />
                  </div>
                </div>
              </button>

              <Transition
                enter-active-class="transition-[max-height,opacity] duration-200 ease-out"
                enter-from-class="opacity-0 max-h-0"
                enter-to-class="opacity-100 max-h-96"
                leave-active-class="transition-[max-height,opacity] duration-150 ease-in"
                leave-from-class="opacity-100 max-h-96"
                leave-to-class="opacity-0 max-h-0"
              >
                <ul
                  v-show="expandedItems.has(item.id) && !collapsed"
                  :id="`submenu-${item.id}`"
                  class="mt-1 ml-6 space-y-1 overflow-hidden"
                  role="group"
                >
                  <li v-for="child in item.children" :key="child.id">
                    <NuxtLink
                      v-if="child.path"
                      :to="linkFor(child.path)"
                      class="flex items-center gap-3 px-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
                      :class="[
                        densityClass,
                        isActive(child.path)
                          ? 'bg-blue-500/10 text-blue-700 dark:text-blue-100 ring-1 ring-blue-500/20'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-900/5 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white',
                      ]"
                      :aria-current="isActive(child.path) ? 'page' : undefined"
                      role="treeitem"
                    >
                      <span class="inline-block w-4 h-4">
                        <UIcon
                          class="w-4 h-4"
                          :name="resolveIcon(child.icon)"
                        />
                      </span>
                      <span class="truncate">{{ child.title }}</span>
                    </NuxtLink>

                    <div
                      v-else
                      class="flex items-center gap-3 px-3 text-sm text-slate-500"
                      :class="densityClass"
                      role="treeitem"
                    >
                      <span class="inline-block w-4 h-4">
                        <UIcon
                          class="w-4 h-4"
                          :name="resolveIcon(child.icon)"
                        />
                      </span>
                      <span class="truncate">{{ child.title }}</span>
                    </div>
                  </li>
                </ul>
              </Transition>
            </div>

            <!-- 2) 顶层无子菜单（有 path） -->
            <template v-else-if="item.path">
              <NuxtLink
                :to="linkFor(item.path)"
                :class="[
                  'menu-item group relative flex items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40',
                  collapsed ? 'justify-center px-2' : 'justify-between px-3',
                  densityClass,
                  isActive(item.path)
                    ? 'text-blue-700 dark:text-blue-100 bg-blue-500/10 ring-1 ring-blue-500/20'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-900/5 dark:hover:bg-white/5',
                ]"
                :aria-current="isActive(item.path) ? 'page' : undefined"
                role="treeitem"
              >
                <!-- 左侧高亮条 -->
                <span
                  v-if="isActive(item.path)"
                  class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r bg-blue-500 dark:bg-blue-400"
                  aria-hidden="true"
                />
                <div v-if="collapsed" class="flex items-center justify-center">
                  <span class="inline-block w-5 h-5">
                    <UIcon class="w-5 h-5" :name="resolveIcon(item.icon)" />
                  </span>
                </div>
                <div v-else class="flex items-center justify-between w-full">
                  <div class="flex items-center gap-3">
                    <span class="inline-block w-5 h-5 flex-shrink-0">
                      <UIcon class="w-5 h-5" :name="resolveIcon(item.icon)" />
                    </span>
                    <span class="truncate">{{ item.title }}</span>
                  </div>
                  <UBadge v-if="item.badge" size="xs" color="primary">{{
                    item.badge
                  }}</UBadge>
                </div>
              </NuxtLink>
            </template>

            <!-- 3) 顶层占位（无 path） -->
            <div
              v-else
              :class="[
                'flex items-center text-slate-700 dark:text-slate-200 rounded-md',
                collapsed ? 'justify-center px-2' : 'gap-3 px-3',
                densityClass,
              ]"
              role="treeitem"
            >
              <span class="inline-block w-5 h-5 flex-shrink-0">
                <UIcon class="w-5 h-5" :name="resolveIcon(item.icon)" />
              </span>
              <span v-if="!collapsed" class="truncate">{{ item.title }}</span>
            </div>
          </li>
        </template>
      </ul>
    </nav>

    <!-- 底部用户信息 + 快捷开关 -->
    <div
      class="mt-auto border-t border-gray-200/60 dark:border-gray-700/60 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800/50 dark:to-blue-900/30 px-2 py-3 h-[73px] flex items-center"
    >
      <div class="flex items-center gap-3 flex-1 min-w-0">
        <div
          v-if="userStore.avatarUrl"
          class="w-8 h-8 rounded-full overflow-hidden bg-gray-300"
        >
          <img
            :src="userStore.avatarUrl"
            :alt="userStore.displayName"
            class="w-full h-full object-cover"
          />
        </div>
        <div
          v-else
          class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center"
        >
          <UIcon class="w-5 h-5 text-gray-600" name="i-heroicons-user" />
        </div>
        <div v-if="!collapsed" class="flex-1 min-w-0">
          <p
            class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate"
          >
            {{ userStore.displayName || $t("user.admin") }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
            {{ userStore.user?.email || "admin@powerx.com" }}
          </p>
        </div>

        <div class="flex items-center gap-1">
          <button
            class="p-1.5 rounded-md hover:bg-slate-900/5 dark:hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40"
            @click="density = density === 'compact' ? 'comfortable' : 'compact'"
            :aria-label="t('common.toggleDensity', '切换密度')"
            title="切换密度"
          >
            <UIcon
              :name="
                density === 'compact'
                  ? 'i-heroicons-arrows-pointing-out'
                  : 'i-heroicons-arrows-pointing-in'
              "
              class="w-5 h-5"
            />
          </button>
          <button
            class="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 transition-colors"
            @click="collapsed = !collapsed"
            :aria-label="
              collapsed
                ? t('common.expand', '展开侧栏')
                : t('common.collapse', '折叠侧栏')
            "
            :title="
              collapsed
                ? t('common.expand', '展开侧栏')
                : t('common.collapse', '折叠侧栏')
            "
          >
            <UIcon
              :name="
                collapsed
                  ? 'i-heroicons-chevron-double-right'
                  : 'i-heroicons-chevron-double-left'
              "
              class="w-4 h-4 text-gray-600 dark:text-gray-300"
            />
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
@media (prefers-reduced-motion: reduce) {
  .transition-\[max-height,
  opacity\],
  .transition-transform,
  .transition-\[width\] {
    transition: none !important;
  }
}
</style>
