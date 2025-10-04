import {watch} from 'vue'
import {useI18n} from '#imports'
import {useColorMode} from '@vueuse/core'

type PluginMeta = {
  pluginId: string
  instanceId?: string
  targetOrigin: string
  frame: HTMLIFrameElement
}

type PowerXToPlugin =
  | { source: 'powerx'; type: 'locale'; locale: string }
  | { source: 'powerx'; type: 'theme'; theme: 'light' | 'dark' | 'system' }
  | {
  source: 'powerx';
  type: 'sync';
  locale: string;
  theme: 'light' | 'dark' | 'system';
  hostOrigin: string;
  pluginId: string;
  instanceId?: string;
}

type PluginToPowerX =
  | { source: 'plugin'; type: 'ready'; pluginId?: string; instanceId?: string }
  | { source: 'plugin'; type: 'request-sync' }
  | { source: 'plugin'; type: 'ping'; ts: number }


function themeFromValue(v: any): 'light' | 'dark' | 'system' {
  const s = String(v ?? '')
  return s === 'auto' ? 'system' : (s === 'light' || s === 'dark' ? s : 'system')
}

// 统一把 locale 转成字符串（防止传入对象）
function toLocaleCode(input: any): string {
  if (typeof input === 'string') return input
  if (input && typeof input === 'object') {
    if (typeof input.code === 'string') return input.code
    if (typeof input.locale === 'string') return input.locale
  }
  return String(input ?? '')
}


export function usePluginBridge() {
  const registry = useState<Map<HTMLIFrameElement, PluginMeta>>('px:iframes', () => new Map())

  const {locale} = useI18n()
  const colorMode = useColorMode() // 注意：这里是一个 ref，使用 .value

  const sendTo = (meta: PluginMeta, msg: PowerXToPlugin) => {
    try {
      meta.frame.contentWindow?.postMessage(msg, meta.targetOrigin)
    } catch (err) {
      console.warn('[DBG][Admin->Plugin] postMessage error', err)
    }
  }

  const broadcast = (msg: PowerXToPlugin) => {
    if (!process.client) return
    // console.info('[DBG][Admin] broadcast', msg)
    registry.value.forEach(meta => sendTo(meta, msg))
  }

  const syncMeta = (m: PluginMeta) => {
    const payload = {
      source: 'powerx',
      type: 'sync',
      locale: toLocaleCode(locale?.value),
      theme: themeFromValue(colorMode.value),
      hostOrigin: window.location.origin,
      pluginId: m.pluginId,
      instanceId: m.instanceId,
    } as const
    // console.info('[DBG][Admin->Plugin] syncMeta', { to: m.targetOrigin, pluginId: m.pluginId, instanceId: m.instanceId, payload })
    sendTo(m, payload)
  }

  const syncFrame = (frame?: HTMLIFrameElement | null) => {
    if (!process.client) return
    if (frame) {
      const m = registry.value.get(frame)
      if (m) syncMeta(m)
    } else {
      registry.value.forEach(syncMeta)
    }
  }

  // 语言/主题变化即广播
  if (process.client) {
    watch(locale, (val) => {
      broadcast({source: 'powerx', type: 'locale', locale: toLocaleCode(val)})
    })
    watch(() => colorMode.value, (val) => {
      const t = themeFromValue(val)
      // console.info('[DBG][Admin] theme changed ->', { value: val, mapped: t })
      broadcast({ source: 'powerx', type: 'theme', theme: t })
    })
  }

  const register = (el?: HTMLIFrameElement | null, meta?: { pluginId: string; instanceId?: string }) => {
    if (!el || !process.client) return
    let origin = '*'
    try {
      origin = new URL(el.src).origin
    } catch {
    }
    const m: PluginMeta = {
      pluginId: meta?.pluginId || 'unknown',
      instanceId: meta?.instanceId,
      targetOrigin: origin,
      frame: el
    }
    registry.value.set(el, m)

    // 不再写 byWindow；只做首包 sync
    el.addEventListener('load', () => syncFrame(el), {once: true})
  }

  const unregister = (el?: HTMLIFrameElement | null) => {
    if (!el || !process.client) return
    registry.value.delete(el)
  }

  if (process.client && !(window as any).__pxBridgeBound__) {
    window.addEventListener('message', (e: MessageEvent) => {
      const data = e.data as PluginToPowerX
      if (!data || data.source !== 'plugin') return
      // console.info('[DBG][Plugin->Admin] message', { origin: e.origin, data })
      let hit: PluginMeta | undefined
      registry.value.forEach(meta => {
        if (meta.frame?.contentWindow === e.source) hit = meta
      })
      if (!hit) return
      if (data.type === 'ready' || data.type === 'request-sync') syncMeta(hit)
    })
    ;(window as any).__pxBridgeBound__ = true
  }

  return {register, unregister, syncFrame, broadcast}
}
