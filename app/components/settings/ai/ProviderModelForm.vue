<template>
  <UForm :state="state" class="space-y-4">
    <!-- Provider 与 Model 行 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm mb-1 text-[var(--text-secondary)]"
          >Provider</label
        >
        <USelect
          v-model="state.provider"
          :items="providerOptions"
          icon="i-heroicons-building-library"
          @change="emit('providerChanged', state.provider)"
        />
      </div>
      <div>
        <label class="block text-sm mb-1 text-[var(--text-secondary)]"
          >Model</label
        >
        <USelect
          v-model="state.model"
          :items="modelOptions"
          icon="i-heroicons-cpu-chip"
        />
      </div>
    </div>

    <!-- 凭证与基础连接 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm mb-1 text-[var(--text-secondary)]"
          >API Key</label
        >
        <UInput v-model="state.apiKey" type="password" placeholder="••••••••" />
      </div>
      <div>
        <label class="block text-sm mb-1 text-[var(--text-secondary)]"
          >Base URL（可选）</label
        >
        <UInput v-model="state.baseURL" placeholder="https://api.example.com" />
      </div>
      <div>
        <label class="block text-sm mb-1 text-[var(--text-secondary)]"
          >Region / Location（可选）</label
        >
        <UInput v-model="state.region" placeholder="如 eastus / us-east-1" />
      </div>
      <div>
        <label class="block text-sm mb-1 text-[var(--text-secondary)]"
          >Organization / Project（可选）</label
        >
        <UInput
          v-model="state.organization"
          placeholder="组织或订阅ID（可选）"
        />
      </div>

      <!-- Azure 专用（示意） -->
      <div v-if="isAzure" class="md:col-span-2">
        <label class="block text-sm mb-1 text-[var(--text-secondary)]"
          >Azure Deployment（可选）</label
        >
        <UInput
          v-model="state.azureDeployment"
          placeholder="Azure OpenAI 的部署名称"
        />
      </div>
    </div>
  </UForm>
</template>

<script setup lang="ts">
const props = defineProps<{
  providerOptions: string[];
  modelOptions: string[];
  state: {
    provider: string;
    model: string;
    apiKey: string;
    baseURL: string;
    region: string;
    organization: string;
    azureDeployment?: string;
  };
}>();

const emit = defineEmits<{
  (e: "providerChanged", provider: string): void;
}>();

const isAzure = computed(() => props.state.provider === "Azure OpenAI");
</script>
