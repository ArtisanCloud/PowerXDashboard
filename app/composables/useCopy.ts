// ~/composables/useCopy.ts
import { ref } from "vue";
import { useToast } from "#imports"; // ✅ 正确方式：直接从 #imports 拿

type CopyOptions = {
  showToast?: boolean;
  successText?: string;
  failText?: string;
};

export function useCopy(defaultOptions: CopyOptions = { showToast: true }) {
  const copying = ref(false);
  const lastText = ref<string | null>(null);
  const toast = useToast(); // @nuxt/ui 的 toast 管理器

  const notify = (ok: boolean, text?: string, opts?: CopyOptions) => {
    const merged = { ...defaultOptions, ...opts };
    if (!merged.showToast) return;
    // 仅在客户端弹 toast，避免 SSR 触发
    if (process.server) return;
    toast.add({
      title: ok
        ? (merged.successText ?? "已复制")
        : (merged.failText ?? "复制失败"),
      description: text,
      icon: ok ? "i-heroicons-clipboard" : "i-heroicons-exclamation-triangle",
      color: ok ? undefined : "red",
    });
  };

  const copy = async (text: string, opts?: CopyOptions) => {
    copying.value = true;
    lastText.value = text;
    try {
      // 优先 Clipboard API（仅安全上下文）
      if (
        process.client &&
        window.isSecureContext &&
        navigator.clipboard?.writeText
      ) {
        await navigator.clipboard.writeText(text);
        notify(true, text, opts);
        return true;
      }
      // 降级方案：隐藏 textarea
      if (process.client) {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.top = "-9999px";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand?.("copy");
        document.body.removeChild(ta);
        if (ok) {
          notify(true, text, opts);
          return true;
        }
      }
      throw new Error("Clipboard not supported");
    } catch (e) {
      console.error("[useCopy] copy failed:", e);
      notify(false, text, opts);
      return false;
    } finally {
      copying.value = false;
    }
  };

  return { copy, copying, lastText };
}
