<template>
  <div class="px-4 py-4 space-y-4">
    <!-- 标题 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-lg font-semibold text-[var(--text-primary)]">
          大模型设置
        </h1>
        <p class="text-sm text-[var(--text-secondary)]">
          配置系统智能体使用的多模态模型供应商与模型参数（LLM、图像、向量、视频）
        </p>
      </div>
      <div class="flex items-center gap-2">
        <UButton
          color="primary"
          icon="i-heroicons-cloud-arrow-up"
          @click="handleSaveAll"
          class="whitespace-nowrap"
        >
          保存全部
        </UButton>
        <UButton
          variant="ghost"
          color="neutral"
          icon="i-heroicons-arrow-path"
          @click="handleReset"
          class="whitespace-nowrap"
        >
          重置
        </UButton>
      </div>
    </div>

    <!-- 顶部分组标签（扁平结构，避免多层嵌套） -->
    <div class="flex items-center gap-2 border-b border-[var(--border-color)]">
      <UButton
        v-for="tab in modalityTabs"
        :key="tab.value"
        size="sm"
        variant="ghost"
        class="gap-2 whitespace-nowrap"
        :color="activeModality === tab.value ? 'primary' : 'neutral'"
        :icon="tab.icon"
        @click="activeModality = tab.value"
      >
        {{ tab.label }}
      </UButton>
      <div class="flex-1" />
      <!-- 可选：环境或命名空间 -->
      <USelect
        v-model="env"
        :options="envOptions"
        class="w-36"
        icon="i-heroicons-circle-stack"
      />
    </div>

    <!-- 内容区：仅渲染一个表单卡片，保持结构扁平 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- 左侧：基础配置 -->
      <div class="lg:col-span-2 space-y-4">
        <div
          class="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)]"
        >
          <div
            class="px-4 py-3 border-b border-[var(--border-color)] flex items-center justify-between"
          >
            <div class="font-medium text-[var(--text-primary)]">
              {{ currentTitle }} - 供应商与模型
            </div>
            <div class="text-xs text-[var(--text-secondary)]">
              仅静态演示，可对接真实接口
            </div>
          </div>
          <div class="p-4 space-y-4">
            <!-- Provider 与 Model 行 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm mb-1 text-[var(--text-secondary)]"
                  >Provider</label
                >
                <USelect
                  v-model="currentState.provider"
                  :options="providerOptions"
                  icon="i-heroicons-building-library"
                  @change="onProviderChanged"
                />
              </div>
              <div>
                <label class="block text-sm mb-1 text-[var(--text-secondary)]"
                  >Model</label
                >
                <USelect
                  v-model="currentState.model"
                  :options="modelOptionsForCurrent"
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
                <UInput
                  v-model="currentState.apiKey"
                  type="password"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label class="block text-sm mb-1 text-[var(--text-secondary)]"
                  >Base URL（可选）</label
                >
                <UInput
                  v-model="currentState.baseURL"
                  placeholder="https://api.example.com"
                />
              </div>
              <div>
                <label class="block text-sm mb-1 text-[var(--text-secondary)]"
                  >Region / Location（可选）</label
                >
                <UInput
                  v-model="currentState.region"
                  placeholder="如 eastus / us-east-1"
                />
              </div>
              <div>
                <label class="block text-sm mb-1 text-[var(--text-secondary)]"
                  >Organization / Project（可选）</label
                >
                <UInput
                  v-model="currentState.organization"
                  placeholder="组织或订阅ID（可选）"
                />
              </div>
              <!-- Azure 专用（示意） -->
              <div v-if="isAzure" class="md:col-span-2">
                <label class="block text-sm mb-1 text-[var(--text-secondary)]"
                  >Azure Deployment（可选）</label
                >
                <UInput
                  v-model="currentState.azureDeployment"
                  placeholder="Azure OpenAI 的部署名称"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 参数配置（根据模态显示不同参数） -->
        <div
          class="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)]"
        >
          <div
            class="px-4 py-3 border-b border-[var(--border-color)] font-medium text-[var(--text-primary)]"
          >
            {{ currentTitle }} - 参数
          </div>
          <div class="p-4 space-y-4">
            <!-- LLM 参数 -->
            <template v-if="activeModality === 'llm'">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm mb-1 text-[var(--text-secondary)]"
                    >Temperature</label
                  >
                  <UInput
                    v-model.number="llm.temperature"
                    type="number"
                    step="0.1"
                    min="0"
                    max="2"
                  />
                </div>
                <div>
                  <label class="block text-sm mb-1 text-[var(--text-secondary)]"
                    >Max Tokens</label
                  >
                  <UInput
                    v-model.number="llm.maxTokens"
                    type="number"
                    min="1"
                  />
                </div>
                <div>
                  <label class="block text-sm mb-1 text-[var(--text-secondary)]"
                    >Top P</label
                  >
                  <UInput
                    v-model.number="llm.topP"
                    type="number"
                    step="0.05"
                    min="0"
                    max="1"
                  />
                </div>
              </div>
              <div class="flex items-center gap-4">
                <USwitch v-model="llm.stream" />
                <span class="text-sm text-[var(--text-secondary)]"
                  >流式输出</span
                >
              </div>
            </template>

            <!-- 图像 参数 -->
            <template v-else-if="activeModality === 'image'">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm mb-1 text-[var(--text-secondary)]"
                    >尺寸</label
                  >
                  <USelect
                    v-model="image.size"
                    :options="imageSizeOptions"
                    icon="i-heroicons-photo"
                  />
                </div>
                <div>
                  <label class="block text-sm mb-1 text-[var(--text-secondary)]"
                    >质量</label
                  >
                  <USelect
                    v-model="image.quality"
                    :options="imageQualityOptions"
                    icon="i-heroicons-sparkles"
                  />
                </div>
                <div>
                  <label class="block text-sm mb-1 text-[var(--text-secondary)]"
                    >输出格式</label
                  >
                  <USelect
                    v-model="image.format"
                    :options="imageFormatOptions"
                    icon="i-heroicons-arrow-down-tray"
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm mb-1 text-[var(--text-secondary)]"
                  >提示词（可选）</label
                >
                <UTextarea
                  v-model="image.promptHint"
                  :rows="3"
                  placeholder="为图像生成的默认提示词补充说明…"
                />
              </div>
            </template>

            <!-- Embedding 参数 -->
            <template v-else-if="activeModality === 'embedding'">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm mb-1 text-[var(--text-secondary)]"
                    >维度</label
                  >
                  <UInput
                    v-model.number="embedding.dimensions"
                    type="number"
                    min="8"
                  />
                </div>
                <div>
                  <label class="block text-sm mb-1 text-[var(--text-secondary)]"
                    >截断策略</label
                  >
                  <USelect
                    v-model="embedding.truncate"
                    :options="truncateOptions"
                    icon="i-heroicons-scissors"
                  />
                </div>
                <div>
                  <label class="block text-sm mb-1 text-[var(--text-secondary)]"
                    >批量大小</label
                  >
                  <UInput
                    v-model.number="embedding.batch"
                    type="number"
                    min="1"
                  />
                </div>
              </div>
            </template>

            <!-- 视频 参数 -->
            <template v-else-if="activeModality === 'video'">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm mb-1 text-[var(--text-secondary)]"
                    >分辨率</label
                  >
                  <USelect
                    v-model="video.resolution"
                    :options="videoResolutionOptions"
                    icon="i-heroicons-video-camera"
                  />
                </div>
                <div>
                  <label class="block text-sm mb-1 text-[var(--text-secondary)]"
                    >FPS</label
                  >
                  <UInput v-model.number="video.fps" type="number" min="1" />
                </div>
                <div>
                  <label class="block text-sm mb-1 text-[var(--text-secondary)]"
                    >最长时长（秒）</label
                  >
                  <UInput
                    v-model.number="video.maxDurationSec"
                    type="number"
                    min="1"
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm mb-1 text-[var(--text-secondary)]"
                  >默认说明（可选）</label
                >
                <UTextarea
                  v-model="video.promptHint"
                  :rows="3"
                  placeholder="为视频生成的默认提示词补充说明…"
                />
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- 右侧：测试与说明 -->
      <div class="space-y-4">
        <div
          class="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)]"
        >
          <div
            class="px-4 py-3 border-b border-[var(--border-color)] font-medium text-[var(--text-primary)]"
          >
            连接测试
          </div>
          <div class="p-4 space-y-3">
            <div class="text-sm text-[var(--text-secondary)]">
              当前测试对象：{{ currentTitle }}（{{
                currentState.provider || "未选择 Provider"
              }}
              / {{ currentState.model || "未选择 Model" }}）
            </div>
            <div class="flex items-center gap-2">
              <UButton
                icon="i-heroicons-wifi"
                color="primary"
                size="sm"
                class="whitespace-nowrap"
                @click="testConnection"
              >
                测试连接
              </UButton>
              <UButton
                icon="i-heroicons-command-line"
                variant="ghost"
                size="sm"
                class="whitespace-nowrap"
                @click="testQuickCall"
              >
                试跑一次
              </UButton>
            </div>
            <div
              class="rounded-md border border-[var(--border-color)] bg-[var(--bg-secondary)] p-3 min-h-[80px] text-xs text-[var(--text-secondary)]"
            >
              <template v-if="lastTestMessage">
                <div class="font-medium text-[var(--text-primary)] mb-1">
                  测试结果
                </div>
                <pre class="whitespace-pre-wrap break-all">{{
                  lastTestMessage
                }}</pre>
              </template>
              <template v-else>
                <div class="text-[var(--text-secondary)]">暂无测试结果</div>
              </template>
            </div>
          </div>
        </div>

        <div
          class="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)]"
        >
          <div
            class="px-4 py-3 border-b border-[var(--border-color)] font-medium text-[var(--text-primary)]"
          >
            提示
          </div>
          <div class="p-4 space-y-2 text-sm text-[var(--text-secondary)]">
            <p>此页面为静态演示，未连接后端。实际落地时建议：</p>
            <ul class="list-disc list-inside space-y-1">
              <li>将不同模态的配置分别持久化（如数据库或密钥管控服务）；</li>
              <li>
                按 Provider 校验所需字段（如 Azure 的 deployment、Bedrock 的
                region）；
              </li>
              <li>对敏感字段（API Key）做加密存储与权限控制；</li>
              <li>在“试跑一次”中，调用后端统一代理，避免前端直接暴露密钥。</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 模态标签
