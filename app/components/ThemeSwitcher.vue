<script setup lang="ts">
import { computed } from 'vue'
import { useColorMode } from '@vueuse/core'
import { usePluginBridge } from '~/composables/usePluginBridge'

type ThemeKey = 'system' | 'light' | 'dark'

const colorMode = useColorMode()
const { broadcast } = usePluginBridge()

const current = computed<ThemeKey>(() => {
  const v = String(colorMode.value ?? 'light')
  return v === 'auto' ? 'system' : (v as ThemeKey)
})

function apply(t: ThemeKey) {
  colorMode.value = (t === 'system' ? 'auto' : t) as any
  if (process.client) {
    const effective = t === 'system'
      ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : t
    document.documentElement.setAttribute('data-theme', effective)
  }
  broadcast({ source: 'powerx', type: 'theme', theme: t })
}
</script>

<template>
  <!-- 你可以把这段替换成你原来的 UI 组件；关键是 onSelect/@click 调用 apply(...) -->
  <UDropdownMenu
    :items="[[
      { label: 'System', onSelect: () => apply('system') },
      { label: 'Light',  onSelect: () => apply('light')  },
      { label: 'Dark',   onSelect: () => apply('dark')   },
    ]]"
  >
    <UButton variant="ghost" size="sm" class="flex items-center gap-2">
      <UIcon
        class="w-5 h-5"
        :name="current==='dark'
          ? 'i-heroicons-moon-20-solid'
          : current==='light'
          ? 'i-heroicons-sun-20-solid'
          : 'i-heroicons-computer-desktop-20-solid'"
      />
      <span class="hidden sm:inline">{{ current }}</span>
      <UIcon name="i-heroicons-chevron-down-20-solid" class="w-4 h-4" />
    </UButton>
  </UDropdownMenu>
</template>
