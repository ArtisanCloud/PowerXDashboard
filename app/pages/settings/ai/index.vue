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

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- 左侧：垂直Tab导航 -->
      <div class="lg:col-span-1">
        <div class="space-y-4">
          <!-- 环境选择 -->
          <div
            class="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] p-4"
          >
            <div class="mb-3 text-sm font-medium text-[var(--text-primary)]">
              环境配置
            </div>
            <USelect
              v-model="env"
              :items="envOptions"
              class="w-full"
              icon="i-heroicons-circle-stack"
            />
          </div>

          <!-- 垂直Tab -->
          <div
            class="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] p-4"
          >
            <div class="mb-3 text-sm font-medium text-[var(--text-primary)]">
              模态类型
            </div>
            <div class="space-y-2">
              <button
                v-for="tab in modalityTabs"
                :key="tab.key"
                class="w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors"
                :class="[
                  modality === tab.key
                    ? 'bg-primary-500 text-white'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]',
                ]"
                @click="modality = tab.key as any"
              >
                <UIcon :name="tab.icon" class="w-4 h-4 flex-shrink-0" />
                <span class="text-sm font-medium">{{ tab.label }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 中间：表单 -->
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
            :audio-tts="audioTTS"
            :audio-asr="audioASR"
            :video="video"
            :rerank="rerank"
            :image-size-options="imageSizeOptions"
            :image-quality-options="imageQualityOptions"
            :image-format-options="imageFormatOptions"
            :truncate-options="truncateOptions"
            :video-resolution-options="videoResolutionOptions"
            :voice-options="voiceOptions"
            :audio-format-options="audioFormatOptions"
            :audio-quality-options="audioQualityOptions"
            :language-options="languageOptions"
            :response-format-options="responseFormatOptions"
            :top-k-options="topKOptions"
          />
        </div>
      </div>

      <!-- 右侧：测试 -->
      <div class="lg:col-span-1 space-y-6">
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
import { useAISettingsStore } from "~/stores/aiSettings";
import type { SaveSettingsPayload } from "~/composables/api/services/AISettingService";

type Modality =
  | "llm"
  | "image"
  | "embedding"
  | "audio_tts"
  | "audio_asr"
  | "video"
  | "rerank";

// 使用 AI 设置 store
const aiSettingsStore = useAISettingsStore();

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
  { key: "audio_tts", label: "语音合成", icon: "i-heroicons-speaker-wave" },
  { key: "audio_asr", label: "语音识别", icon: "i-heroicons-microphone" },
  { key: "video", label: "视频生成", icon: "i-heroicons-video-camera" },
  { key: "rerank", label: "重排序", icon: "i-heroicons-arrows-up-down" },
] as const;

const modality = ref<Modality>("llm");
const envOptions = ["default", "staging", "production"];
const env = ref<"default" | "staging" | "production">("default");

/**
 * Provider 列表与模型目录（从 store 获取）
 */
const providerOptions = computed(() => aiSettingsStore.providers ?? []);

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

const audioTTS = reactive<
  BaseConn & {
    voice: string;
    speed: number;
    format: string;
    quality: string;
  }
>({
  provider: "OpenAI",
  model: "tts-1",
  apiKey: "",
  baseURL: "",
  region: "",
  organization: "",
  voice: "alloy",
  speed: 1.0,
  format: "mp3",
  quality: "standard",
});

const audioASR = reactive<
  BaseConn & {
    language: string;
    responseFormat: string;
    temperature: number;
    prompt: string;
  }
>({
  provider: "OpenAI",
  model: "whisper-1",
  apiKey: "",
  baseURL: "",
  region: "",
  organization: "",
  language: "auto",
  responseFormat: "json",
  temperature: 0,
  prompt: "",
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
  model: "sora-preview",
  apiKey: "",
  baseURL: "",
  region: "",
  organization: "",
  resolution: "1080p",
  fps: 24,
  maxDurationSec: 10,
  promptHint: "",
});

const rerank = reactive<
  BaseConn & {
    topK: number;
    returnDocuments: boolean;
    maxChunksPerDoc: number;
  }
>({
  provider: "OpenAI",
  model: "text-embedding-3-large",
  apiKey: "",
  baseURL: "",
  region: "",
  organization: "",
  topK: 10,
  returnDocuments: true,
  maxChunksPerDoc: 10,
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
    case "audio_tts":
      return "语音合成";
    case "audio_asr":
      return "语音识别";
    case "video":
      return "视频生成";
    case "rerank":
      return "重排序";
    default:
      return "未知模态";
  }
});

const currentState = computed<any>({
  get() {
    switch (modality.value) {
      case "llm":
        return llm;
      case "image":
        return image;
      case "embedding":
        return embedding;
      case "audio_tts":
        return audioTTS;
      case "audio_asr":
        return audioASR;
      case "video":
        return video;
      case "rerank":
        return rerank;
      default:
        return llm;
    }
  },
  set(_v) {
    // 保持为对象引用，不整体替换
  },
});

/**
 * ProviderModelForm 的 Model 下拉选项：从后端获取
 */
const modelOptions = computed(() => aiSettingsStore.models ?? []);

async function onProviderChanged(nextProvider?: string) {
  const provider = nextProvider ?? currentState.value.provider;
  const currentModality = modality.value;

  // 关键：参数不全就短路，避免 400 错误
  if (!provider || !currentModality) {
    aiSettingsStore.models = [];
    return;
  }

  try {
    await aiSettingsStore.fetchModels(provider, currentModality, env.value);
    const models = aiSettingsStore.models ?? [];
    if (models.length && !models.includes(currentState.value.model)) {
      currentState.value.model = models[0];
    }
  } catch (error) {
    console.error("获取模型列表失败:", error);
    aiSettingsStore.models = [];
  }
}

