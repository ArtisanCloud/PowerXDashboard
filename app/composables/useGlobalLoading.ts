// 全局可见性由两部分决定：自动(路由/请求) OR 手动(show/lock)
// 手动优先，只要处于锁屏/手动展示，就一直显示

type ShowOptions = {
  lock?: boolean; // 显示时是否上锁（禁止任何交互）
  minMs?: number; // 最小展示时长，避免闪烁
  message?: string; // 展示文案
};

export const useGL_AutoVisible = () =>
  useState<boolean>("gl:autoVisible", () => false);
export const useGL_ManualVisible = () =>
  useState<boolean>("gl:manualVisible", () => false);
export const useGL_LockCount = () => useState<number>("gl:lockCount", () => 0);
export const useGL_Message = () =>
  useState<string>("gl:message", () => "加载中…");

// 供插件更新的计数（仅内部用）
export const useGL_NavPending = () =>
  useState<boolean>("gl:navPending", () => false);
export const useGL_ReqPending = () =>
  useState<number>("gl:reqPending", () => 0);

let minHideTimer: ReturnType<typeof setTimeout> | null = null;
let minHideAt = 0;

export function useGlobalLoading() {
  const autoVisible = useGL_AutoVisible();
  const manualVisible = useGL_ManualVisible();
  const lockCount = useGL_LockCount();
  const message = useGL_Message();

  const visible = computed(
    () => manualVisible.value || autoVisible.value || lockCount.value > 0
  );

  function setMessage(msg: string) {
    message.value = msg;
  }

  function show(opts: ShowOptions = {}) {
    if (opts.message) message.value = opts.message;
    manualVisible.value = true;
    if (opts.lock) lock();
    if (opts.minMs && opts.minMs > 0) {
      minHideAt = Date.now() + opts.minMs;
      if (minHideTimer) clearTimeout(minHideTimer);
      minHideTimer = null;
    }
  }

  function hide() {
    const remaining = minHideAt - Date.now();
    const doHide = () => {
      manualVisible.value = false;
    };
    if (remaining > 0) {
      if (minHideTimer) clearTimeout(minHideTimer);
      minHideTimer = setTimeout(() => {
        minHideTimer = null;
        doHide();
      }, remaining);
    } else {
      doHide();
    }
  }

  function lock() {
    lockCount.value++;
  }
  function unlock() {
    lockCount.value = Math.max(0, lockCount.value - 1);
  }

  return { visible, message, show, hide, lock, unlock, setMessage };
}
