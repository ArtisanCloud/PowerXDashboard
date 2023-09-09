<template>
  <div>
    <a-transfer
      :data="state.transferData"
      :default-value="props.defaultValue!"
      @change="changeCategory"
    >
      <template #source="{ data, selectedKeys, onSelect }">
        <a-tree
          :checkable="true"
          checked-strategy="child"
          :checked-keys="selectedKeys"
          :data="getTreeData(data)"
          @check="onSelect"
        />
      </template>
    </a-transfer>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, PropType, reactive, ref, watch } from 'vue';
  import {
    getCategoryTree,
    ProductCategory,
  } from '@/api/crm/product-service/category';

  const props = defineProps({
    defaultValue: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  });

  const loading = ref(false);
  const state = reactive({
    categoryTree: [] as ProductCategory[],
    transferData: [] as any[],
    loading: false,
    categoryIds: [],
  });

  const emits = defineEmits(['update:category-ids']);

  const getTransferData = (
    treeData: any[] = [],
    transferDataSource: any[] = []
  ) => {
    // console.log(treeData, transferDataSource);
    treeData.forEach((item) => {
      if (item.children) getTransferData(item.children, transferDataSource);
      else transferDataSource.push({ label: item.name, value: `${item.id}` });
    });
    // console.log(treeData, transferDataSource);
    return transferDataSource;
  };

  const getTreeData = (data: ProductCategory[] = []) => {
    const values = data.map((item: any) => item.value);

    const travel = (_treeData: any[] = []) => {
      const treeDataSource: any[] = [];
      _treeData.forEach((item: ProductCategory) => {
        // console.log(item, item.children, values.includes(item.id));
        if (item.children || values.includes(`${item.id}`)) {
          const sourceItem: any = {
            title: item.name,
            key: `${item.id}`,
            children: null,
          };
          if (item.children) {
            sourceItem.children = travel(item.children);
          }
          treeDataSource.push(sourceItem);
        }
      });
      return treeDataSource;
    };

    // console.log(state.categoryTree);
    return travel(state.categoryTree);
  };

  const fetchCategoryTree = async () => {
    loading.value = true;
    try {
      const res = await getCategoryTree({ id: 0 });
      // console.log(res.data.tree);
      state.categoryTree = res.data.tree;
      // console.log( res.data.tree, state.categoryTree);
    } finally {
      state.loading = false;
    }
  };

  const changeCategory = (e: string[]) => {
    emits('update:category-ids', e);
  };

  onMounted(async () => {
    await fetchCategoryTree();
    state.transferData = getTransferData(state.categoryTree);
    // console.log(state.transferData);
  });
</script>

<style scoped></style>
