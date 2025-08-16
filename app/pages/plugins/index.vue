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
          :options="categoryOptions"
          icon="i-heroicons-squares-2x2"
        />
        <USelect
          v-model="sort"
          :options="sortOptions"
          icon="i-heroicons-adjustments-vertical"
        />
      </div>
    </div>

    <!-- 列表区 -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <PluginCard
        v-for="p in filtered"
        :key="p.id"
        :plugin="p"
        @install="openInstall(p)"
      />
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

const q = ref("");
const category = ref("全部分类");
const sort = ref("默认排序");

const categoryOptions = [
  "全部分类",
  "数据",
  "AI",
  "可视化",
  "集成",
  "开发者工具",
];
const sortOptions = ["默认排序", "安装量", "更新时间", "名称"];

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
]);

const filtered = computed(() => {
  const list = all.value.filter((p) => {
    const hitQ =
      !q.value ||
      p.name.toLowerCase().includes(q.value.toLowerCase()) ||
      p.description.toLowerCase().includes(q.value.toLowerCase()) ||
      p.author.toLowerCase().includes(q.value.toLowerCase());
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
