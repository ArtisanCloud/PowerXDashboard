<script setup lang="ts">
import {
  useMenuService,
  type MenuItem,
} from "~/composables/api/services/menuService";
import { useUserStore } from "~/stores/user";

/* ---------- stores / utils ---------- */
const route = useRoute();
const menuService = useMenuService();
const userStore = useUserStore();
const { t } = useI18n();
const localePath = useLocalePath() as (p: string) => string;

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
  transform: (response) => response || { data: [] },
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

/* ---------- 递归处理：翻译标题、处理子级；顶层不排序 ---------- */
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

  if (level === 0) return mapped; // 顶层：不排序，尊重后端顺序
  return mapped.sort(sortChildren); // 子级：可选排序
};

/* ---------- 分组类型 ---------- */
type MenuGroup = { id: string; title: string; items: MenuItem[] };

/* ---------- categories → 分组（优先） ---------- */
function categoriesToGroups(resp: any): MenuGroup[] | null {
  const data = resp?.data ?? resp;
  const cats: any[] | undefined = Array.isArray(data?.categories)
    ? data.categories
    : undefined;
  if (!cats) return null;

  const groups: MenuGroup[] = [];
  for (const cat of cats) {
    const items = Array.isArray(cat?.children)
      ? (cat.children as MenuItem[])
      : [];
    if (!items.length) continue;
    groups.push({
      id: String(cat.id ?? ""),
      title: typeof cat.title === "string" ? cat.title : "",
      items,
    });
  }
  return groups.length ? groups : null;
}

/* ---------- 兜底：按 origin/slot 分桶 ---------- */
function fallbackBucketByOrigin(menus: MenuItem[]): MenuGroup[] {
  const rootPlugins: MenuItem[] = [];
  const system: MenuItem[] = [];
  const others: MenuItem[] = [];

  for (const m of menus) {
    if (m.origin === "system") {
      system.push(m);
      continue;
    }
    if (m.slot === "group.root") {
      rootPlugins.push(m);
      continue;
    }
    others.push(m);
  }

  const groups: MenuGroup[] = [];
  if (rootPlugins.length)
    groups.push({ id: "root", title: "置顶", items: rootPlugins });
  if (system.length)
    groups.push({ id: "system", title: "系统功能", items: system });
  if (others.length)
    groups.push({ id: "plugins", title: "插件", items: others });
  return groups;
}

/* ---------- 现有扁平顶层：用于兜底分桶 ---------- */
const flatTopMenus = computed<MenuItem[]>(() =>
  menuResponse.value?.data ? processMenuItems(menuResponse.value.data, 0) : []
);

/* ---------- 计算分组视图数据 ---------- */
const viewGroups = computed<MenuGroup[]>(() => {
  const catGroups = categoriesToGroups(menuResponse.value);
  if (catGroups) {
    // 对每组里的 items 做翻译/子级排序（顶层不排序）
    return catGroups.map((g) => ({
      id: g.id,
      title: translateTitle(g.title),
      items: processMenuItems(g.items, 0),
    }));
  }
  // 兜底：把已按后端顺序处理过的顶层扁平 menus 再分桶
  const flatTop = flatTopMenus.value;
  return fallbackBucketByOrigin(flatTop).map((g) => ({
    id: g.id,
    title: translateTitle(g.title),
    items: processMenuItems(g.items, 0),
  }));
});

/* ---------- 展开状态：根据当前路由自动展开父级 ---------- */
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
  } catch (e) {
    console.error("初始化用户数据失败:", e);
  }
});

watch(
  () => route.path,
  () => expandByRoute()
);
</script>

