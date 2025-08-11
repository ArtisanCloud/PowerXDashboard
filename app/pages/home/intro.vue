<script setup lang="ts">
definePageMeta({
  alias: ['/'],   // 让 /home 这个页面同时匹配 "/"
  layout: false   // 禁用layout
})

// 产品特性数据
const features = [
  {
    icon: '🚀',
    title: '高性能',
    description: '基于 Nuxt 4 构建，提供极致的性能体验'
  },
  {
    icon: '🎨',
    title: '现代设计',
    description: '采用最新的 UI 设计理念，界面简洁美观'
  },
  {
    icon: '🔧',
    title: '易于使用',
    description: '直观的操作界面，让管理变得更加简单'
  },
  {
    icon: '🛡️',
    title: '安全可靠',
    description: '企业级安全保障，数据安全有保证'
  }
]

// 产品信息
const products = [
  {
    name: 'PowerX Admin',
    description: '强大的后台管理系统，助力企业数字化转型',
    image: '/api/placeholder/300/200',
    features: ['用户管理', '权限控制', '数据分析', '系统监控']
  },
  {
    name: 'PowerX Analytics',
    description: '智能数据分析平台，洞察业务增长机会',
    image: '/api/placeholder/300/200',
    features: ['实时分析', '可视化报表', '预测模型', '自定义仪表板']
  },
  {
    name: 'PowerX Cloud',
    description: '云端解决方案，随时随地访问您的数据',
    image: '/api/placeholder/300/200',
    features: ['云端存储', '多端同步', '弹性扩展', '7x24支持']
  }
]
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <!-- 导航栏 -->
    <nav class="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PowerX
              </h1>
            </div>
          </div>
          
          <!-- 导航链接 -->
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              <a href="#features" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                特性
              </a>
              <a href="#products" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                产品
              </a>
              <a href="#about" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                关于
              </a>
            </div>
          </div>
          
          <!-- 登录注册按钮 -->
          <div class="flex items-center space-x-4">
            <UButton 
              variant="ghost" 
              @click="showLoginModal = true"
              class="text-gray-700 hover:text-blue-600"
            >
              登录
            </UButton>
            <UButton 
              @click="showRegisterModal = true"
              class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              注册
            </UButton>
          </div>
        </div>
      </div>
    </nav>

    <!-- 英雄区域 -->
    <section class="relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center">
          <!-- 欢迎语 -->
          <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            欢迎来到
            <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              PowerX
            </span>
          </h1>
          <p class="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            新一代企业级管理平台，让您的业务管理更加高效、智能、安全
          </p>
          
          <!-- CTA 按钮 -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <UButton 
              size="xl" 
              to="/register"
              class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 text-lg"
            >
              立即开始
            </UButton>
            <UButton 
              variant="outline" 
              size="xl"
              to="#products"
              class="px-8 py-4 text-lg border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600"
            >
              了解更多
            </UButton>
          </div>
          
          <!-- 头图 -->
          <div class="relative max-w-5xl mx-auto">
            <div class="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
              <div class="bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl h-96 flex items-center justify-center">
                <div class="text-center">
                  <div class="text-6xl mb-4">🚀</div>
                  <h3 class="text-2xl font-bold text-gray-800 mb-2">PowerX Dashboard</h3>
                  <p class="text-gray-600">现代化的管理界面预览</p>
                </div>
              </div>
            </div>
            <!-- 装饰元素 -->
            <div class="absolute -top-4 -left-4 w-24 h-24 bg-blue-200 rounded-full opacity-50 animate-pulse"></div>
            <div class="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-200 rounded-full opacity-50 animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- 特性区域 -->
    <section id="features" class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            为什么选择 PowerX？
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            我们提供最先进的技术和最贴心的服务，让您的业务管理事半功倍
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div 
            v-for="feature in features" 
            :key="feature.title"
            class="text-center p-6 rounded-xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-gray-200"
          >
            <div class="text-4xl mb-4">{{ feature.icon }}</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ feature.title }}</h3>
            <p class="text-gray-600">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 产品区域 -->
    <section id="products" class="py-24 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            我们的产品
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            全方位的解决方案，满足您不同的业务需求
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <UCard 
            v-for="product in products" 
            :key="product.name"
            class="hover:shadow-xl transition-shadow duration-300"
          >
            <template #header>
              <div class="bg-gradient-to-br from-blue-100 to-purple-100 h-48 rounded-t-lg flex items-center justify-center">
                <div class="text-center">
                  <div class="text-4xl mb-2">📊</div>
                  <h4 class="font-semibold text-gray-800">{{ product.name }}</h4>
                </div>
              </div>
            </template>
            
            <div class="p-6">
              <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ product.name }}</h3>
              <p class="text-gray-600 mb-4">{{ product.description }}</p>
              
              <div class="space-y-2">
                <div 
                  v-for="feature in product.features" 
                  :key="feature"
                  class="flex items-center text-sm text-gray-600"
                >
                  <div class="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  {{ feature }}
                </div>
              </div>
            </div>
            
            <template #footer>
              <UButton 
                block 
                variant="outline"
                class="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
              >
                了解详情
              </UButton>
            </template>
          </UCard>
        </div>
      </div>
    </section>

    <!-- 关于区域 -->
    <section id="about" class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            关于 PowerX
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            我们致力于为企业提供最先进的管理解决方案，让每一个企业都能享受到数字化转型带来的便利
          </p>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- 左侧内容 -->
          <div>
            <h3 class="text-2xl font-bold text-gray-900 mb-6">我们的使命</h3>
            <div class="space-y-4 text-gray-600">
              <p>
                PowerX 成立于2024年，专注于为中小企业和大型企业提供全方位的数字化管理解决方案。
                我们相信技术应该让管理变得更简单，而不是更复杂。
              </p>
              <p>
                通过不断的技术创新和用户体验优化，我们已经帮助超过1000家企业实现了数字化转型，
                提升了他们的运营效率和竞争力。
              </p>
              <p>
                我们的团队由来自世界各地的优秀工程师、设计师和产品经理组成，
                共同致力于打造最好用的企业管理平台。
              </p>
            </div>
            
            <!-- 统计数据 -->
            <div class="grid grid-cols-3 gap-6 mt-8">
              <div class="text-center">
                <div class="text-3xl font-bold text-blue-600 mb-2">1000+</div>
                <div class="text-sm text-gray-600">服务企业</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-blue-600 mb-2">50万+</div>
                <div class="text-sm text-gray-600">活跃用户</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
                <div class="text-sm text-gray-600">系统稳定性</div>
              </div>
            </div>
          </div>
          
          <!-- 右侧图片 -->
          <div class="relative">
            <div class="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 h-96 flex items-center justify-center">
              <div class="text-center">
                <div class="text-6xl mb-4">🏢</div>
                <h4 class="text-xl font-bold text-gray-800 mb-2">企业级解决方案</h4>
                <p class="text-gray-600">安全、稳定、可扩展</p>
              </div>
            </div>
            <!-- 装饰元素 -->
            <div class="absolute -top-4 -right-4 w-20 h-20 bg-blue-200 rounded-full opacity-50"></div>
            <div class="absolute -bottom-4 -left-4 w-16 h-16 bg-purple-200 rounded-full opacity-50"></div>
          </div>
        </div>
        
        <!-- 团队价值观 -->
        <div class="mt-20">
          <h3 class="text-2xl font-bold text-gray-900 text-center mb-12">我们的价值观</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center">
              <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl">💡</span>
              </div>
              <h4 class="text-lg font-semibold text-gray-900 mb-2">创新驱动</h4>
              <p class="text-gray-600">持续创新，用技术推动行业进步</p>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl">🤝</span>
              </div>
              <h4 class="text-lg font-semibold text-gray-900 mb-2">用户至上</h4>
              <p class="text-gray-600">以用户需求为中心，提供最佳体验</p>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl">🎯</span>
              </div>
              <h4 class="text-lg font-semibold text-gray-900 mb-2">追求卓越</h4>
              <p class="text-gray-600">精益求精，打造行业标杆产品</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h3 class="text-2xl font-bold mb-4">PowerX</h3>
          <p class="text-gray-400 mb-8">让管理更简单，让业务更高效</p>
          <div class="flex justify-center space-x-6">
            <a href="#" class="text-gray-400 hover:text-white transition-colors">关于我们</a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">联系我们</a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">隐私政策</a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">服务条款</a>
          </div>
          <div class="mt-8 pt-8 border-t border-gray-800">
            <p class="text-gray-400">&copy; 2024 PowerX. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>

  </div>
</template>

<style scoped>
/* 自定义动画 */
@keyframes pulse {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.delay-1000 {
  animation-delay: 1s;
}
</style>
