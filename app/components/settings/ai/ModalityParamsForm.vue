<template>
  <div class="space-y-4">
    <!-- LLM 参数 -->
    <UForm v-if="activeModality === 'llm'" :state="llm" class="space-y-4">
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
          <UInput v-model.number="llm.maxTokens" type="number" min="1" />
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
        <span class="text-sm text-[var(--text-secondary)]">流式输出</span>
      </div>
    </UForm>

    <!-- 图像 参数 -->
    <UForm
      v-else-if="activeModality === 'image'"
      :state="image"
      class="space-y-4"
    >
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm mb-1 text-[var(--text-secondary)]"
            >尺寸</label
          >
          <USelect
            v-model="image.size"
            :items="imageSizeOptions"
            icon="i-heroicons-photo"
          />
        </div>
        <div>
          <label class="block text-sm mb-1 text-[var(--text-secondary)]"
            >质量</label
          >
          <USelect
            v-model="image.quality"
            :items="imageQualityOptions"
            icon="i-heroicons-sparkles"
          />
        </div>
        <div>
          <label class="block text-sm mb-1 text-[var(--text-secondary)]"
            >输出格式</label
          >
          <USelect
            v-model="image.format"
            :items="imageFormatOptions"
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
    </UForm>

    <!-- Embedding 参数 -->
    <UForm
      v-else-if="activeModality === 'embedding'"
      :state="embedding"
      class="space-y-4"
    >
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm mb-1 text-[var(--text-secondary)]"
            >维度</label
          >
          <UInput v-model.number="embedding.dimensions" type="number" min="8" />
        </div>
        <div>
          <label class="block text-sm mb-1 text-[var(--text-secondary)]"
            >截断策略</label
          >
          <USelect
            v-model="embedding.truncate"
            :items="truncateOptions"
            icon="i-heroicons-scissors"
          />
        </div>
        <div>
          <label class="block text-sm mb-1 text-[var(--text-secondary)]"
            >批量大小</label
          >
          <UInput v-model.number="embedding.batch" type="number" min="1" />
        </div>
      </div>
    </UForm>

    <!-- 视频 参数 -->
    <UForm
      v-else-if="activeModality === 'video'"
      :state="video"
      class="space-y-4"
    >
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm mb-1 text-[var(--text-secondary)]"
            >分辨率</label
          >
          <USelect
            v-model="video.resolution"
            :items="videoResolutionOptions"
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
          <UInput v-model.number="video.maxDurationSec" type="number" min="1" />
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
    </UForm>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  activeModality: "llm" | "image" | "embedding" | "video";
  llm: {
    temperature: number;
    maxTokens: number;
    topP: number;
    stream: boolean;
  };
  image: { size: string; quality: string; format: string; promptHint: string };
  embedding: { dimensions: number; truncate: string; batch: number };
  video: {
    resolution: string;
    fps: number;
    maxDurationSec: number;
    promptHint: string;
  };
  imageSizeOptions?: string[];
  imageQualityOptions?: string[];
  imageFormatOptions?: string[];
  truncateOptions?: string[];
  videoResolutionOptions?: string[];
}>();

const {
  activeModality,
  llm,
  image,
  embedding,
  video,
  imageSizeOptions = ["256x256", "512x512", "1024x1024"],
  imageQualityOptions = ["standard", "hd"],
  imageFormatOptions = ["png", "jpeg", "webp"],
  truncateOptions = ["none", "start", "end"],
  videoResolutionOptions = ["720p", "1080p", "4k"],
} = toRefs(props);
</script>
