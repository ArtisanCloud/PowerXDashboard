<template>
  <a-card>
    <h2>Product Specifics</h2>
    <div v-for="(specific, index) in state.productSpecifics" :key="index">
      <input v-model="specific.name" type="text" placeholder="Specific Name" />
      <div v-for="(option, optionIndex) in specific.options" :key="optionIndex">
        <input v-model="option.name" type="text" placeholder="Option Name" />
        <input v-model="option.isActivated" type="checkbox" /> Activated
        <button @click="removeOption(index, optionIndex)">Remove Option</button>
      </div>
      <button @click="addOption(index)">Add Option</button>
      <button @click="removeSpecific(index)">Remove Specific</button>
    </div>
    <button @click="addSpecific">Add Specific</button>
  </a-card>
</template>

<script lang="ts" setup>
  import { onMounted, reactive } from 'vue';
  import {
    listProductSpecifics,
    ProductSpecific,
  } from '@/api/crm/product-service/productSpeficic';
  import { MaxPageSize } from '@/api/common';
  import { useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import { getProduct, Product } from '@/api/crm/product-service/product';

  const router = useRouter();

  const state = reactive({
    productId: 0,
    product: {} as Product,
    productSpecifics: [] as ProductSpecific[],
    loading: false,
  });

  const addSpecific = () => {
    state.productSpecifics.push({
      productId: state.productId,
      name: '',
    });
  };
  const removeSpecific = (index: number) => {
    state.productSpecifics.splice(index, 1);
  };

  const fetchProductSpecifics = () => {
    listProductSpecifics({
      productId: state.product.id!,
      pageIndex: 0,
      pageSize: MaxPageSize,
    });
  };

  const refreshProductSpecifics = () => {
    fetchProductSpecifics();
  };

  const addOption = (specificIndex: number) => {
    state.productSpecifics[specificIndex].options?.push({
      productSpecificId: specificIndex, // Assign a unique ID here
      name: '',
      isActivated: false,
    });
  };

  const removeOption = (specificIndex: number, optionIndex: number) => {
    state.productSpecifics[specificIndex].options?.splice(optionIndex, 1);
  };

  const fetchProduct = async (productId: number) => {
    const res = await getProduct({
      productId,
    });

    state.product = res.data;
  };

  onMounted(async () => {
    const { query } = useRouter().currentRoute.value;
    const productId = Number(query.productId);
    // console.log(priceBookId);
    if (!productId || productId <= 0) {
      Message.error('请先选择正确的产品');
      await router.push({
        name: 'ProductService',
      });
      return;
    }

    await fetchProduct(productId);

    refreshProductSpecifics();
  });
</script>

<style scoped></style>
