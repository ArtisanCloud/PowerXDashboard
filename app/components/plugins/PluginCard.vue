<template>
  <div
    class="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] overflow-hidden flex flex-col"
  >
    <div class="p-4 flex items-start gap-3">
      <img
        v-if="plugin.icon"
        :src="plugin.icon"
        alt=""
        class="w-10 h-10 rounded-md object-cover"
      />
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <h3 class="font-medium text-[var(--text-primary)] truncate">
            {{ plugin.name }}
          </h3>
          <UBadge color="neutral" variant="soft" size="xs">{{
            plugin.version
          }}</UBadge>
        </div>
        <p class="text-sm text-[var(--text-secondary)] line-clamp-2 mt-1">
          {{ plugin.description }}
        </p>
        <div
          class="flex items-center gap-3 text-xs text-[var(--text-secondary)] mt-2"
        >
          <span>作者：{{ plugin.author }}</span>
          <span>分类：{{ plugin.category }}</span>
          <span>安装量：{{ formatCount(plugin.installs) }}</span>
        </div>
      </div>
    </div>
    <div
      class="px-4 py-3 border-t border-[var(--border-color)] flex items-center justify-between"
    >
      <div class="flex items-center gap-2">
        <UBadge v-for="t in plugin.tags" :key="t" variant="soft" size="xs">{{
          t
        }}</UBadge>
      </div>
      <div class="flex items-center gap-2">
        <UButton
          size="xs"
          variant="ghost"
          :to="`/plugins/${plugin.id}`"
          icon="i-heroicons-eye"
        >
          详情
        </UButton>
        <UButton
          size="xs"
          color="primary"
          icon="i-heroicons-arrow-down-tray"
          @click="$emit('install', plugin)"
        >
          安装
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export type MarketplacePlugin = {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  category: string;
  installs: number;
  icon?: string;
  tags: string[];
};

defineProps<{
  plugin: MarketplacePlugin;
}>();

const emit = defineEmits<{
  (e: "install", plugin: MarketplacePlugin): void;
}>();

function formatCount(n: number) {
  if (n >= 10000) return (n / 10000).toFixed(1) + "w";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return String(n);
}
</script>
