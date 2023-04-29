<template>
  <a-select
    :model-value="props.modelValue"
    :options="options.customer"
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
  import { Customer, listCustomers } from '@/api/crm/customer-domain/customer';
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
    customer: [] as Customer[],
  });

  function fetch(ids: number[], likeName = '') {
    listCustomers({ ids, likeName, pageIndex: 1, pageSize: 10 }).then((res) => {
      options.customer = res.data.list;
    });
  }

  onMounted(() => {
    fetch(props.modelValue);
  });
</script>

<style scoped></style>