/**
 * 选项集合（传给 ModalityParamsForm）
 */
const imageSizeOptions = ["256x256", "512x512", "1024x1024"];
const imageQualityOptions = ["standard", "hd"];
const imageFormatOptions = ["png", "jpeg", "webp"];
const truncateOptions = ["none", "start", "end"];
const videoResolutionOptions = ["720p", "1080p", "4k"];

// 新增音频TTS选项
const voiceOptions = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"];
const audioFormatOptions = ["mp3", "opus", "aac", "flac"];
const audioQualityOptions = ["standard", "hd"];

// 新增音频ASR选项
const languageOptions = ["auto", "zh", "en", "ja", "ko", "es", "fr", "de"];
const responseFormatOptions = ["json", "text", "srt", "verbose_json", "vtt"];

// 新增重排序选项
const topKOptions = [5, 10, 20, 50, 100];

/**
 * 保存/重置/测试（接入后端 API）
 */
const saving = computed(() => aiSettingsStore.saving);
const lastTestMessage = computed(() => aiSettingsStore.lastTestMessage);

async function saveSettings() {
  try {
    const currentConfig = currentState.value;

    const payload: SaveSettingsPayload = {
      modality: modality.value,
      provider: currentConfig.provider,
      model: currentConfig.model,
      label: `${modality.value}-${currentConfig.provider}`,
      defaults: {
        maxTokens: currentConfig.maxTokens || 4096,
        stream:
          currentConfig.stream !== undefined ? currentConfig.stream : true,
        temperature: currentConfig.temperature || 0.7,
        topP: currentConfig.topP || 1,
      },
      credentials: {
        name: `${currentConfig.provider.toLowerCase()}-${env.value}`,
        provider: currentConfig.provider.toLowerCase(),
        authScheme: "bearer",
        data: {
          api_key: currentConfig.apiKey || "",
          base_url: currentConfig.baseURL || "",
          organization: currentConfig.organization || "",
          region: currentConfig.region || "",
          azure_deployment: currentConfig.azureDeployment || "",
        },
      },
    };

    await aiSettingsStore.saveSettings(payload);
  } catch (error) {
    console.error("保存设置失败:", error);
  }
}

async function resetSettings() {
  const resetMap: Record<Modality, { provider: string; model: string }> = {
    llm: { provider: "OpenAI", model: "gpt-4o-mini" },
    image: { provider: "OpenAI", model: "dall-e-3" },
    embedding: { provider: "OpenAI", model: "text-embedding-3-small" },
    audio_tts: { provider: "OpenAI", model: "tts-1" },
    audio_asr: { provider: "OpenAI", model: "whisper-1" },
    video: { provider: "OpenAI", model: "sora-preview" },
    rerank: { provider: "OpenAI", model: "text-embedding-3-large" },
  };
  const cur = currentState.value as BaseConn;
  const def = resetMap[modality.value];

  // 先设置 provider
  cur.provider = def.provider;
  // 拉取对应的模型列表
  await onProviderChanged(def.provider);
  // 最后设置默认模型
  cur.model = def.model;

  aiSettingsStore.lastTestMessage = "已恢复默认（当前模态）。";
}

async function testConnection() {
  try {
    const config = currentState.value;
    await aiSettingsStore.testConnection(config.provider, {
      api_key: config.apiKey,
      base_url: config.baseURL,
      organization: config.organization,
      region: config.region,
    });
  } catch (error) {
    console.error("连接测试失败:", error);
  }
}

async function testQuickCall() {
  try {
    const config = currentState.value;
    await aiSettingsStore.testQuickCall(config.provider, config.model, {
      api_key: config.apiKey,
      base_url: config.baseURL,
      organization: config.organization,
      region: config.region,
    });
  } catch (error) {
    console.error("快速调用测试失败:", error);
  }
}
// 页面初始化
onMounted(async () => {
  try {
    await aiSettingsStore.initialize(); // 保证 profiles/credentials 有值（至少是 []）
    loadExistingConfiguration();
    await onProviderChanged(); // 这里内部已做短路
  } catch (error) {
    console.error("初始化AI设置页面失败:", error);
  }
});

// 加载现有配置
function loadExistingConfiguration() {
  const profile =
    aiSettingsStore.getProfileByModality?.(modality.value) ?? null;
  const credential = profile
    ? (aiSettingsStore.getCredentialByProvider?.(profile.provider) ?? null)
    : null;

  if (!profile || !credential) return; // 数据不齐就直接返回

  const config = currentState.value;

  // profile.defaults 可能不存在，全部兜底
  const d = profile.defaults ?? {};
  config.provider = profile.provider ?? config.provider;
  config.model = profile.model ?? config.model;
  config.maxTokens = d.maxTokens ?? config.maxTokens ?? 4096;
  config.stream = d.stream ?? config.stream ?? true;
  config.temperature = d.temperature ?? config.temperature ?? 0.7;
  config.topP = d.topP ?? config.topP ?? 1;

  // credential.data 也兜底
  const cd = credential.data ?? {};
  config.apiKey = cd.api_key ?? config.apiKey ?? "";
  config.baseURL = cd.base_url ?? config.baseURL ?? "";
  config.organization = cd.organization ?? config.organization ?? "";
  config.region = cd.region ?? config.region ?? "";
  config.azureDeployment = cd.azure_deployment ?? config.azureDeployment;
}

// 监听 provider 改变（含初始化立即执行）
watch(
  () => currentState.value.provider,
  (p) => onProviderChanged(p),
  { immediate: true }
);

// 监听模态切换，重新加载配置
watch(modality, async () => {
  loadExistingConfiguration();
  // 模态切换时重新获取模型列表
  await onProviderChanged();
});
</script>
