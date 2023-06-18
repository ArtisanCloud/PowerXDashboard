<template>
  <div style="display: grid; place-items: center">
    <a-steps
      style="width: 600px; padding-top: 40px"
      changeable
      :current="state.currentStep"
      @change="setCurrent"
    >
      <!--选择产品-->
      <a-step description="选择你要添加配置的产品，可以搜素">选配产品</a-step>

      <!-- 配置价格 -->
      <a-step description="为选中的产品，进行价格配置">配置价格</a-step>
    </a-steps>
    <div
      :style="{
        width: '100%',
        height: '800px',
        textAlign: 'center',
        background: 'var(--color-bg-2)',
        color: '#C2C7CC',
      }"
    >
      <div :style="divStyle(1)">
        <product-search-select @on-selected-items="onSelectedProducts" />
      </div>

      <div :style="divStyle(2)">
        <a-table
          :data="formModel"
          style="width: 100%"
          row-key="id"
          :expandable="expandable"
          column-resizable
          :bordered="{ cell: true }"
          :columns="columns"
        >
          <template #unitPirce="{ rowIndex }">
            <a-input-number v-model="formModel[rowIndex].unitPrice" />
          </template>
          <template #status="{ rowIndex }">
            <a-checkbox v-model="formModel[rowIndex].isActive">激活</a-checkbox>
          </template>
          <template #listPrice="{ rowIndex }">
            <a-input-number v-model="formModel[rowIndex].listPrice" />
          </template>
        </a-table>
      </div>
      <a-space size="large" style="margin-bottom: 40px">
        <a-button
          type="secondary"
          :disabled="state.currentStep <= Step1"
          @click="onPrev"
        >
          <IconLeft /> 上一步
        </a-button>
        <a-button
          :type="state.currentStep === Step2 ? 'primary' : 'secondary'"
          @click="onNext"
        >
          {{ state.currentStep === Step2 ? '提交' : '下一步' }}
          <IconRight v-if="state.currentStep < Step2" />
        </a-button>
      </a-space>
    </div>
  </div>
</template>

<script lang="tsx" setup>
  import { PropType, reactive, ref } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import {
    createPriceBookEntry,
    PriceBookEntry,
  } from '@/api/crm/product-service/priceBookEntry';
  import ProductSearchSelect from '@/views/crm/product-service/product/components/product-search-select.vue';
  import { Product } from '@/api/crm/product-service/product';
  import SKUEntryListTable from '@/views/crm/product-service/price-book-entry/components/sku-entry-list-table.vue';
  import { PriceBook } from '@/api/crm/product-service/priceBook';

  const emits = defineEmits(['submitSuccess', 'submitFailed', 'update:id']);

  const Step1 = 1;
  const Step2 = 2;
  const StepSubmit = 3;

  const props = defineProps({
    priceBook: {
      type: Object as PropType<PriceBook>,
      default() {
        return {};
      },
    },
  });

  const formModel = ref([] as PriceBookEntry[]);

  const state = reactive({
    currentStep: Step1,
    selectedProductList: [] as Product[],
    submitLoading: false,
  });

  const columns = [
    {
      title: '产品名称',
      dataIndex: 'productName',
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      slotName: 'status',
    },
    {
      title: '交易价格',
      dataIndex: 'unitPrice',
      width: 150,
      slotName: 'unitPrice',
    },
    {
      title: '零售价格',
      dataIndex: 'unitPrice',
      width: 150,
      slotName: 'unitPrice',
    },
    {
      title: 'SPU',
      dataIndex: 'spu',
    },
  ];

  const expandable = reactive({
    title: '展开数据项',
    width: 100,
    defaultExpandAllRows: true,
    expandedRowRender: (product: any) => {
      // console.log(product);
      if (product.skuEntries && product.skuEntries.length > 0) {
        const tbItems = <SKUEntryListTable skuEntryList={product.skuEntries} />;

        return tbItems;
      }
      return null;
    },
  });

  const divStyle = (index: number) => {
    return {
      display: index === state.currentStep ? 'block' : 'none',
      paddingTop: '20px',
      // border: '1px dashed red',
      justifyContent: 'center',
      width: '100%',
      marginBottom: '20px',
    };
  };

  const onSubmit = async () => {
    console.log(123);
    if (state.submitLoading) {
      return;
    }

    state.submitLoading = true;
    createPriceBookEntry(formModel.value)
      .then(() => {
        Message.success('创建成功');
        emits('submitSuccess');
      })
      .catch(() => {
        emits('submitFailed');
      })
      .finally(() => {
        state.submitLoading = false;
      });
  };
  const onPrev = () => {
    state.currentStep = Math.max(Step1, state.currentStep - 1);
  };

  const onNext = () => {
    if (state.currentStep + 1 > 2) {
      onSubmit();
    }
    state.currentStep = Math.min(Step2, state.currentStep + 1);
  };

  const setCurrent = (current: number) => {
    state.currentStep = current;
  };

  const mapSelectProductsToEntries = () => {
    formModel.value = [];
    for (let i = 0; i < state.selectedProductList.length; i += 1) {
      const product = state.selectedProductList[i];
      const entry = {
        productName: product.name,
        spu: product.spu,
        priceBookId: props.priceBook.id!,
        productId: product.id!,
        unitPrice: 0.0,
        listPrice: 0.0,
        isActive: false,
        skuEntries: [],
      } as PriceBookEntry;

      if (product.activePriceBookEntry) {
        entry.unitPrice = product.activePriceBookEntry.unitPrice;
        entry.listPrice = product.activePriceBookEntry.listPrice!;
        entry.isActive = true;
      }
      if (product.skus && product.skus.length > 0) {
        for (let j = 0; j < product.skus.length; j += 1) {
          const sku = product.skus[j];
          const skuEntry = {
            productName: product.name,
            spu: product.spu,
            skuNo: sku.skuNo,
            priceBookId: props.priceBook.id!,
            productId: product.id!,
            unitPrice: sku.unitPrice,
            listPrice: sku.listPrice,
            isActive: sku.isActive,
          };
          entry.skuEntries?.push(skuEntry);
        }
      }

      // console.log(entry);
      formModel.value.push(entry);
    }
  };

  const onSelectedProducts = (products: Product[]) => {
    state.selectedProductList = products;
    // console.log('onSelectedProducts:', state.selectedProductList);
    mapSelectProductsToEntries();
    // console.log(state.selectedProductList);
  };

  // onMounted(() => {  });
</script>
