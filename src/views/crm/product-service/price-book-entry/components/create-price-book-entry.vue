<template>
  <div style="display: grid; place-items: center">
    <a-steps
      style="width: 600px; padding-top: 40px"
      changeable
      :current="state.currentStep"
      @change="setCurrent"
    >
      <!--选择产品-->
      <a-step description="选择你要添加配置的产品价格手册">选择价格手册</a-step>

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
      <div :style="divStyle(Step1)">
        <a-select
          :options="state.priceBooks"
          :field-names="{ label: 'name', value: 'id' }"
          placeholder="请选择价格手册"
          style="margin-bottom: 20px; width: 600px"
          @change="onSelectedPriceBook"
        ></a-select>
        <a-table
          :data="props.product.priceBookEntries"
          style="width: 100%"
          row-key="id"
          column-resizable
          :bordered="{ cell: true }"
          :columns="columns"
          :pagination="false"
        >
          <template #status="{ record }">
            <a-checkbox v-model="record.isActive" disabled>激活</a-checkbox>
          </template>
        </a-table>
      </div>

      <div :style="divStyle(Step2)">
        <a-table
          :data="formModel"
          style="width: 100%"
          row-key="id"
          :expandable="expandable"
          column-resizable
          :bordered="{ cell: true }"
          :columns="columns"
        >
          <template #unitPrice="{ record }">
            <a-input-number v-model="record.unitPrice" />
          </template>
          <template #status="{ record }">
            <a-checkbox v-model="record.isActive">激活</a-checkbox>
          </template>
          <template #listPrice="{ record }">
            <a-input-number v-model="record.listPrice" />
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
  import { onMounted, PropType, reactive, ref } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import {
    configPriceBookEntry,
    PriceBookEntry,
  } from '@/api/crm/product-service/priceBookEntry';
  import { Product } from '@/api/crm/product-service/product';
  import SKUEntryListTable from '@/views/crm/product-service/price-book-entry/components/sku-entry-list-table.vue';
  import {
    listPriceBooks,
    PriceBook,
  } from '@/api/crm/product-service/priceBook';
  import { MaxPageSize } from '@/api/common';
  import { getObjectsByIds } from '@/utils/array';

  const emits = defineEmits(['submitSuccess', 'submitFailed', 'update:id']);

  const Step1 = 1;
  const Step2 = 2;
  // const StepSubmit = 3;

  const props = defineProps({
    product: {
      type: Object as PropType<Product>,
      default() {
        return {};
      },
    },
  });

  const formModel = ref([] as PriceBookEntry[]);

  const state = reactive({
    currentStep: Step1,
    selectedPriceBook: {} as PriceBook,
    submitLoading: false,
    priceBooks: [] as PriceBook[],
  });

  const columns = [
    {
      title: '产品价格手册',
      dataIndex: 'priceBookName',
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
      dataIndex: 'listPrice',
      width: 150,
      slotName: 'listPrice',
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
      padding: '20px',
      // border: '1px dashed red',
      justifyContent: 'center',
      width: '100%',
      marginBottom: '20px',
    };
  };

  const onSubmit = async () => {
    if (state.submitLoading) {
      return;
    }

    state.submitLoading = true;
    configPriceBookEntry({ priceBookEntries: formModel.value })
      .then(() => {
        Message.success('配置成功');
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
    console.log(state.currentStep, state.selectedPriceBook.id);
    if (state.currentStep === Step1 && !state.selectedPriceBook.id) {
      Message.error('请选择一个价格手册');
      return;
    }
    if (state.currentStep + 1 > Step2) {
      onSubmit();
    }
    state.currentStep = Math.min(Step2, state.currentStep + 1);
  };

  const setCurrent = (current: number) => {
    state.currentStep = current;
  };

  const mapSelectProductsToEntries = () => {
    formModel.value = [];
    const { product } = props;
    const entry = {
      productName: product.name,
      spu: product.spu,
      priceBookId: state.selectedPriceBook.id ?? 0,
      productId: product.id ?? 0,
      unitPrice: 0.0,
      listPrice: 0.0,
      isActive: false,
      skuEntries: [],
    } as PriceBookEntry;

    if (product.activePriceBookEntry) {
      entry.unitPrice = product.activePriceBookEntry.unitPrice;
      entry.listPrice = product.activePriceBookEntry.listPrice ?? 0;
      entry.isActive = true;
    }

    if (product.skus && product.skus.length > 0) {
      for (let j = 0; j < product.skus.length; j += 1) {
        const sku = product.skus[j];
        const skuEntry = {
          productName: product.name,
          spu: product.spu,
          skuNo: sku.skuNo,
          priceBookId: state.selectedPriceBook.id ?? 0,
          productId: product.id ?? 0,
          skuId: sku.id ?? 0,
          unitPrice: sku.unitPrice,
          listPrice: sku.listPrice,
          isActive: sku.isActive,
        };
        entry.skuEntries?.push(skuEntry);
      }
    }
    formModel.value = [];
    formModel.value.push(entry);
    // console.log(entry);
  };

  const onSelectedPriceBook = (book: any) => {
    const selectedPriceBooks: PriceBook[] = getObjectsByIds(state.priceBooks, [
      book,
    ]);
    if (selectedPriceBooks.length > 0) {
      state.selectedPriceBook = selectedPriceBooks.pop() as PriceBook;
      mapSelectProductsToEntries();
    }
  };

  const fetchPriceBooks = async () => {
    const res = await listPriceBooks({ pageSize: MaxPageSize });
    state.priceBooks = res.data.list;
  };

  onMounted(() => {
    // console.log(props.product?.name);
    if (!props.product) {
      Message.error('产品信息无效');
    } else {
      fetchPriceBooks();
    }
  });
</script>
