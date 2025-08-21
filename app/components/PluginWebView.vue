<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue";

const props = defineProps<{
  src: string; // 例如 "/_p/com.powerx.demo.hello_world/admin/"
  class?: string;
}>();

const iframeRef = ref<HTMLIFrameElement | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const height = ref<number>(800);

function onMessage(e: MessageEvent) {
  // 约定消息格式：{ type: 'PLUGIN_WEBVIEW_RESIZE', height: number }
  const data = e.data;
  if (
    data &&
    data.type === "PLUGIN_WEBVIEW_RESIZE" &&
    typeof data.height === "number"
  ) {
    height.value = Math.max(400, Math.min(2400, data.height));
  }
}

onMounted(() => {
  window.addEventListener("message", onMessage);
});

onBeforeUnmount(() => {
  window.removeEventListener("message", onMessage);
});

function onLoad() {
  loading.value = false;
  error.value = null;
}

function onError() {
  loading.value = false;
  error.value = "插件页面加载失败";
}
</script>

<template>
  <div class="w-full" :class="props.class">
    <!-- 加载状态 -->
    <div
      v-if="loading"
      class="w-full h-40 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700"
    />

    <!-- 错误状态 -->
    <div
      v-if="error"
      class="text-red-600 dark:text-red-400 text-sm my-2 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg"
    >
      {{ error }}
    </div>

    <!-- iframe 容器 -->
    <iframe
      ref="iframeRef"
      :src="src"
      :style="{
        width: '100%',
        border: '0',
        height: height + 'px',
        borderRadius: '8px',
        backgroundColor: 'white',
      }"
      @load="onLoad"
      @error="onError"
      allow="fullscreen; clipboard-read; clipboard-write"
      sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
      class="transition-all duration-300"
    />
  </div>
</template>

<style scoped>
/* 确保 iframe 在暗色模式下也有合适的背景 */
.dark iframe {
  background-color: rgb(17 24 39); /* gray-900 */
}
</style>
