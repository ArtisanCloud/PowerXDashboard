<script setup lang="ts">
import PluginWebView from "@/components/PluginWebView.vue";

const route = useRoute();
const rest = Array.isArray(route.params.rest)
  ? route.params.rest.join("/")
  : (route.params.rest as string);

const base = `/__up/_p/${route.params.pluginId}/admin`;
const src = `${base}/${rest}`; // 这里手动拼上 /rest
</script>

<template>
  <PluginWebView :src="src" />
</template>
