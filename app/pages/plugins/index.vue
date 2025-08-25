<template>
  <div class="space-y-6 p-4">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-lg font-semibold text-[var(--text-primary)]">
          插件市场
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
    <div
      class="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] p-4"
    >
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
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
import PluginCard, {
  type MarketplacePlugin,
} from "~/components/plugins/PluginCard.vue";
import InstallDialog from "~/components/plugins/InstallDialog.vue";

definePageMeta({
  layout: "default",
});

const q = ref("");
const category = ref("全部分类");
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

// 扩展插件数据，添加更多示例数据以便测试分页
const all = ref<MarketplacePlugin[]>([
  {
    id: "workflow-tools",
    name: "Workflow 工具集",
    description: "为工作流提供常用节点与模板集合，开箱即用。",
    version: "1.4.2",
    author: "PowerX Team",
    category: "AI",
    installs: 12432,
    icon: "https://avatars.githubusercontent.com/u/9919?s=64&v=4",
    tags: ["workflow", "ai", "nodes"],
  },
  {
    id: "crm-sync",
    name: "CRM 同步",
    description: "与主流 CRM 平台进行客户/订单同步。",
    version: "0.9.8",
    author: "ACME",
    category: "集成",
    installs: 5421,
    icon: "https://avatars.githubusercontent.com/u/69631?s=64&v=4",
    tags: ["crm", "sync", "integration"],
  },
  {
    id: "chart-pro",
    name: "Chart Pro 图表",
    description: "丰富可视化组件和图表主题，轻松构建分析看板。",
    version: "2.3.0",
    author: "DataViz Inc.",
    category: "可视化",
    installs: 9876,
    icon: "https://avatars.githubusercontent.com/u/317889?s=64&v=4",
    tags: ["chart", "visualization"],
  },
  {
    id: "data-export",
    name: "数据导出工具",
    description: "支持多种格式的数据导出，包括 Excel、CSV、PDF 等。",
    version: "1.2.1",
    author: "DataTools",
    category: "数据",
    installs: 8765,
    icon: "https://avatars.githubusercontent.com/u/1024025?s=64&v=4",
    tags: ["export", "data", "excel"],
  },
  {
    id: "ai-assistant",
    name: "AI 智能助手",
    description: "集成多种 AI 模型，提供智能问答和内容生成功能。",
    version: "2.1.0",
    author: "AI Labs",
    category: "AI",
    installs: 15432,
    icon: "https://avatars.githubusercontent.com/u/583231?s=64&v=4",
    tags: ["ai", "assistant", "gpt"],
  },
  {
    id: "notification-center",
    name: "通知中心",
    description: "统一管理系统通知，支持邮件、短信、推送等多种方式。",
    version: "1.0.5",
    author: "NotifyHub",
    category: "集成",
    installs: 6543,
    icon: "https://avatars.githubusercontent.com/u/872147?s=64&v=4",
    tags: ["notification", "email", "sms"],
  },
  {
    id: "dashboard-builder",
    name: "仪表板构建器",
    description: "拖拽式仪表板构建工具，快速创建数据可视化面板。",
    version: "3.0.1",
    author: "DashCorp",
    category: "可视化",
    installs: 11234,
    icon: "https://avatars.githubusercontent.com/u/1342004?s=64&v=4",
    tags: ["dashboard", "builder", "drag-drop"],
  },
  {
    id: "api-tester",
    name: "API 测试工具",
    description: "内置 API 测试工具，支持 REST、GraphQL 等接口测试。",
    version: "1.3.2",
    author: "DevTools Inc",
    category: "开发者工具",
    installs: 4321,
    icon: "https://avatars.githubusercontent.com/u/1024025?s=64&v=4",
    tags: ["api", "testing", "rest"],
  },
  {
    id: "backup-manager",
    name: "备份管理器",
    description: "自动化数据备份和恢复，支持多种存储方式。",
    version: "2.0.3",
    author: "BackupPro",
    category: "数据",
    installs: 7890,
    icon: "https://avatars.githubusercontent.com/u/9919?s=64&v=4",
    tags: ["backup", "restore", "data"],
  },
  {
    id: "theme-customizer",
    name: "主题定制器",
    description: "可视化主题定制工具，轻松创建个性化界面风格。",
    version: "1.1.0",
    author: "ThemeStudio",
    category: "开发者工具",
    installs: 3456,
    icon: "https://avatars.githubusercontent.com/u/317889?s=64&v=4",
    tags: ["theme", "customizer", "ui"],
  },
  {
    id: "log-analyzer",
    name: "日志分析器",
    description: "智能日志分析和监控，快速定位系统问题。",
    version: "1.5.1",
    author: "LogTech",
    category: "开发者工具",
    installs: 5678,
    icon: "https://avatars.githubusercontent.com/u/583231?s=64&v=4",
    tags: ["log", "analyzer", "monitoring"],
  },
  {
    id: "payment-gateway",
    name: "支付网关",
    description: "集成多种支付方式，支持微信、支付宝、银联等。",
    version: "2.2.0",
    author: "PaymentHub",
    category: "集成",
    installs: 9012,
    icon: "https://avatars.githubusercontent.com/u/872147?s=64&v=4",
    tags: ["payment", "gateway", "wechat"],
  },
]);

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
    return hitQ && hitC;
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
watch([q, category, sort], () => {
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

function refresh() {
  // TODO: 接入后端获取插件列表
}

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
</script>
