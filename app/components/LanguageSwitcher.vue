<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const flags: Record<string, string> = { zh: '🇨🇳', en: '🇺🇸', ja: '🇯🇵', ko: '🇰🇷' }

const current = computed(() =>
  locales.value.find(l => l.code === locale.value) ?? { code: 'zh', name: '简体中文' }
)

const items = computed<DropdownMenuItem[][]>(() => [
  locales.value.map(l => ({
    label: `${flags[l.code] ?? ''} ${l.name ?? l.code}`,
    to: switchLocalePath(l.code),        // ✅ 通过路由切换语言
    checked: l.code === locale.value     // ✅ 在当前语言上显示勾选
    // 如果你更喜欢回调方式，用下面这个，二选一：
    // onSelect: async (e) => { e?.preventDefault?.(); await setLocale(l.code) }
  }))
])
</script>

<template>
  <UDropdownMenu :items="items" :ui="{ content: 'w-56' }">
    <UButton
      variant="ghost"
      color="neutral"
      class="text-sm"
      :label="`${flags[current.code] ?? ''} ${current.name}`"
      trailing-icon="i-lucide-chevron-down"
    />
  </UDropdownMenu>
</template>
