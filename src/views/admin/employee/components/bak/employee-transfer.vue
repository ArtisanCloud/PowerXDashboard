<template>
  <!--  <a-transfer v-model="value" :data="data"> </a-transfer>-->
</template>

<script lang="ts" setup>
  // import { computed, onMounted, PropType, reactive, ref } from 'vue';
  // import {
  //   Employee,
  //   GetEmployeeOptionsReply,
  //   listEmployees,
  // } from '@/api/employee';
  // import { TransferItem } from '@arco-design/web-vue/es/transfer/interface';
  //
  // const prop = defineProps({
  //   modelValue: {
  //     type: Array as PropType<Array<number>>,
  //     default() {
  //       return [];
  //     },
  //   },
  // });
  //
  // const emit = defineEmits(['update:modelValue']);
  //
  // const option = ref({} as GetEmployeeOptionsReply);
  //
  // const data = computed(() => {
  //   const items = [] as TransferItem[];
  //   option.value.forEach((item: any) => {
  //     items.push({
  //       label: item.name,
  //       value: item.id.toString(),
  //       disabled: false,
  //     });
  //   });
  //   return items;
  // });
  //
  // const value = computed({
  //   get: () => {
  //     const keys = [] as string[];
  //     prop.modelValue?.forEach((item: number) => {
  //       keys.push(item.toString());
  //     });
  //     return keys;
  //   },
  //   set: (v) => {
  //     const values = [] as number[];
  //     v.forEach((item) => {
  //       values.push(parseInt(item, 10));
  //     });
  //     emit('update:modelValue', values);
  //   },
  // });
  //
  // console.log(value);
  //
  // onMounted(() => {
  //   listEmployees({}).then((res) => {
  //     option.value.employee = res.data.list;
  //   });
  // });
</script>

<style scoped></style>
