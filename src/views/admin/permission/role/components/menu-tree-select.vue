<template>
  <a-tree v-model:checked-keys="checked" :data="data" checkable />
</template>

<script lang="ts" setup>
  import { RouteRecordNormalized } from 'vue-router';
  import { computed, PropType } from 'vue';
  import { menuRoutes } from '@/router/routes';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  const prop = defineProps({
    modelValue: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  });

  const emit = defineEmits(['update:modelValue']);

  const checked = computed({
    get() {
      return prop.modelValue;
    },
    set(value) {
      emit('update:modelValue', value);
    },
  });

  function getTreeData(routes: RouteRecordNormalized[]): any[] {
    return routes.map((route) => ({
      title: t(route.meta.locale as string),
      key: route.name,
      children: route.children?.length
        ? getTreeData(route.children as RouteRecordNormalized[])
        : [],
    }));
  }

  const data = computed(() => {
    return getTreeData(menuRoutes);
  });
</script>
