<template>
  <UModal
    v-model="open"
    title="install-plugin-title"
    description="install-plugin-desc"
    :ui="{ width: 'sm:max-w-lg' }"
  >
    <template #content>
      <div class="p-4">
        <div class="flex items-start gap-3">
          <img
            v-if="plugin?.icon"
            :src="plugin?.icon"
            alt=""
            class="w-10 h-10 rounded-md object-cover"
          />
          <div class="flex-1">
            <div class="font-medium text-[var(--text-primary)]">
              安装插件：{{ plugin?.name || "-" }}
            </div>
            <div class="text-xs text-[var(--text-secondary)]">
              版本：{{ plugin?.version || "-" }} · 作者：{{
                plugin?.author || "-"
              }}
            </div>
          </div>
        </div>

        <div class="mt-4">
          <UForm :state="state" class="space-y-4">
            <!-- 安装来源：URL（对接后端 install/url） -->
            <div class="rounded-md border border-[var(--border-color)] p-3 space-y-3">
              <div class="text-sm font-medium text-[var(--text-primary)]">安装包来源</div>
              <UInput v-model="state.url" placeholder="https://example.com/plugin.zip">
                <template #leading>
                  <span class="inline-block shrink-0">
                    <UIcon name="i-heroicons-link" />
                  </span>
                </template>
              </UInput>
              <UInput v-model="state.sha256" placeholder="可选：期望的 SHA256 校验值" />
              <div class="flex items-center gap-2">
                <UCheckbox v-model="state.enableAfterInstall" />
                <span class="text-sm text-[var(--text-secondary)]">安装后立即启用</span>
              </div>
              <div class="text-xs text-[var(--text-secondary)]">不填写 URL 将按示例演示，不向后端发送安装请求。</div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm mb-1 text-[var(--text-secondary)]"
                  >安装范围</label
                >
                <USelect
                  v-model="state.scope"
                  :items="scopes"
                  icon="i-heroicons-cog-6-tooth"
                />
              </div>
              <div>
                <label class="block text-sm mb-1 text-[var(--text-secondary)]"
                  >命名空间（可选）</label
                >
                <UInput
                  v-model="state.namespace"
                  placeholder="如: company.crm"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm mb-1 text-[var(--text-secondary)]"
                  >目标环境</label
                >
                <USelect
                  v-model="state.env"
                  :items="envOptions"
                  icon="i-heroicons-circle-stack"
                />
              </div>
              <div class="flex items-center gap-3 mt-6 md:mt-8">
                <USwitch v-model="state.autoUpdate" />
                <span class="text-sm text-[var(--text-secondary)]"
                  >自动更新</span
                >
              </div>
            </div>

            <div>
              <div class="text-sm mb-2 text-[var(--text-secondary)]">
                申请权限
              </div>
              <div
                class="rounded-md border border-[var(--border-color)] p-3 space-y-2"
              >
                <label class="flex items-center gap-2 text-sm">
                  <UCheckbox v-model="state.perms.network" />
                  <span>网络访问（调用外部 API）</span>
                </label>
                <label class="flex items-center gap-2 text-sm">
                  <UCheckbox v-model="state.perms.storage" />
                  <span>本地存储（读写插件数据）</span>
                </label>
                <label class="flex items-center gap-2 text-sm">
                  <UCheckbox v-model="state.perms.files" />
                  <span>文件访问（读取/上传文件）</span>
                </label>
              </div>
            </div>

            <div>
              <label class="block text-sm mb-1 text-[var(--text-secondary)]"
                >备注（可选）</label
              >
              <UTextarea
                v-model="state.notes"
                :rows="3"
                placeholder="为本次安装记录备注…"
              />
            </div>
          </UForm>
        </div>

        <div class="mt-5 flex items-center justify-end gap-2">
          <UButton variant="ghost" @click="close">取消</UButton>
          <UButton
            color="primary"
            :loading="installing"
            @click="confirmInstall"
            icon="i-heroicons-arrow-down-tray"
          >
            安装
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { MarketplacePlugin } from "~/components/plugins/PluginCard.vue";

const props = defineProps<{
  modelValue: boolean;
  plugin?: MarketplacePlugin;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", v: boolean): void;
  (e: "installed", payload: { plugin: MarketplacePlugin; state: any }): void;
}>();

const open = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit("update:modelValue", v),
});

const scopes = ["用户级", "组织级", "系统级"];
const envOptions = ["default", "staging", "production"];

const state = reactive({
  // 对接后端安装 URL
  url: "",
  sha256: "",
  enableAfterInstall: true,
  scope: "用户级",
  namespace: "",
  env: "default",
  autoUpdate: true,
  perms: {
    network: true,
    storage: true,
    files: false,
  },
  notes: "",
});

const installing = ref(false);

function close() {
  open.value = false;
}

async function confirmInstall() {
  if (!props.plugin) {
    close();
    return;
  }
  installing.value = true;
  try {
    // 若填写了 URL，则走后端安装接口
    if (state.url) {
      const { useAdminPluginsService } = await import("~/composables/api/services/adminPluginsService");
      const svc = useAdminPluginsService();
      await svc.installFromUrl({ url: state.url, sha256: state.sha256 || undefined, enable: !!state.enableAfterInstall });
    } else {
      // 演示占位：保留原行为
      await new Promise((r) => setTimeout(r, 600));
    }
    emit("installed", {
      plugin: props.plugin,
      state: JSON.parse(JSON.stringify(state)),
    });
    close();
  } finally {
    installing.value = false;
  }
}
</script>