<template>
  <aside
    class="w-64 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-r border-gray-200/60 dark:border-gray-700/60 shadow-lg flex flex-col h-screen relative z-30"
  >
    <!-- Logo -->
    <div
      class="flex items-center justify-center h-16 border-b border-gray-200/60 dark:border-gray-700/60 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30"
    >
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

    <!-- 菜单 -->
    <nav class="flex-1 overflow-y-auto py-4">
      <!-- 加载 -->
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

      <!-- 错误 -->
      <div v-else-if="menuError" class="px-3">
        <div class="bg-red-50 border border-red-200 rounded-lg p-4">
          <div class="flex items-center space-x-2 text-red-700 mb-2">
            <UIcon
              class="w-5 h-5 inline-block"
              name="i-heroicons-exclamation-triangle"
            />
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
      <ul v-else class="space-y-1 px-3" role="tree">
        <li
          v-if="viewGroups.length === 0"
          class="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-4 rounded-lg text-center"
        >
          <div class="text-gray-500 dark:text-gray-400 text-sm">
            {{ $t("menu.noItemsFound") }}
          </div>
        </li>

        <template v-for="group in viewGroups" :key="group.id">
          <!-- 分组 Header（可改 sticky：在 li 上加 -mx-3 px-3 sticky top-0 bg-white/95 ...） -->
          <li class="mt-4 first:mt-2 mb-1 px-2">
            <div
              class="text-xs font-semibold tracking-wide text-gray-500 dark:text-gray-400 flex items-center justify-between"
            >
              <span class="uppercase">{{ group.title }}</span>
              <!-- 可选：组内数量 -->
              <!-- <UBadge size="xs" variant="soft" color="gray">{{ group.items.length }}</UBadge> -->
            </div>
            <div class="mt-2 h-px bg-gray-200/70 dark:bg-gray-700/70"></div>
          </li>

          <!-- 组内顶层项 -->
          <li v-for="item in group.items" :key="group.id + ':' + item.id">
            <!-- 有子菜单 -->
            <div v-if="item.children">
              <button
                @click="toggleExpanded(item.id)"
                class="w-full flex items-center justify-between transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40 dark:focus-visible:ring-white/20 px-3 py-2 text-sm font-medium rounded-md"
                :class="
                  hasActiveChild(item.children)
                    ? 'bg-blue-600/10 dark:bg-blue-400/10 text-blue-700 dark:text-blue-200 ring-1 ring-blue-500/20 dark:ring-blue-400/20'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-900/5 dark:hover:bg-white/5'
                "
                :aria-expanded="expandedItems.has(item.id)"
                :aria-controls="`submenu-${item.id}`"
              >
                <div class="flex items-center space-x-3">
                  <span class="w-5 h-5 inline-block">
                    <UIcon
                      class="w-5 h-5 inline-block"
                      :name="resolveIcon(item.icon)"
                    />
                  </span>
                  <span>{{ item.title }}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <UBadge v-if="item.badge" size="xs" color="primary">{{
                    item.badge
                  }}</UBadge>
                  <span class="w-4 h-4 transition-transform inline-block">
                    <UIcon
                      name="i-heroicons-chevron-right"
                      :class="{ 'rotate-90': expandedItems.has(item.id) }"
                      class="w-4 h-4 transition-transform inline-block"
                    />
                  </span>
                </div>
              </button>

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
                  :id="`submenu-${item.id}`"
                  class="mt-1 ml-6 space-y-1 overflow-hidden"
                  role="group"
                >
                  <li v-for="child in item.children" :key="child.id">
                    <NuxtLink
                      v-if="child.path"
                      :to="linkFor(child.path)"
                      class="flex items-center space-x-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40 dark:focus-visible:ring-white/20 px-3 py-2 text-sm rounded-md"
                      :class="
                        isActive(child.path)
                          ? 'bg-blue-600/10 dark:bg-blue-400/10 text-blue-700 dark:text-blue-200 ring-1 ring-blue-500/20 dark:ring-blue-400/20'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-900/5 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                      "
                    >
                      <span class="w-4 h-4 inline-block">
                        <UIcon
                          class="w-4 h-4 inline-block"
                          :name="resolveIcon(child.icon)"
                        />
                      </span>
                      <span>{{ child.title }}</span>
                    </NuxtLink>

                    <div
                      v-else
                      class="flex items-center space-x-3 px-3 py-2 text-sm text-slate-500"
                    >
                      <span class="w-4 h-4 inline-block">
                        <UIcon
                          class="w-4 h-4 inline-block"
                          :name="resolveIcon(child.icon)"
                        />
                      </span>
                      <span>{{ child.title }}</span>
                    </div>
                  </li>
                </ul>
              </Transition>
            </div>

            <!-- 顶层无子菜单 -->
            <NuxtLink
              v-else-if="item.path"
              :to="linkFor(item.path)"
              class="flex items-center justify-between transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40 dark:focus-visible:ring-white/20 px-3 py-2 text-sm font-medium rounded-md"
              :class="
                isActive(item.path)
                  ? 'bg-blue-600/10 dark:bg-blue-400/10 text-blue-700 dark:text-blue-200 ring-1 ring-blue-500/20 dark:ring-blue-400/20'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-900/5 dark:hover:bg-white/5'
              "
            >
              <div class="flex items-center space-x-3">
                <span class="w-5 h-5 inline-block">
                  <UIcon
                    class="w-5 h-5 inline-block"
                    :name="resolveIcon(item.icon)"
                  />
                </span>
                <span>{{ item.title }}</span>
              </div>
              <UBadge v-if="item.badge" size="xs" color="primary">{{
                item.badge
              }}</UBadge>
            </NuxtLink>

            <!-- 顶层占位（无 path） -->
            <div
              v-else
              class="flex items-center space-x-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-200"
            >
              <span class="w-5 h-5 inline-block">
                <UIcon
                  class="w-5 h-5 inline-block"
                  :name="resolveIcon(item.icon)"
                />
              </span>
              <span>{{ item.title }}</span>
            </div>
          </li>
        </template>
      </ul>
    </nav>

    <!-- 底部用户信息 -->
    <div
      class="mt-auto border-t border-gray-200/60 dark:border-gray-700/60 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800/50 dark:to-blue-900/30 px-4 py-4 h-[73px] flex items-center"
    >
      <div class="flex items-center space-x-3">
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
          <span class="w-5 h-5 text-gray-600 inline-block">
            <UIcon
              class="w-5 h-5 text-gray-600 inline-block"
              name="i-heroicons-user"
            />
          </span>
        </div>
        <div class="flex-1 min-w-0">
          <p
            class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate"
          >
            {{ userStore.displayName || $t("user.admin") }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
            {{ userStore.user?.email || "admin@powerx.com" }}
          </p>
        </div>
      </div>
    </div>
  </aside>
</template>
