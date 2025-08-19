<script setup lang="ts">
const props = defineProps<{ message?: string }>();
</script>

<template>
  <UModal
    :title="undefined"
    :close="false"
    :dismissible="false"
    :overlay="true"
    fullscreen
    :transition="false"
  >
    <template #body>
      <div class="h-svh w-svw grid place-items-center">
        <div
          class="flex items-center gap-3 rounded-xl bg-white/95 px-5 py-4 shadow"
        >
          <span
            class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-transparent"
          />
          <span class="text-neutral-900">{{ props.message ?? "加载中…" }}</span>
        </div>
      </div>
    </template>
  </UModal>
</template>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
