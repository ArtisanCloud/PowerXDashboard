<template>
  <div class="space-y-6 p-4">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-lg font-semibold text-[var(--text-primary)]">
          插件应用广场
        </h1>
        <p class="text-sm text-[var(--text-secondary)]">
          浏览并安装扩展功能插件，增强系统能力
        </p>
      </div>
      <div class="flex items-center gap-2">
        <UButton icon="i-heroicons-arrow-path" variant="ghost" @click="refresh"
          >刷新</UButton
        >
      </div>
    </div>

    <!-- 筛选区 -->
    <div class="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] p-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
        <UInput
          v-model="q"
          placeholder="搜索插件名称/描述/作者…"
          icon="i-heroicons-magnifying-glass"
        />
        <USelect
          v-model="category"
          :items="categoryOptions"
          icon="i-heroicons-squares-2x2"
        />
        <USelect
          v-model="status"
          :items="statusOptions"
          icon="i-heroicons-sparkles"
        />
        <USelect
          v-model="sort"
          :items="sortOptions"
          icon="i-heroicons-adjustments-vertical"
        />
      </div>
    </div>

    <!-- 列表区 -->
    <div class="space-y-6">
      <!-- 结果统计 + 调试：确认分页区间 -->
      <div
        class="flex items-center justify-between text-sm text-[var(--text-secondary)]"
      >
        <span>共找到 {{ filtered.length }} 个插件</span>
        <span>
          第 {{ currentPage }} / {{ totalPages }} 页
          <span class="ml-2 text-xs opacity-60">
            [{{ pageStart }}-{{ pageEnd - 1 }}] 本页
            {{ paginatedData.length }} 个
          </span>
        </span>
      </div>

      <!-- 插件网格：确保使用 paginatedData -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <PluginCard
          v-for="p in paginatedData"
          :key="p.id"
          :plugin="p"
          :is-system-installed="Boolean((p as any).__sys?.isSystemInstalled)"
          :is-system-enabled="Boolean((p as any).__sys?.isSystemEnabled)"
          :can-install="isRoot"
          @install="openInstall(p)"
        />
      </div>

      <!-- 空状态 -->
      <div
        v-if="filtered.length === 0"
        class="flex flex-col items-center justify-center py-12 text-center"
      >
        <div
          class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center"
        >
          <UIcon
            name="i-heroicons-puzzle-piece"
            class="w-8 h-8 text-gray-400"
          />
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">未找到相关插件</h3>
        <p class="text-gray-500 max-w-sm">尝试调整搜索条件或浏览其他分类</p>
      </div>

      <!-- 分页控件：Nuxt UI v3 正确写法 -->
      <div v-if="totalPages > 1" class="flex justify-center">
        <UPagination
          v-model:page="currentPage"
          :items-per-page="pageSize"
          :total="filtered.length"
          :sibling-count="1"
          show-edges
          :ui="{
            wrapper: 'flex items-center gap-1',
            rounded: '!rounded-full min-w-[32px] justify-center',
            default: {
              activeButton: {
                variant: 'outline',
              },
            },
          }"
        />
      </div>
    </div>

    <!-- 安装对话框 -->
    <InstallDialog
      v-model="installOpen"
      :plugin="selectedPlugin"
      @installed="onInstalled"
    />
  </div>
</template>

<script setup lang="ts">
import PluginCard, { type MarketplacePlugin } from "~/components/plugins/PluginCard.vue";
import InstallDialog from "~/components/plugins/InstallDialog.vue";
import { useUserStore } from "~/stores/user";

definePageMeta({
  layout: "default",
});

const q = ref("");
const category = ref("全部分类");
const status = ref("全部状态");
const sort = ref("默认排序");

// 分页相关
const currentPage = ref(1);
const pageSize = ref(10); // 确保是数字类型

const categoryOptions = [
  "全部分类",
  "数据",
  "AI",
  "可视化",
  "集成",
  "开发者工具",
];
const sortOptions = ["默认排序", "安装量", "更新时间", "名称"];
const statusOptions = [
  "全部状态",
  "未安装",
  "已安装（未启用）",
  "已启用",
  "已停用",
];

