<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

// 显示用的国旗
const flags = { zh: '🇨🇳', en: '🇺🇸', ja: '🇯🇵', ko: '🇰🇷' } as const
type LC = keyof typeof flags

// 触发器当前文案
const current = computed(() => {
  const arr = locales.value as Array<string | { code: string; name?: string }>
  const found = arr.find(x => (typeof x === 'string' ? x : x.code) === locale.value)
  const code = (typeof found === 'string' ? found : found?.code ?? 'zh') as LC
  const name = typeof found === 'string' ? found : (found?.name ?? code)
  return { code, name, flag: flags[code] ?? '🌐' }
})

// 菜单项（注意：这里用 onSelect，不是 click）
const items = computed<DropdownMenuItem[][]>(() => [
  [{ label: 'Language', type: 'label' }],
  (locales.value as Array<string | { code: string; name?: string }>).map((x) => {
    const code = (typeof x === 'string' ? x : x.code) as LC
    const name = typeof x === 'string' ? x : (x.name ?? code)
    const active = code === (locale.value as LC)
    return {
      label: `${flags[code] ?? '🌐'} ${name}`,
      active,
      suffix: active ? 'i-heroicons-check-20-solid' : undefined,
      onSelect: () => {
        const path = switchLocalePath(code)
        if (path) navigateTo(path)   // 跳到对应语言的同一路径，locale 会自动更新
      }
    } satisfies DropdownMenuItem
  })
])
</script>

<template>
  <UDropdownMenu :items="items">
    <UButton variant="ghost" class="flex items-center gap-2">
      <span class="text-lg">{{ current.flag }}</span>
      <span class="hidden sm:inline">{{ current.name }}</span>
      <UIcon name="i-heroicons-chevron-down-20-solid" class="w-4 h-4" />
    </UButton>
  </UDropdownMenu>
</template>
