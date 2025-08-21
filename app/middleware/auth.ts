/**
 * 认证中间件
 * 保护需要登录的页面
 */
export default defineNuxtRouteMiddleware((to, from) => {
  // 只在客户端执行
  if (process.server) return;

  const isTokenExpired = (): boolean => {
    const expiresAt = localStorage.getItem("expires_at");
    if (!expiresAt) return true;
    return Date.now() > parseInt(expiresAt);
  };

  const token = localStorage.getItem("access_token");

  // 如果没有token或token已过期，重定向到登录页
  if (!token || isTokenExpired()) {
    // 清除过期的认证信息
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token_type");
    localStorage.removeItem("expires_in");
    localStorage.removeItem("expires_at");

    // 重定向到登录页，并保存当前页面用于登录后跳转
    const currentPath = to.fullPath;
    if (currentPath !== "/users/login") {
      return navigateTo(
        `/users/login?redirect=${encodeURIComponent(currentPath)}`
      );
    }
  }
});
