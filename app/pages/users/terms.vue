<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20"
  >
    <!-- 背景装饰 -->
    <div class="absolute inset-0 overflow-hidden">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 dark:bg-yellow-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-2000"
      ></div>
      <div
        class="absolute top-40 left-40 w-80 h-80 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-4000"
      ></div>
    </div>

    <div class="relative z-10 container mx-auto px-4 py-8">
      <!-- 头部导航 -->
      <div class="flex items-center justify-between mb-8">
        <NuxtLink
          to="/users/register"
          class="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" />
          <span>返回注册</span>
        </NuxtLink>

        <ThemeSwitcher />
      </div>

      <!-- 主要内容 -->
      <div class="max-w-4xl mx-auto">
        <div
          class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
        >
          <!-- 标题区域 -->
          <div
            class="bg-gradient-to-r from-primary-500 to-purple-600 px-8 py-6"
          >
            <h1 class="text-3xl font-bold text-white mb-2">服务条款</h1>
            <p class="text-primary-100">
              最后更新时间：{{ new Date().toLocaleDateString("zh-CN") }}
            </p>
          </div>

          <!-- 内容区域 -->
          <div class="px-8 py-6 space-y-8">
            <!-- 欢迎语 -->
            <div class="prose dark:prose-invert max-w-none">
              <p
                class="text-lg text-gray-600 dark:text-gray-300 leading-relaxed"
              >
                欢迎使用我们的服务！请仔细阅读以下服务条款，这些条款构成您与我们之间具有法律约束力的协议。
              </p>
            </div>

            <!-- 条款内容 -->
            <div class="space-y-6">
              <section>
                <h2
                  class="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center"
                >
                  <UIcon
                    name="i-heroicons-document-text"
                    class="w-6 h-6 mr-2 text-primary-500"
                  />
                  1. 服务说明
                </h2>
                <div
                  class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 space-y-3"
                >
                  <p class="text-gray-700 dark:text-gray-300">
                    我们提供的服务包括但不限于用户管理、数据分析、工作流程管理等功能。我们保留随时修改、暂停或终止服务的权利。
                  </p>
                  <p class="text-gray-700 dark:text-gray-300">
                    服务的可用性可能会因维护、升级或其他技术原因而受到影响，我们将尽力提前通知用户。
                  </p>
                </div>
              </section>

              <section>
                <h2
                  class="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center"
                >
                  <UIcon
                    name="i-heroicons-user-circle"
                    class="w-6 h-6 mr-2 text-primary-500"
                  />
                  2. 用户责任
                </h2>
                <div
                  class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 space-y-3"
                >
                  <ul
                    class="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300"
                  >
                    <li>您必须提供准确、完整的注册信息</li>
                    <li>您有责任保护您的账户安全，包括密码的保密</li>
                    <li>您不得使用服务进行任何非法或未经授权的活动</li>
                    <li>您不得干扰或破坏服务的正常运行</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2
                  class="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center"
                >
                  <UIcon
                    name="i-heroicons-shield-check"
                    class="w-6 h-6 mr-2 text-primary-500"
                  />
                  3. 数据保护
                </h2>
                <div
                  class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 space-y-3"
                >
                  <p class="text-gray-700 dark:text-gray-300">
                    我们承诺保护您的个人数据安全，采用行业标准的安全措施来防止数据泄露、丢失或滥用。
                  </p>
                  <p class="text-gray-700 dark:text-gray-300">
                    我们不会在未经您同意的情况下向第三方出售、交易或转让您的个人信息。
                  </p>
                </div>
              </section>

              <section>
                <h2
                  class="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center"
                >
                  <UIcon
                    name="i-heroicons-exclamation-triangle"
                    class="w-6 h-6 mr-2 text-primary-500"
                  />
                  4. 免责声明
                </h2>
                <div
                  class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 space-y-3"
                >
                  <p class="text-gray-700 dark:text-gray-300">
                    我们的服务按"现状"提供，不提供任何明示或暗示的保证。我们不对服务的可用性、准确性或完整性承担责任。
                  </p>
                  <p class="text-gray-700 dark:text-gray-300">
                    在法律允许的最大范围内，我们不对因使用或无法使用服务而产生的任何直接、间接、偶然或后果性损害承担责任。
                  </p>
                </div>
              </section>

              <section>
                <h2
                  class="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center"
                >
                  <UIcon
                    name="i-heroicons-scale"
                    class="w-6 h-6 mr-2 text-primary-500"
                  />
                  5. 争议解决
                </h2>
                <div
                  class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 space-y-3"
                >
                  <p class="text-gray-700 dark:text-gray-300">
                    本协议受中华人民共和国法律管辖。任何争议应首先通过友好协商解决。
                  </p>
                  <p class="text-gray-700 dark:text-gray-300">
                    如协商不成，争议应提交至我们所在地的人民法院解决。
                  </p>
                </div>
              </section>

              <section>
                <h2
                  class="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center"
                >
                  <UIcon
                    name="i-heroicons-pencil-square"
                    class="w-6 h-6 mr-2 text-primary-500"
                  />
                  6. 条款修改
                </h2>
                <div
                  class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 space-y-3"
                >
                  <p class="text-gray-700 dark:text-gray-300">
                    我们保留随时修改这些条款的权利。重大修改将通过网站公告或电子邮件通知用户。
                  </p>
                  <p class="text-gray-700 dark:text-gray-300">
                    继续使用服务即表示您接受修改后的条款。
                  </p>
                </div>
              </section>
            </div>

            <!-- 联系信息 -->
            <div
              class="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-primary-200 dark:border-primary-700"
            >
              <h3
                class="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center"
              >
                <UIcon
                  name="i-heroicons-envelope"
                  class="w-5 h-5 mr-2 text-primary-500"
                />
                联系我们
              </h3>
              <p class="text-gray-700 dark:text-gray-300">
                如果您对这些条款有任何疑问，请通过以下方式联系我们：
              </p>
              <div
                class="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400"
              >
                <p>邮箱：legal@example.com</p>
                <p>电话：400-123-4567</p>
                <p>地址：北京市朝阳区示例大厦123号</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 页面元数据
definePageMeta({
  layout: false, // 禁用layout
  title: "服务条款",
  description: "查看我们的服务条款和使用协议",
});

// SEO 设置
useSeoMeta({
  title: "服务条款",
  description: "查看我们的服务条款和使用协议，了解您的权利和义务。",
  ogTitle: "服务条款",
  ogDescription: "查看我们的服务条款和使用协议，了解您的权利和义务。",
});
</script>

<style scoped>
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.prose {
  max-width: none;
}

.prose p {
  margin-bottom: 1rem;
}

.prose ul {
  margin-bottom: 1rem;
}

.prose li {
  margin-bottom: 0.5rem;
}
</style>
