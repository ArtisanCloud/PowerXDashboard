<script setup lang="ts">
// app/pages/_p/[pluginId]/admin/[[...rest]].vue

import PluginWebView from "@/components/PluginWebView.vue";

// ✅ 关键：这页不做 i18n 路由本地化（不加 /zh 前缀等），路径保持 /_p/...
defineI18nRoute({ localized: false });

const router = useRouter();
onMounted(() => {
  console.log(
    "所有路由：",
    router.getRoutes().map((r) => r.path)
  );
});

const route = useRoute();
const rest = Array.isArray(route.params.rest)
  ? route.params.rest.join("/")
  : route.params.rest || "";

// 推荐用“同域代理”前缀，或用后端绝对地址都行（两种二选一：保留其一）
const runtime = useRuntimeConfig();
// 方案B（代理前缀）：nuxt.config.ts 里配置了 /__up/_p/ 代理到后端 _p 目录
const src = `/__up/_p/${route.params.pluginId}/admin/${rest}`;
// 方案A（直连后端）：
// const src = `${runtime.public.upstream}/_p/${route.params.pluginId}/admin/${rest}`
</script>

<template>
  123321
  <PluginWebView :src="src" />
</template>
