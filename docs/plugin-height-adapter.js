/**
 * 插件页面高度自适应脚本
 * 将此脚本添加到插件 admin 页面的基础布局中，实现自动高度调整
 */
(function () {
  "use strict";

  // 发送高度信息给父窗口
  function postHeight() {
    try {
      // 获取页面实际高度
      const bodyHeight = document.body.scrollHeight || 0;
      const documentHeight = document.documentElement.scrollHeight || 0;
      const windowHeight = window.innerHeight || 0;

      // 取最大值，但至少 400px
      const height = Math.max(400, bodyHeight, documentHeight, windowHeight);

      // 发送消息给父窗口
      window.parent.postMessage(
        {
          type: "PLUGIN_WEBVIEW_RESIZE",
          height: height,
          timestamp: Date.now(),
        },
        "*"
      );

      console.log(`[插件高度适配] 发送高度: ${height}px`);
    } catch (error) {
      console.warn("[插件高度适配] 发送高度失败:", error);
    }
  }

  // 防抖函数
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // 防抖的高度发送函数
  const debouncedPostHeight = debounce(postHeight, 100);

  // 页面加载完成后发送初始高度
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", postHeight);
  } else {
    postHeight();
  }

  // 窗口大小变化时更新高度
  window.addEventListener("resize", debouncedPostHeight);

  // 使用 ResizeObserver 监听 body 尺寸变化
  if (window.ResizeObserver) {
    const resizeObserver = new ResizeObserver(debouncedPostHeight);
    resizeObserver.observe(document.body);

    // 也监听 documentElement，以防某些情况下 body 高度不准确
    if (document.documentElement !== document.body) {
      resizeObserver.observe(document.documentElement);
    }
  }

  // 使用 MutationObserver 监听 DOM 变化（如动态内容加载）
  if (window.MutationObserver) {
    const mutationObserver = new MutationObserver(debouncedPostHeight);
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });
  }

  // 监听图片加载完成
  document.addEventListener("load", debouncedPostHeight, true);

  // 监听字体加载完成（如果支持）
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(debouncedPostHeight);
  }

  // 定期检查高度变化（兜底方案）
  let lastHeight = 0;
  setInterval(() => {
    const currentHeight = Math.max(
      document.body.scrollHeight || 0,
      document.documentElement.scrollHeight || 0,
      window.innerHeight || 0
    );

    if (Math.abs(currentHeight - lastHeight) > 10) {
      lastHeight = currentHeight;
      postHeight();
    }
  }, 1000);

  console.log("[插件高度适配] 脚本已加载");
})();
