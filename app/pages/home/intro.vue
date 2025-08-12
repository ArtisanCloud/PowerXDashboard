<script setup lang="ts">
definePageMeta({
  layout: false   // 禁用layout
})

const { t } = useI18n()

// 产品特性数据
const features = computed(() => [
  {
    icon: '🚀',
    title: t('intro.features.performance.title'),
    description: t('intro.features.performance.description')
  },
  {
    icon: '🎨',
    title: t('intro.features.design.title'),
    description: t('intro.features.design.description')
  },
  {
    icon: '🔧',
    title: t('intro.features.usability.title'),
    description: t('intro.features.usability.description')
  },
  {
    icon: '🛡️',
    title: t('intro.features.security.title'),
    description: t('intro.features.security.description')
  }
])

// 产品信息
const products = computed(() => [
  {
    name: 'PowerX Admin',
    description: t('intro.products.admin.description'),
    image: '/api/placeholder/300/200',
    features: [
      t('intro.products.admin.features.userManagement'),
      t('intro.products.admin.features.permissionControl'),
      t('intro.products.admin.features.dataAnalysis'),
      t('intro.products.admin.features.systemMonitoring')
    ]
  },
  {
    name: 'PowerX Analytics',
    description: t('intro.products.analytics.description'),
    image: '/api/placeholder/300/200',
    features: [
      t('intro.products.analytics.features.realTimeAnalysis'),
      t('intro.products.analytics.features.visualReports'),
      t('intro.products.analytics.features.predictiveModels'),
      t('intro.products.analytics.features.customDashboard')
    ]
  },
  {
    name: 'PowerX Cloud',
    description: t('intro.products.cloud.description'),
    image: '/api/placeholder/300/200',
    features: [
      t('intro.products.cloud.features.cloudStorage'),
      t('intro.products.cloud.features.multiDeviceSync'),
      t('intro.products.cloud.features.elasticScaling'),
      t('intro.products.cloud.features.support247')
    ]
  }
])
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
                {{ $t('intro.nav.features') }}
              </a>
              <a href="#products" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                {{ $t('intro.nav.products') }}
              </a>
              <a href="#about" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                {{ $t('intro.nav.about') }}
              </a>
            </div>
          </div>
          
          <!-- 语言切换器和登录注册按钮 -->
          <div class="flex items-center space-x-4">
            <LanguageSwitcher />
            <NuxtLink 
              :to="$localePath('/users/login')"
              variant="ghost" 
              class="text-gray-700 hover:text-blue-600 px-4 py-2 transition-colors"
            >
              {{ $t('login') }}
            </NuxtLink>
            <NuxtLink 
              :to="$localePath('/users/register')"
              class="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all"
            >
              {{ $t('register') }}
            </NuxtLink>
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
            {{ $t('intro.hero.welcomeTo') }}
            <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              PowerX
            </span>
          </h1>
          <p class="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {{ $t('home.subtitle') }}
          </p>
          
          <!-- CTA 按钮 -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <NuxtLink 
              :to="$localePath('/dashboard')"
              class="px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all text-center"
            >
              马上开始
            </NuxtLink>
            <a 
              href="#products"
              class="px-8 py-4 text-lg border border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600 rounded-lg transition-all text-center"
            >
              {{ $t('home.learnMore') }}
            </a>
          </div>
          
          <!-- 头图 -->
          <div class="relative max-w-5xl mx-auto">
            <div class="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
              <div class="bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl h-96 flex items-center justify-center">
                <div class="text-center">
                  <div class="text-6xl mb-4">🚀</div>
                  <h3 class="text-2xl font-bold text-gray-800 mb-2">PowerX Dashboard</h3>
                  <p class="text-gray-600">{{ $t('intro.hero.dashboardPreview') }}</p>
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
            {{ $t('intro.features.title') }}
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            {{ $t('intro.features.subtitle') }}
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
            {{ $t('intro.products.title') }}
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            {{ $t('intro.products.subtitle') }}
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
                {{ $t('intro.products.learnMore') }}
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
            {{ $t('intro.about.title') }}
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            {{ $t('intro.about.subtitle') }}
          </p>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- 左侧内容 -->
          <div>
            <h3 class="text-2xl font-bold text-gray-900 mb-6">{{ $t('intro.about.mission.title') }}</h3>
            <div class="space-y-4 text-gray-600">
              <p>
                {{ $t('intro.about.mission.paragraph1') }}
              </p>
              <p>
                {{ $t('intro.about.mission.paragraph2') }}
              </p>
              <p>
                {{ $t('intro.about.mission.paragraph3') }}
              </p>
            </div>
            
            <!-- 统计数据 -->
            <div class="grid grid-cols-3 gap-6 mt-8">
              <div class="text-center">
                <div class="text-3xl font-bold text-blue-600 mb-2">1000+</div>
                <div class="text-sm text-gray-600">{{ $t('intro.about.stats.companies') }}</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-blue-600 mb-2">50万+</div>
                <div class="text-sm text-gray-600">{{ $t('intro.about.stats.users') }}</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
                <div class="text-sm text-gray-600">{{ $t('intro.about.stats.uptime') }}</div>
              </div>
            </div>
          </div>
          
          <!-- 右侧图片 -->
          <div class="relative">
            <div class="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 h-96 flex items-center justify-center">
              <div class="text-center">
                <div class="text-6xl mb-4">🏢</div>
                <h4 class="text-xl font-bold text-gray-800 mb-2">{{ $t('intro.about.enterprise.title') }}</h4>
                <p class="text-gray-600">{{ $t('intro.about.enterprise.description') }}</p>
              </div>
            </div>
            <!-- 装饰元素 -->
            <div class="absolute -top-4 -right-4 w-20 h-20 bg-blue-200 rounded-full opacity-50"></div>
            <div class="absolute -bottom-4 -left-4 w-16 h-16 bg-purple-200 rounded-full opacity-50"></div>
          </div>
        </div>
        
        <!-- 团队价值观 -->
        <div class="mt-20">
          <h3 class="text-2xl font-bold text-gray-900 text-center mb-12">{{ $t('intro.about.values.title') }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center">
              <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl">💡</span>
              </div>
              <h4 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('intro.about.values.innovation.title') }}</h4>
              <p class="text-gray-600">{{ $t('intro.about.values.innovation.description') }}</p>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl">🤝</span>
              </div>
              <h4 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('intro.about.values.userFirst.title') }}</h4>
              <p class="text-gray-600">{{ $t('intro.about.values.userFirst.description') }}</p>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl">🎯</span>
              </div>
              <h4 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('intro.about.values.excellence.title') }}</h4>
              <p class="text-gray-600">{{ $t('intro.about.values.excellence.description') }}</p>
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
          <p class="text-gray-400 mb-8">{{ $t('home.footer') }}</p>
          <div class="flex justify-center space-x-6">
            <a href="#" class="text-gray-400 hover:text-white transition-colors">{{ $t('intro.footer.aboutUs') }}</a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">{{ $t('intro.footer.contactUs') }}</a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">{{ $t('privacyPolicy') }}</a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">{{ $t('termsOfService') }}</a>
          </div>
          <div class="mt-8 pt-8 border-t border-gray-800">
            <p class="text-gray-400">{{ $t('intro.footer.copyright') }}</p>
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
