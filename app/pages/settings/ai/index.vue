<template>
  <div class="space-y-6 p-4">
    <!-- 标题 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-lg font-semibold text-[var(--text-primary)]">
          大模型设置
        </h1>
        <p class="text-sm text-[var(--text-secondary)]">
          配置系统使用的多模态模型供应商与参数（LLM / 图像 / 向量 / 视频）
        </p>
      </div>
      <div class="flex items-center gap-2">
        <UButton
          color="primary"
          icon="i-heroicons-cloud-arrow-up"
          class="whitespace-nowrap"
          :loading="saving"
          @click="saveSettings"
        >
          保存
        </UButton>
        <UButton
          variant="ghost"
          icon="i-heroicons-arrow-path"
          class="whitespace-nowrap"
          @click="resetSettings"
        >
          重置
        </UButton>
      </div>
    </div>

    <!-- 顶部 Tab + 环境选择 -->
    <div
      class="flex items-center gap-2 border-b border-[var(--border-color)] pb-2"
    >
      <UButton
        v-for="tab in modalityTabs"
        :key="tab.key"
        size="xs"
        class="whitespace-nowrap"
        :variant="modality === tab.key ? 'solid' : 'ghost'"
        :icon="tab.icon"
        @click="modality = tab.key as any"
      >
        {{ tab.label }}
      </UButton>
      <div class="flex-1" />
      <USelect
        v-model="env"
        :options="envOptions"
        class="w-36"
        icon="i-heroicons-circle-stack"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 左侧：表单 -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Provider/Model/凭证（随当前模态绑定） -->
        <div
          class="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] p-4"
        >
          <div class="mb-4 font-medium text-[var(--text-primary)]">
            {{ currentTitle }} - 通用
          </div>
          <ProviderModelForm
            :provider-options="providerOptions"
            :model-options="modelOptions"
            :state="currentState"
            @provider-changed="onProviderChanged"
          />
        </div>

        <!-- 参数配置（随模态切换） -->
        <div
          class="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] p-4"
        >
          <div class="mb-4 font-medium text-[var(--text-primary)]">
            {{ currentTitle }} - 参数
          </div>
          <ModalityParamsForm
            :active-modality="modality"
            :llm="llm"
            :image="image"
            :embedding="embedding"
            :video="video"
            :image-size-options="imageSizeOptions"
            :image-quality-options="imageQualityOptions"
            :image-format-options="imageFormatOptions"
            :truncate-options="truncateOptions"
            :video-resolution-options="videoResolutionOptions"
          />
        </div>
      </div>

      <!-- 右侧：测试 -->
      <div class="space-y-6">
        <TestPanel
          :current-title="currentTitle"
          :current-state="currentState"
          :last-test-message="lastTestMessage"
          :on-test-connection="testConnection"
          :on-test-quick-call="testQuickCall"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProviderModelForm from "~/components/settings/ai/ProviderModelForm.vue";
import ModalityParamsForm from "~/components/settings/ai/ModalityParamsForm.vue";
import TestPanel from "~/components/settings/ai/TestPanel.vue";

type Modality = "llm" | "image" | "embedding" | "video";

/**
 * Tab & 环境
 */
const modalityTabs = [
  { key: "llm", label: "LLM 文本", icon: "i-heroicons-bars-3-bottom-left" },
  { key: "image", label: "图像生成", icon: "i-heroicons-photo" },
  {
    key: "embedding",
    label: "向量嵌入",
    icon: "i-heroicons-square-3-stack-3d",
  },
  { key: "video", label: "视频生成", icon: "i-heroicons-video-camera" },
] as const;

const modality = ref<Modality>("llm");
const envOptions = ["default", "staging", "production"];
const env = ref<"default" | "staging" | "production">("default");

/**
 * Provider 列表与模型目录（示例）
 */
const providerOptions = [
  "OpenAI",
  "Azure OpenAI",
  "Anthropic",
  "Google (Vertex/GenAI)",
  "OpenRouter",
  "AWS Bedrock",
  "Ollama (Local)",
];

const modelCatalog = {
  llm: {
    OpenAI: ["gpt-4o-mini", "gpt-4.1-mini", "gpt-3.5-turbo"],
    "Azure OpenAI": ["gpt-4o-mini", "gpt-4o", "gpt-35-turbo"],
    Anthropic: ["claude-3-5-sonnet", "claude-3-haiku"],
    "Google (Vertex/GenAI)": ["gemini-1.5-pro", "gemini-1.5-flash"],
    OpenRouter: ["openrouter/auto", "mistral-large", "llama-3.1-70b"],
    "AWS Bedrock": ["anthropic.claude-3-sonnet", "meta.llama3-70b"],
    "Ollama (Local)": ["llama3", "qwen2", "mistral"],
  },
  image: {
    OpenAI: ["gpt-image-1"],
    "Google (Vertex/GenAI)": ["imagen-2", "imagen-3"],
    OpenRouter: [
      "black-forest-labs/flux-schnell",
      "stability/stable-diffusion-xl",
    ],
    "AWS Bedrock": ["stability.stable-diffusion-xl", "amazon.titan-image"],
    "Ollama (Local)": ["sdxl", "flux"],
  },
  embedding: {
    OpenAI: ["text-embedding-3-small", "text-embedding-3-large"],
    "Google (Vertex/GenAI)": ["text-embedding-004"],
    OpenRouter: ["voyage-large-2-instruct", "gte-large"],
    "AWS Bedrock": ["amazon.titan-embed-text-v2"],
    "Ollama (Local)": ["nomic-embed-text", "bge-large"],
  },
  video: {
    OpenAI: ["gpt-4o-realtime", "omni-realtime-preview"],
    "Google (Vertex/GenAI)": ["veo-2-preview"],
    OpenRouter: ["luma-video", "pika-1.0"],
    "AWS Bedrock": ["runway.gen-3", "heygen.video"],
  },
};

