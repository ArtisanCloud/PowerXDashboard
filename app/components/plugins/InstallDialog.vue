<template>
  <UModal v-model="open" :ui="{ width: 'sm:max-w-lg' }">
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
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm mb-1 text-[var(--text-secondary)]"
                >安装范围</label
              >
              <USelect
                v-model="state.scope"
                :options="scopes"
                icon="i-heroicons-cog-6-tooth"
              />
            </div>
            <div>
              <label class="block text-sm mb-1 text-[var(--text-secondary)]"
                >命名空间（可选）</label
              >
              <UInput v-model="state.namespace" placeholder="如: company.crm" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm mb-1 text-[var(--text-secondary)]"
                >目标环境</label
              >
              <USelect
                v-model="state.env"
                :options="envOptions"
                icon="i-heroicons-circle-stack"
              />
            </div>
            <div class="flex items-center gap-3 mt-6 md:mt-8">
              <USwitch v-model="state.autoUpdate" />
              <span class="text-sm text-[var(--text-secondary)]">自动更新</span>
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
    // TODO: 调用后端安装接口
    await new Promise((r) => setTimeout(r, 800));
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
