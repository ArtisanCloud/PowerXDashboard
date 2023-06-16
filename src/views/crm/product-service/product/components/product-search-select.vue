<template>
  <a-space
    direction="vertical"
    fill
    style="display: flex; justify-content: center"
  >
    <div style="margin-top: 20px; width: 100%; /*border: #6b1111 1px dashed*/">
      <a-select
        :model-value="props.modelValue"
        :options="options.product"
        :field-names="{ label: 'name', value: 'id' }"
        :disabled="props.disabled"
        allow-search
        allow-clear
        multiple
        placeholder="请选择产品"
        style="width: 50%"
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
    </div>
    <div
      style="
        display: flex;
        justify-content: center;
        width: 100%;
        /*border: #753939 1px dashed;*/
        margin-bottom: 20px;
      "
    >
      <a-table style="width: 70%"></a-table>
    </div>
  </a-space>
</template>

<script lang="ts" setup>
  import { onMounted, PropType, reactive } from 'vue';
  import { Product, listProducts } from '@/api/crm/product-service/product';

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
    product: [] as Product[],
  });

  function fetch(ids: number[], likeName = '') {
    listProducts({ ids, likeName, pageIndex: 1, pageSize: 10 }).then((res) => {
      options.product = res.data.list;
    });
  }

  onMounted(() => {
    fetch(props.modelValue);
  });
</script>

<style scoped></style>