// 用户角色（用于权限控制)
const userStore = useUserStore();
const isRoot = computed(() => userStore.isRoot);

// 后端数据（不使用本地 mock）
const all = ref<MarketplacePlugin[]>([]);

async function fetchMarketplace() {
  try {
    const { useAdminPluginsService } = await import("~/composables/api/services/adminPluginsService");
    const svc = useAdminPluginsService();
    const list = await svc.getMarketplaceV2();
    if (Array.isArray(list)) {
      all.value = (list as any[]).map((p: any) => ({
        id: String(p.id || p.slug || p.name || ""),
        name: p.name || p.id || "-",
        description: p.description || "",
        version: p.version || "-",
        author: p.author || "",
        category: p.category || "",
        installs: Number(p.installs || p.downloadCount || 0),
        icon: p.icon,
        tags: Array.isArray(p.tags) ? p.tags : [],
        __sys: {
          isSystemInstalled: !!p.isSystemInstalled,
          isSystemEnabled: !!p.isSystemEnabled,
          systemStatus: p.systemStatus || '',
        },
      }));
    }
  } catch (e) {
    console.error("加载市场数据失败:", e);
  }
}

onMounted(fetchMarketplace);

// 过滤 & 排序
const filtered = computed(() => {
  const list = all.value.filter((p) => {
    const ql = q.value.toLowerCase();
    const hitQ =
      !q.value ||
      p.name.toLowerCase().includes(ql) ||
      p.description.toLowerCase().includes(ql) ||
      p.author.toLowerCase().includes(ql);
    const hitC = category.value === "全部分类" || p.category === category.value;
    // 状态筛选（依赖后端提供的 isSystemInstalled/isSystemEnabled/systemStatus）
    const sys = (p as any).__sys || {};
    const s = String(status.value);
    let hitS = true;
    if (s !== "全部状态") {
      const isInstalled = !!sys.isSystemInstalled;
      const isEnabled = !!sys.isSystemEnabled;
      if (s === "未安装") hitS = !isInstalled;
      else if (s === "已安装（未启用）") hitS = isInstalled && !isEnabled;
      else if (s === "已启用") hitS = isEnabled;
      else if (s === "已停用") hitS = isInstalled && sys.systemStatus === 'disabled';
    }
    return hitQ && hitC && hitS;
  });
  switch (sort.value) {
    case "安装量":
      return [...list].sort((a, b) => b.installs - a.installs);
    case "名称":
      return [...list].sort((a, b) => a.name.localeCompare(b.name));
    default:
      return list;
  }
});

// 总页数（至少为 1）
const totalPages = computed(() =>
  Math.max(1, Math.ceil(filtered.value.length / pageSize.value))
);

// 分页区间（调试也用得到）
const pageStart = computed(() => (currentPage.value - 1) * pageSize.value);
const pageEnd = computed(() =>
  Math.min(pageStart.value + pageSize.value, filtered.value.length)
);

// 当前页数据（只会返回本页 0~pageSize 条）
const paginatedData = computed(() =>
  filtered.value.slice(pageStart.value, pageEnd.value)
);

// ① 搜索/分类/排序变化：回到第 1 页
watch([q, category, status, sort], () => {
  currentPage.value = 1;
});

// ② 数据源变化或 pageSize 变化：纠正越界页
watch([() => filtered.value.length, pageSize], () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value;
  }
});

// ③（可选）在路由切换或刷新后，若页码非法，也纠正
onMounted(() => {
  if (currentPage.value < 1) currentPage.value = 1;
  if (currentPage.value > totalPages.value)
    currentPage.value = totalPages.value;
});

function refresh() { fetchMarketplace(); }

const installOpen = ref(false);
const selectedPlugin = ref<MarketplacePlugin | undefined>(undefined);
function openInstall(p: MarketplacePlugin) {
  selectedPlugin.value = p;
  installOpen.value = true;
}
function onInstalled(payload: { plugin: MarketplacePlugin; state: any }) {
  // TODO: 上报安装成功，刷新状态
  console.log("Installed:", payload);
}

// 移除临时回调方案
</script>
