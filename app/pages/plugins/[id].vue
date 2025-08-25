<template>
  <div class="space-y-6 p-4 sm:p-6">
    <div class="flex items-center justify-between">
      <div class="flex items-start gap-3">
        <img
          v-if="plugin?.icon"
          :src="plugin?.icon"
          alt=""
          class="w-12 h-12 rounded-md object-cover"
        />
        <div>
          <div class="text-xl font-semibold text-[var(--text-primary)]">
            {{ plugin?.name || "-" }}
          </div>
          <div class="text-sm text-[var(--text-secondary)]">
            版本 {{ plugin?.version || "-" }} · 作者
            {{ plugin?.author || "-" }} · 分类 {{ plugin?.category || "-" }}
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <UButton variant="ghost" icon="i-heroicons-arrow-left" :to="'/plugins'"
          >返回</UButton
        >
        <UButton
          color="primary"
          icon="i-heroicons-arrow-down-tray"
          @click="installOpen = true"
          >安装</UButton
        >
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <!-- 介绍 -->
        <div
          class="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] p-4"
        >
          <div class="font-medium text-[var(--text-primary)] mb-2">介绍</div>
          <p class="text-sm text-[var(--text-secondary)] whitespace-pre-wrap">
            {{ plugin?.description || "-" }}
          </p>
        </div>

        <!-- 版本变更/更新日志（示例） -->
        <div
          class="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] p-4"
        >
          <div class="font-medium text-[var(--text-primary)] mb-2">
            版本与更新
          </div>
          <ul
            class="list-disc list-inside text-sm text-[var(--text-secondary)] space-y-1"
          >
            <li>v{{ plugin?.version }} 修复若干问题，提升稳定性</li>
            <li>支持更多平台与模型适配</li>
            <li>优化文档与示例</li>
          </ul>
        </div>

        <!-- 权限声明（示例） -->
        <div
          class="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] p-4"
        >
          <div class="font-medium text-[var(--text-primary)] mb-2">权限</div>
          <div class="text-sm text-[var(--text-secondary)] space-y-1">
            <div>• 网络访问（请求外部 API）</div>
            <div>• 本地存储（读写插件数据）</div>
            <div>• 文件访问（读取/上传文件）</div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <!-- 侧边信息 -->
        <div
          class="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] p-4"
        >
          <div class="font-medium text-[var(--text-primary)] mb-3">
            统计与标签
          </div>
          <div class="text-sm text-[var(--text-secondary)]">
            安装量：{{ formatCount(plugin?.installs || 0) }}
          </div>
          <div class="mt-2 flex flex-wrap gap-2">
            <UBadge
              v-for="t in plugin?.tags || []"
              :key="t"
              variant="soft"
              size="xs"
              >{{ t }}</UBadge
            >
          </div>
        </div>

        <!-- 快速操作 -->
        <div
          class="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] p-4"
        >
          <div class="font-medium text-[var(--text-primary)] mb-3">操作</div>
          <div class="flex items-center gap-2">
            <UButton variant="ghost" icon="i-heroicons-eye">文档</UButton>
            <UButton variant="ghost" icon="i-heroicons-code-bracket"
              >示例</UButton
            >
          </div>
        </div>
      </div>
    </div>

    <!-- 安装对话框 -->
    <InstallDialog
      v-model="installOpen"
      :plugin="plugin"
      @installed="onInstalled"
    />
  </div>
</template>

<script setup lang="ts">
import InstallDialog from "~/components/plugins/InstallDialog.vue";
import type { MarketplacePlugin } from "~/components/plugins/PluginCard.vue";

definePageMeta({
  layout: "default",
});

const route = useRoute();

const db: Record<string, MarketplacePlugin> = {
  "workflow-tools": {
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
  "crm-sync": {
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
  "chart-pro": {
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
};

const id = computed(() => String(route.params.id || ""));
const plugin = computed<MarketplacePlugin | undefined>(() => db[id.value]);

const installOpen = ref(false);

function formatCount(n: number) {
  if (n >= 10000) return (n / 10000).toFixed(1) + "w";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return String(n);
}

function onInstalled(payload: { plugin: MarketplacePlugin; state: any }) {
  // TODO: 上报安装成功，刷新状态
  console.log("Installed:", payload);
}
</script>