const modalityTabs = [
  { value: "llm", label: "LLM 文本", icon: "i-heroicons-bars-3-bottom-left" },
  { value: "image", label: "图像生成", icon: "i-heroicons-photo" },
  {
    value: "embedding",
    label: "向量嵌入",
    icon: "i-heroicons-square-3-stack-3d",
  },
  { value: "video", label: "视频生成", icon: "i-heroicons-video-camera" },
] as const;

type Modality = (typeof modalityTabs)[number]["value"];

// 顶部选择
const activeModality = ref<Modality>("llm");
const envOptions = ["default", "staging", "production"];
const env = ref<"default" | "staging" | "production">("default");

// Provider 选项
const providerOptions = [
  "OpenAI",
  "Azure OpenAI",
  "Anthropic",
  "Google (Vertex/GenAI)",
  "OpenRouter",
  "AWS Bedrock",
  "Ollama (Local)",
];

// 模型目录（示例/静态）
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
} as const;

// 各模态的状态（静态演示）
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
  BaseConn & {
    dimensions: number;
    truncate: string;
    batch: number;
  }
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

// 下拉选项
const imageSizeOptions = ["256x256", "512x512", "1024x1024"];
const imageQualityOptions = ["standard", "hd"];
const imageFormatOptions = ["png", "jpeg", "webp"];
const truncateOptions = ["none", "start", "end"];
const videoResolutionOptions = ["720p", "1080p", "4k"];

