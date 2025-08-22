<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";

type TrustLevel = "trusted" | "untrusted";

const props = withDefaults(
  defineProps<{
    src: string; // e.g. /__up/_p/com.powerx.demo.hello_world/admin/
    trust?: TrustLevel; // 'trusted' => 同域测量; 'untrusted' => 强沙箱（不可测量）
    min?: number; // 最小高度 px
    max?: number; // 最大高度 px
    viewOffset?: number; // 视口高度模式减去的顶部/头部高度(px)
    title?: string;
  }>(),
  {
    trust: "trusted",
    min: 400,
    max: 4096,
    viewOffset: 0,
  }
);

/**
 * 可信模式：
 *  - sandbox 允许 same-origin，父页可读 iframe 文档，做自适应
 * 不可信模式：
 *  - 去掉 same-origin，无法读内部文档，降级为“填满视口”，iframe 自身滚动
 */
const sandbox = computed(() =>
  props.trust === "trusted"
    ? "allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
    : "allow-scripts allow-forms allow-popups allow-downloads"
);

const iframeRef = ref<HTMLIFrameElement | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const height = ref<number>(props.min);
const canMeasure = ref<boolean>(false); // 是否能同域测量
let ro: ResizeObserver | null = null;
let pollTimer: ReturnType<typeof setInterval> | null = null;

function clamp(h: number) {
  return Math.max(props.min, Math.min(props.max, h));
}

/** 视口填充（降级方案）：用 100vh 减去可选偏移 */
function applyViewportFill() {
  const vh = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0
  );
  height.value = clamp(vh - (props.viewOffset || 0));
}

/** 同域测量：读取 iframe 内文档高度 */
function measureOnce() {
  if (!iframeRef.value) return;
  try {
    const win = iframeRef.value.contentWindow;
    const doc = win?.document;
    if (!win || !doc) throw new Error("no access");

    // 访问成功 => 确认是可测量
    canMeasure.value = true;

    const b = doc.body;
    const e = doc.documentElement;

    // 取多组高度的最大值，避免某些布局遗漏
    const h = Math.max(
      b.scrollHeight,
      e.scrollHeight,
      b.offsetHeight,
      e.offsetHeight,
      b.clientHeight,
      e.clientHeight
    );

    // 若页面有 sticky 头/懒加载，滚动高度会变；所以要持续监听（下面 setObservers 会做）
    height.value = clamp(h || props.min);
  } catch {
    // 跨域/被 CSP 限制等 => 降级
    canMeasure.value = false;
    applyViewportFill();
  }
}

/** 持续观察：同域时用 ResizeObserver + 兜底轮询 */
function setObservers() {
  clearObservers();

  if (!canMeasure.value) {
    // 跨域降级：监听窗口尺寸变化，更新视口填充高度
    window.addEventListener("resize", applyViewportFill);
    applyViewportFill();
    return;
  }

  try {
    const doc = iframeRef.value!.contentWindow!.document;
    ro = new ResizeObserver(() => measureOnce());
    ro.observe(doc.documentElement);
    ro.observe(doc.body);

    // 兜底：某些渲染变化不触发 ResizeObserver，定时再测一次
    pollTimer = setInterval(measureOnce, 800);
  } catch {
    // 任何异常都降级
    canMeasure.value = false;
    applyViewportFill();
  }
}

function clearObservers() {
  if (ro) {
    try {
      ro.disconnect();
    } catch {}
    ro = null;
  }
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
  window.removeEventListener("resize", applyViewportFill);
}

function onLoad() {
  loading.value = false;
  error.value = null;
  measureOnce();
  setObservers();
}

function onError() {
  loading.value = false;
  error.value = "插件页面加载失败";
  // 出错也给个可用高度，避免空白
  applyViewportFill();
}

onMounted(() => {
  // 初始给个可用高度
  applyViewportFill();
});

onBeforeUnmount(() => {
  clearObservers();
});

// 如果 src 变了，重新测量
watch(
  () => props.src,
  () => {
    loading.value = true;
    error.value = null;
    clearObservers();
  }
);
</script>

<template>
  <div class="w-full">
    <div
      v-if="loading"
      class="w-full h-40 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700"
    />
    <div
      v-if="error"
      class="text-red-600 dark:text-red-400 text-sm my-2 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg"
    >
      {{ error }}
    </div>

    <!-- :sandbox="sandbox" -->
    <iframe
      ref="iframeRef"
      :src="src"
      :title="title || 'Plugin WebView'"
      allow="clipboard-read *; clipboard-write *; fullscreen *"
      referrerpolicy="strict-origin-when-cross-origin"
      class="block w-full border-0 bg-transparent rounded-lg transition-[height] duration-300"
      :style="{ height: height + 'px' }"
      @load="onLoad"
      @error="onError"
    />
  </div>
</template>