/**
 * 各模态的 state（包含 Provider/Model/凭证 + 模态参数）
 */
type BaseConn = {
  provider: string;
  model: string;
  apiKey: string;
  baseURL: string;
  region: string;
  organization: string;
  azureDeployment?: string;
};

const llm = reactive<
  BaseConn & {
    temperature: number;
    maxTokens: number;
    topP: number;
    stream: boolean;
  }
>({
  provider: "OpenAI",
  model: "gpt-4o-mini",
  apiKey: "",
  baseURL: "",
  region: "",
  organization: "",
  temperature: 0.7,
  maxTokens: 4096,
  topP: 1,
  stream: true,
});

const image = reactive<
  BaseConn & {
    size: string;
    quality: string;
    format: string;
    promptHint: string;
  }
>({
  provider: "OpenAI",
  model: "gpt-image-1",
  apiKey: "",
  baseURL: "",
  region: "",
  organization: "",
  size: "1024x1024",
  quality: "standard",
  format: "png",
  promptHint: "",
});

const embedding = reactive<
  BaseConn & { dimensions: number; truncate: string; batch: number }
>({
  provider: "OpenAI",
  model: "text-embedding-3-small",
  apiKey: "",
  baseURL: "",
  region: "",
  organization: "",
  dimensions: 1536,
  truncate: "none",
  batch: 32,
});

const video = reactive<
  BaseConn & {
    resolution: string;
    fps: number;
    maxDurationSec: number;
    promptHint: string;
  }
>({
  provider: "OpenAI",
  model: "gpt-4o-realtime",
  apiKey: "",
  baseURL: "",
  region: "",
  organization: "",
  resolution: "1080p",
  fps: 24,
  maxDurationSec: 10,
  promptHint: "",
});

/**
 * 计算当前标题与当前 state
 */
const currentTitle = computed(() => {
  switch (modality.value) {
    case "llm":
      return "LLM 文本";
    case "image":
      return "图像生成";
    case "embedding":
      return "向量嵌入";
    case "video":
      return "视频生成";
  }
});

const currentState = computed<any>({
  get() {
    if (modality.value === "llm") return llm;
    if (modality.value === "image") return image;
    if (modality.value === "embedding") return embedding;
    return video;
  },
  set(_v) {
    // 保持为对象引用，不整体替换
  },
});

/**
 * ProviderModelForm 的 Model 下拉选项：随模态与 Provider 变化
 */
const modelOptions = ref<string[]>([]);
watch(
  [() => modality.value, () => currentState.value.provider],
  () => {
    const catalog = modelCatalog[modality.value] as Record<string, string[]>;
    const list = catalog?.[currentState.value.provider] || [];
    modelOptions.value = list;
    if (!list.includes(currentState.value.model)) {
      currentState.value.model = list[0] || "";
    }
  },
  { immediate: true, deep: false }
);

function onProviderChanged() {
  const catalog = modelCatalog[modality.value] as Record<string, string[]>;
  const list = catalog?.[currentState.value.provider] || [];
  currentState.value.model = list[0] || "";
}

/**
 * 选项集合（传给 ModalityParamsForm）
 */
const imageSizeOptions = ["256x256", "512x512", "1024x1024"];
const imageQualityOptions = ["standard", "hd"];
const imageFormatOptions = ["png", "jpeg", "webp"];
const truncateOptions = ["none", "start", "end"];
const videoResolutionOptions = ["720p", "1080p", "4k"];

/**
 * 保存/重置/测试（占位逻辑）
 */
const saving = ref(false);
const lastTestMessage = ref("");

async function saveSettings() {
  saving.value = true;
  try {
    const payload = {
      env: env.value,
      modality: modality.value,
      llm: { ...llm },
      image: { ...image },
      embedding: { ...embedding },
      video: { ...video },
    };
    // TODO: 接入后端 API 持久化
    console.log("保存模型设置", payload);
    lastTestMessage.value = "已保存本地状态（示例），请接入后端 API 持久化。";
  } catch (e: any) {
    lastTestMessage.value = `保存失败：${e?.message || e}`;
  } finally {
    saving.value = false;
  }
}

function resetSettings() {
  const resetMap: Record<Modality, { provider: string; model: string }> = {
    llm: { provider: "OpenAI", model: "gpt-4o-mini" },
    image: { provider: "OpenAI", model: "gpt-image-1" },
    embedding: { provider: "OpenAI", model: "text-embedding-3-small" },
    video: { provider: "OpenAI", model: "gpt-4o-realtime" },
  };
  const cur = currentState.value as BaseConn;
  const def = resetMap[modality.value];
  cur.provider = def.provider;
  onProviderChanged();
  cur.model = def.model;
  lastTestMessage.value = "已恢复默认（当前模态）。";
}

function testConnection() {
  const s = currentState.value as BaseConn;
  lastTestMessage.value = `已模拟测试连接：
- 模态：${currentTitle.value}
- Provider：${s.provider || "-"}
- Model：${s.model || "-"}
- BaseURL：${s.baseURL || "-"}
- Region：${s.region || "-"}
（此为前端静态演示，未做真实请求）`;
}

function testQuickCall() {
  const s = currentState.value as BaseConn;
  lastTestMessage.value = `已模拟试跑：
- 模态：${currentTitle.value}
- Provider：${s.provider || "-"}
- Model：${s.model || "-"}
返回：OK（静态）`;
}
</script>
