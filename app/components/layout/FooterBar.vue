<template>
  <footer class="bg-white border-t border-gray-200 px-6 py-4">
    <div class="flex items-center justify-between text-sm text-gray-600">
      <div class="flex items-center gap-2">
        <span>© 2024 PowerX.</span>
        <span class="text-gray-500">{{ $t('home.footer') }}</span>
      </div>
      <div class="flex items-center gap-4">
        <!-- 语言/主题切换器 -->
        <LanguageSwitcher />
        <ThemeSwitcher />
        <!-- 原有链接 -->
        <a href="#" class="hover:text-gray-900">{{ $t('intro.footer.aboutUs') }}</a>
        <a href="#" class="hover:text-gray-900">{{ $t('intro.footer.contactUs') }}</a>
        <a href="#" class="hover:text-gray-900">{{ $t('privacyPolicy') }}</a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// 依赖已有的切换器组件
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'
</script>