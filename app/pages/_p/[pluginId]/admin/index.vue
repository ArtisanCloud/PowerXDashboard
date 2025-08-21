<script setup lang="ts">
// app/pages/_p/[pluginId]/admin/index.vue

import PluginWebView from "@/components/PluginWebView.vue";
defineI18nRoute({ localized: false });

const route = useRoute();
const runtime = useRuntimeConfig();

// 方案B：同域代理（你已经配置了 /__up/_p/）
const src = `/__up/_p/${route.params.pluginId}/admin`;

// 若想直连后端：
// const src = `${runtime.public.upstream}/_p/${route.params.pluginId}/admin/`
</script>

<template>
  <PluginWebView :src="src" />
</template>
