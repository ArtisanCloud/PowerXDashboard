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
          <div class="bg-gradient-to-r from-green-500 to-blue-600 px-8 py-6">
            <h1 class="text-3xl font-bold text-white mb-2">隐私政策</h1>
            <p class="text-green-100">
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
                我们非常重视您的隐私保护。本隐私政策详细说明了我们如何收集、使用、存储和保护您的个人信息。
              </p>
            </div>

            <!-- 隐私政策内容 -->
            <div class="space-y-6">
              <section>
                <h2
                  class="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center"
                >
                  <UIcon
                    name="i-heroicons-information-circle"
                    class="w-6 h-6 mr-2 text-green-500"
                  />
                  1. 信息收集
                </h2>
                <div
                  class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 space-y-4"
                >
                  <div>
                    <h4
                      class="font-semibold text-gray-900 dark:text-white mb-2"
                    >
                      我们收集的信息类型：
                    </h4>
                    <ul
                      class="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300"
                    >
                      <li>
                        <strong>账户信息：</strong
                        >用户名、邮箱地址、密码（加密存储）
                      </li>
                      <li>
                        <strong>个人资料：</strong
                        >姓名、头像、联系方式等您主动提供的信息
                      </li>
                      <li>
                        <strong>使用数据：</strong>登录时间、操作记录、偏好设置
                      </li>
                      <li>
                        <strong>技术信息：</strong
                        >IP地址、浏览器类型、设备信息、操作系统
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4
                      class="font-semibold text-gray-900 dark:text-white mb-2"
                    >
                      信息收集方式：
                    </h4>
                    <ul
                      class="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300"
                    >
                      <li>您直接向我们提供的信息</li>
                      <li>通过Cookies和类似技术自动收集</li>
                      <li>通过第三方服务（如社交媒体登录）获得</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2
                  class="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center"
                >
                  <UIcon
                    name="i-heroicons-cog-6-tooth"
                    class="w-6 h-6 mr-2 text-green-500"
                  />
                  2. 信息使用
                </h2>
                <div
                  class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 space-y-3"
                >
                  <p class="text-gray-700 dark:text-gray-300 font-semibold">
                    我们使用您的信息用于：
                  </p>
                  <ul
                    class="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300"
                  >
                    <li>提供、维护和改进我们的服务</li>
                    <li>处理您的请求和交易</li>
                    <li>发送重要通知和更新</li>
                    <li>个性化您的用户体验</li>
                    <li>分析服务使用情况以改进功能</li>
                    <li>防止欺诈和确保安全</li>
                    <li>遵守法律法规要求</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2
                  class="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center"
                >
                  <UIcon
                    name="i-heroicons-share"
                    class="w-6 h-6 mr-2 text-green-500"
                  />
                  3. 信息共享
                </h2>
                <div
                  class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 space-y-4"
                >
                  <p class="text-gray-700 dark:text-gray-300">
                    我们不会出售您的个人信息。我们只在以下情况下共享您的信息：
                  </p>
                  <ul
                    class="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300"
                  >
                    <li><strong>经您同意：</strong>在获得您明确同意的情况下</li>
                    <li>
                      <strong>服务提供商：</strong
                      >与帮助我们运营服务的可信第三方
                    </li>
                    <li>
                      <strong>法律要求：</strong
                      >根据法律法规、法院命令或政府要求
                    </li>
                    <li>
                      <strong>安全保护：</strong
                      >为保护我们或他人的权利、财产或安全
                    </li>
                    <li>
                      <strong>业务转让：</strong>在合并、收购或资产出售的情况下
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2
                  class="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center"
                >
                  <UIcon
                    name="i-heroicons-lock-closed"
                    class="w-6 h-6 mr-2 text-green-500"
                  />
                  4. 数据安全
                </h2>
                <div
                  class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 space-y-4"
                >
                  <p class="text-gray-700 dark:text-gray-300">
                    我们采用多层安全措施保护您的个人信息：
                  </p>
                  <div class="grid md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                      <h4 class="font-semibold text-gray-900 dark:text-white">
                        技术保护措施：
                      </h4>
                      <ul
                        class="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300"
                      >
                        <li>SSL/TLS加密传输</li>
                        <li>数据库加密存储</li>
                        <li>访问控制和身份验证</li>
                        <li>定期安全审计</li>
                      </ul>
                    </div>
                    <div class="space-y-2">
                      <h4 class="font-semibold text-gray-900 dark:text-white">
                        管理保护措施：
                      </h4>
                      <ul
                        class="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300"
                      >
                        <li>员工安全培训</li>
                        <li>最小权限原则</li>
                        <li>数据访问日志记录</li>
                        <li>应急响应计划</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2
                  class="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center"
                >
                  <UIcon
                    name="i-heroicons-clock"
                    class="w-6 h-6 mr-2 text-green-500"
                  />
                  5. 数据保留
                </h2>
                <div
                  class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 space-y-3"
                >
                  <p class="text-gray-700 dark:text-gray-300">
                    我们只在必要的时间内保留您的个人信息：
                  </p>
                  <ul
                    class="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300"
                  >
                    <li>
                      <strong>账户信息：</strong>在您的账户处于活跃状态期间
                    </li>
                    <li>
                      <strong>使用数据：</strong>通常保留12个月用于分析和改进
                    </li>
                    <li>
                      <strong>法律要求：</strong>根据适用法律要求的保留期限
                    </li>
                    <li><strong>安全日志：</strong>保留6个月用于安全监控</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2
                  class="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center"
                >
                  <UIcon
                    name="i-heroicons-user-plus"
                    class="w-6 h-6 mr-2 text-green-500"
                  />
                  6. 您的权利
                </h2>
                <div
                  class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 space-y-4"
                >
                  <p class="text-gray-700 dark:text-gray-300">
                    根据适用的隐私法律，您享有以下权利：
                  </p>
                  <div class="grid md:grid-cols-2 gap-4">
                    <ul
                      class="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300"
                    >
                      <li>
                        <strong>访问权：</strong>查看我们持有的您的个人信息
                      </li>
                      <li><strong>更正权：</strong>更正不准确或不完整的信息</li>
                      <li><strong>删除权：</strong>要求删除您的个人信息</li>
                      <li><strong>限制权：</strong>限制对您信息的处理</li>
                    </ul>
                    <ul
                      class="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300"
                    >
                      <li><strong>携带权：</strong>以结构化格式获取您的数据</li>
                      <li><strong>反对权：</strong>反对某些类型的数据处理</li>
                      <li><strong>撤回同意：</strong>撤回之前给予的同意</li>
                      <li><strong>投诉权：</strong>向监管机构投诉</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2
                  class="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center"
                >
                  <UIcon
                    name="i-heroicons-globe-alt"
                    class="w-6 h-6 mr-2 text-green-500"
                  />
                  7. 国际传输
                </h2>
                <div
                  class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 space-y-3"
                >
                  <p class="text-gray-700 dark:text-gray-300">
                    您的信息可能会被传输到您所在国家/地区以外的地方进行处理。我们确保：
                  </p>
                  <ul
                    class="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300"
                  >
                    <li>所有国际传输都符合适用的数据保护法律</li>
                    <li>接收方提供充分的数据保护水平</li>
                    <li>采用适当的保护措施，如标准合同条款</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2
                  class="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center"
                >
                  <UIcon
                    name="i-heroicons-arrow-path"
                    class="w-6 h-6 mr-2 text-green-500"
                  />
                  8. 政策更新
                </h2>
                <div
                  class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 space-y-3"
                >
                  <p class="text-gray-700 dark:text-gray-300">
                    我们可能会不时更新本隐私政策。重大变更时，我们将：
                  </p>
                  <ul
                    class="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300"
                  >
                    <li>在网站上发布更新通知</li>
                    <li>通过电子邮件通知您（如适用）</li>
                    <li>在某些情况下，征求您的同意</li>
                  </ul>
                </div>
              </section>
            </div>

            <!-- 联系信息 -->
            <div
              class="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-green-200 dark:border-green-700"
            >
              <h3
                class="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center"
              >
                <UIcon
                  name="i-heroicons-envelope"
                  class="w-5 h-5 mr-2 text-green-500"
                />
                隐私问题联系
              </h3>
              <p class="text-gray-700 dark:text-gray-300 mb-3">
                如果您对我们的隐私做法有任何疑问或担忧，请联系我们的数据保护官：
              </p>
              <div class="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <p>数据保护官邮箱：privacy@example.com</p>
                <p>隐私热线：400-123-4567</p>
                <p>邮寄地址：北京市朝阳区示例大厦123号 数据保护部</p>
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
  title: "隐私政策",
  description: "了解我们如何收集、使用和保护您的个人信息",
});

// SEO 设置
useSeoMeta({
  title: "隐私政策",
  description: "了解我们如何收集、使用和保护您的个人信息",
  ogTitle: "隐私政策",
  ogDescription: "了解我们如何收集、使用和保护您的个人信息",
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