// 计算当前上下文
const currentTitle = computed(() => {
  switch (activeModality.value) {
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
    if (activeModality.value === "llm") return llm;
    if (activeModality.value === "image") return image;
    if (activeModality.value === "embedding") return embedding;
    return video;
  },
  set(val) {
    // 仅演示，不做整体替换
  },
});

const modelOptionsForCurrent = computed(() => {
  const prov = currentState.value.provider || "";
  const catalog = modelCatalog[
    activeModality.value as keyof typeof modelCatalog
  ] as Record<string, string[]>;
  return Array.isArray(catalog?.[prov]) ? catalog[prov] : [];
});

const isAzure = computed(() => currentState.value.provider === "Azure OpenAI");

// Provider 变化时重置 Model
function onProviderChanged() {
  const list = modelOptionsForCurrent.value;
  if (list && list.length > 0) {
    currentState.value.model = list[0];
  } else {
    currentState.value.model = "";
  }
}

// 测试（静态演示）
const lastTestMessage = ref("");
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

// 保存/重置（静态演示）
function handleSaveAll() {
  // 实际应调用后端保存
  lastTestMessage.value = "已模拟保存全部模态配置（静态演示）。";
}

function handleReset() {
  // 简单复位为默认 Provider/Model
  const def: Record<Modality, { provider: string; model: string }> = {
    llm: { provider: "OpenAI", model: "gpt-4o-mini" },
    image: { provider: "OpenAI", model: "gpt-image-1" },
    embedding: { provider: "OpenAI", model: "text-embedding-3-small" },
    video: { provider: "OpenAI", model: "gpt-4o-realtime" },
  };
  const d = def[activeModality.value];
  currentState.value.provider = d.provider;
  onProviderChanged();
  currentState.value.model = d.model;
  lastTestMessage.value = "已恢复默认（当前模态）。";
}
</script>

<style scoped>
/* 轻量样式，使用主题变量，避免新增层级 */
</style>
