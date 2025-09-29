<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";

type TrustLevel = "trusted" | "untrusted";

const props = withDefaults(
  defineProps<{
    src: string | { href: string } // e.g. /__up/_p/com.powerx.demo.hello_world/admin/
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

// 从 nuxt.config.ts -> runtimeConfig.public.upstream 读取后端基址
// 例如 export default { runtimeConfig: { public: { upstream: process.env.POWERX_BACKEND || 'http://127.0.0.1:8077' } } }
const { public: { upstream = 'http://127.0.0.1:8077' } } = useRuntimeConfig()

watchEffect(() => {
  console.log('[PXAdmin][WebView] src =', props.src)
})

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

const cleanSrc = computed(() => {
  const raw = typeof props.src === 'string' ? props.src : props.src?.href || '/'

  try {
    // 1) 相对路径 → 以后端 upstream 为基准；绝对路径 → 原样解析
    const u = (raw.startsWith('http://') || raw.startsWith('https://'))
      ? new URL(raw)
      : new URL(raw, upstream)     // 关键：用后端域名做基准，而不是 3030

    // 2) /admin 强制补尾斜杠
    u.pathname = u.pathname.replace(/\/admin(?!\/)/, '/admin/')

    // 3) 清理可能出现的重复斜杠（不影响协议头部）
    u.pathname = u.pathname.replace(/\/{2,}/g, '/')

    const full = u.toString()
    // if (full !== raw) console.warn('[WebView] src normalized:', { from: raw, to: full })
    console.log('[WebView] absolute src =', full) // 现在会打印出带 host 的完整地址
    return full
  } catch (e) {
    console.warn('[WebView] bad src:', raw, e)
    return raw
  }
})

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
      :src="cleanSrc"
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
