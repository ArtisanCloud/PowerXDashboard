export default defineNuxtRouteMiddleware((to) => {
  // 如果访问根路径，重定向到 /home
  if (to.path === '/') {
    return navigateTo('/home')
  }
})