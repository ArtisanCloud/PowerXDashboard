<template>
  <a-select
    :model-value="props.modelValue"
    :options="options.employee"
    :field-names="{ label: 'name', value: 'id' }"
    :disabled="props.disabled"
    allow-search
    allow-clear
    multiple
    @change="
      (v) => {
        emits('update:modelValue', v);
      }
    "
    @search="
      (v) => {
        fetch([], v);
      }
    "
  ></a-select>
</template>

<script lang="ts" setup>
  import { Employee, listEmployees } from '@/api/employee';
  import { onMounted, PropType, reactive } from 'vue';

  const props = defineProps({
    modelValue: {
      type: Array as PropType<number[]>,
      default() {
        return [];
      },
    },
    disabled: Boolean,
  });

  const emits = defineEmits(['update:modelValue']);
  const options = reactive({
    employee: [] as Employee[],
  });

  function fetch(ids: number[], likeName = '') {
    listEmployees({ ids, likeName, pageIndex: 1, pageSize: 10 }).then((res) => {
      options.employee = res.data.list;
    });
  }

  onMounted(() => {
    fetch(props.modelValue);
  });
</script>

<style scoped></style>
